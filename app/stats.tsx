"use client";

import { useState } from "react";

export default function Stats() {
  const [subscribers] = useState(0);
  const [yesVotes] = useState(0);
  const [noVotes] = useState(0);
  const [comments] = useState(0);

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="mb-8 text-center text-3xl font-bold">Live Stats</h2>
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-slate-900 p-6 text-center">
          <p className="text-sm text-slate-400">Total Subscribers</p>
          <p className="mt-2 text-4xl font-bold text-emerald-400">{subscribers}</p>
        </div>
        <div className="rounded-2xl bg-slate-900 p-6 text-center">
          <p className="text-sm text-slate-400">YES Votes</p>
          <p className="mt-2 text-4xl font-bold text-emerald-400">{yesVotes}</p>
        </div>
        <div className="rounded-2xl bg-slate-900 p-6 text-center">
          <p className="text-sm text-slate-400">NO Votes</p>
          <p className="mt-2 text-4xl font-bold text-rose-400">{noVotes}</p>
        </div>
        <div className="rounded-2xl bg-slate-900 p-6 text-center">
          <p className="text-sm text-slate-400">Comments</p>
          <p className="mt-2 text-4xl font-bold text-cyan-400">{comments}</p>
        </div>
      </div>
    </section>
  );
}