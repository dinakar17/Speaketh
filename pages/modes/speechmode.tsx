import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { toast } from "react-hot-toast";
import Draggable from "react-draggable";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

import SpeechMode from "@/components/SpeechModePage/SpeechMode ";
import { translateSpeechToText } from "@/utils/WhisperAPI ";
import {
  getRandomFact,
  preprocessMarkdown,
} from "@/utils/helpers ";
import { generateContent, generateGPT3Response } from "@/utils/Gpt3API ";
import { AudioAnalysisDialog } from "@/components/loaders/Loaders ";
import Welcome from "@/components/SpeechModePage/Welcome ";

const OneMinSpeechMode: React.FC = () => {
  const [start, setStart] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAudioDialog, setOpenAudioDialog] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const [uploaded, setUploaded] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [convertedText, setConvertedText] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [randomFact, setRandomFact] = useState<string | null>(null);

  const handleClick = () => {
    setOpenDialog(true);
  };

  const handleClose = async (fromButton: boolean = false) => {
    if (fromButton) {
      setLoading(true);
      
      await generateContent(
        "Write just one random topic for the user to speak on and a really short description giving hints to user on what they could speak on. The format should be Topic: <topic> Description: <description>",
        setTitle
      );

      setStart(true);
      setLoading(false);
    }
    setOpenDialog(false);
  };

  const startAnalyzing = async () => {
    if (!audioFile) {
      toast.error("Please upload an audio file first.");
      return;
    }
    // Todo: Handle audio files less than 30 seconds

    // Show the dialog while analyzing the audio
    setOpenAudioDialog(true);
    setRandomFact(getRandomFact()); // Set the random fact only once when the dialog is opened

    const textData: any = await translateSpeechToText(formData);
    setTimeout(() => {
      setOpenAudioDialog(false);
    }, 1000);

    if (textData.error) {
      toast.error("Something went wrong. Please try again later.");
      return;
    }

    setConvertedText(textData.text);

    const prompter = (text: string) => {
      return `Give me a list of 3 points (numbered format based i.e., 1. 2. 3.) on the text ${text} which is a speech based on the topic ${title}.\n The first point is a paragraph on how relevant the speech is to the topic, feedback on grammar, words choice, and sentence structure and finally suggestions on alternative words or phrases, and areas to improve upon.\n The second point is a revised version of the speech with the suggested changes.\n The third point is a paragraph on how the revised version is better than the original version.`;
    };

    const prompt = prompter(`${textData.text}`);

    setLoading(true);
    generateContent(prompt, setGeneratedContent);
    setLoading(false);
  };

  const SpeechModeProps = {
    countdown: 130,
    title,
    setAudioFile,
    setUploaded,
    setFormData,
  };

  return (
    <div className="max-w-screen-lg mx-auto flex flex-col space-y-4">
      {!start ? (
        <Welcome handleClick={handleClick} />
      ) : (
        <div className="py-4">
          <SpeechMode {...SpeechModeProps} />
          {uploaded && (
            <>
              <button
                onClick={startAnalyzing}
                disabled={loading}
                className="bg-blue-500 w-full text-white px-6 py-2 rounded mt-4"
              >
                Start Analyzing
              </button>
              <AudioAnalysisDialog
                openDialog={openAudioDialog}
                randomFact={randomFact}
              />
              {convertedText !== "" && (
                <Draggable axis="y">
                  <div className="mb-4 bg-white rounded-xl shadow-lg p-4 hover:bg-gray-100 transition cursor-copy border mx-auto max-w-screen-lg">
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
          )}
        </div>
      )}
      <Dialog
        open={openDialog}
        onClose={() => handleClose(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Tips before you get started
        </DialogTitle>
        <DialogContent>
          <ul className="list-disc list-inside text-base">
            <li>
              Be in a quiet place with no distractions. Speak clearly and
              confidently.
            </li>
            <li>Stay calm and focused, even if the topic is unfamiliar.</li>
            <li>Think of a clear structure for your speech and stick to it.</li>
            <li>
              It&apos;s ok if you are unable to give a proper speech the first time.
              Just keep trying until you get it right.
            </li>
          </ul>
        </DialogContent>
        <DialogActions>
          <button
            className="bg-blue-500 px-4 py-2 w-full rounded-md text-white"
            disabled={loading}
            onClick={() => handleClose(true)}
          >
            {loading ? (
              <div className="mx-auto animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              "Let's go"
            )}
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default OneMinSpeechMode;
