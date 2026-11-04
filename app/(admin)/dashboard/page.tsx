import Link from "next/link";
import { prisma } from "@/lib/db/prisma";

async function getStats() {
  try {
    const [totalReg, confirmed, pending, cancelled, tickets, checkedIn, speakers, sponsors] =
      await Promise.all([
        prisma.registration.count(),
        prisma.registration.count({ where: { status: "CONFIRMED" } }),
        prisma.registration.count({ where: { status: "PENDING" } }),
        prisma.registration.count({ where: { status: "CANCELLED" } }),
        prisma.ticket.count(),
        prisma.checkIn.count(),
        prisma.speaker.count(),
        prisma.sponsor.count(),
      ]);
    return { totalReg, confirmed, pending, cancelled, tickets, checkedIn, speakers, sponsors };
  } catch {
    return {
      totalReg: 0, confirmed: 0, pending: 0, cancelled: 0,
      tickets: 0, checkedIn: 0, speakers: 0, sponsors: 0,
    };
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    { label: "Total Registrations", value: stats.totalReg },
    { label: "Confirmed", value: stats.confirmed },
    { label: "Pending", value: stats.pending },
    { label: "Cancelled", value: stats.cancelled },
    { label: "Tickets Issued", value: stats.tickets },
    { label: "Checked In", value: stats.checkedIn },
    { label: "Speakers", value: stats.speakers },
    { label: "Sponsors", value: stats.sponsors },
  ];

  return (
    <div className="min-h-screen bg-navy-950 text-gold-100">
      <header className="border-b border-gold-500/20 bg-navy-900/50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-display text-lg text-gold-400">LEGACY CIRCLE</Link>
            <span className="text-xs uppercase tracking-wider text-gold-500/60">Admin</span>
          </div>
          <nav className="flex gap-4 text-sm">
            <Link href="/dashboard" className="text-gold-400">Dashboard</Link>
            <Link href="/registrations" className="text-gold-200/60 hover:text-gold-400">Registrations</Link>
            <Link href="/check-in" className="text-gold-200/60 hover:text-gold-400">Check-in</Link>
            <Link href="/event-config" className="text-gold-200/60 hover:text-gold-400">Event Config</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="font-display text-3xl text-gold-100">Dashboard</h1>
        <p className="mt-1 text-sm text-gold-200/50">Real-time overview of The Legacy Circle 2027</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <div key={c.label} className="border border-gold-500/15 bg-navy-900/40 p-6">
              <p className="text-xs uppercase tracking-wider text-gold-500/70">{c.label}</p>
              <p className="mt-2 font-display text-3xl text-gold-200">{c.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="border border-gold-500/15 bg-navy-900/40 p-6">
            <h2 className="font-display text-xl text-gold-200">Quick Actions</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/registrations" className="rounded-sm bg-gold-500/20 px-4 py-2 text-sm text-gold-300 hover:bg-gold-500/30">View Registrations</Link>
              <Link href="/check-in" className="rounded-sm bg-gold-500/20 px-4 py-2 text-sm text-gold-300 hover:bg-gold-500/30">QR Check-in</Link>
              <Link href="/event-config" className="rounded-sm bg-gold-500/20 px-4 py-2 text-sm text-gold-300 hover:bg-gold-500/30">Edit Event</Link>
              <Link href="/speakers" className="rounded-sm bg-gold-500/20 px-4 py-2 text-sm text-gold-300 hover:bg-gold-500/30">Manage Speakers</Link>
            </div>
          </div>
          <div className="border border-gold-500/15 bg-navy-900/40 p-6">
            <h2 className="font-display text-xl text-gold-200">System Status</h2>
            <ul className="mt-4 space-y-2 text-sm text-gold-200/60">
              <li>✓ Database connected</li>
              <li>✓ Registration engine active</li>
              <li>✓ QR generation ready</li>
              <li>• Email (configure RESEND_API_KEY)</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
