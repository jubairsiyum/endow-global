import { NextResponse } from 'next/server'
import { alias } from 'drizzle-orm/mysql-core'
import { and as _and, asc as _asc, eq as _eq, gte as _gte, lte as _lte, or as _or } from 'drizzle-orm'
import { db, schema } from '@endow/db'
import { externalBookingSchema, createBooking } from '@/lib/booking'
import { isExternalApiAuthorized } from '@/lib/external-api'

const and = _and as any
const asc = _asc as any
const eq = _eq as any
const gte = _gte as any
const lte = _lte as any
const or = _or as any

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: { 'WWW-Authenticate': 'Bearer' } })
}

function integerParam(value: string | null, fallback: number) {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback
}

function parsePagination(url: URL) {
  return {
    limit: Math.min(Math.max(integerParam(url.searchParams.get('limit'), 50), 1), 100),
    offset: integerParam(url.searchParams.get('offset'), 0),
  }
}

export async function GET(request: Request) {
  if (!isExternalApiAuthorized(request)) return unauthorized()

  const url = new URL(request.url)
  const { limit, offset } = parsePagination(url)
  const studentId = url.searchParams.get('studentId')?.trim()
  const status = url.searchParams.get('status')
  const fromValue = url.searchParams.get('from')
  const toValue = url.searchParams.get('to')
  const from = fromValue ? new Date(fromValue) : null
  const to = toValue ? new Date(toValue) : null
  if ((fromValue && (!from || Number.isNaN(from.getTime()))) || (toValue && (!to || Number.isNaN(to.getTime())))) {
    return NextResponse.json({ error: 'from and to must be valid ISO dates' }, { status: 400 })
  }

  const studentUser = alias(schema.users as any, 'external_student_user') as any
  const counselorUser = alias(schema.users as any, 'external_meeting_counselor_user') as any
  const conditions: any[] = []
  if (studentId) conditions.push(or(eq(schema.bookingSessions.studentId, studentId), eq(studentUser.id, studentId)))
  if (status) {
    if (!['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'].includes(status)) {
      return NextResponse.json({ error: 'Invalid meeting status' }, { status: 400 })
    }
    conditions.push(eq(schema.bookingSessions.status, status))
  }
  if (from) conditions.push(gte(schema.bookingSessions.scheduledAt, from))
  if (to) conditions.push(lte(schema.bookingSessions.scheduledAt, to))

  const rows = await db
    .select({
      id: schema.bookingSessions.id,
      externalBookingId: schema.bookingSessions.calBookingId,
      studentId: schema.bookingSessions.studentId,
      studentName: studentUser.name,
      studentEmail: studentUser.email,
      counselorId: schema.bookingSessions.counselorId,
      counselorName: counselorUser.name,
      counselorEmail: counselorUser.email,
      scheduledAt: schema.bookingSessions.scheduledAt,
      duration: schema.bookingSessions.duration,
      status: schema.bookingSessions.status,
      meetingUrl: schema.bookingSessions.meetingUrl,
      notes: schema.bookingSessions.notes,
      createdAt: schema.bookingSessions.createdAt,
      updatedAt: schema.bookingSessions.updatedAt,
    })
    .from(schema.bookingSessions)
    .leftJoin(schema.studentProfiles, eq(schema.studentProfiles.id, schema.bookingSessions.studentId))
    .leftJoin(studentUser, eq(studentUser.id, schema.studentProfiles.userId))
    .leftJoin(schema.counselorProfiles, eq(schema.counselorProfiles.id, schema.bookingSessions.counselorId))
    .leftJoin(counselorUser, eq(counselorUser.id, schema.counselorProfiles.userId))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(asc(schema.bookingSessions.scheduledAt))
    .limit(limit)
    .offset(offset)

  return NextResponse.json({ data: rows, pagination: { limit, offset, returned: rows.length } })
}

export async function POST(request: Request) {
  if (!isExternalApiAuthorized(request)) return unauthorized()

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON' }, { status: 400 })
  }

  const parsed = externalBookingSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid booking request', details: parsed.error.flatten() }, { status: 400 })
  }

  const input = parsed.data
  const studentConditions = input.studentId
    ? [or(eq(schema.users.id, input.studentId), eq(schema.studentProfiles.id, input.studentId))]
    : [eq(schema.users.email, input.studentEmail!.toLowerCase())]
  const studentRows = await db
    .select({
      userId: schema.users.id,
      profileId: schema.studentProfiles.id,
      name: schema.users.name,
      email: schema.users.email,
      phone: schema.studentProfiles.phone,
      assignedCounselorId: schema.studentProfiles.assignedCounselorId,
    })
    .from(schema.users)
    .innerJoin(schema.studentProfiles, eq(schema.studentProfiles.userId, schema.users.id))
    .where(and(eq(schema.users.role, 'STUDENT'), ...studentConditions))
    .limit(1)
  const student = studentRows[0]
  if (!student) return NextResponse.json({ error: 'Student not found' }, { status: 404 })

  try {
    const result = await createBooking({ db, student: { ...student, name: student.name || 'Student' }, ...input })
    return NextResponse.json(
      {
        data: {
          id: result.booking.id,
          externalBookingId: result.booking.calBookingId,
          studentId: result.booking.studentId,
          counselorId: result.booking.counselorId,
          scheduledAt: result.booking.scheduledAt,
          duration: result.booking.duration,
          status: result.booking.status,
          meetingUrl: result.booking.meetingUrl,
          notes: result.booking.notes,
          emailNotification: result.emailNotification,
        },
        alreadyExists: result.alreadyExists,
      },
      { status: result.alreadyExists ? 200 : 201 }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to create meeting'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
