import { NextResponse } from "next/server";
import sharp from "sharp";
import path from "path";
import { readFile } from "fs/promises";
import { existsSync } from "fs";

// In-memory LRU-style cache for high-speed repeated access (max 200 images)
const memoryCache = new Map<string, { buffer: Buffer; contentType: string; time: number }>();
const MAX_CACHE_SIZE = 200;

function getCached(key: string) {
  const item = memoryCache.get(key);
  if (!item) return null;
  // Cache TTL: 2 hours in memory
  if (Date.now() - item.time > 2 * 60 * 60 * 1000) {
    memoryCache.delete(key);
    return null;
  }
  return item;
}

function setCached(key: string, buffer: Buffer, contentType: string) {
  if (memoryCache.size >= MAX_CACHE_SIZE) {
    const oldestKey = memoryCache.keys().next().value;
    if (oldestKey) memoryCache.delete(oldestKey);
  }
  memoryCache.set(key, { buffer, contentType, time: Date.now() });
}

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const rawUrl = searchParams.get("url");

    if (!rawUrl || !rawUrl.trim()) {
      return NextResponse.json({ message: "Missing url parameter" }, { status: 400 });
    }

    const trimmedUrl = rawUrl.trim();

    // Parse dimensions & quality
    const widthParam = searchParams.get("w");
    const heightParam = searchParams.get("h");
    const qualityParam = searchParams.get("q");
    const fitParam = (searchParams.get("fit") as "cover" | "contain" | "inside") || "cover";

    const width = widthParam ? Math.min(Math.max(parseInt(widthParam, 10), 16), 1920) : 320;
    const height = heightParam ? Math.min(Math.max(parseInt(heightParam, 10), 16), 1920) : undefined;
    const quality = qualityParam ? Math.min(Math.max(parseInt(qualityParam, 10), 30), 100) : 80;

    const cacheKey = `${trimmedUrl}_w${width}_h${height || "auto"}_q${quality}_fit${fitParam}`;
    const cached = getCached(cacheKey);
    if (cached) {
      return new NextResponse(new Uint8Array(cached.buffer), {
        status: 200,
        headers: {
          "Content-Type": cached.contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
          "X-Image-Cache": "HIT",
        },
      });
    }

    let inputBuffer: Buffer | null = null;

    // Case 1: Data URL (base64)
    if (trimmedUrl.startsWith("data:image/")) {
      const match = trimmedUrl.match(/^data:image\/[a-zA-Z0-9+.-]+;base64,(.+)$/);
      if (match && match[1]) {
        inputBuffer = Buffer.from(match[1], "base64");
      }
    }
    // Case 2: Local uploaded file path (e.g. /uploads/filename.ext or uploads/...)
    else if (trimmedUrl.startsWith("/") || trimmedUrl.startsWith("uploads/")) {
      const cleanPath = trimmedUrl.replace(/^\/+/, "");
      const fullPath = path.join(process.cwd(), "public", cleanPath);
      if (existsSync(fullPath)) {
        inputBuffer = await readFile(fullPath);
      }
    }
    // Case 3: Remote HTTP/HTTPS URL
    else if (/^https?:\/\//i.test(trimmedUrl)) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);

      try {
        const response = await fetch(trimmedUrl, {
          signal: controller.signal,
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) JCRM/1.0",
            Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
          },
        });
        clearTimeout(timeout);

        if (response.ok) {
          inputBuffer = Buffer.from(await response.arrayBuffer());
        }
      } catch (fetchErr) {
        clearTimeout(timeout);
        console.warn("[IMAGE_OPTIMIZE_FETCH_FAIL]", trimmedUrl, fetchErr);
      }
    }

    if (!inputBuffer || inputBuffer.length === 0) {
      // If we couldn't fetch or read the image, redirect to the original URL if external, or return 404
      if (/^https?:\/\//i.test(trimmedUrl)) {
        return NextResponse.redirect(trimmedUrl, 307);
      }
      return NextResponse.json({ message: "Image not found or inaccessible" }, { status: 404 });
    }

    // Process with sharp: Resize, Auto-Orient, Convert to WebP, Compress
    let pipeline = sharp(inputBuffer, { failOn: "none" }).rotate(); // auto-rotate based on EXIF

    if (height) {
      pipeline = pipeline.resize(width, height, {
        fit: fitParam,
        withoutEnlargement: true,
      });
    } else {
      pipeline = pipeline.resize(width, undefined, {
        fit: fitParam,
        withoutEnlargement: true,
      });
    }

    const outputBuffer = await pipeline
      .webp({
        quality,
        effort: 4,
        smartSubsample: true,
      })
      .toBuffer();

    setCached(cacheKey, outputBuffer, "image/webp");

    return new NextResponse(new Uint8Array(outputBuffer), {
      status: 200,
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Image-Cache": "MISS",
        "Content-Length": String(outputBuffer.length),
      },
    });
  } catch (error: any) {
    console.error("[IMAGE_OPTIMIZE_ERROR]", error?.message || error);

    // Fallback: if optimization fails, redirect to the raw URL if valid
    const url = new URL(req.url).searchParams.get("url");
    if (url && /^https?:\/\//i.test(url)) {
      return NextResponse.redirect(url, 307);
    }
    return NextResponse.json({ message: "Image optimization failed" }, { status: 500 });
  }
}
