import Button from "@/components/ui/button ";
import { Flame } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { fetchRandomTitle } from "@/utils/helpers ";
import ParagraphMode from "@/components/ParagraphMode ";

type ListItemProps = {
  icon: React.ReactNode;
  text: string;
};

const ListItem: React.FC<ListItemProps> = ({ icon, text }) => (
  <div className="flex">
    <div className="mr-2">{icon}</div>
    <div>{text}</div>
  </div>
);

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
      // Todo: Fetch Title and description from GPT-3
      const randomTitle = await fetchRandomTitle();
      setTitle(randomTitle);
      setStart(true);
      setLoading(false);
    }
    setOpenDialog(false);
  };

  const ParagraphModeProps = { title, start };

  return (
    <div className="max-w-screen-lg mx-auto py-4 px-2 flex flex-col">
      {!start ? (
        <div className="p-8">
          <h1 className="text-3xl text-center font-bold mb-8">
            Welcome to the{" "}
            <span className="text-purple-600">
              Write a paragraph in 1 min mode
            </span>
          </h1>
          <div className="flex justify-center">
            <Image
              src="/images/paragraphmode.png"
              alt="Speech Mode"
              width={300}
              height={200}
            />
          </div>

          <div className="grid grid-cols-2 gap-8 mt-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Rules</h2>
              <ol className="list-decimal list-inside text-gray-800">
                <li>Tap &quot;I understand&quot; to begin.</li>
                <li>
                  Preview the topic for 5-10 seconds, then start the stopwatch.
                </li>
                <li>
                  Type your thoughts within 30 seconds – the recording stops
                  automatically if you go over the limit.
                </li>
                <li>
                  Hit &quot;start analyzing&quot; to receive feedback and learn
                  from your mistakes – the key to personal growth!
                </li>
              </ol>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4">Perks</h2>
              <ul className="list-none list-inside text-gray-800">
                <ListItem
                  icon="🚀"
                  text="Boost your writing speed & efficiency"
                />
                <ListItem
                  icon="🧠"
                  text=" Sharpen your thought process & critical thinking"
                />
                <ListItem
                  icon="💡"
                  text="Enhance creativity & expressiveness"
                />
                <ListItem icon="📈" text="Track your progress & growth" />
                <ListItem
                  icon="🏆"
                  text=" Build confidence in your writing abilities"
                />
              </ul>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <Button
              bgcolor="bg-blue-500"
              icon={<Flame />}
              eventHandler={handleClick}
            >
              I&apos;m ready
            </Button>
          </div>
        </div>
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
