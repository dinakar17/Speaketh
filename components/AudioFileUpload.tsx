// import React, { useRef, useState } from "react";
// import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
// import "react-circular-progressbar/dist/styles.css";
// import { useDropzone } from "react-dropzone";
// import { toast } from "react-hot-toast";
// import Draggable from "react-draggable";
// import Image from "next/image";

// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   LinearProgress,
// } from "@mui/material";
// import { Skeleton } from "@mui/material";
// import facts from "./facts.json"; // Import a JSON file containing random facts
// import ReactMarkdown from "react-markdown";

// interface AudioFileUploadProps {
//   slideText: string;
// }

// const AudioFileUpload: React.FC<AudioFileUploadProps> = ({ slideText }) => {
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [uploaded, setUploaded] = useState(false);
//   const [audioFile, setAudioFile] = useState<File | null>(null);

//   const [convertedText, setConvertedText] = useState<string>("");
//   const [loading, setLoading] = useState(false);
//   const [generatedContent, setGeneratedContent] = useState<string>("");
//   const [formData, setFormData] = useState<FormData | null>(null);

//   const [openDialog, setOpenDialog] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [randomFact, setRandomFact] = useState<string | null>(null);

//   const contentRef = useRef<null | HTMLDivElement>(null);

//   const scrollToBios = () => {
//     if (contentRef.current !== null) {
//       contentRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   };
//   const getRandomFact = () => {
//     const randomIndex = Math.floor(Math.random() * facts.length);
//     return facts[randomIndex];
//   };

//   const onDrop = (acceptedFiles: File[]) => {
//     if (!acceptedFiles.length) {
//       toast.error("Only audio files are allowed.");
//       return;
//     }
//     const file = acceptedFiles[0];
//     if (!file.type.startsWith("audio/")) {
//       toast.error("Only audio files are allowed.");
//       return;
//     }
//     // check if file size is greater than 10MB
//     if (file.size > 10000000) {
//       toast.error("File size should not be greater than 10MB.");
//       return;
//     }

//     // Send the audio file to the Whisper OpenAI API here.
//     const data = new FormData();
//     data.append("file", file);
//     data.append("model", "whisper-1");
//     data.append("language", "en");
//     setFormData(data);

//     setAudioFile(file);
//     setUploadProgress(0);
//     setUploaded(false);
//     const interval = setInterval(() => {
//       setUploadProgress((prevProgress) => {
//         if (prevProgress >= 100) {
//           clearInterval(interval);
//           setUploaded(true);
//           toast.success("Audio file uploaded successfully.");
//           return 100;
//         }
//         return prevProgress + 1;
//       });
//     }, 30);
//   };


//   const generateContent = async (prompt: string) => {
//     setGeneratedContent("");
//     const response = await fetch("/api/generate", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         prompt,
//       }),
//     });

//     if (!response.ok) {
//       throw new Error(response.statusText);
//     }

//     // This data is a ReadableStream
//     const data = response.body;
//     if (!data) {
//       return;
//     }

//     const reader = data.getReader();
//     const decoder = new TextDecoder();
//     let done = false;

//     scrollToBios();

//     while (!done) {
//       const { value, done: doneReading } = await reader.read();
//       done = doneReading;
//       const chunkValue = decoder.decode(value);
//       setGeneratedContent((prev) => prev + chunkValue);
//     }
//   };

//   const startAnalyzing = async () => {
//     if (!audioFile) {
//       toast.error("Please upload an audio file first.");
//       return;
//     }
//     if (!slideText) {
//       toast.error("Please paste your slide text first. It can't be empty.");
//       return;
//     }

//     // Show the dialog while analyzing the audio
//     setOpenDialog(true);
//     setRandomFact(getRandomFact()); // Set the random fact only once when the dialog is opened
//     // setProgress(0);
//     // const progressInterval = setInterval(() => {
//     //     setProgress((prevProgress) => prevProgress + 1);
//     //   }, 20);

//     const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
//       headers: {
//         Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY ?? ""}`,
//       },
//       method: "POST",
//       body: formData,
//     });
//     const textData = await res.json();
//     setTimeout(() => {
//       setOpenDialog(false);
//     }, 1000);
//     console.log(textData);

//     if (textData.error) {
//       toast.error("Something went wrong. Please try again later.");
//       return;
//     }

