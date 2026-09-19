import { prisma } from "@/lib/prisma";
import ErpManagementClient from "./ErpManagementClient";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { ERP_PRODUCTS } from "@/lib/erpData";

export const dynamic = "force-dynamic";

export default async function AdminErpPage() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "ADMIN") {
      redirect("/auth");
    }

    let serializedSolutions: any[] = [];

    // Safely check if erpSolution is available on prisma instance
    if ((prisma as any).erpSolution) {
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

        const dbSolutions = await (prisma as any).erpSolution.findMany({
          orderBy: { createdAt: "desc" },
        });

        serializedSolutions = dbSolutions.map((s: any) => ({
          ...s,
          createdAt: s.createdAt?.toISOString() || new Date().toISOString(),
          updatedAt: s.updatedAt?.toISOString() || new Date().toISOString(),
        }));
      } catch (dbErr) {
        console.error("Database query error for erpSolution:", dbErr);
      }
    }

    // Resilient fallback to ERP_PRODUCTS so page never crashes
    if (serializedSolutions.length === 0) {
      serializedSolutions = ERP_PRODUCTS.map((p, idx) => ({
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
    }

    return (
      <div className="max-w-[1400px] mx-auto space-y-8 pb-24">
        <ErpManagementClient initialSolutions={serializedSolutions as any} />
      </div>
    );
  } catch (error: any) {
    if (
      error.digest?.startsWith("NEXT_REDIRECT") ||
      error.digest === "DYNAMIC_SERVER_USAGE" ||
      error.message?.includes("Dynamic server usage")
    ) {
      throw error;
    }
    console.error("ADMIN_ERP_PAGE_ERROR:", error);
    return (
      <div
        className="p-8 max-w-2xl mx-auto mt-12 text-center rounded-2xl border"
        style={{ background: "var(--bg-card)", borderColor: "var(--border-soft)" }}
      >
        <h3 className="heading-font text-xl font-bold text-red-500 mb-2">Failed to load ERP Solutions CMS</h3>
        <p className="text-sm font-semibold mb-4" style={{ color: "var(--text-secondary)" }}>
          A runtime server error occurred. Please check the message details below:
        </p>
        <div className="p-4 rounded-xl bg-red-500/10 text-red-500 text-left font-mono text-xs overflow-x-auto">
          {error.stack || error.message || String(error)}
        </div>
      </div>
    );
  }
}
