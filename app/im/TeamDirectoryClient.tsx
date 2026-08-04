"use client";

import { useState } from "react";
import Link from "next/link";
import { TeamMember } from "@/lib/teamData";

export default function TeamDirectoryClient({ members }: { members: TeamMember[] }) {
  const [searchName, setSearchName] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [searchSkill, setSearchSkill] = useState("");
  const [searchExperience, setSearchExperience] = useState("All");
  const [searchRole, setSearchRole] = useState("All");

  // Extract unique roles and cities
  const uniqueRoles = Array.from(new Set(members.map((m) => m.role)));
  const uniqueCities = Array.from(new Set(members.map((m) => m.city)));
  const uniqueExperiences = ["All", "Fresher", "6 Months Internship", "1 Year Experience"];

  const filteredMembers = members.filter((member) => {
    const matchesName = member.name.toLowerCase().includes(searchName.toLowerCase());
    const matchesCity = !searchCity || member.city.toLowerCase().includes(searchCity.toLowerCase());
    const matchesSkill = !searchSkill || member.skills.some((s) => s.toLowerCase().includes(searchSkill.toLowerCase()));
    const matchesExperience = searchExperience === "All" || member.experience.toLowerCase().includes(searchExperience.toLowerCase());
    const matchesRole = searchRole === "All" || member.role.toLowerCase() === searchRole.toLowerCase();

    return matchesName && matchesCity && matchesSkill && matchesExperience && matchesRole;
  });

  const clearFilters = () => {
    setSearchName("");
    setSearchCity("");
    setSearchSkill("");
    setSearchExperience("All");
    setSearchRole("All");
  };

  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-sky-50/20 to-transparent">
      
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#0055FF]/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header & Tagline */}
        <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in-up">
          <span className="inline-block px-4 py-1.5 mb-3 text-xs font-extrabold uppercase tracking-widest text-[#0055FF] bg-blue-50/90 rounded-full border border-blue-100/90 shadow-xs">
            JCRM TALENT & INTERN DIRECTORY
          </span>
          <h1 className="heading-font text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 mb-3 tracking-tight leading-tight">
            Meet Our <span className="text-[#0055FF]">Engineering Team & Interns</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
            Discover industry-ready developers, AI engineers, data analysts, and digital strategists trained on live enterprise ERP projects at JCRM Technologies.
          </p>
        </div>

        {/* Multi-Parameter Search & Filter Bar (Name, City, Skills, Experience, Role) */}
        <div className="p-6 sm:p-8 rounded-[32px] bg-white/85 backdrop-blur-2xl border border-white/90 shadow-[0_12px_45px_rgba(0,85,255,0.1)] mb-12 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
              FILTER & SEARCH CANDIDATES
            </span>

            {(searchName || searchCity || searchSkill || searchExperience !== "All" || searchRole !== "All") && (
              <button
                onClick={clearFilters}
                className="text-xs font-extrabold text-[#0055FF] hover:underline cursor-pointer"
              >
                Reset All Filters ✕
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            
            {/* 1. Search by Name */}
            <div>
              <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                Search By Name
              </label>
              <input
                type="text"
                placeholder="e.g. Akasha, Nitya..."
                className="w-full px-3.5 py-3 rounded-2xl bg-blue-50/40 border border-blue-100 text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0055FF]"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </div>

            {/* 2. Search by City */}
            <div>
              <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                Search By City
              </label>
              <input
                type="text"
                placeholder="e.g. Udupi, Bangalore..."
                className="w-full px-3.5 py-3 rounded-2xl bg-blue-50/40 border border-blue-100 text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0055FF]"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
              />
            </div>

            {/* 3. Search by Skills */}
            <div>
              <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                Search By Skills
              </label>
              <input
                type="text"
                placeholder="e.g. Python, React..."
                className="w-full px-3.5 py-3 rounded-2xl bg-blue-50/40 border border-blue-100 text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0055FF]"
                value={searchSkill}
                onChange={(e) => setSearchSkill(e.target.value)}
              />
            </div>

            {/* 4. Search by Experience */}
            <div>
              <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                Search By Experience
              </label>
              <select
                className="w-full px-3.5 py-3 rounded-2xl bg-blue-50/40 border border-blue-100 text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0055FF]"
                value={searchExperience}
                onChange={(e) => setSearchExperience(e.target.value)}
              >
                {uniqueExperiences.map((exp) => (
                  <option key={exp} value={exp}>{exp}</option>
                ))}
              </select>
            </div>

            {/* 5. Search by Department (Role) */}
            <div>
              <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                Search By Role
              </label>
              <select
                className="w-full px-3.5 py-3 rounded-2xl bg-blue-50/40 border border-blue-100 text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0055FF]"
                value={searchRole}
                onChange={(e) => setSearchRole(e.target.value)}
              >
                <option value="All">All Departments</option>
                {uniqueRoles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* Counter Badge */}
        <div className="flex items-center justify-between mb-8">
          <span className="text-xs font-extrabold uppercase tracking-widest text-slate-600">
            Showing {filteredMembers.length} Candidates
          </span>
          <span className="text-xs font-semibold text-slate-500">
            Click on any candidate card to view profile details & schedule interviews.
          </span>
        </div>

        {/* Candidate Cards Grid */}
        {filteredMembers.length === 0 ? (
          <div className="text-center py-20 bg-white/80 backdrop-blur-xl rounded-[32px] border border-blue-100 p-8 shadow-sm">
            <p className="text-lg font-extrabold text-slate-800 mb-2">No candidates found matching your filter criteria</p>
            <p className="text-sm font-semibold text-slate-500 mb-4">Try clearing one or more search filters.</p>
            <button
              onClick={clearFilters}
              className="px-6 py-2.5 rounded-full text-xs font-extrabold text-white bg-[#0055FF] hover:bg-blue-600 transition-all shadow-md cursor-pointer"
            >
              Reset All Search Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredMembers.map((member) => (
              <Link
                href={`/im/${member.id}`}
                key={member.id}
                className="group block"
              >
                <div className="h-full rounded-[32px] bg-white/85 backdrop-blur-2xl border border-white/90 shadow-[0_12px_45px_rgba(0,85,255,0.1),0_0_35px_rgba(255,255,255,0.9)] hover:-translate-y-2 hover:shadow-[0_20px_55px_rgba(0,85,255,0.18)] transition-all duration-300 flex flex-col justify-between overflow-hidden p-5">
                  
                  {/* Candidate Portrait Image */}
                  <div className="w-full h-64 sm:h-72 rounded-[24px] overflow-hidden bg-slate-900 relative mb-4 border border-blue-100">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

                    {/* Role Pill */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10">
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#0055FF] text-white shadow-md">
                        • {member.role}
                      </span>
                      {member.isVerified && (
                        <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-black shadow-md">
                          ✓
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="text-center space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="heading-font text-xl font-extrabold text-slate-900 group-hover:text-[#0055FF] transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-xs font-bold text-slate-500 mt-1">
                        📍 {member.city}, {member.state}
                      </p>

                      {/* Top 3 Skills */}
                      <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                        {member.skills.slice(0, 3).map((skill, i) => (
                          <span key={i} className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-blue-50/80 border border-blue-100 text-slate-700">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Profile Button */}
                    <div className="pt-3 border-t border-blue-100/80">
                      <span className="w-full py-2.5 rounded-xl text-xs font-extrabold text-white bg-[#0055FF] group-hover:bg-blue-600 transition-all shadow-md flex items-center justify-center gap-1.5 group-hover:scale-[1.02]">
                        View Candidate Profile
                        <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    </div>
                  </div>

                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
