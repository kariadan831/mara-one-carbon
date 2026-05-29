"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";

type Vote = {
  vote?: string;
  message?: string;
  paid?: boolean;
};

export default function Stats() {
  const [votes, setVotes] = useState<Vote[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "votes"),
      where("paid", "==", true)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data: Vote[] = snapshot.docs.map((doc) => ({
        ...(doc.data() as Vote),
      }));

      setVotes(data);
    });

    return () => unsub();
  }, []);

  // TOTAL
  const total = votes.length;

  // YES
  const yes = votes.filter(
    (v) => (v.vote || "").toUpperCase() === "YES"
  ).length;

  // NO
  const no = votes.filter(
    (v) => (v.vote || "").toUpperCase() === "NO"
  ).length;

  // COMMENTS
  const comments = votes.filter(
    (v) => v.message && v.message.trim() !== ""
  ).length;

  return (
    <div className="mx-auto mt-10 max-w-6xl px-6">
      {/* GRID */}
      <div className="grid gap-4 md:grid-cols-3">

        {/* YES */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 shadow hover:border-green-500 transition text-center">
          <p className="text-sm text-slate-400">YES Votes</p>
          <h2 className="mt-2 text-3xl font-bold text-green-400">
            {yes}
          </h2>
        </div>

        {/* NO */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 shadow hover:border-red-500 transition text-center">
          <p className="text-sm text-slate-400">NO Votes</p>
          <h2 className="mt-2 text-3xl font-bold text-red-400">
            {no}
          </h2>
        </div>

        {/* COMMENTS */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 shadow hover:border-blue-500 transition text-center">
          <p className="text-sm text-slate-400">Comments</p>
          <h2 className="mt-2 text-3xl font-bold text-blue-400">
            {comments}
          </h2>
        </div>

      </div>
    </div>
  );
}