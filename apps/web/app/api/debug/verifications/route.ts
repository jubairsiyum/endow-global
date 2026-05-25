import { NextResponse } from 'next/server'
import { db, schema } from '@endow/db'

export async function GET() {
  try {
    const rows = await db
      .select()
      .from(schema.verificationTokens)
      .limit(20)

    return NextResponse.json({ ok: true, rows })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
