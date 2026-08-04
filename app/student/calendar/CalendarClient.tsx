"use client";
import { useState } from "react";

export default function CalendarClient({ cmsData }: { cmsData: any }) {
  const [currentDate] = useState(new Date());

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  // Mock calendar grid for current month (offset by a few days to simulate real calendar)
  const calendarDays = Array.from({ length: 35 }, (_, i) => {
     const date = i - 2;
     if (date < 1) return { date: 31 + date, isCurrentMonth: false };
     if (date > 30) return { date: date - 30, isCurrentMonth: false };
     return { date, isCurrentMonth: true };
  });

  return (
    <div className="space-y-8 pb-20">
       <div className="flex justify-between items-end">
          <div>
             <h1 className="heading-font text-3xl font-bold mb-2">{cmsData?.heading || "Calendar"}</h1>
             <p style={{ color: 'var(--text-secondary)' }}>Keep track of your classes and deadlines.</p>
          </div>
       </div>

       <div className="flex flex-col xl:flex-row gap-6">
          
          {/* Calendar Main */}
          <div className="flex-1 p-6 rounded-[24px]" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)' }}>
             
             {/* Header */}
             <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">February 2024</h2>
                <div className="flex gap-2">
                   <button className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-surf-elevated border transition-colors" style={{ borderColor: 'var(--border-soft)' }}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
                   </button>
                   <button className="px-4 py-2 font-bold text-sm rounded-lg hover:bg-black/5 dark:hover:bg-surf-elevated border transition-colors" style={{ borderColor: 'var(--border-soft)' }}>Today</button>
                   <button className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-surf-elevated border transition-colors" style={{ borderColor: 'var(--border-soft)' }}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                   </button>
                </div>
             </div>

             {/* Grid */}
             <div className="grid grid-cols-7 gap-px rounded-xl overflow-hidden border bg-gray-200 dark:bg-gray-800" style={{ borderColor: 'var(--border-soft)' }}>
                {days.map(d => (
                   <div key={d} className="p-3 text-center text-xs font-bold uppercase tracking-wider" style={{ background: 'var(--bg-surface)' }}>{d}</div>
                ))}
                
                {calendarDays.map((d, i) => (
                   <div key={i} className={`min-h-[100px] p-2 transition-colors hover:bg-black/5 dark:hover:bg-surf-elevated cursor-pointer ${d.isCurrentMonth ? '' : 'opacity-40'}`} style={{ background: 'var(--bg-card)' }}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-1 ${d.date === 14 && d.isCurrentMonth ? 'bg-[var(--accent-primary)] text-txt-primary' : ''}`}>
                         {d.date}
                      </div>
                      
                      {/* Mock Events */}
                      {d.date === 14 && d.isCurrentMonth && (
                         <div className="bg-rose-500 text-txt-primary text-[10px] font-bold px-2 py-1 rounded mb-1 truncate">Live Q&A</div>
                      )}
                      {d.date === 16 && d.isCurrentMonth && (
                         <div className="bg-amber-500 text-txt-primary text-[10px] font-bold px-2 py-1 rounded truncate">API Due</div>
                      )}
                      {d.date === 22 && d.isCurrentMonth && (
                         <div className="bg-blue-500 text-txt-primary text-[10px] font-bold px-2 py-1 rounded truncate">Cohort Sync</div>
                      )}
                   </div>
                ))}
             </div>
          </div>

          {/* Right Rail: Upcoming Events */}
          <div className="w-full xl:w-96 shrink-0 space-y-6">
             <div className="p-6 rounded-[24px]" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-soft)' }}>
                <h3 className="font-bold text-lg mb-6">Agenda</h3>
                
                <div className="space-y-6">
                   <div>
                      <h4 className="text-sm font-bold mb-3 pb-2 border-b" style={{ borderColor: 'var(--border-soft)', color: 'var(--text-secondary)' }}>Today, Feb 14</h4>
                      <div className="space-y-3">
                         <div className="flex gap-4">
                            <div className="w-1 rounded-full bg-rose-500 shrink-0"></div>
                            <div>
                               <div className="text-xs font-bold mb-0.5 text-rose-500">2:00 PM - 3:30 PM</div>
                               <div className="font-bold text-sm">System Design Live Q&A</div>
                               <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Marcus Chen</div>
                            </div>
                         </div>
                      </div>
                   </div>
                   
                   <div>
                      <h4 className="text-sm font-bold mb-3 pb-2 border-b" style={{ borderColor: 'var(--border-soft)', color: 'var(--text-secondary)' }}>Friday, Feb 16</h4>
                      <div className="space-y-3">
                         <div className="flex gap-4">
                            <div className="w-1 rounded-full bg-amber-500 shrink-0"></div>
                            <div>
                               <div className="text-xs font-bold mb-0.5 text-amber-500">11:59 PM</div>
                               <div className="font-bold text-sm">E-commerce API Due</div>
                               <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Full-Stack React</div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>

       </div>
    </div>
  );
}