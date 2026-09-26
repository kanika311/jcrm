import CalendarClient, { type CalendarEvent } from "./CalendarClient";
import { getSiteContent } from "@/lib/cms";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const [cmsData, session] = await Promise.all([
    getSiteContent("student-calendar"),
    getServerSession(authOptions),
  ]);

  const events: CalendarEvent[] = [];

  if (session?.user?.id) {
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId: session.user.id, paymentStatus: "COMPLETED" },
      include: {
        course: {
          select: { id: true, title: true, instructor: true, curriculum: true },
        },
      },
    });

    const courseIds = enrollments.map((e) => e.courseId);

    for (const enrollment of enrollments) {
      const course = enrollment.course;
      const curriculum = (course.curriculum || {}) as any;
      const liveSessions = Array.isArray(curriculum.liveSessions) ? curriculum.liveSessions : [];
      for (const sessionItem of liveSessions) {
        if (!sessionItem?.scheduledAt) continue;
        events.push({
          id: `live-${sessionItem.id || sessionItem.scheduledAt}`,
          title: sessionItem.title || "Live class",
          subtitle: course.instructor ? `${course.title} · ${course.instructor}` : course.title,
          at: new Date(sessionItem.scheduledAt).toISOString(),
          type: "live",
          durationMin: Number(sessionItem.duration) || 60,
        });
      }
    }

    if (courseIds.length > 0) {
      try {
        const assignments = await prisma.assignment.findMany({
          where: { courseId: { in: courseIds }, dueDate: { not: null } },
          include: { course: { select: { title: true } } },
        });
        for (const assignment of assignments) {
          if (!assignment.dueDate) continue;
          events.push({
            id: `due-${assignment.id}`,
            title: `${assignment.title} due`,
            subtitle: assignment.course.title,
            at: assignment.dueDate.toISOString(),
            type: "assignment",
          });
        }
      } catch {
        // Prisma client may not have Assignment until generate
      }
    }
  }

  events.sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());

  return <CalendarClient cmsData={cmsData} events={events} />;
}
