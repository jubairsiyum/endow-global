import { db, schema } from '../..'

export async function seedSouthKoreaCatalog() {
  console.log('🇰🇷 Seeding South Korea Universities and Courses...')

  // 1. Seed Currencies
  const krw = await db.query.currencies.findFirst({ where: (c, { eq }) => eq(c.code, 'KRW') })
  if (!krw) {
    await db.insert(schema.currencies).values({
      code: 'KRW',
      symbol: '₩',
      usdRate: 0.00075,
    })
    console.log('✅ Added Currency: KRW')
  }

  const usd = await db.query.currencies.findFirst({ where: (c, { eq }) => eq(c.code, 'USD') })
  if (!usd) {
    await db.insert(schema.currencies).values({
      code: 'USD',
      symbol: '$',
      usdRate: 1.0,
    })
    console.log('✅ Added Currency: USD')
  }

  // 2. Seed Countries
  const southKorea = await db.query.countries.findFirst({ where: (c, { eq }) => eq(c.code, 'KR') })
  if (!southKorea) {
    await db.insert(schema.countries).values({
      code: 'KR',
      name: 'South Korea',
      flagUrl: 'https://flagcdn.com/w320/kr.png',
      continent: 'Asia',
    })
    console.log('✅ Added Country: South Korea')
  }

  // 3. Seed Universities
  const universities = [
    {
      name: 'Seoul National University',
      slug: 'seoul-national-university',
      countryCode: 'KR',
      city: 'Seoul',
      description: 'The most prestigious national research university in South Korea.',
      establishedYear: 1946,
      type: 'public' as const,
      rankingQs: 41,
      tuitionMin: 3000,
      tuitionMax: 7000,
      currencyCode: 'USD',
      websiteUrl: 'https://en.snu.ac.kr',
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'KAIST (Korea Advanced Institute of Science and Technology)',
      slug: 'kaist',
      countryCode: 'KR',
      city: 'Daejeon',
      description: 'A leading national research university focused on science and engineering.',
      establishedYear: 1971,
      type: 'technical' as const,
      rankingQs: 56,
      tuitionMin: 2500,
      tuitionMax: 6000,
      currencyCode: 'USD',
      websiteUrl: 'https://www.kaist.ac.kr/en/',
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'Yonsei University',
      slug: 'yonsei-university',
      countryCode: 'KR',
      city: 'Seoul',
      description: 'A private research university known for its medical and business programs.',
      establishedYear: 1885,
      type: 'private' as const,
      rankingQs: 76,
      tuitionMin: 4000,
      tuitionMax: 8500,
      currencyCode: 'USD',
      websiteUrl: 'https://www.yonsei.ac.kr/en_sc/',
      isActive: true,
      isFeatured: false,
    },
  ]

  for (const uni of universities) {
    let createdUni = await db.query.catalogUniversities.findFirst({
      where: (u, { eq }) => eq(u.slug, uni.slug),
    })

    if (!createdUni) {
      await db.insert(schema.catalogUniversities).values(uni)
      createdUni = await db.query.catalogUniversities.findFirst({
        where: (u, { eq }) => eq(u.slug, uni.slug),
      })
      console.log(`✅ Added University: ${uni.name}`)
    }

    if (createdUni) {
      // 4. Seed Departments
      const depts = [
        { name: 'Computer Science and Engineering', code: 'CSE' },
        { name: 'Business Administration', code: 'BA' },
      ]

      for (const dept of depts) {
        let createdDept = await db.query.departments.findFirst({
          where: (d, { and, eq }) => and(eq(d.universityId, createdUni!.id), eq(d.name, dept.name)),
        })

        if (!createdDept) {
          await db.insert(schema.departments).values({
            universityId: createdUni.id,
            name: dept.name,
            code: dept.code,
          })
          createdDept = await db.query.departments.findFirst({
            where: (d, { and, eq }) =>
              and(eq(d.universityId, createdUni!.id), eq(d.name, dept.name)),
          })
        }

        // 5. Seed Courses
        if (createdDept) {
          const courses =
            dept.code === 'CSE'
              ? [
                  {
                    title: 'BSc in Computer Science',
                    slug: `${uni.slug}-bsc-cs`,
                    level: 'bachelor' as const,
                    mode: 'on_campus' as const,
                    durationMonths: 48,
                    intakeMonths: ['March', 'September'],
                    tuitionFee: 4500,
                    currencyCode: 'USD',
                    description: `Undergraduate program in Computer Science at ${uni.name}.`,
                    minGpa: 3.0,
                    ieltsMin: 6.0,
                    toeflMin: 80,
                    isActive: true,
                  },
                  {
                    title: 'MSc in Artificial Intelligence',
                    slug: `${uni.slug}-msc-ai`,
                    level: 'master' as const,
                    mode: 'on_campus' as const,
                    durationMonths: 24,
                    intakeMonths: ['March'],
                    tuitionFee: 6000,
                    currencyCode: 'USD',
                    description: `Advanced research program in Artificial Intelligence at ${uni.name}.`,
                    minGpa: 3.5,
                    ieltsMin: 6.5,
                    toeflMin: 90,
                    isActive: true,
                  },
                ]
              : [
                  {
                    title: 'Global MBA',
                    slug: `${uni.slug}-global-mba`,
                    level: 'master' as const,
                    mode: 'on_campus' as const,
                    durationMonths: 18,
                    intakeMonths: ['September'],
                    tuitionFee: 15000,
                    currencyCode: 'USD',
                    description: `Global MBA program tailored for international students at ${uni.name}.`,
                    minGpa: 3.0,
                    workExpYears: 2,
                    ieltsMin: 6.5,
                    toeflMin: 85,
                    isActive: true,
                  },
                ]

          for (const course of courses) {
            const existingCourse = await db.query.catalogCourses.findFirst({
              where: (c, { eq }) => eq(c.slug, course.slug),
            })

            if (!existingCourse) {
              await db.insert(schema.catalogCourses).values({
                ...course,
                universityId: createdUni.id,
                departmentId: createdDept.id,
              })
              console.log(`  🎓 Added Course: ${course.title}`)
            }
          }
        }
      }
    }
  }

  console.log('🇰🇷 South Korea seeding complete!')
}
