import { getSiteContent } from "@/lib/cms";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | JCRM Technologies",
  description: "Terms and Conditions governing the use of JCRM Technologies courses, software, and services.",
};

export const dynamic = "force-dynamic";

export default async function TermsPage() {
  const cmsData = await getSiteContent("public-terms");

  const heading = cmsData?.heading || "Terms and Conditions";
  const lastUpdated = cmsData?.lastUpdated || "September 2026";
  const summary = cmsData?.summary || "These Terms govern your use of JCRM Technologies' website, LMS student portals, learning content, and enterprise ERP automation software.";
  const intro = cmsData?.content || "By accessing or utilizing any part of JCRM Technologies, you agree to comply with and be legally bound by these Terms of Service. If you do not agree, you must discontinue using our services.";

  const defaultSections = [
    {
      title: "1. Account Registration & Conduct",
      content: "Users must provide accurate, current, and complete registration details and safeguard their credentials against unauthorized third-party access. Account sharing or selling access is strictly prohibited."
    },
    {
      title: "2. Intellectual Property Rights",
      content: "All video lectures, course curriculum, code samples, documentation, and proprietary ERP modules are the exclusive property of JCRM Technologies and protected by intellectual property laws."
    },
    {
      title: "3. Payments & Billing",
      content: "Course enrollments and software licenses are subject to fees listed during checkout. All payments are processed securely through authorized payment gateway partners."
    },
    {
      title: "4. Code of Conduct & Honor Code",
      content: "Students agree to respect mentors, peers, and forum members. Harassment, plagiarism, or malicious activity will result in immediate termination without refund."
    },
    {
      title: "5. Limitation of Liability & Disclaimers",
      content: "JCRM Technologies provides high-quality industry training and placement assistance, but does not guarantee employment offers if academic requirements or interview rounds are unfulfilled."
    },
    {
      title: "6. Governing Law & Dispute Resolution",
      content: "These Terms shall be construed in accordance with the laws of India. Any legal dispute shall be subject to the exclusive jurisdiction of the competent courts in Bangalore, Karnataka."
    }
  ];

  const sections = Array.isArray(cmsData?.sections) && cmsData.sections.length > 0 ? cmsData.sections : defaultSections;
  const contactEmail = cmsData?.contactEmail || "legal@jcrmtechnologies.com";

  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-sky-50/20 to-transparent">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#0055FF]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Breadcrumb & Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <Link href="/" className="hover:text-[#0055FF]">Home</Link>
            <span>/</span>
            <span className="text-[#0055FF]">Terms & Conditions</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link href="/legal/privacy" className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white text-slate-700 hover:bg-slate-100 border border-slate-200">
              Privacy Policy
            </Link>
            <Link href="/legal/terms" className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-[#0055FF] text-white shadow-sm">
              Terms & Conditions
            </Link>
            <Link href="/legal/cookies" className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white text-slate-700 hover:bg-slate-100 border border-slate-200">
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
            LEGAL AGREEMENT
          </span>
          <h1 className="heading-font text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
            {heading}
          </h1>
          <p className="text-xs font-bold text-slate-500">
            Effective Date: {lastUpdated} • Binding User Agreement
          </p>
        </div>

        {/* Summary Card */}
        <div className="p-6 sm:p-8 rounded-[28px] bg-white/90 backdrop-blur-xl border border-white/90 shadow-[0_10px_35px_rgba(0,85,255,0.07)] mb-10 space-y-3">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#0055FF]">
            <span className="w-2 h-2 rounded-full bg-[#0055FF]" />
            Summary of Terms
          </div>
          <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
            {summary}
          </p>
          <p className="text-xs text-slate-500 font-medium leading-relaxed pt-2 border-t border-slate-100">
            {intro}
          </p>
        </div>

        {/* Terms Articles */}
        <div className="space-y-6">
          {sections.map((section: any, idx: number) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-[24px] bg-white/85 backdrop-blur-xl border border-slate-200/80 shadow-xs hover:border-blue-200 transition-colors"
            >
              <h2 className="heading-font text-lg sm:text-xl font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                <span className="text-[#0055FF] font-black">{idx + 1}.</span>
                {section.title.replace(/^\d+\.\s*/, '')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed whitespace-pre-line">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        {/* Contact Legal Department Card */}
        <div className="mt-12 p-8 rounded-[28px] bg-gradient-to-tr from-slate-900 to-slate-950 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-[#0055FF] text-white shadow-xs">
              LEGAL INQUIRIES
            </span>
            <h3 className="heading-font text-2xl font-extrabold tracking-tight">
              Questions regarding these Terms?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              If you have any questions or require enterprise licensing terms, please reach out directly to our corporate legal team.
            </p>
            <div className="pt-4 border-t border-slate-800">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Legal Department</div>
              <a href={`mailto:${contactEmail}`} className="text-sm font-bold text-[#38bdf8] hover:underline">
                {contactEmail}
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
