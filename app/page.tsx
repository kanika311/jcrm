import LandingPageClient from "@/components/LandingPageClient";
import { getSiteContent } from "@/lib/cms";

export default async function Home() {
  const cmsData = await getSiteContent("public-home");
  return <LandingPageClient initialData={cmsData} />;
}