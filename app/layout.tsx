import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "DEET Portal | Jobseeker Registration",
  description: "AI-powered Jobseeker Registration Portal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-gov-bg text-slate-200 antialiased font-sans flex flex-col relative overflow-x-hidden">
        {/* Abstract Background Elements for the "wow" factor */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-900/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-gov-accent/5 blur-[120px] pointer-events-none" />

        <header className="sticky top-0 z-50 border-b border-white/5 bg-gov-bg/80 backdrop-blur-md">
          <div className="mx-auto w-full px-4 sm:px-8 lg:px-12">
            <div className="flex items-center justify-between py-6">
              {/* Logo Mimicking Image */}
              <Link href="/" className="flex items-center gap-4 group animate-fade-in-up opacity-0" style={{ animationDelay: '100ms' }}>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gov-accent to-orange-500 text-gov-bg shadow-[0_0_20px_rgba(253,186,18,0.3)] transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(253,186,18,0.6)]">
                  {/* Simple generic monument/pillar SVG */}
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="20" width="20" height="2" />
                    <rect x="4" y="4" width="16" height="2" />
                    <rect x="6" y="6" width="2" height="14" />
                    <rect x="11" y="6" width="2" height="14" />
                    <rect x="16" y="6" width="2" height="14" />
                    <path d="M12 4 L2 10 L22 10 Z" fill="currentColor" stroke="none" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-semibold font-serif tracking-wide text-white leading-tight">DEET Portal</h1>
                  <p className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-gov-accent uppercase mt-1">Telangana • Demo</p>
                </div>
              </Link>

              {/* Navigation Links requested by user */}
              <nav className="flex items-center gap-8 text-base sm:text-lg font-semibold text-slate-300">
                <Link href="/" className="px-3 py-2 rounded-lg transition-all duration-300 hover:text-white hover:bg-white/5 animate-fade-in-up opacity-0" style={{ animationDelay: '200ms' }}>
                  Home
                </Link>
                <Link href="/about" className="px-3 py-2 rounded-lg transition-all duration-300 hover:text-white hover:bg-white/5 animate-fade-in-up opacity-0" style={{ animationDelay: '300ms' }}>
                  About Us
                </Link>
                <Link href="/register" className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-white/10 px-6 py-2.5 text-white shadow-[0_4px_15px_-5px_rgba(255,255,255,0.1)] transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:shadow-[0_8px_25px_-5px_rgba(255,255,255,0.2)] animate-fade-in-up opacity-0" style={{ animationDelay: '400ms' }}>
                  <span className="absolute inset-0 bg-gradient-to-r from-gov-accent/20 to-orange-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="relative font-bold">Register</span>
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8 relative z-10">
          {children}
        </main>

        <footer className="border-t border-white/5 mt-auto relative z-10">
          <div className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-slate-500 sm:px-6 lg:px-8">
            <p>Prototype for demonstration. AI Job Matching Portal.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
