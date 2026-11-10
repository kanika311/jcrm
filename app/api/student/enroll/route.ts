import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getRegistrationState } from "@/lib/courseAccess";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Please log in to your student account to enroll in this course." }, { status: 401 });
    }

    const { courseId } = await req.json();
    if (!courseId) {
      return NextResponse.json({ message: "Course ID is required." }, { status: 400 });
    }

    // Find course in database
    let course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      const allCourses = await prisma.course.findMany();
      course = allCourses.find(c => 
        c.id === courseId || 
        c.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") === courseId.toLowerCase()
      ) || null;
    }

    if (!course) {
      return NextResponse.json({ message: "Course not found." }, { status: 404 });
    }

    // Server-side authorization check: verify registration access or free course
    const access = await getRegistrationState(session.user.id);
    const isFree = course.price <= 0 || (access?.fee ?? 499) <= 0;
    const isAdmin = session.user.role === "ADMIN";

    if (!isAdmin && !isFree && !access?.hasAccess) {
      return NextResponse.json({
        message: "Payment required. Please complete course checkout via Razorpay.",
        requiresPayment: true,
      }, { status: 402 });
    }

    // Check if user is already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: session.user.id,
          courseId: course.id,
        },
      },
    });

    if (existingEnrollment) {
      return NextResponse.json({
        success: true,
        alreadyEnrolled: true,
        message: "You are already enrolled in this course!",
        enrollmentId: existingEnrollment.id,
      });
    }

    // Create new enrollment
    const newEnrollment = await prisma.enrollment.create({
      data: {
        studentId: session.user.id,
        courseId: course.id,
        paymentStatus: "COMPLETED",
        transactionId: isFree ? `FREE_${Date.now()}` : `ADMIN_${Date.now()}`,
        progressPercent: 0,
      },
    });

    return NextResponse.json({
      success: true,
      alreadyEnrolled: false,
      message: `Congratulations! You have successfully enrolled in ${course.title}.`,
      enrollmentId: newEnrollment.id,
    });
  } catch (error: any) {
    console.error("[STUDENT_ENROLL_ERROR]", error);
    return NextResponse.json(
      { message: error.message || "Failed to complete enrollment. Please try again." },
      { status: 500 }
    );
  }
}
