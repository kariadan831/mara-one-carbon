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

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "votes"),
      (snapshot) => {
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
      }
    );

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

      {/* STATS */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-green-600 p-4">
          <h3 className="text-xl font-bold">YES</h3>
          <p className="text-3xl">{yesVotes}</p>
        </div>

        <div className="rounded-xl bg-red-600 p-4">
          <h3 className="text-xl font-bold">NO</h3>
          <p className="text-3xl">{noVotes}</p>
        </div>

        <div className="rounded-xl bg-blue-600 p-4">
          <h3 className="text-xl font-bold">TOTAL</h3>
          <p className="text-3xl">{votes.length}</p>
        </div>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {votes.length === 0 ? (
          <p className="text-gray-300">No votes yet</p>
        ) : (
          votes.map((vote) => (
            <div
              key={vote.id}
              className="rounded-xl bg-slate-800 p-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold">
                  {vote.name ?? "Anonymous"}
                </h3>

                <span
                  className={
                    vote.vote === "YES"
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {vote.vote ?? "N/A"}
                </span>
              </div>

              <p className="mt-2 text-gray-300">
                {vote.message ?? "No message"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}