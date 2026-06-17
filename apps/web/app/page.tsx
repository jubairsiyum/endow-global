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
  title: 'Endow Global Education | Study Abroad, University Matching & Application Support',
  description:
    'Discover 500+ universities across 25 countries. Get AI-powered course matching, expert counselor support, and end-to-end application help — all free for students.',
  keywords: [
    'study abroad',
    'university application',
    'international education',
    'study in South Korea',
    'study in UK',
    'study in Finland',
    'study in Australia',
    'study in USA',
    'study in Canada',
    'AI course matching',
    'education counseling',
    'scholarship',
    'student visa',
    'university admission',
    'free counseling',
    'Endow Global',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: appUrl,
    siteName: 'Endow Global Education',
    title: 'Endow Global Education | Study Abroad Made Simple',
    description:
      'Discover 500+ universities across 25 countries. AI-powered matching, expert counseling, and end-to-end application support — free for students.',
    images: [
      {
        url: `${appUrl}/og-default.png`,
        width: 1200,
        height: 630,
        alt: 'Endow Global Education - Study Abroad Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@endowglobal',
    title: 'Endow Global Education | Study Abroad Made Simple',
    description:
      'Discover 500+ universities across 25 countries. AI-powered matching, expert counseling, and end-to-end application support.',
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
  { name: 'Busan University', logo: '/universities/Busan University.png' },
  { name: 'Hanseo University', logo: '/universities/Hanseo University.png' },
  { name: 'Daejin University', logo: '/universities/Daejin University.png' },
  { name: 'Chungwoon University', logo: '/universities/Chungwoon University.png' },
  { name: 'Yeungjin University', logo: '/universities/Yeungjin University.png' },
  { name: 'Sahmyook University', logo: '/universities/Sahmyook University.png' },
  { name: 'Sejong University', logo: '/universities/Sejong University.png' },
  { name: 'Kyung Hee University', logo: '/universities/Kyung Hee University.png' },
  { name: 'Sun Moon University', logo: '/universities/Sun Moon University.png' },
  { name: 'Turku University', logo: '/universities/Turku University.png' },
  { name: 'Helsinki University', logo: '/universities/Helsinki University.png' },
  { name: 'Aalto University', logo: '/universities/Aalto University.png' },
  { name: 'Dong-Eui University', logo: '/universities/Dong-Eui University.png' },
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
    'Endow Global Education helps students discover 500+ universities across 25 countries with AI-powered course matching and expert counselor support.',
  sameAs: [],
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'BD',
  },
  areaServed: [
    { '@type': 'Country', name: 'South Korea' },
    { '@type': 'Country', name: 'United Kingdom' },
    { '@type': 'Country', name: 'Finland' },
    { '@type': 'Country', name: 'Australia' },
    { '@type': 'Country', name: 'United States' },
    { '@type': 'Country', name: 'Canada' },
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
          description: 'AI-powered matching of students with universities worldwide',
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
    ],
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '10000',
    bestRating: '5',
  },
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
