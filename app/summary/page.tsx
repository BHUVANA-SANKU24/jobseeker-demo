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
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Profile Ready for Submission
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Review the structured profile below. When you are satisfied, use the
            button to copy these details and{" "}
            <span className="font-semibold">
              manually paste them into an official government portal
            </span>{" "}
            if required.
          </p>
        </div>
        <div className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-900">
          <p className="font-semibold">Reminder</p>
          <p>
            This interface is a demo only. It is not connected to DEET or any
            other government system.
          </p>
        </div>
      </div>

      <section className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-5 sm:p-5">
        <div className="space-y-4 sm:col-span-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
            Structured Profile Summary
          </h3>
          {profile ? (
            <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-600">
                  Full Name
                </dt>
                <dd className="mt-0.5 text-slate-900">{profile.fullName}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-600">
                  Email
                </dt>
                <dd className="mt-0.5 text-slate-900">{profile.email}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-600">
                  Phone
                </dt>
                <dd className="mt-0.5 text-slate-900">{profile.phone}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-600">
                  Employment Status
                </dt>
                <dd className="mt-0.5 text-slate-900">
                  {profile.employmentStatus}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-600">
                  Highest Qualification
                </dt>
                <dd className="mt-0.5 text-slate-900">
                  {profile.qualification}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-600">
                  Branch / Specialization
                </dt>
                <dd className="mt-0.5 text-slate-900">{profile.branch}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-600">
                  Skills
                </dt>
                <dd className="mt-0.5 text-slate-900">
                  {profile.skills.length ? (
                    <ul className="flex flex-wrap gap-1.5">
                      {profile.skills.map((skill) => (
                        <li
                          key={skill}
                          className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-800"
                        >
                          {skill}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-slate-500">Not specified</span>
                  )}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="text-sm text-slate-600">
              No profile information found. Please complete the registration form
              first to generate a summary.
            </p>
          )}
        </div>

        <aside className="flex flex-col justify-between gap-4 rounded-md bg-slate-50 p-4 sm:col-span-2">
          <div className="space-y-2 text-sm text-slate-700">
            <h3 className="text-sm font-semibold text-slate-800">
              Next steps (for real portals)
            </h3>
            <ol className="list-inside list-decimal space-y-1 text-xs text-slate-700">
              <li>Open the official employment registration portal.</li>
              <li>Navigate to the jobseeker registration or profile form.</li>
              <li>
                Use the button below to copy this structured data, then paste
                into the relevant fields.
              </li>
              <li>Review, update, and submit directly on the official site.</li>
            </ol>
          </div>
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleCopy}
              disabled={!profile}
              className="inline-flex w-full items-center justify-center rounded-md bg-gov-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {profile
                ? copied
                  ? "Copied!"
                  : "Copy Data for Official Portal"
                : "Profile Data Unavailable"}
            </button>
            <p className="text-[11px] text-slate-500">
              Copying is performed locally in your browser. This demo does not
              connect to external APIs or store any data on a server.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
