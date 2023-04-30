import React, { useState } from "react";
import { toast } from "react-hot-toast";
import Timer from "./Timer";
import { AudioAnalysisDialog } from "./loaders/Loaders";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { getRandomFact, preprocessMarkdown } from "@/utils/helpers ";
import Draggable from "react-draggable";
import { translateSpeechToText } from "@/utils/WhisperAPI ";
import { generateContent } from "@/utils/Gpt3API ";
import { Pencil } from "lucide-react";

interface ParagraphModeProps {
  title: string;
  start: boolean;
}

const splitString = (str: string) => {
  // find the word "Description:" and split the string into two parts
  const splitIndex = str.indexOf("Description:");
  const firstPart = str.slice(0, splitIndex);
  const secondPart = str.slice(splitIndex).trim();
  return [firstPart, secondPart];
};

const countDown = 40;
const characterLimit = 1000;

const ParagraphMode = (props: ParagraphModeProps) => {
  const { title, start } = props;
  const [textAreaValue, setTextAreaValue] = useState("");
  const [isLimitExceeded, setIsLimitExceeded] = useState(false);
  const [characters, setCharacters] = useState(0);
  const [countdownComplete, setCountdownComplete] = useState(false);

  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= characterLimit) {
      setTextAreaValue(value);
      setCharacters(value.length);
      setIsLimitExceeded(false);
    } else {
      setIsLimitExceeded(true);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    toast.error("Pasting text is not allowed.");
  };

  const startAnalyzing = async () => {
    if (!textAreaValue) {
      toast.error("You need to write something first.");
      return;
    }
    const prompt = `Give me a list of 3 points (numbered format based i.e., 1. 2. 3.) on the text ${textAreaValue} which is a paragraph written by me based on the topic ${title}.\n The first point is a paragraph on how relevant my writing is to the topic, feedback on grammar, words choice, and sentence structure and finally suggestions on areas to improve upon.\n The second point is a revised version of the speech with the suggested changes.\n The third point is a paragraph on how the revised version is better than the original version.`

    setLoading(true);
    generateContent(prompt, setGeneratedContent);
    setLoading(false);
  };

  return (
    <div className="py-8">
      <h1 className="flex justify-center items-center gap-4 text-3xl font-bold text-center mb-8">
        Write for 2 min <Pencil fill="purple" />
      </h1>
      <div className="flex flex-col gap-4">
      <div className="">
          <h2 className="text-xl font-semibold"> {splitString(title)[0]}</h2>
          <p className="text-gray-600 dark:text-gray-300">
            {splitString(title)[1]}
          </p>
        </div>
        <div className="flex flex-col gap-4 justify-center items-center">
          <Timer
            countdown={countDown}
            setCountdownComplete={setCountdownComplete}
          />
          <div className="w-full">
            <textarea
              value={textAreaValue}
              onChange={handleTextAreaChange}
              onPaste={handlePaste}
              disabled={countdownComplete}
              className="w-full h-64 p-4 border rounded-lg resize-none"
            />
            <div
              className={`text-right mt-2 ${
                isLimitExceeded ? "text-red-600" : ""
              }`}
            >
              {characters}/{characterLimit}
            </div>
          </div>
        </div>
      </div>
      {countdownComplete && (
        <>
          <button
            onClick={startAnalyzing}
            disabled={loading}
            className="bg-blue-500 w-full mx-auto text-white px-6 py-2 rounded my-4"
          >
            Start Analyzing
          </button>
          {generatedContent !== "" && (
              <div className="flex flex-col gap-4 mx-auto max-w-screen-lg">
                {generatedContent
                  .substring(generatedContent.indexOf("1") + 3)
                  // split based on the regex i.e., number followed by a dot followed by a space
                  .split(/\d\.\s/)
                  .map((content, index) => {
                    return (
                      <Draggable axis="y" key={content}>
                        <div
                          className="bg-white rounded-xl shadow-lg p-4 hover:bg-gray-100 transition border"
                          key={content}
                        >
                          <h2 className="text-lg font-bold mb-1">
                            {index === 0
                              ? "Feedback on your writing"
                              : index === 1
                              ? "Revised version of your writing"
                              : "How the revised version is better than the original version"}
                          </h2>
                          <p className="text-gray-600 w-full mx-auto p-2 prose prose-sm max-w-screen-xl prose-indigo md:prose-base dark:prose-invert overflow-auto">
                            <ReactMarkdown>
                              {preprocessMarkdown(content)}
                            </ReactMarkdown>
                          </p>
                        </div>
                      </Draggable>
                    );
                  })}
              </div>
            )}
        </>
      )}
    </div>
  );
};

export default ParagraphMode;
