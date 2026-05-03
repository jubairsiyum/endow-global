import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendPushNotification } from '@/lib/firebase-admin'
import { sendEmail } from '@/lib/resend'
import SessionReminder from '@/emails/SessionReminder'

export async function POST(req: Request) {
  const body = await req.json()
  const { triggerEvent, payload } = body

  if (triggerEvent === 'BOOKING_CREATED') {
    const { uid, startTime, organizer, attendees, meetingUrl } = payload
    const studentEmail = attendees[0]?.email

    const student = await prisma.user.findUnique({ where: { email: studentEmail }, include: { studentProfile: true } })
    const counselor = await prisma.user.findUnique({ where: { email: organizer.email }, include: { counselorProfile: true } })

    if (student?.studentProfile && counselor?.counselorProfile) {
      const session = await prisma.bookingSession.create({
        data: {
          studentId: student.studentProfile.id,
          counselorId: counselor.counselorProfile.id,
          calBookingId: uid,
          scheduledAt: new Date(startTime),
          meetingUrl,
          status: 'SCHEDULED',
        },
      })

      // FCM notification
      if (student.fcmToken) {
        await sendPushNotification(student.fcmToken, 'Session Booked!', `Your session is scheduled for ${new Date(startTime).toLocaleDateString()}`, { sessionId: session.id })
      }
    }
  }

  if (triggerEvent === 'BOOKING_CANCELLED') {
    await prisma.bookingSession.updateMany({
      where: { calBookingId: payload.uid },
      data: { status: 'CANCELLED' },
    })
  }

  return NextResponse.json({ received: true })
}
