'use client'

import { Navbar } from '@/components/layout/Navbar'
import HeroSection from '@/components/universities/hero-section'
import FeaturedUniversities from '@/components/universities/featured-universities'
import StatisticsSection from '@/components/universities/statistics-section'
import CountryExplorer from '@/components/universities/country-explorer'
import ScholarshipSpotlight from '@/components/universities/scholarship-spotlight'
import StudentSuccessStories from '@/components/universities/student-success-stories'
import ApplicationRoadmap from '@/components/universities/application-roadmap'
import PremiumConsultationCTA from '@/components/universities/premium-consultation-cta'
import UniversitiesFooter from '@/components/universities/footer'

export default function UniversitiesPage() {
  return (
    <div className="flex w-full flex-col overflow-x-hidden">
      <Navbar />
      <section className="relative overflow-x-hidden bg-white pt-24 pb-16 lg:pb-20">
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <HeroSection />
        </div>
      </section>
      <FeaturedUniversities />
      <CountryExplorer />
      <ScholarshipSpotlight />
      <ApplicationRoadmap />
      <StatisticsSection />
      <StudentSuccessStories />
      <PremiumConsultationCTA />
      <UniversitiesFooter />
    </div>
  )
}
