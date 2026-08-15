import { db, schema } from '../..'

const universities = [
  {
    name: 'Yewon Arts University',
    slug: 'yewon-arts-university',
    city: 'Yangju',
    description:
      'Arts university with campuses in Yangju (Gyeonggi Province) and Imsil (Jeollabuk-do), offering Korean and English tracks in business, culture & arts management, and creative disciplines including animation, webtoon, visual/video design, game animation, and performing arts. Best for arts, design, animation, entertainment, and creative industries.',
    ranking: 8,
    established: null,
    featured: false,
  },
  {
    name: 'Chungbuk National University',
    slug: 'chungbuk-national-university',
    city: 'Cheongju',
    description:
      'National comprehensive university in Cheongju, Chungcheongbuk-do offering broad academic choices including business administration, international studies, engineering, computer/IT, natural sciences, agriculture & life sciences, and humanities & social sciences. 2026 Fall undergraduate application fee: KRW 72,000.',
    ranking: 6,
    established: null,
    featured: false,
  },
  {
    name: 'Silla University',
    slug: 'silla-university',
    city: 'Busan',
    description:
      'Busan-based university with a strong international profile in aviation (flight operation, maintenance engineering, aviation service management, air traffic & logistics), business administration, international relations, IT/engineering, and languages & global studies. Intakes in March and September, with strong international scholarships (up to 100% first-semester tuition based on TOPIK or English proficiency).',
    ranking: 2,
    established: null,
    featured: true,
  },
  {
    name: "Sungshin Women's University",
    slug: 'sungshin-womens-university',
    city: 'Seoul',
    description:
      "Seoul-based women's university established in 1936, particularly relevant for female international students interested in business administration, economics/social sciences, media & communication, beauty/cosmetics, fashion, arts & design, and computer/IT. Best for Seoul-based study in beauty, fashion, media, business, and IT.",
    ranking: 7,
    established: 1936,
    featured: false,
  },
  {
    name: 'Hansung University',
    slug: 'hansung-university',
    city: 'Seoul',
    description:
      'Seoul-based university established 5 October 1945, offering business administration, global business/international studies, design, IT/engineering, social sciences & humanities, and arts. International scholarships can reduce first-semester tuition by 30-100% depending on TOPIK level. Indicative tuition ~US$2,800 (humanities/social sciences) to ~US$3,600 (arts/engineering); housing ~US$200-240/month.',
    ranking: 3,
    established: 1945,
    featured: true,
  },
  {
    name: 'Busan University of Foreign Studies',
    slug: 'busan-university-of-foreign-studies',
    city: 'Busan',
    description:
      'Busan-based university established in 1981, strong in international business, global studies, foreign languages, international tourism, IT/digital business, and Korean studies. Indicative tuition ~US$2,600 (humanities) to ~US$3,530 (IT). Best for business, languages, global studies, and tourism.',
    ranking: 4,
    established: 1981,
    featured: false,
  },
  {
    name: 'Kyungsung University',
    slug: 'kyungsung-university',
    city: 'Busan',
    description:
      "Busan-based university established 30 May 1955, offering some of the most clearly defined English-medium bachelor's tracks among Korean universities: Global Business Administration, Global Hospitality Management, Global Korean Studies, Global Mechanical Design Engineering, and Global IT Engineering. English requirement: IELTS 5.5 / TOEFL iBT 71. Scholarships range 30-50%+ for qualifying scores.",
    ranking: 1,
    established: 1955,
    featured: true,
  },
  {
    name: 'Chungbuk Health & Science University',
    slug: 'chungbuk-health-science-university',
    city: 'Cheongju',
    description:
      'Cheongju-based, professionally focused university specializing in healthcare and applied fields: nursing, medical laboratory science, dental/oral health, radiology/medical imaging, and health administration. Best for healthcare, nursing, and medical-support professions.',
    ranking: 10,
    established: null,
    featured: false,
  },
  {
    name: 'Cheju Halla University',
    slug: 'cheju-halla-university',
    city: 'Jeju City',
    description:
      "University in Jeju City, Jeju Special Self-Governing Province, established in 1969, with a stronger fit for healthcare and tourism/hospitality: nursing, health sciences, and tourism & hospitality. Indicative tuition ~US$2,500/semester for listed health bachelor's categories. Intakes in March and September.",
    ranking: 9,
    established: 1969,
    featured: false,
  },
  {
    name: 'Konyang University',
    slug: 'konyang-university',
    city: 'Nonsan',
    description:
      'University with campuses in Nonsan and Daejeon, established in 1991, strong in business administration, IT/computer engineering, engineering, medical/health sciences, and tourism/medical tourism. Indicative tuition ~US$2,050 (liberal arts/social sciences) to ~US$2,600 (engineering/natural sciences); housing ~KRW 910,000/semester. Scholarships can reach 100% based on TOPIK/GPA.',
    ranking: 5,
    established: 1991,
    featured: false,
  },
]

async function main() {
  console.log('🌱 Seeding South Korean universities (International Bachelor\u2019s)...\n')

  let inserted = 0
  let skipped = 0

  for (const uni of universities) {
    const existing = await db.query.universities.findFirst({
      where: (u, { eq }) => eq(u.slug, uni.slug),
    })

    if (existing) {
      console.log(`⏭️  Skipped (slug exists): ${uni.name}`)
      skipped++
      continue
    }

    await db.insert(schema.universities).values({
      name: uni.name,
      slug: uni.slug,
      country: 'South Korea',
      city: uni.city,
      logo: null,
      coverImage: null,
      description: uni.description,
      ranking: uni.ranking,
      website: null,
      established: uni.established,
      totalStudents: null,
      internationalPercent: null,
      accreditation: null,
      rankings: [],
      featured: uni.featured,
      isActive: true,
    })

    console.log(`✅ Inserted: ${uni.name}`)
    inserted++
  }

  console.log(`\n🎉 Done. Inserted: ${inserted}, Skipped: ${skipped}`)
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
