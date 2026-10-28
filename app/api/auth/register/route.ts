import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rate = checkRateLimit(`register_${ip}`, 10, 15 * 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: `Too many registration attempts. Please try again in ${Math.ceil(rate.resetSeconds / 60)} minutes.` },
        { 
          status: 429,
          headers: { "Retry-After": String(rate.resetSeconds) }
        }
      );
    }

    const body = await req.json();
    const { fullName, email, password, role, phoneNumber } = body;

    if (!fullName || typeof fullName !== "string" || !fullName.trim()) {
      return NextResponse.json({ error: "Missing required field: Full Name" }, { status: 400 });
    }

    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json({ error: "Missing required field: Email" }, { status: 400 });
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

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
      return NextResponse.json({ error: "Email is already registered. Please sign in." }, { status: 409 });
    }

    // Role enforcement: Public registration only permits STUDENT or INSTRUCTOR
    const validRole: "STUDENT" | "INSTRUCTOR" = role === "INSTRUCTOR" ? "INSTRUCTOR" : "STUDENT";

    // Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the new user to the database
    const newUser = await prisma.user.create({
      data: {
        fullName: fullName.trim(),
        name: fullName.trim(),
        email: normalizedEmail,
        phoneNumber: phoneNumber ? String(phoneNumber).trim() : null,
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
    }, { status: 201 });

  } catch (error: any) {
    console.error("Registration error occurred:", error?.message || error);
    return NextResponse.json({ error: "Unable to complete registration. Please try again later." }, { status: 500 });
  }
}