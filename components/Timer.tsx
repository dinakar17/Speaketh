import React from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

const renderTime = ({ remainingTime }: { remainingTime: number }) => {
  if (remainingTime === 0) {
    return <div className="text-sm text-red-500">Time up...</div>;
  }

  return (
    <div className="flex flex-col items-center text-xs">
      <div className="">Remaining</div>
      <div className="text-lg font-medium">{remainingTime}</div>
      <div className="text">seconds</div>
    </div>
  );
};

interface TimerProps {
    countdown: number;
    // Suggest a better for the prop which basically says count down is completed
    setCountdownComplete: React.Dispatch<React.SetStateAction<boolean>>;
}

const Timer = ({ countdown, setCountdownComplete }: TimerProps) => {
  return (
    <>
    <CountdownCircleTimer
      isPlaying
      size={120}
      duration={countdown}
      colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
      colorsTime={[10, 6, 3, 0]}
      onComplete={() => setCountdownComplete(true)}
    >
      {renderTime}
    </CountdownCircleTimer>
    </>
  );
};

export default Timer;
