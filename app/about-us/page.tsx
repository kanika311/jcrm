import type { Metadata } from "next";
import { getSiteContent } from "@/lib/cms";
import AboutClient from "../about/AboutClient";
import { getSeoMetadata } from "@/lib/seoConfig";

export const metadata: Metadata = getSeoMetadata("/about");

export default async function AboutUsHyphenPage() {
  const cmsData = await getSiteContent("public-about");
  return <AboutClient cmsData={cmsData} />;
}
