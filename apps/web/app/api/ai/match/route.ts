import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db, schema } from '@/lib/db'
import { embedStudentProfile } from '@endow/ai-worker/src/embed-profile'
import { eq } from 'drizzle-orm'

export async function POST() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const profile = await db.query.studentProfiles.findFirst({
    where: (sp, { eq }) => eq(sp.userId, session.user.id),
  })
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  if (profile.matchesUpdatedAt) {
    const hoursSince = (Date.now() - profile.matchesUpdatedAt.getTime()) / 3600000
    if (hoursSince < 24) {
      return NextResponse.json({ cached: true, message: 'Matches are up to date' })
    }
  }

  await embedStudentProfile(profile.id)
  return NextResponse.json({ success: true })
}