//     //   clearInterval(progressInterval);
//     //   setProgress(100);
//     setConvertedText(textData.text);

//     const prompt = prompter(
//       `Backend of my project`,
//       `Hello, my name is Dhanakar. So the project that I've done or the project that I have basically submitted is the back end of the blogging website that I have created for my college community. The main theme of the website is to provide or create a platform where all the things that happen in college, be it in events, cultural activities, aluminized ceremonies, research projects, final projects, etc. etc. are documented in the form of blogs and shared across the college community and also stored for the future generations to come.`
//     );

//     generateContent(prompt);

//     //   //Send the text to the backend and to GPT-3
//     //   setTimeout(() => {
//     //   setDisplayText(null); // Clear previous text
//     //   setGpt3Loading(true);
//     //   // Send the text we got from the audio to the GPT-3 API here.
//     //   // add a mockup delay for now to test the UI
//     //   setTimeout(() => {
//     //     setGpt3Loading(false);
//     //     setDisplayText("Sample GPT-3 response text."); // Set the GPT-3 response text here
//     //   }, 10000);
//     // }, 10000);
//   };

//   //   const startAnalyzing = async () => {
//   //     if (!audioFile) {
//   //       toast.error("Please upload an audio file first.");
//   //       return;
//   //     }
//   // Reference: https://javascript.plainenglish.io/transcribe-audio-files-using-whisper-open-ai-api-using-next-js-and-typescript-ad851016c889

//   //     setGpt3Loading(true);
//   //     // Send the text to the GPT-3 API here.
//   //     // add a mockup delay for now to test the UI
//   //     setGpt3Loading(false);
//   //   };
//   //   const bioRef = useRef<null | HTMLDivElement>(null);

//   //   const scrollToBios = () => {
//   //     if (bioRef.current !== null) {
//   //       bioRef.current.scrollIntoView({ behavior: "smooth" });
//   //     }
//   //   };

//   function preprocessMarkdown(markdownString: string) {
//     // Add newline character before each numbered point and hyphen with spaces on both sides
//     const withNewLines = markdownString.replace(/(\d+\.|\s-\s)/g, "\n$1");

//     // Add bold markdown for words between double quotes
//     const withBoldQuotes = withNewLines.replace(/"([^"]*)"/g, "**$1**");

//     return withBoldQuotes;
//   }

//   const { getRootProps, getInputProps } = useDropzone({
//     onDrop,
//     accept: {
//       "audio/*": [".mp3", ".mp4", ".mpeg", ".mpga", ".m4a", ".wav", ".webm"],
//     },
//     maxFiles: 1,
//   });

