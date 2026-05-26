"use client";

import { useState } from "react";

export default function VoteForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [vote, setVote] = useState("YES");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus("Sending payment prompt...");

    const res = await fetch("/api/mpesa/stkpush", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, vote, message }),
    });

    const data = await res.json();
    setStatus(data.message || "Request sent");

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-10 grid max-w-2xl gap-4 rounded-2xl bg-slate-900 p-6">
      <input
        className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
        placeholder="Full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
        placeholder="Phone number e.g. 2547XXXXXXXX"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <select
        className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
        value={vote}
        onChange={(e) => setVote(e.target.value)}
      >
        <option value="YES">YES</option>
        <option value="NO">NO</option>
      </select>
      <textarea
        className="min-h-32 rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
        placeholder="Write your views here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        disabled={loading}
        className="rounded-full bg-emerald-500 px-6 py-3 font-semibold text-black disabled:opacity-60"
      >
        {loading ? "Processing..." : "Pay & Submit"}
      </button>
      {status && <p className="text-sm text-slate-300">{status}</p>}
    </form>
  );
}