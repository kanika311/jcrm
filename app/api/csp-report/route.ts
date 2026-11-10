import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

/**
 * CSP Violation Report Endpoint
 * Receives reports sent by browsers via `report-uri /api/csp-report`
 * and modern `report-to csp-endpoint`.
 */
export async function POST(req: NextRequest) {
  try {
    // Rate limit reporting to prevent report flooding/DoS (100 reports / min per IP)
    const ip = getClientIp(req);
    const rateLimit = checkRateLimit(`csp-report:${ip}`, 100, 60 * 1000);
    if (!rateLimit.allowed) {
      return new NextResponse(null, { status: 429 });
    }

    const contentType = req.headers.get("content-type") || "";
    let reportData: any = null;

    if (
      contentType.includes("application/csp-report") ||
      contentType.includes("application/json") ||
      contentType.includes("application/reports+json")
    ) {
      reportData = await req.json().catch(() => null);
    } else {
      const text = await req.text().catch(() => "");
      try {
        reportData = JSON.parse(text);
      } catch {
        reportData = { raw: text };
      }
    }

    if (process.env.NODE_ENV !== "production") {
      const cspReport = reportData?.["csp-report"] || reportData;
      console.warn("[CSP Violation]", JSON.stringify(cspReport));
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    // Endpoints for CSP reports should always return cleanly
    return new NextResponse(null, { status: 204 });
  }
}

export async function GET() {
  return new NextResponse(null, { status: 405 });
}
