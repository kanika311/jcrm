"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { TeamMember } from "@/lib/teamData";

export default function TeamDirectoryClient({ members }: { members: TeamMember[] }) {
  // Search & Filter State
  const [masterSearch, setMasterSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedState, setSelectedState] = useState("All");
  const [selectedExperience, setSelectedExperience] = useState("All");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Dynamic Options & Counts
  const uniqueRoles = useMemo(() => Array.from(new Set(members.map((m) => m.role))).sort(), [members]);
  const uniqueCities = useMemo(() => Array.from(new Set(members.map((m) => m.city))).sort(), [members]);
  const uniqueStates = useMemo(() => Array.from(new Set(members.map((m) => m.state).filter(Boolean))).sort(), [members]);
  const allSkills = useMemo(() => {
    const counts: Record<string, number> = {};
    members.forEach((m) => {
      m.skills?.forEach((s) => {
        counts[s] = (counts[s] || 0) + 1;
      });
    });
    return Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
  }, [members]);

  const roleCounts = useMemo(() => {
    const map: Record<string, number> = {};
    members.forEach((m) => {
      map[m.role] = (map[m.role] || 0) + 1;
    });
    return map;
  }, [members]);

  const cityCounts = useMemo(() => {
    const map: Record<string, number> = {};
    members.forEach((m) => {
      map[m.city] = (map[m.city] || 0) + 1;
    });
    return map;
  }, [members]);

  const experienceOptions = [
    { label: "All Experience", value: "All" },
    { label: "Fresher / Intern", value: "Fresher" },
    { label: "6 Months Internship", value: "6 Months" },
    { label: "1+ Year Experience", value: "1 Year" },
  ];

  // Filtering Logic
  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      // 1. Master Search Filter
      if (masterSearch.trim()) {
        const query = masterSearch.toLowerCase().trim();
        const matchesMaster =
          member.name.toLowerCase().includes(query) ||
          member.role.toLowerCase().includes(query) ||
          member.city.toLowerCase().includes(query) ||
          member.state.toLowerCase().includes(query) ||
          member.college.toLowerCase().includes(query) ||
          member.education.toLowerCase().includes(query) ||
          member.bio.toLowerCase().includes(query) ||
          member.skills.some((s) => s.toLowerCase().includes(query));
        if (!matchesMaster) return false;
      }

      // 2. Role Filter
      if (selectedRole !== "All" && member.role.toLowerCase() !== selectedRole.toLowerCase()) {
        return false;
      }

      // 3. City Filter
      if (selectedCity !== "All" && member.city.toLowerCase() !== selectedCity.toLowerCase()) {
        return false;
      }

      // 4. State Filter
      if (selectedState !== "All" && member.state.toLowerCase() !== selectedState.toLowerCase()) {
        return false;
      }

      // 5. Experience Filter
      if (selectedExperience !== "All" && !member.experience.toLowerCase().includes(selectedExperience.toLowerCase())) {
        return false;
      }

      // 6. Skills Filter (Multi-select)
      if (selectedSkills.length > 0) {
        const hasAllSelectedSkills = selectedSkills.every((skill) =>
          member.skills.some((s) => s.toLowerCase() === skill.toLowerCase())
        );
        if (!hasAllSelectedSkills) return false;
      }

      // 7. Verified Only
      if (verifiedOnly && !member.isVerified) {
        return false;
      }

      return true;
    });
  }, [
    members,
    masterSearch,
    selectedRole,
    selectedCity,
    selectedState,
    selectedExperience,
    selectedSkills,
    verifiedOnly,
  ]);

  // Sorting
  const sortedMembers = useMemo(() => {
    const list = [...filteredMembers];
    if (sortBy === "name_asc") {
      return list.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sortBy === "name_desc") {
      return list.sort((a, b) => b.name.localeCompare(a.name));
    }
    if (sortBy === "role") {
      return list.sort((a, b) => a.role.localeCompare(b.role));
    }
    return list; // default / featured
  }, [filteredMembers, sortBy]);

  // Total active filter count
  const activeFiltersCount =
    (selectedRole !== "All" ? 1 : 0) +
    (selectedCity !== "All" ? 1 : 0) +
    (selectedState !== "All" ? 1 : 0) +
    (selectedExperience !== "All" ? 1 : 0) +
    selectedSkills.length +
    (verifiedOnly ? 1 : 0) +
    (masterSearch.trim() ? 1 : 0);

  const clearAllFilters = () => {
    setMasterSearch("");
    setSelectedRole("All");
    setSelectedCity("All");
    setSelectedState("All");
    setSelectedExperience("All");
    setSelectedSkills([]);
    setVerifiedOnly(false);
    setSortBy("featured");
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  // Render Left Filter Content (Shared between Desktop Sidebar and Mobile Drawer)
  const renderFilterPanel = () => (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-[#0055FF]">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Filter Profiles</h3>
            <p className="text-[11px] text-slate-500 font-semibold">Refine directory results</p>
          </div>
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-xs font-bold text-red-500 hover:text-red-600 cursor-pointer hover:underline transition-all"
          >
            Clear All ({activeFiltersCount})
          </button>
        )}
      </div>

      {/* Verified Only Toggle */}
      <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black">
            ✓
          </span>
          <span className="text-xs font-extrabold text-slate-800">Verified Talent Only</span>
        </div>
        <button
          type="button"
          onClick={() => setVerifiedOnly(!verifiedOnly)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            verifiedOnly ? "bg-[#0055FF]" : "bg-slate-200"
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
              verifiedOnly ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Role / Designation Filter */}
      <div className="space-y-2.5">
        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
          Role & Designation
        </label>
        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          <label
            onClick={() => setSelectedRole("All")}
            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              selectedRole === "All"
                ? "bg-[#0055FF] text-white shadow-sm"
                : "bg-slate-50/80 text-slate-700 hover:bg-slate-100 border border-slate-100"
            }`}
          >
            <span>All Roles</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              selectedRole === "All" ? "bg-white/20 text-white" : "bg-slate-200/70 text-slate-600"
            }`}>
              {members.length}
            </span>
          </label>
          {uniqueRoles.map((role) => {
            const isSelected = selectedRole === role;
            const count = roleCounts[role] || 0;
            return (
              <label
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  isSelected
                    ? "bg-[#0055FF] text-white shadow-sm"
                    : "bg-slate-50/80 text-slate-700 hover:bg-slate-100 border border-slate-100"
                }`}
              >
                <span className="truncate pr-2">{role}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 ${
                  isSelected ? "bg-white/20 text-white" : "bg-slate-200/70 text-slate-600"
                }`}>
                  {count}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* City / Location Filter */}
      <div className="space-y-2.5">
        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
          Location / City
        </label>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          <label
            onClick={() => setSelectedCity("All")}
            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              selectedCity === "All"
                ? "bg-[#0055FF] text-white shadow-sm"
                : "bg-slate-50/80 text-slate-700 hover:bg-slate-100 border border-slate-100"
            }`}
          >
            <span>All Cities</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              selectedCity === "All" ? "bg-white/20 text-white" : "bg-slate-200/70 text-slate-600"
            }`}>
              {members.length}
            </span>
          </label>
          {uniqueCities.map((city) => {
            const isSelected = selectedCity === city;
            const count = cityCounts[city] || 0;
            return (
              <label
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  isSelected
                    ? "bg-[#0055FF] text-white shadow-sm"
                    : "bg-slate-50/80 text-slate-700 hover:bg-slate-100 border border-slate-100"
                }`}
              >
                <span className="truncate pr-2">📍 {city}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 ${
                  isSelected ? "bg-white/20 text-white" : "bg-slate-200/70 text-slate-600"
                }`}>
                  {count}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* State Filter */}
      {uniqueStates.length > 0 && (
        <div className="space-y-2">
          <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
            State / Region
          </label>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0055FF]"
          >
            <option value="All">All States / Regions</option>
            {uniqueStates.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Experience Level Filter */}
      <div className="space-y-2.5">
        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
          Experience Level
        </label>
        <div className="grid grid-cols-1 gap-1.5">
          {experienceOptions.map((exp) => (
            <button
              key={exp.value}
              type="button"
              onClick={() => setSelectedExperience(exp.value)}
              className={`text-left px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedExperience === exp.value
                  ? "bg-[#0055FF] text-white shadow-sm"
                  : "bg-slate-50/80 text-slate-700 hover:bg-slate-100 border border-slate-100"
              }`}
            >
              {exp.label}
            </button>
          ))}
        </div>
      </div>

      {/* Key Skills Tag Filter */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
            Technical Skills
          </label>
          {selectedSkills.length > 0 && (
            <button
              onClick={() => setSelectedSkills([])}
              className="text-[10px] font-bold text-red-500 hover:underline"
            >
              Clear ({selectedSkills.length})
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
          {allSkills.map((skill) => {
            const isSelected = selectedSkills.includes(skill);
            return (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#0055FF] text-white shadow-xs scale-102"
                    : "bg-blue-50/60 text-slate-700 hover:bg-blue-100/70 border border-blue-100/70"
                }`}
              >
                {isSelected ? `✓ ${skill}` : skill}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-20 pb-24 relative bg-gradient-to-b from-blue-50/50 via-sky-50/20 to-transparent">
      {/* Ambient Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#0055FF]/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        

        {/* 2-Column Responsive Layout: Left Filter Panel + Center Content */}
        <div className="flex flex-col lg:flex-row items-start gap-8">
          
          {/* ============================================================ */}
          {/* 2. CENTER CONTENT (Sticky Top Bar with Search & Sort + Cards Grid) */}
          {/* ============================================================ */}
          <main className="flex-1 w-full min-w-0 space-y-5">
            
            {/* STICKY TOP CONTROLS BAR (Search on Top Right + Sort + Count) */}
            <div className="sticky top-20 z-30 p-3 sm:p-4 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/90 shadow-[0_10px_35px_rgba(0,85,255,0.08)] flex flex-col md:flex-row md:items-center justify-between gap-3">
              
              {/* Left: Count & Mobile Filter Button */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-100 text-xs font-extrabold text-[#0055FF] shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                  Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                </button>

                <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-700 whitespace-nowrap">
                  Showing <span className="text-[#0055FF] font-black">{sortedMembers.length}</span> of {members.length} Candidates
                </span>
              </div>

              {/* Right: Search Box + Sort Dropdown */}
              <div className="flex items-center gap-2.5 w-full md:w-auto flex-1 md:justify-end">
                
                {/* Search Box on Top Right */}
                <div className="relative flex-1 max-w-full md:max-w-xs">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0055FF] pointer-events-none flex items-center">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search name, skills, role..."
                    value={masterSearch}
                    onChange={(e) => setMasterSearch(e.target.value)}
                    className="w-full pl-9 pr-7 py-2 rounded-xl bg-blue-50/50 hover:bg-blue-50/80 focus:bg-white border border-blue-100 text-slate-900 text-xs font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0055FF]/30 transition-all"
                  />
                  {masterSearch && (
                    <button
                      onClick={() => setMasterSearch("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-black w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center cursor-pointer"
                      title="Clear search"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Sort By Dropdown */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="hidden sm:inline text-xs font-bold text-slate-500 whitespace-nowrap">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-white border border-blue-100 text-xs font-extrabold text-slate-800 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#0055FF]/30 cursor-pointer"
                  >
                    <option value="featured">Role / Department</option>
                    <option value="name_asc">Name: A to Z</option>
                    <option value="name_desc">Name: Z to A</option>
                    <option value="experience">Experience</option>
                  </select>
                </div>

              </div>
            </div>

            {/* ACTIVE FILTER PILLS */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-white/60 backdrop-blur-md border border-slate-200/60">
                <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                  Active Filters:
                </span>

                {masterSearch && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#0055FF] border border-blue-200">
                    Search: &quot;{masterSearch}&quot;
                    <button onClick={() => setMasterSearch("")} className="hover:text-red-500 font-bold ml-1">✕</button>
                  </span>
                )}

                {selectedRole !== "All" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#0055FF] border border-blue-200">
                    Role: {selectedRole}
                    <button onClick={() => setSelectedRole("All")} className="hover:text-red-500 font-bold ml-1">✕</button>
                  </span>
                )}

                {selectedCity !== "All" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#0055FF] border border-blue-200">
                    City: {selectedCity}
                    <button onClick={() => setSelectedCity("All")} className="hover:text-red-500 font-bold ml-1">✕</button>
                  </span>
                )}

                {selectedState !== "All" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#0055FF] border border-blue-200">
                    State: {selectedState}
                    <button onClick={() => setSelectedState("All")} className="hover:text-red-500 font-bold ml-1">✕</button>
                  </span>
                )}

                {selectedExperience !== "All" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#0055FF] border border-blue-200">
                    Exp: {selectedExperience}
                    <button onClick={() => setSelectedExperience("All")} className="hover:text-red-500 font-bold ml-1">✕</button>
                  </span>
                )}

                {selectedSkills.map((skill) => (
                  <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#0055FF] border border-blue-200">
                    Skill: {skill}
                    <button onClick={() => toggleSkill(skill)} className="hover:text-red-500 font-bold ml-1">✕</button>
                  </span>
                ))}

                {verifiedOnly && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Verified Only
                    <button onClick={() => setVerifiedOnly(false)} className="hover:text-red-500 font-bold ml-1">✕</button>
                  </span>
                )}

                <button
                  onClick={clearAllFilters}
                  className="text-xs font-bold text-red-500 hover:text-red-600 hover:underline ml-auto cursor-pointer"
                >
                  Reset All
                </button>
              </div>
            )}

            {/* CANDIDATE CARDS GRID */}
            {sortedMembers.length === 0 ? (
              <div className="text-center py-20 bg-white/80 backdrop-blur-xl rounded-[32px] border border-blue-100 p-8 shadow-sm">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-50 text-[#0055FF] flex items-center justify-center">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="text-lg font-extrabold text-slate-800 mb-1">
                  No candidates found matching your filter criteria
                </p>
                <p className="text-sm font-semibold text-slate-500 mb-6 max-w-md mx-auto">
                  Try adjusting the master search term or clearing one of the filters from the left panel.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-3 rounded-full text-xs font-extrabold text-white bg-[#0055FF] hover:bg-blue-600 transition-all shadow-md cursor-pointer"
                >
                  Reset All Search & Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedMembers.map((member) => (
                  <Link
                    href={`/ourteam/${member.id}`}
                    key={member.id}
                    className="group block h-full"
                  >
                    <div className="h-full rounded-[28px] bg-white/90 backdrop-blur-2xl border border-white/90 shadow-[0_10px_35px_rgba(0,85,255,0.08)] hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(0,85,255,0.16)] transition-all duration-300 flex flex-col justify-between overflow-hidden p-5">
                      
                      {/* Portrait Image */}
                      <div className="w-full h-64 rounded-[22px] overflow-hidden bg-slate-900 relative mb-4 border border-blue-50">
                        {member.image ? (
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white select-none">
                            <div className="w-20 h-20 rounded-full bg-blue-600/30 border-2 border-blue-400/40 flex items-center justify-center text-2xl font-black tracking-wider text-blue-200 shadow-inner">
                              {member.name ? member.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "TM"}
                            </div>
                            <span className="text-xs font-bold text-blue-200/90 mt-2.5 tracking-wide">
                              JCRM Member
                            </span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent pointer-events-none"></div>

                        {/* Top Badges */}
                        <div className="absolute top-3 right-3 z-10">
                          {member.isVerified && (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-500 text-white shadow-md flex items-center gap-1 backdrop-blur-xs">
                              ✓ Verified
                            </span>
                          )}
                        </div>

                        {/* Role Pill on Image Bottom */}
                        <div className="absolute bottom-3 left-3 right-3 z-10">
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-[#0055FF] text-white shadow-md max-w-full truncate">
                            • {member.role}
                          </span>
                        </div>
                      </div>

                      {/* Card Info */}
                      <div className="space-y-3 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="heading-font text-xl font-extrabold text-slate-900 group-hover:text-[#0055FF] transition-colors leading-tight">
                              {member.name}
                            </h3>
                          </div>

                          <p className="text-xs font-bold text-slate-500 mt-1 flex items-center gap-1">
                            <span>📍 {member.city}, {member.state}</span>
                          </p>

                          <p className="text-[11px] font-semibold text-slate-600 mt-1 line-clamp-1">
                            🎓 {member.education || member.college}
                          </p>

                          {/* Experience Badge */}
                          <div className="mt-2">
                            <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200/80">
                              ⏱ {member.experience}
                            </span>
                          </div>

                          {/* Top Skills */}
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {member.skills.slice(0, 4).map((skill, i) => (
                              <span
                                key={i}
                                className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-blue-50/80 border border-blue-100 text-slate-700"
                              >
                                {skill}
                              </span>
                            ))}
                            {member.skills.length > 4 && (
                              <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-500">
                                +{member.skills.length - 4}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Profile CTA Button */}
                        <div className="pt-3 border-t border-blue-100/80 mt-3">
                          <span className="w-full py-2.5 rounded-xl text-xs font-extrabold text-white bg-[#0055FF] group-hover:bg-blue-600 transition-all shadow-md flex items-center justify-center gap-1.5 group-hover:scale-[1.02]">
                            View Full Profile
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

          </main>
        </div>

      </div>

      {/* ============================================================ */}
      {/* 3. MOBILE FILTER DRAWER (Slide-over on smaller screens) */}
      {/* ============================================================ */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative ml-auto w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
                <h2 className="text-base font-extrabold text-slate-900">Filters</h2>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm"
                >
                  ✕
                </button>
              </div>

              {renderFilterPanel()}
            </div>

            <div className="pt-6 border-t border-slate-200 mt-6 space-y-2">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 rounded-xl bg-[#0055FF] text-white text-xs font-extrabold shadow-md"
              >
                Apply Filters ({sortedMembers.length} Candidates)
              </button>
              <button
                onClick={() => {
                  clearAllFilters();
                  setIsMobileFilterOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
