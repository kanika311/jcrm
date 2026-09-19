"use client";

import { useState } from "react";
import { Workshop } from "@/lib/workshopData";
import CertificatePreview from "./CertificatePreview";
import WorkshopBookingModal from "./WorkshopBookingModal";

export default function WorkshopCatalogClient({ workshops }: { workshops: Workshop[] }) {
  // Default to first workshop domain
  const [activeDomainIndex, setActiveDomainIndex] = useState(0);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);

  const currentWorkshop = workshops[activeDomainIndex] || workshops[0];

  const handlePrevDomain = () => {
    setActiveDomainIndex((prev) => (prev - 1 + workshops.length) % workshops.length);
  };

  const handleNextDomain = () => {
    setActiveDomainIndex((prev) => (prev + 1) % workshops.length);
  };

  // Domain icons map for high visual clarity
  const domainIcons: Record<string, string> = {
    "Generative AI & LLMs": "🤖",
    "Cyber Security & VAPT": "🛡",
    "Cloud & DevOps Engineering": "☁",
    "Data Engineering & Analytics": "📊",
    "Full-Stack & Web Architecture": "💻"
  };

  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-sky-50/20 to-transparent">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#0055FF]/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
   

        {/* CLEAN, RESPONSIVE IN-PAGE WORKSHOP DOMAIN CATALOG NAVBAR */}
        <div className="sticky top-0 z-30 w-full rounded-[24px] bg-white/95 backdrop-blur-2xl border border-blue-100 shadow-[0_10px_35px_rgba(0,85,255,0.12)] p-3 sm:p-4 space-y-3">
          
          {/* Top Bar Info & Prev/Next Toggle Row */}
          <div className="flex items-center justify-between px-2 pb-2 border-b border-blue-100/70">
            

            {/* Prev / Next Cycle Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevDomain}
                className="px-3 py-1.5 rounded-xl bg-blue-50 text-slate-700 hover:bg-[#0055FF] hover:text-white transition-all border border-blue-100 font-extrabold text-xs flex items-center gap-1 cursor-pointer"
                title="Previous Domain"
              >
                ← Prev Domain
              </button>
              <button
                onClick={handleNextDomain}
                className="px-3 py-1.5 rounded-xl bg-blue-50 text-slate-700 hover:bg-[#0055FF] hover:text-white transition-all border border-blue-100 font-extrabold text-xs flex items-center gap-1 cursor-pointer"
                title="Next Domain"
              >
                Next Domain →
              </button>
            </div>
          </div>

          {/* Fully Visible Responsive Domain Tabs Grid / Flex Wrap */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {workshops.map((ws, idx) => {
              const isActive = activeDomainIndex === idx;
              const icon = domainIcons[ws.domain] || "⚡";
              
              return (
                <button
                  key={ws.id}
                  onClick={() => setActiveDomainIndex(idx)}
                  className={`px-4 sm:px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all duration-300 cursor-pointer flex items-center gap-2.5 text-left border ${
                    isActive
                      ? "bg-[#0055FF] text-white border-[#0055FF] shadow-lg shadow-blue-500/25 scale-[1.02]"
                      : "bg-white text-slate-700 hover:text-[#0055FF] hover:bg-blue-50 border-blue-100/90 shadow-xs"
                  }`}
                >
                  <span className="text-base sm:text-lg">{icon}</span>
                  <span className="whitespace-nowrap">{ws.domain}</span>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-white ml-1 shrink-0 animate-pulse"></span>
                  )}
                </button>
              );
            })}
          </div>

        </div>

        {/* ACTIVE WORKSHOP DOMAIN DETAILS CARD */}
        {currentWorkshop && (
          <div className="rounded-[36px] bg-white/85 backdrop-blur-2xl border border-white/90 shadow-[0_12px_45px_rgba(0,85,255,0.12),0_0_35px_rgba(255,255,255,0.9)] overflow-hidden p-8 sm:p-12 space-y-10 animate-fade-in">
            
            {/* 1. Header Banner & Title Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-blue-100 pb-8">
              <div className="lg:col-span-8 space-y-4">
                <div className="flex flex-wrap gap-2.5">
                  <span className="px-3.5 py-1 text-xs font-extrabold rounded-full bg-[#0055FF] text-white shadow-xs">
                    {currentWorkshop.badge}
                  </span>
                  <span className="px-3.5 py-1 text-xs font-extrabold rounded-full bg-blue-50 text-[#0055FF] border border-blue-100">
                    ⏱ {currentWorkshop.duration}
                  </span>
                  <span className="px-3.5 py-1 text-xs font-extrabold rounded-full bg-slate-100 text-slate-700">
                    📍 {currentWorkshop.deliveryMode}
                  </span>
                </div>

                <h2 className="heading-font text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {currentWorkshop.title}
                </h2>

                <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
                  {currentWorkshop.tagline}
                </p>

                <div className="flex items-center gap-2 text-xs font-extrabold text-slate-500 pt-2">
                  <span className="text-[#0055FF]">Target Audience:</span>
                  <span className="text-slate-800">{currentWorkshop.targetAudience}</span>
                </div>
              </div>

              {/* Thumbnail Banner + Book CTA */}
              <div className="lg:col-span-4 flex flex-col items-center space-y-4">
                <div className="w-full h-48 rounded-[24px] overflow-hidden bg-slate-900 relative shadow-xl border border-blue-100 group">
                  <img
                    src={currentWorkshop.bannerImage}
                    alt={currentWorkshop.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-mono font-bold">
                    Domain: {currentWorkshop.domain}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedWorkshop(currentWorkshop)}
                  className="w-full py-4 rounded-2xl text-sm font-extrabold text-white bg-[#0055FF] hover:bg-blue-600 transition-all shadow-xl hover:shadow-blue-500/30 hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
                >
                  Book This Workshop 🚀
                </button>
              </div>
            </div>

            {/* 2. Key Takeaways & Gains Grid */}
            <div>
              <h3 className="heading-font text-xl font-extrabold text-slate-900 mb-4">
                Key Student Takeaways & Workshop Gains
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {currentWorkshop.keyGains.map((gain, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-blue-50/40 border border-blue-100/70 shadow-xs">
                    <div className="w-5 h-5 rounded-full bg-[#0055FF] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-xs">
                      ✓
                    </div>
                    <span className="text-xs font-semibold text-slate-800 leading-snug">{gain}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Hands-On Curriculum Sessions Breakdown */}
            <div className="pt-4 border-t border-blue-100">
              <h3 className="heading-font text-xl font-extrabold text-slate-900 mb-4">
                Step-by-Step Hands-On Curriculum Sessions
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentWorkshop.curriculumHighlights.map((curr, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white border border-blue-100 shadow-xs space-y-2">
                    <span className="text-[11px] font-extrabold text-[#0055FF] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100 inline-block uppercase tracking-wider">
                      {curr.session}
                    </span>
                    <h4 className="heading-font text-base font-extrabold text-slate-900">
                      {curr.title}
                    </h4>
                    <ul className="space-y-1.5 pt-2">
                      {curr.topics.map((top, tIdx) => (
                        <li key={tIdx} className="text-xs text-slate-600 font-medium flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0055FF] shrink-0"></span>
                          <span>{top}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. PROTECTED VERIFIED CERTIFICATE TEMPLATE PREVIEW (NON-EDITABLE & NON-DOWNLOADABLE) */}
            <div className="pt-4 border-t border-blue-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="heading-font text-xl font-extrabold text-slate-900">
                    Verified Participation Certificate Preview
                  </h3>
                  <p className="text-xs font-semibold text-slate-500">
                    Official JCRM Verified Certificate awarded to every participant upon workshop completion.
                  </p>
                </div>

                <span className="text-[11px] font-extrabold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 shrink-0">
                  🔒 Protected Template Preview (Non-Editable)
                </span>
              </div>

              <CertificatePreview
                workshopTitle={currentWorkshop.title}
                certificateCode={currentWorkshop.certificateCode}
                domain={currentWorkshop.domain}
              />
            </div>

            {/* Bottom Booking Action */}
            <div className="pt-6 border-t border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-extrabold text-slate-500 uppercase block">Want to host this workshop at your campus or company?</span>
                <span className="text-sm font-bold text-slate-900">Direct booking lead routed to JCRM Founder via WhatsApp.</span>
              </div>

              <button
                onClick={() => setSelectedWorkshop(currentWorkshop)}
                className="px-8 py-3.5 rounded-2xl text-xs sm:text-sm font-extrabold text-white bg-[#0055FF] hover:bg-blue-600 transition-all shadow-md hover:shadow-blue-500/25 cursor-pointer shrink-0"
              >
                Book {currentWorkshop.domain} Workshop 🚀
              </button>
            </div>

          </div>
        )}

      </div>

      {/* WORKSHOP BOOKING MODAL */}
      <WorkshopBookingModal
        isOpen={!!selectedWorkshop}
        onClose={() => setSelectedWorkshop(null)}
        workshopTitle={selectedWorkshop?.title || ""}
        workshopDomain={selectedWorkshop?.domain || ""}
      />
    </div>
  );
}
