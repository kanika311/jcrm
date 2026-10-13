import Link from "next/link";

export default function ErpProductsSection() {
  const products = [
    {
      title: "LMS ERP",
      features: "Admissions • Live Classes • Fee Portal",
      slug: "institute-lms-erp",
      icon: (
        <svg className="w-5 h-5 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
      ),
    },
    {
      title: "HR Management",
      features: "Payroll • Attendance • Compliance",
      slug: "hr-management",
      icon: (
        <svg className="w-5 h-5 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20H2v-2a3 3 0 015.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      title: "Hospital ERP",
      features: "OPD/IPD • EHR • Pharmacy LIMS",
      slug: "healthcare-hospital-erp",
      icon: (
        <svg className="w-5 h-5 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4m-2-11v2m-1-1h2" />
        </svg>
      ),
    },
    {
      title: "Accounting ERP",
      features: "GST Billing • Invoicing • Ledger",
      slug: "accounting-erp",
      icon: (
        <svg className="w-5 h-5 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: "Gym Management",
      features: "Membership • Biometrics • Workouts",
      slug: "gym-management",
      icon: (
        <svg className="w-5 h-5 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5h16.5m-16.5 3h16.5M3.75 9h16.5m-16.5-3h16.5" />
        </svg>
      ),
    },
    {
      title: "Cab Booking",
      features: "Dispatch • Driver App • Live GPS",
      slug: "cab-booking",
      icon: (
        <svg className="w-5 h-5 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 17a2 2 0 100 4 2 2 0 000-4zm8 0a2 2 0 100 4 2 2 0 000-4zM3 9l2-4h14l2 4M3 9v8a1 1 0 001 1h1m16-9v8a1 1 0 01-1 1h-1M3 9h18" />
        </svg>
      ),
    },
    {
      title: "Food Delivery",
      features: "Orders • Kitchen Display • Tracking",
      slug: "food-delivery",
      icon: (
        <svg className="w-5 h-5 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "E-Commerce",
      features: "Multi-vendor • Cart • Razorpay/Stripe",
      slug: "e-commerce",
      icon: (
        <svg className="w-5 h-5 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
      ),
    },
    {
      title: "AI Chatbot",
      features: "LLM Powered • RAG Support • 24/7",
      slug: "chatbot",
      icon: (
        <svg className="w-5 h-5 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      title: "Fraud Detection",
      features: "Risk Scoring • ML Rules • Alerts",
      slug: "fraud-detection",
      icon: (
        <svg className="w-5 h-5 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-10 sm:py-20 md:py-24 relative z-10" id="erp-products">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto mb-6 sm:mb-14">
          <h2 className="heading-font text-2xl sm:text-4xl md:text-5xl font-extrabold mb-1.5 sm:mb-3 text-slate-900">
            Enterprise <span className="text-[#0055FF]">ERP Products & Software</span>
          </h2>
          <p className="text-xs sm:text-base md:text-lg text-slate-600 font-medium max-w-2xl mx-auto">
            Purpose-built cloud ERP solutions by JCRM Technologies (Jain CRM) designed for educational institutes, hospitals, and growing businesses.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-6">
          {products.map((prod, i) => (
            <Link
              key={i}
              href="/erp-solutions"
              className="group flex flex-col items-center text-center p-3.5 sm:p-7 rounded-2xl sm:rounded-[28px] bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_4px_20px_rgba(0,85,255,0.06)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden w-[calc(50%-6px)] sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] max-w-[300px] shrink-0"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-sky-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl sm:rounded-[28px]" />

              <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0055FF] mb-2.5 sm:mb-5 shadow-xs group-hover:scale-110 group-hover:bg-[#0055FF] group-hover:text-white transition-all duration-300 shrink-0">
                {prod.icon}
              </div>

              <h3 className="heading-font font-extrabold text-slate-900 text-xs sm:text-xl mb-1 sm:mb-2 tracking-tight group-hover:text-[#0055FF] transition-colors truncate w-full">
                {prod.title}
              </h3>

              <span className="text-[9px] sm:text-xs font-semibold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-blue-50/80 border border-blue-100/70 text-slate-600 tracking-wide mt-auto truncate max-w-full">
                {prod.features}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
