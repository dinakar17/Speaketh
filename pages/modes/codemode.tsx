// pages/modes/codemode.tsx

import dynamic from 'next/dynamic'
import React, { useState } from "react";
import Tabs from "@/components/ui/tabs ";
import { toast } from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import Draggable from "react-draggable";
import { generateContent } from "@/utils/Gpt3API ";
import { translateSpeechToText } from "@/utils/WhisperAPI ";
import { AudioAnalysisDialog } from "@/components/loaders/Loaders ";
import { getRandomFact, preprocessMarkdown } from "@/utils/helpers ";

const CodeArea = dynamic(() => import('../../components/CodeExplainerMode/CodeArea'), { ssr: false })

const CodeMode: React.FC = () => {
  const [code, setCode] = useState<string>("");
  const [uploaded, setUploaded] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [convertedText, setConvertedText] = useState<string>("");
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [randomFact, setRandomFact] = useState<string | null>(null);


  const startAnalyzing = async () => {
    if (!audioFile) {
      toast.error("Please upload an audio file first.");
      return;
    }
    if (!code) {
      toast.error("Please paste your code first. It can't be empty.");
      return;
    }

    // Show the dialog while analyzing the audio
    setOpenDialog(true);
    setRandomFact(getRandomFact()); // Set the random fact only once when the dialog is opened

    const textData = await translateSpeechToText(formData);
    setTimeout(() => {
      setOpenDialog(false);
    }, 1000);

    if (textData.error) {
      toast.error("Something went wrong. Please try again later.");
      return;
    }

    setConvertedText(textData.text);

    const prompt =`Give me a list of 3 points (numbered format based i.e., 1. 2. 3.) on {${convertedText}} which is a speech based on the code {${code}}. The first point is a paragraph that assesses the relevance of speech in relation to the code providing feedback on word choice and sentence structure. Suggestions for alternative words or phrases are also provided. The second point is a revised speech incorporating the feedback from the first point. The third point is feedback on the revised speech.`;

    setLoading(true);
    generateContent(prompt, setGeneratedContent);
    setLoading(false);
  };

  const UploadAudioProps = {
    audioFile,
    setAudioFile,
    setFormData,
    uploaded,
    setUploaded,
  };
  const RecordAudioProps = { setAudioFile, setFormData, setUploaded };

  return (
    <div className="container mx-auto px-4 py-10 max-w-screen-xl">
      <h1 className="text-4xl font-bold text-center mb-8">Code Explanation Mode</h1>

      <div className="mb-6">
        <CodeArea code={code} setCode={setCode} />
      </div>
      <Tabs
        recordAudioProps={RecordAudioProps}
        uploadAudioProps={UploadAudioProps}
      />
      <div>
        {uploaded && (
          <>
          <div className="flex items-center justify-center">
            <button
              onClick={startAnalyzing}
              disabled={loading || openDialog}
              className="bg-blue-500 px-6 text-white py-2 rounded my-4"
            >
              Start Analyzing
            </button>
          </div>
            <>
              {/* Dialog for Whisper API progress */}
              <AudioAnalysisDialog
                openDialog={openDialog}
                randomFact={randomFact}
              />
              {/* Display converted text from audio */}
              {convertedText !== "" && (
                <Draggable axis="y">
                  <div className="mb-4 bg-white rounded-xl shadow-lg p-4 hover:bg-gray-100 transition border mx-auto max-w-screen-lg">
                    <h2 className="text-lg font-bold mt-4">Transcribed Text</h2>
                    <p className="mt-1 text-gray-600 w-full mx-auto p-2 prose prose-sm max-w-screen-xl prose-indigo md:prose-base dark:prose-invert overflow-auto">
                      {convertedText}
                    </p>
                  </div>
                </Draggable>
              )}
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
                              ? "Feedback on your speech"
                              : index === 1
                              ? "Revised version of your speech"
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
          </>
        )}
      </div>
    </div>
  );
};

export default CodeMode;
