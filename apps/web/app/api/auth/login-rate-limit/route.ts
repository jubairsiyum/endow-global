import { NextRequest, NextResponse } from 'next/server'

const RATE_LIMIT_PREFIX = 'admin_login_rl'
const WINDOW_MS = 60_000
const MAX_ATTEMPTS = 10
const BLOCK_WINDOW_MS = 900_000 // 15 minutes

function getClientIdentifier(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded
    ? forwarded.split(',')[0]!.trim()
    : req.headers.get('x-real-ip') || 'unknown'
  const email = req.nextUrl.searchParams.get('email')?.toLowerCase().trim()
  return email
    ? `${RATE_LIMIT_PREFIX}:${ip}:${email}`
    : `${RATE_LIMIT_PREFIX}:${ip}`
}

const encoder = new TextEncoder()

async function getRateLimitData(identifier: string): Promise<{
  count: number
  blockedUntil: number | null
}> {
  try {
    const url = process.env.UPSTASH_REDIS_REST_URL
    const token = process.env.UPSTASH_REDIS_REST_TOKEN
    if (!url || !token) {
      return { count: 0, blockedUntil: null }
    }

    const key = `rate_limit:${identifier}`
    const blockKey = `rate_limit_blocked:${identifier}`

    const responses = await Promise.all([
      fetch(`${url}/incr/${encodeURIComponent(key)}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),
      fetch(`${url}/get/${encodeURIComponent(blockKey)}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),
    ])

    const count = responses[0]?.result ?? 0
    const blockedUntilRaw = responses[1]?.result

    if (count === 1) {
      fetch(`${url}/expire/${encodeURIComponent(key)}/${Math.ceil(WINDOW_MS / 1000)}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    }

    if (count > MAX_ATTEMPTS) {
      const blockUntil = String(Date.now() + BLOCK_WINDOW_MS)
      fetch(
        `${url}/set/${encodeURIComponent(blockKey)}/${blockUntil}/ex/${Math.ceil(BLOCK_WINDOW_MS / 1000)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
    }

    return {
      count,
      blockedUntil: blockedUntilRaw ? Number(blockedUntilRaw) : null,
    }
  } catch {
    return { count: 0, blockedUntil: null }
  }
}

export async function GET(req: NextRequest) {
  const identifier = getClientIdentifier(req)

  try {
    const { count, blockedUntil } = await getRateLimitData(identifier)

    if (blockedUntil && Date.now() < blockedUntil) {
      return NextResponse.json(
        { allowed: false, retryAfter: Math.ceil((blockedUntil - Date.now()) / 1000) },
        {
          status: 429,
          headers: {
            'X-Retry-After': String(Math.ceil((blockedUntil - Date.now()) / 1000)),
          },
        }
      )
    }

    const allowed = count <= MAX_ATTEMPTS
    return NextResponse.json({
      allowed,
      remaining: Math.max(0, MAX_ATTEMPTS - count),
      resetIn: Math.ceil(WINDOW_MS / 1000),
    })
  } catch {
    return NextResponse.json({ allowed: true, degraded: true })
  }
}
