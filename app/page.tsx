import Link from "next/link";
import { prisma } from "@/lib/db/prisma";

async function getEvent() {
  try {
    const event = await prisma.event.findFirst({
      where: { isPublished: true },
      include: {
        settings: true,
        speakers: { where: { isFeatured: true, isVisible: true }, take: 4 },
      },
    });
    return event;
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const event = await getEvent();

  const name = event?.name || "THE LEGACY CIRCLE 2027";
  const tagline = event?.tagline || "Where Giving Creates a Lasting Legacy.";
  const description =
    event?.description ||
    "An exclusive Social Impact and Fundraising Gala bringing together renowned philanthropists, corporate leaders, and changemakers.";
  const venue = event?.venueName || "The Leela Palace, New Delhi";
  const dates = "17–19 February 2027";

  return (
    <div className="min-h-screen bg-navy-950 text-gold-100">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-gold-500/20 bg-navy-950/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-display text-xl font-semibold tracking-wide text-gold-400">
            LEGACY CIRCLE
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/about" className="text-sm text-gold-200/80 transition hover:text-gold-400">About</Link>
            <Link href="/agenda" className="text-sm text-gold-200/80 transition hover:text-gold-400">Agenda</Link>
            <Link href="/speakers" className="text-sm text-gold-200/80 transition hover:text-gold-400">Speakers</Link>
            <Link href="/sponsors" className="text-sm text-gold-200/80 transition hover:text-gold-400">Sponsors</Link>
            <Link href="/venue" className="text-sm text-gold-200/80 transition hover:text-gold-400">Venue</Link>
            <Link href="/register" className="rounded-sm bg-gold-500 px-5 py-2 text-sm font-medium text-navy-950 transition hover:bg-gold-400">Register</Link>
          </nav>
        </div>
      </header>

      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-20 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-navy-900/80 via-navy-950 to-navy-950" />
        <div className="relative z-10 max-w-4xl">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-gold-400/80">17–19 February 2027 · New Delhi</p>
          <h1 className="font-display text-5xl font-medium leading-tight tracking-tight text-gold-100 md:text-7xl">{name}</h1>
          <p className="mt-6 text-xl text-gold-300/90 md:text-2xl">{tagline}</p>
          <div className="section-divider my-10 max-w-md mx-auto" />
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-gold-200/70 md:text-lg">{description.split("\n")[0]}</p>
          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/register" className="rounded-sm bg-gold-500 px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-navy-950 transition hover:bg-gold-400">Request Invitation</Link>
            <Link href="/about" className="rounded-sm border border-gold-500/40 px-8 py-3.5 text-sm font-medium uppercase tracking-wider text-gold-300 transition hover:border-gold-400 hover:text-gold-200">Discover More</Link>
          </div>
        </div>
      </section>

      <section className="border-t border-gold-500/10 bg-navy-900/50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-gold-500/30 text-gold-400"><span className="font-display text-xl">01</span></div>
              <h3 className="font-display text-xl text-gold-200">Inspiring Conversations</h3>
              <p className="mt-3 text-sm leading-relaxed text-gold-200/60">Keynotes and panels with global leaders in philanthropy, business and social impact.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-gold-500/30 text-gold-400"><span className="font-display text-xl">02</span></div>
              <h3 className="font-display text-xl text-gold-200">Premium Networking</h3>
              <p className="mt-3 text-sm leading-relaxed text-gold-200/60">Curated connections with philanthropists, corporate leaders and changemakers.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-gold-500/30 text-gold-400"><span className="font-display text-xl">03</span></div>
              <h3 className="font-display text-xl text-gold-200">Lasting Impact</h3>
              <p className="mt-3 text-sm leading-relaxed text-gold-200/60">Fundraising initiatives that create measurable social change and enduring legacy.</p>
            </div>
          </div>
        </div>
      </section>

      {event?.speakers && event.speakers.length > 0 && (
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-16 text-center">
              <p className="text-sm uppercase tracking-[0.25em] text-gold-500">Featured Voices</p>
              <h2 className="mt-3 font-display text-4xl text-gold-100">Distinguished Speakers</h2>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {event.speakers.map((speaker) => (
                <div key={speaker.id} className="group border border-gold-500/10 bg-navy-900/40 p-6 transition hover:border-gold-500/30">
                  <div className="mb-4 aspect-square w-full bg-navy-800 flex items-center justify-center text-gold-500/40 font-display text-3xl">{speaker.name.charAt(0)}</div>
                  <h3 className="font-display text-lg text-gold-200">{speaker.name}</h3>
                  <p className="mt-1 text-sm text-gold-400/70">{speaker.title}</p>
                </div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link href="/speakers" className="text-sm uppercase tracking-wider text-gold-400 underline-offset-4 hover:underline">View All Speakers →</Link>
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-gold-500/10 py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-gold-500">The Venue</p>
          <h2 className="mt-3 font-display text-4xl text-gold-100">{venue}</h2>
          <p className="mt-4 text-gold-200/60">{dates}</p>
          <Link href="/venue" className="mt-8 inline-block rounded-sm border border-gold-500/40 px-8 py-3 text-sm uppercase tracking-wider text-gold-300 transition hover:border-gold-400">Explore Venue</Link>
        </div>
      </section>

      <footer className="border-t border-gold-500/20 bg-navy-950 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div>
              <p className="font-display text-lg text-gold-400">THE LEGACY CIRCLE</p>
              <p className="mt-1 text-sm text-gold-200/50">Where Giving Creates a Lasting Legacy.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gold-200/60">
              <Link href="/privacy" className="hover:text-gold-400">Privacy</Link>
              <Link href="/terms" className="hover:text-gold-400">Terms</Link>
              <Link href="/contact" className="hover:text-gold-400">Contact</Link>
              <a href="mailto:connect@thelegacycircle.com" className="hover:text-gold-400">connect@thelegacycircle.com</a>
            </div>
          </div>
          <p className="mt-10 text-center text-xs text-gold-200/30">© 2027 The Legacy Circle. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
