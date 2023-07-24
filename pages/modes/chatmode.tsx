// pages/modes/chatmode.tsx

import { useState, useEffect, useRef } from "react";
import { translateSpeechToText } from "@/utils/WhisperAPI ";
import { toast } from "react-hot-toast";
import toWav from "audiobuffer-to-wav";
import {
  chatResponse,
  generateContent,
  generateGPT3Response,
} from "@/utils/Gpt3API ";
import { ThreeDots } from "react-loader-spinner";
import { ChatGPTMessage } from "@/utils/OpenAIStream ";
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

type MessageType = {
  id: number;
  text: string;
  isUser: boolean;
  isLoading?: boolean;
};

function prompter(messages: MessageType[], systemPrompt: string) {
  const formattedMessages: ChatGPTMessage[] = [
    { role: "system", content: systemPrompt },
  ];
  console.log("messages", messages);

  messages.forEach((message, index) => {
    formattedMessages.push({
      role: message.isUser ? "user" : "assistant",
      content: message.text,
    });
  });

  return formattedMessages;
}

const ChatMode = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  const recordedChunks = useRef<Blob[]>([]);

  const [topic, setTopic] = useState("");
  const [conversationMode, setConversationMode] = useState<
    "Native Speaker" | "Grammar Correction"
  >("Native Speaker");
  const [isStarted, setIsStarted] = useState(false);

  const handleStart = () => {
    if (!topic) {
      toast.error("Please enter a topic to start a conversation", {
        position: "top-center",
        //
        style: {
          marginLeft: "20%",
        },
      });
      return;
    }
    if (conversationMode === "Native Speaker") {
      toast.success("You are now in Native Speaker mode", {
        style: { marginLeft: "20%" },
      });
    } else {
      toast.success("You are now in grammar correction mode", {
        style: { marginLeft: "20%" },
      });
    }
    // Todo: send request to GPT3 to start conversation

    setIsStarted(true);
  };

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

    const prompt = `You are an AI model that analyzes the text {${transcribedText}} and ${conversationMode === "Native Speaker" ? "tells me how a native speaker would say the same thing and give reasons why": "corrects the grammar of my text and gives feedback on areas I need to improve on"}and ask a simple and short followup question based on my text and topic: {${topic}} to continue the conversation \n\nCorrected Text:`;

    setMessages((prev) =>
      prev.map((message) =>
        message.isLoading && message.isUser
          ? { ...message, text: transcribedText, isLoading: false }
          : message
      )
    );

    // const formattedMessages = prompter(messages, `You are a helpful assistant that chats on topic: ${topic}
    //  ${conversationMode === "Grammar Correction" ? "Every single time the user sends a message, you correct the grammar of the text, give feedback on areas he needs to improve, give the correct sentence and continue the conversation." : "Every single time the user sends a message, you tell the user how a native speaker would say the same thing and give reasons why and continue the conversation."}`);

    //  // push transcribed text to formattedMessages
    //  formattedMessages.push({
    //    role: "user",
    //    content: transcribedText,
    //   });

    // console.log("formattedMessages", formattedMessages);

    // Add a loader for GPT-3's response
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

    // Send transcribedText to GPT-3 and get the response
    await generateGPT3Response(prompt, appendGpt3Response);

    // console.log("generatedContent", generatedContent);
    // // Add the GPT-3 response to the chat
    // setMessages((prev) => [
    //   ...prev,
    //   { id: Date.now() + 1, text: generatedContent, isUser: false },
    // ]);

    // Clear the audio preview
    setAudioPreviewUrl(null);
  };

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 p-4">
        <div className="mb-6">
          <label htmlFor="topic" className="block mb-1">
            Topic:
          </label>
          <textarea
            rows={3}
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-4 py-2 bg-white rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="conversation-mode" className="block mb-1">
            Conversation Mode:
          </label>
          <select
            id="conversation-mode"
            value={conversationMode}
            onChange={(e) =>
              setConversationMode(
                e.target.value as "Native Speaker" | "Grammar Correction"
              )
            }
            className="w-full px-4 py-2 bg-white rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
          >
            <option>Native Speaker</option>
            <option>Grammar Correction</option>
          </select>
        </div>
        <button
          onClick={handleStart}
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Start
        </button>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          {isStarted ? (
            messages.map((message) => (
              <div
                key={message.id}
                className={`py-2 px-4 my-2 rounded-lg ${
                  message.isUser
                    ? "bg-blue-500 text-white ml-auto"
                    : "bg-gray-300 text-gray-900 mr-auto"
                }`}
              >
                {message.isLoading ? <Loader /> : message.text}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-8">
              <h1 className="text-3xl text-center font-bold mb-8">
                Welcome to the{" "}
                <span className="text-blue-600"> Conversational AI Mode </span>{" "}
              </h1>

              <div className="grid grid-cols-2 gap-8 mt-8">
                <div className="bg-gray-100 shadow rounded-lg p-8">
                  <h2 className="text-xl font-semibold mb-4">
                    🌟 Simple steps to start improving
                  </h2>
                  <ul className="list-none list-inside text-gray-800">
                    <ListItem
                      icon="1️⃣"
                      text=" Select a conversation topic and mode"
                    />
                    <ListItem
                      icon="2️⃣"
                      text='Hit "Start" and record your message using the "Hold to Record" button'
                    />
                    <ListItem
                      icon="3️⃣"
                      text='Let go and click "Send" to submit your reply'
                    />
                    <ListItem
                      icon="4️⃣"
                      text="Get insightful feedback to learn from mistakes and enhance your skills as the conversation progresses"
                    />
                  </ul>
                </div>
                <div className="bg-gray-100 shadow rounded-lg p-8">
                  <h2 className="text-xl font-semibold mb-4">
                    🎁 What you can improve
                  </h2>
                  <ul className="list-none list-inside text-gray-800">
                    <ListItem
                      icon="🚀"
                      text="Boost your writing skills and thought process"
                    />
                    <ListItem
                      icon="💡"
                      text="Learn in an intuitive and engaging way"
                    />
                    <ListItem
                      icon="🌐"
                      text="Improve your English for personal or professional growth"
                    />
                    <ListItem
                      icon="🎯"
                      text="Receive personalized feedback tailored to your needs"
                    />
                    <ListItem
                      icon="🏆"
                      text="Gain confidence in your language abilities"
                    />
                    <ListItem
                      icon="🤓"
                      text="Master grammar and sound like a native speaker"
                    />
                  </ul>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef}></div>
        </div>
        <div className="p-4 bg-gray-200">
          {audioPreviewUrl && (
            <div className="flex justify-center items-center mb-2">
              <audio src={audioPreviewUrl} controls className="mr-2"></audio>
              <button
                onClick={handleSendAudio}
                className="py-1 px-3 bg-green-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                Send
              </button>
            </div>
          )}
          <div className="flex justify-center items-center">
            <button
              onMouseDown={handleStartRecording}
              onMouseUp={handleStopRecording}
              onTouchStart={handleStartRecording}
              onTouchEnd={handleStopRecording}
              disabled={!isStarted}
              className={`py-2 px-4 bg-blue-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                !isStarted && "opacity-50"
              }`}
            >
              {!isStarted
                ? "Please enter a topic and start the conversation"
                : isRecording
                ? "Release to Send"
                : "Hold to Record"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMode;

// Todo: Add Clear button to clear the chat
// Disable buttons while loading
