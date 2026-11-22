import type { Metadata } from "next";
import KeyClientsPageClient from "@/components/KeyClientsPageClient";
import { getSiteContent } from "@/lib/cms";
import { getSeoMetadata } from "@/lib/seoConfig";

export const dynamic = "force-dynamic";

export const metadata: Metadata = getSeoMetadata("/placements");

export default async function PlacementsPage() {
  const cmsData = await getSiteContent("public-placements").catch(() => null);

  return <KeyClientsPageClient cmsData={cmsData} />;
}