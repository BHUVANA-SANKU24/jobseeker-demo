import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center text-center mt-8 sm:mt-16 overflow-hidden relative">

      {/* Glitter / Particle Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 mix-blend-screen">
        <div className="absolute top-[10%] left-[15%] w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_3px_rgba(255,255,255,0.8)] animate-float-twinkle" style={{ animationDuration: '3s', animationDelay: '0s' }} />
        <div className="absolute top-[20%] right-[20%] w-2 h-2 rounded-full bg-gov-accent shadow-[0_0_12px_4px_rgba(253,186,18,0.9)] animate-float-twinkle" style={{ animationDuration: '5s', animationDelay: '1s' }} />
        <div className="absolute top-[40%] left-[5%] w-1 h-1 rounded-full bg-white shadow-[0_0_8px_2px_rgba(255,255,255,0.6)] animate-float-twinkle" style={{ animationDuration: '4s', animationDelay: '0.5s' }} />
        <div className="absolute top-[60%] right-[10%] w-2.5 h-2.5 rounded-full bg-orange-400 shadow-[0_0_15px_5px_rgba(251,146,60,0.8)] animate-float-twinkle" style={{ animationDuration: '6s', animationDelay: '2s' }} />
        <div className="absolute top-[30%] left-[40%] w-1.5 h-1.5 rounded-full bg-gov-accent shadow-[0_0_10px_3px_rgba(253,186,18,0.8)] animate-float-twinkle" style={{ animationDuration: '3.5s', animationDelay: '1.5s' }} />
        <div className="absolute bottom-[20%] left-[25%] w-2 h-2 rounded-full bg-white shadow-[0_0_12px_4px_rgba(255,255,255,0.9)] animate-float-twinkle" style={{ animationDuration: '4.5s', animationDelay: '2.5s' }} />
        <div className="absolute bottom-[40%] right-[30%] w-1.5 h-1.5 rounded-full bg-gov-accent shadow-[0_0_10px_3px_rgba(253,186,18,0.8)] animate-float-twinkle" style={{ animationDuration: '5.5s', animationDelay: '0.8s' }} />
        <div className="absolute bottom-[10%] right-[15%] w-1 h-1 rounded-full bg-white shadow-[0_0_8px_2px_rgba(255,255,255,0.6)] animate-float-twinkle" style={{ animationDuration: '3s', animationDelay: '3s' }} />
        <div className="absolute top-[50%] left-[60%] w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_12px_4px_rgba(251,146,60,0.8)] animate-float-twinkle" style={{ animationDuration: '4.8s', animationDelay: '1.2s' }} />
        <div className="absolute top-[15%] right-[40%] w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_3px_rgba(255,255,255,0.8)] animate-float-twinkle" style={{ animationDuration: '3.2s', animationDelay: '0.2s' }} />
      </div>

      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-gov-accent/30 bg-gov-accent/10 px-4 py-1.5 text-[11px] font-bold tracking-[0.15em] text-gov-accent uppercase mb-8 animate-fade-in-up opacity-0" style={{ animationDelay: '100ms' }}>
          <span className="h-1.5 w-1.5 rounded-full bg-gov-accent animate-pulse" />
          AI-POWERED • DEMO PROTOTYPE • EDUCATIONAL USE ONLY
        </div>

        {/* Hero Headline */}
        <h2 className="max-w-4xl text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1] animate-fade-in-up opacity-0" style={{ animationDelay: '200ms' }}>
          Jobseeker Registration <br className="hidden sm:block" />
          Made <span className="font-serif italic text-gov-accent border-b-4 border-gov-accent/30 mb-8 inline-block pb-1">Instantly Simple</span>
        </h2>

        {/* Hero Subtitle */}
        <p className="max-w-2xl text-base sm:text-lg text-slate-400 mb-12 font-medium leading-relaxed animate-fade-in-up opacity-0" style={{ animationDelay: '300ms' }}>
          Upload your resume — our AI reads it, fills your DEET profile automatically, and
          recommends perfectly matched jobs in seconds.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-fade-in-up opacity-0" style={{ animationDelay: '500ms' }}>
          <Link
            href="/register"
            className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-gov-accent px-8 py-4 text-base font-bold text-gov-bg shadow-[0_0_40px_-10px_rgba(253,186,18,0.5)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-gov-accent-hover hover:shadow-[0_0_60px_-15px_rgba(253,186,18,0.7)]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            Start Registration
          </Link>
          <Link
            href="/jobs"
            className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-base font-bold text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:border-white/40 shadow-lg"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:scale-110">
              <rect x="3" y="7" width="18" height="13" rx="2" />
              <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Browse Jobs
          </Link>
        </div>

        {/* Stats Divider Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 pt-12 border-t border-white/10 w-full max-w-4xl text-center animate-fade-in opacity-0" style={{ animationDelay: '700ms' }}>
          <div className="group transition-transform duration-300 hover:-translate-y-2">
            <div className="text-4xl sm:text-5xl font-serif font-bold text-gov-accent mb-2 transition-colors duration-300 group-hover:text-amber-300">20</div>
            <div className="text-xs font-bold tracking-widest text-slate-500 uppercase transition-colors duration-300 group-hover:text-slate-300">Job Listings</div>
          </div>
          <div className="group transition-transform duration-300 hover:-translate-y-2">
            <div className="text-4xl sm:text-5xl font-serif font-bold text-gov-accent mb-2 transition-colors duration-300 group-hover:text-amber-300">80<span className="text-3xl">%</span></div>
            <div className="text-xs font-bold tracking-widest text-slate-500 uppercase transition-colors duration-300 group-hover:text-slate-300">Faster Register</div>
          </div>
          <div className="group transition-transform duration-300 hover:-translate-y-2">
            <div className="text-4xl sm:text-5xl font-serif font-bold text-gov-accent mb-2 transition-colors duration-300 group-hover:text-amber-300">10</div>
            <div className="text-xs font-bold tracking-widest text-slate-500 uppercase transition-colors duration-300 group-hover:text-slate-300">Industry Sectors</div>
          </div>
          <div className="group transition-transform duration-300 hover:-translate-y-2">
            <div className="text-4xl sm:text-5xl font-serif font-bold text-gov-accent mb-2 transition-colors duration-300 group-hover:text-amber-300">AI</div>
            <div className="text-xs font-bold tracking-widest text-slate-500 uppercase transition-colors duration-300 group-hover:text-slate-300">Auto-Fill</div>
          </div>
        </div>

        {/* 4-Step Process Section */}
        <div className="mt-32 w-full max-w-4xl flex flex-col items-center text-center pb-20 animate-fade-in-up opacity-0" style={{ animationDelay: '900ms' }}>
          <div className="text-xs font-bold tracking-[0.2em] text-gov-accent uppercase mb-4 transition-all hover:tracking-[0.4em] duration-500 cursor-default">PROCESS</div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-20 leading-tight">
            From resume to job in <span className="font-serif italic text-gov-accent transition-all duration-300 hover:text-amber-300 cursor-default">4 steps</span>
          </h2>

          <div className="flex flex-col items-center relative w-full">
            {/* Step 1 */}
            <div className="flex flex-col items-center relative z-10 group">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-slate-600 bg-slate-800/50 backdrop-blur-md mb-6 shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:border-gov-accent/50 group-hover:shadow-[0_0_30px_-5px_rgba(253,186,18,0.2)]">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-slate-300 transition-colors duration-300 group-hover:text-white">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="currentColor" opacity="0.8" />
                  <path d="M14 2v6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gov-accent text-xs font-bold text-gov-bg transition-transform duration-300 group-hover:scale-125">1</div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gov-accent transition-colors duration-300 cursor-default">Upload Resume</h3>
              <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300 cursor-default">PDF or image • Max 5MB</p>
            </div>

            <div className="h-16 w-px bg-slate-700 my-4 relative overflow-hidden">
              <div className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-b from-transparent via-gov-accent/50 to-transparent -translate-y-full animate-[slide-down_2s_infinite]" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-slate-600">↓</div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center relative z-10 w-full group">
              <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-gov-accent bg-gov-accent/10 backdrop-blur-md shadow-[0_0_30px_-5px_rgba(253,186,18,0.3)] mb-6 transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_50px_-5px_rgba(253,186,18,0.5)] animate-float">
                <span className="text-4xl text-governor-accent group-hover:animate-pulse">🤖</span>
                <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-gov-accent text-xs font-bold text-gov-bg transition-transform duration-300 group-hover:scale-125">2</div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gov-accent transition-colors duration-300 cursor-default">AI Extracts</h3>

              <div className="relative inline-flex items-center">
                <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300 cursor-default">Name, skills, education</p>
              </div>
            </div>

            <div className="h-16 w-px bg-slate-700 my-4 relative overflow-hidden">
              <div className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-b from-transparent via-gov-accent/50 to-transparent -translate-y-full animate-[slide-down_2s_infinite]" style={{ animationDelay: '0.5s' }} />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-slate-600">↓</div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center relative z-10 group">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-slate-600 bg-slate-800/50 backdrop-blur-md mb-6 shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:border-gov-accent/50 group-hover:shadow-[0_0_30px_-5px_rgba(253,186,18,0.2)]">
                <span className="text-3xl transition-transform duration-300 group-hover:rotate-12">✏️</span>
                <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gov-accent text-xs font-bold text-gov-bg transition-transform duration-300 group-hover:scale-125">3</div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gov-accent transition-colors duration-300 cursor-default">Review & Submit</h3>
              <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300 cursor-default">Verify extracted profile details</p>
            </div>

            <div className="h-16 w-px bg-slate-700 my-4 relative overflow-hidden">
              <div className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-b from-transparent via-gov-accent/50 to-transparent -translate-y-full animate-[slide-down_2s_infinite]" style={{ animationDelay: '1s' }} />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-slate-600">↓</div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center relative z-10 group">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-slate-600 bg-slate-800/50 backdrop-blur-md mb-6 shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:border-gov-accent/50 group-hover:shadow-[0_0_30px_-5px_rgba(253,186,18,0.2)]">
                <span className="text-3xl transition-transform duration-300 group-hover:scale-110">✨</span>
                <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gov-accent text-xs font-bold text-gov-bg transition-transform duration-300 group-hover:scale-125">4</div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gov-accent transition-colors duration-300 cursor-default">Get Matched</h3>
              <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300 cursor-default">Instantly see eligible jobs</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
