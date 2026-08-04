import { db, schema } from '../..'
import { eq } from 'drizzle-orm'
import { hash } from 'bcryptjs'
import { seedSouthKoreaCatalog } from './korea'

const SA_EMAIL = 'superadmin@endowglobal.com'
const SA_PASSWORD = 'SuperAdmin@123'

const ADMIN_EMAIL = 'admin@endowglobal.com'
const ADMIN_PASSWORD = 'Admin@12345'

const COUNSELOR_EMAIL = 'counselor@endowglobal.com'
const COUNSELOR_PASSWORD = 'Counselor@123'

async function seedUserWithCredentials(
  email: string,
  name: string,
  password: string,
  role: 'SUPER_ADMIN' | 'ADMIN' | 'COUNSELOR'
) {

  const existing = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.email, email),
  })

  if (!existing) {
    const userId = globalThis.crypto.randomUUID()
    await db.insert(schema.users).values({
      id: userId,
      email,
      name,
      role,
      emailVerified: new Date(),
    })

    const accountId = globalThis.crypto.randomUUID()
    const hashedPassword = await hash(password, 12)
    await db.insert(schema.accounts).values({
      id: accountId,
      userId,
      providerId: 'credential',
      accountId: email,
      password: hashedPassword,
    })

    console.log(`✅ ${role} created: ${email} / ${password}`)
  } else {
    if (existing.role !== role) {
      await db.update(schema.users)
        .set({ role })
        .where(eq(schema.users.email, email))
      console.log(`🔄 Updated ${email} role to ${role}`)
    }

    const existingAccount = await db.query.accounts.findFirst({
      where: (a, { eq, and }) => and(eq(a.userId, existing.id), eq(a.providerId, 'credential')),
    })
    if (!existingAccount) {
      const accountId = globalThis.crypto.randomUUID()
      const hashedPassword = await hash(password, 12)
      await db.insert(schema.accounts).values({
        id: accountId,
        userId: existing.id,
        providerId: 'credential',
        accountId: email,
        password: hashedPassword,
      })
      console.log(`✅ ${role} password set: ${email} / ${password}`)
    } else {
      console.log(`ℹ️  ${role} already exists with credentials: ${email}`)
    }
  }
}

async function main() {
  console.log('🌱 Seeding database...\n')

  // ─── 1. Super Admin ──────────────────────────────────
  await seedUserWithCredentials(SA_EMAIL, 'Super Admin', SA_PASSWORD, 'SUPER_ADMIN')

  // ─── 2. Admin ────────────────────────────────────────
  await seedUserWithCredentials(ADMIN_EMAIL, 'Platform Admin', ADMIN_PASSWORD, 'ADMIN')

  // ─── 3. Counselor (with credentials) ─────────────────
  await seedUserWithCredentials(COUNSELOR_EMAIL, 'Sarah Thompson', COUNSELOR_PASSWORD, 'COUNSELOR')

  // ─── Counselor Profile ───────────────────────────────
  const counselorUser = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.email, COUNSELOR_EMAIL),
  })
  if (counselorUser) {
    const existingProfile = await db.query.counselorProfiles.findFirst({
      where: (cp: any, { eq }: any) => eq(cp.userId, counselorUser.id),
    })
    if (!existingProfile) {
      await db.insert(schema.counselorProfiles).values({
        userId: counselorUser.id,
        bio: 'Senior education counselor with 8 years of experience helping students achieve their UK and Australia study goals.',
        expertiseCountries: JSON.stringify(['United Kingdom', 'Australia', 'Canada']),
        expertiseSubjects: JSON.stringify(['Computer Science', 'Business', 'Engineering']),
        languages: JSON.stringify(['English', 'Bengali']),
        sessionRate: 2500,
        isAvailable: true,
      })
      console.log('✅ Counselor profile created')
    }
  }

  // ─── Catalog Data ────────────────────────────────────
  try {
    await seedSouthKoreaCatalog()
  } catch (err: any) {
    console.log('⚠️  Skipping catalog seed:', err.message?.slice(0, 80))
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
            requirements: JSON.stringify([
              'Bachelors in CS or related',
              'IELTS 6.5+',
              'References x2',
            ]),
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
            requirements: JSON.stringify([
              'Bachelors degree',
              '3 years work experience',
              'GMAT 600+',
              'IELTS 7.0+',
            ]),
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
