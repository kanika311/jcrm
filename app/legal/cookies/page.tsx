import { getSiteContent } from "@/lib/cms";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | JCRM Technologies",
  description: "Cookie Policy detailing cookie usage, tracking technologies, and browser preferences.",
};

export const dynamic = "force-dynamic";

export default async function CookiePolicyPage() {
  const cmsData = await getSiteContent("public-cookie");

  const heading = cmsData?.heading || "Cookie Policy";
  const lastUpdated = cmsData?.lastUpdated || "September 2026";
  const content = cmsData?.content || "JCRM Technologies uses essential session cookies, preference cookies, and security tokens to maintain your authentication state and ensure optimal website performance. You may disable cookies through your browser settings, though some interactive features may not function properly.";

  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-sky-50/20 to-transparent">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#0055FF]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Breadcrumb & Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <Link href="/" className="hover:text-[#0055FF]">Home</Link>
            <span>/</span>
            <span className="text-[#0055FF]">Cookie Policy</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link href="/legal/privacy" className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white text-slate-700 hover:bg-slate-100 border border-slate-200">
              Privacy Policy
            </Link>
            <Link href="/legal/terms" className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white text-slate-700 hover:bg-slate-100 border border-slate-200">
              Terms & Conditions
            </Link>
            <Link href="/legal/cookies" className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-[#0055FF] text-white shadow-sm">
              Cookie Policy
            </Link>
            <Link href="/legal/refund" className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white text-slate-700 hover:bg-slate-100 border border-slate-200">
              Refund Policy
            </Link>
          </div>
        </div>

        {/* Page Header */}
        <div className="mb-10 animate-fade-in-up">
          <span className="inline-block px-3.5 py-1 mb-3 text-xs font-extrabold uppercase tracking-widest text-[#0055FF] bg-blue-50/90 rounded-full border border-blue-100">
            COOKIE DISCLOSURE
          </span>
          <h1 className="heading-font text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
            {heading}
          </h1>
          <p className="text-xs font-bold text-slate-500">
            Effective Date: {lastUpdated} • JCRM Technologies Platform
          </p>
        </div>

        {/* Content Box */}
        <div className="p-8 sm:p-10 rounded-[28px] bg-white/90 backdrop-blur-xl border border-white/90 shadow-[0_10px_35px_rgba(0,85,255,0.07)] space-y-6">
          <div className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed whitespace-pre-line">
            {content}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-slate-200">
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
              <div className="text-xs font-extrabold text-[#0055FF] mb-1">Essential Cookies</div>
              <p className="text-[11px] text-slate-600">Necessary for NextAuth login, security tokens, and navigation.</p>
            </div>
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
              <div className="text-xs font-extrabold text-[#0055FF] mb-1">Preference Cookies</div>
              <p className="text-[11px] text-slate-600">Remember your theme selection, course filter states, and preferences.</p>
            </div>
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
              <div className="text-xs font-extrabold text-[#0055FF] mb-1">Analytics Tokens</div>
              <p className="text-[11px] text-slate-600">Help us understand how students navigate lectures and ERP documentation.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
