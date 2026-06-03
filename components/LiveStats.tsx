"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";

type Vote = {
  vote?: "YES" | "NO";
};

export default function LiveStats() {
  const [yes, setYes] = useState(0);
  const [no, setNo] = useState(0);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "votes"), (snapshot) => {
      let yesCount = 0;
      let noCount = 0;

      snapshot.forEach((doc) => {
        const data = doc.data() as Vote;

        if (data.vote === "YES") yesCount++;
        if (data.vote === "NO") noCount++;
      });

      setYes(yesCount);
      setNo(noCount);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* YES */}
      <div className="rounded-xl bg-green-600 p-6 text-center shadow-lg">
        <h3 className="text-xl font-bold">YES Votes</h3>
        <p className="mt-2 text-4xl font-extrabold">{yes}</p>
      </div>

      {/* NO */}
      <div className="rounded-xl bg-red-600 p-6 text-center shadow-lg">
        <h3 className="text-xl font-bold">NO Votes</h3>
        <p className="mt-2 text-4xl font-extrabold">{no}</p>
      </div>
    </div>
  );
}