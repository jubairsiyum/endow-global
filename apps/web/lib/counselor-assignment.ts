import { eq as eqFn, sql as sqlFn, inArray as inArrayFn } from 'drizzle-orm'

// Drizzle helpers are cast to `any` because the `@endow/db` schema types come
// from a different drizzle-orm instance than the one in this workspace (the
// same convention used across the app's routers).
const eq = eqFn as any
const sql = sqlFn as any
const inArray = inArrayFn as any

function normalize(value: unknown): string {
  return String(value ?? '').trim().toLocaleLowerCase().replace(/[\s\W_]+/g, '')
}

function parseArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String)
  if (typeof value !== 'string' || !value.trim()) return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.map(String) : [String(parsed)]
  } catch {
    return [value]
  }
}

export type StudentAssignmentPreferences = {
  targetCountries?: unknown
  targetSubjects?: unknown
}

/** Select the available skilled counselor with the best match, then balance ties by load. */
export async function autoAssignCounselor(
  db: any,
  schema: any,
  preferences: StudentAssignmentPreferences = {}
): Promise<string | null> {
  const counselors = await db
    .select({
      id: schema.counselorProfiles.id,
      expertiseCountries: schema.counselorProfiles.expertiseCountries,
      expertiseSubjects: schema.counselorProfiles.expertiseSubjects,
    })
    .from(schema.counselorProfiles)
    .where(eq(schema.counselorProfiles.isAvailable, true))

  if (counselors.length === 0) return null

  const ids = counselors.map((c: any) => c.id)

  // Current assigned-student load per counselor (authoritative count rather
  // than the denormalised `totalStudents` counter, which can drift).
  const counts = await db
    .select({
      counselorId: schema.studentProfiles.assignedCounselorId,
      n: sql<number>`count(*)` as any,
    })
    .from(schema.studentProfiles)
    .where(inArray(schema.studentProfiles.assignedCounselorId, ids))
    .groupBy(schema.studentProfiles.assignedCounselorId)

  const load = new Map<string, number>(counts.map((r: any) => [r.counselorId, Number(r.n)]))

  const countries = new Set(parseArray(preferences.targetCountries).map(normalize).filter(Boolean))
  const subjects = new Set(parseArray(preferences.targetSubjects).map(normalize).filter(Boolean))

  const ranked = counselors.map((c: any, index: number) => {
    const counselorCountries = new Set(parseArray(c.expertiseCountries).map(normalize).filter(Boolean))
    const counselorSubjects = new Set(parseArray(c.expertiseSubjects).map(normalize).filter(Boolean))
    const countryMatches = Array.from(countries).filter((value) => counselorCountries.has(value)).length
    const subjectMatches = Array.from(subjects).filter((value) => counselorSubjects.has(value)).length
    // Subject expertise is slightly more specific than destination expertise.
    const skillScore = subjectMatches * 100 + countryMatches * 80
    return { counselor: c, load: load.get(c.id) ?? 0, skillScore, index }
  })

  ranked.sort((a: any, b: any) =>
    b.skillScore - a.skillScore || a.load - b.load || a.index - b.index
  )

  // If preferences are present but no counselor matches them, still assign a
  // counselor rather than leaving the student without support.
  return ranked[0]?.counselor.id ?? null
}

export async function notifyStudentCounselorAssigned(
  db: any,
  schema: any,
  opts: { studentUserId: string; counselorName: string }
) {
  const { createInAppNotification } = await import('./in-app-notifications')
  await createInAppNotification(db, schema, {
    userId: opts.studentUserId,
    type: 'SYSTEM',
    title: 'Counselor assigned',
    body: `${opts.counselorName || 'A counselor'} is now assigned to guide your study plans.`,
    data: { counselorName: opts.counselorName },
  })
}
