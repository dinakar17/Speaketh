// Speak.tsx
import React, { useState, useEffect } from "react";
import RecordAudio from "../RecordAudio";
import Timer from "../Timer";

interface SpeechModeProps {
  countdown: number;
  title: string;
  setAudioFile: React.Dispatch<React.SetStateAction<File | null>>;
  setUploaded: React.Dispatch<React.SetStateAction<boolean>>;
  setFormData: React.Dispatch<React.SetStateAction<FormData | null>>;
}


// "Title: The Great Gatsby Description: This classic novel by F. Scott Fitzgerald tells the story of Jay Gatsby, a mysterious millionaire who throws lavish parties in the hopes of winning back his lost love. It explores themes of wealth, love, and the corrupting influence of the American Dream. Speak about your own experiences with love and ambition, and how they have shaped your own personal journey."


const splitString = (str: string) => {
  // find the word "Description:" and split the string into two parts
  const splitIndex = str.indexOf("Description:");
  const firstPart = str.slice(0, splitIndex);
  const secondPart = str.slice(splitIndex).trim();
  return [firstPart, secondPart];
};

const SpeechMode: React.FC<SpeechModeProps> = (props) => {
  const { countdown, title, setAudioFile, setUploaded, setFormData } = props;

  const [countdownComplete, setCountdownComplete] = useState<boolean>(false);

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-8">
        Go on, Speak for a min
      </h1>
      <div className="flex flex-col gap-4">
        <div className="">
          <h2 className="text-xl font-semibold"> {splitString(title)[0]}</h2>
          <p className="text-gray-600 dark:text-gray-300">
            {splitString(title)[1]}
          </p>
        </div>
        <div className="flex flex-col gap-4 justify-center items-center">
          <div className="text-center">
            <Timer
              countdown={countdown}
              setCountdownComplete={setCountdownComplete}
            />
          </div>
          <RecordAudio
            setAudioFile={setAudioFile}
            setUploaded={setUploaded}
            setFormData={setFormData}
            countdownComplete={countdownComplete}
            disabled={true}
          />
        </div>
      </div>
    </div>
  );
};

export default SpeechMode;
