import React from 'react';
import AudioFileUpload from '../../components/AudioFileUpload';

const PresentationMode: React.FC = () => {
  const [slideText, setSlideText] = React.useState<string>("");

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-center mb-8">Presentation Mode</h1>
      
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Paste your slide text here</h2>
        <p className="text-gray-700 mb-2">Copy and paste your presentation slides text which will help us to see whether your speech is relevant to this or not</p>
        <textarea className="w-full h-40 border rounded shadow p-4" 
        onChange={(e) => setSlideText(e.target.value)} value={slideText}
        />
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold mb-2">Upload your audio</h2>
        <p className="text-gray-700 mb-4">Please kindly record your audio either on your local computer or somewhere and upload it here</p>
        <AudioFileUpload slideText={slideText}/>
      </div>
    </div>
  );
};

export default PresentationMode;
