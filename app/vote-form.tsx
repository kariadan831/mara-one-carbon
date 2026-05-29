"use client";

import React, { useState } from "react";

export default function VoteForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [vote, setVote] = useState<"YES" | "NO">("YES");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !phone || !email) {
      setStatus("❌ Please fill all required fields");
      return;
    }

    setLoading(true);
    setStatus("Submitting vote...");

    try {
      const reference = `VOTE_${Date.now()}`;

      const res = await fetch("/api/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          email,
          vote,
          message,
          reference,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("✅ Vote submitted successfully!");

        setName("");
        setPhone("");
        setEmail("");
        setMessage("");
        setVote("YES");
      } else {
        setStatus(data.message || "❌ Failed to submit vote");
      }
    } catch (error) {
      console.error(error);
      setStatus("❌ Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto grid max-w-2xl gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg"
    >
      <input
        placeholder="Full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
      />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
      />

      <input
        placeholder="Phone (2547XXXXXXXX)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
      />

      <select
        value={vote}
        onChange={(e) => setVote(e.target.value as "YES" | "NO")}
        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
      >
        <option value="YES">YES</option>
        <option value="NO">NO</option>
      </select>

      <textarea
        placeholder="Message (optional)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full min-h-32 rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
      />

      <button
        disabled={loading}
        className="w-full rounded-lg bg-emerald-500 py-3 font-bold text-black hover:bg-emerald-400 transition disabled:opacity-60"
      >
        {loading ? "Processing..." : "Submit Vote (FREE)"}
      </button>

      {status && (
        <p className="text-center text-sm text-slate-300">{status}</p>
      )}
    </form>
  );
}