import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal Information & Policies | JCRM Technologies",
  description: "Official legal documentation, policies, terms, and compliance guidelines of JCRM Technologies.",
};

export default function LegalIndexPage() {
  const legalLinks = [
    {
      title: "Privacy Policy",
      href: "/legal/privacy",
      desc: "How we collect, use, and protect your personal information and learning records.",
      icon: "🛡️",
      badge: "User Privacy",
    },
    {
      title: "Terms and Conditions",
      href: "/legal/terms",
      desc: "The rules, guidelines, and binding agreements for using JCRM platforms and courses.",
      icon: "📜",
      badge: "Agreement",
    },
    {
      title: "Cookie Policy",
      href: "/legal/cookies",
      desc: "Information regarding cookie tokens, browser preferences, and tracking technologies.",
      icon: "🍪",
      badge: "Cookies",
    },
    {
      title: "Refund & Cancellation Policy",
      href: "/legal/refund",
      desc: "Our transparent 7-day money-back guarantee and cancellation guidelines.",
      icon: "💳",
      badge: "Billing",
    },
  ];

  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-sky-50/20 to-transparent">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#0055FF]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block px-3.5 py-1 mb-3 text-xs font-extrabold uppercase tracking-widest text-[#0055FF] bg-blue-50/90 rounded-full border border-blue-100">
            TRANSPARENCY & TRUST
          </span>
          <h1 className="heading-font text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
            Legal & Compliance Hub
          </h1>
          <p className="text-sm text-slate-600 font-medium">
            Explore our legal documentation, terms of service, privacy protocols, and billing guarantees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {legalLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group p-8 rounded-[28px] bg-white/90 backdrop-blur-xl border border-white/90 shadow-[0_10px_35px_rgba(0,85,255,0.07)] hover:shadow-[0_20px_45px_rgba(0,85,255,0.14)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{item.icon}</span>
                  <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-blue-50 text-[#0055FF] border border-blue-100">
                    {item.badge}
                  </span>
                </div>
                <h2 className="heading-font text-xl font-extrabold text-slate-900 group-hover:text-[#0055FF] transition-colors mb-2">
                  {item.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-[#0055FF]">
                <span>Read Document</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
