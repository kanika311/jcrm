import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { DEFAULT_CLIENTS_PROJECTS, ClientProjectItem } from "@/lib/clientsProjectsData";
import { revalidatePath } from "next/cache";

const CMS_PAGE_ID = "clients-projects";

// Helper to get or seed projects from SiteContent
async function getStoredProjects(): Promise<ClientProjectItem[]> {
  try {
    const record = await prisma.siteContent.findUnique({
      where: { pageId: CMS_PAGE_ID },
    });

    if (record && record.content && Array.isArray((record.content as any).projects)) {
      return (record.content as any).projects;
    }

    // Seed defaults if empty
    await prisma.siteContent.upsert({
      where: { pageId: CMS_PAGE_ID },
      create: {
        pageId: CMS_PAGE_ID,
        category: "public",
        content: { projects: DEFAULT_CLIENTS_PROJECTS } as any,
      },
      update: {},
    });

    return DEFAULT_CLIENTS_PROJECTS;
  } catch (err) {
    console.error("[GET_STORED_PROJECTS]", err);
    return DEFAULT_CLIENTS_PROJECTS;
  }
}

// GET /api/admin/clients-projects
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim().toLowerCase() || "";
    const category = searchParams.get("category") || "All";
    const status = searchParams.get("status") || "ALL";

    let projects = await getStoredProjects();

    if (category && category !== "All") {
      projects = projects.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    if (status && status !== "ALL") {
      projects = projects.filter((p) => p.status === status);
    }

    if (search) {
      projects = projects.filter(
        (p) =>
          p.projectName.toLowerCase().includes(search) ||
          p.clientName.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search) ||
          p.techStack.some((t) => t.toLowerCase().includes(search))
      );
    }

    return NextResponse.json({ projects, success: true }, { status: 200 });
  } catch (error: any) {
    console.error("[ADMIN_CLIENTS_PROJECTS_GET]", error);
    return NextResponse.json({ message: error.message || "Failed to fetch projects" }, { status: 500 });
  }
}

