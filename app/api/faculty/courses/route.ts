import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ message: "Unauthorized. Instructor access required." }, { status: 401 });
    }

    const courses = await prisma.course.findMany({
      where: session.user.role === "ADMIN" ? {} : { facultyId: session.user.id },
      include: {
        _count: { select: { enrollments: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ courses });
  } catch (error: any) {
    console.error("[FACULTY_COURSES_GET_ERROR]", error);
    return NextResponse.json({ message: error.message || "Failed to fetch courses" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ message: "Unauthorized. Instructor access required." }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, category, level, price, image, status } = body;

    if (!title || title.trim().length === 0) {
      return NextResponse.json({ message: "Course title is required." }, { status: 400 });
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return NextResponse.json({ message: "A valid price is required." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, fullName: true },
    });
    const instructorName = user?.name || user?.fullName || "JCRM Instructor";

    const newCourse = await prisma.course.create({
      data: {
        facultyId: session.user.id,
        title: title.trim(),
        description: description?.trim() || "Comprehensive practical engineering course created by JCRM faculty.",
        tags: category ? [category] : ["Engineering"],
        level: level || "Beginner",
        price: parsedPrice,
        image: image || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
        instructor: instructorName,
        instructorRole: "Senior Tech Instructor",
        status: status === "DRAFT" ? "DRAFT" : "PUBLISHED",
        duration: "3 Months • 120 Hours",
      },
    });

    return NextResponse.json({ success: true, course: newCourse }, { status: 201 });
  } catch (error: any) {
    console.error("[FACULTY_COURSES_POST_ERROR]", error);
    return NextResponse.json({ message: error.message || "Failed to create course" }, { status: 500 });
  }
}
