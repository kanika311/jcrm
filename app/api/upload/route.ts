import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

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

    // Check size limit (15MB for raw uploads before/after conversion)
    const MAX_SIZE = 15 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ message: "File exceeds 15MB limit" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    try {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });

      const isWebp = file.type === "image/webp" || file.name?.toLowerCase().endsWith(".webp");
      const ext = isWebp ? ".webp" : (path.extname(file.name || "").toLowerCase() || ".webp");
      const safeBase = (file.name || "upload")
        .replace(/\.[^/.]+$/, "")
        .replace(/[^\w-]/g, "_")
        .slice(0, 50);
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${safeBase}${ext}`;

      await writeFile(path.join(uploadDir, filename), buffer);

      return NextResponse.json(
        { 
          url: `/uploads/${filename}`,
          format: isWebp ? "webp" : ext.replace(".", ""),
        },
        { status: 200 }
      );
    } catch (fsError) {
      console.warn("[UPLOAD_FS_FALLBACK]", fsError);
      // Fallback to base64 if directory isn't writable
      const mimeType = file.type || "image/webp";
      const base64String = `data:${mimeType};base64,${buffer.toString("base64")}`;
      return NextResponse.json({ url: base64String, format: "webp" }, { status: 200 });
    }
  } catch (error) {
    console.error("[UPLOAD_ERROR]", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
