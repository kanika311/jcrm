import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import BuilderClient from "./BuilderClient";

export const dynamic = "force-dynamic";

export default async function FacultyCourseBuilderPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN")) {
    redirect("/auth?callbackUrl=/faculty/courses/builder");
  }

  // Fetch all courses owned by this instructor
  const courses = await prisma.course.findMany({
    where: session.user.role === "ADMIN" ? {} : { facultyId: session.user.id },
    select: {
      id: true,
      title: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BuilderClient initialCourses={courses} />
    </div>
  );
}
