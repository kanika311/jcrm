"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TeamMember, maskPhone } from "@/lib/teamData";
import { SponsoredAd } from "@/lib/sponsoredAd";
import HireModal from "../HireModal";
import NameAvatar from "@/components/NameAvatar";
import { FaWhatsapp } from "react-icons/fa";
import {
  FiShare2,
  FiArrowLeft,
  FiChevronLeft,
  FiChevronRight,
  FiCheck,
  FiCopy,
  FiExternalLink,
  FiShield,
  FiAward,
  FiBookOpen,
  FiMapPin,
  FiBriefcase,
  FiLock,
  FiTag,
} from "react-icons/fi";
import { IoClose } from "react-icons/io5";

export interface CandidateSummary {
  id: string;
  name: string;
  role: string;
  image: string;
  city?: string;
}

interface CandidateDetailClientProps {
  member: TeamMember;
  prevMemberId?: string;
  nextMemberId?: string;
  relatedMembers?: CandidateSummary[];
  sponsoredAd?: SponsoredAd;
}

export default function CandidateDetailClient({
  member,
  prevMemberId,
  nextMemberId,
  relatedMembers = [],
  sponsoredAd,
}: CandidateDetailClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [isHireModalOpen, setIsHireModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [relatedIndex, setRelatedIndex] = useState(0);

  // Generate WhatsApp Share Message with complete meta details
  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/ourteam/${member.id}`;
    }
    return `https://www.jcrm.in/ourteam/${member.id}`;
  };

  const getShareMessage = () => {
    const url = getShareUrl();
    const skillsText =
      member.skills && member.skills.length > 0 ? member.skills.slice(0, 6).join(", ") : "Engineering & Tech";

    return [
      `🌟 *JCRM Technologies — Verified Candidate Profile*`,
      `👤 *Candidate:* ${member.name} ${member.isVerified ? "✓ (Verified)" : ""}`,
      `💼 *Role / Domain:* ${member.role}`,
      member.education ? `🎓 *Education:* ${member.education} (${member.college})` : "",
      member.experience ? `⏱️ *Experience:* ${member.experience}` : "",
      member.city ? `📍 *Location:* ${member.city}, ${member.state}` : "",
      `⚡ *Core Skills:* ${skillsText}`,
      "",
      `📝 *Candidate Biography:*`,
      `"${member.bio || `${member.name} is a software engineer and verified talent at JCRM Technologies.`}"`,
      "",
      `🔗 *View Full Verified Profile & Schedule Interview:*`,
      url,
    ]
      .filter(Boolean)
      .join("\n");
  };

  const handleShareToWhatsApp = () => {
    const text = encodeURIComponent(getShareMessage());
    const waUrl = `https://api.whatsapp.com/send?text=${text}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      alert("Failed to copy URL to clipboard");
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${member.name} — ${member.role} | JCRM Technologies`,
          text: getShareMessage(),
          url: getShareUrl(),
        });
        return;
      } catch (err: any) {
        if (err?.name === "AbortError") return;
      }
    }
    setIsShareModalOpen(true);
  };

  // Carousel controls for related candidates in right rail
  const nextRelated = () => {
    if (relatedMembers.length <= 1) return;
    setRelatedIndex((prev) => (prev + 1) % relatedMembers.length);
  };

  const prevRelated = () => {
    if (relatedMembers.length <= 1) return;
    setRelatedIndex((prev) => (prev - 1 + relatedMembers.length) % relatedMembers.length);
  };

  const currentRelated =
    relatedMembers.length > 0 ? relatedMembers[relatedIndex % relatedMembers.length] : null;

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-24 relative bg-[#F8FAFC]">
      {/* Background Ambient Glow */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[800px] h-[550px] bg-gradient-to-tr from-[#0055FF]/10 via-sky-400/5 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
        {/* =================================================================== */}
        {/* TOP NAVIGATION BAR: STICKY AT TOP (Back | Prev / Next | Share)      */}
        {/* =================================================================== */}
        <div className="sticky top-16 sm:top-20 z-30 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-3 sm:p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
          {/* Left: Back to Team Directory */}
          <Link
            href="/ourteam"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold transition shadow-2xs"
          >
            <FiArrowLeft className="w-4 h-4 text-[#0055FF]" />
            <span>Back to Team Directory</span>
          </Link>

          {/* Right: Prev / Next Navigation & Share Button */}
          <div className="flex items-center gap-2">
            {prevMemberId ? (
              <button
                onClick={() => startTransition(() => router.push(`/ourteam/${prevMemberId}`))}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold transition cursor-pointer disabled:opacity-50"
                title="Previous Candidate"
              >
                <FiChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Prev</span>
              </button>
            ) : (
              <button
                disabled
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-100 bg-slate-50 text-slate-300 text-xs sm:text-sm font-bold cursor-not-allowed"
              >
                <FiChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Prev</span>
              </button>
            )}

            {nextMemberId ? (
              <button
                onClick={() => startTransition(() => router.push(`/ourteam/${nextMemberId}`))}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold transition cursor-pointer disabled:opacity-50"
                title="Next Candidate"
              >
                <span className="hidden sm:inline">Next</span>
                <FiChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                disabled
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-100 bg-slate-50 text-slate-300 text-xs sm:text-sm font-bold cursor-not-allowed"
              >
                <span className="hidden sm:inline">Next</span>
                <FiChevronRight className="w-4 h-4" />
              </button>
            )}

            {/* Share on WhatsApp Button */}
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-extrabold shadow-sm transition-all hover:scale-105 cursor-pointer"
              title="Share verified candidate profile on WhatsApp"
            >
              <FaWhatsapp className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* =================================================================== */}
        {/* MAIN 3-PANEL LAYOUT (LEFT 3 COLS | CENTER 6 COLS | RIGHT 3 COLS)    */}
        {/* =================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start">
          {/* =============================================================== */}
          {/* 1. LEFT PANEL: STICKY Profile Photo Card & Direct Actions       */}
          {/* =============================================================== */}
          <aside className="lg:col-span-3 space-y-5 lg:sticky lg:top-36 self-start">
            {/* Primary Profile Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-5 text-center space-y-4">
              {/* Photo Box */}
              <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden bg-slate-900 relative shadow-sm border border-slate-100 group">
                <NameAvatar
                  name={member.name}
                  src={member.image}
                  alt={member.name}
                  showName={false}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  textClassName="text-5xl font-black"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent pointer-events-none" />

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10 gap-1.5">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#0055FF] text-white shadow-xs truncate max-w-[140px]">
                    • {member.role}
                  </span>
                  {member.isVerified && (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500 text-white shadow-xs shrink-0 flex items-center gap-1">
                      <FiCheck className="w-3 h-3 stroke-[3]" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Name & Role Header */}
              <div>
                <h1 className="heading-font text-2xl font-black text-slate-900 flex items-center justify-center gap-1.5 flex-wrap">
                  <span>{member.name}</span>
                  {member.isVerified && (
                    <span
                      className="w-5 h-5 rounded-full bg-emerald-500 text-white inline-flex items-center justify-center text-[10px] font-black shadow-xs"
                      title="Verified JCRM Candidate"
                    >
                      ✓
                    </span>
                  )}
                </h1>
                <p className="text-xs font-bold text-[#0055FF] mt-1">{member.role}</p>
              </div>

              {/* Quick Tags: Experience & Location */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] font-bold">
                <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1">
                  <FiBriefcase className="w-3 h-3 text-[#0055FF]" />
                  <span>{member.experience || "Fresher / Intern"}</span>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 flex items-center gap-1">
                  <FiMapPin className="w-3 h-3 text-slate-500" />
                  <span>{member.city}, {member.state}</span>
                </span>
              </div>

              {/* CTA Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => setIsHireModalOpen(true)}
                  className="w-full py-3.5 rounded-xl text-sm font-extrabold text-white bg-red-500 hover:bg-red-600 transition-all shadow-md hover:shadow-red-500/25 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Hire Now</span>
                  <span>🚀</span>
                </button>

                <button
                  onClick={handleShareToWhatsApp}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba59] transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <FaWhatsapp className="w-3.5 h-3.5" />
                  <span>Share on WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Encrypted Contact Details Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FiLock className="w-3 h-3 text-slate-400" />
                  <span>Encrypted Contact Details</span>
                </span>
                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  Secured
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-500">Phone:</span>
                <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {maskPhone(member.maskedPhone)}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-500">Email:</span>
                <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 truncate max-w-[150px]">
                  {member.maskedEmail}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-500">City / State:</span>
                <span className="font-bold text-slate-800">
                  {member.city}, {member.state}
                </span>
              </div>
            </div>
          </aside>

          {/* =============================================================== */}
          {/* 2. CENTER PANEL: Candidate Bio, Academic Facts & Core Skills   */}
          {/* =============================================================== */}
          <main className="lg:col-span-6 space-y-6">
            {/* Card 1: About [Name] / Candidate Biography */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#0055FF] bg-blue-50 border border-blue-100">
                  <span>Candidate Biography</span>
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  Member ID: <span className="font-mono">{member.id.slice(-8)}</span>
                </span>
              </div>

              <h2 className="heading-font text-2xl sm:text-3xl font-black text-slate-900">
                About {member.name}
              </h2>

              <p className="text-sm sm:text-base text-slate-700 font-normal leading-relaxed bg-blue-50/30 p-5 rounded-2xl border border-blue-100/70">
                {member.bio}
              </p>
            </div>

            {/* Card 2: Academic & Professional Highlights Grid (4 Key Points) */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-5">
              <h3 className="heading-font text-lg font-black text-slate-900 flex items-center gap-2">
                <FiAward className="w-5 h-5 text-[#0055FF]" />
                <span>Academic & Professional Credentials</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Education */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                    <FiBookOpen className="w-3.5 h-3.5 text-[#0055FF]" />
                    <span>Education / Degree</span>
                  </span>
                  <p className="heading-font text-sm font-bold text-slate-900">
                    {member.education || "Bachelor of Technology"}
                  </p>
                </div>

                {/* 2. College / Institution */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                    <FiShield className="w-3.5 h-3.5 text-[#0055FF]" />
                    <span>College / Institution</span>
                  </span>
                  <p className="heading-font text-sm font-bold text-slate-900">
                    {member.college || "JCRM Engineering"}
                  </p>
                </div>

                {/* 3. Experience Level */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                    <FiBriefcase className="w-3.5 h-3.5 text-[#0055FF]" />
                    <span>Experience Level</span>
                  </span>
                  <p className="heading-font text-sm font-bold text-slate-900">
                    {member.experience || "Fresher / Intern"}
                  </p>
                </div>

                {/* 4. Verification Status */}
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                  <span className="text-[11px] font-extrabold text-emerald-700 uppercase tracking-wider block flex items-center gap-1">
                    <FiCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verification Status</span>
                  </span>
                  <p className="heading-font text-sm font-bold text-emerald-800 flex items-center gap-1">
                    <span>✓ Verified JCRM Intern / Alumni</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3: Technical Skills & Domain Expertise */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-4">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
                Technical Skills & Domain Expertise
              </span>

              <div className="flex flex-wrap gap-2">
                {member.skills && member.skills.length > 0 ? (
                  member.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50/80 text-slate-900 border border-blue-200 text-xs sm:text-sm font-bold shadow-2xs hover:border-[#0055FF] transition-colors"
                    >
                      <span className="text-[#0055FF]">⚡</span>
                      <span>{skill}</span>
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 font-medium">Software Engineering, Full Stack, React</span>
                )}
              </div>
            </div>

            {/* Card 4: Schedule an Interview Callout Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-xl space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#0055FF]/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400">
                    Book Candidate Consultation
                  </span>
                  <h3 className="heading-font text-xl sm:text-2xl font-black">
                    Schedule an interview with {member.name}?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 font-normal">
                    Direct 1-click scheduling sent to JCRM Founder via WhatsApp.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                  <button
                    onClick={() => setIsHireModalOpen(true)}
                    className="flex-1 sm:flex-none px-6 py-3.5 rounded-xl text-sm font-extrabold text-white bg-red-500 hover:bg-red-600 transition-all shadow-lg hover:shadow-red-500/25 cursor-pointer text-center"
                  >
                    Hire Now 🚀
                  </button>
                  <button
                    onClick={handleShareToWhatsApp}
                    className="p-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white transition shadow-sm cursor-pointer"
                    title="Send Inquiry on WhatsApp"
                  >
                    <FaWhatsapp className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Card 5: JCRM Talent Assurance Guarantee */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-3 text-xs text-slate-600">
              <h4 className="heading-font text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <FiShield className="w-4 h-4 text-emerald-600" />
                <span>JCRM Talent Assurance Guarantee</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Technical & project evaluation verified</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Academic credentials authenticated</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Ready for immediate deployment</span>
                </div>
              </div>
            </div>
          </main>

          {/* =============================================================== */}
          {/* 3. RIGHT PANEL: STICKY SPONSORED BANNER & RECOMMENDATIONS       */}
          {/* =============================================================== */}
          <aside className="lg:col-span-3 space-y-5 lg:sticky lg:top-36 self-start">
            {/* SPONSORED AD CARD (Matching other pages) */}
            {sponsoredAd && sponsoredAd.isActive ? (
              <div className="bg-white border border-[#D4E8F8] rounded-2xl shadow-xs p-5 space-y-3.5 relative overflow-hidden group hover:border-[#0055FF]/40 transition-all">
                {/* Header: SPONSORED Badge & Company */}
                <div className="flex items-center justify-between pb-3 border-b border-[#D4E8F8]">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0055FF] border border-[#D4E8F8] text-[10px] font-black tracking-wider uppercase flex items-center gap-1.5">
                    <FiTag className="w-3 h-3 text-[#0055FF]" />
                    <span>{sponsoredAd.badge || "SPONSORED"}</span>
                  </span>
                  {sponsoredAd.company && (
                    <span className="text-[10px] font-bold text-slate-400 truncate max-w-[130px]">
                      {sponsoredAd.company}
                    </span>
                  )}
                </div>

                {/* Banner Image */}
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
                  <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-3">
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
              /* Fallback JCRM Enterprise ERP Card */
              <div className="bg-gradient-to-br from-[#0055FF] via-blue-700 to-indigo-900 rounded-3xl p-5 text-white shadow-lg space-y-4 relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/20 text-white border border-white/20">
                    JCRM Enterprise
                  </span>
                  <span className="text-[10px] font-bold text-white/80">Corporate Hiring</span>
                </div>

                <div>
                  <h3 className="heading-font text-lg font-black leading-tight text-white">
                    AI-Powered ERP & Custom Tech Squads
                  </h3>
                  <p className="text-xs text-white/80 mt-1">
                    Hire pre-trained engineering teams with 0% recruitment fees for partner companies.
                  </p>
                </div>

                <div className="space-y-1.5 text-xs text-white/90 border-t border-white/15 pt-3">
                  <div className="flex items-center gap-2">
                    <FiCheck className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Pre-Vetted Software Engineers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiCheck className="w-3.5 h-3.5 text-emerald-300" />
                    <span>0% Hiring Fee for Partners</span>
                  </div>
                </div>

                <Link
                  href="/erp-solutions"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white text-[#0055FF] hover:bg-blue-50 text-xs font-black shadow-sm transition"
                >
                  <span>Explore Solutions</span>
                  <FiExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {/* Card 2: Other Active Candidates (Recommendations with Mini Controls) */}
            {relatedMembers.length > 0 && currentRelated && (
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Other Candidates
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={prevRelated}
                      className="p-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition cursor-pointer"
                      title="Previous Candidate"
                    >
                      <FiChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={nextRelated}
                      className="p-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition cursor-pointer"
                      title="Next Candidate"
                    >
                      <FiChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-white">
                    <NameAvatar
                      name={currentRelated.name}
                      src={currentRelated.image}
                      alt={currentRelated.name}
                      className="w-full h-full object-cover"
                      textClassName="text-sm font-bold"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {currentRelated.name}
                    </h4>
                    <p className="text-[11px] text-[#0055FF] font-semibold truncate">
                      {currentRelated.role}
                    </p>
                    <span className="text-[10px] text-slate-400 block truncate">
                      {currentRelated.city || "India"}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/ourteam/${currentRelated.id}`}
                  className="w-full py-2 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100/80 text-[#0055FF] text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <span>View Profile</span>
                  <span>→</span>
                </Link>
              </div>
            )}

            {/* Card 3: Need Custom Hiring? WhatsApp Support */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 text-center space-y-2.5">
              <span className="text-xs font-bold text-slate-800 block">
                Looking for Custom Tech Roles?
              </span>
              <p className="text-[11px] text-slate-500 font-medium">
                Talk directly with the JCRM engineering leadership team for bulk hiring or enterprise projects.
              </p>
              <a
                href="https://wa.me/918310531309?text=Hello%20Founder,%20we%20are%20looking%20to%20hire%20custom%20software%20engineering%20talent%20from%20JCRM."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-extrabold shadow-xs transition flex items-center justify-center gap-1.5"
              >
                <FaWhatsapp className="w-3.5 h-3.5" />
                <span>Chat with JCRM</span>
              </a>
            </div>
          </aside>
        </div>
      </div>

      {/* =================================================================== */}
      {/* WHATSAPP SHARE MODAL                                                */}
      {/* =================================================================== */}
      {isShareModalOpen && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsShareModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#25D366]/15 flex items-center justify-center text-[#25D366]">
                  <FaWhatsapp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="heading-font text-base font-black text-slate-900">
                    Share Verified Profile
                  </h3>
                  <p className="text-xs text-slate-500">Send complete candidate profile on WhatsApp</p>
                </div>
              </div>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
              >
                <IoClose className="w-5 h-5" />
              </button>
            </div>

            {/* Preview Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-white">
                <NameAvatar
                  name={member.name}
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  textClassName="text-sm font-bold"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-900 truncate flex items-center gap-1">
                  <span>{member.name}</span>
                  {member.isVerified && <span className="text-emerald-500 text-xs">✓</span>}
                </h4>
                <p className="text-xs text-[#0055FF] font-semibold truncate">{member.role}</p>
                <span className="text-[11px] text-slate-500 truncate block">
                  {member.education || "Engineering"} • {member.city}
                </span>
              </div>
            </div>

            {/* Message Preview Box */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Formatted WhatsApp Message Preview
              </span>
              <pre className="text-[11px] leading-relaxed text-slate-700 bg-slate-100/80 p-3 rounded-xl whitespace-pre-wrap font-sans max-h-36 overflow-y-auto border border-slate-200/60">
                {getShareMessage()}
              </pre>
            </div>

            {/* Modal Actions */}
            <div className="space-y-2 pt-1">
              <button
                onClick={handleShareToWhatsApp}
                className="w-full py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-sm font-extrabold shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <FaWhatsapp className="w-5 h-5" />
                <span>Share to WhatsApp Now</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLink}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copiedLink ? (
                    <>
                      <FiCheck className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-600">Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <FiCopy className="w-4 h-4" />
                      <span>Copy Profile URL</span>
                    </>
                  )}
                </button>

                {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
                  <button
                    onClick={handleNativeShare}
                    className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Share with device apps"
                  >
                    <FiShare2 className="w-4 h-4" />
                    <span className="hidden sm:inline">More</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* HIRE MODAL                                                          */}
      {/* =================================================================== */}
      <HireModal
        isOpen={isHireModalOpen}
        onClose={() => setIsHireModalOpen(false)}
        candidateName={member.name}
        candidateRole={member.role}
      />
    </div>
  );
}
