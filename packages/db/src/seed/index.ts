import { hash } from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { db, schema } from '../..'
import '../../../../env-loader.cjs'
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
      emailVerified: true,
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
      name: 'Busan University of Foreign Studies',
      slug: 'busan-university-of-foreign-studies',
      country: 'South Korea',
      city: 'Busan',
      description: 'Busan-based university strong in international business, global studies, foreign languages, international tourism, IT/digital business, and Korean studies.',
      ranking: '4',
      website: 'https://www.bufs.ac.kr',
      logo: '/universities/BUFS_logo.jpg',
      established: 1981,
      totalStudents: 8000,
      internationalStudents: 1100,
      isActive: true,
      featured: false,
    },
    {
      name: 'Kyungsung University',
      slug: 'kyungsung-university',
      country: 'South Korea',
      city: 'Busan',
      description: 'Busan-based university offering clearly defined English-medium bachelor\'s tracks including Global Business Administration, Hospitality Management, and IT Engineering.',
      ranking: '1',
      website: 'https://www.ks.ac.kr',
      logo: '/universities/Busan University.png',
      established: 1955,
      totalStudents: 14000,
      internationalStudents: 1300,
      isActive: true,
      featured: true,
    },
    {
      name: 'Kyung Hee University',
      slug: 'kyung-hee-university',
      country: 'South Korea',
      city: 'Seoul',
      description: 'A comprehensive university known for its beautiful campus, medical programs, global peace studies, and academic excellence.',
      ranking: '3',
      website: 'https://www.khu.ac.kr',
      logo: '/universities/Kyung Hee University.png',
      established: 1949,
      totalStudents: 32000,
      internationalStudents: 4200,
      isActive: true,
      featured: true,
    },
    {
      name: 'Sejong University',
      slug: 'sejong-university',
      country: 'South Korea',
      city: 'Seoul',
      description: 'Renowned for hospitality & tourism management, computer science, animation, and dancing/arts programs in Seoul.',
      ranking: '5',
      website: 'https://www.sejong.ac.kr',
      logo: '/universities/Sejong University.png',
      established: 1940,
      totalStudents: 15000,
      internationalStudents: 2000,
      isActive: true,
      featured: true,
    },
    {
      name: 'Chungwoon University',
      slug: 'chungwoon-university',
      country: 'South Korea',
      city: 'Hongseong',
      description: 'Specialized university focusing on media, broadcasting, enterprise management, and performing arts.',
      ranking: '6',
      website: 'https://www.chungwoon.ac.kr',
      logo: '/universities/Chungwoon University.png',
      established: 1995,
      totalStudents: 7000,
      internationalStudents: 500,
      isActive: true,
      featured: false,
    },
    {
      name: 'Daejin University',
      slug: 'daejin-university',
      country: 'South Korea',
      city: 'Pocheon',
      description: 'Comprehensive university offering robust engineering, business, and humanities programs near Gyeonggi.',
      ranking: '7',
      website: 'https://www.daejin.ac.kr',
      logo: '/universities/Daejin University.png',
      established: 1992,
      totalStudents: 10000,
      internationalStudents: 800,
      isActive: true,
      featured: false,
    },
    {
      name: 'Dong-Eui University',
      slug: 'dong-eui-university',
      country: 'South Korea',
      city: 'Busan',
      description: 'Major private university in Busan excelling in health sciences, engineering, and digital content.',
      ranking: '8',
      website: 'https://www.deu.ac.kr',
      logo: '/universities/Dong-Eui University.png',
      established: 1977,
      totalStudents: 20000,
      internationalStudents: 1000,
      isActive: true,
      featured: false,
    },
    {
      name: 'Hanseo University',
      slug: 'hanseo-university',
      country: 'South Korea',
      city: 'Seosan',
      description: 'Distinguished university specialized in aviation, flight operations, design, and arts education.',
      ranking: '9',
      website: 'https://www.hanseo.ac.kr',
      logo: '/universities/Hanseo University.png',
      established: 1992,
      totalStudents: 6000,
      internationalStudents: 400,
      isActive: true,
      featured: false,
    },
    {
      name: 'Sahmyook University',
      slug: 'sahmyook-university',
      country: 'South Korea',
      city: 'Seoul',
      description: 'Private university in Seoul known for health, nursing, pharmacy, and liberal arts programs.',
      ranking: '10',
      website: 'https://www.syu.ac.kr',
      logo: '/universities/Sahmyook University.png',
      established: 1906,
      totalStudents: 6500,
      internationalStudents: 600,
      isActive: true,
      featured: false,
    },
    {
      name: 'Sun Moon University',
      slug: 'sun-moon-university',
      country: 'South Korea',
      city: 'Asan',
      description: 'Global-focused university in Asan/Daejeon area with high percentage of international scholarship recipients.',
      ranking: '11',
      website: 'https://www.sunmoon.ac.kr',
      logo: '/universities/Sun Moon University.png',
      established: 1989,
      totalStudents: 9000,
      internationalStudents: 1500,
      isActive: true,
      featured: false,
    },
    {
      name: 'Yeungjin University',
      slug: 'yeungjin-university',
      country: 'South Korea',
      city: 'Daegu',
      description: 'Top-ranked vocational and technical university in Daegu with elite employment-focused engineering and IT programs.',
      ranking: '12',
      website: 'https://www.yju.ac.kr',
      logo: '/universities/Yeungjin University.png',
      established: 1977,
      totalStudents: 8000,
      internationalStudents: 700,
      isActive: true,
      featured: false,
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
            name: 'Global Bachelor / Master in Computer Science',
            slug: csSlug,
            subject: 'Computer Science',
            level: 'POSTGRADUATE',
            duration: 2,
            durationUnit: 'YEARS',
            tuitionFee: 8000,
            currency: 'USD',
            applicationDeadline: new Date('2026-06-30'),
            startDate: new Date('2026-09-01'),
            language: 'English / Korean',
            requirements: JSON.stringify([
              'High School / Bachelors degree',
              'TOPIK Level 3+ or IELTS 5.5+',
              'Statement of Purpose',
            ]),
            hasScholarship: true,
            scholarshipDetails: 'International merit scholarship up to 50-100% tuition waiver',
            description: `Study cutting-edge Computer Science and IT at ${uni.name} with advanced global tracks.`,
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
            name: 'Global MBA & Business Administration',
            slug: mbaSlug,
            subject: 'Business',
            level: 'POSTGRADUATE',
            duration: 2,
            durationUnit: 'YEARS',
            tuitionFee: 9500,
            currency: 'USD',
            applicationDeadline: new Date('2026-05-31'),
            startDate: new Date('2026-09-01'),
            language: 'English / Korean',
            requirements: JSON.stringify([
              'Bachelors degree',
              'TOPIK Level 3+ or English Proficiency Certificate',
              'Recommendation Letter',
            ]),
            hasScholarship: true,
            scholarshipDetails: 'Global excellence scholarship available for top applicants',
            description: `Advance your international career with the Global MBA program at ${uni.name}.`,
            isActive: true,
          })
        }
      }
      console.log('✅ University and courses seeded:', uni.name)
    }
  }



  console.log('🎉 Seeding complete!')
}

main().catch(console.error)
