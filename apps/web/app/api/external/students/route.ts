import { NextResponse } from 'next/server'
import { alias } from 'drizzle-orm/mysql-core'
import { and as _and, eq as _eq, gte as _gte, or as _or } from 'drizzle-orm'
import { db, schema } from '@endow/db'
import { isExternalApiAuthorized } from '@/lib/external-api'

const and = _and as any
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

export async function GET(request: Request) {
  if (!isExternalApiAuthorized(request)) return unauthorized()

  const url = new URL(request.url)
  const limit = Math.min(Math.max(integerParam(url.searchParams.get('limit'), 50), 1), 100)
  const offset = integerParam(url.searchParams.get('offset'), 0)
  const email = url.searchParams.get('email')?.trim().toLowerCase()
  const updatedSinceValue = url.searchParams.get('updatedSince')
  const updatedSince = updatedSinceValue ? new Date(updatedSinceValue) : null
  if (updatedSinceValue && (!updatedSince || Number.isNaN(updatedSince.getTime()))) {
    return NextResponse.json({ error: 'updatedSince must be a valid ISO date' }, { status: 400 })
  }

  const counselorUser = alias(schema.users as any, 'external_counselor_user') as any
  const conditions = [eq(schema.users.role, 'STUDENT')]
  if (email) conditions.push(eq(schema.users.email, email))
  if (updatedSince) conditions.push(or(gte(schema.users.updatedAt, updatedSince), gte(schema.studentProfiles.updatedAt, updatedSince)))

  const rows = await db
    .select({
      id: schema.users.id,
      name: schema.users.name,
      email: schema.users.email,
      image: schema.users.image,
      createdAt: schema.users.createdAt,
      updatedAt: schema.users.updatedAt,
      profileId: schema.studentProfiles.id,
      phone: schema.studentProfiles.phone,
      nationality: schema.studentProfiles.nationality,
      countryOfResidence: schema.studentProfiles.countryOfResidence,
      targetCountries: schema.studentProfiles.targetCountries,
      targetSubjects: schema.studentProfiles.targetSubjects,
      highestEducation: schema.studentProfiles.highestEducation,
      completionPercent: schema.studentProfiles.completionPercent,
      assignedCounselorId: schema.studentProfiles.assignedCounselorId,
      counselorName: counselorUser.name,
      counselorEmail: counselorUser.email,
    })
    .from(schema.users)
    .leftJoin(schema.studentProfiles, eq(schema.studentProfiles.userId, schema.users.id))
    .leftJoin(schema.counselorProfiles, eq(schema.counselorProfiles.id, schema.studentProfiles.assignedCounselorId))
    .leftJoin(counselorUser, eq(counselorUser.id, schema.counselorProfiles.userId))
    .where(and(...conditions))
    .orderBy(schema.users.createdAt)
    .limit(limit)
    .offset(offset)

  return NextResponse.json({ data: rows, pagination: { limit, offset, returned: rows.length } })
}
