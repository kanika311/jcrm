import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { firstName, lastName, email, phone, subject, message } = data;

    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const contactMessage = await prisma.contactMessage.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        subject,
        message,
        source: "Contact Us Form",
        status: "NEW",
      },
    });

    return NextResponse.json({ success: true, message: contactMessage }, { status: 200 });
  } catch (error) {
    console.error("Error saving contact message:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
