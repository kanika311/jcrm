import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const courses = await prisma.course.findMany({
      include: {
        faculty: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ courses }, { status: 200 });
  } catch (error) {
    console.error("[ADMIN_COURSES_GET]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, status, title, description, price } = body;

    if (!id) {
      return NextResponse.json({ message: "Course ID is required" }, { status: 400 });
    }

    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = Number(price);

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, course: updatedCourse }, { status: 200 });
  } catch (error) {
    console.error("[ADMIN_COURSE_UPDATE]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
