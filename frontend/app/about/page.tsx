import { getSiteContent } from "@/lib/cms";
import AboutClient from "./AboutClient";

export default async function AboutPage() {
  const cmsData = await getSiteContent("public-about");
  return <AboutClient cmsData={cmsData} />;
}