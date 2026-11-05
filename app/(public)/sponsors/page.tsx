import Link from "next/link";

const categories = [
  {
    title: "Banking & Financial Institutions",
    sponsors: ["Premier Banking Partners", "Wealth & Trust Advisors"],
  },
  {
    title: "IT & Technology Companies",
    sponsors: ["Digital Innovation Partners", "Enterprise Technology Sponsors"],
  },
  {
    title: "Automobile & Luxury Brands",
    sponsors: ["Luxury Mobility Partners"],
  },
  {
    title: "FMCG & Lifestyle Companies",
    sponsors: ["Lifestyle & Consumer Brands"],
  },
  {
    title: "Public Sector Undertakings",
    sponsors: ["PSU Partners"],
  },
  {
    title: "Corporate CSR Foundations",
    sponsors: ["CSR Foundation Partners", "Impact Funds"],
  },
];

export default function SponsorsPage() {
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

      <main className="mx-auto max-w-5xl px-6 py-20">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-gold-500">Our Partners</p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl text-gold-100">Sponsors</h1>
          <p className="mx-auto mt-4 max-w-2xl text-gold-200/60">
            We are grateful to our partners across banking, technology, luxury, lifestyle, public
            sector and corporate CSR foundations.
          </p>
        </div>

        <div className="section-divider my-12" />

        <div className="grid gap-8 md:grid-cols-2">
          {categories.map((cat) => (
            <div
              key={cat.title}
              className="border border-gold-500/15 bg-navy-900/40 p-6"
            >
              <h2 className="font-display text-lg text-gold-300">{cat.title}</h2>
              <ul className="mt-4 space-y-2">
                {cat.sponsors.map((name) => (
                  <li key={name} className="text-sm text-gold-200/70">
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-16 text-center text-sm text-gold-200/50">
          Interested in partnering? Contact{" "}
          <a href="mailto:connect@thelegacycircle.com" className="text-gold-400 hover:underline">
            connect@thelegacycircle.com
          </a>
        </p>
      </main>
    </div>
  );
}
