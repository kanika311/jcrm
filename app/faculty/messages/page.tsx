import { Suspense } from "react";
import FacultyMessagesClient from "./FacultyMessagesClient";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { adminFacultyKey, findMessagesByThreads, instructorStudentKey, keysMatch } from "@/lib/directMessages";
import { toClientMessage } from "@/lib/chatAttachments";

export const dynamic = "force-dynamic";

export default async function FacultyMessagesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN")) {
    redirect("/auth");
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
    { id: string; name: string; courses: string[]; image: string | null; instructorId: string }
  >();
  for (const row of enrollments) {
    const existing = students.get(row.student.id);
    if (existing) {
      if (!existing.courses.includes(row.course.title)) existing.courses.push(row.course.title);
    } else {
      students.set(row.student.id, {
        id: row.student.id,
        name: row.student.fullName || row.student.name || row.student.email,
        courses: [row.course.title],
        image: row.student.image,
        instructorId: row.course.facultyId || facultyId,
      });
    }
  }

  const initialThreads = [
    {
      id: "jcrm-admin",
      threadKey: adminFacultyKey(facultyId),
      name: "JCRM Admin",
      subtitle: "Course reviews, payouts, and platform support",
      type: "admin" as const,
      messages: [] as { id: string; senderRole: string; text: string; createdAt: string }[],
    },
    ...Array.from(students.values()).map((student) => ({
      id: student.id,
      threadKey: instructorStudentKey(student.instructorId, student.id),
      name: student.name,
      subtitle: student.courses.join(" · "),
      type: "student" as const,
      image: student.image,
      messages: [] as { id: string; senderRole: string; text: string; createdAt: string }[],
    })),
  ];

  const stored = await findMessagesByThreads(initialThreads.map((t) => t.threadKey));
  for (const thread of initialThreads) {
    thread.messages = stored
      .filter((m) => keysMatch(m.threadKey, thread.threadKey))
      .map((m) => toClientMessage(m));
  }

  return (
    <Suspense fallback={<div className="p-8 text-sm text-slate-500">Loading messages...</div>}>
      <FacultyMessagesClient initialThreads={initialThreads} />
    </Suspense>
  );
}
