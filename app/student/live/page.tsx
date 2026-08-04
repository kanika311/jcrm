import Link from "next/link";
import { getSiteContent } from "@/lib/cms";

export default async function LiveClassesPage() {
  const cmsData = await getSiteContent("student-live");
  
  return (
    <div className="space-y-8 pb-20">
       <div className="flex justify-between items-end">
          <div>
             <h1 className="heading-font text-3xl font-bold mb-2">{cmsData?.heading || "Live Sessions"}</h1>
             <p style={{ color: 'var(--text-secondary)' }}>{cmsData?.guidelines || "Join live cohorts, Q&A sessions, and project reviews."}</p>
          </div>
       </div>

       {/* LIVE NOW Card */}
       <div className="p-8 rounded-[32px] relative overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 to-orange-500/20 pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-64 h-64 blur-[80px] opacity-40 pointer-events-none" style={{ background: 'var(--accent-warning)' }}></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
             <div>
                <div className="flex items-center gap-2 mb-4">
                   <span className="bg-rose-500 text-txt-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(244,63,94,0.5)]">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                      Live Now
                   </span>
                   <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Full-Stack Cohort C</span>
                </div>
                
                <h2 className="heading-font text-3xl font-bold mb-2 text-[var(--text-primary)]">System Design: Scaling Databases</h2>
                <p className="text-lg max-w-xl mb-6" style={{ color: 'var(--text-secondary)' }}>Join Marcus Chen as he walks through database sharding strategies used at Meta and Netflix.</p>
                
                <div className="flex items-center gap-4">
                   <div className="flex items-center">
                      <img src="https://i.pravatar.cc/150?img=11" className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 relative z-10" />
                      <img src="https://i.pravatar.cc/150?img=12" className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 -ml-4 relative z-20" />
                      <img src="https://i.pravatar.cc/150?img=13" className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 -ml-4 relative z-30" />
                      <div className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 -ml-4 relative z-40 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-txt-secondary">
                         +42
                      </div>
                   </div>
                   <span className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>Students watching</span>
                </div>
             </div>
             
             <div className="shrink-0 flex flex-col items-center">
                <div className="text-4xl font-mono font-bold mb-2 tracking-widest text-[var(--text-primary)]">45:12</div>
                <button className="btn-cyan px-8 py-4 rounded-xl text-lg font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-105 transition-transform w-full md:w-auto">
                   Join Session
                </button>
             </div>
          </div>
       </div>

       {/* Upcoming & Past Grid */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          
          {/* Upcoming */}
          <div>
             <h3 className="heading-font text-2xl font-bold mb-6">Upcoming Sessions</h3>
             <div className="space-y-4">
                {[
                   { title: "Project Review: E-commerce API", time: "Tomorrow, 2:00 PM EST", tag: "Cohort B" },
                   { title: "Q&A: Advanced React Patterns", time: "Friday, 11:00 AM EST", tag: "All Cohorts" },
                   { title: "Career Prep: Behavioral Interviews", time: "Monday, 4:00 PM EST", tag: "Career Track" }
                ].map((session, i) => (
                   <div key={i} className="p-5 rounded-2xl flex items-center justify-between gap-4 card-hover" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)' }}>
                      <div>
                         <span className="text-xs font-bold px-2 py-1 rounded mb-2 inline-block" style={{ background: 'var(--bg-surface)', color: 'var(--accent-primary)' }}>{session.tag}</span>
                         <h4 className="font-bold text-lg mb-1">{session.title}</h4>
                         <div className="text-sm flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            {session.time}
                         </div>
                      </div>
                      <button className="btn-secondary px-4 py-2 rounded-lg text-sm shrink-0 font-bold">RSVP</button>
                   </div>
                ))}
             </div>
          </div>

          {/* Past */}
          <div>
             <h3 className="heading-font text-2xl font-bold mb-6">Past Recordings</h3>
             <div className="space-y-4">
                {[
                   { title: "Intro to CI/CD with GitHub Actions", time: "Recorded 2 days ago", duration: "1h 15m", img: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=300&auto=format&fit=crop" },
                   { title: "CSS Architecture & Tailwind Deep Dive", time: "Recorded 5 days ago", duration: "2h 10m", img: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?q=80&w=300&auto=format&fit=crop" },
                   { title: "Microservices vs Monoliths", time: "Recorded 1 week ago", duration: "1h 45m", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=300&auto=format&fit=crop" }
                ].map((rec, i) => (
                   <div key={i} className="p-4 rounded-2xl flex items-center gap-4 group cursor-pointer" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)' }}>
                      <div className="w-24 h-20 rounded-xl relative overflow-hidden shrink-0">
                         <img src={rec.img} alt={rec.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                         <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <svg className="w-8 h-8 text-txt-primary opacity-80 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                         </div>
                         <div className="absolute bottom-1 right-1 bg-black/80 text-txt-primary text-[10px] font-bold px-1.5 py-0.5 rounded">
                            {rec.duration}
                         </div>
                      </div>
                      <div className="flex-1">
                         <h4 className="font-bold mb-1 group-hover:text-[var(--accent-primary)] transition-colors line-clamp-1">{rec.title}</h4>
                         <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{rec.time}</div>
                      </div>
                   </div>
                ))}
             </div>
             <button className="w-full mt-4 py-3 rounded-xl text-sm font-bold text-center hover:bg-black/5 dark:hover:bg-surf-elevated transition-colors" style={{ color: 'var(--text-secondary)' }}>
                View All Recordings
             </button>
          </div>
          
       </div>
    </div>
  );
}