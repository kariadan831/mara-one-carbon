"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";

import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";

// Vote type
type Vote = {
  id: string;
  name: string;
  email: string;
  phone: string;
  vote: string;
  message: string;
  paid: boolean;
};

export default function VoteResults() {
  const [votes, setVotes] = useState<Vote[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "votes"),
      where("paid", "==", true),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results: Vote[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Vote, "id">),
      }));

      setVotes(results);
    });

    return () => unsubscribe();
  }, []);

  const yesVotes = votes.filter((v) => v.vote === "YES").length;
  const noVotes = votes.filter((v) => v.vote === "NO").length;

  return (
    <div className="mt-10 text-white">
      <h2 className="mb-6 text-3xl font-bold">
        Public Voting Results
      </h2>

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
          <h3 className="text-xl font-bold">Subscribers</h3>
          <p className="text-3xl">{votes.length}</p>
        </div>
      </div>

      <div className="space-y-4">
        {votes.map((vote) => (
          <div
            key={vote.id}
            className="rounded-xl bg-slate-800 p-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold">{vote.name}</h3>

              <span
                className={
                  vote.vote === "YES"
                    ? "text-green-400"
                    : "text-red-400"
                }
              >
                {vote.vote}
              </span>
            </div>

            <p className="mt-2 text-gray-300">
              {vote.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}