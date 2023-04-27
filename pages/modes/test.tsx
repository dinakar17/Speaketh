// chatmode.tsx
import { useState, useEffect, useRef } from "react";
import { translateSpeechToText } from "@/utils/WhisperAPI ";
import { toast } from "react-hot-toast";
import toWav from "audiobuffer-to-wav";
import { generateContent, generateGPT3Response } from "@/utils/Gpt3API ";
import { ThreeDots } from "react-loader-spinner";
type ListItemProps = {
  icon: React.ReactNode;
  text: string;
};

type InputType = 'Text Input' | 'Audio Input';

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

const ChatMode = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  const [inputType, setInputType] = useState<InputType>('Text Input');
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

  const handleSendText = async () => {
    if (!input){
        toast.error("Please enter a message");
        return;
    }
    

    // Add the user's message to the chat
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: input, isUser: true },
    ]);
    setInput("");

    // Send input text to GPT-3 and get the response
    const gpt3Response = await sendTextToGPT3(input);

    // Add the GPT-3 response to the chat
    setMessages((prev) => [
      ...prev,
      { id: Date.now() + 1, text: gpt3Response, isUser: false },
    ]);
  };

  const handleSendAudio = async () => {
    if (!audioPreviewUrl) return;

    // // Add a loader for the user's input while the speech is converted to text by Whisper
    // setMessages((prev) => [
    //   ...prev,
    //   { id: Date.now(), text: "", isUser: true, isLoading: true },
    // ]);

    // // Convert the audioPreviewUrl back to Blob
    // const response = await fetch(audioPreviewUrl);
    // const audioBlob = await response.blob();

    // console.log("audioBlob", audioBlob);
    // // create a file with the following format: path, lastModified, lastModifiedDate, name, size, type, webkitRelativePath
    // const file = new File([audioBlob], "audio.wav", {
    //   type: "audio/wav",
    // });

    // console.log("file", file);

    // const data = new FormData();
    // data.append("file", file);
    // data.append("model", "whisper-1");
    // data.append("language", "en");

    // // Send the audioBlob to Whisper API and get the transcribed text
    // const textData = await translateSpeechToText(data);

    // if (textData.error) {
    //   console.log("Error", textData.error);
    //   toast.error(`${textData.error.message}`);
    //   return;
    // }
    // const transcribedText = textData.text;

    // const prompt = `
    //   You are an AI model that tells the user how a native speaker would say the same thing and give reasons why and continue the conversation. \n\nText: ${transcribedText} \n\nCorrected Text:`;

    // // const prompt = `Your are an AI model that corrects the grammar of a text and gives feedback on areas he needs to improve. \n\nText: ${text} \n\nCorrected Text:`;

    // // // Add the user's message to the chat
    // // setMessages((prev) => [
    // //   ...prev,
    // //   { id: Date.now(), text: text, isUser: true, isLoading: false },
    // // ]);
    // // Update the user's message with the transcribed text and remove the loader
    // setMessages((prev) =>
    //   prev.map((message) =>
    //     message.isLoading && message.isUser
    //       ? { ...message, text: transcribedText, isLoading: false }
    //       : message
    //   )
    // );

    // // Add a loader for GPT-3's response
    // setMessages((prev) => [
    //   ...prev,
    //   { id: Date.now() + 1, text: "", isUser: false, isLoading: true },
    // ]);

    // const appendGpt3Response = (response: string) => {
    //   setMessages((prev) => {
    //     const lastMessage = prev[prev.length - 1];

    //     if (lastMessage && !lastMessage.isUser) {
    //       // Update the last GPT-3 message with the new response chunk
    //       return prev.map((message) =>
    //         message.id === lastMessage.id
    //           ? { ...message, text: message.text + response, isLoading: false }
    //           : message
    //       );
    //     } else {
    //       // If the last message is from the user, create a new GPT-3 message
    //       return [
    //         ...prev,
    //         { id: Date.now(), text: response, isUser: false, isLoading: false },
    //       ];
    //     }
    //   });
    // };

    // // Send transcribedText to GPT-3 and get the response
    // await generateGPT3Response(prompt, appendGpt3Response);

    // // console.log("generatedContent", generatedContent);
    // // // Add the GPT-3 response to the chat
    // // setMessages((prev) => [
    // //   ...prev,
    // //   { id: Date.now() + 1, text: generatedContent, isUser: false },
    // // ]);

    // // Clear the audio preview
    // setAudioPreviewUrl(null);
  };

  const sendAudioToWhisper = async (audioBlob: Blob): Promise<string> => {
    // Mock-up code for sending audio to Whisper API and getting the transcribed text
    const transcribedText = "Sample transcribed text from Whisper API";
    return transcribedText;
  };

  const sendTextToGPT3 = async (text: string): Promise<string> => {
    // Mock-up code for sending transcribed text to GPT-3 and getting the response
    const gpt3Response = "Sample response from GPT-3";
    return gpt3Response;
  };

  return (
    <div className="h-screen flex">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((message) => (
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
          ))}
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
              <button
                onMouseDown={handleStartRecording}
                onMouseUp={handleStopRecording}
                onTouchStart={handleStartRecording}
                onTouchEnd={handleStopRecording}
                className="py-2 px-4 bg-blue-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                {isRecording ? "Release to Send" : "Hold to Record"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMode;

// Todo: Add Clear button to clear the chat
// Disable buttons while loading
