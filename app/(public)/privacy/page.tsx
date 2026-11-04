import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-navy-950 text-gold-100">
      <header className="border-b border-gold-500/20">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-display text-xl text-gold-400">LEGACY CIRCLE</Link>
          <Link href="/" className="text-sm text-gold-200/70 hover:text-gold-400">← Home</Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="font-display text-4xl text-gold-100">Privacy Policy</h1>
        <div className="section-divider my-8" />
        <p className="text-lg leading-relaxed text-gold-200/80">
          We respect the privacy of our guests and are committed to protecting personal information
          collected during invitation registration. Guest information will be used for event
          communication, registration management and related event services in accordance with
          applicable privacy laws.
        </p>
      </main>
    </div>
  );
}
