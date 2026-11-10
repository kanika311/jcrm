import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { registerSchema } from "@/lib/validations/auth";
import { verifySameOrigin } from "@/lib/csrf";

export async function POST(req: Request) {
  try {
    if (!verifySameOrigin(req)) {
      return NextResponse.json({ message: "Invalid request origin (CSRF rejected)" }, { status: 403 });
    }

    const ip = getClientIp(req);
    const rate = checkRateLimit(`signup_${ip}`, 5, 15 * 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json(
        { message: `Too many registration attempts. Please try again in ${Math.ceil(rate.resetSeconds / 60)} minutes.` },
        {
          status: 429,
          headers: { "Retry-After": String(rate.resetSeconds) }
        }
      );
    }

    const body = await req.json().catch(() => ({}));
    const parseResult = registerSchema.safeParse(body);

    if (!parseResult.success) {
      const firstError = parseResult.error.errors[0]?.message || "Invalid registration data";
      return NextResponse.json({ message: firstError }, { status: 400 });
    }

    const { fullName, email, password, phoneNumber, role } = parseResult.data;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { email: { equals: email, mode: "insensitive" } },
        ],
      },
    });

    if (existingUser) {
      // Generic response to avoid account enumeration
      return NextResponse.json(
        {
          message: "Registration processed. If an account already exists, please sign in with your credentials.",
          success: true,
        },
        { status: 200 }
      );
    }

    // Role enforcement: Public registration only permits STUDENT or INSTRUCTOR
    const validRole: "STUDENT" | "INSTRUCTOR" = role === "INSTRUCTOR" ? "INSTRUCTOR" : "STUDENT";

    // Hash password with bcrypt
    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        fullName,
        name: fullName,
        email,
        phoneNumber,
        passwordHash,
        role: validRole,
      },
    });

    return NextResponse.json(
      {
        message: "Account created successfully",
        userId: newUser.id,
        role: newUser.role,
        success: true,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup error occurred:", error?.message || "Internal error");
    return NextResponse.json(
      { message: "Unable to complete registration. Please try again later." },
      { status: 500 }
    );
  }
}
