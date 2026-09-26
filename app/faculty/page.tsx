import Link from "next/link";
import { getSiteContent } from "@/lib/cms";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function FacultyDashboard() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN")) {
    redirect("/auth");
  }

  const cmsData = await getSiteContent("faculty-dashboard");

  let userName = "Instructor";
  if (session?.user?.id) {
    try {
      const dbUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { name: true, fullName: true },
      });
      if (dbUser) {
        userName = (dbUser.name || dbUser.fullName || "Instructor").split(" ")[0];
      }
    } catch (error) {
      console.error("Failed to load faculty profile:", error);
    }
  }

  const courses = await prisma.course.findMany({
    where: session.user.role === "ADMIN" ? {} : { facultyId: session.user.id },
    include: {
      enrollments: {
        include: {
          student: { select: { id: true, name: true, fullName: true, email: true, image: true } },
        },
        orderBy: { enrolledAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const courseCards = courses.map((course) => ({
    id: course.id,
    title: course.title,
    status: course.status,
    price: course.price || 0,
    students: course.enrollments
      .filter((row) => row.paymentStatus === "COMPLETED")
      .map((row) => ({
        id: row.student.id,
        name: row.student.fullName || row.student.name || row.student.email,
        email: row.student.email,
      })),
    liveCount: Array.isArray((course.curriculum as any)?.liveSessions)
      ? (course.curriculum as any).liveSessions.length
      : 0,
  }));

  const totalStudents = courseCards.reduce((acc, course) => acc + course.students.length, 0);
  const totalRevenue = courseCards.reduce((acc, course) => acc + course.students.length * course.price, 0);

  const welcomePrefix = cmsData?.welcomeMessage || `Welcome back, ${userName}`;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="heading-font text-3xl font-bold mb-1">{welcomePrefix}</h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Overview of your courses and student performance.
          </p>
        </div>
        <Link
          href="/faculty/create"
          className="btn-primary px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Create Course
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          {
            label: "My Courses",
            value: courseCards.length.toString(),
            trend: "Active",
            color: "var(--accent-primary)",
          },
          {
            label: "Enrolled Students",
            value: totalStudents.toString(),
            trend: "+Live",
            color: "var(--accent-success)",
          },
          {
            label: "Course Revenue",
            value: `₹${totalRevenue.toLocaleString()}`,
            trend: "Earned",
            color: "var(--accent-warning)",
          },
          {
            label: "Avg Rating",
            value: "4.9",
            trend: "★ Top",
            color: "var(--accent-cyan)",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="p-6 rounded-[24px] card-hover"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)" }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                {stat.label}
              </div>
              <div
                className="text-xs font-bold px-2 py-1 rounded bg-black/5 dark:bg-surf-elevated"
                style={{ color: stat.color }}
              >
                {stat.trend}
              </div>
            </div>
            <div className="heading-font text-3xl font-bold mb-4">{stat.value}</div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: "100%", background: stat.color }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Courses Table */}
          <div
            className="rounded-[24px] overflow-hidden"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)" }}
          >
            <div
              className="p-6 border-b flex justify-between items-center"
              style={{ borderColor: "var(--border-soft)" }}
            >
              <h2 className="heading-font text-lg font-bold">Students by course</h2>
              <Link
                href="/faculty/students"
                className="text-sm font-semibold hover:underline"
                style={{ color: "var(--accent-primary)" }}
              >
                Full directory
              </Link>
            </div>
            <div className="p-6 space-y-4">
              {courseCards.length === 0 ? (
                <div className="text-center">
                  <p className="text-sm text-slate-500 mb-4">You have not created any courses yet.</p>
                  <Link href="/faculty/create" className="btn-primary px-4 py-2 rounded-lg text-xs font-bold">
                    + Create Your First Course
                  </Link>
                </div>
              ) : (
                courseCards.map((course) => (
                  <div key={course.id} className="rounded-2xl border border-slate-200 p-4 bg-slate-50/70">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div>
                        <h3 className="font-extrabold text-slate-900">{course.title}</h3>
                        <p className="text-xs text-slate-500">
                          {course.students.length} student{course.students.length === 1 ? "" : "s"} purchased
                          {course.liveCount ? ` · ${course.liveCount} live class${course.liveCount === 1 ? "" : "es"}` : ""}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/faculty/courses/builder?id=${course.id}&tab=live`}
                          className="text-xs font-bold text-rose-600 hover:underline"
                        >
                          Live + attendance
                        </Link>
                        <Link
                          href={`/faculty/students`}
                          className="text-xs font-bold text-[#0055FF] hover:underline"
                        >
                          Students
                        </Link>
                      </div>
                    </div>
                    {course.students.length === 0 ? (
                      <p className="text-xs text-slate-400">No completed enrollments yet.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {course.students.map((student) => (
                          <span
                            key={student.id}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700"
                          >
                            <span className="w-5 h-5 rounded-full bg-[#0055FF] text-white text-[10px] font-black flex items-center justify-center">
                              {student.name[0]?.toUpperCase() || "S"}
                            </span>
                            {student.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Rail */}
        <div className="space-y-6">
          <div
            className="p-6 rounded-[24px]"
            style={{ background: "var(--bg-surface)", border: "1px solid var(--border-soft)" }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">Quick Actions</h3>
            </div>

            <div className="space-y-3">
              <Link
                href="/faculty/create"
                className="w-full py-3 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0055FF] text-xs font-bold flex items-center justify-between transition-colors"
              >
                <span>+ Create New Course</span>
                <span>→</span>
              </Link>
              <Link
                href="/faculty/courses/builder"
                className="w-full py-3 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center justify-between transition-colors"
              >
                <span>Schedule live class & attendance</span>
                <span>→</span>
              </Link>
              <Link
                href="/faculty/courses"
                className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-between transition-colors"
              >
                <span>Manage Curriculum & Prices</span>
                <span>→</span>
              </Link>
              <Link
                href="/courses"
                target="_blank"
                className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-between transition-colors"
              >
                <span>View Public Catalog</span>
                <span>↗</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
