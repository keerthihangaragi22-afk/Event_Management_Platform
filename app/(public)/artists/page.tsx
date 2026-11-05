import Link from "next/link";

export default function ArtistsPage() {
  return (
    <div className="min-h-screen bg-navy-950 text-gold-100">
      <header className="border-b border-gold-500/20">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-display text-xl text-gold-400">
            LEGACY CIRCLE
          </Link>
          <Link href="/" className="text-sm text-gold-200/70 hover:text-gold-400">
            ← Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-20">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-gold-500">Entertainment</p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl text-gold-100">
            Artists & Performers
          </h1>
        </div>
        <div className="section-divider my-10" />
        <p className="text-center text-lg leading-relaxed text-gold-200/80">
          Special performances and entertainment experiences throughout the gala. Artist and
          performer line-up will be announced closer to the event.
        </p>
      </main>
    </div>
  );
}
