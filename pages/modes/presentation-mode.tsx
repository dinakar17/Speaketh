import React, { useState } from "react";
import Tabs from "@/components/ui/tabs ";
import { toast } from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import Draggable from "react-draggable";
import { generateContent } from "@/utils/Gpt3API ";
import { translateSpeechToText } from "@/utils/WhisperAPI ";
import { AudioAnalysisDialog } from "@/components/loaders/Loaders ";
import { getRandomFact, preprocessMarkdown } from "@/utils/helpers ";



const PresentationMode: React.FC = () => {
  const [slideText, setSlideText] = useState<string>("");
  const [uploaded, setUploaded] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [convertedText, setConvertedText] = useState<string>("");
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [randomFact, setRandomFact] = useState<string | null>(null);

  const prompter = (slideText: string, convertedText: string) => {
    return `SlideText:
    { ${slideText} }
    
    User's Speech:
    { ${convertedText} }
    
    Scenario: The user plans to deliver the "User's Speech" to an audience while displaying the "Slide Text" on presentation slides. Your goal is to make his speech sound better by answering the following tasks to the user.
    
    Please complete the following tasks based on the content provided in the "Slide Text" and "User's Speech" sections:
    1. Assess the relevance of the "User's Speech" in relation to the "Slide Text," and provide feedback on word choice and sentence structure. Suggest alternative words or phrases when necessary. Answer by addressing him.
    2. Revise the "User's Speech" section, incorporating the feedback from task 1.
    3. Provide feedback on the revised "User's Speech" section you've written.
    
    Present your responses in a list format for each of the three tasks and directly, without any headings.
  }
    `;
  };


  const startAnalyzing = async () => {
    if (!audioFile) {
      toast.error("Please upload an audio file first.");
      return;
    }
    if (!slideText) {
      toast.error("Please paste your slide text first. It can't be empty.");
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

    const prompt = prompter(
      `${slideText}`,
      `${textData.text}`
    );

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
      <h1 className="text-4xl font-bold text-center mb-8">Presentation Mode</h1>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">
          Paste your slide text here
        </h2>
        <p className="text-gray-700 mb-2">
          Copy and paste your presentation slides text which will help us to see
          whether your speech is relevant to this or not
        </p>
        <textarea
          className="w-full h-40 border rounded shadow p-4"
          onChange={(e) => setSlideText(e.target.value)}
          value={slideText}
        />
      </div>
      <Tabs
        recordAudioProps={RecordAudioProps}
        uploadAudioProps={UploadAudioProps}
      />
      <div>
        <h2 className="text-2xl font-semibold mb-2">Upload your audio</h2>
        <p className="text-gray-700 mb-4">
          Please kindly record your audio either on your local computer or
          somewhere and upload it here
        </p>
        {uploaded && (
          <>
            <button
              onClick={startAnalyzing}
              disabled={loading}
              className="bg-blue-500 text-white px-6 py-2 rounded mt-4"
            >
              Start Analyzing
            </button>
            <>
              {/* Dialog for Whisper API progress */}
              <AudioAnalysisDialog openDialog={openDialog}  randomFact={randomFact} />
              {/* Display converted text from audio */}
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
          </>
        )}
      </div>
    </div>
  );
};

export default PresentationMode;
