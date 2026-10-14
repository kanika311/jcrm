import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

// Helper to check for private/internal IP or localhost (anti-SSRF)
function isDisallowedHost(hostname: string): boolean {
  const lower = hostname.toLowerCase();
  if (
    lower === "localhost" ||
    lower.endsWith(".local") ||
    lower.endsWith(".internal") ||
    lower === "127.0.0.1" ||
    lower === "::1" ||
    lower === "0.0.0.0"
  ) {
    return true;
  }
  // Check private IP ranges
  if (/^10\./.test(lower) || /^192\.168\./.test(lower) || /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(lower)) {
    return true;
  }
  return false;
}

// Clean and resolve URL
function resolveUrl(relativeOrAbsolute: string, baseUrl: string): string {
  try {
    return new URL(relativeOrAbsolute, baseUrl).href;
  } catch {
    return relativeOrAbsolute;
  }
}

// Extract attribute value helper from HTML string
function extractAttr(html: string, pattern: RegExp): string | null {
  const match = html.match(pattern);
  return match && match[1] ? match[1].trim() : null;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    let rawUrl = (body.url || "").trim();

    if (!rawUrl) {
      return NextResponse.json({ message: "URL is required" }, { status: 400 });
    }

    // Add protocol if missing
    if (!/^https?:\/\//i.test(rawUrl)) {
      rawUrl = `https://${rawUrl}`;
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(rawUrl);
    } catch {
      return NextResponse.json({ message: "Invalid URL provided" }, { status: 400 });
    }

    if (isDisallowedHost(parsedUrl.hostname)) {
      return NextResponse.json({ message: "Local or private addresses are disallowed" }, { status: 400 });
    }

    const domain = parsedUrl.hostname.replace(/^www\./i, "");
    const fallbackFavicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

    let coverImage = "";
    let logoImage = "";
    let pageTitle = "";
    let pageDescription = "";

    try {
      const response = await fetch(parsedUrl.href, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 (compatible; JcrmBot/1.0)",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
        signal: AbortSignal.timeout(8000),
        redirect: "follow",
      });

      if (response.ok) {
        const finalUrl = response.url || parsedUrl.href;
        const html = await response.text();

        // 1. Extract Title
        const ogTitle =
          extractAttr(html, /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) ||
          extractAttr(html, /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i);
        const titleTag = extractAttr(html, /<title[^>]*>([^<]+)<\/title>/i);
        pageTitle = ogTitle || titleTag || "";

        // 2. Extract Description
        const ogDesc =
          extractAttr(html, /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i) ||
          extractAttr(html, /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i);
        const metaDesc =
          extractAttr(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
          extractAttr(html, /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
        pageDescription = ogDesc || metaDesc || "";

        // 3. Extract Cover Image (OG / Twitter / image_src)
        const rawCover =
          extractAttr(html, /<meta[^>]+property=["']og:image:secure_url["'][^>]+content=["']([^"']+)["']/i) ||
          extractAttr(html, /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
          extractAttr(html, /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i) ||
          extractAttr(html, /<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["']/i) ||
          extractAttr(html, /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image(?::src)?["']/i) ||
          extractAttr(html, /<link[^>]+rel=["']image_src["'][^>]+href=["']([^"']+)["']/i);

        if (rawCover) {
          coverImage = resolveUrl(rawCover, finalUrl);
        }

        // 4. Extract Logo / Favicon
        const rawAppleTouchIcon =
          extractAttr(html, /<link[^>]+rel=["']apple-touch-icon(?:-precomposed)?["'][^>]+href=["']([^"']+)["']/i) ||
          extractAttr(html, /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']apple-touch-icon(?:-precomposed)?["']/i);

        const rawSvgIcon =
          extractAttr(html, /<link[^>]+rel=["'](?:shortcut )?icon["'][^>]+type=["']image\/svg\+xml["'][^>]+href=["']([^"']+)["']/i) ||
          extractAttr(html, /<link[^>]+href=["']([^"']+)["'][^>]+type=["']image\/svg\+xml["']/i);

        const rawStandardIcon =
          extractAttr(html, /<link[^>]+rel=["'](?:shortcut )?icon["'][^>]+href=["']([^"']+)["']/i) ||
          extractAttr(html, /<link[^>]+href=["']([^"']+)["'][^>]+rel=["'](?:shortcut )?icon["']/i);

        const rawOgLogo =
          extractAttr(html, /<meta[^>]+property=["']og:logo["'][^>]+content=["']([^"']+)["']/i) ||
          extractAttr(html, /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:logo["']/i);

        const selectedLogo = rawOgLogo || rawAppleTouchIcon || rawSvgIcon || rawStandardIcon;
        if (selectedLogo) {
          logoImage = resolveUrl(selectedLogo, finalUrl);
        }
      }
    } catch (fetchErr) {
      console.warn("[FETCH_LINK_META_WARNING]", fetchErr);
    }

    // Default logo to Google's 128px favicon service if no high-res logo was discovered
    if (!logoImage) {
      logoImage = fallbackFavicon;
    }

    return NextResponse.json({
      success: true,
      url: parsedUrl.href,
      domain,
      title: pageTitle.trim(),
      description: pageDescription.trim(),
      image: coverImage || null,
      logo: logoImage || fallbackFavicon,
    });
  } catch (err: any) {
    console.error("[FETCH_LINK_META_ERROR]", err);
    return NextResponse.json(
      { message: err.message || "Failed to fetch metadata from link" },
      { status: 500 }
    );
  }
}
