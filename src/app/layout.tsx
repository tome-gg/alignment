import type { Metadata } from "next";
import { Figtree, Geist } from "next/font/google";

import "./globals.css";
import Header from "@/components/Header";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tome.gg",
  description: "Author, store, and review decision packets.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${figtree.variable} min-h-screen`}>
        <div className="min-h-screen bg-neutral-50 text-neutral-950">
          <Header />
          <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
