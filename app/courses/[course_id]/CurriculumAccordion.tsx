"use client";

import { useState } from "react";

export default function CurriculumAccordion({ initialSections }: { initialSections: any[] }) {
  const [sections, setSections] = useState(initialSections);

  const toggleSection = (index: number) => {
    setSections(sections.map((s, i) => i === index ? { ...s, expanded: !s.expanded } : s));
  };

  return (
    <div className="border border-blue-100 rounded-3xl overflow-hidden bg-white/90 shadow-sm">
      {sections.map((section, i) => (
        <div key={i} className="border-b border-blue-100/80 last:border-b-0">
          
          {/* Module Header Bar */}
          <div 
            className="px-6 py-5 flex items-center justify-between cursor-pointer hover:bg-blue-50/50 transition-colors"
            onClick={() => toggleSection(i)}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 text-[#0055FF] flex items-center justify-center font-extrabold text-sm shrink-0 shadow-xs">
                {i + 1}
              </div>
              <h3 className="heading-font font-extrabold text-slate-900 text-base sm:text-lg">
                {section.title}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-[#0055FF] border border-blue-100/80">
                Syllabus Topics
              </span>
              <div className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 transition-transform duration-300 ${section.expanded ? 'rotate-180 bg-blue-50 text-[#0055FF]' : ''}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Syllabus Topics Content List */}
          {section.expanded && (
            <div className="px-6 py-5 bg-gradient-to-b from-blue-50/30 to-white border-t border-blue-100/60">
              <p className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-4">
                KEY CONCEPTS & SYLLABUS TOPICS COVERED:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(section.topics || [
                  "Core Principles & Fundamental Concepts",
                  "Industry-Standard Architecture & Implementation",
                  "Hands-on Practical Assignments & Code Reviews",
                  "Enterprise Integration & Production Best Practices"
                ]).map((topic: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-blue-100/80 shadow-xs">
                    <div className="w-5 h-5 rounded-full bg-[#0055FF] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-xs">
                      ✓
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
                      {topic}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
