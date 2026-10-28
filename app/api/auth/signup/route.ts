import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rate = checkRateLimit(`signup_${ip}`, 10, 15 * 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json(
        { message: `Too many registration attempts. Please try again in ${Math.ceil(rate.resetSeconds / 60)} minutes.` },
        { 
          status: 429,
          headers: { "Retry-After": String(rate.resetSeconds) }
        }
      );
    }

    const body = await req.json();
    const { fullName, email, password, phoneNumber, role } = body;

    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { message: "A valid email address is required" },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    if (!fullName || typeof fullName !== "string" || !fullName.trim()) {
      return NextResponse.json(
        { message: "Full name is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { message: "Please provide a valid email address format" },
        { status: 400 }
      );
    }

    // Role safety: Public registration only permits STUDENT or INSTRUCTOR.
    // ADMIN roles can NEVER be claimed through public signup.
    const validRole: "STUDENT" | "INSTRUCTOR" = role === "INSTRUCTOR" ? "INSTRUCTOR" : "STUDENT";

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: normalizedEmail },
          { email: { equals: normalizedEmail, mode: "insensitive" } },
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { 
          message: "An account with this email is already registered. Please switch to Sign In." 
        },
        { status: 409 }
      );
    }

    // Hash password securely with bcrypt
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user in database
    const newUser = await prisma.user.create({
      data: {
        fullName: fullName.trim(),
        name: fullName.trim(), // NextAuth standard adapter field
        email: normalizedEmail,
        phoneNumber: phoneNumber ? String(phoneNumber).trim() : null,
        passwordHash,
        role: validRole,
      },
    });

    return NextResponse.json(
      { 
        message: "User created successfully", 
        userId: newUser.id,
        role: newUser.role
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup error occurred:", error?.message || error);
    return NextResponse.json(
      { message: "Unable to complete registration. Please try again later." },
      { status: 500 }
    );
  }
}
