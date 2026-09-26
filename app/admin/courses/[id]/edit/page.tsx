import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import Link from "next/link";
import CourseEditClient from "../CourseEditClient";

export const dynamic = "force-dynamic";

export default async function AdminCourseEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== "ADMIN") {
    redirect("/auth");
  }

  const { id } = await params;
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      faculty: {
        select: { id: true, fullName: true, email: true },
      },
    },
  });

  if (!course) {
    return (
      <div className="max-w-xl mx-auto mt-12 text-center bg-white border border-slate-200 rounded-2xl p-8">
        <h2 className="text-xl font-extrabold text-slate-900 mb-2">Course not found</h2>
        <p className="text-sm text-slate-600 mb-5">This course could not be loaded.</p>
        <Link href="/admin/courses" className="text-sm font-semibold text-[#0055FF] hover:underline">
          ← Back to courses
        </Link>
      </div>
    );
  }

  const serialized = {
    ...course,
    price: course.price.toString(),
    createdAt: course.createdAt.toISOString(),
  };

  return <CourseEditClient initialCourse={serialized as any} />;
}
