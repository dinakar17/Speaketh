import InterviewMode from "@/components/InterviewMode/InterviewMode ";
import RequiredInfo from "@/components/InterviewMode/RequiredInfo ";
import React, { useState } from "react";

export type MessageType = {
  id: number;
  text: string;
  isUser: boolean;
  isLoading?: boolean;
};

const Interviewmode = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);

  const [tags, setTags] = useState<string[]>([]);
  const [jobDescription, setJobDescription] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [experience, setExperience] = useState("");

 

const RequiredInfoProps = {
    tags,
    setTags,
    jobDescription,
    setJobDescription,
    companyDescription,
    setCompanyDescription,
    experience,
    setExperience,
    messages,
    setMessages,
}

const InterviewModeProps = {
    messages,
    setMessages,
    tags,
    jobDescription,
    companyDescription,
    experience,
};


  return (
    <div className="max-w-screen-lg mx-auto px-2 flex flex-col">
      {messages.length === 0 ? <RequiredInfo {...RequiredInfoProps} /> :
      <InterviewMode {...InterviewModeProps} />}
    </div>
  );
};

export default Interviewmode;
