"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

type Vote = {
  name?: string;
  vote?: string;
  message?: string;
};

export default function VoteFeed() {
  const [votes, setVotes] = useState<Vote[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "votes"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data: Vote[] = snapshot.docs.map((doc) => doc.data() as Vote);
      setVotes(data);
    });

    return () => unsub();
  }, []);

  return (
    <div className="mx-auto mt-10 max-w-5xl px-6">
      <h2 className="mb-6 text-2xl font-bold text-white">
        Public Voting Feed
      </h2>

      <div className="space-y-4">
        {votes.map((v, i) => (
          <div
            key={i}
            className="rounded-xl bg-slate-900 border border-slate-800 p-4 shadow hover:border-slate-700 transition"
          >
            {/* TOP ROW */}
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-white">
                {v.name || "Anonymous"}
              </h3>

              <span
                className={
                  (v.vote || "").toUpperCase() === "YES"
                    ? "rounded-full bg-green-500/20 px-3 py-1 text-sm font-bold text-green-400"
                    : "rounded-full bg-red-500/20 px-3 py-1 text-sm font-bold text-red-400"
                }
              >
                {v.vote}
              </span>
            </div>

            {/* COMMENT */}
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              {v.message || "No comment"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}