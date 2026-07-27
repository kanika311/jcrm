"use client";

import { useState } from "react";
import Link from "next/link";

export default function CoursesCatalogClient({ cmsData, courses }: { cmsData: any, courses: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Courses");

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.tags.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter =
      activeFilter === "All Courses" ||
      course.level.toLowerCase() === activeFilter.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-sky-50/20 to-transparent">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#0055FF]/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-fade-in-up">
          <div>
            <span className="inline-block px-3.5 py-1 mb-3 text-xs font-extrabold uppercase tracking-widest text-[#0055FF] bg-blue-50/90 rounded-full border border-blue-100/80 shadow-xs">
              INTERNSHIP & TRAINING TRACKS
            </span>
            <h1 className="heading-font text-4xl sm:text-5xl font-extrabold text-slate-900 mb-3 tracking-tight">
              {cmsData?.heading || "Course Catalog & Training Programs"}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 font-medium max-w-xl leading-relaxed">
              {cmsData?.subtitle || "100% placement assisted, hands-on engineering programs built for modern tech careers."}
            </p>
          </div>
          
          <div className="relative w-full md:w-80 shrink-0">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search courses, skills, or tech..." 
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/90 border border-blue-100/90 text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0055FF] shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-3 mb-12 animate-fade-in-up">
          {["All Courses", "Beginner", "Intermediate", "Advanced", "Specialized"].map((filter) => (
            <button 
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-200 cursor-pointer ${
                activeFilter === filter
                  ? "bg-[#0055FF] text-white shadow-md shadow-blue-500/20 scale-105"
                  : "bg-white/80 text-slate-700 hover:text-[#0055FF] hover:bg-blue-50/80 border border-blue-100"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Course Cards Grid - Centered Flex-Wrap for Auto-Adjusting Rows */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-20 bg-white/80 backdrop-blur-xl rounded-[32px] border border-blue-100 p-8 shadow-sm">
            <p className="text-lg font-extrabold text-slate-800 mb-2">No programs found matching "{searchQuery}" in {activeFilter}</p>
            <p className="text-sm font-semibold text-slate-500">Try switching category tabs or clearing your search query.</p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-8">
            {filteredCourses.map((course) => (
              <Link
                href={`/courses/${course.id}`}
                key={course.id}
                className="group block w-full sm:w-[calc(50%-16px)] lg:w-[calc(33.333%-22px)] max-w-[400px] shrink-0"
              >
                <div className="h-full rounded-[32px] bg-white/85 backdrop-blur-2xl border border-white/90 shadow-[0_12px_45px_rgba(0,85,255,0.1),0_0_35px_rgba(255,255,255,0.9)] hover:-translate-y-2 hover:shadow-[0_20px_55px_rgba(0,85,255,0.18)] transition-all duration-300 flex flex-col justify-between overflow-hidden">
                  
                  {/* Top Image Thumbnail Header */}
                  <div className={`h-44 sm:h-48 w-full relative overflow-hidden bg-slate-900`}>
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Dark gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/40 to-black/20 p-5 flex flex-col justify-between">
                      <div className="flex items-center justify-between relative z-10">
                        {course.badge && (
                          <span className="px-3 py-1 text-xs font-extrabold rounded-full bg-white/95 text-[#0055FF] shadow-md">
                            {course.badge}
                          </span>
                        )}
                        <span className="px-3 py-1 text-xs font-extrabold rounded-full bg-black/60 text-white backdrop-blur-md border border-white/20">
                          {course.level}
                        </span>
                      </div>

                      <div className="relative z-10">
                        <h3 className="heading-font text-2xl font-extrabold text-white leading-tight drop-shadow-md group-hover:text-blue-200 transition-colors">
                          {course.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                  
                  {/* Body Content */}
                  <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Instructor & Rating */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-xs font-black text-[#0055FF] shadow-xs">
                            {course.instructor.split(' ').map((n: string) => n[0]).join('')}
                          </div>
                          <span className="text-xs font-bold text-slate-700">{course.instructor}</span>
                        </div>
                        
                        <div className="flex items-center gap-1 text-xs font-black text-amber-500 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                          <span>★</span>
                          <span>{course.rating}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mb-6 line-clamp-3">
                        {course.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {course.tags.map((tag: string, j: number) => (
                          <span
                            key={j}
                            className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50/70 border border-blue-100/80 text-slate-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Price & View Action */}
                    <div className="pt-4 border-t border-blue-100/80 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">TUITION FEE</span>
                        <span className="heading-font text-lg sm:text-xl font-extrabold text-slate-900">{course.price}</span>
                      </div>

                      <span className="px-5 py-2 rounded-full text-xs font-extrabold text-white bg-[#0055FF] group-hover:bg-blue-600 transition-all shadow-md group-hover:scale-105 flex items-center gap-1.5">
                        View Details
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
