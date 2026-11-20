import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

const MIME_TYPES: Record<string, string> = {
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".avif": "image/avif",
  ".pdf": "application/pdf",
};

export async function GET(
  req: Request,
  context: { params: Promise<{ filename: string[] }> }
) {
  try {
    const { filename } = await context.params;
    if (!filename || !Array.isArray(filename) || filename.length === 0) {
      return new NextResponse("File not found", { status: 404 });
    }

    // Sanitize path against directory traversal
    const joined = filename.join("/");
    const normalized = path.normalize(joined).replace(/^(\.\.[\/\\])+/, "");
    if (normalized.includes("..")) {
      return new NextResponse("Invalid path", { status: 400 });
    }

    // Check multiple candidate locations (standard public/uploads, standalone root, Linux path)
    const candidatePaths = [
      path.join(process.cwd(), "public", "uploads", normalized),
      path.join(process.cwd(), ".next", "standalone", "public", "uploads", normalized),
      path.resolve("public", "uploads", normalized),
      path.join(process.env.INIT_CWD || process.cwd(), "public", "uploads", normalized),
      path.join("/var/www/jcrm/public/uploads", normalized),
    ];

    let fileBuffer: Buffer | null = null;
    for (const candidate of candidatePaths) {
      try {
        fileBuffer = await fs.readFile(candidate);
        break;
      } catch {
        // file not found in this candidate, try next
      }
    }

    if (!fileBuffer) {
      return new NextResponse("File not found", { status: 404 });
    }

    const ext = path.extname(normalized).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    return new NextResponse(new Uint8Array(fileBuffer), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("[UPLOADS_ROUTE_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
