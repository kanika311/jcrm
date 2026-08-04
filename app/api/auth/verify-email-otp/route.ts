import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { message: "Email and OTP are required" },
        { status: 400 }
      );
    }

    const otpRecord = await prisma.otpCode.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" },
    });

    if (!otpRecord) {
      return NextResponse.json({ message: "No OTP requested for this email" }, { status: 400 });
    }

    if (otpRecord.code !== otp) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    }

    if (otpRecord.expiresAt < new Date()) {
      return NextResponse.json({ message: "OTP has expired" }, { status: 400 });
    }

    // Mark as used
    await prisma.otpCode.deleteMany({ where: { email } });

    return NextResponse.json({ success: true, message: "OTP verified successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
