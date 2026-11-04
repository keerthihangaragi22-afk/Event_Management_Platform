import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Legacy Circle 2027 | Where Giving Creates a Lasting Legacy",
  description:
    "An exclusive Social Impact and Fundraising Gala. 17–19 February 2027 | The Leela Palace, New Delhi.",
  keywords: ["Legacy Circle", "Gala", "Philanthropy", "Fundraising", "New Delhi"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
