import React, { useEffect, useState } from "react";
import { auth, db } from "@/firebase/config ";
import { Editor } from "@tinymce/tinymce-react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { toast } from "react-hot-toast";
import {
  Timestamp,
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import WelcomeDialog from "./WelcomeDialog";

const InputSection = () => {
  const [signInWithGoogle, user, userLoading, error] = useSignInWithGoogle(auth);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  if (error) toast.error(error.message);

  useEffect(() => {
    if (user) {
      // store the user in the local storage to persist the user
      localStorage.setItem("user", JSON.stringify(user));
      // you can fetch the user from local storage using JSON.parse(localStorage.getItem("user")) i.e.,
      // const user = JSON.parse(localStorage.getItem("user"));
      toast.success(`Welcome ${user?.user?.displayName}`);
    }
  }, [user]);

  const handleSend = async () => {
    if (!message) {
      toast.error("Message can't be empty");
      return;
    }
    if (!user) {
      toast.error("You must be logged in to send a message");
      return;
    }

    try {
      // count messages sent by user in the last 5 seconds
      const messagesRef = collection(db, "messages");
      const q = query(messagesRef, where("userId", "==", user?.user?.uid));
      const querySnapshot = await getDocs(q);
      console.log(querySnapshot);

      if (querySnapshot.size > 5) {
        toast.error("You can't send more than 5 messages in a day");
        return;
      }

      setLoading(true);


      const prompt = `You're an AI model that checks if a message contains 1.Profanity 2. Unhelpful content for users to improve their english.
      If the message is obeying above rules, you should return "Yes" followed by a reason why message can't be sent. \n\nText: ${message} \n\nLabel: \n\nReason:`;

      const response = await fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "text-davinci-003",
          prompt,
          max_tokens: 64,
          temperature: 0.7,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0.3,
          stream: false,
        }),
      });

      const data = await response.json();

      const label = data.choices[0].text;

      // check if lable string includes "Yes" or "No"
      if (label.includes("No")) {
        toast.error(
          `Your message can't sent. Reason: ${
            label.split("No")[1]
          }`,
          {
            duration: 10000, 
          }
        );
        setLoading(false);
        return;
      }

      await addDoc(collection(db, "messages"), {
        userId: user?.user?.uid,
        text: message,
        name: user?.user?.displayName,
        avatar: user?.user?.photoURL,
        createdAt: serverTimestamp(), // serverTimestamp() fetches the time from the server
        likes: [user?.user?.uid],
      });
      setMessage("");
      setLoading(false);
    } catch (error: any) {
      toast.error(error?.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-0 w-full p-4 bg-gray-100 border-t border-gray-200">
      <div className="flex items-center space-x-2">
        {!user && (
          <button
            onClick={() => signInWithGoogle()}
            className="mr-4 py-2 px-4 bg-blue-600 text-white rounded"
          >
            Sign In
          </button>
        )}

        <Editor
          apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
          value={message}
          onEditorChange={(newValue) => setMessage(newValue)}
          init={{
            width: "100%",
            menubar: false,
            statusbar: false,
            autoresize_bottom_margin: 0,
            plugins:
              "link lists emoticons image autoresize codesample wordcount",
            toolbar:
              "bold italic strikethrough link numlist bullist blockquote emoticons image codesample | sendBtn",
            codesample_languages: [
              { text: "HTML/XML", value: "markup" },
              { text: "JavaScript", value: "javascript" },
              { text: "CSS", value: "css" },
              { text: "PHP", value: "php" },
              { text: "Ruby", value: "ruby" },
              { text: "Python", value: "python" },
              { text: "Java", value: "java" },
              { text: "C", value: "c" },
              { text: "C#", value: "csharp" },
              { text: "C++", value: "cpp" },
            ],
            content_style:
              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
          }}
        />
        {user && (
          <button
            onClick={handleSend}
            disabled={loading}
            className={`ml-4 py-2 px-4 bg-green-600 text-white rounded ${loading && "opacity-50 cursor-not-allowed"}`}
          >
            {loading ? (
            <div className="mx-auto animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
            "Send"
            )}
          </button>
        )}
      </div>
      <span className="text-xs text-center flex items-center justify-center">
        {user
          ? "You can send 5 messages per day."
          : "Sign in to send messages."}{" "}
        Messages are deleted after 24 hours.{" "}
        <label
          className="text-blue-600 underline cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          Learn more
        </label>
      </span>
      <WelcomeDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default InputSection;
