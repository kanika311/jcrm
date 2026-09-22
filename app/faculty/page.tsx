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

  // Fetch real teacher courses from DB
  const courses = await prisma.course.findMany({
    where: session.user.role === "ADMIN" ? {} : { facultyId: session.user.id },
    include: {
      _count: { select: { enrollments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalStudents = courses.reduce((acc, c) => acc + (c._count.enrollments || 0), 0);
  const totalRevenue = courses.reduce((acc, c) => acc + (c._count.enrollments || 0) * (c.price || 0), 0);

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
            value: courses.length.toString(),
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
              <h2 className="heading-font text-lg font-bold">My Courses ({courses.length})</h2>
              <Link
                href="/faculty/courses"
                className="text-sm font-semibold hover:underline"
                style={{ color: "var(--accent-primary)" }}
              >
                View All
              </Link>
            </div>
            <div className="overflow-x-auto">
              {courses.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-sm text-slate-500 mb-4">You have not created any courses yet.</p>
                  <Link href="/faculty/create" className="btn-primary px-4 py-2 rounded-lg text-xs font-bold">
                    + Create Your First Course
                  </Link>
                </div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Course Name</th>
                      <th>Status</th>
                      <th>Students</th>
                      <th>Price</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.slice(0, 5).map((c) => (
                      <tr key={c.id}>
                        <td className="font-bold">{c.title}</td>
                        <td>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-bold ${
                              c.status === "PUBLISHED" ? "badge-success" : "badge-warning"
                            }`}
                          >
                            {c.status}
                          </span>
                        </td>
                        <td>{c._count.enrollments || 0}</td>
                        <td>₹{Number(c.price || 0).toLocaleString()}</td>
                        <td>
                          <Link
                            href={`/courses/${c.id}`}
                            target="_blank"
                            className="text-xs font-bold text-[#0055FF] hover:underline"
                          >
                            Preview ↗
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
