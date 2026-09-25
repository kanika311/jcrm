"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { TeamMember } from "@/lib/teamData";
import { SponsoredAd, DEFAULT_SPONSORED_AD } from "@/lib/sponsoredAd";
import SponsoredAdModal from "@/components/SponsoredAdModal";
import {
  FiSearch,
  FiSliders,
  FiX,
  FiCheck,
  FiMapPin,
  FiBriefcase,
  FiAward,
  FiExternalLink,
  FiCalendar,
  FiMessageCircle,
  FiShield,
  FiArrowRight,
  FiUserCheck,
  FiEdit2,
  FiTag,
} from "react-icons/fi";
import HireModal from "./HireModal";

export default function TeamDirectoryClient({
  members,
  initialSponsoredAd,
}: {
  members: TeamMember[];
  initialSponsoredAd?: SponsoredAd;
}) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  const [sponsoredAd, setSponsoredAd] = useState<SponsoredAd>(
    initialSponsoredAd || DEFAULT_SPONSORED_AD
  );
  const [isSponsoredModalOpen, setIsSponsoredModalOpen] = useState(false);

  // Search & Filter State
  const [masterSearch, setMasterSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedEducation, setSelectedEducation] = useState("All");
  const [selectedExperience, setSelectedExperience] = useState("All");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Lock body scroll when mobile filter is open
  useEffect(() => {
    if (isMobileFilterOpen) {
      const orig = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = orig;
      };
    }
  }, [isMobileFilterOpen]);

  // Hire Modal State
  const [selectedCandidateForHire, setSelectedCandidateForHire] = useState<TeamMember | null>(null);

  // Dynamic Options & Counts
  const uniqueRoles = useMemo(
    () => Array.from(new Set(members.map((m) => m.role))).sort(),
    [members]
  );
  const uniqueCities = useMemo(
    () => Array.from(new Set(members.map((m) => m.city))).sort(),
    [members]
  );

  // Qualification / Education Categories
  const uniqueEducations = useMemo(() => {
    const set = new Set<string>();
    members.forEach((m) => {
      if (!m.education) return;
      const edu = m.education.toUpperCase();
      if (edu.includes("MCA")) set.add("MCA");
      else if (edu.includes("B.TECH") || edu.includes("B.E")) set.add("B.Tech / B.E.");
      else if (edu.includes("BCA")) set.add("BCA");
      else if (edu.includes("M.TECH") || edu.includes("M.E")) set.add("M.Tech");
      else set.add("Other Degree");
    });
    return Array.from(set).sort();
  }, [members]);

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

  const experienceOptions = [
    { label: "All Experience Levels", value: "All" },
    { label: "Student (Intern)", value: "Student" },
    { label: "Fresher / Intern", value: "Fresher" },
    { label: "6 Months Internship", value: "6 Months" },
    { label: "1+ Years Experience", value: "1 Year" },
  ];

  // Filtering Logic
  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      // 1. Search Query (Name, Skills, Role, College, Qualification, Location)
      if (masterSearch.trim()) {
        const query = masterSearch.toLowerCase().trim();
        const matchesMaster =
          member.name.toLowerCase().includes(query) ||
          member.role.toLowerCase().includes(query) ||
          member.city.toLowerCase().includes(query) ||
          member.state.toLowerCase().includes(query) ||
          member.college.toLowerCase().includes(query) ||
          member.education.toLowerCase().includes(query) ||
          member.experience.toLowerCase().includes(query) ||
          member.bio.toLowerCase().includes(query) ||
          member.skills.some((s) => s.toLowerCase().includes(query));
        if (!matchesMaster) return false;
      }

      // 2. Role Filter
      if (selectedRole !== "All" && member.role.toLowerCase() !== selectedRole.toLowerCase()) {
        return false;
      }

      // 3. Qualification / Education Filter
      if (selectedEducation !== "All") {
        const edu = (member.education || "").toUpperCase();
        if (selectedEducation === "MCA" && !edu.includes("MCA")) return false;
        if (selectedEducation === "B.Tech / B.E." && !edu.includes("B.TECH") && !edu.includes("B.E")) return false;
        if (selectedEducation === "BCA" && !edu.includes("BCA")) return false;
        if (selectedEducation === "M.Tech" && !edu.includes("M.TECH") && !edu.includes("M.E")) return false;
        if (
          selectedEducation === "Other Degree" &&
          (edu.includes("MCA") || edu.includes("B.TECH") || edu.includes("B.E") || edu.includes("BCA") || edu.includes("M.TECH"))
        ) {
          return false;
        }
      }

      // 4. Experience Level Filter
      if (selectedExperience !== "All") {
        const exp = (member.experience || "").toLowerCase();
        if (!exp.includes(selectedExperience.toLowerCase())) {
          return false;
        }
      }

      // 5. City Filter
      if (selectedCity !== "All" && member.city.toLowerCase() !== selectedCity.toLowerCase()) {
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
    selectedEducation,
    selectedExperience,
    selectedCity,
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

  // Active Filter Count
  const activeFiltersCount =
    (selectedRole !== "All" ? 1 : 0) +
    (selectedEducation !== "All" ? 1 : 0) +
    (selectedExperience !== "All" ? 1 : 0) +
    (selectedCity !== "All" ? 1 : 0) +
    selectedSkills.length +
    (verifiedOnly ? 1 : 0) +
    (masterSearch.trim() ? 1 : 0);

  const clearAllFilters = () => {
    setMasterSearch("");
    setSelectedRole("All");
    setSelectedEducation("All");
    setSelectedExperience("All");
    setSelectedCity("All");
    setSelectedSkills([]);
    setVerifiedOnly(false);
    setSortBy("featured");
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  // Reusable Filter Panel Content (Used in Left Panel and Mobile Drawer)
  const renderFilterPanel = (hideHeader: boolean = false) => (
    <div className="space-y-5">
      {/* Panel Title */}
      {!hideHeader && (
        <div className="flex items-center justify-between pb-3.5 border-b border-[#D4E8F8]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-[#D4E8F8] flex items-center justify-center text-[#0055FF]">
              <FiSliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Find Talent &amp; Team
              </h3>
              <p className="text-[10px] font-bold text-slate-500">Refine by skills &amp; profile</p>
            </div>
          </div>
          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-xs font-bold text-[#0055FF] hover:underline cursor-pointer"
            >
              Clear All
            </button>
          )}
        </div>
      )}

      {/* Verified Only Toggle */}
      <div className="p-3 rounded-xl bg-blue-50/70 border border-[#D4E8F8] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#0055FF] text-white flex items-center justify-center text-[10px] font-black">
            ✓
          </span>
          <span className="text-xs font-bold text-slate-800">Verified Talent Only</span>
        </div>
        <button
          type="button"
          onClick={() => setVerifiedOnly(!verifiedOnly)}
          className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            verifiedOnly ? "bg-[#0055FF]" : "bg-slate-300"
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
              verifiedOnly ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Qualification / Degree Filter */}
      <div className="space-y-2">
        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700">
          Qualification / Degree
        </label>
        <select
          value={selectedEducation}
          onChange={(e) => setSelectedEducation(e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-blue-50/50 hover:bg-white border border-[#D4E8F8] text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0055FF]/20 cursor-pointer shadow-2xs"
        >
          <option value="All">All Qualifications</option>
          {uniqueEducations.map((edu) => (
            <option key={edu} value={edu}>
              {edu}
            </option>
          ))}
        </select>
      </div>

      {/* Experience Level Filter */}
      <div className="space-y-2">
        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700">
          Experience Level
        </label>
        <select
          value={selectedExperience}
          onChange={(e) => setSelectedExperience(e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-blue-50/50 hover:bg-white border border-[#D4E8F8] text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0055FF]/20 cursor-pointer shadow-2xs"
        >
          {experienceOptions.map((exp) => (
            <option key={exp.value} value={exp.value}>
              {exp.label}
            </option>
          ))}
        </select>
      </div>

      {/* Role / Department Filter */}
      <div className="space-y-2">
        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700">
          Department / Role
        </label>
        <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => setSelectedRole("All")}
            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-left ${
              selectedRole === "All"
                ? "bg-[#0055FF] text-white shadow-2xs"
                : "bg-blue-50/40 text-slate-700 hover:bg-blue-100/60 border border-[#D4E8F8]/60"
            }`}
          >
            <span>All Roles</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                selectedRole === "All" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
              }`}
            >
              {members.length}
            </span>
          </button>
          {uniqueRoles.map((role) => {
            const isSelected = selectedRole === role;
            const count = roleCounts[role] || 0;
            return (
              <button
                key={role}
                type="button"
                onClick={() => setSelectedRole(role)}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-left ${
                  isSelected
                    ? "bg-[#0055FF] text-white shadow-2xs"
                    : "bg-blue-50/40 text-slate-700 hover:bg-blue-100/60 border border-[#D4E8F8]/60"
                }`}
              >
                <span className="truncate pr-2">{role}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 ${
                    isSelected ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Technical Skills Filter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700">
            Skills &amp; Technologies
          </label>
          {selectedSkills.length > 0 && (
            <button
              onClick={() => setSelectedSkills([])}
              className="text-[10px] font-bold text-[#0055FF] hover:underline cursor-pointer"
            >
              Clear ({selectedSkills.length})
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
          {allSkills.map((skill) => {
            const isSelected = selectedSkills.includes(skill);
            return (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#0055FF] text-white shadow-2xs"
                    : "bg-blue-50 text-[#0055FF] hover:bg-blue-100/80 border border-[#D4E8F8]"
                }`}
              >
                {isSelected ? `✓ ${skill}` : skill}
              </button>
            );
          })}
        </div>
      </div>

      {/* Location / City Filter */}
      <div className="space-y-2">
        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700">
          City / Location
        </label>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-blue-50/50 hover:bg-white border border-[#D4E8F8] text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0055FF]/20 cursor-pointer shadow-2xs"
        >
          <option value="All">All Cities</option>
          {uniqueCities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Sort By Filter */}
      <div className="space-y-2">
        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700">
          Sort Profiles
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-blue-50/50 hover:bg-white border border-[#D4E8F8] text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0055FF]/20 cursor-pointer shadow-2xs"
        >
          <option value="featured">Featured First</option>
          <option value="name_asc">Name (A to Z)</option>
          <option value="name_desc">Name (Z to A)</option>
          <option value="role">By Department</option>
        </select>
      </div>

      {/* Reset Button */}
      <button
        onClick={clearAllFilters}
        className="w-full py-2.5 rounded-xl border border-[#D4E8F8] bg-blue-50 hover:bg-blue-100 text-[#0055FF] text-xs font-bold transition-all cursor-pointer shadow-2xs"
      >
        Clear All Filters
      </button>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#F0F7FF] relative font-sans text-slate-800">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ==================================================================== */}
        {/* 3-PANEL RESPONSIVE ARCHITECTURE: LEFT | CENTER | RIGHT               */}
        {/* ==================================================================== */}
        <div className="flex flex-col lg:flex-row items-start gap-6">
          
          {/* ================================================================== */}
          {/* 1. LEFT PANEL: SEARCH & MULTI-PARAM FILTERS                        */}
          {/* ================================================================== */}
          <aside className="hidden lg:block w-72 lg:w-80 shrink-0 sticky top-24 self-start bg-white border border-[#D4E8F8] rounded-2xl shadow-xs p-5">
            {renderFilterPanel()}
          </aside>

          {/* ================================================================== */}
          {/* 2. CENTER PANEL: TOP SEARCH BAR & CANDIDATE CARDS GRID             */}
          {/* ================================================================== */}
          <main className="flex-1 w-full min-w-0 space-y-5">
            
            {/* STICKY TOP SEARCH BAR */}
            <div className="p-3 rounded-2xl bg-white border border-[#D4E8F8] shadow-xs flex items-center gap-3">
              {/* Mobile Filter Toggle (Icon only on short screen) */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden p-2.5 sm:px-3.5 sm:py-2.5 rounded-xl bg-blue-50 border border-[#D4E8F8] text-[#0055FF] flex items-center gap-2 cursor-pointer shrink-0 hover:bg-blue-100 transition shadow-2xs"
                title="Filters"
                aria-label="Filters"
              >
                <FiSliders className="w-4 h-4" />
                {activeFiltersCount > 0 && (
                  <span className="sm:hidden w-2 h-2 rounded-full bg-[#0055FF]" />
                )}
                <span className="hidden sm:inline text-xs font-bold">
                  Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                </span>
              </button>

              {/* Master Search Input */}
              <div className="relative flex-1">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0055FF] pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by name, skills, qualification, experience, role..."
                  value={masterSearch}
                  onChange={(e) => setMasterSearch(e.target.value)}
                  className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-blue-50/50 hover:bg-white focus:bg-white border border-[#D4E8F8] text-slate-900 text-xs sm:text-sm font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0055FF]/20 transition-all shadow-2xs"
                />
                {masterSearch && (
                  <button
                    onClick={() => setMasterSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                    title="Clear search"
                  >
                    <FiX className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* ACTIVE FILTER PILLS */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-white border border-[#D4E8F8] shadow-xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Active Filters:
                </span>

                {masterSearch && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#0055FF] border border-[#D4E8F8]">
                    Search: &quot;{masterSearch}&quot;
                    <button onClick={() => setMasterSearch("")} className="hover:text-red-500 ml-1">✕</button>
                  </span>
                )}

                {selectedEducation !== "All" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#0055FF] border border-[#D4E8F8]">
                    Degree: {selectedEducation}
                    <button onClick={() => setSelectedEducation("All")} className="hover:text-red-500 ml-1">✕</button>
                  </span>
                )}

                {selectedRole !== "All" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#0055FF] border border-[#D4E8F8]">
                    Role: {selectedRole}
                    <button onClick={() => setSelectedRole("All")} className="hover:text-red-500 ml-1">✕</button>
                  </span>
                )}

                {selectedExperience !== "All" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#0055FF] border border-[#D4E8F8]">
                    Exp: {selectedExperience}
                    <button onClick={() => setSelectedExperience("All")} className="hover:text-red-500 ml-1">✕</button>
                  </span>
                )}

                {selectedCity !== "All" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#0055FF] border border-[#D4E8F8]">
                    City: {selectedCity}
                    <button onClick={() => setSelectedCity("All")} className="hover:text-red-500 ml-1">✕</button>
                  </span>
                )}

                {selectedSkills.map((skill) => (
                  <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#0055FF] border border-[#D4E8F8]">
                    Skill: {skill}
                    <button onClick={() => toggleSkill(skill)} className="hover:text-red-500 ml-1">✕</button>
                  </span>
                ))}

                {verifiedOnly && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Verified Only
                    <button onClick={() => setVerifiedOnly(false)} className="hover:text-red-500 ml-1">✕</button>
                  </span>
                )}

                <button
                  onClick={clearAllFilters}
                  className="text-xs font-bold text-[#0055FF] hover:underline ml-auto cursor-pointer"
                >
                  Reset All
                </button>
              </div>
            )}

            {/* RESULTS COUNT BANNER */}
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-500">
                Showing <strong className="text-slate-900">{sortedMembers.length}</strong> candidate profiles
              </span>
            </div>

            {/* CANDIDATE CARDS GRID (Yogsathi Style in White & Light Blue) */}
            {sortedMembers.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-[#D4E8F8] p-8 shadow-xs">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-50 border border-[#D4E8F8] text-[#0055FF] flex items-center justify-center">
                  <FiSearch className="w-8 h-8" />
                </div>
                <p className="text-lg font-bold text-slate-900 mb-1">
                  No candidate profiles found matching your filters
                </p>
                <p className="text-xs font-medium text-slate-500 mb-6 max-w-md mx-auto">
                  Try clearing some filter criteria from the left panel or searching with a different term.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0055FF] hover:bg-blue-600 transition-all shadow-xs cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {sortedMembers.map((member) => (
                  <div
                    key={member.id}
                    className="bg-white rounded-2xl border border-[#D4E8F8] hover:border-[#0055FF]/40 shadow-xs hover:shadow-md transition-all duration-300 p-5 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Circular Avatar (Yogsathi Style) with blue ring */}
                      <div className="relative w-24 h-24 mx-auto mb-3.5">
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-blue-50 border-4 border-[#D4E8F8] group-hover:border-[#0055FF] transition-colors shadow-sm">
                          {member.image ? (
                            <img
                              src={member.image}
                              alt={member.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-blue-100 text-[#0055FF] font-black text-xl">
                              {member.name ? member.name.slice(0, 2).toUpperCase() : "TM"}
                            </div>
                          )}
                        </div>

                        {/* Verified badge */}
                        {member.isVerified && (
                          <span
                            className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#0055FF] text-white flex items-center justify-center text-xs font-black border-2 border-white shadow-xs"
                            title="Verified Candidate"
                          >
                            ✓
                          </span>
                        )}
                      </div>

                      {/* Candidate Name & Role */}
                      <div className="text-center mb-3">
                        <h3 className="font-bold text-base text-slate-900 group-hover:text-[#0055FF] transition-colors leading-tight">
                          {member.name}
                        </h3>
                        <p className="text-xs font-bold text-[#0055FF] mt-0.5 truncate">
                          {member.role}
                        </p>
                      </div>

                      {/* Candidate Meta Info */}
                      <div className="space-y-1.5 text-xs text-slate-600 border-t border-[#D4E8F8]/60 pt-3">
                        <div className="flex items-center gap-2">
                          <FiBriefcase className="w-3.5 h-3.5 text-[#0055FF] shrink-0" />
                          <span className="font-semibold truncate">
                            {member.experience || "Student (Intern)"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <FiAward className="w-3.5 h-3.5 text-[#0055FF] shrink-0" />
                          <span className="truncate" title={member.education || member.college}>
                            {member.education || member.college}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <FiMapPin className="w-3.5 h-3.5 text-[#0055FF] shrink-0" />
                          <span className="truncate">
                            {member.city}, {member.state}
                          </span>
                        </div>
                      </div>

                      {/* Key Skills Tags */}
                      <div className="flex flex-wrap gap-1 mt-3.5 pt-3 border-t border-[#D4E8F8]/60">
                        {member.skills.slice(0, 3).map((skill, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-[#0055FF] border border-[#D4E8F8]"
                          >
                            {skill}
                          </span>
                        ))}
                        {member.skills.length > 3 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500">
                            +{member.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Dual Action Buttons (Yogsathi Style) */}
                    <div className="pt-4 mt-3 border-t border-[#D4E8F8] space-y-2">
                      {/* Schedule Interview (Opens HireModal) */}
                      <button
                        onClick={() => setSelectedCandidateForHire(member)}
                        className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-[#0055FF] hover:bg-blue-600 transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <FiCalendar className="w-3.5 h-3.5" />
                        <span>Schedule Interview</span>
                      </button>

                      {/* View Profile */}
                      <Link
                        href={`/ourteam/${member.id}`}
                        className="w-full py-2 rounded-xl text-xs font-bold text-[#0055FF] bg-white hover:bg-blue-50 border border-[#0055FF] transition-all flex items-center justify-center gap-1.5"
                      >
                        <span>View Profile</span>
                        <FiExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Mobile / Tablet Sponsored Banner */}
            {sponsoredAd.isActive && (
              <div className="xl:hidden mt-8 bg-white border border-[#D4E8F8] rounded-2xl p-5 shadow-xs space-y-3.5">
                <div className="flex items-center justify-start pb-3 border-b border-[#D4E8F8]">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0055FF] border border-[#D4E8F8] text-[10px] font-black tracking-wider uppercase flex items-center gap-1.5">
                    <FiTag className="w-3 h-3 text-[#0055FF]" />
                    <span>SPONSORED</span>
                  </span>
                </div>

                {sponsoredAd.image && (
                  <div className="w-full h-36 rounded-xl overflow-hidden border border-[#D4E8F8] bg-slate-50">
                    <img
                      src={sponsoredAd.image}
                      alt={sponsoredAd.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <h4 className="text-sm font-black text-slate-900">{sponsoredAd.title}</h4>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {sponsoredAd.description}
                  </p>
                </div>

                {sponsoredAd.ctaLink && (
                  <a
                    href={sponsoredAd.ctaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-[#0055FF] hover:bg-blue-600 text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2"
                  >
                    <span>{sponsoredAd.ctaText || "Learn More"}</span>
                    <FiExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}
          </main>

          {/* ================================================================== */}
          {/* 3. RIGHT PANEL: SPONSORED BANNER & ENTERPRISE HIRING SPOTLIGHT     */}
          {/* ================================================================== */}
          <aside className="w-72 lg:w-80 shrink-0 hidden xl:block sticky top-24 self-start space-y-5">
            {/* SPONSORED ADVERTISEMENT CARD */}
            {sponsoredAd.isActive ? (
              <div className="bg-white border border-[#D4E8F8] rounded-2xl shadow-xs p-5 space-y-3.5 relative overflow-hidden group hover:border-[#0055FF]/40 transition-all">
                {/* Header: Only Sponsored Badge */}
                <div className="flex items-center justify-start pb-3 border-b border-[#D4E8F8]">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0055FF] border border-[#D4E8F8] text-[10px] font-black tracking-wider uppercase flex items-center gap-1.5">
                    <FiTag className="w-3 h-3 text-[#0055FF]" />
                    <span>SPONSORED</span>
                  </span>
                </div>

                {/* Optional Banner Image */}
                {sponsoredAd.image && (
                  <div className="w-full h-36 rounded-xl overflow-hidden border border-[#D4E8F8] bg-slate-50 relative">
                    <img
                      src={sponsoredAd.image}
                      alt={sponsoredAd.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Headline & Description */}
                <div className="space-y-1.5">
                  <h4 className="text-sm font-black text-slate-900 group-hover:text-[#0055FF] transition-colors leading-snug">
                    {sponsoredAd.title}
                  </h4>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {sponsoredAd.description}
                  </p>
                </div>

                {/* CTA Action Button */}
                {sponsoredAd.ctaLink && (
                  <a
                    href={sponsoredAd.ctaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-[#0055FF] hover:bg-blue-600 text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{sponsoredAd.ctaText || "Learn More"}</span>
                    <FiExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ) : (
              isAdmin && (
                <div className="bg-blue-50/50 border border-dashed border-[#D4E8F8] rounded-2xl p-4 text-center">
                  <p className="text-xs font-bold text-slate-600 mb-2 flex items-center justify-center gap-1">
                    <FiTag className="w-3.5 h-3.5 text-[#0055FF]" />
                    <span>Sponsored Ad is currently hidden</span>
                  </p>
                  <button
                    onClick={() => setIsSponsoredModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#0055FF] text-white text-xs font-bold shadow-xs hover:bg-blue-600 transition cursor-pointer"
                  >
                    + Enable &amp; Edit Sponsored Ad
                  </button>
                </div>
              )
            )}

          </aside>

        </div>
      </div>

      {/* ====================================================================== */}
      {/* 4. MOBILE SLIDE-OUT FILTER DRAWER (OPENS SMOOTHLY ON THE LEFT)         */}
      {/* ====================================================================== */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-[9999] lg:hidden flex justify-start">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsMobileFilterOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Pinned strictly to the LEFT */}
          <div className="relative w-[min(340px,88vw)] max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between z-50 animate-drawer-left border-r border-[#D4E8F8]">
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-[#D4E8F8] flex items-center justify-between bg-blue-50/60 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-[#D4E8F8] flex items-center justify-center text-[#0055FF] shadow-2xs">
                  <FiSliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Find Talent &amp; Team
                  </h3>
                  <p className="text-[10px] font-bold text-slate-500">Refine by skills &amp; profile</p>
                </div>
              </div>

              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-8 h-8 rounded-xl bg-white border border-[#D4E8F8] flex items-center justify-center text-slate-500 hover:text-slate-900 shadow-2xs cursor-pointer transition-colors"
                title="Close filters"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Filter Content */}
            <div className="p-4 sm:p-5 overflow-y-auto flex-1 overscroll-contain">
              {renderFilterPanel(true)}
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-[#D4E8F8] bg-white space-y-2 shrink-0">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 rounded-xl bg-[#0055FF] hover:bg-blue-600 active:scale-[0.99] text-white text-xs font-black shadow-md shadow-blue-500/20 transition cursor-pointer"
              >
                Apply Filters ({sortedMembers.length} Profiles)
              </button>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="w-full py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 transition"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* 6. HIRE / INTERVIEW SCHEDULING MODAL                                  */}
      {/* ====================================================================== */}
      {selectedCandidateForHire && (
        <HireModal
          isOpen={Boolean(selectedCandidateForHire)}
          onClose={() => setSelectedCandidateForHire(null)}
          candidateName={selectedCandidateForHire.name}
          candidateRole={selectedCandidateForHire.role}
        />
      )}
    </div>
  );
}
