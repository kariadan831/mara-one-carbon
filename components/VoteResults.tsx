"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";

// Clean Vote type
type Vote = {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  vote?: "YES" | "NO";
  message?: string;
  paid?: boolean;
  createdAt?: any;
};

export default function VoteResults() {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "votes"), (snapshot) => {
      const results: Vote[] = snapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          vote: data.vote,
          message: data.message,
          paid: data.paid,
          createdAt: data.createdAt,
        };
      });

      setVotes(results);
    });

    return () => unsubscribe();
  }, []);

  // SAFE COUNTS
  const yesVotes = votes.filter((v) => v.vote === "YES").length;
  const noVotes = votes.filter((v) => v.vote === "NO").length;

  return (
    <div className="mt-10 text-white px-4">
      <h2 className="mb-6 text-3xl font-bold">
        Public Voting Results
      </h2>

      {/* YES & NO ONLY */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-green-600 p-4">
          <h3 className="text-xl font-bold">YES</h3>
          <p className="text-3xl">{yesVotes}</p>
        </div>

        <div className="rounded-xl bg-red-600 p-4">
          <h3 className="text-xl font-bold">NO</h3>
          <p className="text-3xl">{noVotes}</p>
        </div>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {votes.length === 0 ? (
          <p className="text-gray-300">No votes yet</p>
        ) : (
          votes.map((vote) => {
            const isOpen = expanded === vote.id;

            return (
              <div
                key={vote.id}
                onClick={() =>
                  setExpanded(isOpen ? null : vote.id)
                }
                className="cursor-pointer rounded-xl bg-slate-800 p-4 transition hover:bg-slate-700"
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

                {/* MESSAGE (COLLAPSIBLE) */}
                <p
                  className={`mt-2 text-gray-300 transition-all duration-300 ${
                    isOpen ? "" : "line-clamp-2"
                  }`}
                >
                  {vote.message ?? "No message"}
                </p>

                {/* HINT */}
                <p className="mt-2 text-xs text-gray-500">
                  {isOpen
                    ? "Click to collapse"
                    : "Click to expand"}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}