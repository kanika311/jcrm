import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import sharp from "sharp";
import { TEAM_MEMBERS } from "@/lib/teamData";
import { getOptimizedImageUrl } from "@/lib/imageOptimize";

export const dynamic = "force-dynamic";

// In-memory cache for ultra-fast repeated avatar delivery
const avatarCache = new Map<string, { buffer: Buffer; contentType: string; time: number }>();
const MAX_CACHE_ENTRIES = 300;
const CACHE_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

function getCached(key: string) {
  const item = avatarCache.get(key);
  if (!item) return null;
  if (Date.now() - item.time > CACHE_TTL_MS) {
    avatarCache.delete(key);
    return null;
  }
  return item;
}

function setCached(key: string, buffer: Buffer, contentType: string) {
  if (avatarCache.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = avatarCache.keys().next().value;
    if (oldestKey) avatarCache.delete(oldestKey);
  }
  avatarCache.set(key, { buffer, contentType, time: Date.now() });
}

function generateSvgFallback(name?: string, size = 320): string {
  const initials = (name || "JCRM")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" rx="${size / 2}" fill="#0055FF"/>
    <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="${size * 0.38}px">${initials || "J"}</text>
  </svg>`;
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id || !id.trim()) {
      return NextResponse.json({ message: "Missing candidate id" }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const widthParam = searchParams.get("w");
    const qualityParam = searchParams.get("q");

    const width = widthParam ? Math.min(Math.max(parseInt(widthParam, 10), 32), 1200) : 320;
    const quality = qualityParam ? Math.min(Math.max(parseInt(qualityParam, 10), 30), 100) : 80;

    const cacheKey = `${id}_w${width}_q${quality}`;
    const cached = getCached(cacheKey);
    if (cached) {
      return new NextResponse(new Uint8Array(cached.buffer), {
        status: 200,
        headers: {
          "Content-Type": cached.contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
          "X-Avatar-Cache": "HIT",
          "Content-Length": String(cached.buffer.length),
        },
      });
    }

    // 1. Fetch member image from MongoDB
    let rawImage: string | null = null;
    let memberName: string = "Team Member";

    try {
      const dbMember = await prisma.teamMember.findUnique({
        where: { id },
        select: { image: true, name: true },
      });
      if (dbMember) {
        rawImage = dbMember.image || null;
        memberName = dbMember.name || memberName;
      }
    } catch (dbErr: any) {
      console.warn("[AVATAR_DB_FETCH_WARN]", id, dbErr?.message);
    }

    // 2. Check static default members if not in DB
    if (!rawImage) {
      const staticMember = TEAM_MEMBERS.find((m) => m.id === id);
      if (staticMember) {
        rawImage = staticMember.image;
        memberName = staticMember.name;
      }
    }

    // If still no image found, return SVG fallback
    if (!rawImage || !rawImage.trim()) {
      const svg = generateSvgFallback(memberName, width);
      return new NextResponse(svg, {
        status: 200,
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "public, max-age=86400",
        },
      });
    }

    const trimmed = rawImage.trim();

    // 3. If image is a Base64 string, compress into WebP on the fly (100% in-memory)
    if (trimmed.startsWith("data:image/")) {
      const match = trimmed.match(/^data:image\/[a-zA-Z0-9+.-]+;base64,(.+)$/);
      if (match && match[1]) {
        const inputBuffer = Buffer.from(match[1], "base64");
        let outputBuffer: Buffer;
        let contentType = "image/webp";

        try {
          outputBuffer = await sharp(inputBuffer, { failOn: "none" })
            .rotate()
            .resize(width, width, { fit: "cover", withoutEnlargement: true })
            .webp({ quality, effort: 4 })
            .toBuffer();
        } catch (sharpErr) {
          console.warn("[AVATAR_SHARP_FALLBACK]", id, sharpErr);
          outputBuffer = inputBuffer;
          contentType = trimmed.slice(5, trimmed.indexOf(";")) || "image/jpeg";
        }

        setCached(cacheKey, outputBuffer, contentType);

        return new NextResponse(new Uint8Array(outputBuffer), {
          status: 200,
          headers: {
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=31536000, immutable",
            "X-Avatar-Cache": "MISS",
            "Content-Length": String(outputBuffer.length),
          },
        });
      }
    }

    // 4. If image is already an external URL or static upload, redirect to optimized version
    const optimizedUrl = getOptimizedImageUrl(trimmed, {
      width,
      height: width,
      quality,
      fit: "cover",
    });

    return NextResponse.redirect(optimizedUrl || trimmed, 307);
  } catch (error: any) {
    console.error("[AVATAR_API_ERROR]", error?.message || error);
    const svg = generateSvgFallback("JCRM", 320);
    return new NextResponse(svg, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }
}
