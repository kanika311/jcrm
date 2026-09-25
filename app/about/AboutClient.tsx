"use client";

import { useState } from "react";
import Link from "next/link";
import { FiBriefcase, FiAward, FiLock, FiSmartphone, FiZap, FiCode, FiUsers, FiTarget, FiArrowRight } from "react-icons/fi";

export default function AboutClient({ cmsData }: { cmsData?: any }) {
  const [activeTab, setActiveTab] = useState<"business" | "students">("business");

  // Fallbacks if CMS content is not yet populated
  const heroTitle = cmsData?.heroTitle || cmsData?.heading || "Bridging Enterprise Technology with Next-Gen Engineering Talent";
  const heroSubtitle = cmsData?.heroSubtitle || cmsData?.story || "";

  const milestones = [
    {
      year: "2022",
      title: "Founding JCRM Technologies",
      desc: "Launched with a mission to eradicate bloated legacy software and provide self-hostable, customizable ERP solutions for academies & healthcare."
    },
    {
      year: "2023",
      title: "Enterprise ERP Expansion",
      desc: "Deployed flagship Institute LMS & Hospital ERP systems across 20+ organisations, saving clients over ₹1.5 Crore in recurring license fees."
    },
    {
      year: "2024",
      title: "Tech Incubator & Internship Launch",
      desc: "Established our engineering bootcamp track, training 500+ students on production Next.js, AI LLMs, and cloud microservices."
    },
    {
      year: "2025-2026",
      title: "AI Agentic & 12+ ERP Suite Ecosystem",
      desc: "Expanded to 12 specialized industry ERP variants with WhatsApp gateways, VAPT cybersecurity bootcamps, and direct recruiter placement listing."
    }
  ];

  const leadership = [
    {
      name: "Founder & Chief Architect",
      role: "Lead Systems Architect & Founder",
      phone: "+91 831 053 1309",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      quote: "Our mission is simple: empower enterprises with software they truly own, while giving engineering students real production codebases to launch stellar careers."
    },
    {
      name: "Senior Tech Director",
      role: "VP of Engineering & ERP Solutions",
      phone: "+91 831 053 1309",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
      quote: "We don't build minimum viable prototypes. We build enterprise-grade, sub-second query ERP engines designed for 99.99% reliability."
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-sky-50/20 to-transparent">
      
      {/* Ambient Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#0055FF]/10 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-20">
        
        {/* 1. Hero Section */}
        <div className="text-center max-w-4xl mx-auto space-y-6 animate-fade-in-up">
          <span className="inline-block px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-[#0055FF] bg-blue-50/90 rounded-full border border-blue-100/90 shadow-xs">
            ✨ EXCELLENCE IN ENTERPRISE SOFTWARE & TALENT INCUBATION
          </span>

          <h1 className="heading-font text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {heroTitle}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-3xl mx-auto">
            {heroSubtitle}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/erp-solutions"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-extrabold text-white bg-[#0055FF] hover:bg-blue-600 transition-all shadow-xl hover:shadow-blue-500/30 hover:scale-105"
            >
              <span>Explore Enterprise ERP Solutions</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/joinus"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-extrabold text-[#0055FF] bg-white border border-blue-200 hover:bg-blue-50 transition-all shadow-md hover:scale-105"
            >
              <span>Join Engineering Program</span>
              <FiAward className="w-4 h-4" />
            </Link>
          </div>

          {/* Impact Stats Counter Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
            <div className="p-6 rounded-[24px] bg-white/90 border border-blue-100 shadow-xs text-center space-y-1">
              <span className="heading-font text-3xl font-black text-[#0055FF] block">50+</span>
              <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">Enterprise Clients</span>
            </div>
            <div className="p-6 rounded-[24px] bg-white/90 border border-blue-100 shadow-xs text-center space-y-1">
              <span className="heading-font text-3xl font-black text-emerald-600 block">1,200+</span>
              <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">Engineers Trained</span>
            </div>
            <div className="p-6 rounded-[24px] bg-white/90 border border-blue-100 shadow-xs text-center space-y-1">
              <span className="heading-font text-3xl font-black text-[#0055FF] block">99.99%</span>
              <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">Cloud SLA Uptime</span>
            </div>
            <div className="p-6 rounded-[24px] bg-white/90 border border-blue-100 shadow-xs text-center space-y-1">
              <span className="heading-font text-3xl font-black text-amber-500 block">₹4.5Cr+</span>
              <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">Client ROI Saved</span>
            </div>
          </div>
        </div>

        {/* 2. Dual Target Value Switcher (Business Clients vs Students) */}
        <div className="p-8 sm:p-12 rounded-[36px] bg-white/85 backdrop-blur-2xl border border-white/90 shadow-[0_12px_45px_rgba(0,85,255,0.12)] space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#0055FF]">
              OUR DUAL CORE PURPOSE
            </span>
            <h2 className="heading-font text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">
              Engineered for Businesses & Talent
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-2">
              Toggle between our business solution offerings and career incubator benefits.
            </p>

            {/* Toggle Switch Tabs */}
            <div className="inline-flex p-1.5 rounded-2xl bg-blue-50 border border-blue-100 mt-6 gap-2">
              <button
                onClick={() => setActiveTab("business")}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                  activeTab === "business"
                    ? "bg-[#0055FF] text-white shadow-md"
                    : "text-slate-700 hover:text-[#0055FF]"
                }`}
              >
                <FiBriefcase className="w-4 h-4" />
                <span>For Business & ERP Clients</span>
              </button>
              <button
                onClick={() => setActiveTab("students")}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                  activeTab === "students"
                    ? "bg-[#0055FF] text-white shadow-md"
                    : "text-slate-700 hover:text-[#0055FF]"
                }`}
              >
                <FiAward className="w-4 h-4" />
                <span>For Students & Interns</span>
              </button>
            </div>
          </div>

          {/* Active Tab Content */}
          {activeTab === "business" ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
              <div className="p-6 rounded-[28px] bg-blue-50/50 border border-blue-100 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0055FF] flex items-center justify-center">
                  <FiLock className="w-5 h-5" />
                </div>
                <h3 className="heading-font text-xl font-extrabold text-slate-900">
                  Zero Vendor Lock-In & Self-Hosting
                </h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Unlike traditional subscription ERPs that trap your data, JCRM ERP suites are 100% self-customizable and deployable on your own private cloud or on-premise servers.
                </p>
              </div>

              <div className="p-6 rounded-[28px] bg-blue-50/50 border border-blue-100 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <FiSmartphone className="w-5 h-5" />
                </div>
                <h3 className="heading-font text-xl font-extrabold text-slate-900">
                  WhatsApp & Automated GST Gateways
                </h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Seamlessly send fee receipts, patient appointment updates, invoice PDFs, and SLA alerts straight to customers and staff via official WhatsApp API integrations.
                </p>
              </div>

              <div className="p-6 rounded-[28px] bg-blue-50/50 border border-blue-100 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                  <FiZap className="w-5 h-5" />
                </div>
                <h3 className="heading-font text-xl font-extrabold text-slate-900">
                  Sub-Second Database Speed
                </h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Architected with high-throughput indexing, PostgreSQL query optimization, and fast React 19 interfaces that speed up operational billing 4x.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
              <div className="p-6 rounded-[28px] bg-blue-50/50 border border-blue-100 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                  <FiCode className="w-5 h-5" />
                </div>
                <h3 className="heading-font text-xl font-extrabold text-slate-900">
                  Real Production Codebase Access
                </h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  No artificial classroom exercises. Interns write production code for Next.js 15 App Router, Python AI models, Docker containers, and live microservices.
                </p>
              </div>

              <div className="p-6 rounded-[28px] bg-blue-50/50 border border-blue-100 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
                  <FiUsers className="w-5 h-5" />
                </div>
                <h3 className="heading-font text-xl font-extrabold text-slate-900">
                  1-on-1 Senior Tech Lead Mentorship
                </h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Receive daily Pull Request (PR) reviews, systems design guidance, and direct mentorship from experienced lead software architects.
                </p>
              </div>

              <div className="p-6 rounded-[28px] bg-blue-50/50 border border-blue-100 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <FiTarget className="w-5 h-5" />
                </div>
                <h3 className="heading-font text-xl font-extrabold text-slate-900">
                  Direct Placement Talent Directory
                </h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Verified alumni are showcased in our Hiring Talent Directory (<Link href="/ourteam" className="text-[#0055FF] underline font-bold">/ourteam</Link>) where partner recruiters schedule interviews directly via WhatsApp.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 3. Company Journey & Growth Milestones Timeline */}
        <div className="space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#0055FF]">
              OUR EVOLUTION
            </span>
            <h2 className="heading-font text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">
              Company Growth & Milestones
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {milestones.map((ms, idx) => (
              <div key={idx} className="p-6 rounded-[28px] bg-white border border-blue-100 shadow-sm relative space-y-3">
                <span className="px-3 py-1 text-xs font-mono font-black rounded-full bg-[#0055FF] text-white shadow-xs inline-block">
                  {ms.year}
                </span>
                <h3 className="heading-font text-lg font-extrabold text-slate-900">
                  {ms.title}
                </h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {ms.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Leadership & Mentorship Spotlight */}
        <div className="space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#0055FF]">
              LEADERSHIP & ENGINEERING DIRECTION
            </span>
            <h2 className="heading-font text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">
              Guided by Experienced Tech Leaders
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {leadership.map((leader, i) => (
              <div key={i} className="p-8 rounded-[32px] bg-white/90 border border-blue-100 shadow-md flex flex-col justify-between space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-900 border border-blue-100 shrink-0">
                    <img src={leader.image} alt={leader.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="heading-font text-xl font-extrabold text-slate-900">{leader.name}</h3>
                    <span className="text-xs font-bold text-[#0055FF] block">{leader.role}</span>
                    <span className="text-[11px] font-semibold text-slate-500">Contact: {leader.phone}</span>
                  </div>
                </div>

                <blockquote className="text-xs sm:text-sm font-medium text-slate-700 italic bg-blue-50/50 p-4 rounded-2xl border border-blue-100/70">
                  "{leader.quote}"
                </blockquote>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Dual Conversion CTA Banner */}
        <div className="p-8 sm:p-12 rounded-[36px] bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
            <div className="space-y-3">
              <span className="text-xs font-extrabold text-blue-400 uppercase tracking-widest block">FOR ENTERPRISE CLIENTS</span>
              <h3 className="heading-font text-2xl sm:text-3xl font-extrabold text-white">Ready to Automate Your Enterprise Operations?</h3>
              <p className="text-xs text-slate-300 font-medium">Schedule a live demo of our 12+ self-customizable ERP suites.</p>
              <Link href="/erp-solutions" className="inline-block px-6 py-3 rounded-xl bg-[#0055FF] hover:bg-blue-600 text-white font-extrabold text-xs shadow-md transition-all">
                View ERP Product Catalog ➔
              </Link>
            </div>

            <div className="space-y-3 border-t md:border-t-0 md:border-l border-slate-700 pt-6 md:pt-0 md:pl-8">
              <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest block">FOR STUDENTS & ENGINEERS</span>
              <h3 className="heading-font text-2xl sm:text-3xl font-extrabold text-white">Ready to Build Real Software & Get Placed?</h3>
              <p className="text-xs text-slate-300 font-medium">Apply for our hands-on engineering incubator & talent directory.</p>
              <Link href="/joinus" className="inline-block px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all">
                Apply for Engineering Program ➔
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
