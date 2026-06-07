export interface University {
  id: string
  name: string
  country: string
  city: string
  logo: string
  banner: string
  ranking: number
  tuition: {
    min: number
    max: number
    currency: string
  }
  scholarship: number
  visaSuccessRate: number
  employmentRate: number
  intakeDeadline: string
  daysToIntake: number
  programs: string[]
  ieltsRequirement: number
  gpaRequirement: number
  dormitoryFee: number
  livingCost: number
  description: string
  highlights: string[]
  acceptanceRate: number
}

export const universities: University[] = [
  {
    id: 'hanseo',
    name: 'Hanseo University',
    country: 'South Korea',
    city: 'Seosan',
    logo: '/universities/Hanseo University.png',
    banner: '/universities/Hanseo University.png',
    ranking: 45,
    tuition: { min: 3500, max: 6500, currency: 'USD' },
    scholarship: 75,
    visaSuccessRate: 98,
    employmentRate: 94,
    intakeDeadline: '2026-06-15',
    daysToIntake: 22,
    programs: [
      'Computer Science',
      'Business Administration',
      'Engineering',
      'International Studies',
    ],
    ieltsRequirement: 5.5,
    gpaRequirement: 2.8,
    dormitoryFee: 1500,
    livingCost: 800,
    description: 'Leading South Korean university focused on innovation and global education.',
    highlights: [
      'Strong engineering programs',
      'Industry partnerships',
      'Modern campus',
      'Affordable tuition',
    ],
    acceptanceRate: 85,
  },
  {
    id: 'daejin',
    name: 'Daejin University',
    country: 'South Korea',
    city: 'Pocheon',
    logo: '/universities/Daejin University.png',
    banner: '/universities/Daejin University.png',
    ranking: 52,
    tuition: { min: 3200, max: 6200, currency: 'USD' },
    scholarship: 70,
    visaSuccessRate: 96,
    employmentRate: 91,
    intakeDeadline: '2026-07-01',
    daysToIntake: 38,
    programs: ['Engineering', 'Business', 'Design', 'Liberal Arts', 'Health Sciences'],
    ieltsRequirement: 5.5,
    gpaRequirement: 2.7,
    dormitoryFee: 1400,
    livingCost: 750,
    description:
      'Dynamic university with focus on practical education and international cooperation.',
    highlights: [
      'Hands-on learning',
      'International network',
      'Beautiful campus',
      'Strong job placement',
    ],
    acceptanceRate: 82,
  },
  {
    id: 'busan',
    name: 'Dong-Eui University',
    country: 'South Korea',
    city: 'Busan',
    logo: '/universities/Busan University.png',
    banner: '/universities/Busan University.png',
    ranking: 38,
    tuition: { min: 4000, max: 7000, currency: 'USD' },
    scholarship: 78,
    visaSuccessRate: 99,
    employmentRate: 96,
    intakeDeadline: '2026-06-20',
    daysToIntake: 27,
    programs: [
      'Maritime Engineering',
      'International Business',
      'Film & Arts',
      'Engineering',
      'Medicine',
    ],
    ieltsRequirement: 6.0,
    gpaRequirement: 3.0,
    dormitoryFee: 1600,
    livingCost: 900,
    description: 'Premier coastal university with exceptional maritime and engineering programs.',
    highlights: [
      'World-class facilities',
      'Research focus',
      'Global partnerships',
      'Career support',
    ],
    acceptanceRate: 78,
  },
  {
    id: 'sejong',
    name: 'Sejong University',
    country: 'South Korea',
    city: 'Seoul',
    logo: '/universities/Daejin University.png',
    banner: '/universities/Daejin University.png',
    ranking: 35,
    tuition: { min: 5000, max: 8000, currency: 'USD' },
    scholarship: 72,
    visaSuccessRate: 97,
    employmentRate: 93,
    intakeDeadline: '2026-06-10',
    daysToIntake: 17,
    programs: ['Performance Arts', 'Engineering', 'Business', 'Liberal Arts', 'Science'],
    ieltsRequirement: 5.5,
    gpaRequirement: 2.8,
    dormitoryFee: 1700,
    livingCost: 1200,
    description:
      'Seoul-based leading university known for arts, engineering, and business excellence.',
    highlights: ['Seoul location', 'Arts excellence', 'Research leader', 'Industry connections'],
    acceptanceRate: 75,
  },
  {
    id: 'chungnam',
    name: 'Chungnam National University',
    country: 'South Korea',
    city: 'Daejeon',
    logo: '/universities/Daejin University.png',
    banner: '/universities/Daejin University.png',
    ranking: 42,
    tuition: { min: 3800, max: 6500, currency: 'USD' },
    scholarship: 76,
    visaSuccessRate: 98,
    employmentRate: 95,
    intakeDeadline: '2026-07-05',
    daysToIntake: 42,
    programs: ['Engineering', 'Agriculture', 'Natural Sciences', 'Business', 'Education'],
    ieltsRequirement: 5.5,
    gpaRequirement: 2.8,
    dormitoryFee: 1500,
    livingCost: 800,
    description: 'National university excelling in engineering, agriculture, and natural sciences.',
    highlights: [
      'Government-funded',
      'Research excellence',
      'Affordable tuition',
      'Broad programs',
    ],
    acceptanceRate: 80,
  },
  {
    id: 'namseoul',
    name: 'Namseoul University',
    country: 'South Korea',
    city: 'Cheonan',
    logo: '/universities/Daejin University.png',
    banner: '/universities/Daejin University.png',
    ranking: 55,
    tuition: { min: 3000, max: 5800, currency: 'USD' },
    scholarship: 68,
    visaSuccessRate: 95,
    employmentRate: 89,
    intakeDeadline: '2026-07-15',
    daysToIntake: 52,
    programs: [
      'Business Administration',
      'Engineering',
      'Hospitality',
      'Design',
      'Information Technology',
    ],
    ieltsRequirement: 5.0,
    gpaRequirement: 2.5,
    dormitoryFee: 1300,
    livingCost: 700,
    description: 'Cost-effective university with diverse programs and strong industry connections.',
    highlights: ['Most affordable', 'Business focus', 'Practical training', 'Job placement'],
    acceptanceRate: 88,
  },
]

