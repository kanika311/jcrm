"use client";
import { useState } from "react";
import Link from "next/link";

const SECTIONS = [
  {
    id: "s1",
    title: "1. Core Fundamentals",
    completed: 8,
    total: 8,
    lessons: []
  },
  {
    id: "s4",
    title: "4. Auth & Security",
    completed: 1,
    total: 4,
    lessons: [
      { id: "l1", title: "4.1 Introduction to JWTs", type: "completed" },
      { id: "l2", title: "4.2 Implementing Next.js Middleware", type: "active" },
      { id: "l3", title: "4.3 OAuth with GitHub", type: "upcoming" },
      { id: "l4", title: "4.4 Role-Based Access Control", type: "upcoming" },
    ]
  },
  {
    id: "s5",
    title: "5. Database Design",
    completed: 0,
    total: 12,
    locked: true,
    lessons: []
  }
];

const LESSONS = [
  { id: "l1", title: "4.1 Introduction to JWTs", section: "Module 4: Authentication & Security" },
  { id: "l2", title: "4.2 Implementing Next.js Middleware", section: "Module 4: Authentication & Security" },
  { id: "l3", title: "4.3 OAuth with GitHub", section: "Module 4: Authentication & Security" },
  { id: "l4", title: "4.4 Role-Based Access Control", section: "Module 4: Authentication & Security" },
];

