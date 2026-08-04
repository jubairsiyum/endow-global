import { NextRequest, NextResponse } from 'next/server'
import {
  getSessionFromCookie,
  hasSuperAdminRole,
  hasAdminRole,
  hasCounselorRole,
} from '@/lib/admin-auth'

function getSessionCookie(request: NextRequest) {
  return (
    request.cookies.get('better-auth.session_token')?.value ??
    request.cookies.get('__Secure-better-auth.session_token')?.value
  )
}

const PROTECTED_PATHS: { paths: string[]; message: string }[] = [
  {
    paths: ['/dashboard', '/onboarding', '/explore', '/match', '/shortlist', '/applications', '/sessions', '/messages', '/profile', '/refer', '/notifications', '/tutorial'],
    message: 'student',
  },
  { paths: ['/counselor'], message: 'counselor' },
  { paths: ['/admin'], message: 'admin' },
  { paths: ['/sa'], message: 'super-admin' },
]

function isProtected(pathname: string): boolean {
  return PROTECTED_PATHS.some((group) =>
    group.paths.some((p) => pathname.startsWith(p))
  )
}

function isCareerLogin(pathname: string): boolean {
  return (
    pathname.startsWith('/login/counselor') ||
    pathname.startsWith('/login/admin') ||
    pathname.startsWith('/login/sa')
  )
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const sessionCookie = getSessionCookie(req)

  let payload = null
  if (sessionCookie) {
    payload = await getSessionFromCookie(sessionCookie)
  }

  const isProtectedPath = isProtected(pathname)
  const isSaPath = pathname.startsWith('/sa')
  const isAdminPath = pathname.startsWith('/admin')
  const isCounselorPath = pathname.startsWith('/counselor')

  // --- Protected route enforcement ---
  if (isProtectedPath) {
    if (!payload) {
      const url = new URL('/login', req.url)
      url.searchParams.set('callbackUrl', pathname)
      const response = NextResponse.redirect(url)
      clearSessionCookies(response)
      return response
    }

    // Role-based access control at edge level
    if (isSaPath && !hasSuperAdminRole(payload)) {
      const url = new URL('/dashboard', req.url)
      url.searchParams.set('error', 'unauthorized')
      const response = NextResponse.redirect(url)
      return response
    }

    if (isAdminPath && !hasAdminRole(payload)) {
      const url = new URL('/dashboard', req.url)
      url.searchParams.set('error', 'unauthorized')
      const response = NextResponse.redirect(url)
      return response
    }

    if (isCounselorPath && !hasCounselorRole(payload)) {
      const url = new URL('/dashboard', req.url)
      url.searchParams.set('error', 'unauthorized')
      const response = NextResponse.redirect(url)
      return response
    }
  }

  // --- Auth page redirects ---
  if (pathname === '/login' || pathname === '/register') {
    if (payload) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  // Career portal login pages: redirect if session exists but role mismatches
  if (isCareerLogin(pathname) && payload) {
    const role = payload.user?.role
    if (role === 'SUPER_ADMIN' || role === 'ADMIN' || role === 'COUNSELOR') {
      const dashMap: Record<string, string> = {
        COUNSELOR: '/counselor',
        ADMIN: '/admin',
        SUPER_ADMIN: '/sa',
      }
      const target = dashMap[role] || '/dashboard'
      return NextResponse.redirect(new URL(target, req.url))
    }
  }

  return NextResponse.next()
}

function clearSessionCookies(response: NextResponse) {
  const cookieNames = [
    'better-auth.session_token',
    '__Secure-better-auth.session_token',
  ]
  for (const name of cookieNames) {
    response.cookies.delete(name)
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|og|robots.txt|sitemap.xml).*)'],
}
