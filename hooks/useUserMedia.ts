// hooks/useUserMedia.ts

import { useEffect, useState } from "react";

const useUserMedia = () => {
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  
    useEffect(() => {
      async function getMedia() {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          setMediaStream(stream);
        } catch (err) {
          console.error('Error accessing user media:', err);
        }
      }
      getMedia();
  
      return () => {
        if (mediaStream) {
          mediaStream.getTracks().forEach((track) => track.stop());
        }
      };
    }, []);
  
    return mediaStream;
  };

  export default useUserMedia;
  