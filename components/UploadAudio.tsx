import React, { useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useDropzone } from "react-dropzone";
import { toast } from "react-hot-toast";
import Image from "next/image";

import { FileAudio2 } from "lucide-react";

export interface UploadAudioProps {
  audioFile: File | null;
  setAudioFile: React.Dispatch<React.SetStateAction<File | null>>;
  setFormData: React.Dispatch<React.SetStateAction<FormData | null>>;
  uploaded: boolean;
  setUploaded: React.Dispatch<React.SetStateAction<boolean>>;
}

const UploadAudio: React.FC<UploadAudioProps> = (props) => {
  const { audioFile, setAudioFile, setFormData, uploaded, setUploaded } = props;

  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) {
      toast.error("Only audio files are allowed.");
      return;
    }
    const file = acceptedFiles[0];
    if (!file.type.startsWith("audio/")) {
      toast.error("Only audio files are allowed.");
      return;
    }
    // check if file size is greater than 10MB
    if (file.size > 10000000) {
      toast.error("File size should not be greater than 10MB.");
      return;
    }

    // Send the audio file to the Whisper OpenAI API here.
    const data = new FormData();
    data.append("file", file);
    data.append("model", "whisper-1");
    data.append("language", "en");
    setFormData(data);

    setAudioFile(file);
    setUploadProgress(0);
    setUploaded(false);
    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          setUploaded(true);
          return 100;
        }
        return prevProgress + 1;
      });
    }, 30);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "audio/*": [".mp3", ".mp4", ".mpeg", ".mpga", ".m4a", ".wav", ".webm"],
    },
    maxFiles: 1,
  });

  return (
    <>
      <p className="text-gray-700 mb-4">
        Please kindly upload your presentation speech you want to present in the conference here.
      </p>
      <div
        {...getRootProps()}
        className="w-full h-72 border-2 border-dashed bg-gray-50 border-gray-400 rounded flex items-center justify-center hover:bg-gray-50 cursor-pointer"
      >
        <input {...getInputProps()} />
        {!uploaded && uploadProgress === 0 ? (
          <div className="flex flex-col justify-center items-center text-center">
            <Image
              alt="audiofile"
              src="/images/audiofile.png"
              width={100}
              height={100}
            />
            <div className="text-gray-600 flex flex-col justify-center items-center gap-1">
              <div>
                <h1 className="text-lg font-semibold">
                  Drag and Drop your audio file here
                </h1>
                <p className="text-gray-500 text-sm">
                  Accepted file types: .mp3, .mp4, .mpeg, .mpga, .m4a, .wav,
                  .webm
                </p>
              </div>
              <p className="text-base">or</p>
              <button className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
                Browse Files
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className="w-28 h-28">
              <CircularProgressbar
                value={uploadProgress}
                text={uploaded ? "✔" : `${uploadProgress}%`}
                strokeWidth={5}
                styles={buildStyles({
                  strokeLinecap: "round",
                  textSize: "24px",
                  pathTransition: "ease",
                  textColor: uploaded ? "green" : "gray",
                  pathColor: uploaded ? "green" : "gray",
                  trailColor: "#eee",
                })}
              />
            </div>
            {uploaded && (
              <div className="text-center mt-2 flex flex-col justify-center items-center gap-2">
                <p className="text-gray-600 flex gap-1">
                  <FileAudio2 size={20} />
                  {audioFile?.name} ({audioFile!.size / 1000} KB)
                </p>
                <p className="text-green-500">
                  You audio file is uploaded successfully. Please click on the
                  start analyzing button to start the analysis.
                </p>
                <audio
                  src={URL.createObjectURL(audioFile!)}
                  controls
                  className="w-full mt-4"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default UploadAudio;
