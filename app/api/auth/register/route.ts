import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { registerSchema } from "@/lib/validations/auth";
import { verifySameOrigin } from "@/lib/csrf";

export async function POST(req: Request) {
  try {
    if (!verifySameOrigin(req)) {
      return NextResponse.json({ error: "Invalid request origin (CSRF rejected)" }, { status: 403 });
    }

    const ip = getClientIp(req);
    const rate = checkRateLimit(`register_${ip}`, 5, 15 * 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: `Too many registration attempts. Please try again in ${Math.ceil(rate.resetSeconds / 60)} minutes.` },
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
      return NextResponse.json({ error: firstError }, { status: 400 });
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
      // Generic response to prevent account enumeration
      return NextResponse.json({
        message: "Registration processed. If you already have an account, please sign in.",
        success: true,
      }, { status: 200 });
    }

    const validRole: "STUDENT" | "INSTRUCTOR" = role === "INSTRUCTOR" ? "INSTRUCTOR" : "STUDENT";
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        fullName,
        name: fullName,
        email,
        phoneNumber,
        passwordHash: hashedPassword,
        role: validRole,
      },
    });

    return NextResponse.json({
      message: "User registered successfully!",
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
      },
      success: true,
    }, { status: 201 });

  } catch (error: any) {
    console.error("Registration error occurred:", error?.message || "Internal error");
    return NextResponse.json({ error: "Unable to complete registration. Please try again later." }, { status: 500 });
  }
}
