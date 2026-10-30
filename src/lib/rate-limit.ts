/**
 * Fixed-window rate limiter kept in process memory.
 *
 * Limitation: on serverless hosting (Vercel) each function instance has its
 * own memory, and instances are recycled. This stops a single client from
 * hammering one warm instance, but it is not a global guarantee. For a shared
 * limit, implement `RateLimiter` with Redis (e.g. Upstash) — see README.
 */
export type RateLimitResult = { allowed: boolean; retryAfterSeconds: number };

export interface RateLimiter {
  check(key: string): Promise<RateLimitResult>;
}

type Bucket = { count: number; resetAt: number };

export function createMemoryRateLimiter({
  limit,
  windowMs,
}: {
  limit: number;
  windowMs: number;
}): RateLimiter {
  const buckets = new Map<string, Bucket>();

  return {
    async check(key) {
      const now = Date.now();

      // Opportunistic cleanup so the map cannot grow without bound.
      if (buckets.size > 5_000) {
        for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
      }

      const bucket = buckets.get(key);
      if (!bucket || bucket.resetAt <= now) {
        buckets.set(key, { count: 1, resetAt: now + windowMs });
        return { allowed: true, retryAfterSeconds: 0 };
      }

      if (bucket.count >= limit) {
        return {
          allowed: false,
          retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
        };
      }

      bucket.count += 1;
      return { allowed: true, retryAfterSeconds: 0 };
    },
  };
}

/** 5 messages per IP every 15 minutes. */
export const contactRateLimiter = createMemoryRateLimiter({
  limit: 5,
  windowMs: 15 * 60 * 1000,
});

export function getClientIp(headers: Headers) {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return headers.get("x-real-ip") ?? "unknown";
}
