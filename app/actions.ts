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
  if (!session || session.user.role !== "STUDENT") throw new Error("Unauthorized");

  const enrollments = await prisma.enrollment.findMany({
    where: { studentId: session.user.id },
    include: {
      course: {
        include: { faculty: { select: { fullName: true } } }
      }
    }
  });

  return {
    enrollments,
    activeCount: enrollments.length,
    completedCount: enrollments.filter(e => e.progressPercent === 100).length,
  };
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
  if (!session || session.user.role !== "INSTRUCTOR") throw new Error("Unauthorized");

  const courses = await prisma.course.findMany({
    where: { facultyId: session.user.id },
    include: {
      _count: { select: { enrollments: true } },
    }
  });

  return {
    courses,
    totalStudents: courses.reduce((acc, c) => acc + c._count.enrollments, 0),
  };
}

// --- ADMIN ACTIONS ---
export async function getAdminDashboard() {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");

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
}
