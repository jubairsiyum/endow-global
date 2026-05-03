import { prisma } from '@endow/db'

export async function autoAssignCounselor(studentId: string): Promise<string | null> {
  const student = await prisma.studentProfile.findUnique({
    where: { id: studentId },
  })

  if (!student || student.assignedCounselorId) return null

  // Find best-matching available counselor
  const counselors = await prisma.counselorProfile.findMany({
    where: { isAvailable: true },
    orderBy: { totalStudents: 'asc' },
  })

  const scored = counselors.map((c) => {
    let score = 0
    const countryOverlap = student.targetCountries.filter((co) =>
      c.expertiseCountries.includes(co)
    ).length
    const subjectOverlap = student.targetSubjects.filter((s) =>
      c.expertiseSubjects.includes(s)
    ).length
    score += countryOverlap * 3
    score += subjectOverlap * 2
    score -= c.totalStudents * 0.1
    return { counselor: c, score }
  })

  scored.sort((a, b) => b.score - a.score)
  const best = scored[0]?.counselor

  if (!best) return null

  await prisma.studentProfile.update({
    where: { id: studentId },
    data: { assignedCounselorId: best.id },
  })

  await prisma.counselorProfile.update({
    where: { id: best.id },
    data: { totalStudents: { increment: 1 } },
  })

  console.log(`✅ Assigned counselor ${best.id} to student ${studentId}`)
  return best.id
}
