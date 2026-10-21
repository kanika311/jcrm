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

  // If it is a base64 data URL embedded in the database, delegate to /api/avatar/[id]
  // This avoids read-only filesystem errors on Vercel/serverless environments and prevents huge payloads.
  if (trimmed.startsWith("data:image/")) {
    if (id) {
      return `/api/avatar/${id}`;
    }
  }

  // Transform to optimized WebP URL
  return getOptimizedImageUrl(trimmed, { width: 320, height: 320, quality: 80 });
}
