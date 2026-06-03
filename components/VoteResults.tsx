"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";

type Vote = {
  id: string;
  name?: string;
  vote?: "YES" | "NO";
  message?: string;
};

export default function VoteResults() {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "votes"), (snapshot) => {
      const results: Vote[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Vote[];

      setVotes(results);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="mt-10 text-white px-4">
      <h2 className="mb-6 text-3xl font-bold">
        Public Voting Results
      </h2>

      {/* LIST */}
      {votes.length === 0 ? (
        <p className="text-gray-300">No votes yet</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {votes.map((vote) => {
            const isOpen = expanded === vote.id;

            return (
              <div
                key={vote.id}
                onClick={() =>
                  setExpanded(isOpen ? null : vote.id)
                }
                className="cursor-pointer rounded-xl bg-slate-800 p-5 transition hover:bg-slate-700"
              >
                {/* HEADER */}
                <div className="flex items-center justify-between">
                  <h3 className="font-bold">
                    {vote.name ?? "Anonymous"}
                  </h3>

                  <span
                    className={
                      vote.vote === "YES"
                        ? "text-green-400"
                        : vote.vote === "NO"
                        ? "text-red-400"
                        : "text-gray-400"
                    }
                  >
                    {vote.vote || "Pending"}
                  </span>
                </div>

                {/* MESSAGE */}
                <p
                  className={`mt-3 text-gray-300 text-sm ${
                    isOpen ? "" : "line-clamp-2"
                  }`}
                >
                  {vote.message ?? "No message"}
                </p>

                {/* HINT */}
                <p className="mt-3 text-xs text-gray-500">
                  {isOpen ? "Click to collapse" : "Click to expand"}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}