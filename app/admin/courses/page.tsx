import { prisma } from "@/lib/prisma";
import CoursesClient from "./CoursesClient";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function AdminCoursesPage() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "ADMIN") {
      redirect("/auth");
    }

    // Load all courses from database
    const dbCourses = await prisma.course.findMany({
      include: {
        faculty: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Serialize Decimal values for Next.js RSC transition
    const serializedCourses = dbCourses.map((c) => ({
      ...c,
      price: c.price.toString(),
      createdAt: c.createdAt.toISOString(),
    }));

    return (
      <div className="max-w-[1200px] mx-auto space-y-8 animate-fade-in-up pb-24">
        <CoursesClient initialCourses={serializedCourses as any} />
      </div>
    );
  } catch (error: any) {
    if (
      error.digest?.startsWith("NEXT_REDIRECT") ||
      error.digest === "DYNAMIC_SERVER_USAGE" ||
      error.message?.includes("Dynamic server usage")
    ) {
      throw error;
    }
    console.error("ADMIN_COURSES_PAGE_ERROR:", error);
    return (
      <div className="p-8 max-w-2xl mx-auto mt-12 text-center rounded-2xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
        <h3 className="heading-font text-xl font-bold text-red-500 mb-2">Failed to load courses page</h3>
        <p className="text-sm font-semibold mb-4" style={{ color: 'var(--text-secondary)' }}>
          A runtime server error occurred. Please check the message details below:
        </p>
        <div className="p-4 rounded-xl bg-red-500/10 text-red-500 text-left font-mono text-xs overflow-x-auto">
          {error.stack || error.message || String(error)}
        </div>
      </div>
    );
  }
}