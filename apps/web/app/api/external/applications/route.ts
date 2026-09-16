import { NextResponse } from 'next/server'
import { alias } from 'drizzle-orm/mysql-core'
import { and as _and, asc as _asc, eq as _eq, gte as _gte, or as _or } from 'drizzle-orm'
import { db, schema } from '@/lib/db'
import { isExternalApiAuthorized } from '@/lib/external-api'

const and = _and as any
const asc = _asc as any
const eq = _eq as any
const gte = _gte as any
const or = _or as any

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: { 'WWW-Authenticate': 'Bearer' } })
}

function integerParam(value: string | null, fallback: number) {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback
}

function parseDate(value: string | null) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date
}

export async function GET(request: Request) {
  if (!isExternalApiAuthorized(request)) return unauthorized()

  const url = new URL(request.url)
  const limit = Math.min(Math.max(integerParam(url.searchParams.get('limit'), 50), 1), 100)
  const offset = integerParam(url.searchParams.get('offset'), 0)
  const counselorEmail = url.searchParams.get('counselorEmail')?.trim().toLowerCase()
  const studentId = url.searchParams.get('studentId')?.trim()
  const updatedSinceValue = url.searchParams.get('updatedSince')
  const updatedSince = parseDate(updatedSinceValue)

  if (updatedSinceValue && updatedSince === undefined) {
    return NextResponse.json({ error: 'updatedSince must be a valid ISO date' }, { status: 400 })
  }

  const studentUser = alias(schema.users as any, 'external_application_student_user') as any
  const counselorUser = alias(schema.users as any, 'external_application_counselor_user') as any
  const conditions: any[] = []

  if (counselorEmail) conditions.push(eq(counselorUser.email, counselorEmail))
  if (studentId) conditions.push(or(eq(schema.applications.studentId, studentId), eq(studentUser.id, studentId)))
  if (updatedSince) conditions.push(gte(schema.applications.updatedAt, updatedSince))

  const rows = await db
    .select({
      id: schema.applications.id,
      studentId: schema.applications.studentId,
      studentName: studentUser.name,
      studentEmail: studentUser.email,
      studentPhone: schema.studentProfiles.phone,
      studentNationality: schema.studentProfiles.nationality,
      counselorId: schema.applications.counselorId,
      counselorName: counselorUser.name,
      counselorEmail: counselorUser.email,
      status: schema.applications.status,
      currentStep: schema.applications.currentStep,
      totalSteps: schema.applications.totalSteps,
      personalInfo: schema.applications.personalInfo,
      academicHistory: schema.applications.academicHistory,
      personalStatement: schema.applications.personalStatement,
      documentsUrls: schema.applications.documentsUrls,
      submittedAt: schema.applications.submittedAt,
      counselorNotes: schema.applications.counselorNotes,
      courseId: schema.applications.courseId,
      courseName: schema.courses.name,
      courseSlug: schema.courses.slug,
      universityName: schema.universities.name,
      universityCountry: schema.universities.country,
      createdAt: schema.applications.createdAt,
      updatedAt: schema.applications.updatedAt,
    })
    .from(schema.applications)
    .leftJoin(schema.studentProfiles, eq(schema.studentProfiles.id, schema.applications.studentId))
    .leftJoin(studentUser, eq(studentUser.id, schema.studentProfiles.userId))
    .leftJoin(schema.counselorProfiles, eq(schema.counselorProfiles.id, schema.applications.counselorId))
    .leftJoin(counselorUser, eq(counselorUser.id, schema.counselorProfiles.userId))
    .leftJoin(schema.courses, eq(schema.courses.id, schema.applications.courseId))
    .leftJoin(schema.universities, eq(schema.universities.id, schema.courses.universityId))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(asc(schema.applications.updatedAt), asc(schema.applications.id))
    .limit(limit)
    .offset(offset)

  return NextResponse.json({ data: rows, pagination: { limit, offset, returned: rows.length } })
}
