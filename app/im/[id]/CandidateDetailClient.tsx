"use client";

import { useState } from "react";
import Link from "next/link";
import { TeamMember } from "@/lib/teamData";
import HireModal from "../HireModal";

export default function CandidateDetailClient({ member }: { member: TeamMember }) {
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);

  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-sky-50/20 to-transparent">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#0055FF]/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Breadcrumb Navigation with Back Action */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-500">
            <Link href="/" className="hover:text-[#0055FF] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/ourteam" className="hover:text-[#0055FF] transition-colors">Our Team</Link>
            <span>/</span>
            <span className="text-[#0055FF] font-extrabold">{member.name}</span>
          </div>

          <Link
            href="/ourteam"
            className="text-xs sm:text-sm font-extrabold text-[#0055FF] hover:underline flex items-center gap-1.5"
          >
            ← Back to Team Directory
          </Link>
        </div>

        {/* Main Profile Layout Card */}
        <div className="p-8 sm:p-12 rounded-[36px] bg-white/85 backdrop-blur-2xl border border-white/90 shadow-[0_12px_45px_rgba(0,85,255,0.12),0_0_35px_rgba(255,255,255,0.9)] mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left 4 Cols - Candidate Photo, Encrypted Contacts & Hire Action */}
            <div className="lg:col-span-4 space-y-6 text-center">
              
              {/* Photo Box */}
              <div className="w-full max-w-sm mx-auto h-80 sm:h-96 rounded-[32px] overflow-hidden bg-slate-900 relative shadow-xl border border-blue-100 group">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white select-none">
                    <div className="w-24 h-24 rounded-full bg-blue-600/30 border-2 border-blue-400/40 flex items-center justify-center text-3xl font-black tracking-wider text-blue-200 shadow-inner">
                      {member.name ? member.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "TM"}
                    </div>
                    <span className="text-sm font-bold text-blue-200/90 mt-3 tracking-wide">
                      JCRM Member
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none"></div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
                  <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-[#0055FF] text-white shadow-md">
                    • {member.role}
                  </span>
                  {member.isVerified && (
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500 text-white shadow-md flex items-center gap-1">
                      <span>✓ Verified</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Name & Title */}
              <div>
                <h1 className="heading-font text-3xl font-extrabold text-slate-900 flex items-center justify-center gap-2">
                  <span>{member.name}</span>
                  {member.isVerified && (
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-white inline-flex items-center justify-center text-xs font-black shadow-xs">
                      ✓
                    </span>
                  )}
                </h1>
                <p className="text-sm font-bold text-[#0055FF] mt-1">{member.role}</p>
              </div>

              {/* HIRE NOW BUTTON */}
              <button
                onClick={() => setIsHireModalOpen(true)}
                className="w-full py-4 rounded-2xl text-base font-extrabold text-white bg-red-500 hover:bg-red-600 transition-all shadow-xl hover:shadow-red-500/30 hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
              >
                Hire Now 🚀
              </button>

              {/* ENCRYPTED / MASKED CONTACT DETAILS GRID */}
              <div className="space-y-3 pt-4 border-t border-blue-100 text-left">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block text-center">
                  ENCRYPTED CONTACT DETAILS
                </span>

                <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-500">Phone:</span>
                  <span className="text-xs font-mono font-bold text-slate-900 tracking-wider bg-white px-2.5 py-1 rounded-lg border border-blue-200">
                    {member.maskedPhone}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-500">Email:</span>
                  <span className="text-xs font-mono font-bold text-slate-900 tracking-wider bg-white px-2.5 py-1 rounded-lg border border-blue-200 truncate max-w-[200px]">
                    {member.maskedEmail}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-500">City:</span>
                  <span className="text-xs font-bold text-slate-900">{member.city}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-500">State:</span>
                  <span className="text-xs font-bold text-slate-900">{member.state}</span>
                </div>
              </div>

            </div>

            {/* Right 8 Cols - Personal Info, Academic Background & Skills */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Personal Info Bio Card */}
              <div>
                <span className="inline-block px-3.5 py-1 mb-3 text-xs font-extrabold uppercase tracking-widest text-[#0055FF] bg-blue-50 rounded-full border border-blue-100">
                  CANDIDATE BIOGRAPHY
                </span>
                <h2 className="heading-font text-3xl font-extrabold text-slate-900 mb-4">
                  Personal Info
                </h2>

                <p className="text-base text-slate-700 font-medium leading-relaxed bg-blue-50/30 p-6 rounded-2xl border border-blue-100/70">
                  {member.bio}
                </p>
              </div>

              {/* Education & Academic Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-blue-100">
                <div className="p-5 rounded-2xl bg-white border border-blue-100/90 shadow-xs space-y-1">
                  <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
                    Education
                  </span>
                  <h3 className="heading-font text-base font-extrabold text-slate-900">
                    {member.education}
                  </h3>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-blue-100/90 shadow-xs space-y-1">
                  <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
                    College / Institution
                  </span>
                  <h3 className="heading-font text-base font-extrabold text-slate-900">
                    {member.college}
                  </h3>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-blue-100/90 shadow-xs space-y-1">
                  <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
                    Experience Level
                  </span>
                  <h3 className="heading-font text-base font-extrabold text-slate-900">
                    {member.experience}
                  </h3>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-blue-100/90 shadow-xs space-y-1">
                  <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
                    Verification Status
                  </span>
                  <h3 className="heading-font text-base font-extrabold text-emerald-600 flex items-center gap-1">
                    <span>✓ Verified JCRM Intern / Alumni</span>
                  </h3>
                </div>
              </div>

              {/* Technical Skills */}
              <div className="pt-4 border-t border-blue-100">
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block mb-3">
                  TECHNICAL SKILLS & DOMAIN EXPERTISE
                </span>

                <div className="flex flex-wrap gap-2.5">
                  {member.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 rounded-xl bg-blue-50 text-slate-900 border border-blue-200 text-xs sm:text-sm font-extrabold shadow-xs"
                    >
                      ⚡ {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Call to Action Card */}
              <div className="p-6 sm:p-8 rounded-[28px] bg-slate-900 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="heading-font text-xl font-extrabold">
                    Schedule an Interview with {member.name}?
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-1">
                    Direct 1-click scheduling sent to JCRM Founder via WhatsApp.
                  </p>
                </div>

                <button
                  onClick={() => setIsHireModalOpen(true)}
                  className="px-8 py-3.5 rounded-2xl text-sm font-extrabold text-white bg-red-500 hover:bg-red-600 transition-all shadow-lg hover:shadow-red-500/30 cursor-pointer shrink-0"
                >
                  Hire Now 🚀
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* Hire Modal */}
      <HireModal
        isOpen={isHireModalOpen}
        onClose={() => setIsHireModalOpen(false)}
        candidateName={member.name}
        candidateRole={member.role}
      />
    </div>
  );
}
