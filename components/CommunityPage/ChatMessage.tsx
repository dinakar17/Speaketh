import { auth, db } from "@/firebase/config ";
import {
  DocumentReference,
  Timestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ThumbsUp, Trash2 } from "lucide-react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-hot-toast";

interface Message {
  userId: string;
  text: string;
  name: string;
  avatar: string;
  createdAt: Timestamp;
  id: string;
  likes: string[];
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const [user, loading, error] = useAuthState(auth);

  // const formatTimestamp = (timestamp: Timestamp) => {
  //   const messageDate = timestamp.toDate();
  //   const now = new Date();
  //   const diffInMilliseconds = now.getTime() - messageDate.getTime();
  //   const diffInMinutes = Math.floor(diffInMilliseconds / 1000 / 60);

  //   if (diffInMinutes < 30) {
  //     return `${diffInMinutes} min ago`;
  //   } else {
  //     return messageDate.toLocaleTimeString([], {
  //       hour: "2-digit",
  //       minute: "2-digit",
  //     });
  //   }
  // };

  const handleDelete = async () => {
    // construct a reference to the message document
    const messageRef: DocumentReference = doc(db, "messages", message.id);

    // just delete the text of the message from the firestore
    await updateDoc(messageRef, {
      text: "",
    });
    toast.success("Message deleted");
  };

  const handleLike = async () => {
    const messageRef: DocumentReference = doc(db, "messages", message.id);
    if (!user) {
      toast.error("You must be logged in to like a message");
      return;
    }

    // if the user has already liked the message, remove their like
    if (message.likes.includes(user?.uid)) {
      await updateDoc(messageRef, {
        likes: message.likes.filter((id) => id !== user?.uid),
      });
    } else {
      // otherwise, add their like
      await updateDoc(messageRef, { likes: [...message.likes, user?.uid] });
    }
  };

  return (
    <div>
      <div
        className={`chat ${
          message.userId === user?.uid ? "chat-end" : "chat-start"
        }`}
      >
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img src={message.avatar} alt="avatar" />
          </div>
        </div>
        <div className="chat-header">
          {message.name}
          <time className="pl-1 text-xs opacity-50">
            {message?.createdAt?.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </time>
        </div>
        {/* dangerously set html text */}
        {message.text ? (
          <div
            className="chat-bubble"
            dangerouslySetInnerHTML={{ __html: message.text }}
          ></div>
        ) : (
          <div className="chat-bubble text-red-500">Message deleted</div>
        )}
        <div className="chat-footer p-1 flex items-center space-x-2 opacity-50">
          <button
            className="tooltip tooltip-bottom rounded-full flex items-center p-1"
            onClick={handleLike}
            data-tip="Like"
          >
            <ThumbsUp
            fill={user?.uid && message?.likes?.includes(user?.uid) ? "#0461f7" : "none"}
            size={12} className="cursor-pointer" />
            <span className="pl-1 text-xs">{message?.likes?.length}</span>
          </button>
          {/* Delete button only shown to user */}
          {message.userId === user?.uid && (
            <button
              className="tooltip tooltip-bottom rounded-full p-1 text-red-500"
              data-tip="Delete"
            >
              <label htmlFor="my-modal-6">
                <Trash2 size={12} className="cursor-pointer" />
              </label>
            </button>
          )}
        </div>
      </div>
      <input type="checkbox" id="my-modal-6" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            Are you sure you want to delete this message?
          </h3>
          <p className="py-4">
            Deleting this message will show &quot;Message deleted&quot; to other
            users.
          </p>
          <div className="flex justify-evenly">
            <div className="modal-action">
              <label
                htmlFor="my-modal-6"
                onClick={handleDelete}
                className="btn"
              >
                Delete
              </label>
            </div>
            <div className="modal-action">
              <label htmlFor="my-modal-6" className="btn">
                Cancel
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
