import Image from "next/image";
import React from "react";
import Button from "../ui/button";
import { Flame } from "lucide-react";

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

const Welcome = ({ handleClick }: { handleClick: () => void }) => {
  return (
    <div className="p-8">
      <h1 className="text-3xl text-center font-bold mb-8">
        Welcome to the <span className="text-blue-600">Quotes mode</span>
      </h1>
      <div className="flex justify-center">
        <Image
          src="/images/quotesmode.png"
          alt="Speech Mode"
          className=""
          width={300}
          height={200}
        />
      </div>

      <div className="grid grid-cols-2 gap-8 mt-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Rules</h2>
          <ol className="list-decimal list-inside text-gray-800">
            <li>Click the “I am ready” button and you will be presented with a quote.</li>
            <li>
            Study the Quote: Examine the quote&apos;s words, phrases, and grammar, understanding its meaning.
            </li>
            <li>
            Complete the Assignment: Engage with the AI-driven assignment related to the quote, which may include using specific words or phrases, or replicating the tone of the quote in a response.
            </li>
            <li>
            Learn from Feedback: Review AI feedback, noting areas for improvement, and apply these learnings in future practice.
            </li>
          </ol>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Perks</h2>
          <ul className="list-none list-inside text-gray-800">
            <ListItem
              icon="📚"
              text="Expand Vocabulary: Improve your language by learning new words and phrases used in famous quotes."
            />
            <ListItem
              icon="🤓"
              text="Grammar Insights: Understand and apply proper grammar from expertly crafted sentences."
            />
            <ListItem
              icon="🗣️"
              text=" Enhanced Expression: Develop a more eloquent and persuasive speaking style."
            />
            <ListItem
              icon="🌟"
              text="Inspiration Boost: Draw motivation and wisdom from influential figures and their timeless words."
            />
            <ListItem
              icon="🔁"
              text="Practice Makes Perfect: Apply the learned phrases and words in everyday conversation to solidify your skills."
            />
          </ul>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <Button
          bgcolor="bg-blue-500"
          icon={<Flame />}
          eventHandler={handleClick}
        >
          I am ready
        </Button>
      </div>
    </div>
  );
};

export default Welcome;
