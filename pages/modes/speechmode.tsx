import React, { useState } from "react";
import Image from "next/image";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { Flame } from "lucide-react";
import { toast } from "react-hot-toast";
import Draggable from "react-draggable";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

import SpeechMode from "@/components/SpeechMode ";
import Button from "@/components/ui/button ";
import { translateSpeechToText } from "@/utils/WhisperAPI ";
import {
  fetchRandomTitle,
  getRandomFact,
  preprocessMarkdown,
} from "@/utils/helpers ";
import { generateContent } from "@/utils/Gpt3API ";
import { AudioAnalysisDialog } from "@/components/loaders/Loaders ";

type ListItemProps = {
  icon: React.ReactNode;
  text: string;
};

const ListItem: React.FC<ListItemProps> = ({ icon, text }) => (
  <div className="flex">
    <div className="mr-2">{icon}</div>
    <div>{text}</div>
  </div>
);

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
      // Todo: Fetch Title and description from GPT-3
      const randomTitle = await fetchRandomTitle();
      setTitle(randomTitle);
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

    const textData = await translateSpeechToText(formData);
    setTimeout(() => {
      setOpenAudioDialog(false);
    }, 1000);

    if (textData.error) {
      toast.error("Something went wrong. Please try again later.");
      return;
    }

    setConvertedText(textData.text);

    const prompter = (text: string) => {
      return `${text}`;
    };

    const prompt = prompter(`${textData.text}`);

    setLoading(true);
    generateContent(prompt, setGeneratedContent);
    setLoading(false);
  };

  const SpeechModeProps = {
    countdown: 10,
    title,
    setAudioFile,
    setUploaded,
    setFormData,
  };

  return (
    <div className="max-w-screen-lg mx-auto flex flex-col space-y-4">
      {!start ? (
        <div className="p-8">
          <h1 className="text-3xl text-center font-bold mb-8">
            Welcome to the{" "}
            <span className="text-blue-600">Speech for a min mode</span>
          </h1>
          <div className="flex justify-center">
            <Image
              src="/images/oneminspeech.png"
              alt="Speech Mode"
              width={300}
              height={200}
            />
          </div>

          <div className="grid grid-cols-2 gap-8 mt-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Rules</h2>
              <ol className="list-decimal list-inside text-gray-800">
                <li>Click the “I am ready” button</li>
                <li>
                  The moment you press that button you’ll be presented with a
                  topic to review for 5-10 sec and a stopwatch timer.
                </li>
                <li>
                  When you feel you’re ready, start recording your speech and
                  try to complete it in under 30 sec (recording will be
                  automatically stopped if you exceed the time limit)
                </li>
                <li>
                  Click start analysis to see your results. You can also listen
                  to your speech and see the transcript.
                </li>
              </ol>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4">Perks</h2>
              <ul className="list-none list-inside text-gray-800">
                <ListItem
                  icon="🚀"
                  text="Swift Thinking: Train your mind to think on its feet."
                />
                <ListItem
                  icon="💬"
                  text="Eloquence Boost: Sharpen your verbal skills."
                />
                <ListItem
                  icon="🦸"
                  text="Confidence Builder: Face your public speaking fears."
                />
                <ListItem
                  icon="⏱️"
                  text="Time Management: Deliver speeches within a tight timeframe."
                />
                <ListItem
                  icon="📚"
                  text="Engaging Storytelling: Captivate audiences with compelling narratives."
                />
                <ListItem
                  icon="📝"
                  text="Persuasive Speaking: Convince others to see things your way."
                />
              </ul>
            </div>
          </div>

          <p className="text-xl mt-8">4 simple rules! That’s it.</p>
          <div className="flex justify-center mt-8">
            <Button
              bgcolor="bg-blue-500"
              icon={<Flame />}
              eventHandler={handleClick}
            >
              I&apos;m ready
            </Button>
          </div>
        </div>
      ) : (
        <>
          <SpeechMode {...SpeechModeProps} />
          {uploaded && (
            <>
              <button
                onClick={startAnalyzing}
                disabled={loading}
                className="bg-blue-500 text-white px-6 py-2 rounded mt-4"
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
