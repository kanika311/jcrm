import Link from "next/link";
import { getSiteContent } from "@/lib/cms";

export default async function MyCoursesPage() {
  const cmsData = await getSiteContent("student-courses");
  
  const courses = [
    {
      id: "full-stack-react",
      title: "Full-Stack React & TypeScript",
      instructor: "Aisha Verma",
      progress: 68,
      lastActive: "2 hours ago",
      nextLesson: "Implementing Next.js Middleware for Auth",
      totalModules: 12,
      completedModules: 8,
      color: "from-violet-500 to-fuchsia-500"
    },
    {
      id: "system-design",
      title: "System Design for Scale",
      instructor: "Marcus Chen",
      progress: 24,
      lastActive: "Yesterday",
      nextLesson: "Database Sharding Strategies",
      totalModules: 14,
      completedModules: 3,
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: "applied-ml",
      title: "Applied Machine Learning",
      instructor: "Dr. Sarah Jenkins",
      progress: 100,
      lastActive: "Last month",
      nextLesson: "Course Completed",
      totalModules: 10,
      completedModules: 10,
      color: "from-emerald-500 to-teal-500"
    }
  ];

  return (
    <div className="space-y-8 pb-20">
       <div className="flex justify-between items-end">
          <div>
             <h1 className="heading-font text-3xl font-bold mb-2">{cmsData?.heading || "My Courses"}</h1>
             <p style={{ color: 'var(--text-secondary)' }}>Track your progress and pick up where you left off.</p>
          </div>
          <Link href="/courses" className="btn-secondary px-5 py-2.5 rounded-lg text-sm">Browse Catalog</Link>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {courses.map((course, i) => (
             <div key={course.id} className="p-6 rounded-[24px] flex flex-col md:flex-row gap-6 relative overflow-hidden group" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)' }}>
                {course.progress === 100 && (
                   <div className="absolute top-0 right-0 w-32 h-32 blur-[50px] opacity-20" style={{ background: 'var(--accent-success)' }}></div>
                )}
                
                {/* Progress Ring / Thumbnail */}
                <div className="w-32 h-32 shrink-0 rounded-2xl relative flex items-center justify-center shadow-inner" style={{ background: 'var(--bg-surface)' }}>
                   {course.progress === 100 ? (
                      <div className="w-full h-full rounded-2xl bg-gradient-to-br flex items-center justify-center text-txt-primary" style={{ backgroundImage: `linear-gradient(to bottom right, var(--accent-success), teal)` }}>
                         <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                   ) : (
                      <>
                         <svg className="w-24 h-24 transform -rotate-90">
                            <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-black/5 dark:text-txt-primary/5" />
                            <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * course.progress) / 100} className="text-[var(--accent-primary)] transition-all duration-1000 ease-out" />
                         </svg>
                         <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className="font-bold text-xl">{course.progress}%</span>
                         </div>
                      </>
                   )}
                </div>

                <div className="flex-1 flex flex-col justify-between">
                   <div>
                      <div className="flex items-center gap-2 mb-2">
                         <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>{course.completedModules}/{course.totalModules} Modules</span>
                         {course.progress === 100 && <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500">Completed</span>}
                      </div>
                      <h3 className="heading-font text-xl font-bold mb-1">{course.title}</h3>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{course.instructor}</p>
                   </div>
                   
                   <div className="mt-6 flex items-end justify-between">
                      <div>
                         <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-tertiary)' }}>UP NEXT</p>
                         <p className="text-sm font-medium line-clamp-1">{course.nextLesson}</p>
                      </div>
                      <Link href={course.progress === 100 ? `/courses/${course.id}` : "/student/classroom"} className={`px-5 py-2 rounded-lg text-sm font-bold shrink-0 ${course.progress === 100 ? 'btn-secondary' : 'btn-primary'}`}>
                         {course.progress === 100 ? 'Review' : 'Resume'}
                      </Link>
                   </div>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
}