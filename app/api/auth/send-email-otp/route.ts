import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import crypto from "crypto";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

const resend = new Resend(process.env.RESEND_API_KEY || "re_build_dummy_key");

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rate = checkRateLimit(`otp_${ip}`, 5, 10 * 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json(
        { message: `Too many OTP requests. Please try again in ${Math.ceil(rate.resetSeconds / 60)} minutes.` },
        { 
          status: 429,
          headers: { "Retry-After": String(rate.resetSeconds) }
        }
      );
    }

    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json({ message: "A valid email is required" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user exists
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: normalizedEmail },
          { email: { equals: normalizedEmail, mode: "insensitive" } },
        ],
      },
    });

    if (!user) {
      // Auto-register user as STUDENT if they don't exist
      user = await prisma.user.create({
        data: {
          email: normalizedEmail,
          role: "STUDENT",
        },
      });
    }

    if (user.isBlocked) {
      return NextResponse.json({ message: "Account is blocked" }, { status: 403 });
    }

    // Generate a secure 6-digit numeric OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Expire in 10 minutes
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Save to database
    await prisma.otpCode.create({
      data: {
        email: normalizedEmail,
        code: otp,
        expiresAt,
      },
    });

    // Send the email via Resend
    let sendError = null;
    try {
      const { error } = await resend.emails.send({
        from: process.env.EMAIL_FROM || "onboarding@resend.dev",
        to: normalizedEmail,
        subject: "Your Login Code — JCRM Technologies",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>Your Login Code</h2>
            <p>Here is your one-time verification code to sign in to JCRM Technologies. It will expire in 10 minutes.</p>
            <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; padding: 20px; background: #f4f4f4; text-align: center; border-radius: 8px;">
              ${otp}
            </div>
            <p>If you did not request this, please ignore this email.</p>
          </div>
        `,
      });
      sendError = error;
    } catch (e: any) {
      sendError = e;
    }

    if (sendError) {
      // Never expose OTP or credentials in production logs
      if (process.env.NODE_ENV === "development") {
        console.log(`[LOCAL DEV MOCK OTP] Code generated for testing`);
      }

      const isDev = process.env.NODE_ENV === "development" || !process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.includes("dummy");
      if (isDev) {
        return NextResponse.json({ message: "OTP logged to server console (Mock Mode)" }, { status: 200 });
      }
      return NextResponse.json({ message: "Failed to send email verification code" }, { status: 500 });
    }

    return NextResponse.json({ message: "OTP sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("[SEND_OTP_ERROR]", error instanceof Error ? error.message : "Error sending OTP");
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
