"use client";
import { useState } from "react";

export default function SubmissionsClient({ cmsData }: { cmsData: any }) {
  const [filter, setFilter] = useState("pending");

  const submissions = [
    { id: 1, title: "E-commerce API Integration", student: "Sanskar G", course: "Full-Stack React", time: "2 hours ago", status: "pending" },
    { id: 2, title: "Database Architecture", student: "Alice Smith", course: "System Design", time: "5 hours ago", status: "pending" },
    { id: 3, title: "Authentication Flow", student: "Bob Johnson", course: "Full-Stack React", time: "1 day ago", status: "graded", score: "95/100" },
  ];

  const filteredSubmissions = filter === "all" ? submissions : submissions.filter(s => s.status === filter);

  return (
    <div className="space-y-8 pb-20">
       <div className="flex justify-between items-end">
          <div>
             <h1 className="heading-font text-3xl font-bold mb-2">{cmsData?.heading || "Student Submissions"}</h1>
             <p style={{ color: 'var(--text-secondary)' }}>{cmsData?.gradingPolicy || "Review and grade assignments."}</p>
          </div>
          
          <div className="flex p-1 rounded-xl" style={{ background: 'var(--bg-surface)' }}>
             <button onClick={() => setFilter("pending")} className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${filter === "pending" ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-secondary)]'}`}>Needs Grading</button>
             <button onClick={() => setFilter("graded")} className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${filter === "graded" ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-secondary)]'}`}>Graded</button>
          </div>
       </div>

       <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-4">
             {filteredSubmissions.length === 0 && (
                <div className="text-center py-10" style={{ color: 'var(--text-secondary)' }}>No submissions found for this filter.</div>
             )}
             {filteredSubmissions.map(sub => (
                <div key={sub.id} className="p-6 rounded-[24px] flex flex-col md:flex-row md:items-center justify-between gap-4 card-hover" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)' }}>
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg bg-black/5 dark:bg-surf-elevated">
                         #
                      </div>
                      <div>
                         <h3 className="font-bold">{sub.title}</h3>
                         <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Submitted by {sub.student} • {sub.course}</div>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <span className="text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>{sub.time}</span>
                      {sub.status === 'pending' ? (
                        <button className="btn-primary px-4 py-2 rounded-lg text-sm font-bold">Grade</button>
                      ) : (
                        <span className="px-4 py-2 rounded-lg text-sm font-bold bg-black/5 dark:bg-surf-elevated">{sub.score}</span>
                      )}
                   </div>
                </div>
             ))}
          </div>
       </div>
    </div>
  );
}