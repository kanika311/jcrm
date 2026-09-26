import StudentsClient from "./StudentsClient";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function StudentsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN")) {
    redirect("/auth");
  }

  const courseWhere = session.user.role === "ADMIN" ? {} : { facultyId: session.user.id };

  const [courses, enrollments] = await Promise.all([
    prisma.course.findMany({
      where: courseWhere,
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    }),
    prisma.enrollment.findMany({
      where: {
        paymentStatus: "COMPLETED",
        course: courseWhere,
      },
      include: {
        student: { select: { id: true, name: true, fullName: true, email: true, image: true } },
        course: { select: { id: true, title: true } },
      },
      orderBy: { enrolledAt: "desc" },
    }),
  ]);

  const gradeByKey = new Map<string, string[]>();
  try {
    const submissions = await prisma.assignmentSubmission.findMany({
      where: {
        status: "GRADED",
        assignment: { courseId: { in: courses.map((c) => c.id) } },
      },
      select: {
        studentId: true,
        grade: true,
        assignment: { select: { courseId: true } },
      },
    });
    for (const submission of submissions) {
      if (!submission.grade) continue;
      const key = `${submission.studentId}:${submission.assignment.courseId}`;
      const list = gradeByKey.get(key) || [];
      list.push(submission.grade);
      gradeByKey.set(key, list);
    }
  } catch {
    // Assignment tables may not be generated yet
  }

  const students = enrollments.map((row) => {
    const grades = gradeByKey.get(`${row.studentId}:${row.courseId}`) || [];
    return {
      id: row.id,
      studentId: row.studentId,
      name: row.student.fullName || row.student.name || row.student.email,
      email: row.student.email,
      image: row.student.image,
      courseId: row.course.id,
      course: row.course.title,
      enrolledAt: row.enrolledAt.toISOString(),
      progress: row.progressPercent || 0,
      grade: grades[0] || "—",
    };
  });

  return <StudentsClient students={students} courses={courses} />;
}
