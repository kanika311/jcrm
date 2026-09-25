import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { DEFAULT_SPONSORED_ADS, SponsoredAd } from "@/lib/sponsoredAd";
import SponsoredManagementClient from "./SponsoredManagementClient";

export const dynamic = "force-dynamic";

export default async function AdminSponsoredPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== "ADMIN") {
    redirect("/auth");
  }

  let ads: SponsoredAd[] = DEFAULT_SPONSORED_ADS;

  try {
    const record = await prisma.siteContent.findUnique({
      where: { pageId: "sponsored-ads-list" },
    });

    if (record && Array.isArray(record.content) && record.content.length > 0) {
      ads = record.content as unknown as SponsoredAd[];
    } else {
      const legacyRecord = await prisma.siteContent.findUnique({
        where: { pageId: "ourteam-sponsored-ad" },
      });
      if (legacyRecord && legacyRecord.content && typeof legacyRecord.content === "object") {
        const legacyAd = legacyRecord.content as unknown as SponsoredAd;
        ads = [
          {
            id: legacyAd.id || "sp_legacy_1",
            ...legacyAd,
            createdAt: legacyAd.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
      }
    }
  } catch (error) {
    console.error("Failed to load sponsored ads for admin:", error);
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-24">
      <SponsoredManagementClient initialAds={ads} />
    </div>
  );
}
