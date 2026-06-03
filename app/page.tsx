import VoteFeed from "@/components/VoteFeed";
import VoteResults from "@/components/VoteResults";
import VoteForm from "./vote-form";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* HERO SECTION */}
      <section className="px-6 py-20 text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-emerald-400">
          Mara One Carbon Public Voice
        </p>

        <h1 className="mt-4 text-4xl font-bold md:text-6xl">
          Give Your Voice on Mara One Carbon
        </h1>

        <p className="mt-6 mx-auto max-w-2xl text-lg text-slate-300">
          Vote YES or NO, and share your opinion in real time.
        </p>
      </section>

      {/* VOTE FORM */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
          <h2 className="mb-6 text-center text-xl font-semibold">
            Cast Your Vote
          </h2>
          <VoteForm />
        </div>
      </section>

      {/* RESULTS */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6 text-xl font-semibold">
            Public Results
          </h2>
          <VoteResults />
        </div>
      </section>

      {/* LIVE FEED */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6 text-xl font-semibold">
            Live Voting Feed
          </h2>
          <VoteFeed />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-10 border-t border-slate-800 py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Mara One Carbon Public Voice
      </footer>

    </main>
  );
}