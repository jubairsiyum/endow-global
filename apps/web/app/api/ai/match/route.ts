import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { embedStudentProfile } from '@endow/ai-worker/src/embed-profile'

export async function POST() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const profile = await prisma.studentProfile.findUnique({ where: { userId: session.user.id } })
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  // Rate limit: once per 24h
  if (profile.matchesUpdatedAt) {
    const hoursSince = (Date.now() - profile.matchesUpdatedAt.getTime()) / 3600000
    if (hoursSince < 24) {
      return NextResponse.json({ cached: true, message: 'Matches are up to date' })
    }
  }

  await embedStudentProfile(profile.id)
  return NextResponse.json({ success: true })
}
