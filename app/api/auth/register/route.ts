import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    // Parse the data coming from the frontend form
    const body = await req.json();
    const { fullName, email, password, role } = body;

    // 1. Validate input
    if (!fullName || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email is already registered" }, { status: 400 });
    }

    // 3. Hash the password securely
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Save the new user to the database
    const newUser = await prisma.user.create({
      data: {
        fullName,
        email,
        passwordHash: hashedPassword,
        role: role || "STUDENT", // Default to student
      },
    });

    // 5. Strip the password hash before sending the success response back to the browser!
    const { passwordHash, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      message: "User registered successfully!",
      user: userWithoutPassword,
    }, { status: 201 });

  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}