// In-memory sliding-window rate limiter for sensitive authentication endpoints
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const ipStore = new Map<string, RateLimitEntry>();

// Cleanup stale records periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of ipStore.entries()) {
    if (entry.resetAt <= now) {
      ipStore.delete(key);
    }
  }
}, 60 * 1000).unref?.();

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
}

/**
 * Check if a request from the given IP exceeds the limit within the time window.
 * @param ip Client IP address or unique identifier
 * @param limit Maximum allowed requests in the window (default: 10)
 * @param windowMs Time window in milliseconds (default: 15 minutes = 900,000 ms)
 */
export function checkRateLimit(
  ip: string,
  limit: number = 10,
  windowMs: number = 15 * 60 * 1000
): RateLimitResult {
  const now = Date.now();
  const entry = ipStore.get(ip);

  if (!entry || entry.resetAt <= now) {
    ipStore.set(ip, { count: 1, resetAt: now + windowMs });
    return {
      allowed: true,
      limit,
      remaining: limit - 1,
      resetSeconds: Math.ceil(windowMs / 1000),
    };
  }

  if (entry.count >= limit) {
    return {
      allowed: false,
      limit,
      remaining: 0,
      resetSeconds: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  entry.count += 1;
  return {
    allowed: true,
    limit,
    remaining: limit - entry.count,
    resetSeconds: Math.ceil((entry.resetAt - now) / 1000),
  };
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") || "127.0.0.1";
}
