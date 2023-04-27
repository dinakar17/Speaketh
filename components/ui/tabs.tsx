// components/tabs.tsx
import { useState } from "react";
import UploadAudio, { UploadAudioProps } from "../UploadAudio";
import RecordAudio, { RecordAudioProps } from "../RecordAudio";

type TabType = "record" | "upload";

interface TabProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const Tab: React.FC<TabProps> = ({ active, onClick, children }) => (
  <button
    className={`py-2 px-4 rounded-lg ${active ? "bg-white" : "bg-transparent"}`}
    onClick={onClick}
  >
    {children}
  </button>
);

interface TabsProps {
  recordAudioProps: RecordAudioProps;
  uploadAudioProps: UploadAudioProps;
}

const Tabs: React.FC<TabsProps> = ({recordAudioProps, uploadAudioProps}) => {
  const [activeTab, setActiveTab] = useState<TabType>("upload");

  const handleClick = (tab: TabType) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="bg-[#F1F1F1] p-2 rounded-lg flex gap-4">
        <Tab
          active={activeTab === "upload"}
          onClick={() => handleClick("upload")}
        >
          Upload Audio
        </Tab>
        <Tab
          active={activeTab === "record"}
          onClick={() => handleClick("record")}
        >
          Record Audio
        </Tab>
      </div>
      <div className="w-full mt-4">
        {activeTab === "record" && <RecordAudio {...recordAudioProps} />}
        {activeTab === "upload" && <UploadAudio {...uploadAudioProps} />}
      </div>
    </div>
  );
};

export default Tabs;

// Todo: Modify to accept any number of tabs
