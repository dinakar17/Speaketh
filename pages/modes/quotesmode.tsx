import Button from "@/components/ui/button ";
import { Flame } from "lucide-react";
import Image from "next/image";
import React from "react";

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

const QuotesMode = () => {
  const handleClick = () => {
    console.log("clicked");
  };

  return (
    <div className="max-w-screen-lg mx-auto py-4 px-2 flex flex-col">
      <div className="p-8">
        <h1 className="text-3xl text-center font-bold mb-8">
          Welcome to the{" "}
          <span className="text-blue-600">Speech for a min mode</span>
        </h1>
        <div className="flex justify-center">
          <Image
            src="/images/oneminspeech.png"
            alt="Speech Mode"
            width={300}
            height={200}
          />
        </div>

        <div className="grid grid-cols-2 gap-8 mt-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Rules</h2>
            <ol className="list-decimal list-inside text-gray-800">
              <li>Click the “I am ready” button</li>
              <li>
                The moment you press that button you’ll be presented with a
                topic to review for 5-10 sec and a stopwatch timer.
              </li>
              <li>
                When you feel you’re ready, start recording your speech and try
                to complete it in under 30 sec (recording will be automatically
                stopped if you exceed the time limit)
              </li>
              <li>
                Click start analysis to see your results. You can also listen to
                your speech and see the transcript.
              </li>
            </ol>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Perks</h2>
            <ul className="list-none list-inside text-gray-800">
              <ListItem
                icon="🚀"
                text="Swift Thinking: Train your mind to think on its feet."
              />
              <ListItem
                icon="💬"
                text="Eloquence Boost: Sharpen your verbal skills."
              />
              <ListItem
                icon="🦸"
                text="Confidence Builder: Face your public speaking fears."
              />
              <ListItem
                icon="⏱️"
                text="Time Management: Deliver speeches within a tight timeframe."
              />
              <ListItem
                icon="📚"
                text="Engaging Storytelling: Captivate audiences with compelling narratives."
              />
              <ListItem
                icon="📝"
                text="Persuasive Speaking: Convince others to see things your way."
              />
            </ul>
          </div>
        </div>

        <p className="text-xl mt-8">4 simple rules! That’s it.</p>
        <div className="flex justify-center mt-8">
          <Button
            bgcolor="bg-blue-500"
            icon={<Flame />}
            eventHandler={handleClick}
          >
            I&apos;m ready
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuotesMode;
