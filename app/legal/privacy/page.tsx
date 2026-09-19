import { getSiteContent } from "@/lib/cms";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | JCRM Technologies",
  description: "Learn how JCRM Technologies collects, processes, and safeguards user data and personal information.",
};

export const dynamic = "force-dynamic";

export default async function PrivacyPolicyPage() {
  const cmsData = await getSiteContent("public-privacy");

  const heading = cmsData?.heading || "Privacy Policy";
  const lastUpdated = cmsData?.lastUpdated || "September 2026";
  const summary = cmsData?.summary || "JCRM Technologies is committed to safeguarding your personal data and privacy. This policy details how we collect, process, and secure user information across our platform and ERP solutions.";
  const intro = cmsData?.content || "We value the trust you place in JCRM Technologies Private Limited. Please review this Privacy Policy to understand how your information is handled when you access our courses, software, and services.";
  
  const defaultSections = [
    {
      title: "1. Information We Collect",
      content: "We collect information provided directly by you during account registration, including your full name, email address, contact phone number, and academic background. Technical metrics like IP address and session cookies may be logged for security."
    },
    {
      title: "2. How We Use Your Data",
      content: "Your data is used to provide LMS course access, deliver learning certificates, process payment invoices, communicate platform notices, and coordinate placement interview scheduling."
    },
    {
      title: "3. Data Security & Retention",
      content: "We implement industry-standard 256-bit TLS encryption, role-based access restrictions, and secure database hosting to prevent unauthorized access or accidental disclosure of user data."
    },
    {
      title: "4. Third-Party Service Providers",
      content: "We do not sell or rent personal information to advertisers. We share minimal data with trusted infrastructure providers (cloud hosting, transactional email, payment gateways) strictly to provide our services."
    },
    {
      title: "5. User Rights & Data Deletion",
      content: "You retain the right to access, rectify, or request permanent deletion of your personal account data at any time by contacting our grievance team."
    }
  ];

  const sections = Array.isArray(cmsData?.sections) && cmsData.sections.length > 0 ? cmsData.sections : defaultSections;
  const contactEmail = cmsData?.contactEmail || "privacy@jcrmtechnologies.com";
  const officeAddress = cmsData?.officeAddress || "JCRM Technologies, Cyber City, Bangalore, Karnataka 560100";

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
            <span className="text-[#0055FF]">Privacy Policy</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link href="/legal/privacy" className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-[#0055FF] text-white shadow-sm">
              Privacy Policy
            </Link>
            <Link href="/legal/terms" className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white text-slate-700 hover:bg-slate-100 border border-slate-200">
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
            LEGAL & COMPLIANCE
          </span>
          <h1 className="heading-font text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
            {heading}
          </h1>
          <p className="text-xs font-bold text-slate-500">
            Last Updated: {lastUpdated} • JCRM Technologies Private Limited
          </p>
        </div>

        {/* Summary Card */}
        <div className="p-6 sm:p-8 rounded-[28px] bg-white/90 backdrop-blur-xl border border-white/90 shadow-[0_10px_35px_rgba(0,85,255,0.07)] mb-10 space-y-3">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#0055FF]">
            <span className="w-2 h-2 rounded-full bg-[#0055FF]" />
            Summary of Key Practices
          </div>
          <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
            {summary}
          </p>
          <p className="text-xs text-slate-500 font-medium leading-relaxed pt-2 border-t border-slate-100">
            {intro}
          </p>
        </div>

        {/* Policy Sections */}
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

        {/* Grievance & Contact Box */}
        <div className="mt-12 p-8 rounded-[28px] bg-gradient-to-tr from-slate-900 to-slate-950 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-[#0055FF] text-white shadow-xs">
              GRIEVANCE REDRESSAL
            </span>
            <h3 className="heading-font text-2xl font-extrabold tracking-tight">
              Have questions about your personal data?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Our designated Data Protection and Grievance Officer is available to assist with data requests, rectification, or privacy concerns.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
              <div>
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Email Address</div>
                <a href={`mailto:${contactEmail}`} className="text-sm font-bold text-[#38bdf8] hover:underline">
                  {contactEmail}
                </a>
              </div>
              <div>
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Corporate Address</div>
                <div className="text-xs text-slate-300 font-medium">{officeAddress}</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
