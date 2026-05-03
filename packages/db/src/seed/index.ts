import { PrismaClient, UserRole, CourseLevel, EducationLevel } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ── Admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@endowglobal.com' },
    update: {},
    create: {
      email: 'admin@endowglobal.com',
      name: 'Endow Admin',
      role: UserRole.ADMIN,
      emailVerified: new Date(),
    },
  })
  console.log('✅ Admin user created:', adminUser.email)

  // ── Counselor user
  const counselorUser = await prisma.user.upsert({
    where: { email: 'sarah@endowglobal.com' },
    update: {},
    create: {
      email: 'sarah@endowglobal.com',
      name: 'Sarah Thompson',
      role: UserRole.COUNSELOR,
      emailVerified: new Date(),
      counselorProfile: {
        create: {
          bio: 'Senior education counselor with 8 years of experience helping students achieve their UK and Australia study goals.',
          expertiseCountries: ['United Kingdom', 'Australia', 'Canada'],
          expertiseSubjects: ['Computer Science', 'Business', 'Engineering'],
          languages: ['English', 'Bengali'],
          sessionRate: 2500,
          isAvailable: true,
        },
      },
    },
  })
  console.log('✅ Counselor user created:', counselorUser.email)

  // ── Universities
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
    const created = await prisma.university.upsert({
      where: { slug: uni.slug },
      update: {},
      create: {
        ...uni,
        isActive: true,
        courses: {
          create: [
            {
              name: `MSc Computer Science`,
              slug: `${uni.slug}-msc-cs`,
              subject: 'Computer Science',
              level: CourseLevel.POSTGRADUATE,
              duration: 1,
              durationUnit: 'YEARS',
              tuitionFee: 28000,
              currency: 'GBP',
              applicationDeadline: new Date('2025-06-30'),
              startDate: new Date('2025-09-15'),
              language: 'English',
              requirements: ['Bachelors in CS or related', 'IELTS 6.5+', 'References x2'],
              hasScholarship: true,
              scholarshipDetails: 'Merit-based scholarship up to 30% tuition reduction',
              description: `Study Computer Science at ${uni.name} with world-class faculty and cutting-edge research facilities.`,
              isActive: true,
            },
            {
              name: `MBA Business Administration`,
              slug: `${uni.slug}-mba`,
              subject: 'Business',
              level: CourseLevel.POSTGRADUATE,
              duration: 2,
              durationUnit: 'YEARS',
              tuitionFee: 35000,
              currency: 'GBP',
              applicationDeadline: new Date('2025-05-31'),
              startDate: new Date('2025-09-15'),
              language: 'English',
              requirements: ['Bachelors degree', '3 years work experience', 'GMAT 600+', 'IELTS 7.0+'],
              hasScholarship: false,
              description: `Transform your career with an MBA from ${uni.name}.`,
              isActive: true,
            },
          ],
        },
      },
    })
    console.log('✅ University seeded:', created.name)
  }

  console.log('🎉 Seeding complete!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
