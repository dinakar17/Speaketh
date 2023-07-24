// pages/modes/quotesmode.tsx

import QuotesMode from "@/components/QuotesModePage/QuotesMode ";
import Welcome from "@/components/QuotesModePage/Welcome ";
import { generateGPT3Response } from "@/utils/Gpt3API ";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

export type MessageType = {
  id: number;
  text: string;
  isUser: boolean;
  isLoading?: boolean;
};

const Quotesmode = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [quote, setQuote] = useState<string>("");

  const handleClick = async () => {
    try{
     // fetch a random quote from the api.quoteable.io
     const response = await fetch("https://api.quotable.io/random?minLength=50&maxLength=100");
     if (!response.ok) {
       throw new Error("Error fetching quote");
     }
     const data = await response.json();

     const quote = data.content;
     const author = data.author;
     setQuote(quote);

    // Add a loader for the GPT-3 response
    setMessages((prev) => [
      ...prev,
      { id: Date.now() + 1, text: `"Quote": ${quote} \n\n "Author": ${author}. \n\n`, isUser: false, isLoading: true },
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

    const prompt = `Quote: ${quote} \n Author: ${author}. \n\n. Write a short decription on what I could learn in terms of words, phrases, and sentence structure from this quote. And give an extremely short and simple one line sentence assignment based on quote's grammar, words, and sentence structure.\n Feedback: \n Assignment: `

    // Send transcribedText to GPT-3 and get the response
    await generateGPT3Response(prompt, appendGpt3Response);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto px-2 flex flex-col">
      {messages.length === 0 ? <Welcome handleClick={handleClick} /> : 
      <QuotesMode messages={messages} setMessages={setMessages} quote={quote}/>}
    </div>
  );
};

export default Quotesmode;
