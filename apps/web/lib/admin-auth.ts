import { UserRole } from '@endow/types'

const ADMIN_ROLES: UserRole[] = [UserRole.ADMIN, UserRole.SUPER_ADMIN]

interface SessionTokenPayload {
  session: { id: string; userId: string; expiresAt: string; ipAddress?: string; userAgent?: string }
  user: { id: string; email: string; emailVerified: boolean; name: string; image?: string; role: UserRole; createdAt: string; updatedAt: string }
  exp: number
  iat: number
}

function base64UrlDecode(str: string): string {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const padding = '==='.slice(0, (4 - (base64.length % 4)) % 4)
  return atob(base64 + padding)
}

function base64UrlEncode(str: string): string {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function createHmac(key: string, data: string): Promise<ArrayBuffer> {
  const enc = new TextEncoder()
  const keyData = enc.encode(key)
  const dataBytes = enc.encode(data)
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  return crypto.subtle.sign('HMAC', cryptoKey, dataBytes)
}

async function verifyJwt(token: string): Promise<SessionTokenPayload | null> {
  try {
    const secret = process.env.BETTER_AUTH_SECRET
    if (!secret) return null

    const parts = token.split('.')
    if (parts.length !== 3) return null

    const [headerB64, payloadB64, sigB64] = parts
    const headerStr = base64UrlDecode(headerB64)
    const header = JSON.parse(headerStr)
    if (header.alg !== 'HS256') return null

    const signingInput = `${headerB64}.${payloadB64}`
    const expectedSig = await createHmac(secret, signingInput)
    const expectedSigBytes = new Uint8Array(expectedSig)
    const expectedSigChars: string[] = []
    const len = expectedSigBytes.length
    for (let i = 0; i < len; i++) {
      expectedSigChars.push(String.fromCharCode(expectedSigBytes[i]!))
    }
    const expectedSigB64 = base64UrlEncode(expectedSigChars.join(''))
    if (expectedSigB64 !== sigB64) return null

    const payload = JSON.parse(base64UrlDecode(payloadB64)) as SessionTokenPayload

    if (payload.exp && Date.now() / 1000 > payload.exp) return null

    return payload
  } catch {
    return null
  }
}

export async function getSessionFromCookie(cookie: string): Promise<SessionTokenPayload | null> {
  return verifyJwt(cookie)
}

export function hasSuperAdminRole(payload: SessionTokenPayload): boolean {
  return payload.user?.role === UserRole.SUPER_ADMIN
}

export function hasAdminRole(payload: SessionTokenPayload): boolean {
  return ADMIN_ROLES.includes(payload.user?.role as UserRole)
}

export function hasCounselorRole(payload: SessionTokenPayload): boolean {
  const role = payload.user?.role as UserRole
  return role === UserRole.COUNSELOR || ADMIN_ROLES.includes(role)
}

export function isRoleAllowed(payload: SessionTokenPayload, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(payload.user?.role as UserRole)
}

export type { SessionTokenPayload }
