import Link from "next/link";
import { getStudentDashboard } from "@/app/actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getSiteContent } from "@/lib/cms";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function StudentDashboard() {
  const session = await getServerSession(authOptions);
  const data = await getStudentDashboard();
  const cmsData = await getSiteContent("student-dashboard");
  
  let userName = "Student";
  if (session?.user?.id) {
    try {
      const dbUser = await prisma.user.findUnique({ where: { id: session.user.id }, select: { name: true, fullName: true } });
      if (dbUser) {
        userName = (dbUser.name || dbUser.fullName || "Student").split(" ")[0];
      }
    } catch (error) {
      console.error("Failed to load student profile:", error);
    }
  }

  const welcomePrefix = cmsData?.welcomeMessage || "Welcome back,";
  const showQuickStats = cmsData?.showQuickStats !== false;

  const enrolledCourseIds = data.enrollments.map((e: any) => e.course?.id).filter(Boolean);
  const upcomingAssignments = enrolledCourseIds.length
    ? await prisma.assignment.findMany({
        where: { courseId: { in: enrolledCourseIds } },
        include: { course: { select: { title: true } } },
        orderBy: { dueDate: "asc" },
        take: 4,
      }).catch(() => [])
    : [];

  const upcomingLives: { title: string; at: Date; course: string }[] = [];
  if (enrolledCourseIds.length) {
    const liveCourses = await prisma.course.findMany({
      where: { id: { in: enrolledCourseIds } },
      select: { title: true, curriculum: true },
    }).catch(() => []);
    for (const course of liveCourses) {
      const sessions = ((course.curriculum as any)?.liveSessions || []) as any[];
      for (const sessionItem of sessions) {
        if (!sessionItem?.scheduledAt) continue;
        const at = new Date(sessionItem.scheduledAt);
        if (isNaN(at.getTime()) || at.getTime() < Date.now() - 60 * 60 * 1000) continue;
        upcomingLives.push({ title: sessionItem.title || "Live class", at, course: course.title });
      }
    }
    upcomingLives.sort((a, b) => a.at.getTime() - b.at.getTime());
  }

  return (
    <div className="space-y-6 pb-20">
       
       {/* 1. Welcome Banner */}
       <div className="rounded-[24px] p-8 md:p-10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6" style={{ background: 'linear-gradient(135deg, var(--bg-card), var(--bg-surface))', border: '1px solid var(--border-soft)' }}>
          <div className="absolute top-0 right-0 w-64 h-64 blur-[80px] opacity-20 pointer-events-none" style={{ background: 'var(--accent-primary)' }}></div>
          
          <div className="relative z-10 flex-1">
             <h1 className="heading-font text-3xl md:text-4xl font-bold mb-2">{welcomePrefix} {userName} 👋</h1>
             <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
               {data.enrollments.length === 0
                 ? "Buy a course to unlock classroom, live classes, assignments, and instructor chat."
                 : "Continue where you left off."}
             </p>
          </div>
          
          <div className="relative z-10 shrink-0 w-full md:w-auto">
             <Link href={data.enrollments.length === 0 ? "/courses" : "/student/live"} className="btn-primary w-full md:w-auto px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(124,58,237,0.3)] hover:shadow-[0_0_40px_rgba(124,58,237,0.5)] transition-shadow">
                {data.enrollments.length === 0 ? "Browse Courses" : "Join Live Session"}
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
             </Link>
          </div>
       </div>

       {/* 2. Metric Cards */}
       {showQuickStats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
             {[
                { label: "Enrolled Courses", value: data.activeCount.toString(), icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", color: "var(--accent-primary)" },
                { label: "Learning Streak", value: data.enrollments.length === 0 ? "0 Days" : "12 Days", icon: "M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z", color: "var(--accent-warning)" },
                { label: "Learning Time", value: data.enrollments.length === 0 ? "0h" : "48h 20m", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", color: "var(--accent-cyan)" },
                { label: "Certificates", value: data.completedCount.toString(), icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z", color: "var(--accent-success)" }
             ].map((stat, i) => (
                <div key={i} className="p-6 rounded-[20px] card-hover flex flex-col justify-between" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)' }}>
                   <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `color-mix(in srgb, ${stat.color} 15%, transparent)`, color: stat.color }}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon}/></svg>
                   </div>
                   <div>
                      <div className="heading-font text-2xl font-bold">{stat.value}</div>
                      <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{stat.label}</div>
                   </div>
                </div>
             ))}
          </div>
       )}

       {/* 3. Bento Grid Main */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Left: Continue Learning & Activity */}
          <div className="lg:col-span-2 space-y-6">
             {/* Continue Learning */}
             <div className="p-6 md:p-8 rounded-[24px]" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)' }}>
                <div className="flex justify-between items-center mb-6">
                   <h2 className="heading-font text-xl font-bold">My Active Courses</h2>
                   <Link href="/courses" className="text-sm font-semibold hover:underline" style={{ color: 'var(--accent-primary)' }}>Browse Catalog</Link>
                </div>
                
                {data.enrollments.length === 0 ? (
                   <div className="py-8 px-4 text-center rounded-2xl bg-black/5 dark:bg-surf-elevated">
                      <p className="text-sm font-semibold mb-4" style={{ color: 'var(--text-secondary)' }}>
                        You are not enrolled in any courses yet. Browse our instructor-led courses to buy and start learning!
                      </p>
                      <Link href="/courses" className="btn-primary px-6 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2">
                        <span>Browse Courses & Enroll</span>
                        <span>→</span>
                      </Link>
                   </div>
                ) : (
                   <div className="flex flex-col md:flex-row gap-6 items-center">
                      <div className="w-full md:w-48 h-32 rounded-xl shrink-0 bg-gradient-to-br from-blue-600 to-indigo-700 p-4 flex flex-col justify-between text-white relative overflow-hidden">
                         <div className="absolute inset-0 bg-black/20 mix-blend-overlay"></div>
                         <span className="relative z-10 text-xs font-bold uppercase tracking-wider">{data.enrollments[0].course?.level || "Track"}</span>
                         <svg className="relative z-10 w-8 h-8 self-end opacity-50" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                      </div>
                      
                      <div className="flex-1 w-full">
                         <h3 className="font-bold text-lg mb-1">{data.enrollments[0].course?.title}</h3>
                         <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Instructor: {data.enrollments[0].course?.instructor || "JCRM Faculty"}</p>
                         
                         <div className="flex items-center gap-4 mb-4">
                            <div className="flex-1 h-2 rounded-full bg-black/10 dark:bg-surf-hover overflow-hidden">
                               <div className="h-full rounded-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-cyan)]" style={{ width: `${data.enrollments[0].progressPercent || 0}%` }}></div>
                            </div>
                            <span className="text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>{data.enrollments[0].progressPercent || 0}%</span>
                         </div>
                         
                         <Link href={`/student/classroom?courseId=${data.enrollments[0].course?.id}`} className="btn-secondary w-full md:w-auto px-6 py-2.5 rounded-lg text-sm flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                            Resume Lesson
                         </Link>
                      </div>
                   </div>
                )}
             </div>
             
             {data.enrollments.length > 0 && (
             <div className="p-6 md:p-8 rounded-[24px]" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)' }}>
                <h2 className="heading-font text-xl font-bold mb-8">Learning Activity</h2>
                <div className="h-48 flex items-end justify-between gap-2 px-2">
                   {[
                      { day: 'Mon', h: '40%' },
                      { day: 'Tue', h: '60%' },
                      { day: 'Wed', h: '30%' },
                      { day: 'Thu', h: '80%' },
                      { day: 'Fri', h: '100%', active: true },
                      { day: 'Sat', h: '20%' },
                      { day: 'Sun', h: '50%' }
                   ].map((bar, i) => (
                      <div key={i} className="flex flex-col items-center flex-1 gap-3 group">
                         <div className="w-full relative flex justify-center h-full items-end">
                            <div 
                               className={`w-full max-w-[40px] rounded-t-lg transition-all duration-500 ${bar.active ? 'bg-gradient-to-t from-[var(--accent-primary)] to-[var(--accent-cyan)]' : 'bg-black/10 dark:bg-surf-hover group-hover:bg-black/20 dark:group-hover:bg-white/20'}`}
                               style={{ height: bar.h }}
                            ></div>
                         </div>
                         <span className={`text-xs font-semibold ${bar.active ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'}`}>{bar.day}</span>
                      </div>
                   ))}
                </div>
             </div>
             )}
          </div>

          {data.enrollments.length > 0 && (
          <div className="space-y-6">
             <div className="p-6 rounded-[24px] relative overflow-hidden" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-soft)' }}>
                <div className="absolute top-0 right-0 w-32 h-32 blur-[40px] opacity-20 pointer-events-none" style={{ background: 'var(--accent-warning)' }}></div>
                <h3 className="font-bold text-lg mb-6">Upcoming Events</h3>
                
                <div className="space-y-4">
                   {upcomingLives.length === 0 ? (
                     <p className="text-sm text-slate-500">No live classes scheduled yet for your courses.</p>
                   ) : (
                     upcomingLives.slice(0, 3).map((item, i) => (
                       <div key={`${item.title}-${i}`} className="flex gap-4 p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)' }}>
                          <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                             <span className="text-xs font-bold text-rose-500">{item.at.toLocaleDateString("en-IN", { month: "short" }).toUpperCase()}</span>
                             <span className="text-lg font-bold">{item.at.getDate()}</span>
                          </div>
                          <div>
                             <h4 className="font-bold text-sm">{item.title}</h4>
                             <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                               {item.at.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })} · {item.course}
                             </p>
                          </div>
                       </div>
                     ))
                   )}
                </div>
                <Link href="/student/calendar" className="btn-secondary w-full mt-4 py-2 text-sm rounded-lg">View Full Calendar</Link>
             </div>

             {/* Deadlines */}
             <div className="p-6 rounded-[24px]" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-soft)' }}>
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                   <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                   Upcoming Deadlines
                </h3>
                <div className="space-y-3">
                   {upcomingAssignments.length === 0 ? (
                     <p className="text-sm text-slate-500">No assignments from your instructor yet.</p>
                   ) : (
                     upcomingAssignments.map((item) => (
                       <div key={item.id} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--bg-card)' }}>
                          <div>
                             <div className="font-bold text-sm">{item.title}</div>
                             <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                               {item.course.title}
                               {item.dueDate ? ` · Due ${item.dueDate.toLocaleDateString()}` : ""}
                             </div>
                          </div>
                          <Link href="/student/assignments" className="text-xs font-bold px-3 py-1.5 rounded bg-rose-500/10 text-rose-600">Open</Link>
                       </div>
                     ))
                   )}
                </div>
             </div>
          </div>
          )}
          
       </div>
    </div>
  );
}