export interface Country {
  name: string
  code: string
  universities: number
  avgTuition: number
  visaSuccessRate: number
  costOfLiving: number
  partTimeIncome: number
  topUniversities: string[]
  flag: string
  description: string
}

export const countries: Country[] = [
  {
    name: 'South Korea',
    code: 'KR',
    universities: 6,
    avgTuition: 4500,
    visaSuccessRate: 97,
    costOfLiving: 850,
    partTimeIncome: 10,
    topUniversities: ['Hanseo University', 'Daejin University', 'Dong-Eui University'],
    flag: '🇰🇷',
    description: 'Tech-forward nation with world-class universities and vibrant culture.',
  },
  {
    name: 'USA',
    code: 'US',
    universities: 12,
    avgTuition: 35000,
    visaSuccessRate: 85,
    costOfLiving: 1800,
    partTimeIncome: 15,
    topUniversities: ['MIT', 'Stanford', 'Harvard'],
    flag: '🇺🇸',
    description: 'Global leader in higher education with diverse opportunities.',
  },
  {
    name: 'UK',
    code: 'GB',
    universities: 10,
    avgTuition: 28000,
    visaSuccessRate: 88,
    costOfLiving: 1500,
    partTimeIncome: 13,
    topUniversities: ['Oxford', 'Cambridge', 'London School'],
    flag: '🇬🇧',
    description: 'Historic universities with world-renowned programs and prestige.',
  },
  {
    name: 'Canada',
    code: 'CA',
    universities: 8,
    avgTuition: 16000,
    visaSuccessRate: 92,
    costOfLiving: 1200,
    partTimeIncome: 16,
    topUniversities: ['University of Toronto', 'McGill', 'UBC'],
    flag: '🇨🇦',
    description:
      'Student-friendly country with excellent universities and post-graduation work permits.',
  },
  {
    name: 'Australia',
    code: 'AU',
    universities: 9,
    avgTuition: 20000,
    visaSuccessRate: 90,
    costOfLiving: 1600,
    partTimeIncome: 14,
    topUniversities: ['University of Sydney', 'University of Melbourne', 'ANU'],
    flag: '🇦🇺',
    description: 'High-quality education with excellent work opportunities.',
  },
  {
    name: 'Japan',
    code: 'JP',
    universities: 7,
    avgTuition: 5000,
    visaSuccessRate: 94,
    costOfLiving: 950,
    partTimeIncome: 11,
    topUniversities: ['Tokyo University', 'Kyoto University', 'Osaka University'],
    flag: '🇯🇵',
    description: 'Innovative education system with affordable tuition and rich culture.',
  },
]

