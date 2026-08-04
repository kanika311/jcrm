import SettingsClient from "./SettingsClient";
import { getSiteContent } from "@/lib/cms";

export default async function SettingsPage() {
  const cmsData = await getSiteContent("student-settings");

  return <SettingsClient cmsData={cmsData} />;
}