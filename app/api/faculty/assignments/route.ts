import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

async function requireFaculty() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN")) {
    return null;
  }
  return session;
}

export async function GET() {
  const session = await requireFaculty();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const assignments = await prisma.assignment.findMany({
    where: session.user.role === "ADMIN" ? {} : { facultyId: session.user.id },
    include: {
      course: { select: { id: true, title: true } },
      submissions: {
        include: {
          student: { select: { id: true, name: true, fullName: true, email: true } },
        },
        orderBy: { submittedAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ assignments });
}

export async function POST(req: Request) {
  const session = await requireFaculty();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const title = String(body.title || "").trim();
  const courseId = String(body.courseId || "").trim();
  const description = String(body.description || "").trim();
  const dueDate = body.dueDate ? new Date(body.dueDate) : null;

  if (!title || !courseId) {
    return NextResponse.json({ message: "Course and title are required" }, { status: 400 });
  }

  const course = await prisma.course.findFirst({
    where:
      session.user.role === "ADMIN"
        ? { id: courseId }
        : { id: courseId, facultyId: session.user.id },
    select: { id: true, facultyId: true },
  });

  if (!course) {
    return NextResponse.json({ message: "Course not found" }, { status: 404 });
  }

  const assignment = await prisma.assignment.create({
    data: {
      title,
      description,
      courseId: course.id,
      facultyId: course.facultyId,
      dueDate: dueDate && !isNaN(dueDate.getTime()) ? dueDate : null,
    },
    include: {
      course: { select: { id: true, title: true } },
      submissions: true,
    },
  });

  return NextResponse.json({ assignment }, { status: 201 });
}

export async function DELETE(req: Request) {
  const session = await requireFaculty();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ message: "Assignment ID is required" }, { status: 400 });

  const existing = await prisma.assignment.findFirst({
    where: session.user.role === "ADMIN" ? { id } : { id, facultyId: session.user.id },
  });
  if (!existing) return NextResponse.json({ message: "Assignment not found" }, { status: 404 });

  await prisma.assignment.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
