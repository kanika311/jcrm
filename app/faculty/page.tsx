import Link from "next/link";
import { getSiteContent } from "@/lib/cms";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function FacultyDashboard() {
  const session = await getServerSession(authOptions);
  const cmsData = await getSiteContent("faculty-dashboard");
  
  let userName = "Instructor";
  if (session?.user?.id) {
    try {
      const dbUser = await prisma.user.findUnique({ where: { id: session.user.id }, select: { name: true, fullName: true } });
      if (dbUser) {
        userName = (dbUser.name || dbUser.fullName || "Instructor").split(" ")[0];
      }
    } catch (error) {
      console.error("Failed to load faculty profile:", error);
    }
  }

  const welcomePrefix = cmsData?.welcomeMessage || `Welcome back, ${userName}`;
  
  return (
    <div className="space-y-6 pb-20">
       
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
             <h1 className="heading-font text-3xl font-bold mb-1">{welcomePrefix}</h1>
             <p style={{ color: 'var(--text-secondary)' }}>Overview of your courses and student performance.</p>
          </div>
          <Link href="/faculty/create" className="btn-primary px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2">
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
             Create Course
          </Link>
       </div>

       {/* Metric Cards */}
       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[
             { label: "Active Students", value: "1,248", trend: "+12%", color: "var(--accent-primary)" },
             { label: "Course Revenue", value: "₹48,200", trend: "+8.4%", color: "var(--accent-success)" },
             { label: "Avg Rating", value: "4.8", trend: "+0.1", color: "var(--accent-warning)" },
             { label: "Completion Rate", value: "64%", trend: "+2%", color: "var(--accent-cyan)" }
          ].map((stat, i) => (
             <div key={i} className="p-6 rounded-[24px] card-hover" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)' }}>
                <div className="flex justify-between items-start mb-4">
                   <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{stat.label}</div>
                   <div className="text-xs font-bold px-2 py-1 rounded bg-black/5 dark:bg-surf-elevated" style={{ color: stat.color }}>{stat.trend}</div>
                </div>
                <div className="heading-font text-3xl font-bold mb-4">{stat.value}</div>
                {/* Fake Sparkline */}
                <div className="h-10 w-full flex items-end justify-between gap-1">
                   {[40, 70, 45, 90, 65, 85, 100].map((h, j) => (
                      <div key={j} className="w-full rounded-t-sm opacity-50" style={{ height: `${h}%`, background: stat.color }}></div>
                   ))}
                </div>
             </div>
          ))}
       </div>

       {/* Main Layout */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
             {/* Recent Courses Table */}
             <div className="rounded-[24px] overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)' }}>
                <div className="p-6 border-b flex justify-between items-center" style={{ borderColor: 'var(--border-soft)' }}>
                   <h2 className="heading-font text-lg font-bold">My Courses</h2>
                   <Link href="/faculty/courses" className="text-sm font-semibold hover:underline" style={{ color: 'var(--accent-primary)' }}>View All</Link>
                </div>
                <div className="overflow-x-auto">
                   <table className="data-table">
                      <thead>
                         <tr>
                            <th>Course Name</th>
                            <th>Status</th>
                            <th>Students</th>
                            <th>Rating</th>
                            <th>Revenue</th>
                         </tr>
                      </thead>
                      <tbody>
                         <tr>
                            <td className="font-bold">Full-Stack React & TS</td>
                            <td><span className="badge-success px-2 py-1 rounded text-xs">Published</span></td>
                            <td>842</td>
                            <td>4.9</td>
                            <td>₹32k</td>
                         </tr>
                         <tr>
                            <td className="font-bold">Next.js App Router Masterclass</td>
                            <td><span className="badge-warning px-2 py-1 rounded text-xs">Draft</span></td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                         </tr>
                         <tr>
                            <td className="font-bold">UI/UX for Developers</td>
                            <td><span className="badge-success px-2 py-1 rounded text-xs">Published</span></td>
                            <td>406</td>
                            <td>4.7</td>
                            <td>₹16k</td>
                         </tr>
                      </tbody>
                   </table>
                </div>
             </div>
          </div>

          {/* Right Rail */}
          <div className="space-y-6">
             {/* Submissions Queue */}
             <div className="p-6 rounded-[24px]" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-soft)' }}>
                <div className="flex justify-between items-center mb-6">
                   <h3 className="font-bold text-lg">Needs Grading</h3>
                   <span className="w-6 h-6 rounded-full bg-rose-500 text-txt-primary text-xs font-bold flex items-center justify-center shadow-lg">12</span>
                </div>
                
                <div className="space-y-4">
                   {[
                      { student: "Alex Turner", task: "E-commerce API", time: "2h ago" },
                      { student: "Sarah Jenkins", task: "Docker Config", time: "5h ago" },
                      { student: "Mike Ross", task: "React Components", time: "1d ago" }
                   ].map((sub, i) => (
                      <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-black/5 dark:bg-surf-elevated">
                         <div>
                            <div className="font-bold text-sm">{sub.student}</div>
                            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{sub.task}</div>
                         </div>
                         <button className="text-[10px] font-bold px-3 py-1.5 rounded uppercase tracking-wider" style={{ background: 'var(--bg-card)', color: 'var(--accent-primary)', border: '1px solid var(--border-soft)' }}>Review</button>
                      </div>
                   ))}
                </div>
                <Link href="/faculty/submissions" className="btn-secondary w-full mt-4 py-2 text-sm rounded-lg">View All Submissions</Link>
             </div>
          </div>
          
       </div>
    </div>
  );
}