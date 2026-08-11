import type { Metadata } from 'next'

import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { DiagnosticUniversityMarquee } from '@/components/home/DiagnosticUniversityMarquee'
import PremiumHero from '@/components/home/PremiumHero'
import CountryCards from '@/components/home/CountryCards'
import TrendingCourses from '@/components/home/TrendingCourses'
import ApplicationRoadmap from '@/components/universities/application-roadmap'
import Testimonials from '@/components/home/Testimonials'
import FAQAccordion from '@/components/home/FAQAccordion'
import PremiumCTA from '@/components/home/PremiumCTA'

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export const metadata: Metadata = {
  title: 'Endow Global Education | Study in South Korea & Australia | Expert Guidance',
  description: 'Study in South Korea and Australia with expert guidance from Endow Global Education — free university matching, visa support, scholarship assistance, and end-to-end application help for Bangladeshi students.',
  keywords: ['study abroad','study in South Korea','study in Australia','South Korea university','Korean university admission','student visa South Korea','GKS scholarship','Australia university admission','education counseling Bangladesh','study abroad consultant','Endow Global Education'],
  openGraph: {
    type: 'website', locale: 'en_US', url: appUrl, siteName: 'Endow Global Education',
    title: 'Endow Global Education | Study in South Korea & Australia',
    description: 'Expert guidance for studying in South Korea and Australia. Free university matching, visa support, and scholarship assistance for Bangladeshi students.',
    images: [{ url: `${appUrl}/og-default.png`, width: 1200, height: 630, alt: 'Endow Global Education — Study in South Korea' }],
  },
  twitter: { card: 'summary_large_image', site: '@endowglobal', title: 'Endow Global Education | Study in South Korea', description: 'Expert guidance for studying in South Korea.', images: [`${appUrl}/og-default.png`] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 } },
}

const jsonLd = {
  '@context': 'https://schema.org', '@type': 'EducationalOrganization',
  name: 'Endow Global Education', url: appUrl, logo: `${appUrl}/logo/endoedu.svg`,
  description: 'Expert guidance for Bangladeshi students to study in South Korea and Australia — free university matching, visa support, and scholarship assistance.',
  address: { '@type': 'PostalAddress', addressCountry: 'BD' },
  areaServed: [{ '@type': 'Country', name: 'South Korea' }, { '@type': 'Country', name: 'Australia' }],
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.7', reviewCount: '200', bestRating: '5' },
}

const faqSchema = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'How can I apply to study in South Korea?', acceptedAnswer: { '@type': 'Answer', text: 'You can apply directly through the university website or with expert help from Endow Global Education. We guide you through the entire admission process — from choosing the right university and program to preparing documents and submitting your application.' } },
    { '@type': 'Question', name: 'Can I work while studying in South Korea?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. International students can work part-time up to 20 hours per week during semesters and unlimited hours during vacations with immigration permission.' } },
    { '@type': 'Question', name: 'What are the visa requirements for South Korea?', acceptedAnswer: { '@type': 'Answer', text: 'You typically need an admission letter, bank statement, passport, medical checkup, and academic documents for a D-2 (degree) or D-4 (language) visa.' } },
    { '@type': 'Question', name: 'What are the tuition fees for international students?', acceptedAnswer: { '@type': 'Answer', text: 'Tuition ranges from $3,000 to $8,000 per semester for undergraduate programs and $4,000 to $12,000 for graduate programs in South Korea.' } },
    { '@type': 'Question', name: 'Are scholarships available for South Korea?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. South Korea offers the GKS (Global Korea Scholarship) covering full tuition, living expenses, and airfare. Universities also offer merit-based scholarships.' } },
    { '@type': 'Question', name: 'Do I need to know Korean to study there?', acceptedAnswer: { '@type': 'Answer', text: 'Many South Korean universities offer courses taught entirely in English, especially at graduate level. For Korean-taught programs, TOPIK scores may be required.' } },
  ],
}

const universityLogos = [
  { name: 'Hanseo University', logo: '/universities/Hanseo University.png' },
  { name: 'Sejong University', logo: '/universities/Sejong University.png' },
  { name: 'Kyung Hee University', logo: '/universities/Kyung Hee University.png' },
  { name: 'Dong-Eui University', logo: '/universities/Dong-Eui University.png' },
  { name: 'Chungwoon University', logo: '/universities/Chungwoon University.png' },
  { name: 'Sahmyook University', logo: '/universities/Sahmyook University.png' },
  { name: 'Yeungjin University', logo: '/universities/Yeungjin University.png' },
  { name: 'Daejin University', logo: '/universities/Daejin University.png' },
  { name: 'Sun Moon University', logo: '/universities/Sun Moon University.png' },
  { name: 'Busan University', logo: '/universities/Busan University.png' },
  { name: 'Namseoul University', logo: '/universities/Daejin University.png' },
]

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-grow">
          <PremiumHero />
          <DiagnosticUniversityMarquee universities={universityLogos} />
          <TrendingCourses />
          <CountryCards />
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
