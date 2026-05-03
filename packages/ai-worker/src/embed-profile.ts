import { prisma } from '@endow/db'
import OpenAI from 'openai'
import { Pinecone } from '@pinecone-database/pinecone'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! })

export async function embedStudentProfile(studentId: string) {
  const profile = await prisma.studentProfile.findUnique({
    where: { id: studentId },
    include: { user: true },
  })

  if (!profile || profile.completionPercent < 50) {
    console.log('Profile incomplete, skipping embedding')
    return
  }

  const profileText =
    `Student profile. Education: ${profile.highestEducation}. ` +
    `Target countries: ${profile.targetCountries.join(', ')}. ` +
    `Target subjects: ${profile.targetSubjects.join(', ')}. ` +
    `Budget: ${profile.budgetMin || 0} - ${profile.budgetMax || 50000} USD. ` +
    `GPA: ${profile.gpa || 'not provided'}. ` +
    `IELTS: ${profile.ieltsScore || 'not provided'}. ` +
    `Work experience: ${profile.workExperienceYears} years. ` +
    `Preferred intake: ${profile.preferredIntakeMonth || 'any'} ${profile.preferredIntakeYear || ''}.`

  const embeddingResponse = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: profileText,
  })

  const embedding = embeddingResponse.data[0].embedding

  await prisma.studentProfile.update({
    where: { id: studentId },
    data: {
      profileEmbedding: embedding,
      matchesUpdatedAt: new Date(),
    },
  })

  // Query Pinecone for top matches
  const index = pinecone.index(process.env.PINECONE_INDEX_NAME || 'endow-courses')
  const queryResponse = await index.query({
    vector: embedding,
    topK: 20,
    includeMetadata: true,
  })

  // Save match results to DB
  await prisma.matchResult.deleteMany({ where: { studentId } })
  await prisma.matchResult.createMany({
    data: queryResponse.matches.map((match) => ({
      studentId,
      courseId: match.id,
      score: match.score || 0,
      matchReasons: generateMatchReasons(profile, match.metadata as Record<string, unknown>),
    })),
    skipDuplicates: true,
  })

  console.log(`✅ Profile embedded and ${queryResponse.matches.length} matches saved`)
}

function generateMatchReasons(
  profile: { targetCountries: string[]; targetSubjects: string[]; budgetMax?: number | null; hasScholarship?: boolean },
  metadata: Record<string, unknown>
): string[] {
  const reasons: string[] = []
  if (profile.targetCountries.includes(metadata.country as string)) {
    reasons.push(`Matches your target country: ${metadata.country}`)
  }
  if (profile.targetSubjects.includes(metadata.subject as string)) {
    reasons.push(`Matches your field of interest: ${metadata.subject}`)
  }
  if (profile.budgetMax && (metadata.tuitionFee as number) <= profile.budgetMax) {
    reasons.push('Within your budget range')
  }
  if (metadata.hasScholarship) {
    reasons.push('Scholarship available')
  }
  return reasons
}
