import { Redis } from '@upstash/redis'
import { lazyClient } from './lazy-client'

export const redis = lazyClient<Redis>(
  () => {
    const url = process.env.UPSTASH_REDIS_REST_URL
    const token = process.env.UPSTASH_REDIS_REST_TOKEN
    if (!url || !token) {
      throw new Error('UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN are not set')
    }
    return new Redis({ url, token })
  },
  'Upstash Redis',
)

export async function rateLimit(identifier: string, limit = 10, window = 60): Promise<boolean> {
  const key = `rate_limit:${identifier}`
  const current = await redis.incr(key)
  if (current === 1) await redis.expire(key, window)
  return current <= limit
}

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
