import type { Metadata } from 'next'
import Link from 'next/link'

import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { DiagnosticUniversityMarquee } from '@/components/home/DiagnosticUniversityMarquee'
import PremiumHero from '@/components/home/PremiumHero'
import UniversityFinder from '@/components/home/UniversityFinder'
import TrustStats from '@/components/home/TrustStats'
import ServiceTimeline from '@/components/home/ServiceTimeline'
import CountryCards from '@/components/home/CountryCards'
import TrendingCourses from '@/components/home/TrendingCourses'
import ApplicationRoadmap from '@/components/universities/application-roadmap'
import Testimonials from '@/components/home/Testimonials'
import FAQAccordion from '@/components/home/FAQAccordion'
import PremiumCTA from '@/components/home/PremiumCTA'

/* -------------------------------------------------------------------------- */
/*                                    SEO                                     */
/* -------------------------------------------------------------------------- */

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export const metadata: Metadata = {
  title: 'Endow Global Education | Study in South Korea & Australia | Expert Guidance',
  description:
    'Study in South Korea and Australia with expert guidance from Endow Global Education. Free university matching, visa support, scholarship assistance, and end-to-end application help.',
  keywords: [
    'study abroad',
    'study in South Korea',
    'study in Australia',
    'South Korea university admission',
    'Australia university admission',
    'student visa South Korea',
    'student visa Australia',
    'GKS scholarship',
    'Korean university application',
    'Australian university application',
    'education counseling Bangladesh',
    'study abroad consultant',
    'free university matching',
    'Endow Global Education',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: appUrl,
    siteName: 'Endow Global Education',
    title: 'Endow Global Education | Study in South Korea & Australia',
    description:
      'Expert guidance for studying in South Korea and Australia. Free university matching, visa support, and scholarship assistance.',
    images: [
      {
        url: `${appUrl}/og-default.png`,
        width: 1200,
        height: 630,
        alt: 'Endow Global Education - Study in South Korea & Australia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@endowglobal',
    title: 'Endow Global Education | Study in South Korea & Australia',
    description:
      'Expert guidance for studying in South Korea and Australia. Free university matching, visa support, and scholarship assistance.',
    images: [`${appUrl}/og-default.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

/* -------------------------------------------------------------------------- */
/*                                  DATA                                      */
/* -------------------------------------------------------------------------- */

const universities = [
  { name: 'Busan University', logo: '/universities/busan-university.png' },
  { name: 'Hanseo University', logo: '/universities/hanseo-university.png' },
  { name: 'Daejin University', logo: '/universities/daejin-university.png' },
  { name: 'Chungwoon University', logo: '/universities/chungwoon-university.png' },
  { name: 'Yeungjin University', logo: '/universities/yeungjin-university.png' },
  { name: 'Sahmyook University', logo: '/universities/sahmyook-university.png' },
  { name: 'Sejong University', logo: '/universities/sejong-university.png' },
  { name: 'Kyung Hee University', logo: '/universities/kyung-hee-university.png' },
  { name: 'Sun Moon University', logo: '/universities/sun-moon-university.png' },
  { name: 'Turku University', logo: '/universities/turku-university.png' },
  { name: 'Helsinki University', logo: '/universities/helsinki-university.png' },
  { name: 'Aalto University', logo: '/universities/aalto-university.png' },
  { name: 'Dong-Eui University', logo: '/universities/dong-eui-university.png' },
] as const

/* -------------------------------------------------------------------------- */
/*                              JSON-LD SCHEMA                                */
/* -------------------------------------------------------------------------- */

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'Endow Global Education',
  url: appUrl,
  logo: `${appUrl}/logo/endoedu.svg`,
  description:
    'Endow Global Education provides expert guidance for students looking to study in South Korea and Australia. Free university matching, visa support, and scholarship assistance.',
  sameAs: [],
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'BD',
  },
  areaServed: [
    { '@type': 'Country', name: 'South Korea' },
    { '@type': 'Country', name: 'Australia' },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Study Abroad Programs',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'EducationalOccupationalProgram',
          name: 'University Matching',
          description: 'Personalized matching of students with universities in South Korea and Australia',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Application Counseling',
          description: 'Expert guidance through the entire university application process',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Visa Support',
          description: 'Complete visa preparation and processing assistance for South Korea and Australia',
        },
      },
    ],
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.7',
    reviewCount: '200',
    bestRating: '5',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How can I apply to study in South Korea or Australia?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can apply directly through the university website or with the help of our expert consultants at Endow Global Education. We guide you through the entire admission process — from choosing the right university and program to preparing your documents and submitting your application.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I work while studying abroad?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. In South Korea, international students can work part-time up to 20 hours per week during semesters and unlimited hours during vacations with immigration permission. In Australia, student visa holders can work up to 48 hours per fortnight during term time and unlimited hours during scheduled breaks.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are the student visa requirements for South Korea and Australia?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For South Korea, you typically need an admission letter, bank statement, passport, medical checkup, and academic documents for a D-2 (degree) or D-4 (language) visa. For Australia, you need a Confirmation of Enrolment (CoE), proof of financial capacity, English proficiency scores, and health insurance (OSHC).',
      },
    },
    {
      '@type': 'Question',
      name: 'What are the tuition fees for international students?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'In South Korea, tuition typically ranges from $3,000 to $8,000 per semester for undergraduate programs and $4,000 to $12,000 for graduate programs. In Australia, undergraduate fees range from AUD 20,000 to 45,000 per year, and postgraduate from AUD 22,000 to 50,000.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I get a scholarship to study in South Korea or Australia?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely. South Korea offers the prestigious GKS (Global Korea Scholarship) covering full tuition, living expenses, and airfare. In Australia, universities offer international merit scholarships, research grants, and government-funded awards like Australia Awards and Destination Australia.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does the visa process take?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For South Korea, visa processing usually takes 4 to 8 weeks depending on the embassy and application volume. For Australia, the student visa (subclass 500) typically takes 4 to 12 weeks.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need to know Korean or learn English to study abroad?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Many South Korean universities offer courses taught entirely in English, especially at the graduate level. For Korean-taught programs, TOPIK may be required. In Australia, all programs are in English and require IELTS, TOEFL, or PTE scores.',
      },
    },
    {
      '@type': 'Question',
      name: 'What accommodation options are available for international students?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'In South Korea, most universities offer affordable on-campus dormitories. In Australia, options include university-managed residences, private student accommodations, homestays, and shared apartments.',
      },
    },
  ],
}

/* -------------------------------------------------------------------------- */
/*                                 PAGE                                       */
/* -------------------------------------------------------------------------- */

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="flex min-h-screen flex-col">
        <Navbar />

        <main className="flex-grow">
          <PremiumHero />
          <UniversityFinder />
          <TrustStats />
          <DiagnosticUniversityMarquee universities={universities} />
          <ServiceTimeline />
          <CountryCards />
          <TrendingCourses />
          <ApplicationRoadmap />
          <Testimonials />
          <FAQAccordion />
          <PremiumCTA />
        </main>

        <Footer />
      </div>
    </>
  )
}
