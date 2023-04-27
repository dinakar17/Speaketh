// Speak.tsx
import React, { useState, useEffect } from "react";
import RecordAudio from "./RecordAudio";
import Timer from "./Timer";

interface SpeechModeProps {
  countdown: number;
  title: string;
  setAudioFile: React.Dispatch<React.SetStateAction<File | null>>;
  setUploaded: React.Dispatch<React.SetStateAction<boolean>>;
  setFormData: React.Dispatch<React.SetStateAction<FormData | null>>;
}


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
          <h2 className="text-xl font-semibold">Your Topic is: {title} </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Talk about something about its consectetur adipiscing elit. Aliquam
            et aliquam mi. Proin quis lobortis leo, eget egestas sapien. Mauris
            eu porta justo.
          </p>
        </div>
        <div className="flex flex-col gap-4 justify-center items-center">
          <div className="text-center">
            <Timer countdown={countdown} setCountdownComplete={setCountdownComplete} />
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
