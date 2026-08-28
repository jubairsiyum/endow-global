export interface CountryMetadata {
  name: string
  code: string
  flag: string
  heroImage: string
  tagline: string
  description: string
  highlights: string[]
  quickStats: {
    label: string
    value: string
    icon: string
  }[]
  whyStudyHere: string[]
  visaInfo: {
    title: string
    description: string
    requirements: string[]
    processingTime: string
    workRights: string
  }
  costOfLiving: {
    category: string
    amount: string
    details: string
  }[]
  studentLife: string[]
  faqs: {
    question: string
    answer: string
  }[]
}

export const COUNTRY_METADATA: Record<string, CountryMetadata> = {
  'south-korea': {
    name: 'South Korea',
    code: 'KR',
    flag: 'https://flagcdn.com/w160/kr.png',
    heroImage:
      'https://images.unsplash.com/photo-1534274867514-d5b47ef89ed7?auto=format&fit=crop&w=1920&q=85',
    tagline: 'Innovation Meets Education',
    description:
      'South Korea offers world-class education with cutting-edge technology, rich cultural heritage, and affordable tuition. Home to globally ranked universities and a thriving economy, it is an ideal destination for international students seeking quality education in Asia.',
    highlights: [
      'Top-ranked universities in Asia',
      'Affordable tuition with generous scholarships',
      'Safe, tech-forward society',
      'Rich cultural heritage and K-culture',
      'Post-study work opportunities',
      'Low cost of living compared to Western countries',
    ],
    quickStats: [
      { label: 'Universities', value: '400+', icon: 'graduation' },
      { label: 'International Students', value: '200K+', icon: 'users' },
      { label: 'Avg Tuition/Year', value: '$4,500', icon: 'dollar' },
      { label: 'Visa Success Rate', value: '97%', icon: 'check' },
    ],
    whyStudyHere: [
      'South Korea ranks among the top 10 countries for higher education quality, with universities like Seoul National University, KAIST, and Yonsei University achieving global recognition.',
      'Tuition fees are significantly lower than Western counterparts, ranging from $3,000 to $8,000 per year, with numerous scholarships available for international students.',
      'The Korean government invests heavily in education, offering the prestigious GKS (Global Korea Scholarship) covering full tuition, living expenses, and airfare.',
      'South Korea is a global leader in technology, engineering, and innovation, providing students with access to cutting-edge research facilities and industry partnerships.',
      'The country offers a unique blend of traditional culture and modern lifestyle, from ancient temples to K-pop and Korean cuisine.',
    ],
    visaInfo: {
      title: 'D-2 Student Visa',
      description:
        'The D-2 visa is the standard student visa for international students enrolling in degree programs at Korean universities. It allows full-time study and part-time work under certain conditions.',
      requirements: [
        'Acceptance letter from a Korean university',
        'Proof of financial capability (minimum $10,000 USD)',
        'Valid passport with at least 6 months validity',
        'Academic transcripts and certificates',
        'TOPIK (Test of Proficiency in Korean) score if applicable',
        'Health insurance coverage',
        'Criminal background check',
      ],
      processingTime: '2-4 weeks',
      workRights: 'Up to 20 hours/week during semester, unlimited during breaks',
    },
    costOfLiving: [
      { category: 'Accommodation (University Dorm)', amount: '$300-$600/mo', details: 'On-campus housing is affordable and includes utilities' },
      { category: 'Off-Campus Rent', amount: '$400-$800/mo', details: 'Varies by city; Seoul is more expensive' },
      { category: 'Food', amount: '$200-$400/mo', details: 'Affordable campus meals and local restaurants' },
      { category: 'Transportation', amount: '$50-$100/mo', details: 'Efficient subway and bus systems with student discounts' },
      { category: 'Health Insurance', amount: '$50-$80/mo', details: 'Mandatory NHIP coverage for students' },
      { category: 'Books & Supplies', amount: '$50-$100/mo', details: 'Digital resources widely available' },
    ],
    studentLife: [
      'Vibrant campus life with over 500 university clubs and organizations',
      'World-famous Korean cuisine: bibimbap, Korean BBQ, kimchi',
      'Safe streets with 24/7 public transportation',
      'K-pop, K-drama, and Korean Wave culture immersion',
      'Four distinct seasons with beautiful cherry blossoms in spring',
      'Advanced public infrastructure: free campus Wi-Fi, smart classrooms',
    ],
    faqs: [
      {
        question: 'Do I need to speak Korean to study in South Korea?',
        answer: 'Many universities offer English-taught programs, especially at the graduate level. However, learning basic Korean (TOPIK level 2-3) enhances your daily life and career prospects.',
      },
      {
        question: 'Can I work while studying in South Korea?',
        answer: 'Yes, international students on a D-2 visa can work up to 20 hours per week during the semester and unlimited hours during official school breaks, with employer approval.',
      },
      {
        question: 'What scholarships are available for international students?',
        answer: 'The Korean government offers the GKS scholarship (full funding), and universities provide their own merit-based scholarships covering 30-100% of tuition. Many private organizations also offer grants.',
      },
      {
        question: 'Is South Korea safe for international students?',
        answer: 'South Korea is one of the safest countries in the world, with very low crime rates, excellent healthcare, and a welcoming environment for foreigners.',
      },
    ],
  },
  australia: {
    name: 'Australia',
    code: 'AU',
    flag: 'https://flagcdn.com/w160/au.png',
    heroImage:
      'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1920&q=85',
    tagline: 'World-Class Education Down Under',
    description:
      'Australia is a top destination for international students, offering globally recognized degrees, a multicultural society, and excellent quality of life. With 7 universities in the global top 100, Australia combines academic excellence with practical learning and post-study work opportunities.',
    highlights: [
      '7 universities in the global top 100',
      'Globally recognized qualifications',
      'Multicultural and welcoming society',
      'Post-study work visa (up to 4 years)',
      'High quality of life and safety',
      'Strong industry connections and research',
    ],
    quickStats: [
      { label: 'Universities', value: '43', icon: 'graduation' },
      { label: 'International Students', value: '800K+', icon: 'users' },
      { label: 'Avg Tuition/Year', value: '$20,000', icon: 'dollar' },
      { label: 'Visa Success Rate', value: '90%', icon: 'check' },
    ],
    whyStudyHere: [
      'Australia has 43 universities, with 7 ranked in the top 100 globally by QS World Rankings, including the University of Melbourne, University of Sydney, and ANU.',
      'Australian degrees are recognized worldwide, opening doors to career opportunities across the globe.',
      'The Australian government invests over $300 million annually in international scholarships through the Australia Awards program.',
      'Australia offers the Temporary Graduate Visa (subclass 485), allowing international students to stay and work for 2-4 years after graduation.',
      'The country is known for its laid-back lifestyle, beautiful beaches, diverse wildlife, and safe, friendly communities.',
    ],
    visaInfo: {
      title: 'Student Visa (Subclass 500)',
      description:
        'The Subclass 500 visa allows international students to stay in Australia for the duration of their registered course. It covers all study levels and includes work rights.',
      requirements: [
        'Confirmation of Enrolment (CoE) from an Australian institution',
        'Genuine Temporary Entrant (GTE) statement',
        'Proof of financial capacity (minimum AUD 21,041/year)',
        'Overseas Student Health Cover (OSHC)',
        'English proficiency test results (IELTS 5.5+)',
        'Valid passport',
        'Criminal history check',
      ],
      processingTime: '4-8 weeks',
      workRights: 'Up to 48 hours per fortnight during semester, unlimited during scheduled breaks',
    },
    costOfLiving: [
      { category: 'Accommodation', amount: 'AUD 800-$1,500/mo', details: 'On-campus, share houses, or private rentals' },
      { category: 'Food & Groceries', amount: 'AUD 400-$600/mo', details: 'Cooking at home is economical' },
      { category: 'Transportation', amount: 'AUD 100-$200/mo', details: 'Student transport passes available in major cities' },
      { category: 'Health Insurance (OSHC)', amount: 'AUD 50-$70/mo', details: 'Mandatory for visa holders' },
      { category: 'Books & Supplies', amount: 'AUD 50-$150/mo', details: 'University libraries and digital resources' },
      { category: 'Entertainment & Social', amount: 'AUD 200-$400/mo', details: 'Student discounts widely available' },
    ],
    studentLife: [
      'Beautiful beaches and outdoor lifestyle year-round',
      'Multicultural society with people from 200+ countries',
      'World-class sports facilities and events',
      'Thriving arts, music, and food scene',
      'Safe campuses with comprehensive student support',
      'Part-time work opportunities in most industries',
    ],
    faqs: [
      {
        question: 'What is the post-study work visa in Australia?',
        answer: 'The Temporary Graduate Visa (subclass 485) allows international students to stay in Australia for 2-4 years after completing their degree, depending on the qualification level and location of study.',
      },
      {
        question: 'How much does it cost to study in Australia?',
        answer: 'Tuition fees range from AUD 20,000 to AUD 45,000 per year depending on the institution and program. Living costs are approximately AUD 21,041 per year as required by the visa.',
      },
      {
        question: 'Can I work while studying in Australia?',
        answer: 'Yes, student visa holders can work up to 48 hours per fortnight during semester and unlimited hours during scheduled course breaks. Many students find part-time work in retail, hospitality, and tutoring.',
      },
      {
        question: 'Is Australia safe for international students?',
        answer: 'Australia is one of the safest countries in the world, consistently ranked in the top 10 for quality of life. Universities have dedicated international student support services.',
      },
    ],
  },
}

export function getCountryMetadata(slug: string): CountryMetadata | null {
  return COUNTRY_METADATA[slug] ?? null
}

export function isValidCountrySlug(slug: string): boolean {
  return slug in COUNTRY_METADATA
}
