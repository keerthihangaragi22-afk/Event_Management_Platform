import Link from "next/link";

export default function VenuePage() {
  return (
    <div className="min-h-screen bg-navy-950 text-gold-100">
      <header className="border-b border-gold-500/20">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-display text-xl text-gold-400">LEGACY CIRCLE</Link>
          <Link href="/" className="text-sm text-gold-200/70 hover:text-gold-400">← Home</Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-20">
        <p className="text-sm uppercase tracking-[0.25em] text-gold-500">Location</p>
        <h1 className="mt-3 font-display text-4xl md:text-5xl text-gold-100">The Leela Palace</h1>
        <p className="mt-2 text-gold-400">New Delhi</p>
        <div className="section-divider my-10" />
        <div className="space-y-6 text-lg text-gold-200/80">
          <p>
            <strong className="text-gold-300">Address</strong><br />
            The Leela Palace, Africa Avenue, Diplomatic Enclave,<br />
            Chanakyapuri, New Delhi, Delhi 110023, India
          </p>
          <p>
            <strong className="text-gold-300">Dates</strong><br />
            17–19 February 2027
          </p>
          <p>
            <strong className="text-gold-300">Timings</strong><br />
            9:00 AM – 10:00 PM
          </p>
          <a
            href="https://maps.app.goo.gl/QB7seZvzGT55wN8NA"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 rounded-sm border border-gold-500/40 px-6 py-3 text-sm uppercase tracking-wider text-gold-300 hover:border-gold-400"
          >
            Open in Google Maps →
          </a>
        </div>
      </main>
    </div>
  );
}
