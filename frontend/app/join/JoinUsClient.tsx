"use client";

import Link from "next/link";
import JoinForm from "./JoinForm";

export default function JoinUsClient() {
  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-sky-50/20 to-transparent">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#0055FF]/10 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-20">
        
        {/* 1. Hero Section */}
        <div className="text-center max-w-4xl mx-auto space-y-6 animate-fade-in-up">
          <span className="inline-block px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-[#0055FF] bg-blue-50/90 rounded-full border border-blue-100/90 shadow-xs">
            ⚡ JCRM ENGINEERING CAREERS & INTERNSHIP PROGRAM
          </span>

          <h1 className="heading-font text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Build Real Enterprise Software. <br className="hidden sm:inline" />
            Launch Your Career at <span className="text-[#0055FF]">JCRM Technologies</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-3xl mx-auto">
            Join an elite engineering environment where interns and software engineers build production ERP software, train on cutting-edge AI models, receive 1-on-1 code reviews, and get recruited by top technology companies.
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
            <div className="p-5 rounded-2xl bg-white/90 border border-blue-100 shadow-xs text-center">
              <span className="heading-font text-3xl font-black text-[#0055FF] block">100%</span>
              <span className="text-xs font-bold text-slate-600">Real Production Projects</span>
            </div>
            <div className="p-5 rounded-2xl bg-white/90 border border-blue-100 shadow-xs text-center">
              <span className="heading-font text-3xl font-black text-emerald-600 block">85%+</span>
              <span className="text-xs font-bold text-slate-600">High Package Placement Rate</span>
            </div>
            <div className="p-5 rounded-2xl bg-white/90 border border-blue-100 shadow-xs text-center">
              <span className="heading-font text-3xl font-black text-[#0055FF] block">12+</span>
              <span className="text-xs font-bold text-slate-600">Live Enterprise ERP Suites</span>
            </div>
            <div className="p-5 rounded-2xl bg-white/90 border border-blue-100 shadow-xs text-center">
              <span className="heading-font text-3xl font-black text-amber-500 block">1-on-1</span>
              <span className="text-xs font-bold text-slate-600">Tech Lead Mentorship</span>
            </div>
          </div>
        </div>

        {/* 2. Why Join JCRM (4 Core Pillars) */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="heading-font text-3xl sm:text-4xl font-extrabold text-slate-900">
              Why Engineers & Interns Choose <span className="text-[#0055FF]">JCRM</span>
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-2">
              We bridge the gap between academic theory and high-paying industry software roles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-[28px] bg-white/85 backdrop-blur-xl border border-white/90 shadow-md space-y-3 hover:-translate-y-1.5 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0055FF] flex items-center justify-center text-xl font-bold border border-blue-100">
                💻
              </div>
              <h3 className="heading-font text-lg font-extrabold text-slate-900">
                Production Codebases
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                No dummy sample code. You work directly on real-world Next.js 15, Python AI microservices, and PostgreSQL ERP systems.
              </p>
            </div>

            <div className="p-6 rounded-[28px] bg-white/85 backdrop-blur-xl border border-white/90 shadow-md space-y-3 hover:-translate-y-1.5 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0055FF] flex items-center justify-center text-xl font-bold border border-blue-100">
                👨‍💻
              </div>
              <h3 className="heading-font text-lg font-extrabold text-slate-900">
                Senior Code Reviews
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Receive daily Pull Request (PR) code reviews, architecture guidance, and performance optimization feedback from experienced tech leads.
              </p>
            </div>

            <div className="p-6 rounded-[28px] bg-white/85 backdrop-blur-xl border border-white/90 shadow-md space-y-3 hover:-translate-y-1.5 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0055FF] flex items-center justify-center text-xl font-bold border border-blue-100">
                📜
              </div>
              <h3 className="heading-font text-lg font-extrabold text-slate-900">
                Verified Credentials
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Earn 100% verified JCRM internship completion certificates, formal HR recommendations, and verifiable project credentials.
              </p>
            </div>

            <div className="p-6 rounded-[28px] bg-white/85 backdrop-blur-xl border border-white/90 shadow-md space-y-3 hover:-translate-y-1.5 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0055FF] flex items-center justify-center text-xl font-bold border border-blue-100">
                🎯
              </div>
              <h3 className="heading-font text-lg font-extrabold text-slate-900">
                Recruiter Direct Access
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Top performing candidates get indexed on our Our Team Talent Directory (<Link href="/im" className="text-[#0055FF] underline font-bold">/im</Link>) where hiring managers schedule interviews directly!
              </p>
            </div>
          </div>
        </div>

        {/* 3. Open Internship & Job Tracks */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#0055FF]">
              ACTIVE HIRING TRACKS
            </span>
            <h2 className="heading-font text-3xl font-extrabold text-slate-900 mt-1">
              Select Your Engineering Track
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-[28px] bg-white border border-blue-100 shadow-sm space-y-3">
              <span className="px-3 py-1 text-[11px] font-extrabold rounded-full bg-blue-50 text-[#0055FF] border border-blue-100">
                Engineering Track 01
              </span>
              <h3 className="heading-font text-xl font-extrabold text-slate-900">
                AI / ML Engineering Intern
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Train open-source LLMs, build RAG pipelines with Vector DBs, PyTorch, OpenCV, and deploy FastAPI microservices.
              </p>
            </div>

            <div className="p-6 rounded-[28px] bg-white border border-blue-100 shadow-sm space-y-3">
              <span className="px-3 py-1 text-[11px] font-extrabold rounded-full bg-blue-50 text-[#0055FF] border border-blue-100">
                Engineering Track 02
              </span>
              <h3 className="heading-font text-xl font-extrabold text-slate-900">
                Full-Stack Next.js Developer
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Build enterprise web portals using React 19, Next.js 15 App Router, TypeScript, Tailwind CSS, and PostgreSQL ORM.
              </p>
            </div>

            <div className="p-6 rounded-[28px] bg-white border border-blue-100 shadow-sm space-y-3">
              <span className="px-3 py-1 text-[11px] font-extrabold rounded-full bg-blue-50 text-[#0055FF] border border-blue-100">
                Engineering Track 03
              </span>
              <h3 className="heading-font text-xl font-extrabold text-slate-900">
                Cyber Security & VAPT Analyst
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Perform web application penetration testing, OWASP vulnerability triage, Burp Suite API hacking, and SOC monitoring.
              </p>
            </div>
          </div>
        </div>

        {/* 4. THE SMART APPLICATION FORM (AT LAST OF THE JOIN US PAGE) */}
        <div id="apply-form" className="pt-8">
          <JoinForm />
        </div>

      </div>
    </div>
  );
}
