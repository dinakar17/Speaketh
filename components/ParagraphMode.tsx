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

const countDown = 10;
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
  const prompter = (text: string) => text;

  const startAnalyzing = async () => {
    if (!textAreaValue) {
      toast.error("You need to write something first.");
      return;
    }

    const prompt = prompter(`a prompt`);

    setLoading(true);
    generateContent(prompt, setGeneratedContent);
    setLoading(false);
  };

  return (
    <>
      <h1 className="flex justify-center items-center gap-4 text-3xl font-bold text-center mb-8">
        Write for a minute <Pencil fill="purple" />
      </h1>
      <div className="flex flex-col gap-4">
        <div className="">
          <h2 className="text-xl font-semibold">Your Topic is: {title} </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Talk about something about its consectetur adipiscing elit. Aliquam
            et aliquam mi. Proin quis lobortis leo, eget egestas sapien. Mauris
            eu porta justo.
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
            className="bg-blue-500 mx-auto text-white px-6 py-2 rounded mt-4"
          >
            Start Analyzing
          </button>
          {generatedContent && (
            <>
              <div className="flex flex-col gap-4 mx-auto max-w-screen-lg">
                {generatedContent
                  .substring(generatedContent.indexOf("1") + 3)
                  .split("2.")
                  .map((content, index) => {
                    return (
                      <Draggable axis="y" key={content}>
                        <div
                          className="bg-white rounded-xl shadow-lg p-4 hover:bg-gray-100 transition cursor-copy border"
                          onClick={() => {
                            navigator.clipboard.writeText(content);
                            toast("Bio copied to clipboard", {
                              icon: "✂️",
                            });
                          }}
                          key={content}
                        >
                          {index === 0 && (
                            <>
                              <h2 className="text-lg font-bold mb-1">
                                Feedback on your speech
                              </h2>
                              <p className="text-gray-600 w-full mx-auto p-2 prose prose-sm max-w-screen-xl prose-indigo md:prose-base dark:prose-invert overflow-auto">
                                <ReactMarkdown>
                                  {preprocessMarkdown(content)}
                                </ReactMarkdown>
                              </p>
                            </>
                          )}
                          {index === 1 && (
                            <>
                              <h2 className="text-lg font-bold mb-1">
                                Revised Speech with Improvements
                              </h2>
                              {content.split("3.").map((content, index) => {
                                return (
                                  <div key={content}>
                                    {index === 0 && (
                                      <p className="text-gray-600 w-full mx-auto p-2 prose prose-sm max-w-screen-xl prose-indigo md:prose-base dark:prose-invert overflow-auto">
                                        <ReactMarkdown>
                                          {preprocessMarkdown(content)}
                                        </ReactMarkdown>
                                      </p>
                                    )}
                                    {index === 1 && (
                                      <p className="text-gray-600 mt-3 w-full mx-auto p-2 prose prose-sm max-w-screen-xl prose-indigo md:prose-base dark:prose-invert overflow-auto">
                                        <ReactMarkdown>
                                          {preprocessMarkdown(content)}
                                        </ReactMarkdown>
                                      </p>
                                    )}
                                  </div>
                                );
                              })}
                            </>
                          )}
                        </div>
                      </Draggable>
                    );
                  })}
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default ParagraphMode;
