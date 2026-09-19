import { getSiteContent } from "@/lib/cms";
import ErpCatalogClient from "./ErpCatalogClient";
import { prisma } from "@/lib/prisma";
import { ERP_PRODUCTS, ErpProduct } from "@/lib/erpData";

export const erpProducts = ERP_PRODUCTS;

export const dynamic = "force-dynamic";

export default async function ErpSolutionsPage() {
  let dbSolutions: ErpProduct[] = [];
  try {
    const records = await prisma.erpSolution.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
    });

    dbSolutions = records.map((s) => ({
      id: s.id,
      title: s.title,
      category: s.category,
      badge: s.badge || "Enterprise Ready",
      modulesCount: s.modulesCount || (s.modules?.length || 12),
      roiMetric: s.roiMetric || "Accelerates enterprise workflow",
      image: s.image || "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
      description: s.description,
      modules: s.modules && s.modules.length > 0 ? s.modules : ["Admin Portal", "Core Analytics", "Automated Workflows"],
      price: s.price || undefined,
      demoUrl: s.demoUrl || undefined,
    }));
  } catch (err) {
    console.error("Error fetching ERP solutions from DB:", err);
  }

  // Combine DB published solutions with static list (avoiding duplicate names or ids)
  const combinedProducts = [...dbSolutions];
  for (const staticItem of ERP_PRODUCTS) {
    if (
      !combinedProducts.some(
        p => p.id === staticItem.id || p.title.toLowerCase() === staticItem.title.toLowerCase()
      )
    ) {
      combinedProducts.push(staticItem);
    }
  }

  return <ErpCatalogClient products={combinedProducts} />;
}
