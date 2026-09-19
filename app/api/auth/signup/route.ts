import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, password, phoneNumber, role } = body;

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Default to STUDENT if role is missing or invalid
    let validRole = role === "INSTRUCTOR" ? "INSTRUCTOR" : "STUDENT";
    
    // Hardcoded Super Admin Check
    const superAdminEmail = (process.env.SUPER_ADMIN_EMAIL || "pandey.ashutosh699@gmail.com").toLowerCase();
    if (normalizedEmail === superAdminEmail) {
      validRole = "ADMIN";
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // If user already exists in database
    if (existingUser) {
      // 1. If existing user already has the requested role
      if (existingUser.role === validRole) {
        return NextResponse.json(
          { 
            message: `An account with this email is already registered as ${validRole === "INSTRUCTOR" ? "Teacher / Faculty" : "Student"}. Please switch to Sign In.` 
          },
          { status: 409 }
        );
      }

      // 2. If existing user has a DIFFERENT role (e.g. was Student, now registering as Teacher or vice-versa)
      // Allow seamless role activation & update credentials
      const updatedUser = await prisma.user.update({
        where: { email: normalizedEmail },
        data: {
          role: validRole as "STUDENT" | "INSTRUCTOR" | "ADMIN",
          passwordHash,
          fullName: fullName || existingUser.fullName,
          name: fullName || existingUser.name,
          phoneNumber: phoneNumber || existingUser.phoneNumber,
        },
      });

      return NextResponse.json(
        { 
          message: `Your account role has been updated to ${validRole === "INSTRUCTOR" ? "Teacher / Faculty" : "Student"} successfully!`,
          userId: updatedUser.id 
        },
        { status: 200 }
      );
    }

    // 3. Create brand new user (same phone number across accounts is fully supported)
    const newUser = await prisma.user.create({
      data: {
        fullName,
        name: fullName, // NextAuth uses 'name'
        email: normalizedEmail,
        phoneNumber: phoneNumber || null,
        passwordHash,
        role: validRole as "STUDENT" | "INSTRUCTOR" | "ADMIN",
      },
    });

    return NextResponse.json(
      { message: "User created successfully", userId: newUser.id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
