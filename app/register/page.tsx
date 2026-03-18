"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type EmploymentStatus = "Fresher" | "Experienced";

type AutoFilledFieldKey =
  | "fullName"
  | "email"
  | "phone"
  | "qualification"
  | "branch"
  | "skills"
  | "employmentStatus";

const API_BASE_URL = "http://127.0.0.1:5000";

export default function RegistrationPage() {
  const router = useRouter();

  const [resumeFileName, setResumeFileName] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [qualification, setQualification] = useState("");
  const [branch, setBranch] = useState("");
  const [skills, setSkills] = useState("");
  const [employmentStatus, setEmploymentStatus] =
    useState<EmploymentStatus>("Fresher");
  const [experience, setExperience] = useState("");
  const [expectedSalary, setExpectedSalary] = useState("");
  const [autoFilledFields, setAutoFilledFields] = useState<
    Set<AutoFilledFieldKey>
  >(new Set());

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const markAutoFilled = (keys: AutoFilledFieldKey[]) => {
    setAutoFilledFields(new Set(keys));
  };

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setResumeFileName(file.name);
    setErrorMsg(null);
    setLoading(true);

    try {
      // 1) Upload -> get extracted raw_text
      const formData = new FormData();
      formData.append("file", file); // MUST be "file"

      const uploadRes = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const uploadJson = await uploadRes.json();

      if (!uploadRes.ok || !uploadJson?.success) {
        throw new Error(uploadJson?.error || `Upload failed: ${uploadRes.status}`);
      }

      const rawText: string = uploadJson?.data?.raw_text || "";
      if (!rawText.trim()) throw new Error("No text extracted from resume.");

      // 2) Extract -> structured data
      const extractRes = await fetch(`${API_BASE_URL}/extract`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: rawText }),
      });

      const extractJson = await extractRes.json();

      if (!extractRes.ok || !extractJson?.success) {
        throw new Error(extractJson?.error || `Extract failed: ${extractRes.status}`);
      }

      const data = extractJson.data;

      // 3) Fill fields
      setFullName(data?.personal?.full_name ?? "");
      setEmail(data?.personal?.email ?? "");
      setPhone(data?.personal?.phone ?? "");

      setQualification(data?.education?.highest_qualification ?? "");
      setBranch(data?.education?.branch_or_major ?? "");

      setSkills(Array.isArray(data?.skills) ? data.skills.join(", ") : "");

      const emp =
        data?.employment?.status === "Experienced" ? "Experienced" : "Fresher";
      setEmploymentStatus(emp);

      markAutoFilled([
        "fullName",
        "email",
        "phone",
        "qualification",
        "branch",
        "skills",
        "employmentStatus",
      ]);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || "Failed. Check backend + CORS.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const profile = {
      fullName,
      email,
      phone,
      qualification,
      branch,
      skills: skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      employmentStatus,
      experience: employmentStatus === "Experienced" ? experience : undefined,
      expectedSalary: employmentStatus === "Experienced" ? expectedSalary : undefined,
      meta: {
        resumeFileName,
      },
    };

    if (typeof window !== "undefined") {
      sessionStorage.setItem("demoJobseekerProfile", JSON.stringify(profile));
    }

    router.push("/summary");
  };

  const fieldClasses = (key: AutoFilledFieldKey) =>
    [
      "block w-full rounded-lg border bg-gov-panel/50 px-4 py-3 text-sm text-white placeholder-slate-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-gov-accent transition-all",
      autoFilledFields.has(key)
        ? "border-gov-accent/50 bg-gov-accent/5"
        : "border-white/10",
    ].join(" ");

  return (
    <div className="max-w-4xl mx-auto w-full pt-8 pb-16 px-2 sm:px-6">
      <div className="mb-10 text-center sm:text-left animate-fade-in-up opacity-0" style={{ animationDelay: '100ms' }}>
        <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Create Your Profile</h1>
        <p className="text-slate-400 text-lg">Upload your resume to instantly generate your DEET profile.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 relative">
        {/* Upload Section */}
        <section className="overflow-hidden rounded-2xl border border-white/10 bg-gov-panel/40 backdrop-blur-md shadow-2xl transition-all duration-300 hover:border-white/20 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.1)] group animate-fade-in-up opacity-0" style={{ animationDelay: '200ms' }}>
          <div className="border-b border-white/5 bg-black/20 px-6 py-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gov-accent/20 text-xs text-gov-accent">1</span>
              Resume Upload
            </h2>
          </div>
          <div className="p-5 sm:p-6 text-white">
            <p className="mt-3 text-xs text-slate-400">
              Backend extraction uses Flask endpoint{" "}
              <span className="font-semibold text-slate-300">POST /extract</span>.
              <br />
              ✅ Best for demo: upload <span className="font-semibold text-slate-300">.txt</span>{" "}
              resumes.
            </p>

            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
              <label className="flex flex-1 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/20 bg-white/5 px-4 py-8 text-center text-sm text-slate-300 hover:border-gov-accent hover:bg-white/10 transition-all">
                <svg className="w-8 h-8 mb-2 text-gov-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="font-bold text-white mb-1">
                  Click to choose file (.txt recommended)
                </span>
                <span className="text-xs text-slate-500">
                  Uses your local Flask server at {API_BASE_URL}
                </span>
                <input
                  type="file"
                  accept=".txt,.pdf,.docx,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={handleResumeUpload}
                />
              </label>

              <div className="min-w-[200px] text-sm text-slate-400 p-4 rounded-xl bg-black/20 border border-white/5">
                <p className="font-bold text-slate-200 mb-2">Upload Status</p>
                <p className="text-xs leading-relaxed">
                  {resumeFileName ? (
                    <>
                      Selected:<br />
                      <span className="font-semibold text-gov-accent truncate block max-w-full" title={resumeFileName}>{resumeFileName}</span>
                    </>
                  ) : (
                    "No file selected yet."
                  )}
                </p>
                {loading && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-gov-accent font-medium">
                    <div className="w-3 h-3 rounded-full border-2 border-gov-accent border-t-transparent animate-spin" />
                    Extracting data...
                  </div>
                )}
              </div>
            </div>

            {errorMsg && (
              <div className="mt-4 rounded-lg bg-red-900/30 border border-red-500/30 px-4 py-3 text-xs text-red-200 flex items-start gap-2">
                <svg className="w-4 h-4 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {errorMsg}
              </div>
            )}

            {autoFilledFields.size > 0 && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-900/30 border border-emerald-500/30 px-3 py-2 text-xs font-medium text-emerald-300">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Fields highlighted with yellow borders were auto-filled by AI.
              </div>
            )}
          </div>
        </section>

        {/* Personal Details Section */}
        <section className="overflow-hidden rounded-2xl border border-white/10 bg-gov-panel/40 backdrop-blur-md shadow-2xl transition-all duration-300 hover:border-white/20 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.1)] group animate-fade-in-up opacity-0" style={{ animationDelay: '300ms' }}>
          <div className="border-b border-white/5 bg-black/20 px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-700 text-xs text-slate-300">2</span>
              Personal Details
            </h2>
            {fullName && (
              <span className="inline-flex max-w-[150px] sm:max-w-none items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-medium text-emerald-400 border border-emerald-500/20 truncate animate-fade-in">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                <span className="truncate">Auto-filled from resume</span>
              </span>
            )}
          </div>
          <div className="p-5 sm:p-6 text-white">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wide">
                  Full Name
                </label>
                <input
                  type="text"
                  className={fieldClasses("fullName")}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  autoComplete="off"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  className={fieldClasses("email")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="off"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wide">
                  Phone
                </label>
                <input
                  type="tel"
                  className={fieldClasses("phone")}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  autoComplete="off"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section className="overflow-hidden rounded-2xl border border-white/10 bg-gov-panel/40 backdrop-blur-md shadow-2xl transition-all duration-300 hover:border-white/20 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.1)] group animate-fade-in-up opacity-0" style={{ animationDelay: '400ms' }}>
          <div className="border-b border-white/5 bg-black/20 px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-700 text-xs text-slate-300">3</span>
              Education Details
            </h2>
          </div>
          <div className="p-5 sm:p-6 text-white">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wide">
                  Highest Qualification
                </label>
                <input
                  type="text"
                  className={fieldClasses("qualification")}
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  required
                  autoComplete="off"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wide">
                  Branch / Specialization
                </label>
                <input
                  type="text"
                  className={fieldClasses("branch")}
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  required
                  autoComplete="off"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="overflow-hidden rounded-2xl border border-white/10 bg-gov-panel/40 backdrop-blur-md shadow-2xl transition-all duration-300 hover:border-white/20 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.1)] group animate-fade-in-up opacity-0" style={{ animationDelay: '500ms' }}>
          <div className="border-b border-white/5 bg-black/20 px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-700 text-xs text-slate-300">4</span>
              Skills & Employment
            </h2>
          </div>
          <div className="p-5 sm:p-6 text-white">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wide">
                  Skills (comma separated)
                </label>
                <textarea
                  rows={2}
                  className={fieldClasses("skills")}
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  autoComplete="off"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wide">
                  Employment Status
                </label>
                <div className="mt-2 flex flex-col sm:flex-row gap-4">
                  <label className={`relative flex flex-1 cursor-pointer rounded-xl border p-4 transition-all hover:bg-white/5 ${employmentStatus === 'Fresher' ? 'border-gov-accent bg-gov-accent/10 shadow-[0_0_15px_-3px_rgba(253,186,18,0.2)]' : 'border-white/10 bg-black/20'}`}>
                    <input type="radio" name="employmentStatus" value="Fresher" className="sr-only" checked={employmentStatus === 'Fresher'} onChange={() => { setEmploymentStatus('Fresher'); setExperience(''); setExpectedSalary(''); }} />
                    <div className="flex items-center gap-3">
                      <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${employmentStatus === 'Fresher' ? 'border-gov-accent' : 'border-slate-500'}`}>
                        {employmentStatus === 'Fresher' && <div className="h-2.5 w-2.5 rounded-full bg-gov-accent" />}
                      </div>
                      <span className={`text-base font-bold ${employmentStatus === 'Fresher' ? 'text-white' : 'text-slate-400'}`}>Fresher</span>
                    </div>
                  </label>

                  <label className={`relative flex flex-1 cursor-pointer rounded-xl border p-4 transition-all hover:bg-white/5 ${employmentStatus === 'Experienced' ? 'border-gov-accent bg-gov-accent/10 shadow-[0_0_15px_-3px_rgba(253,186,18,0.2)]' : 'border-white/10 bg-black/20'}`}>
                    <input type="radio" name="employmentStatus" value="Experienced" className="sr-only" checked={employmentStatus === 'Experienced'} onChange={() => setEmploymentStatus('Experienced')} />
                    <div className="flex items-center gap-3">
                      <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${employmentStatus === 'Experienced' ? 'border-gov-accent' : 'border-slate-500'}`}>
                        {employmentStatus === 'Experienced' && <div className="h-2.5 w-2.5 rounded-full bg-gov-accent" />}
                      </div>
                      <span className={`text-base font-bold ${employmentStatus === 'Experienced' ? 'text-white' : 'text-slate-400'}`}>Experienced</span>
                    </div>
                  </label>
                </div>
              </div>

              {employmentStatus === "Experienced" && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wide">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      className="block w-full rounded-lg border border-white/10 bg-gov-panel/50 px-4 py-3 text-sm text-white placeholder-slate-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-gov-accent transition-all"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      placeholder="e.g. 2.5"
                      autoComplete="off"
                      required={employmentStatus === "Experienced"}
                    />
                  </div>
                  <div className="animate-fade-in-up opacity-0" style={{ animationDelay: '200ms' }}>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wide">
                      Expected Salary (LPA)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      className="block w-full rounded-lg border border-white/10 bg-gov-panel/50 px-4 py-3 text-sm text-white placeholder-slate-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-gov-accent transition-all"
                      value={expectedSalary}
                      onChange={(e) => setExpectedSalary(e.target.value)}
                      placeholder="e.g. 15"
                      autoComplete="off"
                      required={employmentStatus === "Experienced"}
                    />
                  </div>
                </>
              )}

            </div>
          </div>
        </section>

        <div className="flex justify-end pt-4 animate-fade-in-up opacity-0" style={{ animationDelay: '600ms' }}>
          <button
            type="submit"
            className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-gov-accent px-8 py-4 text-base font-bold text-gov-bg shadow-[0_0_20px_rgba(253,186,18,0.3)] transition-all duration-300 hover:-translate-y-1 hover:bg-gov-accent-hover hover:shadow-[0_0_30px_rgba(253,186,18,0.5)] active:scale-95"
          >
            Review Profile Summary
            <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
        </div>
      </form>
    </div>
  );
}