import Image from 'next/image';
import React from 'react'
import Button from '../ui/button';
import { Flame } from 'lucide-react';

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

const Welcome = ({handleClick} : {handleClick: () => void}) => {
  return (
    <div className="p-8">
    <h1 className="text-3xl text-center font-bold mb-8">
      Welcome to the{" "}
      <span className="text-purple-600">
        Write a paragraph in 2 min mode
      </span>
    </h1>
    <div className="flex justify-center">
      <Image
        src="/images/paragraphmode.png"
        alt="Speech Mode"
        width={300}
        height={200}
      />
    </div>

    <div className="grid grid-cols-2 gap-8 mt-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Rules</h2>
        <ol className="list-decimal list-inside text-gray-800">
          <li>Tap &quot;I understand&quot; to begin.</li>
          <li>
            Preview the topic for 5-10 seconds, then start to type your thoughts
          </li>
          <li>
            Type your thoughts within 2 min – you will be stopped
            automatically if you go over the limit.
          </li>
          <li>
            Hit &quot;start analyzing&quot; to receive feedback and learn
            from your mistakes – the key to personal growth!
          </li>
        </ol>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Perks</h2>
        <ul className="list-none list-inside text-gray-800">
          <ListItem
            icon="🚀"
            text="Boost your writing speed & efficiency"
          />
          <ListItem
            icon="🧠"
            text=" Sharpen your thought process & critical thinking"
          />
          <ListItem
            icon="💡"
            text="Enhance creativity & expressiveness"
          />
          <ListItem icon="📈" text="Track your progress & growth" />
          <ListItem
            icon="🏆"
            text=" Build confidence in your writing abilities"
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
        I understand
      </Button>
    </div>
  </div>
  )
}

export default Welcome