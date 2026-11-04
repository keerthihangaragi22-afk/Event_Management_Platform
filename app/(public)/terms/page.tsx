import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-navy-950 text-gold-100">
      <header className="border-b border-gold-500/20">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-display text-xl text-gold-400">LEGACY CIRCLE</Link>
          <Link href="/" className="text-sm text-gold-200/70 hover:text-gold-400">← Home</Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="font-display text-4xl text-gold-100">Terms & Conditions</h1>
        <div className="section-divider my-8" />
        <ul className="space-y-4 text-lg text-gold-200/80">
          <li>• Registration is subject to invitation and approval.</li>
          <li>• Entry is permitted only with a valid confirmation or invitation pass.</li>
          <li>• Guests must follow event guidelines and venue policies.</li>
          <li>• Event schedules and speakers may change.</li>
          <li>• Photography and videography may take place during the event, subject to applicable consent requirements.</li>
        </ul>
      </main>
    </div>
  );
}
