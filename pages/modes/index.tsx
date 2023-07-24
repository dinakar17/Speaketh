// pages\modes\index.tsx

import { useState } from "react";
import Image from "next/image";
import { Lightbulb } from "lucide-react";
import Link from "next/link";

interface CardProps {
  icon: string;
  title: string;
  description: string;
  path: string;
}

const cards: CardProps[] = [
  {
    icon: "/images/modes/presentationmode.png",
    title: "Presentation Power-up",
    description: "Fine-tune your presentation skills by pasting your slide text and recording or uploading your audio. Get AI-driven feedback to improve your delivery and captivate your audience.",
    path: "/modes/presentation-mode",
  },
  {
    icon: "/images/modes/pitchanideamode.png",
    title: "Pitch Perfect",
    description: "Bring your ideas to life with AI-assisted speech analysis. Write a brief description of your idea, record your pitch, and receive valuable feedback to make a lasting impression on your listeners.",
    path: "/modes/pitchyouridea",
  },
  {
    icon: "/images/modes/speechmode.png",
    title: "Two-Minute Masterclass",
    description: "Challenge yourself with a timed 2-minute speech on an AI-generated or custom topic. Improve your grammar, sentence formation, and word choice with insightful AI feedback and a refined version of your speech.",
    path: "/modes/speechmode",
  },
  {
    icon:"/images/modes/conversationmode.png",
    title: "Conversation Clinic",
    description: "Practice your conversational English with two engaging sub-modes: Grammar Correction and Native English Speaker. Respond to AI-generated topics and receive valuable feedback to refine your speaking skills.",
    path: "/modes/chatmode",
  },
  {
    icon: "/images/modes/paragraphmode.png",
    title: "Quick-Wit Writing",
    description: "Enhance your writing and thinking skills with a timed paragraph challenge. Receive AI feedback on topic relevance, grammar, and sentence formation, along with suggestions for improvement.",
    path: "/modes/paragraphmode",
  },
  {
    icon: "/images/modes/quotesmode.png",
    title: "Quote Quench",
    description: "Learn from iconic quotes and improve your vocabulary, grammar, and phrasing. Complete AI-generated assignments based on quotes and receive personalized feedback to elevate your language skills.",
    path: "/modes/quotesmode",
  },
  {
    icon: "/images/modes/codeexplanationmode.png",
    title: "Code Clarifier",
    description: "Gain confidence in explaining your code by pasting it and recording your explanation. Receive AI-driven feedback on relevance, missing points, and overall clarity to effectively communicate your ideas.",
    path: "/modes/codemode",
  },
  {
    icon: "/images/modes/interviewmode.png",
    title: "Interview Insider",
    description: "Ace your job interviews by entering your job description and experience/skills. Answer AI-generated questions while receiving feedback and improved responses to boost your confidence and performance.",
    path: "/modes/interviewmode",
  },
];

const Modes = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredCards = cards.filter(
    (card) =>
      card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto mb-8">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <div className="relative rounded-md shadow-sm">
        <input
            type="text"
            placeholder="Search modes"
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Lightbulb size={24} />
          </div>
        </div>
      </div>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-3">
        {filteredCards.map((card) => (
          <Link
            key={card.path}
            href={card.path}
            className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 ease-in-out shadow-blue-100 transform hover:shadow-lg hover:-translate-y-1 hover:shadow-blue-200"
          >
            <div className="relative flex items-center justify-center h-12 w-12 rounded-md shadow text-blue-400">
              <Image src={card.icon} alt={card.title} layout="fill" />
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">
                {card.title}
              </h3>
              <p className="mt-2 text-xs text-gray-500">{card.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Modes;
