import Link from "next/link";
import { prisma } from "@/lib/db/prisma";

export default async function AboutPage() {
  let content = "";
  try {
    const page = await prisma.eventPage.findFirst({
      where: { slug: "about", isEnabled: true },
    });
    content = page?.content || "";
  } catch {
    content = "";
  }

  if (!content) {
    content = `The Legacy Circle 2027 is an exclusive Social Impact and Fundraising Gala bringing together renowned philanthropists, corporate leaders, influential personalities and changemakers to inspire generosity, build meaningful partnerships and create lasting social impact.

Join us for three days of inspiring conversations, premium networking, fundraising initiatives and celebrations of positive change.

17–19 February 2027 | The Leela Palace, New Delhi

Where Giving Creates a Lasting Legacy.`;
  }

  return (
    <div className="min-h-screen bg-navy-950 text-gold-100">
      <header className="border-b border-gold-500/20">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-display text-xl text-gold-400">LEGACY CIRCLE</Link>
          <Link href="/" className="text-sm text-gold-200/70 hover:text-gold-400">← Home</Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-20">
        <p className="text-sm uppercase tracking-[0.25em] text-gold-500">About</p>
        <h1 className="mt-3 font-display text-4xl md:text-5xl text-gold-100">The Legacy Circle 2027</h1>
        <div className="section-divider my-10" />
        <div className="prose prose-invert max-w-none space-y-6 text-lg leading-relaxed text-gold-200/80 whitespace-pre-line">
          {content}
        </div>
      </main>
    </div>
  );
}
