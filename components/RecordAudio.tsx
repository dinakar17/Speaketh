import { useAudioLevels } from "@/hooks/useAudioLevels ";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Pause,
  Play,
  HeartPulse,
  StopCircle,
  Timer,
  Download,
  Repeat
} from "lucide-react";
import Button from "@components/ui/button";

// Add 'paused' state to the RecordingState type
type RecordingState = "idle" | "recording" | "paused" | "stopped";

export interface RecordAudioProps {
  setAudioFile: React.Dispatch<React.SetStateAction<File | null>>;
  setFormData: React.Dispatch<React.SetStateAction<FormData | null>>;
  setUploaded: React.Dispatch<React.SetStateAction<boolean>>;
  countdownComplete ?: boolean;
  disabled ?: boolean;  
}

const RecordAudio: React.FC<RecordAudioProps> = (props) => {
  const {
    setAudioFile,
    setFormData,
    setUploaded,
    countdownComplete,
    disabled
  } = props;

  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [audioURL, setAudioURL] = useState<string>("");
  const [time, setTime] = useState<number>(0);
  const timerRef = useRef<number>();
  const mediaRecorderRef = useRef<MediaRecorder>();
  const audioLevel = useAudioLevels(recordingState === "recording");

  useEffect(() => {
    if (countdownComplete) {
      stopRecording();
    }
  }, [countdownComplete]);

  const startRecording = async () => {
    setRecordingState("recording");
    setTime(0);
    timerRef.current = window.setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    const chunks: BlobPart[] = [];

    mediaRecorderRef.current.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/mpeg" });
      setAudioURL(URL.createObjectURL(blob));

      // 1. Set the audio file to the setAudioFile state
      const audioFile = new File([blob], "recorded_audio.mp3", {
        type: "audio/mpeg",
      });
      setAudioFile(audioFile);

      // 2. Set the uploaded state to true
      setUploaded(true);

      // 3. Attach the audio file to the formData and set it to the setFormData state
      const formData = new FormData();
      formData.append("file", audioFile);
      formData.append("model", "whisper-1");
      formData.append("language", "en");

      setFormData(formData);
    };

    mediaRecorderRef.current.start();
  };

  // Add a function to pause recording
  const pauseRecording = () => {
    setRecordingState("paused");
    clearInterval(timerRef.current);
    mediaRecorderRef.current?.pause();
  };

  // Add a function to resume recording
  const resumeRecording = () => {
    setRecordingState("recording");
    timerRef.current = window.setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);
    mediaRecorderRef.current?.resume();
  };

  // Add a function to reset recording
  const resetRecording = () => {
    setRecordingState("idle");
    setAudioURL("");
    setTime(0);
  };

  const stopRecording = () => {
    setRecordingState("stopped");
    clearInterval(timerRef.current);
    mediaRecorderRef.current?.stop();
  };

  // Function to send the audio file to the backend
  const sendAudioFile = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append("file", audioBlob); // Remove the third field

    const response = await fetch("/api/audiofile", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      // Handle error
      console.error("Failed to upload audio file");
    }
  };

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="border relative flex flex-col justify-center items-center h-72 w-full shadow-lg rounded-md">
      <div className="absolute top-6 w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
        <div
          className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center"
          style={{
            transform: `scale(${audioLevel / 10})`,
          }}
        >
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
        </div>
        <Image
          src="/images/microphone3d.png"
          width={64}
          height={64}
          className="absolute"
          alt="microphone"
        />
      </div>
      <div className="mt-24">
        {recordingState === "idle" && (
          <Button
            bgcolor="bg-blue-500"
            eventHandler={startRecording}
            icon={<Play />}
          >
            Start Recording
          </Button>
        )}
        {["recording", "paused"].includes(recordingState) && (
          <div className="flex flex-col items-center">
            <div className="flex justify-center items-center gap-2">
              {recordingState === "recording" && (
                <Button
                  bgcolor="bg-yellow-500"
                  eventHandler={pauseRecording}
                  icon={<Pause />}
                >
                  Pause Recording
                </Button>
              )}
              {recordingState === "paused" && (
                <Button
                  bgcolor="bg-blue-500"
                  eventHandler={resumeRecording}
                  icon={<HeartPulse />}
                >
                  Resume Recording
                </Button>
              )}
              {!disabled && (
              <Button
                bgcolor="bg-red-500"
                eventHandler={stopRecording}
                icon={<StopCircle />}
              >
                Stop Recording
              </Button>
              )}
            </div>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Timer />
              <p className="text-gray-500 text-lg">Time: {time}s</p>
            </div>
          </div>
        )}
        {recordingState === "stopped" && (
          <div className="flex flex-col items-center">
            <div className="flex justify-center items-center gap-4">
              <Button bgcolor="bg-green-500" icon={<Download />}>
                <a href={audioURL} download="recorded_audio.mp3">
                  Download
                </a>
              </Button>
              {/* Add a Record Again button */}
              { !disabled && (
              <Button
                bgcolor="bg-blue-500"
                icon={<Repeat />}
                eventHandler={resetRecording}
              >
                Record Again
              </Button>
              )}
            </div>
            <audio src={audioURL} controls className="mt-4"></audio>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordAudio;
