import { NextRequest, NextResponse } from 'next/server'
import {
  getSessionFromCookie,
  hasSuperAdminRole,
  hasAdminRole,
  hasCounselorRole,
} from '@/lib/admin-auth'

function getSessionCookie(request: NextRequest) {
  return request.cookies.get('better-auth.session_token')?.value
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

const jwtSecret = process.env.BETTER_AUTH_SECRET
const jwtVerificationAvailable = typeof jwtSecret === 'string' && jwtSecret.length > 0

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const sessionCookie = getSessionCookie(req)

  let payload = null
  if (sessionCookie && jwtVerificationAvailable) {
    payload = await getSessionFromCookie(sessionCookie)
  }

  const isProtectedPath = isProtected(pathname)
  const isSaPath = pathname.startsWith('/sa')
  const isAdminPath = pathname.startsWith('/admin')
  const isCounselorPath = pathname.startsWith('/counselor')

  if (isProtectedPath) {
    if (!sessionCookie) {
      const url = new URL('/login', req.url)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }

    if (payload) {
      if (isSaPath && !hasSuperAdminRole(payload)) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }

      if (isAdminPath && !hasAdminRole(payload)) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }

      if (isCounselorPath && !hasCounselorRole(payload)) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }
  }

  if (pathname === '/login' || pathname === '/register') {
    if (sessionCookie) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  if (isCareerLogin(pathname) && payload) {
    const role = payload.user?.role
    if (role === 'SUPER_ADMIN' || role === 'ADMIN' || role === 'COUNSELOR') {
      const dashMap: Record<string, string> = {
        COUNSELOR: '/counselor',
        ADMIN: '/admin',
        SUPER_ADMIN: '/sa',
      }
      return NextResponse.redirect(new URL(dashMap[role] || '/dashboard', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|og|robots.txt|sitemap.xml).*)'],
}
