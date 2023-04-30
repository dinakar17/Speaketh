// utils/Gpt3API.ts

import { toast } from "react-hot-toast";
import { ChatGPTMessage } from "./OpenAIStream";

export const generateContent = async (
  prompt: string,
  setGeneratedContent: React.Dispatch<React.SetStateAction<string>>
): Promise<any> => {
  setGeneratedContent("");
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
    }),
  });

  if (!response.ok) {
    toast.error("Error with generate response. Please try again.");
    throw new Error(response.statusText);
  }

  // This data is a ReadableStream
  const data = response.body;
  if (!data) {
    return;
  }

  const reader = data.getReader();
  const decoder = new TextDecoder();
  let done = false;

  // scrollToBios();

  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    const chunkValue = decoder.decode(value);
    setGeneratedContent((prev) => prev + chunkValue);
  }
};



export const generateGPT3Response = async (
  prompt: string,
  appendGP3Response: (response: string) => void
): Promise<any> => {
  
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
    }),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  // This data is a ReadableStream
  const data = response.body;
  if (!data) {
    return;
  }

  const reader = data.getReader();
  const decoder = new TextDecoder();
  let done = false;

  // scrollToBios();

  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    const chunkValue = decoder.decode(value);
    appendGP3Response(chunkValue);
  }
};
export const chatResponse = async (
  messages: ChatGPTMessage[],
  appendGP3Response: (response: string) => void
): Promise<any> => {
  
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages,
    }),
  });

  if (!response.ok) {
    toast.error("Error with chat response. Please try again.");
    throw new Error(response.statusText);
  }

  // This data is a ReadableStream
  const data = response.body;
  if (!data) {
    return;
  }

  const reader = data.getReader();
  const decoder = new TextDecoder();
  let done = false;

  // scrollToBios();

  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    const chunkValue = decoder.decode(value);
    appendGP3Response(chunkValue);
  }
};
