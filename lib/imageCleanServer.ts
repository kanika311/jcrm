import sharp from "sharp";
import path from "path";
import { writeFile, mkdir } from "fs/promises";
import { getOptimizedImageUrl } from "./imageOptimize";
import { prisma } from "./prisma";

/**
 * Ensures any image (especially huge base64 strings or uncompressed uploads)
 * is converted to a compact WebP format (< 25KB) on the server, preventing
 * megabyte-sized HTML payloads and drastically improving page response time.
 */
export async function sanitizeCandidateImage(
  id: string,
  rawImage?: string | null
): Promise<string> {
  if (!rawImage || !rawImage.trim()) return "";
  const trimmed = rawImage.trim();

  // If it is a base64 data URL embedded in the database
  if (trimmed.startsWith("data:image/")) {
    try {
      const match = trimmed.match(/^data:image\/[a-zA-Z0-9+.-]+;base64,(.+)$/);
      if (match && match[1]) {
        const buffer = Buffer.from(match[1], "base64");
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        await mkdir(uploadDir, { recursive: true });

        const safeId = (id || "placed").replace(/[^\w-]/g, "").slice(0, 30);
        const filename = `placed-${safeId}-${Date.now().toString(36)}.webp`;

        const webpBuffer = await sharp(buffer, { failOn: "none" })
          .rotate()
          .resize(320, 320, { fit: "cover" })
          .webp({ quality: 80, effort: 4 })
          .toBuffer();

        await writeFile(path.join(uploadDir, filename), webpBuffer);
        const newUrl = `/uploads/${filename}`;

        // Asynchronously update MongoDB so this member's image is permanently a clean URL
        if (id && !id.startsWith("default-")) {
          prisma.teamMember.update({
            where: { id },
            data: { image: newUrl },
          }).catch((err: any) => console.warn("[CLEAN_DB_IMAGE_UPDATE_FAIL]", err?.message));
        }

        return newUrl;
      }
    } catch (err: any) {
      console.warn("[SANITIZE_BASE64_FAIL]", err?.message);
    }
  }

  // Transform to optimized WebP URL
  return getOptimizedImageUrl(trimmed, { width: 320, height: 320, quality: 80 });
}