export default function ClassroomPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [currentLessonIndex, setCurrentLessonIndex] = useState(1);
  const [expandedSection, setExpandedSection] = useState("s4");

  const currentLesson = LESSONS[currentLessonIndex];

  const goPrev = () => setCurrentLessonIndex(i => Math.max(0, i - 1));
  const goNext = () => setCurrentLessonIndex(i => Math.min(LESSONS.length - 1, i + 1));

  return (
    <div className="flex flex-col lg:flex-row gap-6 pb-20" style={{ height: 'calc(100vh - 120px)' }}>
       
       {/* Left: Video & Content */}
       <div className="flex-1 flex flex-col min-h-0 space-y-6 overflow-y-auto no-scrollbar">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
             <Link href="/student/courses" className="hover:text-[var(--text-primary)]">My Courses</Link>
             <span>/</span>
             <span>Full-Stack React & TypeScript</span>
             <span>/</span>
             <span style={{ color: 'var(--text-primary)' }}>Module 4</span>
          </div>

          {/* Video Player Area */}
          <div className="w-full aspect-video rounded-[24px] bg-black relative flex items-center justify-center overflow-hidden shadow-2xl group border" style={{ borderColor: 'var(--border-soft)' }}>
             {/* Fake Video Controls */}
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                <div className="flex items-center gap-4 text-txt-primary">
                   <button className="hover:text-[var(--accent-primary)]"><svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg></button>
                   <div className="flex-1 h-1.5 bg-white/30 rounded-full cursor-pointer relative">
                      <div className="absolute top-0 left-0 h-full bg-[var(--accent-primary)] rounded-full w-1/3"></div>
                      <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow" style={{ left: '33%' }}></div>
                   </div>
                   <span className="text-sm font-mono">04:12 / 12:45</span>
                   <button><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg></button>
                </div>
             </div>
             
             {/* Play Button Overlay */}
             <div className="w-20 h-20 rounded-full bg-surf-hover backdrop-blur-md flex items-center justify-center border border-bdr-med text-txt-primary shadow-2xl cursor-pointer hover:scale-110 hover:bg-white/20 transition-all">
                <svg className="w-10 h-10 ml-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
             </div>
          </div>

          {/* Title & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
             <div>
                <h1 className="heading-font text-2xl font-bold mb-1">{currentLesson.title}</h1>
                <p style={{ color: 'var(--text-secondary)' }}>{currentLesson.section}</p>
             </div>
             <div className="flex gap-2 shrink-0">
                <button 
                  onClick={goPrev}
                  disabled={currentLessonIndex === 0}
                  className={`btn-secondary px-4 py-2 rounded-lg text-sm flex items-center gap-2 ${currentLessonIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
                   Prev
                </button>
                <button 
                  onClick={goNext}
                  disabled={currentLessonIndex === LESSONS.length - 1}
                  className={`btn-primary px-4 py-2 rounded-lg text-sm flex items-center gap-2 ${currentLessonIndex === LESSONS.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                   Next
                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                </button>
             </div>
          </div>

          {/* Tabs */}
          <div className="border-b flex gap-8 pt-4" style={{ borderColor: 'var(--border-soft)' }}>
             {['overview', 'notes', 'resources', 'q&a'].map(tab => (
                <button 
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={`pb-3 font-semibold text-sm capitalize relative transition-colors ${activeTab === tab ? 'text-[var(--accent-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                >
                   {tab}
                   {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent-primary)]"></div>}
                </button>
             ))}
          </div>

          {/* Tab Content */}
          <div className="py-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
             {activeTab === 'overview' && (
                <div className="space-y-4">
                   <p>In this lesson, we implement route protection. You will learn how to intercept requests, verify JWT tokens on the edge, and redirect unauthenticated users before rendering the page.</p>
                   <h3 className="font-bold text-lg mt-6 text-[var(--text-primary)]">Key Concepts:</h3>
                   <ul className="list-disc pl-5 space-y-2">
                      <li>Edge computing constraints in Next.js Middleware</li>
                      <li>Verifying JWTs using jose (since jsonwebtoken is Node-only)</li>
                      <li>Pattern matching paths with NextRequest</li>
                   </ul>
                </div>
             )}
             {activeTab === 'notes' && (
                <div className="p-4 rounded-xl" style={{ background: 'var(--bg-surface)' }}>
                   <textarea className="w-full bg-transparent resize-none focus:outline-none" rows={10} placeholder="Take your notes here... They will automatically sync to your profile."></textarea>
                </div>
             )}
             {activeTab === 'resources' && (
                <div className="p-4 rounded-xl space-y-4" style={{ background: 'var(--bg-surface)' }}>
                   <a href="#" className="flex items-center gap-3 text-[var(--accent-primary)] hover:underline"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> Starter Code (.zip)</a>
                </div>
             )}
             {activeTab === 'q&a' && (
                <div className="p-4 rounded-xl text-center" style={{ background: 'var(--bg-surface)' }}>
                   No questions yet. Be the first to ask!
                </div>
             )}
          </div>
       </div>

       {/* Right: Sidebar Syllabus */}
       <div className="w-full lg:w-96 shrink-0 flex flex-col min-h-0 rounded-[24px] border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
          <div className="p-6 border-b" style={{ borderColor: 'var(--border-soft)' }}>
             <h3 className="font-bold mb-2">Course Progress</h3>
             <div className="flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full bg-black/5 dark:bg-surf-elevated overflow-hidden">
                   <div className="h-full bg-[var(--accent-primary)] rounded-full" style={{ width: '68%' }}></div>
                </div>
                <span className="text-xs font-bold">68%</span>
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto no-scrollbar p-2">
             {SECTIONS.map((section) => (
               <div key={section.id} className={`mb-2 ${section.locked ? 'opacity-50 pointer-events-none' : ''}`}>
                 <div 
                   onClick={() => !section.locked && setExpandedSection(expandedSection === section.id ? "" : section.id)}
                   className={`px-4 py-3 flex justify-between items-center cursor-pointer rounded-lg ${expandedSection === section.id ? 'bg-black/5 dark:bg-surf-elevated' : 'hover:bg-black/5 dark:hover:bg-surf-elevated'}`}
                 >
                    <div className="flex items-center gap-2">
                       {section.locked && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>}
                       <span className="font-bold text-sm text-[var(--text-primary)]">{section.title}</span>
                    </div>
                    <span className="text-xs font-semibold text-[var(--text-tertiary)]">{section.completed}/{section.total}</span>
                 </div>
                 
                 {expandedSection === section.id && section.lessons.length > 0 && (
                   <div className="py-2 pl-2 border-l-2 ml-4 mt-2 space-y-1" style={{ borderColor: 'var(--border-soft)' }}>
                      {section.lessons.map((lesson, j) => {
                         const isCurrentlyActive = LESSONS[currentLessonIndex].id === lesson.id;
                         return (
                           <div 
                             key={lesson.id} 
                             onClick={() => {
                               const idx = LESSONS.findIndex(l => l.id === lesson.id);
                               if(idx !== -1) setCurrentLessonIndex(idx);
                             }}
                             className={`flex items-start gap-3 p-2 rounded-lg cursor-pointer text-sm ${
                               isCurrentlyActive 
                               ? 'font-semibold text-[var(--accent-primary)] bg-[var(--accent-primary)]/10' 
                               : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                             }`}
                           >
                              {lesson.type === 'completed' ? (
                                <svg className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                              ) : isCurrentlyActive ? (
                                <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                              ) : (
                                <svg className="w-4 h-4 shrink-0 mt-0.5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                              )}
                              <span>{lesson.title}</span>
                           </div>
                         );
                      })}
                   </div>
                 )}
               </div>
             ))}
          </div>
       </div>
    </div>
  );
}