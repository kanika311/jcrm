"use client";
import { useState } from "react";

export default function AssignmentsClient({ cmsData }: { cmsData: any }) {
  const [filter, setFilter] = useState("all");

  const assignments = [
    { id: 1, title: "E-commerce API", course: "Full-Stack React", status: "pending", dueDate: "Due in 2 days", urgency: "danger", progress: 20 },
    { id: 2, title: "Dockerize Application", course: "System Design", status: "pending", dueDate: "Due in 5 days", urgency: "warning", progress: 0 },
    { id: 3, title: "Authentication Flow UI", course: "UI/UX Foundations", status: "submitted", dueDate: "Submitted 1 day ago", urgency: "neutral", progress: 100 },
    { id: 4, title: "Database Schema Design", course: "System Design", status: "graded", dueDate: "Graded", grade: "98/100", urgency: "success", progress: 100 },
  ];

  const filtered = filter === "all" ? assignments : assignments.filter(a => a.status === filter);

  return (
    <div className="space-y-8 pb-20">
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
             <h1 className="heading-font text-3xl font-bold mb-2">{cmsData?.heading || "Assignments"}</h1>
             <p style={{ color: 'var(--text-secondary)' }}>Manage your projects and submissions.</p>
          </div>
          
          <div className="flex p-1 rounded-xl w-full md:w-auto overflow-x-auto no-scrollbar" style={{ background: 'var(--bg-surface)' }}>
             {[
                { id: "all", label: "All" },
                { id: "pending", label: "Due Soon" },
                { id: "submitted", label: "Submitted" },
                { id: "graded", label: "Graded" }
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

       {/* Kanban / Grid Layout */}
       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map(assignment => (
             <div key={assignment.id} className="p-6 rounded-[24px] flex flex-col h-full card-hover" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)' }}>
                <div className="flex justify-between items-start mb-4">
                   <span className="text-xs font-bold px-2 py-1 rounded bg-black/5 dark:bg-surf-elevated" style={{ color: 'var(--text-secondary)' }}>
                      {assignment.course}
                   </span>
                   
                   {assignment.status === 'graded' ? (
                      <span className="badge-success px-2 py-1 rounded text-xs font-bold">{assignment.grade}</span>
                   ) : (
                      <span className={`text-xs font-bold ${
                         assignment.urgency === 'danger' ? 'text-rose-500' :
                         assignment.urgency === 'warning' ? 'text-amber-500' :
                         'text-[var(--text-tertiary)]'
                      }`}>
                         {assignment.dueDate}
                      </span>
                   )}
                </div>
                
                <h3 className="heading-font text-xl font-bold mb-2 flex-1">{assignment.title}</h3>
                
                <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-soft)' }}>
                   {assignment.status === 'pending' && (
                      <div className="space-y-4">
                         <div>
                            <div className="flex justify-between text-xs mb-1 font-semibold" style={{ color: 'var(--text-secondary)' }}>
                               <span>Progress</span>
                               <span>{assignment.progress}%</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-black/5 dark:bg-surf-hover overflow-hidden">
                               <div className="h-full rounded-full bg-[var(--accent-primary)]" style={{ width: `${assignment.progress}%` }}></div>
                            </div>
                         </div>
                         <div className="flex gap-2">
                            <button className="flex-1 btn-primary py-2 rounded-lg text-sm font-bold">Continue</button>
                            {assignment.progress > 0 && <button className="btn-secondary px-4 py-2 rounded-lg text-sm font-bold">Submit</button>}
                         </div>
                      </div>
                   )}
                   
                   {assignment.status === 'submitted' && (
                      <button className="w-full btn-secondary py-2 rounded-lg text-sm font-bold opacity-50 cursor-not-allowed">
                         Under Review
                      </button>
                   )}
                   
                   {assignment.status === 'graded' && (
                      <button className="w-full px-4 py-2 rounded-lg text-sm font-bold text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 transition-colors">
                         View Feedback
                      </button>
                   )}
                </div>
             </div>
          ))}
       </div>
    </div>
  );
}