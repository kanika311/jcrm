import Link from "next/link";

export default function TrainingPlacementSection() {
  const programs = [
    { title: "Frontend Development", slug: "frontend-development" },
    { title: "Backend Development", slug: "backend-development" },
    { title: "AI & Machine Learning", slug: "ai-machine-learning" },
    { title: "Data Science", slug: "data-science" },
    { title: "Cyber Security", slug: "cyber-security" },
    { title: "Forensic Science", slug: "forensic-science" },
    { title: "Cloud & DevOps", slug: "cloud-devops" },
    { title: "QA Automation", slug: "qa-automation" },
    { title: "Digital Marketing", slug: "digital-marketing" },
    { title: "Zen AI", slug: "zen-ai" },
  ];

  const steps = [
    { step: "1", text: "Choose program & apply online" },
    { step: "2", text: "Complete live modules & build projects" },
    { step: "3", text: "Get placed via 150+ hiring partner referrals" },
  ];

  return (
    <section className="py-10 sm:py-20 md:py-24 relative z-10" id="courses-placement">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto mb-6 sm:mb-14">
          <h2 className="heading-font text-2xl sm:text-4xl md:text-5xl font-extrabold mb-2 sm:mb-4 text-slate-900">
            Training & <span className="text-[#0055FF]">100% Placement Assistance</span>
          </h2>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          {/* Left Card - Internship & Training Programs (8 Columns) */}
          <div className="lg:col-span-8 p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-[36px] bg-white/85 backdrop-blur-2xl border border-white/90 shadow-[0_8px_35px_rgba(0,85,255,0.08)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 sm:gap-3 mb-5 sm:mb-8">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0055FF] shadow-xs">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="heading-font font-extrabold text-slate-900 text-lg sm:text-2xl tracking-tight">
                  Internship & Training Programs
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4 mb-4 sm:mb-8">
                {programs.map((prog, idx) => (
                  <div
                    key={idx}
                    className="group flex items-center justify-between p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-blue-50/50 border border-blue-100/70 hover:bg-white hover:border-blue-300 hover:shadow-xs transition-all duration-200"
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-white border border-blue-100 flex items-center justify-center text-[#0055FF] shadow-xs group-hover:scale-105 transition-transform shrink-0">
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                      </div>
                      <span className="font-bold text-slate-800 text-xs sm:text-sm truncate">
                        {prog.title}
                      </span>
                    </div>
                    <Link
                      href={`/courses/${prog.slug}`}
                      className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-extrabold text-[#0055FF] bg-white border border-blue-200 hover:bg-[#0055FF] hover:text-white transition-all shadow-xs shrink-0"
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Card - Join Our Network (4 Columns) */}
          <div className="lg:col-span-4 p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-[36px] bg-gradient-to-br from-white/90 via-blue-50/40 to-white/90 backdrop-blur-2xl border border-blue-100 shadow-[0_8px_35px_rgba(0,85,255,0.08)] flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0055FF] shadow-xs">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <h3 className="heading-font font-extrabold text-slate-900 text-lg sm:text-2xl tracking-tight">
                  Join Our Network
                </h3>
              </div>

              <p className="text-slate-600 font-medium text-xs sm:text-sm md:text-base leading-relaxed mb-4 sm:mb-6">
                Build real enterprise ERP modules, collaborate with senior mentors, and fast-track your placements at top MNCs.
              </p>

              <div className="space-y-2.5 sm:space-y-4 mb-5 sm:mb-8">
                {steps.map((s, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 sm:gap-3">
                    <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#0055FF] text-white font-extrabold text-[11px] sm:text-xs flex items-center justify-center shrink-0 shadow-xs">
                      {s.step}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                      {s.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Link
                href="/joinus"
                className="w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-base md:text-lg font-extrabold text-white bg-[#0055FF] shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                Apply Now
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
