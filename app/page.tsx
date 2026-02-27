import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-1 flex-col justify-center">
      <section className="grid gap-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-5 sm:p-8">
        <div className="space-y-4 sm:col-span-3">
          <p className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            AI-powered resume to profile conversion · Demo only
          </p>
          <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
            Jobseeker Registration – Demo Portal
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Explore how an AI-assisted interface could simplify jobseeker
            registration for government employment portals. Upload a sample
            resume, auto-fill key details, and review a structured profile —
            all within this self-contained prototype.
          </p>
          <ul className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gov-accent" />
              <span>Upload a resume (PDF) and preview auto-filled fields.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gov-accent" />
              <span>Government-inspired, card-based form layout.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gov-accent" />
              <span>Mobile responsive design for accessibility.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gov-accent" />
              <span>UI-only demo. No real registration or backend.</span>
            </li>
          </ul>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-md bg-gov-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gov-accent focus-visible:ring-offset-2"
            >
              Start Registration
            </Link>
            <p className="text-xs text-slate-500">
              This is not the official DEET or any other government website.
            </p>
          </div>
        </div>
        <aside className="space-y-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 sm:col-span-2">
          <h3 className="text-sm font-semibold text-slate-800">
            About this prototype
          </h3>
          <p className="text-xs leading-relaxed text-slate-600">
            The interface is{" "}
            <span className="font-semibold">inspired by government jobseeker</span>{" "}
            registration flows but uses neutral branding and sample data only.
            It is intended for demonstrations, UX discussions, and internal
            experimentation.
          </p>
          <div className="rounded-md bg-white p-3 text-xs text-slate-600">
            <p className="font-medium text-slate-800">
              Data & privacy notice
            </p>
            <p className="mt-1">
              No information is sent to external servers. Uploaded files are
              not parsed; instead, the system simulates auto-fill with mock
              data so you can safely explore the experience.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
