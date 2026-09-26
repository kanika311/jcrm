import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const content = String(body.content || "").trim();

  const assignment = await prisma.assignment.findUnique({
    where: { id },
    select: { id: true, courseId: true },
  });
  if (!assignment) {
    return NextResponse.json({ message: "Assignment not found" }, { status: 404 });
  }

  const enrolled = await prisma.enrollment.findFirst({
    where: {
      studentId: session.user.id,
      courseId: assignment.courseId,
      paymentStatus: "COMPLETED",
    },
  });
  if (!enrolled) {
    return NextResponse.json({ message: "You are not enrolled in this course" }, { status: 403 });
  }

  const submission = await prisma.assignmentSubmission.upsert({
    where: {
      assignmentId_studentId: {
        assignmentId: assignment.id,
        studentId: session.user.id,
      },
    },
    update: {
      content,
      status: "SUBMITTED",
      submittedAt: new Date(),
    },
    create: {
      assignmentId: assignment.id,
      studentId: session.user.id,
      content,
      status: "SUBMITTED",
    },
  });

  return NextResponse.json({ submission });
}