// POST /api/admin/clients-projects (Create new project or reset defaults)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Reset to defaults action
    if (body.action === "reset-defaults") {
      await prisma.siteContent.upsert({
        where: { pageId: CMS_PAGE_ID },
        create: {
          pageId: CMS_PAGE_ID,
          category: "public",
          content: { projects: DEFAULT_CLIENTS_PROJECTS } as any,
        },
        update: {
          content: { projects: DEFAULT_CLIENTS_PROJECTS } as any,
        },
      });
      revalidatePath("/", "layout");
      return NextResponse.json({ success: true, projects: DEFAULT_CLIENTS_PROJECTS });
    }

    // Reorder action
    if (body.action === "reorder" && Array.isArray(body.projects)) {
      await prisma.siteContent.upsert({
        where: { pageId: CMS_PAGE_ID },
        create: {
          pageId: CMS_PAGE_ID,
          category: "public",
          content: { projects: body.projects } as any,
        },
        update: {
          content: { projects: body.projects } as any,
        },
      });
      revalidatePath("/", "layout");
      return NextResponse.json({ success: true, projects: body.projects });
    }

    const {
      projectName,
      clientName,
      category,
      badge,
      description,
      image,
      logo,
      projectUrl,
      techStack,
      stats,
      featured,
      status,
    } = body;

    if (!projectName?.trim() || !clientName?.trim()) {
      return NextResponse.json(
        { message: "Project Name and Client Name are required" },
        { status: 400 }
      );
    }

    let projects = await getStoredProjects();

    const newProject: ClientProjectItem = {
      id: `proj-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      projectName: projectName.trim(),
      clientName: clientName.trim(),
      category: category?.trim() || "Enterprise ERP",
      badge: badge?.trim() || "Featured",
      description: description?.trim() || "",
      image:
        image?.trim() ||
        "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80",
      logo: logo?.trim() || undefined,
      projectUrl: projectUrl?.trim() || "",
      techStack: Array.isArray(techStack)
        ? techStack
        : typeof techStack === "string"
        ? techStack.split(",").map((s: string) => s.trim()).filter(Boolean)
        : [],
      stats: stats?.trim() || undefined,
      featured: Boolean(featured),
      orderIndex: projects.length + 1,
      status: status === "DRAFT" ? "DRAFT" : "PUBLISHED",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Prepend so the newly added project shows up front
    projects = [newProject, ...projects];

    await prisma.siteContent.upsert({
      where: { pageId: CMS_PAGE_ID },
      create: {
        pageId: CMS_PAGE_ID,
        category: "public",
        content: { projects } as any,
      },
      update: {
        content: { projects } as any,
      },
    });

    revalidatePath("/", "layout");

    return NextResponse.json({ success: true, project: newProject, projects }, { status: 201 });
  } catch (error: any) {
    console.error("[ADMIN_CLIENTS_PROJECTS_POST]", error);
    return NextResponse.json({ message: error.message || "Failed to create project" }, { status: 500 });
  }
}

// PUT /api/admin/clients-projects (Update existing project)
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ message: "Project ID is required" }, { status: 400 });
    }

    let projects = await getStoredProjects();
    const index = projects.findIndex((p) => p.id === id);

    if (index === -1) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    const current = projects[index];
    const updatedProject: ClientProjectItem = {
      ...current,
      projectName: body.projectName !== undefined ? body.projectName.trim() : current.projectName,
      clientName: body.clientName !== undefined ? body.clientName.trim() : current.clientName,
      category: body.category !== undefined ? body.category.trim() : current.category,
      badge: body.badge !== undefined ? body.badge.trim() : current.badge,
      description: body.description !== undefined ? body.description.trim() : current.description,
      image: body.image !== undefined ? body.image.trim() : current.image,
      logo: body.logo !== undefined ? body.logo.trim() : current.logo,
      projectUrl: body.projectUrl !== undefined ? body.projectUrl.trim() : current.projectUrl,
      techStack:
        body.techStack !== undefined
          ? Array.isArray(body.techStack)
            ? body.techStack
            : typeof body.techStack === "string"
            ? body.techStack.split(",").map((s: string) => s.trim()).filter(Boolean)
            : current.techStack
          : current.techStack,
      stats: body.stats !== undefined ? body.stats.trim() : current.stats,
      featured: body.featured !== undefined ? Boolean(body.featured) : current.featured,
      status: body.status !== undefined ? (body.status === "DRAFT" ? "DRAFT" : "PUBLISHED") : current.status,
      orderIndex: body.orderIndex !== undefined ? Number(body.orderIndex) : current.orderIndex,
      updatedAt: new Date().toISOString(),
    };

    projects[index] = updatedProject;

    await prisma.siteContent.upsert({
      where: { pageId: CMS_PAGE_ID },
      create: {
        pageId: CMS_PAGE_ID,
        category: "public",
        content: { projects } as any,
      },
      update: {
        content: { projects } as any,
      },
    });

    revalidatePath("/", "layout");

    return NextResponse.json({ success: true, project: updatedProject, projects }, { status: 200 });
  } catch (error: any) {
    console.error("[ADMIN_CLIENTS_PROJECTS_PUT]", error);
    return NextResponse.json({ message: error.message || "Failed to update project" }, { status: 500 });
  }
}

// DELETE /api/admin/clients-projects (Delete project)
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Project ID is required" }, { status: 400 });
    }

    let projects = await getStoredProjects();
    const initialLength = projects.length;
    projects = projects.filter((p) => p.id !== id);

    if (projects.length === initialLength) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    await prisma.siteContent.upsert({
      where: { pageId: CMS_PAGE_ID },
      create: {
        pageId: CMS_PAGE_ID,
        category: "public",
        content: { projects } as any,
      },
      update: {
        content: { projects } as any,
      },
    });

    revalidatePath("/", "layout");

    return NextResponse.json({ success: true, message: "Project deleted successfully", projects }, { status: 200 });
  } catch (error: any) {
    console.error("[ADMIN_CLIENTS_PROJECTS_DELETE]", error);
    return NextResponse.json({ message: error.message || "Failed to delete project" }, { status: 500 });
  }
}
