// Minimal scaffold for BetterAuth-compatible route (non-dynamic segment)
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Expected shape: { provider: 'google', idToken: '...' }
    // For now, return a scaffolded response. Integrate with `lib/betterauth.ts` to upsert users.
    return NextResponse.json({ ok: true, received: !!body }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
