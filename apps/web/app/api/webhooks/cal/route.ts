import { NextResponse } from 'next/server'
import { db, schema } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { sendPushNotification } from '@/lib/firebase-admin'
import { generateMeetingUrl } from '@/lib/meeting'
import { notifySessionBooked } from '@/lib/notify'

export async function POST(req: Request) {
  const body = await req.json()
  const { triggerEvent, payload } = body

  if (triggerEvent === 'BOOKING_CREATED') {
    const { uid, startTime, organizer, attendees, meetingUrl } = payload
    const studentEmail = attendees[0]?.email

    const student = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.email, studentEmail),
      with: { studentProfile: true },
    })
    const counselor = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.email, organizer.email),
      with: { counselorProfile: true },
    })

    if (student?.studentProfile && counselor?.counselorProfile) {
      const sessionId = globalThis.crypto.randomUUID().replace(/-/g, '').slice(0, 25)
      const resolvedMeetingUrl = meetingUrl || generateMeetingUrl(sessionId)
      await db.insert(schema.bookingSessions).values({
        id: sessionId,
        studentId: student.studentProfile.id,
        counselorId: counselor.counselorProfile.id,
        calBookingId: uid,
        scheduledAt: new Date(startTime),
        meetingUrl: resolvedMeetingUrl,
        status: 'SCHEDULED',
      })

      // Best-effort: notify via SMTP with meeting link
      try {
        await notifySessionBooked(db, schema, {
          counselorId: counselor.counselorProfile.id,
          studentEmail: (student as any).email,
          studentName: (student as any).name || 'Student',
          scheduledAt: new Date(startTime),
          duration: 60,
          meetingUrl: resolvedMeetingUrl,
        })
      } catch (err) {
        console.error('[cal webhook] Failed to send session notification:', err)
      }

      if (student.fcmToken) {
        await sendPushNotification(
          student.fcmToken,
          'Session Booked!',
          `Your session is scheduled for ${new Date(startTime).toLocaleDateString()}`,
          { sessionId }
        )
      }
    }
  }

  if (triggerEvent === 'BOOKING_CANCELLED') {
    await db
      .update(schema.bookingSessions)
      .set({ status: 'CANCELLED' })
      .where(eq(schema.bookingSessions.calBookingId as any, payload.uid) as any)
  }

  return NextResponse.json({ received: true })
}
