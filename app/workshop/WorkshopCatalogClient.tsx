"use client";

import { useState, useEffect } from "react";
import { Workshop } from "@/lib/workshopData";
import { DEFAULT_SPONSORED_AD, SponsoredAd } from "@/lib/sponsoredAd";
import CertificatePreview from "./CertificatePreview";
import WorkshopBookingModal from "./WorkshopBookingModal";
import SponsoredAdModal from "@/components/SponsoredAdModal";
import {
  FiSearch,
  FiSliders,
  FiX,
  FiExternalLink,
  FiEdit,
  FiCheck,
  FiCalendar,
  FiMapPin,
  FiUsers,
  FiAward,
  FiCpu,
  FiShield,
  FiCloud,
  FiBarChart2,
  FiCode,
  FiBookOpen,
  FiCheckCircle,
  FiLayers,
  FiLock,
  FiTag,
  FiTerminal,
  FiArrowRight,
} from "react-icons/fi";

export default function WorkshopCatalogClient({
  workshops,
  initialSponsoredAd = DEFAULT_SPONSORED_AD,
  isAdmin = false,
}: {
  workshops: Workshop[];
  initialSponsoredAd?: SponsoredAd;
  isAdmin?: boolean;
}) {
  const [activeWorkshopIndex, setActiveWorkshopIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookingWorkshop, setBookingWorkshop] = useState<Workshop | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sponsored Ad State
  const [sponsoredAd, setSponsoredAd] = useState<SponsoredAd>(initialSponsoredAd);
  const [isSponsoredModalOpen, setIsSponsoredModalOpen] = useState(false);

  // Lock body scroll when mobile filter is open
  useEffect(() => {
    if (mobileFilterOpen) {
      const orig = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = orig;
      };
    }
  }, [mobileFilterOpen]);

  // Clean React Icon helper for workshop domain tracks
  const getDomainIcon = (domain: string, isSelected: boolean) => {
    const iconClass = "w-5 h-5 shrink-0";
    switch (domain) {
      case "Generative AI & LLMs":
        return <FiCpu className={`${iconClass} ${isSelected ? "text-white" : "text-indigo-600"}`} />;
      case "Cyber Security & VAPT":
        return <FiShield className={`${iconClass} ${isSelected ? "text-white" : "text-emerald-600"}`} />;
      case "Cloud & DevOps Engineering":
        return <FiCloud className={`${iconClass} ${isSelected ? "text-white" : "text-sky-600"}`} />;
      case "Data Engineering & Analytics":
        return <FiBarChart2 className={`${iconClass} ${isSelected ? "text-white" : "text-amber-600"}`} />;
      case "Full-Stack & Web Architecture":
        return <FiCode className={`${iconClass} ${isSelected ? "text-white" : "text-blue-600"}`} />;
      default:
        return <FiTerminal className={`${iconClass} ${isSelected ? "text-white" : "text-[#0055FF]"}`} />;
    }
  };

  // Filtered workshops based on search query
  const filteredWorkshops = workshops.filter(ws => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      ws.title.toLowerCase().includes(q) ||
      ws.domain.toLowerCase().includes(q) ||
      ws.tagline.toLowerCase().includes(q) ||
      ws.targetAudience.toLowerCase().includes(q) ||
      ws.keyGains.some(g => g.toLowerCase().includes(q))
    );
  });

  const currentWorkshop = workshops[activeWorkshopIndex] || workshops[0];

  // Topic list content (reusable for desktop aside and mobile drawer)
  const renderTopicsList = (isMobile: boolean = false) => (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#D4E8F8]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-[#D4E8F8] flex items-center justify-center text-[#0055FF]">
            <FiBookOpen className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
            Workshop Topics
          </h3>
        </div>
        <span className="text-[11px] font-black text-[#0055FF] bg-blue-50 px-2 py-0.5 rounded-md border border-[#D4E8F8]">
          {workshops.length} Tracks
        </span>
      </div>

      {/* Search Box */}
      <div className="relative">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search topic or domain..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-900 placeholder-slate-400 text-xs font-semibold rounded-xl pl-10 pr-3.5 py-2.5 border border-[#D4E8F8] focus:outline-none focus:border-[#0055FF] focus:ring-2 focus:ring-[#0055FF]/10 transition"
        />
      </div>

      {/* Topics List */}
      <div className={`space-y-2 ${isMobile ? "max-h-[calc(100vh-280px)]" : "max-h-[460px]"} overflow-y-auto pr-1`}>
        {filteredWorkshops.map(ws => {
          const originalIndex = workshops.findIndex(w => w.id === ws.id);
          const isSelected = activeWorkshopIndex === originalIndex;

          return (
            <button
              key={ws.id}
              onClick={() => {
                setActiveWorkshopIndex(originalIndex);
                if (isMobile) setMobileFilterOpen(false);
              }}
              className={`w-full text-left p-3.5 rounded-xl transition-all duration-200 cursor-pointer flex items-start gap-3 border ${
                isSelected
                  ? "bg-[#0055FF] text-white border-[#0055FF] shadow-md shadow-blue-500/20 scale-[1.01]"
                  : "bg-white text-slate-800 hover:bg-blue-50/80 hover:text-[#0055FF] border-[#D4E8F8]/80 shadow-2xs"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors mt-0.5 ${
                  isSelected
                    ? "bg-white/20 text-white"
                    : "bg-blue-50 border border-[#D4E8F8]"
                }`}
              >
                {getDomainIcon(ws.domain, isSelected)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider ${
                      isSelected ? "text-blue-100" : "text-[#0055FF]"
                    }`}
                  >
                    {ws.domain}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold shrink-0 ${
                      isSelected ? "text-white/80" : "text-slate-400"
                    }`}
                  >
                    2 Days
                  </span>
                </div>
                <h4
                  className={`text-xs font-black leading-snug line-clamp-2 ${
                    isSelected ? "text-white" : "text-slate-900"
                  }`}
                >
                  {ws.title}
                </h4>
              </div>
            </button>
          );
        })}

        {filteredWorkshops.length === 0 && (
          <div className="p-6 text-center text-xs font-semibold text-slate-500 bg-slate-50 rounded-xl">
            No workshops match &quot;{searchQuery}&quot;.
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="pt-16 sm:pt-20 min-h-screen bg-gradient-to-b from-blue-50/50 via-sky-50/20 to-transparent font-sans">
      <div className="lg:h-[calc(100dvh-5rem)] lg:overflow-hidden bg-gradient-to-b from-blue-50/50 via-sky-50/20 to-transparent">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:h-full lg:min-h-0 space-y-6 lg:space-y-4">

        {/* Short Screen Filter Bar (Sirf Icon Button on Left) */}
        <div className="lg:hidden flex items-center justify-between gap-3 bg-white border border-[#D4E8F8] rounded-2xl p-3 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="w-10 h-10 rounded-xl bg-[#0055FF] hover:bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 transition cursor-pointer shrink-0"
              title="Filter & Topics"
              aria-label="Filter & Topics"
            >
              <FiSliders className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#0055FF] block">
                {currentWorkshop.domain}
              </span>
              <span className="text-xs font-black text-slate-900 line-clamp-1">
                {currentWorkshop.title}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setBookingWorkshop(currentWorkshop)}
            className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-[#D4E8F8] text-[#0055FF] text-xs font-bold transition shrink-0 cursor-pointer"
          >
            Host Workshop
          </button>
        </div>

        {/* 3-PANEL MASTER GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start lg:h-full lg:min-h-0">
          
          <aside className="hidden lg:flex lg:flex-col lg:col-span-3 lg:h-full lg:min-h-0 lg:overflow-hidden space-y-4">
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain bg-white border border-[#D4E8F8] rounded-2xl shadow-xs p-4 sm:p-5">
              {renderTopicsList(false)}
            </div>

            {/* Quick College Coordinator Assistance */}
            <div className="bg-gradient-to-br from-blue-50 to-white border border-[#D4E8F8] rounded-2xl p-4 shadow-xs text-center space-y-2">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-[#D4E8F8] flex items-center justify-center text-[#0055FF] mx-auto shadow-2xs">
                <FiAward className="w-5 h-5" />
              </div>
              <h5 className="text-xs font-black text-slate-900">
                Are you a University Coordinator?
              </h5>
              <p className="text-[11px] font-medium text-slate-600 leading-relaxed">
                Custom dates, syllabus adjustments, and corporate mentor assignment available on request.
              </p>
              <a
                href="https://wa.me/918310531309?text=Hello%20Founder,%20we%20want%20to%20discuss%20hosting%20a%20technical%20workshop%20at%20our%20university%20campus."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-white border border-[#0055FF] text-[#0055FF] hover:bg-blue-50 text-xs font-bold transition shadow-2xs"
              >
                <span>WhatsApp Coordinator</span>
              </a>
            </div>
          </aside>

          {/* ====================================================================== */}
          {/* 2. CENTER PANEL: SELECTED WORKSHOP CONTENT                             */}
          {/* ====================================================================== */}
          <main className="lg:col-span-6 space-y-6 min-h-0 lg:h-full lg:overflow-y-scroll lg:overscroll-contain lg:pr-1 pb-24 lg:pb-16">
            {currentWorkshop ? (
              <div className="space-y-6 animate-fade-in">
                
                {/* Main Workshop Overview Card */}
                <div className="bg-white border border-[#D4E8F8] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
                  {/* Badges row */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 text-xs font-black rounded-lg bg-[#0055FF] text-white shadow-2xs">
                      {currentWorkshop.badge}
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-lg bg-blue-50 text-[#0055FF] border border-[#D4E8F8]">
                      <FiCalendar className="w-3.5 h-3.5" />
                      {currentWorkshop.duration}
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-lg bg-slate-100 text-slate-700">
                      <FiMapPin className="w-3.5 h-3.5" />
                      {currentWorkshop.deliveryMode}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                      {currentWorkshop.title}
                    </h2>
                    <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
                      {currentWorkshop.tagline}
                    </p>
                  </div>

                  {/* Hero Thumbnail Banner */}
                  <div className="w-full h-56 sm:h-64 rounded-2xl overflow-hidden bg-slate-900 relative shadow-md border border-[#D4E8F8] group">
                    <img
                      src={currentWorkshop.bannerImage}
                      alt={currentWorkshop.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent"></div>
                    <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between text-white">
                      <span className="text-xs font-mono font-bold bg-white/20 backdrop-blur-md px-3 py-1 rounded-md">
                        Track: {currentWorkshop.domain}
                      </span>
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        Booking Open
                      </span>
                    </div>
                  </div>

                  {/* Target Audience & Booking CTA */}
                  <div className="p-4 rounded-xl bg-blue-50/50 border border-[#D4E8F8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-xs font-bold text-slate-700">
                      <span className="text-[#0055FF] font-black uppercase tracking-wider block text-[10px] mb-0.5">
                        Target Audience
                      </span>
                      <span className="flex items-center gap-1.5 text-slate-900">
                        <FiUsers className="w-3.5 h-3.5 text-[#0055FF]" />
                        {currentWorkshop.targetAudience}
                      </span>
                    </div>

                    <button
                      onClick={() => setBookingWorkshop(currentWorkshop)}
                      className="px-6 py-3 rounded-xl text-xs sm:text-sm font-black text-white bg-[#0055FF] hover:bg-blue-600 transition-all shadow-md shadow-blue-500/25 cursor-pointer shrink-0"
                    >
                      Book This Workshop
                    </button>
                  </div>
                </div>

                {/* Key Student Takeaways & Gains Card */}
                <div className="bg-white border border-[#D4E8F8] rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#D4E8F8]">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 border border-[#D4E8F8] flex items-center justify-center text-[#0055FF]">
                      <FiCheckCircle className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-black text-slate-900">
                      Key Student Takeaways &amp; Workshop Gains
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentWorkshop.keyGains.map((gain, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-50/40 border border-[#D4E8F8]/80 text-xs font-bold text-slate-800 leading-snug"
                      >
                        <div className="w-4 h-4 rounded-full bg-[#0055FF] text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                          ✓
                        </div>
                        <span>{gain}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hands-On Curriculum Sessions Breakdown */}
                <div className="bg-white border border-[#D4E8F8] rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#D4E8F8]">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 border border-[#D4E8F8] flex items-center justify-center text-[#0055FF]">
                      <FiLayers className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-black text-slate-900">
                      Step-by-Step Hands-On Curriculum Sessions
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {currentWorkshop.curriculumHighlights.map((curr, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-white border border-[#D4E8F8] shadow-2xs space-y-2"
                      >
                        <span className="text-[10px] font-black text-[#0055FF] bg-blue-50 px-2 py-0.5 rounded-md border border-[#D4E8F8] inline-block uppercase tracking-wider">
                          {curr.session}
                        </span>
                        <h4 className="text-sm font-black text-slate-900">
                          {curr.title}
                        </h4>
                        <ul className="space-y-1.5 pt-1">
                          {curr.topics.map((top, tIdx) => (
                            <li
                              key={tIdx}
                              className="text-xs text-slate-600 font-medium flex items-center gap-2"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-[#0055FF] shrink-0"></span>
                              <span>{top}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Verified Certificate Template Preview */}
                <div className="bg-white border border-[#D4E8F8] rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#D4E8F8]">
                    <div>
                      <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                        <FiAward className="w-5 h-5 text-[#0055FF]" />
                        Verified Participation Certificate
                      </h3>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5">
                        Awarded to each participant upon successful hands-on project completion.
                      </p>
                    </div>

                    <span className="text-[10px] font-black text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200 shrink-0 self-start sm:self-auto flex items-center gap-1.5">
                      <FiLock className="w-3 h-3 text-amber-700" />
                      <span>Official Template</span>
                    </span>
                  </div>

                  <CertificatePreview
                    workshopTitle={currentWorkshop.title}
                    certificateCode={currentWorkshop.certificateCode}
                    domain={currentWorkshop.domain}
                  />
                </div>

                {/* Bottom Booking Action Card */}
                <div className="p-6 rounded-2xl bg-[#0055FF] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-blue-500/25">
                  <div className="space-y-1 text-center sm:text-left">
                    <span className="text-[11px] font-black uppercase tracking-wider text-blue-100 block">
                      Ready to host on campus?
                    </span>
                    <h4 className="text-lg font-black text-white">
                      Book {currentWorkshop.domain} Masterclass
                    </h4>
                  </div>

                  <button
                    onClick={() => setBookingWorkshop(currentWorkshop)}
                    className="px-6 py-3 rounded-xl bg-white text-[#0055FF] hover:bg-blue-50 text-xs font-black shadow-md transition-all cursor-pointer shrink-0"
                  >
                    Request Booking Slot
                  </button>
                </div>

              </div>
            ) : (
              <div className="p-12 text-center text-slate-500 font-bold bg-white rounded-2xl border border-[#D4E8F8]">
                Please select a workshop from the left panel.
              </div>
            )}
          </main>

          {/* ====================================================================== */}
          {/* 3. RIGHT PANEL: SPONSORED BANNER (STICKY SIDEBAR)                      */}
          {/* ====================================================================== */}
          <aside className="lg:col-span-3 lg:h-full lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain space-y-4">
            {sponsoredAd && sponsoredAd.isActive ? (
              <div className="bg-white border border-[#D4E8F8] rounded-2xl shadow-xs p-5 space-y-4 relative group">
                {/* Header: Only Sponsored badge */}
                <div className="flex items-center justify-start pb-2.5 border-b border-[#D4E8F8]">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-[#0055FF] border border-[#D4E8F8] flex items-center gap-1.5">
                    <FiTag className="w-3 h-3 text-[#0055FF]" />
                    <span>SPONSORED</span>
                  </span>
                </div>

                {/* Hero Graphic */}
                {sponsoredAd.image && (
                  <div className="w-full h-36 rounded-xl overflow-hidden bg-slate-100 border border-[#D4E8F8] relative">
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
                    className="w-full py-2.5 rounded-xl bg-[#0055FF] hover:bg-blue-600 text-white text-xs font-black shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{sponsoredAd.ctaText || "Book Your Consultation"}</span>
                    <FiExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ) : null}
          </aside>

        </div>
      </div>
      </div>

      {/* ====================================================================== */}
      {/* 4. MOBILE SLIDE-OUT TOPICS / FILTER DRAWER (OPENS FROM LEFT)           */}
      {/* ====================================================================== */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-[9999] lg:hidden flex justify-start">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMobileFilterOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Pinned strictly to LEFT */}
          <aside className="relative w-[min(340px,88vw)] max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between z-50 animate-drawer-left border-r border-[#D4E8F8]">
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-[#D4E8F8] flex items-center justify-between bg-blue-50/60 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-[#D4E8F8] flex items-center justify-center text-[#0055FF] shadow-2xs">
                  <FiSliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Workshop Topics
                  </h3>
                  <p className="text-[10px] font-bold text-slate-500">
                    {workshops.length} Available Tracks
                  </p>
                </div>
              </div>

              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-8 h-8 rounded-xl bg-white border border-[#D4E8F8] flex items-center justify-center text-slate-500 hover:text-slate-900 shadow-2xs cursor-pointer transition-colors"
                title="Close"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-4 sm:p-5 overflow-y-auto flex-1 overscroll-contain">
              {renderTopicsList(true)}

              <div className="bg-gradient-to-br from-blue-50 to-white border border-[#D4E8F8] rounded-2xl p-4 shadow-xs text-center space-y-2 mt-5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-[#D4E8F8] flex items-center justify-center text-[#0055FF] mx-auto shadow-2xs">
                  <FiAward className="w-5 h-5" />
                </div>
                <h5 className="text-xs font-black text-slate-900">
                  University Coordinator?
                </h5>
                <p className="text-[11px] font-medium text-slate-600 leading-relaxed">
                  Custom dates and syllabus adjustments available on request.
                </p>
                <a
                  href="https://wa.me/918310531309?text=Hello%20Founder,%20we%20want%20to%20discuss%20hosting%20a%20technical%20workshop%20at%20our%20university%20campus."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-white border border-[#0055FF] text-[#0055FF] hover:bg-blue-50 text-xs font-bold transition shadow-2xs"
                >
                  <span>WhatsApp Coordinator</span>
                </a>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* WORKSHOP BOOKING MODAL */}
      <WorkshopBookingModal
        isOpen={!!bookingWorkshop}
        onClose={() => setBookingWorkshop(null)}
        workshopTitle={bookingWorkshop?.title || ""}
        workshopDomain={bookingWorkshop?.domain || ""}
      />
    </div>
  );
}
