import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto w-full pt-12 pb-24 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-gov-accent/30 bg-gov-accent/10 px-4 py-1.5 text-[11px] font-bold tracking-[0.15em] text-gov-accent uppercase mb-8">
                <span className="h-1.5 w-1.5 rounded-full bg-gov-accent" />
                OUR MISSION
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-6">
                Empowering the Workforce of <span className="font-serif italic text-gov-accent">Tomorrow</span>
            </h1>

            <p className="text-lg text-slate-400 mb-16 max-w-3xl">
                DEET (Digital Employment Exchange of Telangana) is dedicated to bridging the gap between talent and opportunity. Our AI-driven platform instantly connects skilled jobseekers with top-tier companies, ensuring a seamless and highly accurate placement process.
            </p>

            {/* Success Metrics Section */}
            <h2 className="text-2xl font-bold tracking-tight text-white mb-8 border-b border-white/10 pb-4">
                Our Impact So Far
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">

                <div className="flex flex-col items-center sm:items-start p-6 rounded-2xl border border-white/5 bg-gov-panel/40 backdrop-blur-sm">
                    <div className="h-12 w-12 rounded-xl bg-gov-accent/20 flex items-center justify-center text-gov-accent mb-4">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    </div>
                    <p className="text-4xl font-serif font-bold text-white mb-1">2.4M+</p>
                    <p className="text-sm font-bold tracking-wider text-slate-500 uppercase">Jobs Secured</p>
                    <p className="text-sm text-slate-400 mt-2 text-center sm:text-left">Successfully placed candidates across diverse sectors in India.</p>
                </div>

                <div className="flex flex-col items-center sm:items-start p-6 rounded-2xl border border-white/5 bg-gov-panel/40 backdrop-blur-sm">
                    <div className="h-12 w-12 rounded-xl bg-gov-accent/20 flex items-center justify-center text-gov-accent mb-4">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <p className="text-4xl font-serif font-bold text-white mb-1">94%</p>
                    <p className="text-sm font-bold tracking-wider text-slate-500 uppercase">Success Rate</p>
                    <p className="text-sm text-slate-400 mt-2 text-center sm:text-left">Our AI matching ensures highly accurate fit between candidate and company.</p>
                </div>

                <div className="flex flex-col items-center sm:items-start p-6 rounded-2xl border border-white/5 bg-gov-panel/40 backdrop-blur-sm">
                    <div className="h-12 w-12 rounded-xl bg-gov-accent/20 flex items-center justify-center text-gov-accent mb-4">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    </div>
                    <p className="text-4xl font-serif font-bold text-white mb-1">500+</p>
                    <p className="text-sm font-bold tracking-wider text-slate-500 uppercase">Partner Companies</p>
                    <p className="text-sm text-slate-400 mt-2 text-center sm:text-left">Actively hiring from our pre-screened and AI-verified talent pool.</p>
                </div>

            </div>

            <div className="flex justify-center sm:justify-start">
                <Link
                    href="/register"
                    className="group relative inline-flex flex-col items-center sm:items-start justify-center gap-1 rounded-2xl bg-gradient-to-r from-gov-accent to-orange-500 px-8 py-4 text-slate-900 shadow-[0_0_30px_-5px_rgba(253,186,18,0.5)] transition-all hover:-translate-y-1 hover:shadow-[0_0_40px_-5px_rgba(253,186,18,0.7)]"
                >
                    <div className="flex items-center gap-2 text-lg font-black tracking-tight">
                        Kickstart Your Career Journey
                        <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </div>
                    <p className="text-xs font-bold text-slate-800 uppercase tracking-widest mt-1">Perfect for Freshers & Grads</p>
                </Link>
            </div>
        </div>
    );
}
