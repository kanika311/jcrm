import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { createRazorpayOrder } from "@/lib/razorpay";
import { getRegistrationState } from "@/lib/courseAccess";

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

    const access = await getRegistrationState(session.user.id);
    if (access?.courseAccessBlocked) {
      return NextResponse.json({
        error: "Course access is blocked until the remaining course fee is paid. Contact JCRM admin.",
      }, { status: 403 });
    }

    if (access?.hasAccess) {
      return NextResponse.json({
        alreadyEnrolled: true,
        message: "Registration is already active. All courses are open.",
      });
    }

    const registrationFee = access?.fee ?? 499;

    if (registrationFee <= 0) {
      return NextResponse.json({
        freeEnrollment: true,
        success: true,
        message: "Registration fee is ₹0. All courses are open.",
      });
    }

    const receipt = `reg_${session.user.id.slice(-6)}_${Date.now().toString().slice(-6)}`;
    const order = await createRazorpayOrder(registrationFee, "INR", receipt);

    const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim() || process.env.RAZORPAY_KEY_ID?.trim();

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key,
      targetCourseId: course.id,
      courseTitle: course.title,
      coursePrice: registrationFee,
      registrationFee,
      listPrice: course.price,
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
