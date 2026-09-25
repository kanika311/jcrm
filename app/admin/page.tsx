import ReportsDashboardClient from "./reports/ReportsDashboardClient";
import { fetchRawAdminData, computeAdminReports } from "@/lib/adminReports";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const rawData = await fetchRawAdminData();
  const initialReport = computeAdminReports(rawData, { range: "this_month" });

  return <ReportsDashboardClient initialReport={initialReport} />;
}