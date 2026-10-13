import type { Metadata } from "next";
import KeyClientsPageClient from "@/components/KeyClientsPageClient";
import { getSiteContent } from "@/lib/cms";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Trainee Placements & Job Tie-Up Companies",
  description:
    "Explore JCRM Technologies' verified hiring partners, key corporate clients, and job tie-up companies where our trainees get placed.",
  openGraph: {
    title: "Trainee Placements & Job Tie-Up Companies | JCRM Technologies",
    description:
      "Explore official corporate tie-ups and top tier hiring partners hiring JCRM Technologies graduates.",
    type: "website",
  },
};

export default async function PlacementsPage() {
  const cmsData = await getSiteContent("public-placements").catch(() => null);

  return <KeyClientsPageClient cmsData={cmsData} />;
}