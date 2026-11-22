import type { Metadata } from "next";
import { getSiteContent } from "@/lib/cms";
import AboutClient from "./AboutClient";
import { getSeoMetadata } from "@/lib/seoConfig";

export const metadata: Metadata = getSeoMetadata("/about");

export default async function AboutPage() {
  const cmsData = await getSiteContent("public-about");
  return <AboutClient cmsData={cmsData} />;
}