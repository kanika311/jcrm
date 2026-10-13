export default function WhyChooseSection() {
  const points = [
    "100% Job Oriented Training & Curriculum",
    "Industry Oriented Microservices & Cloud Projects",
    "Practical Hands-on Coding from Day One",
    "Real-Time Production Deployment on AWS & Docker",
    "Interview Preparation, Resume Review & Mock Rounds",
    "Direct HR References & Placement Assistance",
    "1-on-1 Live Online Mentoring Sessions",
    "Lifelong Career Guidance & Alumni Network",
  ];

  const cards = [
    {
      title: "Enterprise Security",
      desc: "Role-based access & audit logs",
      icon: (
        <svg className="w-5 h-5 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
    },
    {
      title: "Cloud Native",
      desc: "Fast Docker & AWS deployments",
      icon: (
        <svg className="w-5 h-5 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      ),
    },
    {
      title: "Real-Time Analytics",
      desc: "Actionable student & client reports",
      icon: (
        <svg className="w-5 h-5 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      ),
    },
    {
      title: "Long-Term Partnership",
      desc: "150+ corporate & hiring ties",
      icon: (
        <svg className="w-5 h-5 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20H2v-2a3 3 0 015.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-10 sm:py-20 md:py-24 relative z-10" id="why-choose">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto mb-6 sm:mb-14">
          <h2 className="heading-font text-2xl sm:text-4xl md:text-5xl font-extrabold mb-2 sm:mb-4 text-slate-900">
            Why Choose <span className="text-[#0055FF]">JCRM Technologies</span>
          </h2>
          <p className="text-xs sm:text-base md:text-lg text-slate-600 font-medium max-w-2xl mx-auto">
            Practical engineering courses, scalable enterprise ERP systems, and committed 100% placement support.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 items-center">
          {/* Left Column - Bullet Points */}
          <div className="flex flex-col gap-2.5 sm:gap-4">
            {points.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 sm:gap-4 bg-white/80 backdrop-blur-md border border-blue-100/80 rounded-xl sm:rounded-full px-4 py-2.5 sm:px-6 sm:py-4 shadow-xs hover:shadow-md hover:border-blue-300 transition-all duration-300"
              >
                <div className="bg-[#0055FF] rounded-full text-white p-1 flex-shrink-0 shadow-xs">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="font-semibold text-slate-800 text-xs sm:text-sm md:text-base tracking-wide">
                  {item}
                </span>
              </div>
            ))}
          </div>

          {/* Right Column - 2x2 Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-6 bg-white/85 backdrop-blur-xl p-4 sm:p-8 md:p-10 rounded-2xl sm:rounded-[36px] shadow-lg border border-blue-100 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/70 via-sky-50/40 to-transparent rounded-2xl sm:rounded-[36px] pointer-events-none" />

            {cards.map((card, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center p-3 sm:p-6 gap-1.5 sm:gap-3 relative z-10 hover:-translate-y-1 transition-transform bg-white/60 rounded-xl sm:rounded-2xl border border-blue-50/80 shadow-xs"
              >
                <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0055FF] shadow-xs">
                  {card.icon}
                </div>
                <h3 className="font-bold text-slate-900 text-xs sm:text-lg">
                  {card.title}
                </h3>
                <p className="text-[10px] sm:text-sm text-slate-500 font-medium leading-tight">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
