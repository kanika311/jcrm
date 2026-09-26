import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import {
  adminFacultyKey,
  countAdminUnread,
  createDirectMessage,
  findMessagesByPrefix,
  findMessagesByThreads,
  instructorStudentKey,
  markAdminThreadRead,
  supportThreadKey,
  unreadCountsByThread,
  keysMatch,
} from "@/lib/directMessages";
import { sanitizeAttachments, toClientMessage } from "@/lib/chatAttachments";

function isOid(id: string) {
  return /^[a-f0-9]{24}$/i.test(id);
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const [instructors, enrollments, supportMsgs, facultyMsgs, courseMsgs] = await Promise.all([
    prisma.user.findMany({
      where: { role: "INSTRUCTOR" },
      select: { id: true, name: true, fullName: true, email: true, image: true },
    }),
    prisma.enrollment.findMany({
      where: { paymentStatus: "COMPLETED" },
      include: {
        student: { select: { id: true, name: true, fullName: true, email: true, image: true } },
        course: { select: { title: true, facultyId: true, instructor: true } },
      },
    }),
    findMessagesByPrefix("support:"),
    findMessagesByPrefix("admin-faculty:"),
    findMessagesByPrefix("instructor:"),
  ]);

  const threads: {
    id: string;
    threadKey: string;
    name: string;
    subtitle: string;
    type: "instructor" | "student" | "course";
    image?: string | null;
  }[] = [];

  const seen = new Set<string>();
  const pushThread = (thread: (typeof threads)[number]) => {
    if (seen.has(thread.threadKey)) return;
    seen.add(thread.threadKey);
    threads.push(thread);
  };

  for (const instructor of instructors) {
    pushThread({
      id: adminFacultyKey(instructor.id),
      threadKey: adminFacultyKey(instructor.id),
      name: instructor.fullName || instructor.name || instructor.email,
      subtitle: "Instructor · JCRM Admin chat",
      type: "instructor",
      image: instructor.image,
    });
  }

  const extraFacultyIds = Array.from(
    new Set(
      facultyMsgs
        .map((msg) => msg.threadKey.replace("admin-faculty:", ""))
        .filter((id) => isOid(id) && !instructors.some((inst) => inst.id === id))
    )
  );
  if (extraFacultyIds.length) {
    const extraFaculty = await prisma.user.findMany({
      where: { id: { in: extraFacultyIds } },
      select: { id: true, name: true, fullName: true, email: true, image: true },
    });
    for (const user of extraFaculty) {
      pushThread({
        id: adminFacultyKey(user.id),
        threadKey: adminFacultyKey(user.id),
        name: user.fullName || user.name || user.email,
        subtitle: "Instructor · JCRM Admin chat",
        type: "instructor",
        image: user.image,
      });
    }
  }

  const students = new Map<string, { id: string; name: string; email: string; image: string | null }>();
  for (const row of enrollments) {
    students.set(row.student.id, {
      id: row.student.id,
      name: row.student.fullName || row.student.name || row.student.email,
      email: row.student.email,
      image: row.student.image,
    });
  }
  const missingStudentIds = Array.from(
    new Set(
      supportMsgs
        .map((msg) => msg.threadKey.replace("support:", ""))
        .filter((id) => isOid(id) && !students.has(id))
    )
  );
  if (missingStudentIds.length) {
    const extraStudents = await prisma.user.findMany({
      where: { id: { in: missingStudentIds } },
      select: { id: true, name: true, fullName: true, email: true, image: true },
    });
    for (const user of extraStudents) {
      students.set(user.id, {
        id: user.id,
        name: user.fullName || user.name || user.email,
        email: user.email,
        image: user.image,
      });
    }
    for (const id of missingStudentIds) {
      if (!students.has(id)) {
        students.set(id, { id, name: "Student", email: "", image: null });
      }
    }
  }

  for (const student of students.values()) {
    pushThread({
      id: supportThreadKey(student.id),
      threadKey: supportThreadKey(student.id),
      name: student.name,
      subtitle: "Student · JCRM Admin support",
      type: "student",
      image: student.image,
    });
  }

  const coursePairs = Array.from(
    new Set(courseMsgs.map((msg) => msg.threadKey).filter((key) => key.startsWith("instructor:")))
  ).map((key) => {
    const parts = key.split(":");
    return { key, facultyId: parts[1], studentId: parts[2] };
  }).filter((row) => row.facultyId && row.studentId);

  if (coursePairs.length) {
    const courseUserIds = Array.from(new Set(coursePairs.flatMap((row) => [row.facultyId, row.studentId])));
    const courseUsers = await prisma.user.findMany({
      where: { id: { in: courseUserIds } },
      select: { id: true, name: true, fullName: true, image: true },
    });
    const byId = new Map(courseUsers.map((user) => [user.id, user]));
    for (const row of coursePairs) {
      const faculty = byId.get(row.facultyId);
      const student = byId.get(row.studentId);
      pushThread({
        id: instructorStudentKey(row.facultyId, row.studentId),
        threadKey: instructorStudentKey(row.facultyId, row.studentId),
        name: `${student?.fullName || student?.name || "Student"} ↔ ${faculty?.fullName || faculty?.name || "Instructor"}`,
        subtitle: "Course chat",
        type: "course",
        image: student?.image,
      });
    }
  }

  const messages = await findMessagesByThreads(threads.map((t) => t.threadKey));
  const unreadMap = await unreadCountsByThread(threads.map((t) => t.threadKey));

  const hydrated = threads.map((thread) => ({
    ...thread,
    unread: unreadMap[thread.threadKey] || 0,
    messages: messages
      .filter((m) => keysMatch(m.threadKey, thread.threadKey))
      .map((m) => toClientMessage(m)),
  }));

  hydrated.sort((a, b) => {
    const aTime = a.messages.length ? new Date(a.messages[a.messages.length - 1].createdAt).getTime() : 0;
    const bTime = b.messages.length ? new Date(b.messages[b.messages.length - 1].createdAt).getTime() : 0;
    if (a.unread && !b.unread) return -1;
    if (!a.unread && b.unread) return 1;
    return bTime - aTime;
  });

  return NextResponse.json({
    unread: await countAdminUnread(),
    threads: hydrated,
  });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const threadKey = String(body.threadKey || "").trim();
  const text = String(body.text || "").trim();
  const attachments = sanitizeAttachments(body.attachments);
  if (!threadKey || (!text && !attachments.length)) {
    return NextResponse.json({ message: "Thread and message are required" }, { status: 400 });
  }

  if (
    !threadKey.startsWith("support:") &&
    !threadKey.startsWith("admin-faculty:") &&
    !threadKey.startsWith("instructor:")
  ) {
    return NextResponse.json({ message: "Invalid thread" }, { status: 400 });
  }

  const senderRole = threadKey.startsWith("support:") ? "support" : "admin";
  const saved = await createDirectMessage({
    threadKey,
    senderRole,
    senderId: session.user.id,
    text,
    attachments,
  });
  await markAdminThreadRead(threadKey);

  return NextResponse.json({
    unread: await countAdminUnread(),
    message: toClientMessage(saved),
  });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  await markAdminThreadRead(String(body.threadKey || ""));
  return NextResponse.json({ unread: await countAdminUnread() });
}
