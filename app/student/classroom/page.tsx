import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ClassroomClient from "./ClassroomClient";

export const dynamic = "force-dynamic";

export default async function StudentClassroomPage({
  searchParams,
}: {
  searchParams: Promise<{ courseId?: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/auth?callbackUrl=/student/classroom");
  }

  const { courseId } = await searchParams;

  // Fetch enrolled courses for this student
  let enrolledCourses: { id: string; title: string }[] = [];

  if (session.user.role === "ADMIN") {
    // Admin can access all courses
    const allCourses = await prisma.course.findMany({
      select: { id: true, title: true },
      orderBy: { createdAt: "desc" }
    });
    enrolledCourses = allCourses;
  } else if (session.user.role === "INSTRUCTOR") {
    // Instructor can access their own courses
    const facultyCourses = await prisma.course.findMany({
      where: { facultyId: session.user.id },
      select: { id: true, title: true },
      orderBy: { createdAt: "desc" }
    });
    enrolledCourses = facultyCourses;
  } else {
    // Student enrolled courses
    const enrollments = await prisma.enrollment.findMany({
      where: {
        studentId: session.user.id,
        paymentStatus: "COMPLETED",
      },
      include: {
        course: {
          select: { id: true, title: true }
        }
      },
      orderBy: { enrolledAt: "desc" }
    });
    enrolledCourses = enrollments.map(e => e.course);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ClassroomClient
        enrolledCourses={enrolledCourses}
        initialCourseId={courseId}
      />
    </div>
  );
}
