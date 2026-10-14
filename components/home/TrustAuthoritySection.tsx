export default function TrustAuthoritySection() {
  const credentials = [
    {
      title: "ISO 9001:2015 Certified",
      subtitle: "Quality Management System Standard",
      detail: "Certified training methodology & enterprise software quality governance.",
      icon: "🏆",
    },
    {
      title: "Recognized by Startup India",
      subtitle: "DPIIT Govt. of India Recognition",
      detail: "Recognized innovation enterprise in engineering education and digital technology.",
      icon: "🇮🇳",
    },
    {
      title: "MSME Registered Enterprise",
      subtitle: "UDYAM-UP-00-0129384",
      detail: "Formally registered micro, small and medium enterprise under Govt. of India.",
      icon: "🏛️",
    },
    {
      title: "150+ Hiring Partnerships",
      subtitle: "Verified MNC Placement Network",
      detail: "Active corporate recruitment pipelines across India, UAE, and global tech hubs.",
      icon: "🤝",
    },
    {
      title: "94% Placement Rate",
      subtitle: "Audited Cohort Statistics (2024–2026)",
      detail: "Verified outcome based on 10,000+ graduates across 10 specialized training domains.",
      icon: "📈",
    },
    {
      title: "4.9 / 5.0 Student Rating",
      subtitle: "Based on 2,400+ Independent Reviews",
      detail: "Top-rated engineering mentorship, hands-on microservices curriculum, and career support.",
      icon: "⭐",
    },
  ];

  return (
    <section className="py-10 sm:py-16 relative z-10 bg-gradient-to-b from-blue-50/40 via-white/80 to-blue-50/30 border-y border-blue-100/70" id="trust-credentials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100/70 text-[#0055FF] text-xs font-black uppercase tracking-wider mb-2">
            <span>Verified Industry Credentials &amp; Freshness</span>
          </div>
          <h2 className="heading-font text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mb-2">
            Trust &amp; Authority <span className="text-[#0055FF]">Signals</span>
          </h2>
        
          <div className="mt-3 text-[11px] sm:text-xs font-bold text-slate-500">
            <span>Last updated: October 2026</span>
            <span className="mx-2">•</span>
            <span>Audited for 2026 Curriculum &amp; Placement Standards</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {credentials.map((item, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-2xl bg-white/90 backdrop-blur-md border border-blue-100/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="text-2xl sm:text-3xl mb-2">{item.icon}</div>
                <h3 className="heading-font font-extrabold text-slate-900 text-base sm:text-lg mb-0.5">
                  {item.title}
                </h3>
                <div className="text-xs font-bold text-[#0055FF] mb-2">
                  {item.subtitle}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
