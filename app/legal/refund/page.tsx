import { getSiteContent } from "@/lib/cms";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | JCRM Technologies",
  description: "Learn about refund and cancellation policies for JCRM courses and software products.",
};

export const dynamic = "force-dynamic";

export default async function RefundPolicyPage() {
  const cmsData = await getSiteContent("public-refund");

  const heading = cmsData?.heading || "Refund & Cancellation Policy";
  const lastUpdated = cmsData?.lastUpdated || "September 2026";
  const content = cmsData?.content || "Students may request a full refund within 7 calendar days of initial course purchase provided fewer than 20% of curriculum lessons have been viewed. Enterprise ERP setup fees, custom software deployments, and 1-on-1 mentorship charges are non-refundable once work has commenced. Approved refunds are credited to the original payment source within 5-7 business days.";

  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-sky-50/20 to-transparent">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#0055FF]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Breadcrumb & Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <Link href="/" className="hover:text-[#0055FF]">Home</Link>
            <span>/</span>
            <span className="text-[#0055FF]">Refund Policy</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link href="/legal/privacy" className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white text-slate-700 hover:bg-slate-100 border border-slate-200">
              Privacy Policy
            </Link>
            <Link href="/legal/terms" className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white text-slate-700 hover:bg-slate-100 border border-slate-200">
              Terms & Conditions
            </Link>
            <Link href="/legal/cookies" className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white text-slate-700 hover:bg-slate-100 border border-slate-200">
              Cookie Policy
            </Link>
            <Link href="/legal/refund" className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-[#0055FF] text-white shadow-sm">
              Refund Policy
            </Link>
          </div>
        </div>

        {/* Page Header */}
        <div className="mb-10 animate-fade-in-up">
          <span className="inline-block px-3.5 py-1 mb-3 text-xs font-extrabold uppercase tracking-widest text-[#0055FF] bg-blue-50/90 rounded-full border border-blue-100">
            BILLING & CANCELLATION
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

          {/* Refund Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-slate-200">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="w-7 h-7 rounded-full bg-[#0055FF] text-white flex items-center justify-center text-xs font-extrabold mb-2">1</span>
              <div className="text-xs font-extrabold text-slate-900 mb-1">Initiate Request</div>
              <p className="text-[11px] text-slate-600">Email billing@jcrmtechnologies.com with your student enrollment ID within 7 days.</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="w-7 h-7 rounded-full bg-[#0055FF] text-white flex items-center justify-center text-xs font-extrabold mb-2">2</span>
              <div className="text-xs font-extrabold text-slate-900 mb-1">Audit & Verification</div>
              <p className="text-[11px] text-slate-600">Our team verifies your account LMS activity and progress criteria.</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="w-7 h-7 rounded-full bg-[#0055FF] text-white flex items-center justify-center text-xs font-extrabold mb-2">3</span>
              <div className="text-xs font-extrabold text-slate-900 mb-1">Credit Processing</div>
              <p className="text-[11px] text-slate-600">Funds are returned to your source bank or card within 5 to 7 working days.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
