/**
 * Lightweight Origin / Referer validation to protect API mutations against CSRF
 */
export function verifySameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");

  if (!origin || !host) {
    // If origin is not provided (e.g. some native app or same-origin non-cross-site requests), check referer
    const referer = req.headers.get("referer");
    if (!referer) return true; // allow same-origin requests where headers are omitted by browser
    try {
      const refUrl = new URL(referer);
      return refUrl.host === host;
    } catch {
      return false;
    }
  }

  try {
    const originUrl = new URL(origin);
    return originUrl.host === host;
  } catch {
    return false;
  }
}

