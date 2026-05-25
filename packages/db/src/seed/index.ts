import { db, schema } from '../..'
import { eq } from 'drizzle-orm'
import { hash } from 'bcryptjs'

async function main() {
  console.log('🌱 Seeding database...')

  const existingAdmin = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.email, 'admin@endowglobal.com'),
  })
  if (!existingAdmin) {
    await db.insert(schema.users).values({
      email: 'admin@endowglobal.com',
      name: 'Endow Admin',
      role: 'ADMIN',
      emailVerified: new Date(),
    })
    console.log('✅ Admin user created')
  }

  const existingCounselor = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.email, 'sarah@endowglobal.com'),
  })
  if (!existingCounselor) {
    await db.insert(schema.users).values({
      email: 'sarah@endowglobal.com',
      name: 'Sarah Thompson',
      role: 'COUNSELOR',
      emailVerified: new Date(),
    })
    const counselorUser = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.email, 'sarah@endowglobal.com'),
    })
    if (counselorUser) {
      await db.insert(schema.counselorProfiles).values({
        userId: counselorUser.id,
        bio: 'Senior education counselor with 8 years of experience helping students achieve their UK and Australia study goals.',
        expertiseCountries: JSON.stringify(['United Kingdom', 'Australia', 'Canada']),
        expertiseSubjects: JSON.stringify(['Computer Science', 'Business', 'Engineering']),
        languages: JSON.stringify(['English', 'Bengali']),
        sessionRate: 2500,
        isAvailable: true,
      })
    }
    console.log('✅ Counselor user created')
  }

  const universities = [
    {
      name: 'University of Manchester',
      slug: 'university-of-manchester',
      country: 'United Kingdom',
      city: 'Manchester',
      description: 'A world-leading research university in the heart of Manchester.',
      ranking: 32,
      website: 'https://www.manchester.ac.uk',
      established: 1824,
      totalStudents: 40000,
      internationalPercent: 30,
    },
    {
      name: 'University of Melbourne',
      slug: 'university-of-melbourne',
      country: 'Australia',
      city: 'Melbourne',
      description: "Australia's leading university, known for research excellence.",
      ranking: 33,
      website: 'https://www.unimelb.edu.au',
      established: 1853,
      totalStudents: 50000,
      internationalPercent: 38,
    },
    {
      name: 'University of Toronto',
      slug: 'university-of-toronto',
      country: 'Canada',
      city: 'Toronto',
      description: "Canada's top-ranked university with a global reputation.",
      ranking: 21,
      website: 'https://www.utoronto.ca',
      established: 1827,
      totalStudents: 97000,
      internationalPercent: 20,
    },
  ]

  for (const uni of universities) {
    const existing = await db.query.universities.findFirst({
      where: (u, { eq }) => eq(u.slug, uni.slug),
    })
    if (!existing) {
      await db.insert(schema.universities).values({
        ...uni,
        isActive: true,
      })
      const created = await db.query.universities.findFirst({
        where: (u, { eq }) => eq(u.slug, uni.slug),
      })
      if (created) {
        const csSlug = `${uni.slug}-msc-cs`
        const existingCs = await db.query.courses.findFirst({
          where: (c, { eq }) => eq(c.slug, csSlug),
        })
        if (!existingCs) {
          await db.insert(schema.courses).values({
            universityId: created.id,
            name: 'MSc Computer Science',
            slug: csSlug,
            subject: 'Computer Science',
            level: 'POSTGRADUATE',
            duration: 1,
            durationUnit: 'YEARS',
            tuitionFee: 28000,
            currency: 'GBP',
            applicationDeadline: new Date('2025-06-30'),
            startDate: new Date('2025-09-15'),
            language: 'English',
            requirements: JSON.stringify(['Bachelors in CS or related', 'IELTS 6.5+', 'References x2']),
            hasScholarship: true,
            scholarshipDetails: 'Merit-based scholarship up to 30% tuition reduction',
            description: `Study Computer Science at ${uni.name} with world-class faculty and cutting-edge research facilities.`,
            isActive: true,
          })
        }
        const mbaSlug = `${uni.slug}-mba`
        const existingMba = await db.query.courses.findFirst({
          where: (c, { eq }) => eq(c.slug, mbaSlug),
        })
        if (!existingMba) {
          await db.insert(schema.courses).values({
            universityId: created.id,
            name: 'MBA Business Administration',
            slug: mbaSlug,
            subject: 'Business',
            level: 'POSTGRADUATE',
            duration: 2,
            durationUnit: 'YEARS',
            tuitionFee: 35000,
            currency: 'GBP',
            applicationDeadline: new Date('2025-05-31'),
            startDate: new Date('2025-09-15'),
            language: 'English',
            requirements: JSON.stringify(['Bachelors degree', '3 years work experience', 'GMAT 600+', 'IELTS 7.0+']),
            hasScholarship: false,
            description: `Transform your career with an MBA from ${uni.name}.`,
            isActive: true,
          })
        }
      }
      console.log('✅ University seeded:', uni.name)
    }
  }

  console.log('🎉 Seeding complete!')
}

main().catch(console.error)
