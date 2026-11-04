"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    designation: "",
    city: "",
    country: "India",
    invitationCode: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [ticketInfo, setTicketInfo] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Registration failed");
        return;
      }

      setStatus("success");
      setTicketInfo(data);
      setMessage("Registration successful! Check your email for confirmation.");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 text-gold-100">
      <header className="border-b border-gold-500/20 bg-navy-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-display text-xl text-gold-400">
            LEGACY CIRCLE
          </Link>
          <Link href="/" className="text-sm text-gold-200/70 hover:text-gold-400">
            ← Back to Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-xl px-6 py-16">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-gold-500">Invitation Only</p>
          <h1 className="mt-3 font-display text-4xl text-gold-100">Register</h1>
          <p className="mt-4 text-gold-200/60">
            Please enter your details and invitation code to complete registration.
          </p>
        </div>

        {status === "success" && ticketInfo ? (
          <div className="mt-12 rounded border border-gold-500/30 bg-navy-900/60 p-8 text-center">
            <h2 className="font-display text-2xl text-gold-300">Registration Confirmed</h2>
            <p className="mt-4 text-gold-200/80">Registration ID: <strong>{ticketInfo.registrationId}</strong></p>
            <p className="text-gold-200/80">Ticket Number: <strong>{ticketInfo.ticketNumber}</strong></p>
            {ticketInfo.qrCodeDataUrl && (
              <div className="mt-6 flex justify-center">
                <img src={ticketInfo.qrCodeDataUrl} alt="Ticket QR Code" className="h-48 w-48" />
              </div>
            )}
            <Link
              href={`/ticket/${ticketInfo.ticketNumber}`}
              className="mt-6 inline-block rounded-sm bg-gold-500 px-6 py-2.5 text-sm font-medium text-navy-950"
            >
              View Full Ticket
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-12 space-y-5">
            <div>
              <label className="mb-1.5 block text-sm text-gold-300/80">Full Name *</label>
              <input
                required
                type="text"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full rounded border border-gold-500/20 bg-navy-900 px-4 py-3 text-gold-100 outline-none focus:border-gold-500"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-gold-300/80">Email *</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded border border-gold-500/20 bg-navy-900 px-4 py-3 text-gold-100 outline-none focus:border-gold-500"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-gold-300/80">Phone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded border border-gold-500/20 bg-navy-900 px-4 py-3 text-gold-100 outline-none focus:border-gold-500"
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm text-gold-300/80">Organization</label>
                <input
                  type="text"
                  value={form.organization}
                  onChange={(e) => setForm({ ...form, organization: e.target.value })}
                  className="w-full rounded border border-gold-500/20 bg-navy-900 px-4 py-3 text-gold-100 outline-none focus:border-gold-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-gold-300/80">Designation</label>
                <input
                  type="text"
                  value={form.designation}
                  onChange={(e) => setForm({ ...form, designation: e.target.value })}
                  className="w-full rounded border border-gold-500/20 bg-navy-900 px-4 py-3 text-gold-100 outline-none focus:border-gold-500"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-gold-300/80">Invitation Code *</label>
              <input
                required
                type="text"
                value={form.invitationCode}
                onChange={(e) => setForm({ ...form, invitationCode: e.target.value })}
                placeholder="e.g. LEGACY2027-VIP"
                className="w-full rounded border border-gold-500/20 bg-navy-900 px-4 py-3 text-gold-100 outline-none focus:border-gold-500"
              />
            </div>

            {message && (
              <p className={`text-sm ${status === "error" ? "text-red-400" : "text-green-400"}`}>
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-sm bg-gold-500 py-3.5 text-sm font-semibold uppercase tracking-wider text-navy-950 transition hover:bg-gold-400 disabled:opacity-60"
            >
              {status === "loading" ? "Submitting..." : "Complete Registration"}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
