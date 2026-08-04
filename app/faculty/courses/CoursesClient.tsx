"use client";
import { useState } from "react";
import Link from "next/link";

export default function CoursesClient({ cmsData }: { cmsData: any }) {
  const [filter, setFilter] = useState("all");
  const [courses, setCourses] = useState([
    { id: "1", title: "Full-Stack React & TypeScript", status: "published", students: 842, rating: 4.9, revenue: "₹32k" },
    { id: "2", title: "Next.js App Router Masterclass", status: "draft", students: 0, rating: 0, revenue: "₹0" },
    { id: "3", title: "UI/UX for Developers", status: "published", students: 406, rating: 4.7, revenue: "₹16k" },
  ]);

  const togglePublish = (id: string) => {
    setCourses(prev => prev.map(c =>
      c.id === id ? { ...c, status: c.status === "published" ? "draft" : "published" } : c
    ));
  };

  return (
    <div className="space-y-8 pb-20">
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
             <h1 className="heading-font text-3xl font-bold mb-2">{cmsData?.heading || "Course Management"}</h1>
             <p style={{ color: 'var(--text-secondary)' }}>Manage your courses, curriculum, and pricing.</p>
          </div>
          
          <div className="flex p-1 rounded-xl w-full md:w-auto overflow-x-auto no-scrollbar" style={{ background: 'var(--bg-surface)' }}>
             {[
                { id: "all", label: "All Courses" },
                { id: "published", label: "Published" },
                { id: "draft", label: "Drafts" }
             ].map(f => (
                <button
                   key={f.id}
                   onClick={() => setFilter(f.id)}
                   className={`px-4 py-2 text-sm font-bold rounded-lg transition-all shrink-0 ${filter === f.id ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                >
                   {f.label}
                </button>
             ))}
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          
          {/* Create New Card */}
          <Link href="/faculty/create" className="p-6 rounded-[24px] flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed group cursor-pointer transition-colors" style={{ borderColor: 'var(--border-soft)', background: 'var(--bg-card)' }}>
             <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110" style={{ background: 'color-mix(in srgb, var(--accent-primary) 10%, transparent)', color: 'var(--accent-primary)' }}>
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
             </div>
             <h3 className="heading-font text-xl font-bold mb-1 group-hover:text-[var(--accent-primary)] transition-colors">Create New Course</h3>
             <p className="text-sm text-center" style={{ color: 'var(--text-secondary)' }}>Start building a new learning experience.</p>
          </Link>

          {courses.filter(c => filter === 'all' || c.status === filter).map(course => (
             <div key={course.id} className="p-6 rounded-[24px] flex flex-col h-full card-hover" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)' }}>
                <div className="flex justify-between items-start mb-4">
                   {course.status === 'published' ? (
                      <span className="badge-success px-2 py-1 rounded text-xs font-bold">Published</span>
                   ) : (
                      <span className="badge-warning px-2 py-1 rounded text-xs font-bold">Draft</span>
                   )}
                   <button className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/></svg>
                   </button>
                </div>
                
                <h3 className="heading-font text-xl font-bold mb-4 flex-1">{course.title}</h3>
                
                <div className="grid grid-cols-3 gap-2 mb-6 p-4 rounded-xl" style={{ background: 'var(--bg-surface)' }}>
                   <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-tertiary)' }}>Students</div>
                      <div className="font-bold">{course.students}</div>
                   </div>
                   <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-tertiary)' }}>Rating</div>
                      <div className="font-bold flex items-center gap-1">
                         {course.rating > 0 ? course.rating : '-'} 
                         {course.rating > 0 && <span className="text-amber-500 text-xs">★</span>}
                      </div>
                   </div>
                   <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-tertiary)' }}>Revenue</div>
                      <div className="font-bold text-[var(--accent-success)]">{course.revenue}</div>
                   </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-2">
                   <Link href="/faculty/courses/builder" className="btn-primary py-2 rounded-lg text-sm font-bold text-center flex items-center justify-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                      Edit Course
                   </Link>
                   <Link href="/faculty/analytics" className="btn-secondary py-2 rounded-lg text-sm font-bold text-center">Analytics</Link>
                </div>
                <button
                   onClick={() => togglePublish(course.id)}
                   className={`w-full py-2 rounded-lg text-sm font-bold transition-all ${course.status === 'published' ? 'text-amber-500 border border-amber-500/40 hover:bg-amber-500/10' : 'text-emerald-500 border border-emerald-500/40 hover:bg-emerald-500/10'}`}
                >
                   {course.status === 'published' ? '⬇ Unpublish Course' : '🚀 Publish Course'}
                </button>
             </div>
          ))}
       </div>
    </div>
  );
}
