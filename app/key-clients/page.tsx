import type { Metadata } from "next";
import KeyClientsPageClient from "@/components/KeyClientsPageClient";
import { getSiteContent } from "@/lib/cms";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Key Clients & Trainee Job Tie-Up Companies",
  description:
    "Explore JCRM Technologies' corporate alliances, key clients, and trainee job tie-up companies. See where our engineering, ERP, and tech graduates get hired.",
  openGraph: {
    title: "Key Clients & Job Tie-Up Companies | JCRM Technologies",
    description:
      "Explore official corporate tie-ups and top tier hiring partners hiring JCRM Technologies graduates.",
    type: "website",
  },
};

export default async function KeyClientsPage() {
  const cmsData = await getSiteContent("public-key-clients").catch(() => null);

  return <KeyClientsPageClient cmsData={cmsData} />;
}
