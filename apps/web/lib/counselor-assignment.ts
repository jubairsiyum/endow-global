import { eq as eqFn, sql as sqlFn, inArray as inArrayFn } from 'drizzle-orm'

// Drizzle helpers are cast to `any` because the `@endow/db` schema types come
// from a different drizzle-orm instance than the one in this workspace (the
// same convention used across the app's routers).
const eq = eqFn as any
const sql = sqlFn as any
const inArray = inArrayFn as any

/**
 * Pick the counselor with the fewest currently-assigned students, so demand is
 * distributed equally across the available counselor pool. Returns the chosen
 * counselor's id, or `null` when no counselor is available.
 */
export async function autoAssignCounselor(db: any, schema: any): Promise<string | null> {
  const counselors = await db
    .select({ id: schema.counselorProfiles.id })
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

  let best = counselors[0]
  let bestLoad = load.get(best.id) ?? 0
  for (const c of counselors.slice(1)) {
    const current = load.get(c.id) ?? 0
    if (current < bestLoad) {
      best = c
      bestLoad = current
    }
  }

  return best.id
}
