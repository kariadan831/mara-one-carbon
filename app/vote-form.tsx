"use client";

import React, { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function VoteForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [vote, setVote] = useState("YES");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !phone || !email) {
      setStatus("❌ Please fill all fields");
      return;
    }

    setLoading(true);
    setStatus("Saving vote...");

    try {
      const reference = `VOTE_${Date.now()}_${vote}`;

      const docRef = await addDoc(collection(db, "votes"), {
        name,
        phone,
        email,
        vote,
        message,
        reference,
        paid: false,
        createdAt: serverTimestamp(),
      });

      setStatus("Redirecting to payment...");

      const res = await fetch("/api/pesapal/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 50,
          phone,
          email,
          firstName: name.split(" ")[0] || "User",
          lastName: name.split(" ")[1] || "User",
          reference,
        }),
      });

      const data = await res.json();

      if (data.redirect_url) {
        sessionStorage.setItem(
          "pending_vote",
          JSON.stringify({
            id: docRef.id,
            reference,
            vote,
          })
        );

        window.location.href = data.redirect_url;
      } else {
        setStatus("❌ Payment failed");
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Error saving vote");
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
        onChange={(e) => setVote(e.target.value)}
        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
      >
        <option value="YES">YES</option>
        <option value="NO">NO</option>
      </select>

      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500 min-h-[120px]"
      />

      <button
        disabled={loading}
        className="w-full rounded-lg bg-emerald-500 py-3 font-bold text-black hover:bg-emerald-400 transition disabled:opacity-60"
      >
        {loading ? "Processing..." : "Submit (50 KES)"}
      </button>

      {status && (
        <p className="text-sm text-slate-300 text-center">
          {status}
        </p>
      )}
    </form>
  );
}