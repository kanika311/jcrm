import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { createRazorpayOrder } from "@/lib/razorpay";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Please log in to purchase course" }, { status: 401 });
    }

    const { courseId } = await request.json();
    if (!courseId) {
      return NextResponse.json({ error: "Missing courseId" }, { status: 400 });
    }

    // Try finding by ObjectId or slug/title
    let course = null;
    if (/^[0-9a-fA-F]{24}$/.test(courseId)) {
      course = await prisma.course.findUnique({
        where: { id: courseId },
        select: { id: true, title: true, price: true }
      });
    }

    if (!course) {
      const slugTitle = courseId.replace(/-/g, " ");
      course = await prisma.course.findFirst({
        where: {
          title: { contains: slugTitle, mode: "insensitive" }
        },
        select: { id: true, title: true, price: true }
      });
    }

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Check if already enrolled
    const existing = await prisma.enrollment.findFirst({
      where: {
        studentId: session.user.id,
        courseId: course.id,
        paymentStatus: "COMPLETED",
      }
    });

    if (existing) {
      return NextResponse.json({
        alreadyEnrolled: true,
        message: "You are already enrolled in this course"
      });
    }

    const rawPrice = course.price;
    const numericPrice = typeof rawPrice === "number"
      ? rawPrice
      : parseFloat(String(rawPrice).replace(/[^0-9.]/g, "")) || 0;

    // If free course (₹0)
    if (numericPrice <= 0) {
      await prisma.enrollment.upsert({
        where: {
          studentId_courseId: {
            studentId: session.user.id,
            courseId: course.id,
          }
        },
        update: { paymentStatus: "COMPLETED" },
        create: {
          studentId: session.user.id,
          courseId: course.id,
          paymentStatus: "COMPLETED",
          progressPercent: 0,
          transactionId: "free_" + Date.now(),
        }
      });

      return NextResponse.json({
        freeEnrollment: true,
        success: true,
        message: "Successfully enrolled in free course!"
      });
    }

    // Create Razorpay Order
    const receipt = `c_${course.id.slice(-6)}_${Date.now().toString().slice(-6)}`;
    const order = await createRazorpayOrder(numericPrice, "INR", receipt);

    const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim() || process.env.RAZORPAY_KEY_ID?.trim();

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key,
      targetCourseId: course.id,
      courseTitle: course.title,
      coursePrice: numericPrice,
      user: {
        name: session.user.name || (session.user as any)?.fullName || "Student",
        email: session.user.email,
      }
    });
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create payment order" },
      { status: 500 }
    );
  }
}
