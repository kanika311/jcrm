import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { fetchRawAdminData, computeAdminReports } from "@/lib/adminReports";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const isDev = process.env.NODE_ENV === "development";
    const isAdmin = session?.user && (session.user as any).role === "ADMIN";

    if (!isDev && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const range = (searchParams.get("range") || "this_month") as
      | "today"
      | "this_week"
      | "this_month"
      | "custom"
      | "all";
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;

    const rawData = await fetchRawAdminData();
    const report = computeAdminReports(rawData, { range, startDate, endDate });

    return NextResponse.json({ success: true, data: report });
  } catch (error: any) {
    console.error("Error in GET /api/admin/reports:", error);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
