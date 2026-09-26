import MessagesClient from "./MessagesClient";
import { getSiteContent } from "@/lib/cms";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { findMessagesByThreads, instructorStudentKey, keysMatch, supportThreadKey } from "@/lib/directMessages";
import { toClientMessage } from "@/lib/chatAttachments";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const [cmsData, session] = await Promise.all([
    getSiteContent("student-messages"),
    getServerSession(authOptions),
  ]);

  const studentId = session?.user?.id || "";
  const threads: any[] = [
    {
      id: "jcrm-support",
      threadKey: studentId ? supportThreadKey(studentId) : "support:guest",
      name: "JCRM Admin",
      subtitle: "Payments, access, and account help — always available",
      type: "support",
      messages: [],
    },
  ];

  if (studentId) {
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId, paymentStatus: "COMPLETED" },
      include: {
        course: {
          select: {
            title: true,
            instructor: true,
            facultyId: true,
            faculty: { select: { id: true, name: true, fullName: true, image: true } },
          },
        },
      },
    });

    const seen = new Map<string, { id: string; name: string; courses: string[]; image: string | null }>();
    for (const enrollment of enrollments) {
      const course = enrollment.course;
      const id = course.faculty?.id || course.facultyId;
      if (!id) continue;
      const name = course.faculty?.fullName || course.faculty?.name || course.instructor || "Course Instructor";
      const existing = seen.get(id);
      if (existing) {
        if (!existing.courses.includes(course.title)) existing.courses.push(course.title);
      } else {
        seen.set(id, { id, name, courses: [course.title], image: course.faculty?.image || null });
      }
    }

    for (const instructor of seen.values()) {
      threads.push({
        id: instructor.id,
        threadKey: instructorStudentKey(instructor.id, studentId),
        name: instructor.name,
        subtitle: instructor.courses.join(" · "),
        type: "instructor",
        image: instructor.image,
        messages: [],
      });
    }

    const stored = await findMessagesByThreads(threads.map((t) => t.threadKey));
    for (const thread of threads) {
      thread.messages = stored
        .filter((m) => keysMatch(m.threadKey, thread.threadKey))
        .map((m) => toClientMessage(m));
    }
  }

  return <MessagesClient cmsData={cmsData} initialThreads={threads} />;
}
