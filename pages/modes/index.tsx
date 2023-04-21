import { useState } from "react";
import {
  IoIosRocket,
  IoIosCloud,
  IoIosGlobe,
  IoIosChatboxes,
} from "react-icons/io";
import { HiOutlineLightBulb } from "react-icons/hi";

interface CardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  path: string;
}

const cards: CardProps[] = [
  {
    icon: <IoIosRocket size={24} />,
    title: "Presentation Mode",
    description: "Practice and perfect your presentation skills by uploading your slides and recording your audio. Our AI analyzes your text and provides feedback on areas for improvement, including grammar, vocabulary, and sentence structure.",
    path: "/modes/presentation-mode",
  },
  {
    icon: <IoIosCloud size={24} />,
    title: "Pitch an Idea Mode",
    description: "Refine your communication skills by pitching your ideas and receiving feedback from our AI. Write a brief description of your idea and record your speech. Our AI will analyze your text and provide feedback on grammar, vocabulary, word choice, and sentence structure.",
    path: "/cloud",
  },
  {
    icon: <IoIosGlobe size={24} />,
    title: "Speak for 1 Min Mode",
    description: "Improve your speaking skills by choosing a topic and speaking for one minute. Our AI analyzes your text and provides feedback on grammar, sentence formation, and word selection. It then suggests a more impressive version and explains why it sounds better.",
    path: "/global",
  },
  {
    icon: <IoIosChatboxes size={24} />,
    title: "Chat Mode",
    description: "Have a conversation with our AI and receive real-time feedback on your grammar, word choice, and sentence formation. Our AI will correct your mistakes and suggest ways to improve your language skills.",
    path: "/chat",
  },
  {
    icon: <IoIosChatboxes size={24} />,
    title: "Writing a Paragraph Mode",
    description: " Practice your writing and thinking skills by writing a paragraph on a given topic within 30 seconds. Our AI analyzes your text and provides feedback on relevance, grammar, word choice, and sentence structure. It then suggests an improved version.",
    path: "/paragraph",
  },
  {
    icon: <IoIosChatboxes size={24} />,
    title: "Quotes Mode",
    description: "Learn new vocabulary by reading quotes from books, famous people, or movies. Our AI provides feedback on important words and grammar concepts, and then prompts you to write something using those words or replicate the same tone.",
    path: "/quotes",
  },
  {
    icon: <IoIosChatboxes size={24} />,
    title: "Code Explanation Mode",
    description: "Explain your code and receive feedback from our AI on how relevant it is and areas you may have missed.",
    path: "/code",
  },
  {
    icon: <IoIosChatboxes size={24} />,
    title: "Interview Mode",
    description: "Prepare for job interviews by answering questions prompted by our AI. Our AI provides feedback on your responses, including grammar, vocabulary, and sentence structure. It then suggests a better version and continues asking questions.",
    path: "/interview",
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
            <HiOutlineLightBulb size={24} />
          </div>
        </div>
      </div>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-3">
        {filteredCards.map((card) => (
          <a
            key={card.path}
            href={card.path}
            className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 ease-in-out shadow-blue-100 transform hover:shadow-lg hover:-translate-y-1 hover:shadow-blue-200"
          >
            <div className="flex items-center justify-center h-12 w-12 rounded-md shadow text-blue-400">
              {card.icon}
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">
                {card.title}
              </h3>
              <p className="mt-2 text-xs text-gray-500">{card.description}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Modes;
