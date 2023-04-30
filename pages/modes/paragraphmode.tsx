import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import ParagraphMode from "@/components/ParagraphMode ";
import Welcome from "@/components/ParagraphModePage/Welcome ";
import { generateContent } from "@/utils/Gpt3API ";

const WriterMode = () => {
  const [start, setStart] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");

  const handleClick = () => {
    setOpenDialog(true);
  };
  const handleClose = async (fromButton: boolean = false) => {
    if (fromButton) {
      setLoading(true);
      await generateContent(
        "Write just one random topic for the user to write on and a really short description giving hints to user on what they could write on. The format should be Topic: <topic> Description: <description>",
        setTitle
      );
      setStart(true);
      setLoading(false);
    }
    setOpenDialog(false);
  };

  const ParagraphModeProps = { title, start };

  return (
    <div className="max-w-screen-lg mx-auto py-4 px-2 flex flex-col">
      {!start ? (
        <Welcome handleClick={handleClick} />
      ) : (
        <ParagraphMode {...ParagraphModeProps} />
      )}
      <Dialog
        open={openDialog}
        onClose={() => handleClose(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Tips before you get started
        </DialogTitle>
        <DialogContent>
          <ul className="list-disc list-inside text-base">
            <li>
              Be in a quiet place with no distractions. Speak clearly and
              confidently.
            </li>
            <li>Stay calm and focused, even if the topic is unfamiliar.</li>
            <li>Think of a clear structure for your speech and stick to it.</li>
            <li>
              It’s okay to make a mistake, just correct yourself and keep going.
            </li>
          </ul>
        </DialogContent>
        <DialogActions>
          <button
            className="bg-blue-500 px-4 py-2 w-full rounded-md text-white"
            disabled={loading}
            onClick={() => handleClose(true)}
          >
            {loading ? (
              <div className="mx-auto animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              "Let's go"
            )}
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default WriterMode;
