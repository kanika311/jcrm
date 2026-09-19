import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { ERP_PRODUCTS } from "@/lib/erpData";

// Seed initial 12 products if table is empty
async function seedInitialErpIfEmpty() {
  if (!(prisma as any).erpSolution) return;
  try {
    const count = await (prisma as any).erpSolution.count();
    if (count === 0) {
      for (const p of ERP_PRODUCTS) {
        await (prisma as any).erpSolution.create({
          data: {
            title: p.title,
            category: p.category,
            badge: p.badge,
            modulesCount: p.modulesCount || 12,
            roiMetric: p.roiMetric,
            image: p.image,
            description: p.description,
            modules: p.modules || [],
            demoUrl: "/erp-solutions",
            price: "Custom Enterprise Quote",
            status: "PUBLISHED",
          },
        });
      }
    }
  } catch (err) {
    console.error("Seed ERP error:", err);
  }
}

// GET /api/admin/erp?search=...&category=...&status=...&page=1&limit=10
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await seedInitialErpIfEmpty();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";
    const category = searchParams.get("category") || "All";
    const status = searchParams.get("status") || "ALL";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "10", 10));
    const skip = (page - 1) * limit;

    if (!(prisma as any).erpSolution) {
      // In-memory fallback
      let filtered = [...ERP_PRODUCTS].map((p, idx) => ({
        id: p.id || `erp_${idx + 1}`,
        title: p.title,
        category: p.category,
        badge: p.badge || "Enterprise Grade",
        modulesCount: p.modulesCount || 12,
        roiMetric: p.roiMetric || "Increases team efficiency by 35%",
        image: p.image,
        description: p.description,
        modules: p.modules || [],
        demoUrl: "/erp-solutions",
        price: "Custom Enterprise Quote",
        status: "PUBLISHED",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      if (category && category !== "All" && category !== "All Industries") {
        filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
      }
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(p =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      }

      const totalCount = filtered.length;
      const solutions = filtered.slice(skip, skip + limit);
      const totalPages = Math.ceil(totalCount / limit) || 1;

      return NextResponse.json({
        solutions,
        totalCount,
        totalPages,
        currentPage: page,
        limit,
      }, { status: 200 });
    }

    let whereClause: any = {};

    if (status && status !== "ALL") {
      whereClause.status = status;
    }

    if (category && category !== "All" && category !== "All Industries") {
      whereClause.category = category;
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
        { badge: { contains: search, mode: "insensitive" } },
        { roiMetric: { contains: search, mode: "insensitive" } },
        { modules: { has: search } },
      ];
    }

    const [totalCount, solutions] = await Promise.all([
      (prisma as any).erpSolution.count({ where: whereClause }),
      (prisma as any).erpSolution.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit) || 1;

    return NextResponse.json(
      {
        solutions,
        totalCount,
        totalPages,
        currentPage: page,
        limit,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[ADMIN_ERP_GET]", error);
    return NextResponse.json({ message: error?.message || "Internal server error" }, { status: 500 });
  }
}

// POST /api/admin/erp — Create New ERP Solution
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      category,
      badge,
      modulesCount,
      roiMetric,
      image,
      description,
      modules,
      demoUrl,
      price,
      status,
    } = body;

    if (!title || !category || !description) {
      return NextResponse.json(
        { message: "Title, category, and description are required" },
        { status: 400 }
      );
    }

    const parsedModules = Array.isArray(modules)
      ? modules
      : typeof modules === "string"
      ? modules.split(",").map((m: string) => m.trim()).filter(Boolean)
      : [];

    const solution = await prisma.erpSolution.create({
      data: {
        title,
        category,
        badge: badge || null,
        modulesCount: Number(modulesCount) || (parsedModules.length > 0 ? parsedModules.length : 12),
        roiMetric: roiMetric || null,
        image: image || null,
        description,
        modules: parsedModules,
        demoUrl: demoUrl || "/erp-solutions",
        price: price || "Custom Enterprise Quote",
        status: status || "PUBLISHED",
      },
    });

    return NextResponse.json({ success: true, solution }, { status: 201 });
  } catch (error: any) {
    console.error("[ADMIN_ERP_POST]", error);
    return NextResponse.json({ message: error?.message || "Internal server error" }, { status: 500 });
  }
}

// PUT /api/admin/erp — Update ERP Solution
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ message: "Solution ID is required" }, { status: 400 });
    }

    if (updates.modules && typeof updates.modules === "string") {
      updates.modules = updates.modules.split(",").map((s: string) => s.trim()).filter(Boolean);
    }
    if (updates.modulesCount !== undefined) {
      updates.modulesCount = Number(updates.modulesCount);
    }

    const updated = await prisma.erpSolution.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json({ success: true, solution: updated }, { status: 200 });
  } catch (error: any) {
    console.error("[ADMIN_ERP_PUT]", error);
    return NextResponse.json({ message: error?.message || "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/admin/erp?id=... — Delete ERP Solution
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
      return NextResponse.json({ message: "Solution ID is required" }, { status: 400 });
    }

    await prisma.erpSolution.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Solution deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("[ADMIN_ERP_DELETE]", error);
    return NextResponse.json({ message: error?.message || "Internal server error" }, { status: 500 });
  }
}
