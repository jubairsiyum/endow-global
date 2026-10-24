import { db } from './packages/db/src/index'
import { courses } from './packages/db/src/schema'
import { eq } from 'drizzle-orm'

async function main() {
  const allCourses = await db.select().from(courses).where(eq(courses.isActive, true))
  console.log('Total active courses:', allCourses.length)
  for (const c of allCourses) {
    const s = c.startDate ? new Date(c.startDate).toISOString().slice(0, 10) : 'null'
    const d = c.applicationDeadline ? new Date(c.applicationDeadline).toISOString().slice(0, 10) : 'null'
    console.log(`[${c.universityId}] ${c.name} | start: ${s} | dl: ${d}`)
  }
  process.exit(0)
}

main().catch(console.error)
