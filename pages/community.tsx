import { useCollection } from "react-firebase-hooks/firestore";
import {
  DocumentData,
  collection,
  deleteDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/firebase/config ";
import ChatSection from "@/components/CommunityPage/ChatSection ";

import InputSection from "@/components/CommunityPage/InputSection ";
import { useEffect, useState, Fragment } from "react";
import WelcomeDialog from "@/components/CommunityPage/WelcomeDialog ";

const Community = () => {
  const [value, loading, error] = useCollection(
    // sort by ascending order of createdAt
    query(collection(db, "messages"), orderBy("createdAt", "asc")),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  const [isOpen, setIsOpen] = useState(false);

  // pages/community.tsx    

  // Delete messages from the firebase database after 24 hours
  useEffect(() => {
    const interval = setInterval(async () => {
      const messagesRef = collection(db, "messages");
      const q = query(messagesRef, orderBy("createdAt", "asc"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const createdAt = doc.data().createdAt;
        if (
          createdAt &&
          createdAt.toMillis() + 24 * 60 * 60 * 1000 < Date.now()
        ) {
          deleteDoc(doc.ref);
        }
      });
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Show welcome dialog only on the first visit

  useEffect(() => {
    const visitedBefore = localStorage.getItem("visitedBefore");
    if (!visitedBefore) {
      setIsOpen(true);
      localStorage.setItem("visitedBefore", "true");
    }
  }, []);

  const messages: DocumentData[] | undefined = value?.docs?.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return (
    <>
      <div className="h-screen relative flex flex-col">
        <div className="h-[calc(100%-4rem)] overflow-auto pb-16">
          <ChatSection messages={messages} />
        </div>
        <InputSection />;
        <WelcomeDialog isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
    </>
  );
};

export default Community;
