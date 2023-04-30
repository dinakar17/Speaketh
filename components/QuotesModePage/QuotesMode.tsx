import { MessageType } from "@/pages/modes/quotesmode ";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { ThreeDots } from "react-loader-spinner";
import toWav from "audiobuffer-to-wav";
import { generateGPT3Response } from "@/utils/Gpt3API ";
import { translateSpeechToText } from "@/utils/WhisperAPI ";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { preprocessMarkdown } from "@/utils/helpers ";

interface Props {
  messages: MessageType[];
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
  quote: string;
}

type InputType = "Text Input" | "Audio Input";

const Loader = () => (
  <ThreeDots
    height="20"
    width="20"
    radius="9"
    color="#ffffff"
    ariaLabel="three-dots-loading"
    visible={true}
  />
);

const extractPromptFromResponse = (response: string): string => {
  const assignmentIndex = response.indexOf("Assignment: ");
  if (assignmentIndex === -1) {
    return "";
  }
  // returns the string after 'Assignment: '
  return response.slice(assignmentIndex + "Assignment: ".length);
};

const QuotesMode = ({ messages, setMessages, quote }: Props) => {
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  const [inputType, setInputType] = useState<InputType>("Text Input");
  const recordedChunks = useRef<Blob[]>([]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleStartRecording = async () => {
    if (!navigator.mediaDevices) {
      console.error("MediaDevices API not supported in your browser");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      recorder.addEventListener("dataavailable", (e) => {
        if (e.data.size > 0) {
          recordedChunks.current.push(e.data);
        }
      });

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting the recording", error);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.addEventListener("stop", async () => {
        const audioBlob = new Blob(recordedChunks.current, {
          type: "audio/webm",
        });
        recordedChunks.current = [];

        const audioBuffer = await blobToAudioBuffer(audioBlob);
        const wavBlob = new Blob([new Uint8Array(toWav(audioBuffer))], {
          type: "audio/wav",
        });

        setAudioPreviewUrl(URL.createObjectURL(wavBlob));

        // const audioBlob = new Blob(recordedChunks.current, { type: 'audio/webm' });
        // recordedChunks.current = [];
        // setAudioPreviewUrl(URL.createObjectURL(audioBlob));
      });

      setIsRecording(false);
      mediaRecorder.stop();
    }
  };

  const blobToAudioBuffer = async (blob: Blob): Promise<AudioBuffer> => {
    const audioContext = new AudioContext();
    const arrayBuffer = await blob.arrayBuffer();
    return audioContext.decodeAudioData(arrayBuffer);
  };

  const handleSendText = async () => {
    if (!input) {
      toast.error("Please enter a message");
      return;
    }

    // Add the user's message to the chat
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: input, isUser: true },
    ]);
    setInput("");

    // Add a loader for the GPT-3 response
    setMessages((prev) => [
      ...prev,
      { id: Date.now() + 1, text: "", isUser: false, isLoading: true },
    ]);

    const appendGpt3Response = (response: string) => {
      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];

        if (lastMessage && !lastMessage.isUser) {
          // Update the last GPT-3 message with the new response chunk
          return prev.map((message) =>
            message.id === lastMessage.id
              ? { ...message, text: message.text + response, isLoading: false }
              : message
          );
        } else {
          // If the last message is from the user, create a new GPT-3 message
          return [
            ...prev,
            { id: Date.now(), text: response, isUser: false, isLoading: false },
          ];
        }
      });
    };
    // Extract the prompt from the previous GPT-3 response
    const previousGPT3Response = messages[messages.length - 1]?.text;
    const assignment = extractPromptFromResponse(previousGPT3Response);

    const prompt = `Assignment: ${assignment}\n\nMy response: ${input}\n\n Give me feedback on grammar, word choice, and style. Give me a one-liner sentence assignment based on  Quote: "${quote}" and my response. Keep it short and simple. \n\nFeedback: \n\nAssignment: `;
    // Send transcribedText to GPT-3 and get the response
    await generateGPT3Response(prompt, appendGpt3Response);
  };

  const handleSendAudio = async () => {
    if (!audioPreviewUrl) return;

    // Add a loader for the user's input while the speech is converted to text by Whisper
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: "", isUser: true, isLoading: true },
    ]);

    // Convert the audioPreviewUrl back to Blob
    const response = await fetch(audioPreviewUrl);
    const audioBlob = await response.blob();

    const file = new File([audioBlob], "audio.wav", {
      type: "audio/wav",
    });

    const data = new FormData();
    data.append("file", file);
    data.append("model", "whisper-1");
    data.append("language", "en");

    // Send the audioBlob to Whisper API and get the transcribed text
    const textData = await translateSpeechToText(data);

    if (textData.error) {
      console.log("Error", textData.error);
      toast.error(`${textData.error.message}`);
      return;
    }
    const transcribedText = textData.text;

    setMessages((prev) =>
      prev.map((message) =>
        message.isLoading && message.isUser
          ? { ...message, text: transcribedText, isLoading: false }
          : message
      )
    );

    setMessages((prev) => [
      ...prev,
      { id: Date.now() + 1, text: "", isUser: false, isLoading: true },
    ]);

    const appendGpt3Response = (response: string) => {
      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];

        if (lastMessage && !lastMessage.isUser) {
          // Update the last GPT-3 message with the new response chunk
          return prev.map((message) =>
            message.id === lastMessage.id
              ? { ...message, text: message.text + response, isLoading: false }
              : message
          );
        } else {
          // If the last message is from the user, create a new GPT-3 message
          return [
            ...prev,
            { id: Date.now(), text: response, isUser: false, isLoading: false },
          ];
        }
      });
    };

    // Extract the prompt from the previous GPT-3 response
    const previousGPT3Response = messages[messages.length - 1]?.text;
    const assignment = extractPromptFromResponse(previousGPT3Response);

    const prompt = `${assignment}\n\nMy response: ${input}\n\n Give me feedback on grammar, word choice, and style. Give me a one-liner sentence assignment based on ${quote} and my response. Keep it short and simple. \n\nFeedback:<feedback> \n\nImprovised response: <improvised response> \n\nAssignment:<assignment>`;

    // Send transcribedText to GPT-3 and get the response
    await generateGPT3Response(prompt, appendGpt3Response);
    setAudioPreviewUrl(null);
  };

  return (
    <div className="relative h-screen flex flex-col">
      <div className="flex-1 overflow-y-auto pb-16">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`py-2 px-4 my-2 rounded-lg ${
              message.isUser
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-300 text-gray-900 mr-auto"
            }`}
          >
            {message.isLoading ? (
              <Loader />
            ) : (
              <ReactMarkdown>{preprocessMarkdown(message.text)}</ReactMarkdown>
            )}
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>
      <div className="p-4 absolute w-full bg-gray-200 bottom-0">
        <div className="flex items-center">
          <select
            value={inputType}
            onChange={(e) => setInputType(e.target.value as InputType)}
            className="mr-2 p-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          >
            <option>Text Input</option>
            <option>Audio Input</option>
          </select>
          {inputType === "Text Input" && (
            <div className="flex items-center flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" ? handleSendText() : null
                }
                className="flex-1 mr-2 p-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleSendText}
                className="py-1 px-3 bg-blue-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Send
              </button>
            </div>
          )}
          {inputType === "Audio Input" && (
            <div className="flex flex-col items-center w-full mx-auto">
              {audioPreviewUrl && (
                <div className="flex justify-center items-center mb-2">
                  <audio
                    src={audioPreviewUrl}
                    controls
                    className="mr-2"
                  ></audio>
                  <button
                    onClick={handleSendAudio}
                    className="py-1 px-3 bg-green-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                  >
                    Send
                  </button>
                </div>
              )}
              <button
                onMouseDown={handleStartRecording}
                onMouseUp={handleStopRecording}
                onTouchStart={handleStartRecording}
                onTouchEnd={handleStopRecording}
                className="py-2 px-4 bg-blue-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                {isRecording ? "Release to Send" : "Hold to Record"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuotesMode;
