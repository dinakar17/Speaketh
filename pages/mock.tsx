// components/tabs.tsx
import { useState } from 'react';

type TabType = 'record' | 'upload';

interface TabProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const Tab: React.FC<TabProps> = ({ active, onClick, children }) => (
  <button
    className={`py-2 px-4 rounded-lg font-semibold ${
      active ? 'bg-white' : 'bg-transparent'
    }`}
    onClick={onClick}
  >
    {children}
  </button>
);

interface TabsProps {
  uploadAudio: React.FC;
  recordAudio: React.FC;
}

const Tabs: React.FC<TabsProps> = ( UploadAudio , RecordAudio ) => {
  const [activeTab, setActiveTab] = useState<TabType>('record');

  const handleClick = (tab: TabType) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="bg-[#F1F1F1] p-2 rounded-lg flex gap-4">
          <Tab
            active={activeTab === 'record'}
            onClick={() => handleClick('record')}
          >
            Record Audio
          </Tab>
          <Tab
            active={activeTab === 'upload'}
            onClick={() => handleClick('upload')}
          >
            Upload Audio
          </Tab>
      </div>
      <div className="border border-t-0 p-4 rounded-b-lg">
        {activeTab === 'record' && <p>Record audio here...</p>}
        {activeTab === 'upload' && <p>Upload audio here...</p>}
      </div>
    </div>
  );
};

export default Tabs;

// Todo: Modify to accept any number of tabs