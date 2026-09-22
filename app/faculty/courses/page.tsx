import CoursesClient from "./CoursesClient";
import { getSiteContent } from "@/lib/cms";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function FacultyCoursesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN")) {
    redirect("/auth");
  }

  const [cmsData, dbCourses] = await Promise.all([
    getSiteContent("faculty-courses"),
    prisma.course.findMany({
      where: session.user.role === "ADMIN" ? {} : { facultyId: session.user.id },
      include: {
        _count: { select: { enrollments: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const courses = dbCourses.map((c) => ({
    id: c.id,
    title: c.title,
    status: c.status === "PUBLISHED" ? "published" : "draft",
    students: c._count.enrollments || 0,
    rating: 4.9,
    price: c.price,
    revenue: `₹${((c._count.enrollments || 0) * c.price).toLocaleString()}`,
    image: c.image || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
    level: c.level || "Beginner",
    description: c.description,
  }));

  return <CoursesClient cmsData={cmsData} initialCourses={courses} />;
}
