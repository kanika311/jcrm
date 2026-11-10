// In-memory sliding-window rate limiter for sensitive authentication endpoints
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup stale records periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt <= now) {
      rateLimitStore.delete(key);
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
 * Check if a request for the given key exceeds the limit within the time window.
 * @param key Unique identifier (IP, email, or composite key)
 * @param limit Maximum allowed requests in the window (default: 10)
 * @param windowMs Time window in milliseconds (default: 15 minutes = 900,000 ms)
 */
export function checkRateLimit(
  key: string,
  limit: number = 10,
  windowMs: number = 15 * 60 * 1000
): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
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

/**
 * Clear a rate limit entry (e.g. upon successful authentication)
 */
export function clearRateLimit(key: string): void {
  rateLimitStore.delete(key);
}

/**
 * Extract sanitized client IP address from request headers.
 * Under Apache reverse proxy, X-Real-IP is set to the client's actual IP.
 */
export function getClientIp(req: Request): string {
  // 1. Prefer x-real-ip set by trusted reverse proxy (Apache)
  const realIp = req.headers.get("x-real-ip");
  if (realIp && realIp.trim()) {
    return realIp.trim();
  }

  // 2. Check x-forwarded-for
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const parts = forwarded.split(",").map((p) => p.trim()).filter(Boolean);
    if (parts.length > 0) {
      return parts[0];
    }
  }

  // 3. Fallback
  return "127.0.0.1";
}
