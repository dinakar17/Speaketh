import useSpeechToText from "react-hook-speech-to-text";
import { useAudioLevels } from "../hooks/useAudioLevels";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";


const PresentationMode = () => {
  const {
    error,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useOnlyGoogleCloud: true,
    googleApiKey: "AIzaSyApXXelZg7H3luXy_6loOwOcZqz8Ojblr0",
    googleCloudRecognitionConfig: {
      languageCode: "en-US",
    },
    useLegacyResults: false,
    // timeout: 1000000, // 1000 seconds
  });

  const audioLevel = useAudioLevels(isRecording);


  if (error) return <p>Web Speech API is not available in this browser 🤷‍</p>;

console.log(results);

  return (
    <div>
      <h1>Recording: {isRecording.toString()}</h1>
      <button onClick={isRecording ? stopSpeechToText : startSpeechToText}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      <div className="relative">
      <FontAwesomeIcon
        icon={faMicrophone}
        className={`text-5xl ${isRecording ? "text-red-500" : "text-gray-500"}`}
      />
      {isRecording && (
        <div
          className="absolute top-0 left-0 w-full h-full bg-blue-500 opacity-50 rounded-full animate-pulse"
          style={{
            transformOrigin: "center",
            animationDuration: "1s",
            width: `${audioLevel}px`,
            height: `${audioLevel}px`,
          }}
        />
      )}
    </div>
      <ul>
        {results.map((result: any) => (
          <span key={result.timestamp}>{result.transcript}</span>
        ))}
      </ul>
    </div>
  );
};

export default PresentationMode;
