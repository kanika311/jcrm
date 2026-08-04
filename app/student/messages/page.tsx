import MessagesClient from "./MessagesClient";
import { getSiteContent } from "@/lib/cms";

export default async function MessagesPage() {
  const cmsData = await getSiteContent("student-messages");

  return <MessagesClient cmsData={cmsData} />;
}