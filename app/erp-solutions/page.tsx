import { getSiteContent } from "@/lib/cms";
import ErpCatalogClient from "./ErpCatalogClient";
import { prisma } from "@/lib/prisma";
import { ERP_PRODUCTS, ErpProduct } from "@/lib/erpData";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { DEFAULT_SPONSORED_AD, SponsoredAd } from "@/lib/sponsoredAd";

export const erpProducts = ERP_PRODUCTS;

export const dynamic = "force-dynamic";

export default async function ErpSolutionsPage() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "ADMIN";

  let sponsoredAd: SponsoredAd = DEFAULT_SPONSORED_AD;

  const [dbRecords, adRecord] = await Promise.all([
    prisma.erpSolution.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
    }).catch(err => {
      console.error("Error fetching ERP solutions from DB:", err);
      return [];
    }),
    prisma.siteContent.findUnique({
      where: { pageId: "sponsored-ads-list" },
    }).catch(() => null),
  ]);

  if (adRecord && Array.isArray(adRecord.content) && adRecord.content.length > 0) {
    const ads = adRecord.content as unknown as SponsoredAd[];
    const activeAd = ads.find((a) => a.isActive);
    sponsoredAd = activeAd || ads[0] || DEFAULT_SPONSORED_AD;
  } else {
    try {
      const legacyRecord = await prisma.siteContent.findUnique({
        where: { pageId: "ourteam-sponsored-ad" },
      });
      if (legacyRecord && legacyRecord.content && typeof legacyRecord.content === "object") {
        sponsoredAd = legacyRecord.content as unknown as SponsoredAd;
      }
    } catch {}
  }

  const dbSolutions: ErpProduct[] = dbRecords.map((s) => ({
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

  // Combine DB published solutions with static list
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

  return (
    <ErpCatalogClient
      products={combinedProducts}
      initialSponsoredAd={sponsoredAd}
      isAdmin={isAdmin}
    />
  );
}
