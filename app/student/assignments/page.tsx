import AssignmentsClient from "./AssignmentsClient";
import { getSiteContent } from "@/lib/cms";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { accessibleCourses } from "@/lib/courseAccess";

export const dynamic = "force-dynamic";

export default async function AssignmentsPage() {
  const [cmsData, session] = await Promise.all([
    getSiteContent("student-assignments"),
    getServerSession(authOptions),
  ]);

  let initialAssignments: any[] = [];

  if (session?.user?.id) {
    try {
      const openCourses = await accessibleCourses(session.user.id);
      const courseIds = openCourses.map((course) => course.id);

      if (courseIds.length > 0) {
        const rows = await prisma.assignment.findMany({
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

        initialAssignments = rows.map((a) => {
          const mine = a.submissions[0];
          return {
            id: a.id,
            title: a.title,
            description: a.description,
            dueDate: a.dueDate?.toISOString() || null,
            courseId: a.course.id,
            course: a.course.title,
            status: (mine?.status || "PENDING").toLowerCase(),
            grade: mine?.grade || null,
            feedback: mine?.feedback || null,
          };
        });
      }
    } catch {
      initialAssignments = [];
    }
  }

  return <AssignmentsClient cmsData={cmsData} initialAssignments={initialAssignments} />;
}
