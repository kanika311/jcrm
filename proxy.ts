import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Constructs a Content-Security-Policy with strict nonce-based execution.
 *
 * Directives:
 * - default-src: 'self'
 * - script-src: 'self', 'nonce-${nonce}', 'strict-dynamic', explicit third-parties.
 *   Removes 'unsafe-inline' and 'unsafe-eval' (unsafe-eval allowed ONLY in development
 *   for React fast-refresh/debugger stack frames).
 * - style-src: 'self', 'nonce-${nonce}', 'unsafe-inline', https://fonts.googleapis.com
 *   Note on 'unsafe-inline' for style-src:
 *   Retained strictly for styles because Tailwind CSS and Framer Motion dynamically inject
 *   inline style attributes and CSS custom properties (--var). In CSP Level 3, 'strict-dynamic'
 *   does NOT apply to stylesheets, making 'unsafe-inline' necessary for dynamic styling.
 * - img-src: 'self', data:, blob:, explicit trusted CDNs and Razorpay.
 * - font-src: 'self', data:, https://fonts.gstatic.com, https://meet.jit.si.
 * - connect-src: 'self', Razorpay, Google Analytics, Jitsi (HTTPS & WSS), Firebase.
 * - frame-src: 'self', Razorpay checkout & API, YouTube, Vimeo, Jitsi, Google Maps.
 * - child-src: 'self', blob:, Razorpay.
 * - media-src: 'self', blob:, data:, YouTube, Vimeo, Jitsi.
 * - object-src: 'none'
 * - base-uri: 'self'
 * - form-action: 'self', Razorpay.
 * - frame-ancestors: 'self'
 * - upgrade-insecure-requests
 * - report-uri /api/csp-report; report-to csp-endpoint
 */
export function buildCsp(nonce: string, isDev: boolean): string {
  const scriptSrc = [
    "'self'",
    `'nonce-${nonce}'`,
    "'strict-dynamic'",
    "https://checkout.razorpay.com",
    "https://api.razorpay.com",
    "https://*.razorpay.com",
    "https://www.googletagmanager.com",
    "https://*.google-analytics.com",
    "https://analytics.google.com",
    "https://meet.jit.si",
    "https://*.jit.si",
    ...(isDev ? ["'unsafe-eval'"] : []),
  ].join(" ");

  const styleSrc = [
    "'self'",
    `'nonce-${nonce}'`,
    "'unsafe-inline'",
    "https://fonts.googleapis.com",
  ].join(" ");

  const imgSrc = [
    "'self'",
    "data:",
    "blob:",
    "https://images.unsplash.com",
    "https://i.pravatar.cc",
    "https://lh3.googleusercontent.com",
    "https://res.cloudinary.com",
    "https://firebasestorage.googleapis.com",
    "https://purecatamphetamine.github.io",
    "https://*.google-analytics.com",
    "https://analytics.google.com",
    "https://www.googletagmanager.com",
    "https://checkout.razorpay.com",
    "https://*.razorpay.com",
  ].join(" ");

  const connectSrc = [
    "'self'",
    "https://api.razorpay.com",
    "https://*.razorpay.com",
    "https://checkout.razorpay.com",
    "https://*.google-analytics.com",
    "https://analytics.google.com",
    "https://www.googletagmanager.com",
    "https://meet.jit.si",
    "https://*.jit.si",
    "wss://meet.jit.si",
    "wss://*.jit.si",
    "https://identitytoolkit.googleapis.com",
    "https://securetoken.googleapis.com",
  ].join(" ");

  const frameSrc = [
    "'self'",
    "https://checkout.razorpay.com",
    "https://api.razorpay.com",
    "https://*.razorpay.com",
    "https://www.youtube.com",
    "https://*.youtube.com",
    "https://www.youtube-nocookie.com",
    "https://player.vimeo.com",
    "https://*.vimeo.com",
    "https://meet.jit.si",
    "https://*.jit.si",
    "https://www.google.com/maps",
    "https://maps.google.com",
  ].join(" ");

  const childSrc = [
    "'self'",
    "blob:",
    "https://checkout.razorpay.com",
    "https://api.razorpay.com",
    "https://*.razorpay.com",
  ].join(" ");

  const mediaSrc = [
    "'self'",
    "blob:",
    "data:",
    "https://*.youtube.com",
    "https://*.vimeo.com",
    "https://meet.jit.si",
    "https://*.jit.si",
  ].join(" ");

  const fontSrc = [
    "'self'",
    "data:",
    "https://fonts.gstatic.com",
    "https://meet.jit.si",
  ].join(" ");

  return [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    `style-src ${styleSrc}`,
    `img-src ${imgSrc}`,
    `font-src ${fontSrc}`,
    `connect-src ${connectSrc}`,
    `frame-src ${frameSrc}`,
    `child-src ${childSrc}`,
    `media-src ${mediaSrc}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://api.razorpay.com https://*.razorpay.com",
    "frame-ancestors 'self'",
    "upgrade-insecure-requests",
    "report-uri /api/csp-report",
    "report-to csp-endpoint",
  ].join("; ");
}

export const PERMISSIONS_POLICY =
  'camera=(self "https://meet.jit.si"), microphone=(self "https://meet.jit.si"), display-capture=(self "https://meet.jit.si"), geolocation=(), payment=(self "https://checkout.razorpay.com"), usb=(), bluetooth=(), magnetometer=(), gyroscope=(), accelerometer=(), interest-cohort=()';

export function proxy(req: NextRequest) {
  // Reject debug or probing HTTP methods
  if (req.method === "TRACE" || req.method === "TRACK") {
    return new NextResponse(null, { status: 405 });
  }

  const isDev = process.env.NODE_ENV === "development";
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const cspHeaderValue = buildCsp(nonce, isDev);

  // Toggle report-only mode via environment variable (default: enforced)
  const isReportOnly = process.env.CSP_REPORT_ONLY === "true";
  const cspHeaderName = isReportOnly
    ? "Content-Security-Policy-Report-Only"
    : "Content-Security-Policy";

  // Forward nonce and CSP in request headers so Next.js App Router
  // server renderer injects nonces into framework script tags.
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set(cspHeaderName, cspHeaderValue);

  const res = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Set CSP on the response
  res.headers.set(cspHeaderName, cspHeaderValue);

  // Set Permissions-Policy (Task 3)
  res.headers.set("Permissions-Policy", PERMISSIONS_POLICY);

  // Set Reporting API endpoint
  res.headers.set("Reporting-Endpoints", 'csp-endpoint="/api/csp-report"');

  // Baseline security headers
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "SAMEORIGIN");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );

  // Prevent caching of private authenticated dashboards and sensitive endpoints (Task 5)
  const pathname = req.nextUrl.pathname;
  if (
    pathname.startsWith("/student") ||
    pathname.startsWith("/faculty") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/onboarding") ||
    pathname === "/auth"
  ) {
    res.headers.set(
      "Cache-Control",
      "private, no-store, no-cache, must-revalidate"
    );
    res.headers.set("Pragma", "no-cache");
    res.headers.set("Expires", "0");
  }

  return res;
}

export default proxy;

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon)
     * - static image/font extensions
     */
    {
      source:
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf)$).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
