import { getSiteContent } from "@/lib/cms";

export default async function AnalyticsPage() {
  const cmsData = await getSiteContent("faculty-analytics");

  return (
    <div className="space-y-8 pb-20">
       <div>
          <h1 className="heading-font text-3xl font-bold mb-2">{cmsData?.heading || "Analytics"}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Detailed insights into course performance and revenue.</p>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart Placeholder */}
          <div className="p-6 rounded-[24px]" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)' }}>
             <h3 className="font-bold text-lg mb-6">Revenue Over Time</h3>
             <div className="h-64 flex items-end justify-between gap-2 px-4 pb-2 border-b" style={{ borderColor: 'var(--border-soft)' }}>
                {[30, 45, 20, 60, 80, 50, 100].map((h, i) => (
                   <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer relative">
                      <div className="absolute -top-8 bg-[var(--bg-surface)] px-2 py-1 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity border" style={{ borderColor: 'var(--border-soft)' }}>
                         ${h * 120}
                      </div>
                      <div className="w-full max-w-[40px] rounded-t-lg bg-[var(--accent-success)] opacity-50 group-hover:opacity-100 transition-opacity" style={{ height: `${h}%` }}></div>
                   </div>
                ))}
             </div>
             <div className="flex justify-between px-4 mt-2 text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
             </div>
          </div>

          {/* Engagement Chart Placeholder */}
          <div className="p-6 rounded-[24px]" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)' }}>
             <h3 className="font-bold text-lg mb-6">Student Engagement</h3>
             <div className="h-64 flex items-end justify-between gap-2 px-4 pb-2 border-b" style={{ borderColor: 'var(--border-soft)' }}>
                {[60, 80, 75, 90, 85, 40, 50].map((h, i) => (
                   <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                      <div className="w-full max-w-[40px] rounded-t-lg bg-[var(--accent-primary)] opacity-50 group-hover:opacity-100 transition-opacity" style={{ height: `${h}%` }}></div>
                   </div>
                ))}
             </div>
             <div className="flex justify-between px-4 mt-2 text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
             </div>
          </div>
       </div>
    </div>
  );
}