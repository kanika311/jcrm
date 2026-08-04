import { getSiteContent } from "@/lib/cms";
import AboutClient from "../about/AboutClient";

export default async function AboutUsHyphenPage() {
  const cmsData = await getSiteContent("public-about");
  return <AboutClient cmsData={cmsData} />;
}
