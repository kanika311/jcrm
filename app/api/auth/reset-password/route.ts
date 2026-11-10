import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import {
  passwordResetRequestSchema,
  passwordResetConfirmSchema,
} from "@/lib/validations/auth";
import { verifySameOrigin } from "@/lib/csrf";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key");

export async function POST(req: Request) {
  try {
    if (!verifySameOrigin(req)) {
      return NextResponse.json(
        { error: "Invalid request origin (CSRF rejected)" },
        { status: 403 }
      );
    }

    const ip = getClientIp(req);
    const body = await req.json().catch(() => ({}));
    const action = body.action || "request";

    if (action === "request") {
      // 1. Password Reset Request Flow
      const rate = checkRateLimit(`reset_req_${ip}`, 3, 15 * 60 * 1000);
      if (!rate.allowed) {
        return NextResponse.json(
          {
            error: `Too many password reset requests. Please try again in ${Math.ceil(
              rate.resetSeconds / 60
            )} minutes.`,
          },
          {
            status: 429,
            headers: { "Retry-After": String(rate.resetSeconds) },
          }
        );
      }

      const parseResult = passwordResetRequestSchema.safeParse(body);
      if (!parseResult.success) {
        return NextResponse.json(
          { error: parseResult.error.issues[0]?.message || "Invalid email" },
          { status: 400 }
        );
      }

      const { email } = parseResult.data;

      // Always return generic success message to prevent account enumeration
      const genericSuccessResponse = NextResponse.json({
        success: true,
        message:
          "If an account with this email exists, a password reset link has been dispatched.",
      });

      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, email: true, isBlocked: true },
      });

      if (!user || user.isBlocked) {
        return genericSuccessResponse;
      }

      // Generate secure 32-byte hex token and store SHA-256 hash
      const rawToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins expiry

      // Remove existing reset tokens for this email
      await prisma.verificationToken.deleteMany({
        where: { identifier: email },
      }).catch(() => null);

      await prisma.verificationToken.create({
        data: {
          identifier: email,
          token: hashedToken,
          expires: expiresAt,
        },
      });

      // Construct reset URL
      const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "www.jcrm.in";
      const proto = req.headers.get("x-forwarded-proto") || "https";
      const resetLink = `${proto}://${host}/auth?mode=reset&token=${rawToken}&email=${encodeURIComponent(
        email
      )}`;

      // Send email via Resend
      try {
        await resend.emails.send({
          from: process.env.EMAIL_FROM || "security@jcrm.in",
          to: email,
          subject: "Password Reset Request — JCRM Technologies",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2>Reset Your Password</h2>
              <p>We received a request to reset your password for your JCRM account. Click the button below to proceed. This link expires in 15 minutes.</p>
              <div style="margin: 25px 0;">
                <a href="${resetLink}" style="background-color: #0055FF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
              </div>
              <p style="color: #666; font-size: 13px;">If you did not request this password reset, please ignore this email or contact support if you suspect unauthorized activity.</p>
            </div>
          `,
        });
      } catch (sendErr) {
        console.error("[RESET_EMAIL_SEND_ERR]", sendErr);
      }

      return genericSuccessResponse;
    } else if (action === "reset") {
      // 2. Confirm and Apply Password Reset
      const rate = checkRateLimit(`reset_confirm_${ip}`, 5, 15 * 60 * 1000);
      if (!rate.allowed) {
        return NextResponse.json(
          {
            error: `Too many attempts. Please try again in ${Math.ceil(
              rate.resetSeconds / 60
            )} minutes.`,
          },
          {
            status: 429,
            headers: { "Retry-After": String(rate.resetSeconds) },
          }
        );
      }

      const parseResult = passwordResetConfirmSchema.safeParse(body);
      if (!parseResult.success) {
        return NextResponse.json(
          { error: parseResult.error.issues[0]?.message || "Invalid reset payload" },
          { status: 400 }
        );
      }

      const { token: rawToken, newPassword } = parseResult.data;
      const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

      const record = await prisma.verificationToken.findUnique({
        where: { token: hashedToken },
      });

      if (!record || record.expires < new Date()) {
        if (record) {
          await prisma.verificationToken.delete({ where: { token: hashedToken } }).catch(() => null);
        }
        return NextResponse.json(
          { error: "Password reset token is invalid or has expired. Please request a new link." },
          { status: 400 }
        );
      }

      // Hash new password securely with bcrypt (12 rounds)
      const passwordHash = await bcrypt.hash(newPassword, 12);

      await prisma.user.update({
        where: { email: record.identifier },
        data: { passwordHash },
      });

      // Invalidate the consumed token
      await prisma.verificationToken.delete({ where: { token: hashedToken } }).catch(() => null);

      return NextResponse.json({
        success: true,
        message: "Your password has been successfully reset. Please log in with your new password.",
      });
    }

    return NextResponse.json({ error: "Invalid action specified" }, { status: 400 });
  } catch (error: any) {
    console.error("[PASSWORD_RESET_API_ERROR]", error?.message || "Internal error");
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
