import Link from "next/link";

const days = [
  {
    day: "Day 1",
    date: "17 February 2027",
    sessions: [
      { time: "09:00 AM", title: "Registration & Welcome Reception", type: "General" },
      { time: "10:00 AM", title: "Opening Keynote: The Power of Giving", type: "Keynote" },
      { time: "11:30 AM", title: "Panel: Philanthropy & Social Impact", type: "Panel" },
      { time: "01:00 PM", title: "Networking Lunch", type: "Networking" },
      { time: "02:30 PM", title: "Workshops & Breakout Sessions", type: "Workshop" },
      { time: "05:00 PM", title: "Evening Reception", type: "Social" },
    ],
  },
  {
    day: "Day 2",
    date: "18 February 2027",
    sessions: [
      { time: "09:30 AM", title: "Morning Plenary", type: "Keynote" },
      { time: "11:00 AM", title: "Corporate CSR Roundtables", type: "Roundtable" },
      { time: "01:00 PM", title: "Lunch & Partner Showcase", type: "Networking" },
      { time: "02:30 PM", title: "Fundraising Initiatives Showcase", type: "Showcase" },
      { time: "04:30 PM", title: "Fireside Chat with Changemakers", type: "Conversation" },
      { time: "07:00 PM", title: "Gala Dinner & Performances", type: "Gala" },
    ],
  },
  {
    day: "Day 3",
    date: "19 February 2027",
    sessions: [
      { time: "10:00 AM", title: "Closing Keynote", type: "Keynote" },
      { time: "11:30 AM", title: "Legacy Commitments & Pledges", type: "Ceremony" },
      { time: "01:00 PM", title: "Farewell Lunch", type: "Networking" },
      { time: "02:30 PM", title: "Optional Site Visits & Departures", type: "Optional" },
    ],
  },
];

export default function AgendaPage() {
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

      <main className="mx-auto max-w-4xl px-6 py-20">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-gold-500">Three Days</p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl text-gold-100">Event Agenda</h1>
          <p className="mt-4 text-gold-200/60">
            17–19 February 2027 · The Leela Palace, New Delhi
          </p>
        </div>

        <div className="section-divider my-12" />

        <div className="space-y-16">
          {days.map((day) => (
            <section key={day.day}>
              <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h2 className="font-display text-2xl text-gold-300">{day.day}</h2>
                <p className="text-sm text-gold-500">{day.date}</p>
              </div>
              <ul className="space-y-3">
                {day.sessions.map((session) => (
                  <li
                    key={`${day.day}-${session.time}-${session.title}`}
                    className="flex flex-col gap-1 border border-gold-500/15 bg-navy-900/40 px-5 py-4 sm:flex-row sm:items-center sm:gap-6"
                  >
                    <span className="w-24 shrink-0 text-sm font-medium text-gold-400">
                      {session.time}
                    </span>
                    <span className="flex-1 text-gold-100">{session.title}</span>
                    <span className="text-xs uppercase tracking-wider text-gold-500/70">
                      {session.type}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <p className="mt-16 text-center text-sm text-gold-200/50">
          Schedule is indicative and may be updated closer to the event.
        </p>
      </main>
    </div>
  );
}
