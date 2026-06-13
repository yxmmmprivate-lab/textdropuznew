// Simple in-memory rate limiter (use Redis in production for multi-instance)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

interface RateLimitConfig {
  windowMs: number
  maxRequests: number
}

const CONFIGS: Record<string, RateLimitConfig> = {
  create: { windowMs: 60_000, maxRequests: 10 },   // 10 creates per minute
  retrieve: { windowMs: 60_000, maxRequests: 60 }, // 60 retrieves per minute
}

export function rateLimit(ip: string, action: 'create' | 'retrieve'): {
  allowed: boolean
  remaining: number
  resetAt: number
} {
  const config = CONFIGS[action]
  const key = `${action}:${ip}`
  const now = Date.now()

  const current = rateLimitMap.get(key)

  if (!current || current.resetAt < now) {
    // Fresh window
    const entry = { count: 1, resetAt: now + config.windowMs }
    rateLimitMap.set(key, entry)
    return { allowed: true, remaining: config.maxRequests - 1, resetAt: entry.resetAt }
  }

  if (current.count >= config.maxRequests) {
    return { allowed: false, remaining: 0, resetAt: current.resetAt }
  }

  current.count++
  return {
    allowed: true,
    remaining: config.maxRequests - current.count,
    resetAt: current.resetAt,
  }
}

// Cleanup old entries periodically
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, value] of rateLimitMap.entries()) {
      if (value.resetAt < now) rateLimitMap.delete(key)
    }
  }, 5 * 60_000)
}
