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
    if (!session || !session.user || (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { course_id } = await context.params;

    const course = await prisma.course.findUnique({
      where: { id: course_id },
      include: {
        enrollments: {
          include: {
            student: { select: { id: true, name: true, fullName: true, email: true, image: true } },
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    if (session.user.role !== "ADMIN" && course.facultyId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const enrolled = course.enrollments.filter((e) => e.paymentStatus === "COMPLETED");
    return NextResponse.json({
      course: {
        ...course,
        studentCount: enrolled.length,
        students: enrolled.map((row) => ({
          id: row.student.id,
          name: row.student.fullName || row.student.name || row.student.email,
          email: row.student.email,
          image: row.student.image,
        })),
      },
    });
  } catch (error: any) {
    console.error("Error fetching course:", error);
    return NextResponse.json({ error: "Failed to fetch course" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ course_id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { course_id } = await context.params;
    const body = await request.json();

    const existingCourse = await prisma.course.findUnique({
      where: { id: course_id }
    });

    if (!existingCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    if (session.user.role !== "ADMIN" && existingCourse.facultyId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedCourse = await prisma.course.update({
      where: { id: course_id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.price !== undefined && { price: parseFloat(body.price) || 0 }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.level !== undefined && { level: body.level }),
        ...(body.duration !== undefined && { duration: body.duration }),
        ...(body.image !== undefined && { image: body.image }),
        ...(body.curriculum !== undefined && { curriculum: body.curriculum }),
      }
    });

    return NextResponse.json({
      success: true,
      course: updatedCourse
    });
  } catch (error: any) {
    console.error("Error updating course:", error);
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 });
  }
}
