import { NextRequest, NextResponse } from 'next/server'

function getSessionCookie(request: NextRequest) {
  return (
    request.cookies.get('better-auth.session_token')?.value ??
    request.cookies.get('__Secure-better-auth.session_token')?.value
  )
}

const PROTECTED_STUDENT_PATHS = [
  '/dashboard',
  '/explore',
  '/match',
  '/shortlist',
  '/applications',
  '/sessions',
  '/messages',
  '/profile',
  '/refer',
  '/notifications',
  '/tutorial',
]
const PROTECTED_COUNSELOR_PATHS = ['/counselor']
const PROTECTED_ADMIN_PATHS = ['/admin']

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
  }

  // Redirect authenticated users away from auth pages
  if ((pathname === '/login' || pathname === '/register') && sessionCookie) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|og|robots.txt|sitemap.xml).*)'],
}
