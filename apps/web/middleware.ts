import { NextRequest, NextResponse } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'

const PROTECTED_STUDENT_PATHS = ['/dashboard', '/explore', '/match', '/shortlist', '/applications', '/sessions', '/messages', '/profile', '/refer', '/notifications', '/tutorial']
const PROTECTED_COUNSELOR_PATHS = ['/counselor']
//const PROTECTED_ADMIN_PATHS = ['/admin']
const PROTECTED_ADMIN_PATHS: string[] = []



export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const sessionCookie = getSessionCookie(req)

  const isStudentPath = PROTECTED_STUDENT_PATHS.some((p) => pathname.startsWith(p))
  const isCounselorPath = PROTECTED_COUNSELOR_PATHS.some((p) => pathname.startsWith(p))
  const isAdminPath = PROTECTED_ADMIN_PATHS.some((p) => pathname.startsWith(p))

  if (isStudentPath || isCounselorPath || isAdminPath) {
    if (!sessionCookie) {
      const url = new URL('/login', req.url)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }

    // Note: BetterAuth middleware uses optimistic cookie checks only.
    // Full role-based authorization is enforced in tRPC procedures
    // (protectedProcedure, counselorProcedure, adminProcedure) and
    // in server components via getSession(). This is the recommended
    // pattern from BetterAuth docs — middleware checks cookie presence,
    // server-side code validates the session fully.
  }

  // Redirect authenticated users away from auth pages
  if ((pathname === '/login' || pathname === '/register') && sessionCookie) {
    // Without a full session fetch we can't determine role in middleware.
    // Default redirect to /dashboard; role-based landing is handled client-side.
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|og|robots.txt|sitemap.xml).*)'],
}
