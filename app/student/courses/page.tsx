import Link from "next/link";
import { getSiteContent } from "@/lib/cms";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function MyCoursesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/auth");
  }

  const cmsData = await getSiteContent("student-courses");

  // Fetch only courses this student has actually enrolled in / purchased
  const enrollments = await prisma.enrollment.findMany({
    where: {
      studentId: session.user.id,
      paymentStatus: "COMPLETED",
    },
    include: {
      course: true,
    },
    orderBy: {
      enrolledAt: "desc",
    },
  });

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="heading-font text-3xl font-bold mb-2">
            {cmsData?.heading || "My Courses"}
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Track your progress and pick up where you left off.
          </p>
        </div>
        <Link
          href="/courses"
          className="btn-secondary px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Browse Catalog
        </Link>
      </div>

      {enrollments.length === 0 ? (
        /* Empty State when student has not enrolled in any course */
        <div
          className="p-12 text-center rounded-[28px] border flex flex-col items-center justify-center max-w-xl mx-auto my-12 animate-fade-in-up"
          style={{ background: "var(--bg-card)", borderColor: "var(--border-soft)" }}
        >
          <div className="w-20 h-20 rounded-3xl bg-blue-500/10 text-[#0055FF] flex items-center justify-center mb-6 shadow-inner">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="heading-font text-2xl font-bold mb-2 text-slate-900 dark:text-white">
            No Enrolled Courses Yet
          </h3>
          <p className="text-sm max-w-md mb-8 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Aapne abhi tak koi course enroll ya purchase nahi kiya hai. Instructors ke banaye live programs browse karein aur learning start karein!
          </p>
          <Link
            href="/courses"
            className="btn-primary px-8 py-3.5 rounded-xl font-extrabold text-sm shadow-lg shadow-blue-500/25 flex items-center gap-2 hover:scale-[1.02] transition-all"
          >
            <span>Browse Courses to Buy</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      ) : (
        /* Enrolled Courses Grid */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {enrollments.map(({ id: enrollmentId, course, progressPercent, enrolledAt }) => (
            <div
              key={enrollmentId}
              className="p-6 rounded-[24px] flex flex-col md:flex-row gap-6 relative overflow-hidden group card-hover"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)" }}
            >
              {progressPercent === 100 && (
                <div
                  className="absolute top-0 right-0 w-32 h-32 blur-[50px] opacity-20 pointer-events-none"
                  style={{ background: "var(--accent-success)" }}
                ></div>
              )}

              {/* Progress Ring / Thumbnail */}
              <div
                className="w-32 h-32 shrink-0 rounded-2xl relative flex items-center justify-center shadow-inner overflow-hidden"
                style={{ background: "var(--bg-surface)" }}
              >
                {course.image ? (
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-extrabold text-2xl">
                    {course.title.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                  <span className="font-extrabold text-white text-lg drop-shadow-md">
                    {progressPercent}%
                  </span>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded"
                      style={{ background: "var(--bg-surface)", color: "var(--text-secondary)" }}
                    >
                      {course.level || "Track"}
                    </span>
                    {progressPercent === 100 ? (
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500">
                        Completed
                      </span>
                    ) : (
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500/10 text-[#0055FF]">
                        In Progress
                      </span>
                    )}
                  </div>
                  <h3 className="heading-font text-xl font-bold mb-1">{course.title}</h3>
                  <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                    Instructor: {course.instructor || "JCRM Faculty"}
                  </p>
                </div>

                <div className="mt-6 flex items-end justify-between">
                  <div>
                    <p className="text-[11px] font-semibold mb-0.5 uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                      Enrolled Date
                    </p>
                    <p className="text-xs font-medium text-slate-500">
                      {new Date(enrolledAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Link
                    href={`/student/classroom?courseId=${course.id}`}
                    className="btn-primary px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 hover:scale-105 transition-all"
                  >
                    Resume Learning →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
