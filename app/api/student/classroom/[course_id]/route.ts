import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  context: { params: Promise<{ course_id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { course_id } = await context.params;

    // Check if student is enrolled or if user is ADMIN / INSTRUCTOR of the course
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        studentId: session.user.id,
        courseId: course_id,
        paymentStatus: "COMPLETED",
      }
    });

    const course = await prisma.course.findUnique({
      where: { id: course_id },
      include: {
        faculty: {
          select: { name: true, fullName: true, image: true }
        }
      }
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const isPrivileged = session.user.role === "ADMIN" || course.facultyId === session.user.id;

    if (!enrollment && !isPrivileged) {
      return NextResponse.json({ error: "You are not enrolled in this course" }, { status: 403 });
    }

    return NextResponse.json({
      course: {
        id: course.id,
        title: course.title,
        description: course.description,
        instructor: course.instructor || course.faculty?.fullName || course.faculty?.name,
        instructorImage: course.faculty?.image,
        image: course.image,
        curriculum: course.curriculum || { modules: [], liveSessions: [] },
      },
      enrollment: enrollment ? {
        progressPercent: enrollment.progressPercent,
        enrolledAt: enrollment.enrolledAt,
      } : null,
    });
  } catch (error: any) {
    console.error("Error fetching classroom course:", error);
    return NextResponse.json({ error: "Failed to fetch classroom data" }, { status: 500 });
  }
}
