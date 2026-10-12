import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_CLIENTS_PROJECTS, ClientProjectItem } from "@/lib/clientsProjectsData";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const record = await prisma.siteContent.findUnique({
      where: { pageId: "clients-projects" },
    });

    let projects: ClientProjectItem[] = DEFAULT_CLIENTS_PROJECTS;

    if (record && record.content && Array.isArray((record.content as any).projects)) {
      projects = (record.content as any).projects;
    }

    // Filter published projects only
    const published = projects.filter((p) => p.status !== "DRAFT");

    return NextResponse.json({ projects: published, success: true }, { status: 200 });
  } catch (error: any) {
    console.error("[PUBLIC_CLIENTS_PROJECTS_GET]", error);
    return NextResponse.json({ projects: DEFAULT_CLIENTS_PROJECTS, success: true }, { status: 200 });
  }
}
