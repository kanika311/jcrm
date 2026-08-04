import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log("Testing minimal session retrieval without firebase-admin...");
    const session = await getServerSession({
      providers: [],
      secret: process.env.NEXTAUTH_SECRET || "dummy_secret"
    });
    return NextResponse.json({ 
      success: true, 
      hasSession: !!session,
      user: session?.user || null 
    });
  } catch (error: any) {
    console.error("Test admin session error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || String(error), 
      stack: error.stack 
    }, { status: 500 });
  }
}
