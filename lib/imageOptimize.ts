/**
 * Utility to deliver compressed WebP images with custom dimensions
 * and aggressive caching to minimize payload size and maximize load speed.
 */

export interface OptimizeImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  fit?: "cover" | "contain" | "inside";
}

export function getOptimizedImageUrl(
  url?: string | null,
  options: OptimizeImageOptions = {}
): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (!trimmed) return "";

  // Data SVG or inline vector graphics don't need raster compression
  if (trimmed.startsWith("data:image/svg+xml")) return trimmed;

  const { width = 320, height, quality = 80, fit = "cover" } = options;

  // 1. Unsplash native edge CDN optimization (delivers WebP instantly)
  if (trimmed.includes("images.unsplash.com")) {
    try {
      const u = new URL(trimmed);
      u.searchParams.set("auto", "format");
      u.searchParams.set("fm", "webp");
      u.searchParams.set("w", String(width));
      if (height) u.searchParams.set("h", String(height));
      u.searchParams.set("q", String(quality));
      u.searchParams.set("fit", fit === "contain" ? "clamp" : "crop");
      return u.toString();
    } catch {
      // return fallback below
    }
  }

  // 2. Pravatar avatars
  if (trimmed.includes("i.pravatar.cc")) {
    try {
      const u = new URL(trimmed);
      const imgVal = u.searchParams.get("img") || "1";
      return `https://i.pravatar.cc/${width}?img=${imgVal}`;
    } catch {
      // fallback
    }
  }

  // 3. If already optimized via our API, return as is
  if (trimmed.startsWith("/api/image-optimize")) {
    return trimmed;
  }

  // 4. For local uploads (/uploads/...) or any external photo or base64 image:
  // Route through /api/image-optimize for sharp-powered WebP conversion and compression
  const params = new URLSearchParams();
  params.set("url", trimmed);
  params.set("w", String(width));
  if (height) params.set("h", String(height));
  params.set("q", String(quality));
  params.set("fit", fit);

  return `/api/image-optimize?${params.toString()}`;
}
