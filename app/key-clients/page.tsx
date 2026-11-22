import type { Metadata } from "next";
import KeyClientsPageClient from "@/components/KeyClientsPageClient";
import { getSiteContent } from "@/lib/cms";
import { getSeoMetadata } from "@/lib/seoConfig";

export const dynamic = "force-dynamic";

export const metadata: Metadata = getSeoMetadata("/key-clients");

export default async function KeyClientsPage() {
  const cmsData = await getSiteContent("public-key-clients").catch(() => null);

  return <KeyClientsPageClient cmsData={cmsData} />;
}
