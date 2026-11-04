import Link from "next/link";
import { prisma } from "@/lib/db/prisma";

export default async function SpeakersPage() {
  let speakers: any[] = [];
  try {
    speakers = await prisma.speaker.findMany({
      where: { isVisible: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch {
    speakers = [];
  }

  if (speakers.length === 0) {
    speakers = [
      { id: "1", name: "Chamique Holdsclaw", title: "Former WNBA Star & Advocate", bio: "Renowned basketball legend and mental health advocate." },
      { id: "2", name: "Solomon Thomas", title: "NFL Player & Mental Health Advocate", bio: "Professional athlete dedicated to mental health awareness." },
      { id: "3", name: "Aly Raisman", title: "Olympic Gold Medalist", bio: "Olympic champion and advocate for athlete safety." },
      { id: "4", name: "Dr. Tracy Dennis-Tiwary", title: "Professor & Author", bio: "Leading expert on anxiety, technology, and mental well-being." },
    ];
  }

  return (
    <div className="min-h-screen bg-navy-950 text-gold-100">
      <header className="border-b border-gold-500/20">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-display text-xl text-gold-400">LEGACY CIRCLE</Link>
          <Link href="/" className="text-sm text-gold-200/70 hover:text-gold-400">← Home</Link>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-gold-500">Voices of Change</p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl text-gold-100">Speakers</h1>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {speakers.map((s) => (
            <div key={s.id} className="border border-gold-500/15 bg-navy-900/40 p-6">
              <div className="mb-5 flex aspect-square items-center justify-center bg-navy-800 font-display text-4xl text-gold-500/30">
                {s.name.charAt(0)}
              </div>
              <h3 className="font-display text-xl text-gold-200">{s.name}</h3>
              <p className="mt-1 text-sm text-gold-400/70">{s.title}</p>
              {s.bio && <p className="mt-3 text-sm leading-relaxed text-gold-200/50">{s.bio}</p>}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
