import { NextResponse } from 'next/server'
import { db, schema } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { sendPushNotification } from '@/lib/firebase-admin'
import { sendEmail } from '@/lib/resend'
import SessionReminder from '@/emails/SessionReminder'

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
      const sessionId = globalThis.crypto.randomUUID()
      await db.insert(schema.bookingSessions).values({
        id: sessionId,
        studentId: student.studentProfile.id,
        counselorId: counselor.counselorProfile.id,
        calBookingId: uid,
        scheduledAt: new Date(startTime),
        meetingUrl,
        status: 'SCHEDULED',
      })

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
      .where(eq(schema.bookingSessions.calBookingId, payload.uid))
  }

  return NextResponse.json({ received: true })
}
