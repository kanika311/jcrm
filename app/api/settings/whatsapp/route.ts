import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { getWhatsAppSettings, saveWhatsAppSettings } from "@/lib/whatsappSettings";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const config = await getWhatsAppSettings();
    return NextResponse.json({ success: true, data: config });
  } catch (error: any) {
    console.error("Error in GET /api/settings/whatsapp:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const isDev = process.env.NODE_ENV === "development";
    const isAdmin = session?.user && (session.user as any).role === "ADMIN";

    if (!isDev && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const updated = await saveWhatsAppSettings(body);

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("Error in POST /api/settings/whatsapp:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
