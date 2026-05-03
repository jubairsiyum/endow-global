import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Rate limiter helper
export async function rateLimit(identifier: string, limit = 10, window = 60): Promise<boolean> {
  const key = `rate_limit:${identifier}`
  const current = await redis.incr(key)
  if (current === 1) await redis.expire(key, window)
  return current <= limit
}

// Cache helper
export async function getOrSet<T>(
  key: string,
  fn: () => Promise<T>,
  ttl = 3600
): Promise<T> {
  const cached = await redis.get<T>(key)
  if (cached) return cached
  const value = await fn()
  await redis.setex(key, ttl, value as string)
  return value
}