export interface Scholarship {
  id: string
  universityId: string
  universityName: string
  percentage: number
  requirements: string
  ieltsRequirement: number
  deadline: string
  daysToDeadline: number
  description: string
}

export const scholarships: Scholarship[] = [
  {
    id: 'hanseo-full',
    universityId: 'hanseo',
    universityName: 'Hanseo University',
    percentage: 100,
    requirements: 'Top 5% GPA, IELTS 7.0+',
    ieltsRequirement: 7.0,
    deadline: '2026-05-31',
    daysToDeadline: 7,
    description: 'Full tuition and accommodation scholarship for exceptional students.',
  },
  {
    id: 'daejin-merit',
    universityId: 'daejin',
    universityName: 'Daejin University',
    percentage: 75,
    requirements: 'IELTS 6.5+, GPA 3.5+',
    ieltsRequirement: 6.5,
    deadline: '2026-06-15',
    daysToDeadline: 22,
    description: 'Merit-based scholarship covering 75% of tuition costs.',
  },
  {
    id: 'busan-talent',
    universityId: 'busan',
    universityName: 'Dong-Eui University',
    percentage: 50,
    requirements: 'IELTS 6.0+, GPA 3.2+',
    ieltsRequirement: 6.0,
    deadline: '2026-06-20',
    daysToDeadline: 27,
    description: 'Talent-based scholarship for students with exceptional achievements.',
  },
  {
    id: 'sejong-partial',
    universityId: 'sejong',
    universityName: 'Sejong University',
    percentage: 50,
    requirements: 'IELTS 6.0+, GPA 3.0+',
    ieltsRequirement: 6.0,
    deadline: '2026-06-10',
    daysToDeadline: 17,
    description: 'Partial scholarship for international students.',
  },
  {
    id: 'chungnam-aid',
    universityId: 'chungnam',
    universityName: 'Chungnam National University',
    percentage: 60,
    requirements: 'IELTS 5.5+, GPA 3.0+',
    ieltsRequirement: 5.5,
    deadline: '2026-07-05',
    daysToDeadline: 42,
    description: 'Financial aid program for deserving international students.',
  },
  {
    id: 'namseoul-welcome',
    universityId: 'namseoul',
    universityName: 'Namseoul University',
    percentage: 40,
    requirements: 'IELTS 5.0+, GPA 2.8+',
    ieltsRequirement: 5.0,
    deadline: '2026-07-15',
    daysToDeadline: 52,
    description: 'Welcome scholarship for all international students.',
  },
]

export interface StudentStory {
  id: string
  name: string
  university: string
  country: string
  image: string
  review: string
  scholarship: number
  visaApproval: boolean
  rating: number
}

export const studentStories: StudentStory[] = [
  {
    id: '1',
    name: 'Amira Hassan',
    university: 'Hanseo University',
    country: 'South Korea',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    review:
      'The university exceeded my expectations in every way. Excellent faculty, world-class facilities, and amazing support for international students.',
    scholarship: 75,
    visaApproval: true,
    rating: 5,
  },
  {
    id: '2',
    name: 'Priya Sharma',
    university: 'Dong-Eui University',
    country: 'South Korea',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    review:
      'Outstanding engineering program with real-world projects. The campus life is incredible and the cost of living is very affordable.',
    scholarship: 50,
    visaApproval: true,
    rating: 5,
  },
  {
    id: '3',
    name: 'Mohamed Khalil',
    university: 'Sejong University',
    country: 'South Korea',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    review:
      'Seoul campus is perfect for networking. Got scholarship immediately, visa processed within 2 weeks. Highly recommend!',
    scholarship: 50,
    visaApproval: true,
    rating: 5,
  },
  {
    id: '4',
    name: 'Sofia Rodriguez',
    university: 'Daejin University',
    country: 'South Korea',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    review:
      'Amazing campus, friendly international community, and excellent academic support. Best decision I made!',
    scholarship: 75,
    visaApproval: true,
    rating: 5,
  },
  {
    id: '5',
    name: 'Rajesh Kumar',
    university: 'Chungnam National University',
    country: 'South Korea',
    image: 'https://images.unsplash.com/photo-1507539803528-15265d5479d2?w=400&h=400&fit=crop',
    review:
      'National university with research opportunities, strong industry partnerships, and great career prospects.',
    scholarship: 60,
    visaApproval: true,
    rating: 5,
  },
]
