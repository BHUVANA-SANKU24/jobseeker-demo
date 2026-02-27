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
      "block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gov-accent focus-visible:ring-offset-1",
      autoFilledFields.has(key)
        ? "border-emerald-300 bg-emerald-50"
        : "border-slate-300 bg-white",
    ].join(" ");

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Jobseeker Registration Form (Demo)
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Upload a resume and review the auto-filled details. All fields
            remain fully editable.
          </p>
        </div>
        <div className="hidden rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-900 sm:block">
          <p className="font-semibold">Important</p>
          <p>This prototype does not submit data to any official portal.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Upload Resume */}
        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
            Upload Resume
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Backend extraction uses Flask endpoint{" "}
            <span className="font-semibold">POST /extract</span>.
            <br />
            ✅ Best for demo: upload <span className="font-semibold">.txt</span>{" "}
            resumes.
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="flex flex-1 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-center text-xs text-slate-600 hover:border-gov-accent hover:bg-slate-100">
              <span className="font-medium text-slate-800">
                Click to choose file (.txt recommended)
              </span>
              <span className="mt-1 text-[11px]">
                Uses your local Flask server at {API_BASE_URL}
              </span>
              <input
                type="file"
                accept=".txt,.pdf,.docx,.png,.jpg,.jpeg"
                className="hidden"
                onChange={handleResumeUpload}
              />
            </label>

            <div className="min-w-[180px] text-xs text-slate-500">
              <p className="font-medium text-slate-700">Status</p>
              <p className="mt-1">
                {resumeFileName ? (
                  <>
                    Selected:{" "}
                    <span className="font-semibold">{resumeFileName}</span>
                  </>
                ) : (
                  "No file selected yet."
                )}
              </p>
              {loading && (
                <p className="mt-2 text-[11px] text-slate-700">
                  Extracting…
                </p>
              )}
            </div>
          </div>

          {errorMsg && (
            <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-[12px] text-red-700">
              {errorMsg}
            </p>
          )}

          {autoFilledFields.size > 0 && (
            <p className="mt-3 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-800">
              Fields highlighted in green were auto-filled from Flask response.
            </p>
          )}
        </section>

        {/* Personal Details */}
        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
            Personal Details
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-700">
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
              <label className="block text-xs font-medium text-slate-700">
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
              <label className="block text-xs font-medium text-slate-700">
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
        </section>

        {/* Education Details */}
        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
            Education Details
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-700">
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
              <label className="block text-xs font-medium text-slate-700">
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
        </section>

        {/* Skills & Employment */}
        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
            Skills & Employment Status
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-700">
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

            <div>
              <label className="block text-xs font-medium text-slate-700">
                Employment Status
              </label>
              <div className="mt-1 grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  className={`rounded-md border px-3 py-2 font-medium ${
                    employmentStatus === "Fresher"
                      ? "border-gov-accent bg-gov-accent text-white"
                      : "border-slate-300 bg-white text-slate-700"
                  }`}
                  onClick={() => setEmploymentStatus("Fresher")}
                >
                  Fresher
                </button>
                <button
                  type="button"
                  className={`rounded-md border px-3 py-2 font-medium ${
                    employmentStatus === "Experienced"
                      ? "border-gov-accent bg-gov-accent text-white"
                      : "border-slate-300 bg-white text-slate-700"
                  }`}
                  onClick={() => setEmploymentStatus("Experienced")}
                >
                  Experienced
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-slate-500">
            Proceed to view a structured profile summary.
          </p>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md bg-gov-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-900"
          >
            Review Profile Summary
          </button>
        </div>
      </form>
    </div>
  );
}