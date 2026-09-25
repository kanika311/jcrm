import { WORKSHOPS } from "@/lib/workshopData";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { DEFAULT_SPONSORED_AD, SponsoredAd } from "@/lib/sponsoredAd";
import WorkshopCatalogClient from "./WorkshopCatalogClient";

export const dynamic = "force-dynamic";

export default async function WorkshopPage() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "ADMIN";

  let sponsoredAd: SponsoredAd = DEFAULT_SPONSORED_AD;

  try {
    const record = await prisma.siteContent.findUnique({
      where: { pageId: "sponsored-ads-list" },
    });

    if (record && Array.isArray(record.content) && record.content.length > 0) {
      const ads = record.content as unknown as SponsoredAd[];
      const activeAd = ads.find((a) => a.isActive);
      sponsoredAd = activeAd || ads[0] || DEFAULT_SPONSORED_AD;
    } else {
      const legacyRecord = await prisma.siteContent.findUnique({
        where: { pageId: "ourteam-sponsored-ad" },
      });
      if (legacyRecord && legacyRecord.content && typeof legacyRecord.content === "object") {
        sponsoredAd = legacyRecord.content as unknown as SponsoredAd;
      }
    }
  } catch (err) {
    console.error("Failed to load sponsored ad for workshop:", err);
  }

  return (
    <WorkshopCatalogClient
      workshops={WORKSHOPS}
      initialSponsoredAd={sponsoredAd}
      isAdmin={isAdmin}
    />
  );
}
