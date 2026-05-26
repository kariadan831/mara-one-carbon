import VoteForm from "./vote-form";
import Stats from "./stats";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.35em] text-emerald-400">
          Mara One Carbon Public Voice
        </p>
        <h1 className="max-w-3xl text-4xl font-bold md:text-6xl">
          Give Your Voice on Mara One Carbon
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-300">
          Vote YES or NO, and share your opinion in real time.
        </p>
      </section>

      <Stats />
      <section className="mx-auto max-w-5xl px-6 pb-16">
        <VoteForm />
      </section>
    </main>
  );
}