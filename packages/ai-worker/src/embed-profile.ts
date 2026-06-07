import '../../../env-loader.cjs'
import { db, schema } from '@endow/db'
import { eq } from 'drizzle-orm'
import OpenAI from 'openai'
import { Pinecone } from '@pinecone-database/pinecone'
import { lazyClient } from './utils/lazy-client'

const openai = lazyClient<OpenAI>(() => {
  const key = process.env.OPENAI_API_KEY
  if (!key) throw new Error('OPENAI_API_KEY is not set')
  return new OpenAI({ apiKey: key })
}, 'OpenAI')

const pinecone = lazyClient<Pinecone>(() => {
  const key = process.env.PINECONE_API_KEY
  if (!key) throw new Error('PINECONE_API_KEY is not set')
  return new Pinecone({ apiKey: key })
}, 'Pinecone')

export async function embedStudentProfile(studentId: string) {
  const profile = await db.query.studentProfiles.findFirst({
    where: (sp, { eq }) => eq(sp.id, studentId),
    with: { user: true },
  })

  if (!profile || profile.completionPercent < 50) {
    console.log('Profile incomplete, skipping embedding')
    return
  }

  const targetCountries = profile.targetCountries as string[]
  const targetSubjects = profile.targetSubjects as string[]

  const profileText =
    `Student profile. Education: ${profile.highestEducation}. ` +
    `Target countries: ${targetCountries.join(', ')}. ` +
    `Target subjects: ${targetSubjects.join(', ')}. ` +
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

  await db
    .update(schema.studentProfiles)
    .set({
      profileEmbedding: embedding,
      matchesUpdatedAt: new Date(),
    })
    .where(eq(schema.studentProfiles.id, studentId))

  const index = pinecone.index(process.env.PINECONE_INDEX_NAME || 'endow-courses')
  const queryResponse = await index.query({
    vector: embedding,
    topK: 20,
    includeMetadata: true,
  })

  await db.delete(schema.matchResults).where(eq(schema.matchResults.studentId, studentId))

  if (queryResponse.matches.length > 0) {
    await db.insert(schema.matchResults).values(
      queryResponse.matches.map((match) => ({
        studentId,
        courseId: match.id,
        score: match.score || 0,
        matchReasons: generateMatchReasons(
          {
            targetCountries: profile.targetCountries as string[],
            targetSubjects: profile.targetSubjects as string[],
            budgetMax: profile.budgetMax,
          },
          match.metadata as Record<string, unknown>
        ),
      }))
    )
  }

  console.log(`✅ Profile embedded and ${queryResponse.matches.length} matches saved`)
}

function generateMatchReasons(
  profile: { targetCountries: string[]; targetSubjects: string[]; budgetMax?: number | null },
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
