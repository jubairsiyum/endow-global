import { NextRequest, NextResponse } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'

const PROTECTED_STUDENT_PATHS = ['/dashboard', '/explore', '/match', '/shortlist', '/applications', '/sessions', '/messages', '/profile', '/refer', '/notifications', '/tutorial']
const PROTECTED_COUNSELOR_PATHS = ['/counselor']
const PROTECTED_ADMIN_PATHS: string[] = []

const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
]

function corsHeaders(origin: string | null) {
  const hdrs: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
  }
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    hdrs['Access-Control-Allow-Origin'] = origin
  }
  return hdrs
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // ── CORS for auth API routes ──────────────────────────────────
  if (pathname.startsWith('/api/auth/')) {
    const origin = req.headers.get('origin')

    if (req.method === 'OPTIONS') {
      return new NextResponse(null, { status: 204, headers: corsHeaders(origin) })
    }

    const response = NextResponse.next()
    const hdrs = corsHeaders(origin)
    for (const [k, v] of Object.entries(hdrs)) response.headers.set(k, v)
    return response
  }

  // ── Auth guard for protected pages ────────────────────────────
  const sessionCookie = getSessionCookie(req)

  const isStudentPath = PROTECTED_STUDENT_PATHS.some((p) => pathname.startsWith(p))
  const isCounselorPath = PROTECTED_COUNSELOR_PATHS.some((p) => pathname.startsWith(p))
  const isAdminPath = PROTECTED_ADMIN_PATHS.some((p) => pathname.startsWith(p))

  if (isStudentPath || isCounselorPath || isAdminPath) {
    if (!sessionCookie) {
      const url = new URL('/sign-in', req.url)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }
  }

  if ((pathname === '/sign-in' || pathname === '/sign-up' || pathname === '/signup' || pathname === '/login' || pathname === '/register') && sessionCookie) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|og|robots.txt|sitemap.xml).*)',
  ],
}
