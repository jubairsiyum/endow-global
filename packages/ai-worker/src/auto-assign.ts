import '../../../env-loader.cjs'
import { db, schema } from '@endow/db'
import { eq, asc } from 'drizzle-orm'
import { normalizeCountryList } from './utils/country'

export async function autoAssignCounselor(studentId: string): Promise<string | null> {
  const student = await db.query.studentProfiles.findFirst({
    where: (sp, { eq }) => eq(sp.id, studentId),
  })

  if (!student || student.assignedCounselorId) return null

  const counselors = await db.query.counselorProfiles.findMany({
    where: (cp, { eq }) => eq(cp.isAvailable, true),
    orderBy: (cp, { asc }) => asc(cp.totalStudents),
  })

  const targetCountries = normalizeCountryList(student.targetCountries)
  const targetSubjects = (student.targetSubjects as string[]) || []

  const scored = counselors.map((c) => {
    let score = 0
    const expertiseCountries = normalizeCountryList(c.expertiseCountries)
    const expertiseSubjects = c.expertiseSubjects as string[]
    const countryOverlap = targetCountries.filter((co) => expertiseCountries.includes(co)).length
    const subjectOverlap = targetSubjects.filter((s) =>
      expertiseSubjects.includes(s)
    ).length
    score += countryOverlap * 3
    score += subjectOverlap * 2
    score -= c.totalStudents * 0.1
    return { counselor: c, score }
  })

  scored.sort((a, b) => b.score - a.score)
  const best = scored[0]?.counselor

  if (!best) return null

  await db.update(schema.studentProfiles)
    .set({ assignedCounselorId: best.id })
    .where(eq(schema.studentProfiles.id, studentId))

  await db.update(schema.counselorProfiles)
    .set({ totalStudents: best.totalStudents + 1 })
    .where(eq(schema.counselorProfiles.id, best.id))

  console.log(`✅ Assigned counselor ${best.id} to student ${studentId}`)
  return best.id
}
