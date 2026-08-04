import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ message: "No file received" }, { status: 400 });
    }

    // Check size limit (2MB)
    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ message: "File exceeds 2MB limit" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Return the base64 string as the URL
    const base64String = `data:${file.type};base64,${buffer.toString("base64")}`;
    return NextResponse.json({ url: base64String }, { status: 200 });

  } catch (error) {
    console.error("[UPLOAD_ERROR]", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
