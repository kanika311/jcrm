"use client";
import { useState } from "react";
import Link from "next/link";

export default function CourseBuilderPage() {
  const [activeSection, setActiveSection] = useState(1);
  const [activeLesson, setActiveLesson] = useState(2);

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
       {/* Header */}
       <div className="flex items-center justify-between pb-6 border-b mb-6" style={{ borderColor: 'var(--border-soft)' }}>
          <div>
             <div className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                <Link href="/faculty/courses" className="hover:text-[var(--text-primary)]">My Courses</Link>
                <span>/</span>
                <span style={{ color: 'var(--text-primary)' }}>Full-Stack React & TypeScript</span>
             </div>
             <h1 className="heading-font text-2xl font-bold">Course Builder</h1>
          </div>
          <div className="flex gap-3">
             <button className="btn-secondary px-4 py-2 rounded-lg text-sm font-bold">Save Draft</button>
             <button className="btn-primary px-4 py-2 rounded-lg text-sm font-bold">Publish Changes</button>
          </div>
       </div>

       <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
          
          {/* Sidebar: Curriculum Tree */}
          <div className="w-full lg:w-80 flex flex-col min-h-0 rounded-[24px]" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)' }}>
             <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: 'var(--border-soft)' }}>
                <h3 className="font-bold">Curriculum</h3>
                <button className="text-[var(--accent-primary)] hover:underline text-sm font-bold">+ Add Section</button>
             </div>
             
             <div className="flex-1 overflow-y-auto p-2">
                {[1, 2, 3, 4].map(section => (
                   <div key={section} className="mb-2">
                      <div className="px-3 py-2 flex justify-between items-center cursor-pointer rounded-lg hover:bg-black/5 dark:hover:bg-surf-elevated" onClick={() => setActiveSection(section)}>
                         <span className="font-bold text-sm">Section {section}</span>
                         <svg className="w-4 h-4 transition-transform" style={{ transform: activeSection === section ? 'rotate(180deg)' : '' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                      </div>
                      
                      {activeSection === section && (
                         <div className="py-2 pl-2 border-l-2 ml-3 mt-1 space-y-1" style={{ borderColor: 'var(--border-soft)' }}>
                            {[1, 2, 3].map(lesson => (
                               <div 
                                  key={lesson} 
                                  onClick={() => setActiveLesson(lesson)}
                                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer text-sm ${activeLesson === lesson ? 'font-semibold text-[var(--accent-primary)] bg-[var(--accent-primary)]/10' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                               >
                                  <div className="flex items-center gap-2">
                                     <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                     <span>Lesson {section}.{lesson}</span>
                                  </div>
                                  <button className="opacity-0 hover:opacity-100 p-1"><svg className="w-3 h-3 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                               </div>
                            ))}
                            <button className="text-xs font-bold w-full text-left p-2 mt-1 rounded text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-surf-elevated">+ Add Lesson</button>
                         </div>
                      )}
                   </div>
                ))}
             </div>
          </div>

          {/* Main Editor */}
          <div className="flex-1 flex flex-col min-h-0 rounded-[24px]" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)' }}>
             <div className="p-6 border-b" style={{ borderColor: 'var(--border-soft)' }}>
                <input type="text" defaultValue="Implementing Next.js Middleware" className="text-2xl font-bold bg-transparent border-none focus:outline-none w-full" />
             </div>
             
             <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                   <label className="block text-sm font-medium mb-2">Content Type</label>
                   <div className="flex p-1 rounded-xl w-max" style={{ background: 'var(--bg-surface)' }}>
                      <button className="px-4 py-2 text-sm font-bold rounded-lg bg-[var(--bg-card)] shadow-sm">Video</button>
                      <button className="px-4 py-2 text-sm font-bold rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)]">Article</button>
                      <button className="px-4 py-2 text-sm font-bold rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)]">Quiz</button>
                   </div>
                </div>

                <div>
                   <label className="block text-sm font-medium mb-2">Video URL (Mux, YouTube, Vimeo)</label>
                   <input type="url" className="input-premium w-full px-4 py-3 rounded-xl" defaultValue="https://mux.com/v/123456789" />
                </div>
                
                {/* Fake Video Preview */}
                <div className="w-full aspect-video rounded-xl bg-black relative flex items-center justify-center border" style={{ borderColor: 'var(--border-soft)' }}>
                   <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-txt-primary">
                      <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                   </div>
                </div>

                <div>
                   <label className="block text-sm font-medium mb-2">Lesson Notes (Markdown)</label>
                   <textarea className="input-premium w-full px-4 py-3 rounded-xl font-mono text-sm" rows={10} defaultValue="In this lesson, we implement route protection..."></textarea>
                </div>
             </div>
          </div>

       </div>
    </div>
  );
}