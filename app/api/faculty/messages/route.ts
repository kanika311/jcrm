import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import {
  adminFacultyKey,
  createDirectMessage,
  findMessagesByThreads,
  instructorStudentKey,
  keysMatch,
} from "@/lib/directMessages";
import { sanitizeAttachments, toClientMessage } from "@/lib/chatAttachments";

function allowedFacultyThread(key: string, userId: string, role: string) {
  if (key === adminFacultyKey(userId)) return true;
  if (role === "ADMIN" && (key.startsWith("instructor:") || key.startsWith("admin-faculty:"))) return true;
  return key.startsWith(`instructor:${userId}:`);
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const facultyId = session.user.id;

  const enrollments = await prisma.enrollment.findMany({
    where: {
      paymentStatus: "COMPLETED",
      course: session.user.role === "ADMIN" ? {} : { facultyId },
    },
    include: {
      student: { select: { id: true, name: true, fullName: true, email: true, image: true } },
      course: { select: { title: true, facultyId: true } },
    },
  });

  const students = new Map<
    string,
    {
      id: string;
      name: string;
      email: string;
      image: string | null;
      courses: string[];
      instructorId: string;
    }
  >();

  for (const row of enrollments) {
    const sid = row.student.id;
    const instructorId = row.course.facultyId || facultyId;
    const existing = students.get(sid);
    if (existing) {
      if (!existing.courses.includes(row.course.title)) existing.courses.push(row.course.title);
    } else {
      students.set(sid, {
        id: sid,
        name: row.student.fullName || row.student.name || row.student.email,
        email: row.student.email,
        image: row.student.image,
        courses: [row.course.title],
        instructorId,
      });
    }
  }

  const threads = [
    {
      id: "jcrm-admin",
      threadKey: adminFacultyKey(facultyId),
      name: "JCRM Admin",
      subtitle: "Course reviews, payouts, and platform support",
      type: "admin" as const,
    },
    ...Array.from(students.values()).map((student) => ({
      id: student.id,
      threadKey: instructorStudentKey(student.instructorId, student.id),
      name: student.name,
      subtitle: student.courses.join(" · "),
      type: "student" as const,
      image: student.image,
    })),
  ];

  const messages = await findMessagesByThreads(threads.map((t) => t.threadKey));

  return NextResponse.json({
    threads: threads.map((thread) => ({
      ...thread,
      messages: messages
        .filter((m) => keysMatch(m.threadKey, thread.threadKey))
        .map((m) => toClientMessage(m)),
    })),
  });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const threadId = String(body.threadId || "");
  const text = String(body.text || "").trim();
  const attachments = sanitizeAttachments(body.attachments);
  if (!text && !attachments.length) return NextResponse.json({ message: "Message is required" }, { status: 400 });

  const facultyId = session.user.id;
  const threadKey = String(body.threadKey || "").trim()
    || (threadId === "jcrm-admin" ? adminFacultyKey(facultyId) : instructorStudentKey(facultyId, threadId));

  if (!allowedFacultyThread(threadKey, facultyId, session.user.role || "")) {
    return NextResponse.json({ message: "Invalid thread" }, { status: 400 });
  }

  const saved = await createDirectMessage({
    threadKey,
    senderRole: "instructor",
    senderId: facultyId,
    text,
    attachments,
  });

  return NextResponse.json({
    message: toClientMessage(saved),
  });
}
