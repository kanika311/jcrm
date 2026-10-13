import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import sharp from "sharp";

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

    // Check size limit (15MB for raw incoming payload)
    const MAX_SIZE = 15 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ message: "File exceeds 15MB limit" }, { status: 400 });
    }

    const rawBuffer = Buffer.from(await file.arrayBuffer());

    // Compress & convert to WebP using sharp on the server
    let webpBuffer: Buffer = rawBuffer;
    let isWebp = false;

    try {
      webpBuffer = await sharp(rawBuffer, { failOn: "none" })
        .rotate() // auto-orient from EXIF
        .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 82, effort: 4 })
        .toBuffer();
      isWebp = true;
    } catch (sharpErr) {
      console.warn("[UPLOAD_SHARP_FALLBACK] Could not convert with sharp, using raw file:", sharpErr);
      isWebp = file.type === "image/webp" || file.name?.toLowerCase().endsWith(".webp");
    }

    try {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });

      const safeBase = (file.name || "upload")
        .replace(/\.[^/.]+$/, "")
        .replace(/[^\w-]/g, "_")
        .slice(0, 50);

      const ext = isWebp ? ".webp" : (path.extname(file.name || "").toLowerCase() || ".webp");
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${safeBase}${ext}`;

      await writeFile(path.join(uploadDir, filename), webpBuffer);

      return NextResponse.json(
        {
          url: `/uploads/${filename}`,
          format: "webp",
          sizeBytes: webpBuffer.length,
        },
        { status: 200 }
      );
    } catch (fsError) {
      console.warn("[UPLOAD_FS_FALLBACK]", fsError);
      // Fallback to compressed base64 if directory isn't writable
      const mimeType = isWebp ? "image/webp" : file.type || "image/webp";
      const base64String = `data:${mimeType};base64,${webpBuffer.toString("base64")}`;
      return NextResponse.json(
        {
          url: base64String,
          format: "webp",
          sizeBytes: webpBuffer.length,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("[UPLOAD_ERROR]", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
