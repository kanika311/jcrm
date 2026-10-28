import ReportsDashboardClient from "./reports/ReportsDashboardClient";
import { fetchRawAdminData, computeAdminReports } from "@/lib/adminReports";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== "ADMIN") {
    redirect("/jcrm-sushant?error=AccessDenied");
  }

  const rawData = await fetchRawAdminData();
  const initialReport = computeAdminReports(rawData, { range: "this_month" });

  return <ReportsDashboardClient initialReport={initialReport} />;
}