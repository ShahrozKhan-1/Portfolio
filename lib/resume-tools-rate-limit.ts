import "server-only"

type RateLimitEntry = {
  count: number
  resetAt: number
}

type RateLimitResult = {
  allowed: boolean
  retryAfterSeconds: number
}

const MAX_TRACKED_KEYS = 10_000
// In-memory limits are bounded but reset on cold starts and are not shared across serverless instances.
const attemptsByKey = new Map<string, RateLimitEntry>()

export function checkInMemoryRateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
  now = Date.now(),
): RateLimitResult {
  const existing = attemptsByKey.get(key)
  const current = existing && existing.resetAt > now
    ? existing
    : { count: 0, resetAt: now + windowMs, lastSeenAt: now }

  if (current.count >= limit) {
    attemptsByKey.set(key, current)
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    }
  }

  current.count += 1
  attemptsByKey.set(key, current)

  if (attemptsByKey.size > MAX_TRACKED_KEYS) {
    const oldestKey = attemptsByKey.keys().next().value
    if (oldestKey !== undefined && oldestKey !== key) attemptsByKey.delete(oldestKey)
  }

  return { allowed: true, retryAfterSeconds: 0 }
}

export function getRequestClientKey(request: Request) {
  const forwardedFor = request.headers.get("x-vercel-forwarded-for")
    || request.headers.get("x-forwarded-for")
  const clientIp = forwardedFor?.split(",")[0]?.trim()
  return clientIp || "unknown"
}
