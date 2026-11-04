import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-navy-950 text-gold-100">
      <header className="border-b border-gold-500/20">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-display text-xl text-gold-400">LEGACY CIRCLE</Link>
          <Link href="/" className="text-sm text-gold-200/70 hover:text-gold-400">← Home</Link>
        </div>
      </header>
      <main className="mx-auto max-w-xl px-6 py-20 text-center">
        <p className="text-sm uppercase tracking-[0.25em] text-gold-500">Get in Touch</p>
        <h1 className="mt-3 font-display text-4xl text-gold-100">Contact</h1>
        <div className="section-divider my-10 mx-auto max-w-xs" />
        <div className="space-y-6 text-lg text-gold-200/80">
          <p>
            <span className="block text-sm text-gold-500">Email</span>
            <a href="mailto:connect@thelegacycircle.com" className="text-gold-300 hover:underline">
              connect@thelegacycircle.com
            </a>
          </p>
          <p>
            <span className="block text-sm text-gold-500">Phone</span>
            <a href="tel:+917676496280" className="text-gold-300 hover:underline">
              7676496280
            </a>
          </p>
          <p>
            <span className="block text-sm text-gold-500">Website</span>
            <span className="text-gold-300">www.thelegacycircle.org</span>
          </p>
        </div>
      </main>
    </div>
  );
}
