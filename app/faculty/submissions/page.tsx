import SubmissionsClient from "./SubmissionsClient";
import { getSiteContent } from "@/lib/cms";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SubmissionsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN")) {
    redirect("/auth");
  }

  const [cmsData, courses] = await Promise.all([
    getSiteContent("faculty-submissions"),
    prisma.course.findMany({
      where: session.user.role === "ADMIN" ? {} : { facultyId: session.user.id },
      select: { id: true, title: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  let assignments: any[] = [];
  try {
    assignments = await prisma.assignment.findMany({
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
  } catch {
    assignments = [];
  }

  const serialized = assignments.map((a) => ({
    ...a,
    dueDate: a.dueDate?.toISOString() || null,
    createdAt: a.createdAt.toISOString(),
    submissions: a.submissions.map((s) => ({
      ...s,
      submittedAt: s.submittedAt.toISOString(),
    })),
  }));

  return (
    <SubmissionsClient
      cmsData={cmsData}
      courses={courses}
      initialAssignments={serialized as any}
    />
  );
}
