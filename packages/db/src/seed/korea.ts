import { db, schema } from '../..'

export async function seedSouthKoreaCatalog() {
  console.log('🇰🇷 Seeding South Korea Universities and Courses...')

  // 1. Seed Currencies — all codes used by the admin form
  const currenciesToSeed: Array<{ code: string; symbol: string; usdRate: number }> = [
    { code: 'KRW', symbol: '₩', usdRate: 0.00075 },
    { code: 'USD', symbol: '$', usdRate: 1.0 },
    { code: 'GBP', symbol: '£', usdRate: 1.27 },
    { code: 'EUR', symbol: '€', usdRate: 1.08 },
    { code: 'JPY', symbol: '¥', usdRate: 0.0067 },
  ]
  for (const cur of currenciesToSeed) {
    const existing = await db.query.currencies.findFirst({ where: (c, { eq }) => eq(c.code, cur.code) })
    if (!existing) {
      await db.insert(schema.currencies).values(cur)
      console.log(`✅ Added Currency: ${cur.code}`)
    }
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

  // 6. Seed Scholarships
  const scholarshipSeeds = [
    {
      universitySlug: 'seoul-national-university',
      name: 'SNU Global Excellence Scholarship',
      description: 'Full tuition coverage for outstanding international students with strong academic records.',
      coverageType: 'full' as const,
      amount: null as number | null,
      currencyCode: 'USD',
      eligibility: 'GPA 3.5+, IELTS 6.5+ or TOPIK Level 4+',
      deadline: new Date('2026-06-30'),
      linkUrl: 'https://en.snu.ac.kr/admission/scholarship',
      isActive: true,
    },
    {
      universitySlug: 'kaist',
      name: 'KAIST Global Leadership Scholarship',
      description: 'Partial tuition support for talented international students in STEM fields.',
      coverageType: 'partial' as const,
      amount: 5000,
      currencyCode: 'USD',
      eligibility: 'GPA 3.2+, IELTS 6.0+',
      deadline: new Date('2026-05-15'),
      linkUrl: 'https://www.kaist.ac.kr/en/html/campus/04_03.html',
      isActive: true,
    },
    {
      universitySlug: 'yonsei-university',
      name: 'Yonsei Merit Scholarship',
      description: 'Tuition support for high-achieving international undergraduates.',
      coverageType: 'tuition_only' as const,
      amount: 3000,
      currencyCode: 'USD',
      eligibility: 'GPA 3.0+, IELTS 6.0+',
      deadline: new Date('2026-07-01'),
      linkUrl: 'https://www.yonsei.ac.kr/en_sc/admission/scholarship.jsp',
      isActive: true,
    },
  ]

  for (const s of scholarshipSeeds) {
    const targetUni = await db.query.catalogUniversities.findFirst({
      where: (u, { eq }) => eq(u.slug, s.universitySlug),
    })
    if (!targetUni) continue
    const existing = await db.query.scholarships.findFirst({
      where: (sh, { eq, and }) => and(eq(sh.universityId, targetUni.id), eq(sh.name, s.name)),
    })
    if (!existing) {
      await db.insert(schema.scholarships).values({
        universityId: targetUni.id,
        name: s.name,
        description: s.description,
        amount: s.amount,
        currencyCode: s.currencyCode,
        coverageType: s.coverageType,
        eligibility: s.eligibility,
        deadline: s.deadline,
        linkUrl: s.linkUrl,
        isActive: s.isActive,
      })
      console.log(`  🎓 Added Scholarship: ${s.name} (${targetUni.name})`)
    }
  }

  console.log('🇰🇷 South Korea seeding complete!')
}
