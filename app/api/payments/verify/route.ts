import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { verifyRazorpaySignature } from "@/lib/razorpay";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
    } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courseId) {
      return NextResponse.json({ error: "Missing required payment verification parameters" }, { status: 400 });
    }

    // Verify signature
    const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      console.error("Razorpay signature verification failed for payment:", razorpay_payment_id);
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // Upsert Enrollment in DB
    const enrollment = await prisma.enrollment.upsert({
      where: {
        studentId_courseId: {
          studentId: session.user.id,
          courseId: courseId,
        }
      },
      update: {
        paymentStatus: "COMPLETED",
        transactionId: razorpay_payment_id,
        enrolledAt: new Date(),
      },
      create: {
        studentId: session.user.id,
        courseId: courseId,
        paymentStatus: "COMPLETED",
        transactionId: razorpay_payment_id,
        progressPercent: 0,
      }
    });

    return NextResponse.json({
      success: true,
      message: "Payment successfully verified! Course enrolled.",
      enrollmentId: enrollment.id,
    });
  } catch (error: any) {
    console.error("Error verifying Razorpay payment:", error);
    return NextResponse.json(
      { error: error?.message || "Payment verification failed" },
      { status: 500 }
    );
  }
}
