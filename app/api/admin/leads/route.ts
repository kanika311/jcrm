import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const [users, contactMessages, careerForms] = await Promise.all([
      prisma.user.findMany({ select: { id: true, name: true, fullName: true, email: true, phoneNumber: true, createdAt: true, role: true } }),
      prisma.contactMessage.findMany({}),
      prisma.careerGuidanceForm.findMany({})
    ]);

    const leads: any[] = [];

    // Map Users
    users.forEach(u => {
      leads.push({
        id: u.id,
        source: `Signup (${u.role})`,
        name: u.fullName || u.name || "N/A",
        email: u.email,
        phone: u.phoneNumber || "N/A",
        status: "NEW", 
        createdAt: u.createdAt,
        details: "Account Creation",
        rawData: u
      });
    });

    // Map ContactMessages
    contactMessages.forEach(c => {
      leads.push({
        id: c.id,
        source: `Contact Form ${c.source ? `(${c.source})` : ""}`,
        name: `${c.firstName} ${c.lastName}`.trim(),
        email: c.email,
        phone: c.phone || "N/A",
        status: c.status,
        createdAt: c.createdAt,
        details: `Subject: ${c.subject}`,
        rawData: c
      });
    });

    // Map CareerGuidanceForms
    careerForms.forEach(c => {
      leads.push({
        id: c.id,
        source: "Career Guidance Form",
        name: `${c.firstName} ${c.lastName}`.trim(),
        email: c.email,
        phone: c.phone || "N/A",
        status: c.status,
        createdAt: c.createdAt,
        details: `Degree: ${c.degree}, Location: ${c.location}`,
        rawData: c
      });
    });

    // Sort by createdAt descending
    leads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ leads }, { status: 200 });
  } catch (error) {
    console.error("[LEADS_GET_ERROR]", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
