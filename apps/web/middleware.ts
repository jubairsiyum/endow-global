import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const PROTECTED_STUDENT_PATHS = ['/dashboard', '/explore', '/match', '/shortlist', '/applications', '/sessions', '/messages', '/profile', '/refer', '/notifications', '/tutorial']
const PROTECTED_COUNSELOR_PATHS = ['/counselor']
const PROTECTED_ADMIN_PATHS = ['/admin']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  const isStudentPath = PROTECTED_STUDENT_PATHS.some((p) => pathname.startsWith(p))
  const isCounselorPath = PROTECTED_COUNSELOR_PATHS.some((p) => pathname.startsWith(p))
  const isAdminPath = PROTECTED_ADMIN_PATHS.some((p) => pathname.startsWith(p))

  if (isStudentPath || isCounselorPath || isAdminPath) {
    if (!token) {
      const url = new URL('/login', req.url)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }

    if (isCounselorPath && token.role !== 'COUNSELOR' && token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    if (isAdminPath && token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  if ((pathname === '/login' || pathname === '/register') && token) {
    const redirectTo = token.role === 'COUNSELOR' ? '/counselor/dashboard' : token.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'
    return NextResponse.redirect(new URL(redirectTo, req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|og|robots.txt|sitemap.xml).*)'],
}
