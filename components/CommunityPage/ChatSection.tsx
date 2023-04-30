import React, { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import { DocumentData } from "firebase/firestore";
import { toast } from "react-hot-toast";

interface ChatSectionProps {
  messages: DocumentData[] | undefined;
}

const ChatSection: React.FC<ChatSectionProps> = ({ messages }) => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    // toast("New messages arrived!", {
    //   icon: "👏",
    //   position: "bottom-right",
    // });
  }, [messages]);

  return (
    <div className="h-full overflow-auto">
      <div className="p-4 space-y-4">
        {messages?.map((message: any, index) => (
          <ChatMessage key={index} message={message} />
        ))}
        <div ref={chatEndRef}></div>
      </div>
    </div>
  );
};

export default ChatSection;
