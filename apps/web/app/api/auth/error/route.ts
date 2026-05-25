import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const error = url.searchParams.get('error')
  const callbackUrl = url.searchParams.get('callbackUrl')

  const redirectTo = new URL('/sign-in', url.origin)
  if (error) redirectTo.searchParams.set('error', error)
  if (callbackUrl) redirectTo.searchParams.set('callbackUrl', callbackUrl)

  return NextResponse.redirect(redirectTo)
}

export async function POST(req: Request) {
  // Forward POSTs too in case BetterAuth posts errors here
  return GET(req)
}
