import { schema } from '@endow/db'
import { and as _and, eq as _eq, or as _or } from 'drizzle-orm'
import { z } from 'zod'
import { autoAssignCounselor } from './counselor-assignment'
import { createInAppNotification } from './in-app-notifications'
import { generateMeetingUrl } from './meeting'
import { notifyCounselorNewStudent, notifySessionBooked } from './notify'

const eq = _eq as any
const and = _and as any
const or = _or as any

const MIN_SESSION_DURATION = 15
const MAX_SESSION_DURATION = 120
const MIN_LEAD_MINUTES = 30

export const externalBookingSchema = z.object({
  studentId: z.string().min(1).optional(),
  studentEmail: z.string().email().optional(),
  counselorId: z.string().min(1).optional(),
  scheduledAt: z.string().min(1),
  duration: z.number().int().min(MIN_SESSION_DURATION).max(MAX_SESSION_DURATION).default(60),
  notes: z.string().max(1000).optional(),
  externalBookingId: z.string().max(255).optional(),
}).refine((input) => Boolean(input.studentId || input.studentEmail), {
  message: 'studentId or studentEmail is required',
  path: ['studentId'],
})

type BookingStudent = {
  userId: string
  profileId: string
  name: string
  email: string
  phone?: string | null
  assignedCounselorId?: string | null
}

function normalizeScheduledAt(value: string): Date {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) throw new Error('Invalid date and time')
  return date
}

function assertDateCanBeBooked(date: Date) {
  if (date.getTime() <= Date.now()) throw new Error('Please choose a time in the future')
  if (date.getTime() < Date.now() + MIN_LEAD_MINUTES * 60 * 1000) {
    throw new Error(`Bookings must be made at least ${MIN_LEAD_MINUTES} minutes in advance`)
  }
}

async function assertNoConflict(db: any, counselorId: string, studentId: string, scheduledAt: Date, duration: number) {
  const requestedStart = scheduledAt.getTime()
  const requestedEnd = requestedStart + duration * 60 * 1000
  const candidates = await db
    .select({
      studentId: schema.bookingSessions.studentId,
      counselorId: schema.bookingSessions.counselorId,
      scheduledAt: schema.bookingSessions.scheduledAt,
      duration: schema.bookingSessions.duration,
    })
    .from(schema.bookingSessions)
    .where(
      and(
        eq(schema.bookingSessions.status, 'SCHEDULED'),
        or(eq(schema.bookingSessions.studentId, studentId), eq(schema.bookingSessions.counselorId, counselorId))
      )
    )

  const conflict = candidates.find((candidate: any) => {
    const existingStart = new Date(candidate.scheduledAt).getTime()
    const existingEnd = existingStart + (candidate.duration ?? 60) * 60 * 1000
    return existingStart < requestedEnd - 60 * 1000 && existingEnd > requestedStart + 60 * 1000
  })

  if (conflict) {
    if (conflict.studentId === studentId) throw new Error('You already have an overlapping session at this time')
    throw new Error('This counselor already has a session at that time')
  }
}

async function getCounselor(db: any, counselorId: string) {
  const [counselor] = await db
    .select({ id: schema.counselorProfiles.id, name: schema.users.name, isAvailable: schema.counselorProfiles.isAvailable })
    .from(schema.counselorProfiles)
    .leftJoin(schema.users, eq(schema.users.id, schema.counselorProfiles.userId))
    .where(eq(schema.counselorProfiles.id, counselorId))
    .limit(1)
  if (!counselor) throw new Error('Counselor not found')
  if (!counselor.isAvailable) throw new Error('This counselor is not currently available')
  return counselor
}

export async function createBooking({
  db,
  student,
  counselorId,
  scheduledAt: scheduledAtInput,
  duration,
  notes,
  externalBookingId,
}: {
  db: any
  student: BookingStudent
  counselorId?: string
  scheduledAt: string
  duration: number
  notes?: string
  externalBookingId?: string
}) {
  if (externalBookingId) {
    const [existing] = await db
      .select()
      .from(schema.bookingSessions)
      .where(eq(schema.bookingSessions.calBookingId, externalBookingId))
      .limit(1)
    if (existing) {
      if (existing.studentId !== student.profileId) throw new Error('externalBookingId is already used for another student')
      return { booking: existing, alreadyExists: true, emailNotification: { counselorSent: false, studentSent: false } }
    }
  }

  let assignedCounselorId = student.assignedCounselorId ?? null
  if (!assignedCounselorId) {
    assignedCounselorId = await autoAssignCounselor(db, schema)
    if (!assignedCounselorId) throw new Error('No counselor is currently available')
    await db
      .update(schema.studentProfiles)
      .set({ assignedCounselorId })
      .where(eq(schema.studentProfiles.id, student.profileId))

    try {
      await notifyCounselorNewStudent(db, schema, {
        counselorId: assignedCounselorId,
        studentName: student.name,
        studentEmail: student.email,
        studentPhone: student.phone ?? undefined,
      })
    } catch (error) {
      console.error('[assignment] Failed to notify newly assigned counselor:', error)
    }
  }

  const selectedCounselorId = counselorId ?? assignedCounselorId
  if (selectedCounselorId !== assignedCounselorId) {
    throw new Error('You can only book an appointment with the assigned counselor')
  }

  const scheduledAt = normalizeScheduledAt(scheduledAtInput)
  assertDateCanBeBooked(scheduledAt)
  await getCounselor(db, selectedCounselorId)
  await assertNoConflict(db, selectedCounselorId, student.profileId, scheduledAt, duration)

  const bookingId = globalThis.crypto.randomUUID().replace(/-/g, '').slice(0, 25)
  const meetingUrl = generateMeetingUrl(bookingId)
  await db.insert(schema.bookingSessions).values({
    id: bookingId,
    studentId: student.profileId,
    counselorId: selectedCounselorId,
    calBookingId: externalBookingId ?? null,
    scheduledAt,
    duration,
    notes: notes ?? null,
    status: 'SCHEDULED',
    meetingUrl,
  })

  try {
    const counselorUser = await db
      .select({ userId: schema.counselorProfiles.userId })
      .from(schema.counselorProfiles)
      .where(eq(schema.counselorProfiles.id, selectedCounselorId))
      .limit(1)
    await Promise.all([
      createInAppNotification(db, schema, {
        userId: student.userId,
        type: 'SYSTEM',
        title: 'Session booked',
        body: `Your counseling session is scheduled for ${scheduledAt.toLocaleString()}.`,
        data: { bookingId },
      }),
      counselorUser[0]?.userId
        ? createInAppNotification(db, schema, {
            userId: counselorUser[0].userId,
            type: 'SYSTEM',
            title: 'New session booked',
            body: `${student.name || 'A student'} booked a counseling session.`,
            data: { bookingId },
          })
        : Promise.resolve(),
    ])
  } catch (error) {
    console.error('[notification] Failed to create booking notifications:', error)
  }

  let emailNotification = { counselorSent: false, studentSent: false }
  try {
    emailNotification = await notifySessionBooked(db, schema, {
      counselorId: selectedCounselorId,
      studentEmail: student.email,
      studentName: student.name,
      scheduledAt,
      duration,
      meetingUrl,
    })
  } catch (error) {
    console.error('[booking] Failed to send session notification emails:', error)
  }

  const [booking] = await db.select().from(schema.bookingSessions).where(eq(schema.bookingSessions.id, bookingId)).limit(1)
  return { booking, alreadyExists: false, emailNotification }
}
