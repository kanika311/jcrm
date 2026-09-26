import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import {
  createDirectMessage,
  findMessagesByThreads,
  instructorStudentKey,
  keysMatch,
  supportThreadKey,
} from "@/lib/directMessages";
import { sanitizeAttachments, toClientMessage } from "@/lib/chatAttachments";

function allowedStudentThread(key: string, studentId: string) {
  if (key === supportThreadKey(studentId)) return true;
  return key.startsWith("instructor:") && key.endsWith(`:${studentId}`);
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const studentId = session.user.id;
  const enrollments = await prisma.enrollment.findMany({
    where: { studentId, paymentStatus: "COMPLETED" },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          instructor: true,
          facultyId: true,
          faculty: { select: { id: true, name: true, fullName: true, email: true, image: true } },
        },
      },
    },
  });

  const instructors = new Map<
    string,
    { id: string; name: string; email: string; image: string | null; courses: string[] }
  >();

  for (const enrollment of enrollments) {
    const course = enrollment.course;
    const faculty = course.faculty;
    const id = faculty?.id || course.facultyId;
    if (!id) continue;
    const name = faculty?.fullName || faculty?.name || course.instructor || "Course Instructor";
    const existing = instructors.get(id);
    if (existing) {
      if (!existing.courses.includes(course.title)) existing.courses.push(course.title);
    } else {
      instructors.set(id, {
        id,
        name,
        email: faculty?.email || "",
        image: faculty?.image || null,
        courses: [course.title],
      });
    }
  }

  const threads = [
    {
      id: "jcrm-support",
      threadKey: supportThreadKey(studentId),
      name: "JCRM Admin",
      subtitle: "Payments, access, and account help — always available",
      type: "support" as const,
    },
    ...Array.from(instructors.values()).map((instructor) => ({
      id: instructor.id,
      threadKey: instructorStudentKey(instructor.id, studentId),
      name: instructor.name,
      subtitle: instructor.courses.join(" · "),
      type: "instructor" as const,
      image: instructor.image,
    })),
  ];

  const messages = await findMessagesByThreads(threads.map((t) => t.threadKey));

  const supportExtras = session.user.email
    ? await prisma.contactMessage
        .findMany({
          where: { source: "student-messages", email: session.user.email },
          orderBy: { createdAt: "asc" },
        })
        .catch(() => [])
    : [];

  return NextResponse.json({
    threads: threads.map((thread) => {
      const threadMessages = messages
        .filter((m) => keysMatch(m.threadKey, thread.threadKey))
        .map((m) => toClientMessage(m));

      if (thread.type === "support") {
        for (const row of supportExtras) {
          const already = threadMessages.some(
            (m) => m.text === row.message && m.createdAt === row.createdAt.toISOString()
          );
          if (already) continue;
          threadMessages.push({
            id: row.id,
            senderRole: "student",
            text: row.message,
            attachments: [],
            createdAt: row.createdAt.toISOString(),
          });
        }
        threadMessages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      }

      return { ...thread, messages: threadMessages };
    }),
  });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const threadId = String(body.threadId || "");
  const text = String(body.text || "").trim();
  const attachments = sanitizeAttachments(body.attachments);
  if (!text && !attachments.length) {
    return NextResponse.json({ message: "Message is required" }, { status: 400 });
  }

  const studentId = session.user.id;
  const threadKey =
    String(body.threadKey || "").trim() ||
    (threadId === "jcrm-support" ? supportThreadKey(studentId) : instructorStudentKey(threadId, studentId));

  if (!allowedStudentThread(threadKey, studentId)) {
    return NextResponse.json({ message: "Invalid thread" }, { status: 400 });
  }

  const saved = await createDirectMessage({
    threadKey,
    senderRole: "student",
    senderId: studentId,
    text,
    attachments,
  });

  if (threadKey === supportThreadKey(studentId)) {
    await prisma.contactMessage
      .create({
        data: {
          firstName: session.user.name?.split(" ")[0] || "Student",
          lastName: session.user.name?.split(" ").slice(1).join(" ") || "",
          email: session.user.email || "",
          subject: "Student support chat",
          message: text,
          source: "student-messages",
        },
      })
      .catch(() => null);
  }

  return NextResponse.json({
    message: toClientMessage(saved),
  });
}
