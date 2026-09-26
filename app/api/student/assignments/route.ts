import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const enrollments = await prisma.enrollment.findMany({
    where: { studentId: session.user.id, paymentStatus: "COMPLETED" },
    select: { courseId: true },
  });

  const courseIds = enrollments.map((e) => e.courseId);
  if (courseIds.length === 0) {
    return NextResponse.json({ assignments: [] });
  }

  const assignments = await prisma.assignment.findMany({
    where: { courseId: { in: courseIds } },
    include: {
      course: { select: { id: true, title: true } },
      submissions: {
        where: { studentId: session.user.id },
        take: 1,
      },
    },
    orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json({
    assignments: assignments.map((a) => {
      const mine = a.submissions[0];
      return {
        id: a.id,
        title: a.title,
        description: a.description,
        dueDate: a.dueDate,
        courseId: a.course.id,
        course: a.course.title,
        status: mine?.status?.toLowerCase() || "pending",
        grade: mine?.grade || null,
        feedback: mine?.feedback || null,
        submittedAt: mine?.submittedAt || null,
      };
    }),
  });
}
