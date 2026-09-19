import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { TEAM_MEMBERS } from "@/lib/teamData";

// Helper to seed initial team members if table is completely empty
async function seedInitialMembersIfEmpty() {
  const count = await prisma.teamMember.count();
  if (count === 0) {
    for (const m of TEAM_MEMBERS) {
      await prisma.teamMember.create({
        data: {
          name: m.name,
          email: `${m.name.toLowerCase().replace(/\s+/g, '.')}@jcrmtechnologies.com`,
          phone: "+91 98765 43210",
          role: m.role,
          department: m.role,
          image: m.image,
          city: m.city,
          state: m.state,
          country: "India",
          college: m.college,
          education: m.education,
          experience: m.experience,
          skills: m.skills,
          bio: m.bio,
          status: "APPROVED",
          isVerified: true,
        },
      });
    }
  }
}

// GET /api/admin/team?status=ALL|PENDING|APPROVED|REJECTED
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await seedInitialMembersIfEmpty();

    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get("status");

    let whereClause: any = {};
    if (statusParam && ["PENDING", "APPROVED", "REJECTED"].includes(statusParam)) {
      whereClause.status = statusParam;
    }

    const members = await prisma.teamMember.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ members }, { status: 200 });
  } catch (error: any) {
    console.error("[ADMIN_TEAM_GET]", error);
    return NextResponse.json({ message: error?.message || "Internal server error" }, { status: 500 });
  }
}

// POST /api/admin/team — Create New Team Member directly
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      email,
      phone,
      role,
      department,
      image,
      city,
      state,
      country,
      pinCode,
      dateOfBirth,
      college,
      education,
      experience,
      skills,
      bio,
      status,
      isVerified,
    } = body;

    if (!name || !email) {
      return NextResponse.json({ message: "Name and email are required" }, { status: 400 });
    }

    const skillsArray = Array.isArray(skills)
      ? skills
      : typeof skills === "string"
      ? skills.split(",").map((s: string) => s.trim()).filter(Boolean)
      : [];

    const member = await prisma.teamMember.create({
      data: {
        name,
        email,
        phone: phone || null,
        role: role || "Software Engineer",
        department: department || role || "Engineering",
        image: image || null,
        city: city || null,
        state: state || null,
        country: country || "India",
        pinCode: pinCode || null,
        dateOfBirth: dateOfBirth || null,
        college: college || null,
        education: education || null,
        experience: experience || "Fresher / Intern",
        skills: skillsArray,
        bio: bio || null,
        status: status || "APPROVED",
        isVerified: isVerified ?? true,
      },
    });

    return NextResponse.json({ success: true, member }, { status: 201 });
  } catch (error: any) {
    console.error("[ADMIN_TEAM_POST]", error);
    return NextResponse.json({ message: error?.message || "Internal server error" }, { status: 500 });
  }
}

// PUT /api/admin/team — Update Team Member or Change Status (Approve / Reject)
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ message: "Member ID is required" }, { status: 400 });
    }

    if (updates.skills && typeof updates.skills === "string") {
      updates.skills = updates.skills.split(",").map((s: string) => s.trim()).filter(Boolean);
    }

    const updatedMember = await prisma.teamMember.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json({ success: true, member: updatedMember }, { status: 200 });
  } catch (error: any) {
    console.error("[ADMIN_TEAM_PUT]", error);
    return NextResponse.json({ message: error?.message || "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/admin/team?id=... — Delete Team Member
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    let id = searchParams.get("id");

    if (!id) {
      try {
        const body = await req.json();
        id = body.id;
      } catch {}
    }

    if (!id) {
      return NextResponse.json({ message: "Member ID is required" }, { status: 400 });
    }

    await prisma.teamMember.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Member deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("[ADMIN_TEAM_DELETE]", error);
    return NextResponse.json({ message: error?.message || "Internal server error" }, { status: 500 });
  }
}
