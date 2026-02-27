import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jobseeker Registration – Demo Portal",
  description:
    "UI-only demo prototype of a government-style jobseeker registration portal powered by AI resume to profile conversion."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-gov-bg text-slate-900 antialiased">
        <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Demo / Prototype
                </p>
                <h1 className="text-base font-semibold text-gov-accent sm:text-lg">
                  Jobseeker Registration – Demo Portal
                </h1>
              </div>
              <div className="max-w-xs text-right">
                <p className="text-[11px] leading-snug text-slate-500">
                  This is a UI-only demonstration, not an official government
                  website. Please do not enter sensitive personal information.
                </p>
              </div>
            </div>
            <nav className="flex flex-wrap items-center gap-3 border-t border-slate-100 py-2 text-xs text-slate-600">
              <span className="font-semibold text-slate-700">Steps:</span>
              <Link
                href="/"
                className="rounded-full border border-transparent px-3 py-1 hover:border-slate-300 hover:bg-slate-50"
              >
                1. Overview
              </Link>
              <Link
                href="/register"
                className="rounded-full border border-transparent px-3 py-1 hover:border-slate-300 hover:bg-slate-50"
              >
                2. Registration Form
              </Link>
              <Link
                href="/summary"
                className="rounded-full border border-transparent px-3 py-1 hover:border-slate-300 hover:bg-slate-50"
              >
                3. Profile Summary
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto flex max-w-5xl flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
        <footer className="border-t border-slate-200 bg-white/60">
          <div className="mx-auto max-w-5xl px-4 py-4 text-xs text-slate-500 sm:px-6 lg:px-8">
            <p>
              Prototype for demonstration and testing only. No data is stored or
              transmitted to external services.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
