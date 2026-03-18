"use client";

import { useEffect, useState } from "react";

type Profile = {
  fullName: string;
  email: string;
  phone: string;
  qualification: string;
  branch: string;
  skills: string[];
  employmentStatus: string;
  experience?: string;
  expectedSalary?: string;
  meta?: {
    resumeFileName?: string | null;
  };
};

const STORAGE_KEY = "demoJobseekerProfile";

export default function SummaryPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as Profile;
      setProfile(parsed);
    } catch {
      // ignore parse errors in demo
    }
  }, []);

  const handleCopy = async () => {
    if (!profile || typeof navigator === "undefined" || !navigator.clipboard) {
      return;
    }

    const lines = [
      "Jobseeker Profile – Demo Export",
      "",
      `Full Name: ${profile.fullName}`,
      `Email: ${profile.email}`,
      `Phone: ${profile.phone}`,
      "",
      `Highest Qualification: ${profile.qualification}`,
      `Branch / Specialization: ${profile.branch}`,
      "",
      `Employment Status: ${profile.employmentStatus}`,
      "",
      "Skills:",
      ...(profile.skills.length
        ? profile.skills.map((s) => `- ${s}`)
        : ["- (not specified)"]),
      "",
      profile.meta?.resumeFileName
        ? `Sample resume file used in demo: ${profile.meta.resumeFileName}`
        : ""
    ].filter(Boolean);

    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore failures in demo
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto w-full pt-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between animate-fade-in-up opacity-0" style={{ animationDelay: '100ms' }}>
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
            Profile Ready for Submission
          </h2>
          <p className="text-base text-slate-400">
            Review the structured profile below. When you are satisfied, use the
            button to copy these details and manually paste them into an official portal.
          </p>
        </div>
        <div className="rounded-xl border border-gov-accent/20 bg-gov-accent/10 px-4 py-3 text-xs text-gov-accent flex flex-col items-start gap-1">
          <span className="font-bold tracking-widest uppercase">Demo Only</span>
          <span className="text-gov-accent/80">Not connected to official DEET.</span>
        </div>
      </div>

      <section className="grid gap-6 rounded-3xl border border-white/5 bg-gov-panel/40 p-6 shadow-xl backdrop-blur-md lg:grid-cols-3 lg:p-8 relative overflow-hidden animate-fade-in-up opacity-0" style={{ animationDelay: '200ms' }}>
        {/* Decorative glow */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gov-accent/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="space-y-6 lg:col-span-2 relative z-10">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gov-accent border-b border-white/10 pb-3">
            Structured Profile Summary
          </h3>
          {profile ? (
            <dl className="grid gap-x-8 gap-y-6 text-sm sm:grid-cols-2">
              <div className="bg-black/20 p-4 rounded-xl border border-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-black/40">
                <dt className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">
                  Full Name
                </dt>
                <dd className="text-lg font-semibold text-white">{profile.fullName}</dd>
              </div>
              <div className="bg-black/20 p-4 rounded-xl border border-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-black/40">
                <dt className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">
                  Email
                </dt>
                <dd className="text-lg font-semibold text-white">{profile.email}</dd>
              </div>
              <div className="bg-black/20 p-4 rounded-xl border border-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-black/40">
                <dt className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">
                  Phone
                </dt>
                <dd className="text-lg font-semibold text-white">{profile.phone}</dd>
              </div>
              <div className="bg-black/20 p-4 rounded-xl border border-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-black/40">
                <dt className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">
                  Employment Status
                </dt>
                <dd className="text-lg font-semibold text-white">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-gov-accent/20 text-gov-accent text-sm font-bold shadow-[0_0_10px_rgba(253,186,18,0.2)]">
                    {profile.employmentStatus}
                  </span>
                </dd>
              </div>
              {profile.employmentStatus === "Experienced" && (
                <>
                  <div className="bg-black/20 p-4 rounded-xl border border-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-black/40 animate-fade-in-up">
                    <dt className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">
                      Years of Exp
                    </dt>
                    <dd className="text-lg font-semibold text-white">
                      {profile.experience ? `${profile.experience} Yrs` : "N/A"}
                    </dd>
                  </div>
                  <div className="bg-black/20 p-4 rounded-xl border border-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-black/40 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    <dt className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">
                      Expected Salary
                    </dt>
                    <dd className="text-lg font-semibold text-white">
                      {profile.expectedSalary ? `₹${profile.expectedSalary} LPA` : "N/A"}
                    </dd>
                  </div>
                </>
              )}
              <div className="bg-black/20 p-4 rounded-xl border border-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-black/40">
                <dt className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">
                  Highest Qualification
                </dt>
                <dd className="text-lg font-semibold text-white">
                  {profile.qualification}
                </dd>
              </div>
              <div className="bg-black/20 p-4 rounded-xl border border-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-black/40">
                <dt className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">
                  Branch / Specialization
                </dt>
                <dd className="text-lg font-semibold text-white">{profile.branch}</dd>
              </div>
              <div className="sm:col-span-2 bg-black/20 p-4 rounded-xl border border-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-black/40">
                <dt className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
                  Skills
                </dt>
                <dd className="text-white">
                  {profile.skills.length ? (
                    <ul className="flex flex-wrap gap-2">
                      {profile.skills.map((skill) => (
                        <li
                          key={skill}
                          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
                        >
                          {skill}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-slate-500 italic">Not specified</span>
                  )}
                </dd>
              </div>
            </dl>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-white/20 rounded-2xl bg-black/10 animate-fade-in">
              <svg className="w-12 h-12 text-slate-600 mb-4 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <p className="text-lg font-bold text-slate-400 mb-2">No Profile Found</p>
              <p className="text-sm text-slate-500 max-w-xs">
                Please complete the registration form first to generate a summary.
              </p>
            </div>
          )}
        </div>

        <aside className="group flex flex-col gap-6 rounded-2xl border border-white/10 bg-black/40 p-6 relative z-10 lg:col-span-1 h-fit transition-all duration-500 hover:border-gov-accent/30 hover:shadow-[0_0_30px_rgba(253,186,18,0.1)]">
          <div className="space-y-3 text-slate-300">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-gov-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Export Instructions
            </h3>
            <ol className="list-inside list-decimal space-y-2 text-sm text-slate-400 marker:text-gov-accent marker:font-bold">
              <li>Open the official employment portal.</li>
              <li>Navigate to the jobseeker registration form.</li>
              <li>
                Click the button below to copy this structured data.
              </li>
              <li>Paste into the relevant fields on the official site.</li>
            </ol>
          </div>
          <div className="space-y-3 mt-4 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={handleCopy}
              disabled={!profile}
              className="group relative inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gov-accent px-4 py-4 text-base font-bold text-gov-bg shadow-[0_0_20px_-5px_rgba(253,186,18,0.4)] transition hover:-translate-y-0.5 hover:bg-gov-accent-hover hover:shadow-[0_0_30px_-5px_rgba(253,186,18,0.5)] disabled:translate-y-0 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/5 disabled:text-slate-500 disabled:shadow-none"
            >
              {profile ? (
                copied ? (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    Copied to Clipboard!
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                    Copy Data
                  </>
                )
              ) : (
                "Data Unavailable"
              )}
            </button>
            <p className="text-center text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-4">
              Local Browser Export Only
            </p>

            <a
              href="/jobs"
              className="mt-6 group/btn flex w-full items-center justify-center gap-2 rounded-xl border-2 border-white/20 bg-transparent px-4 py-4 text-base font-bold text-white transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:border-white/40"
            >
              View Jobs I'm Eligible For
              <svg className="w-5 h-5 text-white/50 transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </a>
          </div>
        </aside>
      </section>
    </div>
  );
}
