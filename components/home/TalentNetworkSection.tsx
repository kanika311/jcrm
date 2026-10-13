import Link from "next/link";

export default function TalentNetworkSection() {
  const perks = [
    "Work on live, high-impact enterprise ERP microservices",
    "Gain industry exposure and architecture mentorship",
    "Direct mentorship from senior technical leads",
    "Flexible remote-friendly project collaboration",
    "Competitive career benefits and corporate referrals",
  ];

  return (
    <section className="py-10 sm:py-20 md:py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-5 sm:p-10 md:p-12 rounded-2xl sm:rounded-[36px] bg-white/85 backdrop-blur-2xl border border-white/90 shadow-[0_8px_35px_rgba(0,85,255,0.08)] grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Left Content */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <h2 className="heading-font text-xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-2 sm:mb-3 tracking-tight">
                Join Our <span className="text-[#0055FF]">Talent Network</span>
              </h2>
              <p className="text-slate-600 font-medium text-xs sm:text-base md:text-lg mb-4 sm:mb-6 leading-relaxed">
                We welcome aspiring UI/UX designers, Frontend &amp; Backend engineers, Full Stack developers, QA automation testers, and technical support talent.
              </p>

              <ul className="space-y-2 sm:space-y-3 mb-5 sm:mb-8">
                {perks.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 sm:gap-3">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#0055FF] text-white flex items-center justify-center text-[10px] sm:text-xs font-extrabold shrink-0 shadow-xs">
                      ✓
                    </div>
                    <span className="text-xs sm:text-sm md:text-base font-semibold text-slate-800">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 sm:gap-4">
              <Link
                href="/contact"
                className="px-5 py-2.5 sm:px-8 sm:py-4 rounded-full text-xs sm:text-base font-extrabold text-white bg-[#0055FF] shadow-lg hover:shadow-blue-500/30 hover:scale-105 transition-all inline-flex items-center gap-2"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send Resume
              </Link>
              <a
                href="https://www.linkedin.com/company/jcrm-technologies"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 sm:px-8 sm:py-4 rounded-full text-xs sm:text-base font-extrabold text-[#0055FF] bg-blue-50 border border-blue-200 hover:bg-[#0055FF] hover:text-white transition-all inline-flex items-center gap-2 shadow-xs"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
                Connect on LinkedIn
              </a>
            </div>
          </div>

          {/* Right Quote Box */}
          <div className="lg:col-span-5">
            <div className="p-5 sm:p-8 md:p-10 rounded-xl sm:rounded-[28px] bg-gradient-to-br from-blue-50/90 via-sky-50/50 to-white/90 border border-blue-100/90 shadow-xs relative overflow-hidden flex flex-col justify-between h-full">
              <div className="text-[#0055FF] opacity-30 text-4xl sm:text-6xl font-serif leading-none mb-1 sm:mb-2">“</div>
              <blockquote className="text-sm sm:text-xl md:text-2xl font-bold text-slate-800 italic leading-snug mb-3 sm:mb-6 relative z-10">
                “Alone we can do so little; together we can do so much.”
              </blockquote>
              <div className="text-xs sm:text-sm font-extrabold text-[#0055FF] tracking-wide">
                — Helen Keller
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
