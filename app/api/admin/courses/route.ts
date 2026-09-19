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

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, price, status, level, tags, badge, image, instructor, instructorRole, duration, whatYouLearn, curriculum } = body;

    if (!title || price === undefined) {
      return NextResponse.json({ message: "Title and price are required" }, { status: 400 });
    }

    let facultyId = session.user.id;
    if (!facultyId) {
      const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
      if (admin) facultyId = admin.id;
    }

    const parsedTags = Array.isArray(tags)
      ? tags
      : tags
      ? String(tags).split(",").map((t: string) => t.trim()).filter(Boolean)
      : [];

    const newCourse = await prisma.course.create({
      data: {
        title: title.trim(),
        description: description || "",
        price: Number(price) || 0,
        status: status || "PUBLISHED",
        level: level || "Beginner",
        tags: parsedTags,
        badge: badge || null,
        image: image || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
        instructor: instructor || "JCRM Faculty",
        instructorRole: instructorRole || "Senior Tech Instructor",
        duration: duration || "3 Months • 120 Hours",
        whatYouLearn: Array.isArray(whatYouLearn) ? whatYouLearn : [],
        curriculum: curriculum || null,
        facultyId: facultyId!,
      },
      include: {
        faculty: {
          select: { id: true, fullName: true, email: true },
        },
      },
    });

    return NextResponse.json({ success: true, course: newCourse }, { status: 201 });
  } catch (error) {
    console.error("[ADMIN_COURSE_CREATE]", error);
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
    const { id, status, title, description, price, level, tags, badge, image, instructor, instructorRole, duration, whatYouLearn, curriculum } = body;

    if (!id) {
      return NextResponse.json({ message: "Course ID is required" }, { status: 400 });
    }

    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = Number(price);
    if (level !== undefined) updateData.level = level;
    if (badge !== undefined) updateData.badge = badge;
    if (image !== undefined) updateData.image = image;
    if (instructor !== undefined) updateData.instructor = instructor;
    if (instructorRole !== undefined) updateData.instructorRole = instructorRole;
    if (duration !== undefined) updateData.duration = duration;
    if (whatYouLearn !== undefined) updateData.whatYouLearn = Array.isArray(whatYouLearn) ? whatYouLearn : [];
    if (curriculum !== undefined) updateData.curriculum = curriculum;
    if (tags !== undefined) {
      updateData.tags = Array.isArray(tags)
        ? tags
        : String(tags).split(",").map((t: string) => t.trim()).filter(Boolean);
    }

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: updateData,
      include: {
        faculty: {
          select: { id: true, fullName: true, email: true },
        },
      },
    });

    return NextResponse.json({ success: true, course: updatedCourse }, { status: 200 });
  } catch (error) {
    console.error("[ADMIN_COURSE_UPDATE]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Course ID is required" }, { status: 400 });
    }

    // Delete child relations first
    await prisma.enrollment.deleteMany({ where: { courseId: id } });
    await prisma.lesson.deleteMany({ where: { courseId: id } });
    await prisma.course.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Course deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("[ADMIN_COURSE_DELETE]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
