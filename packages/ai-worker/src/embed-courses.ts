import { db, schema } from '@endow/db'
import { eq } from 'drizzle-orm'
import OpenAI from 'openai'
import { Pinecone } from '@pinecone-database/pinecone'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY })

async function embedCourses() {
  console.log('🤖 Starting course embedding job...')
  const index = pinecone.index(process.env.PINECONE_INDEX_NAME || 'endow-courses')

  const courses = await db.query.courses.findMany({
    where: (c, { eq }) => eq(c.isActive, true),
    with: { university: true },
  })

  console.log(`📚 Embedding ${courses.length} courses...`)

  const BATCH_SIZE = 20
  for (let i = 0; i < courses.length; i += BATCH_SIZE) {
    const batch = courses.slice(i, i + BATCH_SIZE)

    const texts = batch.map(
      (c) =>
        `Course: ${c.name}. Subject: ${c.subject}. Level: ${c.level}. ` +
        `University: ${c.university.name}. Country: ${c.university.country}. ` +
        `Duration: ${c.duration} ${c.durationUnit}. Tuition: ${c.tuitionFee} ${c.currency}. ` +
        `Requirements: ${(c.requirements as string[]).join(', ')}. ` +
        `Scholarship: ${c.hasScholarship ? 'Yes - ' + c.scholarshipDetails : 'No'}. ` +
        `Description: ${c.description}`
    )

    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: texts,
    })

    const vectors = batch.map((course, idx) => ({
      id: course.id,
      values: embeddingResponse.data[idx].embedding,
      metadata: {
        courseId: course.id,
        name: course.name,
        subject: course.subject,
        level: course.level,
        country: course.university.country,
        tuitionFee: course.tuitionFee,
        hasScholarship: course.hasScholarship,
        universityName: course.university.name,
        universitySlug: course.university.slug,
        slug: course.slug,
      },
    }))

    await index.upsert(vectors)

    await Promise.all(
      batch.map((course) =>
        db.update(schema.courses)
          .set({ vectorId: course.id })
          .where(eq(schema.courses.id, course.id))
      )
    )

    console.log(`✅ Batch ${Math.floor(i / BATCH_SIZE) + 1} embedded`)
  }

  console.log('🎉 Course embedding complete!')
}

embedCourses().catch(console.error)
