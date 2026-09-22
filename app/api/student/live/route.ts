import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find all active enrollments for this student
    const enrollments = await prisma.enrollment.findMany({
      where: {
        studentId: session.user.id,
        paymentStatus: "COMPLETED",
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            instructor: true,
            image: true,
            curriculum: true,
          }
        }
      }
    });

    const enrolledCourseIds = enrollments.map(e => e.courseId);

    // Extract live sessions from enrolled courses
    const allLiveSessions: any[] = [];
    const pastRecordings: any[] = [];

    for (const enrollment of enrollments) {
      const course = enrollment.course;
      const curriculum = course.curriculum as any;
      if (curriculum?.liveSessions && Array.isArray(curriculum.liveSessions)) {
        for (const ls of curriculum.liveSessions) {
          allLiveSessions.push({
            ...ls,
            courseId: course.id,
            courseTitle: course.title,
            instructor: course.instructor,
            courseImage: course.image,
          });
        }
      }

      // Also gather recorded lectures from modules
      if (curriculum?.modules && Array.isArray(curriculum.modules)) {
        for (const mod of curriculum.modules) {
          if (mod.lessons && Array.isArray(mod.lessons)) {
            for (const les of mod.lessons) {
              if (les.videoUrl) {
                pastRecordings.push({
                  id: les.id,
                  title: les.title,
                  moduleTitle: mod.title,
                  courseId: course.id,
                  courseTitle: course.title,
                  duration: les.duration || "45m",
                  videoUrl: les.videoUrl,
                  notes: les.notes || "",
                  date: les.date || mod.releaseDate || "Previous Day",
                  courseImage: course.image,
                });
              }
            }
          }
        }
      }
    }

    // Sort live sessions by scheduled date
    allLiveSessions.sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

    return NextResponse.json({
      sessions: allLiveSessions,
      pastRecordings,
      enrolledCoursesCount: enrollments.length,
      courses: enrollments.map(e => ({ id: e.course.id, title: e.course.title }))
    });
  } catch (error: any) {
    console.error("Error fetching student live sessions:", error);
    return NextResponse.json({ error: "Failed to fetch live sessions" }, { status: 500 });
  }
}
