import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

function pageIdFor(userId: string) {
  return `faculty-settings:${userId}`;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const record = await prisma.siteContent.findUnique({
    where: { pageId: pageIdFor(session.user.id) },
  });

  const content = (record?.content as Record<string, unknown>) || {};
  return NextResponse.json({
    payout: content.payout || {
      accountHolder: "",
      bankName: "",
      accountNumber: "",
      ifsc: "",
      upiId: "",
      pan: "",
      gstin: "",
    },
    team: Array.isArray(content.team) ? content.team : [],
  });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const pageId = pageIdFor(session.user.id);
  const existing = await prisma.siteContent.findUnique({ where: { pageId } });
  const current = ((existing?.content as Record<string, unknown>) || {}) as {
    payout?: Record<string, string>;
    team?: { email: string; role: string; status: string }[];
  };

  const next = {
    payout: body.payout ? { ...current.payout, ...body.payout } : current.payout || {},
    team: Array.isArray(body.team) ? body.team : current.team || [],
  };

  await prisma.siteContent.upsert({
    where: { pageId },
    create: { pageId, category: "faculty", content: next as any },
    update: { content: next as any },
  });

  return NextResponse.json({ message: "Settings saved", ...next });
}
