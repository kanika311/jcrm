import CalendarClient from "./CalendarClient";
import { getSiteContent } from "@/lib/cms";

export default async function CalendarPage() {
  const cmsData = await getSiteContent("student-calendar");

  return <CalendarClient cmsData={cmsData} />;
}