//   return (
//     <div>
//       <div
//         {...getRootProps()}
//         className="w-full h-56 border-2 border-dashed bg-gray-50 border-gray-400 rounded flex items-center justify-center hover:bg-gray-100 cursor-pointer"
//       >
//         <input {...getInputProps()} />
//         {!uploaded && uploadProgress === 0 ? (
//           <div className="flex flex-col justify-center items-center text-center">
//             <Image
//               alt="audiofile"
//               src="/images/audiofile.png"
//               width={100}
//               height={100}
//             />
//             <div className="text-gray-600">
//               <h1 className="text-lg font-medium">Drag & Drop your audio file</h1>
//               <p className="text-sm">or</p>
//               <p className="text-sm text-blue-500">Browse files</p>
//             </div>
//           </div>
//         ) : (
//           <div className="flex flex-col items-center justify-center">
//             <div className="w-28 h-28">
//               <CircularProgressbar
//                 value={uploadProgress}
//                 text={uploaded ? "✔" : `${uploadProgress}%`}
//                 strokeWidth={5}
//                 styles={buildStyles({
//                   strokeLinecap: "round",
//                   textSize: "24px",
//                   pathTransition: "ease",
//                   textColor: uploaded ? "green" : "gray",
//                   pathColor: uploaded ? "green" : "gray",
//                   trailColor: "#eee",
//                 })}
//               />
//             </div>
//             {uploaded && (
//               <div className="text-center mt-2">
//                 <p className="text-gray-600">
//                 <i className="fas fa-file-audio text-lg text-gray-500 pr-2"></i>
//                   {audioFile?.name} ({audioFile!.size / 1000} KB)
//                 </p>
//                 <p className="text-green-500">
//                   You audio file is uploaded successfully. Please click on the
//                   start analyzing button to start the analysis.
//                 </p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//       {uploaded && (
//         <>
//           <audio
//             src={URL.createObjectURL(audioFile!)}
//             controls
//             className="w-full mt-4"
//           />
//           <button
//             onClick={startAnalyzing}
//             disabled={loading}
//             className="bg-blue-500 text-white px-6 py-2 rounded mt-4"
//           >
//             Start Analyzing
//           </button>
//           <>
//             {/* Dialog for Whisper API progress */}
//             <Dialog open={openDialog}>
//               <DialogTitle>
//                 Your Audio is being analyzed. Please be patient.
//               </DialogTitle>
//               <DialogContent>
//                 <div className="w-full relative">
//                   <LinearProgress />
//                   {/* <span className="text-xs">{progress.toFixed(0)}%</span> */}
//                 </div>
//                 <p className="mt-4 text-sm">
//                   Did you know? &quot;{randomFact}&quot;
//                 </p>
//               </DialogContent>
//             </Dialog>
//             {/* Display converted text from audio */}
//             {convertedText !== "" && (
//               <Draggable axis="y">
//                 <div className="mb-4 bg-white rounded-xl shadow-lg p-4 hover:bg-gray-100 transition cursor-copy border mx-auto max-w-screen-lg">
//                   <h2 className="text-lg font-bold mt-4">Transcribed Text</h2>
//                   <p className="mt-1 text-gray-600 w-full mx-auto p-2 prose prose-sm max-w-screen-xl prose-indigo md:prose-base dark:prose-invert overflow-auto">
//                     {convertedText}
//                   </p>
//                 </div>
//               </Draggable>
//             )}
//             {generatedContent && (
//               <>
//                 <div
//                   className="flex flex-col gap-4 mx-auto max-w-screen-lg"
//                   ref={contentRef}
//                 >
//                   {generatedContent
//                     .substring(generatedContent.indexOf("1") + 3)
//                     .split("2.")
//                     .map((content, index) => {
//                       return (
//                         <Draggable axis="y" key={content}>
//                           <div
//                             className="bg-white rounded-xl shadow-lg p-4 hover:bg-gray-100 transition cursor-copy border"
//                             onClick={() => {
//                               navigator.clipboard.writeText(content);
//                               toast("Bio copied to clipboard", {
//                                 icon: "✂️",
//                               });
//                             }}
//                             key={content}
//                           >
//                             {index === 0 && (
//                               <>
//                                 <h2 className="text-lg font-bold mb-1">
//                                   Feedback on your speech
//                                 </h2>
//                                 <p className="text-gray-600 w-full mx-auto p-2 prose prose-sm max-w-screen-xl prose-indigo md:prose-base dark:prose-invert overflow-auto">
//                                   <ReactMarkdown>
//                                     {preprocessMarkdown(content)}
//                                   </ReactMarkdown>
//                                 </p>
//                               </>
//                             )}
//                             {index === 1 && (
//                               <>
//                                 <h2 className="text-lg font-bold mb-1">
//                                   Revised Speech with Improvements
//                                 </h2>
//                                 {content.split("3.").map((content, index) => {
//                                   return (
//                                     <div key={content}>
//                                       {index === 0 && (
//                                         <p className="text-gray-600 w-full mx-auto p-2 prose prose-sm max-w-screen-xl prose-indigo md:prose-base dark:prose-invert overflow-auto">
//                                           <ReactMarkdown>
//                                             {preprocessMarkdown(content)}
//                                           </ReactMarkdown>
//                                         </p>
//                                       )}
//                                       {index === 1 && (
//                                         <p className="text-gray-600 mt-3 w-full mx-auto p-2 prose prose-sm max-w-screen-xl prose-indigo md:prose-base dark:prose-invert overflow-auto">
//                                           <ReactMarkdown>
//                                             {preprocessMarkdown(content)}
//                                           </ReactMarkdown>
//                                         </p>
//                                       )}
//                                     </div>
//                                   );
//                                 })}
//                               </>
//                             )}
//                           </div>
//                         </Draggable>
//                       );
//                     })}
//                 </div>
//               </>
//             )}
//           </>
//         </>
//       )}
//     </div>
//   );
// };

// export default AudioFileUpload;
