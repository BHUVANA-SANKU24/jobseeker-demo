"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

// Fallback image component
function CompanyLogo({ logo, name }: { logo: string, name: string }) {
    const [error, setError] = useState(false);

    if (error || !logo) {
        return (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-lg font-bold text-white shadow-inner border border-slate-700">
                {name.charAt(0)}
            </div>
        );
    }

    return (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white p-1.5 shadow-sm border border-slate-200">
            <img
                src={logo}
                alt={name}
                className="h-full w-full object-contain"
                onError={() => setError(true)}
            />
        </div>
    );
}

export default function JobsPage() {
    const [userSkills, setUserSkills] = useState<string[]>([]);

    useEffect(() => {
        try {
            if (typeof window !== "undefined") {
                const raw = sessionStorage.getItem("demoJobseekerProfile");
                if (raw) {
                    const profile = JSON.parse(raw);
                    if (profile.skills && Array.isArray(profile.skills)) {
                        setUserSkills(profile.skills.map((s: string) => s.toLowerCase()));
                    }
                }
            }
        } catch { }
    }, []);

    const jobs = [
        {
            id: 1,
            role: "Senior Software Engineer",
            company: "Google",
            location: "Hyderabad",
            salary: "₹45L - ₹65L",
            type: "Full-time",
            vacancies: 5,
            requiredSkills: ["python", "go", "system design", "backend", "cloud"],
            link: "https://careers.google.com/",
            logo: "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
        },
        {
            id: 2,
            role: "Data Scientist",
            company: "Microsoft",
            location: "Hyderabad",
            salary: "₹30L - ₹50L",
            type: "Full-time",
            vacancies: 3,
            requiredSkills: ["machine learning", "python", "sql", "azure", "statistics"],
            link: "https://careers.microsoft.com/",
            logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
        },
        {
            id: 3,
            role: "Frontend Developer",
            company: "Amazon",
            location: "Hyderabad",
            salary: "₹25L - ₹40L",
            type: "Full-time",
            vacancies: 12,
            requiredSkills: ["react", "javascript", "css", "html", "nextjs", "typescript"],
            link: "https://amazon.jobs/",
            logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
        },
        {
            id: 4,
            role: "Cloud Architect",
            company: "TCS",
            location: "Hyderabad",
            salary: "₹18L - ₹30L",
            type: "Full-time",
            vacancies: 20,
            requiredSkills: ["aws", "azure", "kubernetes", "docker", "devops"],
            link: "https://www.tcs.com/careers",
            logo: ""
        },
        {
            id: 5,
            role: "Product Manager",
            company: "Flipkart",
            location: "Hyderabad",
            salary: "₹35L - ₹50L",
            type: "Full-time",
            vacancies: 2,
            requiredSkills: ["product management", "agile", "data analysis", "jira", "strategy"],
            link: "https://www.flipkartcareers.com/",
            logo: ""
        },
        {
            id: 6,
            role: "Cybersecurity Analyst",
            company: "Infosys",
            location: "Pune (Remote)",
            salary: "₹15L - ₹25L",
            type: "Remote",
            vacancies: 8,
            requiredSkills: ["security", "networking", "ceh", "wireshark", "linux", "penetration testing"],
            link: "https://www.infosys.com/careers/",
            logo: "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg"
        },
        {
            id: 7,
            role: "UX/UI Designer",
            company: "Zomato",
            location: "Gurugram",
            salary: "₹20L - ₹30L",
            type: "Full-time",
            vacancies: 4,
            requiredSkills: ["figma", "ui design", "ux research", "wireframing", "adobe xd"],
            link: "https://careers.zomato.com/",
            logo: "https://upload.wikimedia.org/wikipedia/commons/b/b5/Zomato_logo.png"
        },
        {
            id: 8,
            role: "DevOps Engineer",
            company: "Wipro",
            location: "Bangalore",
            salary: "₹18L - ₹28L",
            type: "Full-time",
            vacancies: 15,
            requiredSkills: ["jenkins", "ci/cd", "linux", "bash", "aws", "terraform"],
            link: "https://careers.wipro.com/",
            logo: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg"
        },
        {
            id: 9,
            role: "Machine Learning Engineer",
            company: "Meta",
            location: "Remote",
            salary: "₹50L - ₹80L",
            type: "Remote",
            vacancies: 1,
            requiredSkills: ["deep learning", "pytorch", "tensorflow", "python", "nlp", "computer vision"],
            link: "https://meta.com/careers",
            logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg"
        },
        {
            id: 10,
            role: "Backend Engineer",
            company: "Swiggy",
            location: "Bangalore",
            salary: "₹25L - ₹45L",
            type: "Full-time",
            vacancies: 6,
            requiredSkills: ["java", "spring boot", "microservices", "kafka", "redis", "postgresql"],
            link: "https://careers.swiggy.com/",
            logo: "https://upload.wikimedia.org/wikipedia/en/1/12/Swiggy_logo.svg"
        },
        {
            id: 11,
            role: "iOS Developer",
            company: "Apple",
            location: "Hyderabad",
            salary: "₹40L - ₹60L",
            type: "Full-time",
            vacancies: 3,
            requiredSkills: ["swift", "objective-c", "ios sdk", "xcode", "core data"],
            link: "https://jobs.apple.com/",
            logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
        },
        {
            id: 12,
            role: "Data Analyst",
            company: "Tech Mahindra",
            location: "Hyderabad",
            salary: "₹10L - ₹18L",
            type: "Full-time",
            vacancies: 25,
            requiredSkills: ["sql", "excel", "tableau", "power bi", "data visualization"],
            link: "https://careers.techmahindra.com/",
            logo: "https://upload.wikimedia.org/wikipedia/commons/f/f3/Tech_Mahindra_New_Logo.svg"
        }
    ];

    // Matching logic that returns score and specifically which skills matched
    const getMatchDetails = (required: string[]) => {
        if (userSkills.length === 0) return { score: 0, matched: [] };
        const matched: string[] = [];
        required.forEach(req => {
            // Check if user has the specific skill (case-insensitive substring match)
            if (userSkills.some(user => user.includes(req) || req.includes(user))) {
                matched.push(req);
            }
        });
        const score = Math.min(Math.round((matched.length / required.length) * 100), 100);
        return { score, matched };
    };

    return (
        <div className="max-w-7xl mx-auto w-full pt-8 pb-16 px-2 sm:px-6">
            <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Browse Opportunities</h1>
                    <p className="text-slate-400 text-lg">Find realistic, high-quality jobs matching your profile.</p>
                </div>

                {userSkills.length > 0 && (
                    <div className="flex flex-col items-center sm:items-end gap-1.5">
                        <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-400 shadow-lg shadow-emerald-500/5">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            Personalized Match Active
                        </div>
                        <p className="text-xs text-slate-400 max-w-[250px] sm:text-right leading-tight">
                            Eligibility is calculated by instantly checking your registered AI profile skills against job requirements.
                        </p>
                    </div>
                )}
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-gov-panel/40 backdrop-blur-md shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-300">
                        <thead className="bg-black/40 text-xs uppercase tracking-wider text-slate-400 border-b border-white/10">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-bold">Company & Role</th>
                                <th scope="col" className="px-6 py-4 font-bold">Locations</th>
                                <th scope="col" className="px-6 py-4 font-bold">Vacancies</th>
                                <th scope="col" className="px-6 py-4 font-bold">Offer / Salary</th>
                                <th scope="col" className="px-6 py-4 font-bold text-center">Eligibility</th>
                                <th scope="col" className="px-6 py-4 font-bold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {jobs.map((job) => {
                                const { score: matchScore, matched: matchedSkills } = getMatchDetails(job.requiredSkills);

                                return (
                                    <tr key={job.id} className="group transition-colors hover:bg-white/5">
                                        {/* Role & Company */}
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <CompanyLogo logo={job.logo} name={job.company} />
                                                <div>
                                                    <div className="font-bold text-white text-base group-hover:text-gov-accent transition-colors">{job.role}</div>
                                                    <div className="text-slate-400 flex items-center gap-1.5 mt-0.5">
                                                        {job.company}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Location */}
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="flex items-center gap-1.5 text-slate-300">
                                                <svg className="w-3.5 h-3.5 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                {job.location}
                                            </div>
                                            <div className="text-xs text-slate-500 mt-1 pl-5">{job.type}</div>
                                        </td>

                                        {/* Vacancies */}
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="inline-flex items-center justify-center rounded-full bg-slate-800/80 border border-slate-700 font-medium px-3 py-1 text-slate-300 shadow-inner">
                                                <span className="text-white font-bold mr-1">{job.vacancies}</span> Openings
                                            </div>
                                        </td>

                                        {/* Salary */}
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="font-bold text-emerald-400 font-mono">
                                                {job.salary}
                                            </div>
                                        </td>

                                        {/* Match Score */}
                                        <td className="px-6 py-5 whitespace-nowrap text-center">
                                            <div className="flex flex-col items-center justify-center relative group/match">
                                                {userSkills.length === 0 ? (
                                                    <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 border border-slate-700 px-2.5 py-1 text-xs text-slate-400 cursor-help">
                                                        Pending Profile
                                                    </div>
                                                ) : matchScore >= 50 ? (
                                                    <div className="inline-flex items-center gap-1.5 rounded-full bg-gov-accent/20 border border-gov-accent/30 px-3 py-1 text-xs font-bold text-gov-accent shadow-[0_0_15px_-3px_rgba(253,186,18,0.3)] cursor-help">
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                        Excellent Match!
                                                    </div>
                                                ) : matchScore > 0 ? (
                                                    <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 px-3 py-1 text-xs font-bold text-blue-400 cursor-help">
                                                        Good Match
                                                    </div>
                                                ) : (
                                                    <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 border border-slate-700 px-3 py-1 text-xs font-bold text-slate-400 cursor-help">
                                                        Low Match
                                                    </div>
                                                )}

                                                {/* Tooltip on Hover */}
                                                {userSkills.length > 0 && (
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 rounded-xl bg-slate-800 p-3 text-xs text-slate-300 opacity-0 shadow-2xl transition-opacity duration-300 group-hover/match:opacity-100 pointer-events-none z-50 border border-slate-700">
                                                        <div className="font-bold text-white mb-2 border-b border-slate-700 pb-2 text-center">
                                                            Skills Matched ({matchedSkills.length}/{job.requiredSkills.length})
                                                        </div>
                                                        {matchedSkills.length > 0 ? (
                                                            <div className="flex flex-wrap gap-1.5 justify-center">
                                                                {matchedSkills.map(s => (
                                                                    <span key={s} className="bg-gov-accent/20 text-gov-accent px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider">
                                                                        {s}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="text-slate-500 text-center italic">No overlapping skills found in profile.</div>
                                                        )}

                                                        <div className="mt-3 text-[10px] text-slate-500 text-center border-t border-slate-700/50 pt-2">
                                                            Reqs: {job.requiredSkills.slice(0, 3).join(', ')}{job.requiredSkills.length > 3 ? '...' : ''}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        {/* Action */}
                                        <td className="px-6 py-5 whitespace-nowrap text-right">
                                            <a
                                                href={job.link}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-slate-900 transition-all hover:bg-gov-accent hover:text-white hover:scale-105 hover:shadow-[0_0_15px_-3px_rgba(253,186,18,0.4)]"
                                            >
                                                Apply Now
                                                <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                            </a>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {jobs.length === 0 && (
                        <div className="py-16 text-center text-slate-500">
                            No jobs currently available.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
