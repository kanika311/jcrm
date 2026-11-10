import { buildCsp, PERMISSIONS_POLICY, proxy } from "../proxy";
import { NextRequest } from "next/server";
import { POST as cspReportHandler } from "../app/api/csp-report/route";
import nextConfig from "../next.config";

async function runTestSuite() {
  console.log("=== RUNNING CSP & HEADERS HARDENING VERIFICATION ===\n");
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}${detail ? ` - ${detail}` : ""}`);
      failed++;
    }
  }

  // TEST 1: CSP in Production has no unsafe-inline or unsafe-eval in script-src
  const nonce = "testNonce123456==";
  const prodCsp = buildCsp(nonce, false);
  const scriptSrcMatch = prodCsp.match(/script-src ([^;]+);/);
  const scriptSrc = scriptSrcMatch ? scriptSrcMatch[1] : "";

  assert(
    scriptSrc.includes(`'nonce-${nonce}'`),
    "CSP script-src includes dynamic nonce",
    scriptSrc
  );
  assert(
    scriptSrc.includes("'strict-dynamic'"),
    "CSP script-src includes 'strict-dynamic'",
    scriptSrc
  );
  assert(
    !scriptSrc.includes("'unsafe-inline'"),
    "CSP script-src does NOT include 'unsafe-inline' in production",
    scriptSrc
  );
  assert(
    !scriptSrc.includes("'unsafe-eval'"),
    "CSP script-src does NOT include 'unsafe-eval' in production",
    scriptSrc
  );

  // TEST 2: CSP explicit origins for Razorpay, YouTube, Vimeo, Jitsi, Google Analytics
  assert(
    scriptSrc.includes("https://checkout.razorpay.com") &&
      scriptSrc.includes("https://api.razorpay.com"),
    "CSP includes Razorpay checkout and API in script-src"
  );
  assert(
    prodCsp.includes("https://www.youtube.com") &&
      prodCsp.includes("https://player.vimeo.com"),
    "CSP frame-src includes YouTube and Vimeo embeds"
  );
  assert(
    prodCsp.includes("https://meet.jit.si") &&
      prodCsp.includes("wss://meet.jit.si"),
    "CSP includes Jitsi HTTPS and WSS in connect-src / frame-src"
  );
  assert(
    prodCsp.includes("https://www.googletagmanager.com") &&
      prodCsp.includes("https://*.google-analytics.com"),
    "CSP includes Google Analytics and Tag Manager"
  );
  assert(
    prodCsp.includes("object-src 'none'"),
    "CSP restricts object-src to 'none'"
  );
  assert(
    prodCsp.includes("base-uri 'self'"),
    "CSP restricts base-uri to 'self'"
  );
  assert(
    prodCsp.includes("frame-ancestors 'self'"),
    "CSP sets frame-ancestors 'self'"
  );
  assert(
    prodCsp.includes("upgrade-insecure-requests"),
    "CSP sets upgrade-insecure-requests"
  );
  assert(
    prodCsp.includes("report-uri /api/csp-report"),
    "CSP sets report-uri /api/csp-report"
  );

  // TEST 3: Dev mode allows unsafe-eval for React fast-refresh
  const devCsp = buildCsp(nonce, true);
  assert(
    devCsp.includes("'unsafe-eval'"),
    "CSP development mode allows 'unsafe-eval' for React fast-refresh"
  );

  // TEST 4: Permissions-Policy adheres to Task 3 requirements
  assert(
    PERMISSIONS_POLICY.includes('camera=(self "https://meet.jit.si")'),
    "Permissions-Policy allows camera for self and Jitsi"
  );
  assert(
    PERMISSIONS_POLICY.includes('microphone=(self "https://meet.jit.si")'),
    "Permissions-Policy allows microphone for self and Jitsi"
  );
  assert(
    PERMISSIONS_POLICY.includes('payment=(self "https://checkout.razorpay.com")'),
    "Permissions-Policy allows payment for Razorpay checkout"
  );
  assert(
    PERMISSIONS_POLICY.includes("geolocation=()"),
    "Permissions-Policy disables geolocation"
  );
  assert(
    PERMISSIONS_POLICY.includes("usb=()") &&
      PERMISSIONS_POLICY.includes("bluetooth=()") &&
      PERMISSIONS_POLICY.includes("interest-cohort=()"),
    "Permissions-Policy restricts usb, bluetooth, and interest-cohort"
  );

  // TEST 5: Proxy rejects TRACE and TRACK HTTP methods
  const traceReq = {
    method: "TRACE",
    headers: new Headers(),
    nextUrl: new URL("http://localhost:3000/any"),
  } as unknown as NextRequest;
  const traceRes = proxy(traceReq);
  assert(traceRes.status === 405, "Proxy blocks TRACE request with HTTP 405");

  const trackReq = {
    method: "TRACK",
    headers: new Headers(),
    nextUrl: new URL("http://localhost:3000/any"),
  } as unknown as NextRequest;
  const trackRes = proxy(trackReq);
  assert(trackRes.status === 405, "Proxy blocks TRACK request with HTTP 405");

  // TEST 6: Proxy sets headers on standard page requests
  const pageReq = new NextRequest("http://localhost:3000/");
  const pageRes = proxy(pageReq);
  const cspHeader = pageRes.headers.get("Content-Security-Policy");
  assert(!!cspHeader, "Proxy sets Content-Security-Policy header on response");
  assert(
    pageRes.headers.get("Permissions-Policy") === PERMISSIONS_POLICY,
    "Proxy sets Permissions-Policy header on response"
  );
  assert(
    pageRes.headers.get("X-Content-Type-Options") === "nosniff",
    "Proxy sets X-Content-Type-Options: nosniff"
  );
  assert(
    pageRes.headers.get("X-Frame-Options") === "SAMEORIGIN",
    "Proxy sets X-Frame-Options: SAMEORIGIN"
  );

  // TEST 7: Proxy enforces private, no-store caching on authenticated routes (Task 5)
  const studentReq = new NextRequest("http://localhost:3000/student/courses");
  const studentRes = proxy(studentReq);
  const cacheControl = studentRes.headers.get("Cache-Control");
  assert(
    Boolean(cacheControl?.includes("private") && cacheControl?.includes("no-store")),
    "Proxy sets Cache-Control: private, no-store on /student/* routes",
    cacheControl || ""
  );

  const apiReq = new NextRequest("http://localhost:3000/api/student/classroom");
  const apiRes = proxy(apiReq);
  const apiCacheControl = apiRes.headers.get("Cache-Control");
  assert(
    Boolean(apiCacheControl?.includes("private") && apiCacheControl?.includes("no-store")),
    "Proxy sets Cache-Control: private, no-store on /api/* routes",
    apiCacheControl || ""
  );

  // TEST 8: next.config.ts has no duplicate static CSP and removed public caching on root
  const nextHeaders = await nextConfig.headers!();
  const rootHeaderRule = nextHeaders.find((h) => h.source === "/(.*)");
  const staticCsp = rootHeaderRule?.headers.find((h) => h.key === "Content-Security-Policy");
  assert(
    !staticCsp,
    "next.config.ts does not contain duplicate static CSP header (handled dynamically by proxy.ts)"
  );

  const publicRootCache = nextHeaders.find(
    (h) => h.source === "/" && h.headers.some((x) => x.value.includes("public, s-maxage"))
  );
  assert(
    !publicRootCache,
    "next.config.ts removed public s-maxage=3600 caching on root HTML (Task 5)"
  );

  // TEST 9: CSP Report Endpoint accepts reports and returns 204 No Content
  const cspReportReq = new NextRequest("http://localhost:3000/api/csp-report", {
    method: "POST",
    headers: { "Content-Type": "application/csp-report" },
    body: JSON.stringify({
      "csp-report": {
        "document-uri": "https://www.jcrm.in/student",
        "blocked-uri": "https://malicious.com/evil.js",
        "violated-directive": "script-src",
      },
    }),
  });
  const cspReportRes = await cspReportHandler(cspReportReq);
  assert(
    cspReportRes.status === 204,
    "CSP Report endpoint returns 204 No Content on valid violation report"
  );

  console.log(`\n=== RESULTS: ${passed} PASSED, ${failed} FAILED ===`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error("Test runner crashed:", err);
  process.exit(1);
});
