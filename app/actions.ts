"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { revalidatePath } from "next/cache";

// --- HELPERS ---
async function getSession() {
  return await getServerSession(authOptions);
}

// --- COURSES ---
export async function getCourses() {
  return await prisma.course.findMany({
    where: { status: "PUBLISHED" },
    include: {
      faculty: { select: { fullName: true } },
      lessons: { select: { id: true } }, // just to get count
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCourseById(id: string) {
  return await prisma.course.findUnique({
    where: { id },
    include: {
      faculty: { select: { fullName: true, email: true } },
      lessons: { orderBy: { orderIndex: "asc" } },
    },
  });
}

// --- STUDENT ACTIONS ---
export async function getStudentDashboard() {
  const session = await getSession();
  if (!session || !session.user) {
    return {
      enrollments: [],
      activeCount: 0,
      completedCount: 0,
    };
  }

  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId: session.user.id },
      include: {
        course: {
          include: { faculty: { select: { fullName: true } } }
        }
      }
    });

    return {
      enrollments: enrollments || [],
      activeCount: enrollments?.length || 0,
      completedCount: enrollments?.filter(e => e.progressPercent === 100).length || 0,
    };
  } catch (err) {
    console.error("Error in getStudentDashboard:", err);
    return {
      enrollments: [],
      activeCount: 0,
      completedCount: 0,
    };
  }
}

export async function enrollInCourse(courseId: string) {
  const session = await getSession();
  if (!session || session.user.role !== "STUDENT") throw new Error("Unauthorized");

  // Check if already enrolled
  const existing = await prisma.enrollment.findUnique({
    where: { studentId_courseId: { studentId: session.user.id, courseId } },
  });

  if (existing) {
    return { success: false, message: "Already enrolled" };
  }

  // Create enrollment (mocking payment success)
  await prisma.enrollment.create({
    data: {
      studentId: session.user.id,
      courseId,
      paymentStatus: "COMPLETED",
      transactionId: `txn_mock_${Date.now()}`,
      progressPercent: 0,
    }
  });

  revalidatePath("/student");
  revalidatePath(`/courses/${courseId}`);
  return { success: true };
}

// --- INSTRUCTOR ACTIONS ---
export async function getFacultyDashboard() {
  const session = await getSession();
  if (!session || session.user.role !== "INSTRUCTOR") {
    return { courses: [], totalStudents: 0 };
  }

  try {
    const courses = await prisma.course.findMany({
      where: { facultyId: session.user.id },
      include: {
        _count: { select: { enrollments: true } },
      }
    });

    return {
      courses: courses || [],
      totalStudents: courses ? courses.reduce((acc, c) => acc + (c._count?.enrollments || 0), 0) : 0,
    };
  } catch (err) {
    console.error("Error in getFacultyDashboard:", err);
    return { courses: [], totalStudents: 0 };
  }
}

// --- ADMIN ACTIONS ---
export async function getAdminDashboard() {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN") {
    return {
      totalStudents: 0,
      totalInstructors: 0,
      totalCourses: 0,
      totalEnrollments: 0,
    };
  }

  try {
    const [totalStudents, totalInstructors, totalCourses, totalEnrollments] = await Promise.all([
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.user.count({ where: { role: "INSTRUCTOR" } }),
      prisma.course.count(),
      prisma.enrollment.count(),
    ]);

    return {
      totalStudents,
      totalInstructors,
      totalCourses,
      totalEnrollments,
    };
  } catch (err) {
    console.error("Error in getAdminDashboard:", err);
    return {
      totalStudents: 0,
      totalInstructors: 0,
      totalCourses: 0,
      totalEnrollments: 0,
    };
  }
}
