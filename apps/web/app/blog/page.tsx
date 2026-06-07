'use client'

import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/layout/Footer'
import { BlogHero } from '@/components/blog/BlogHero'
import { ArticlesGrid } from '@/components/blog/ArticlesGrid'
import { Sidebar } from '@/components/blog/Sidebar'
import { UniversitySpotlight } from '@/components/blog/UniversitySpotlight'
import { StudentLifeSection } from '@/components/blog/StudentLifeSection'
import { CareerPathwayHub } from '@/components/blog/CareerPathwayHub'
import { ResourceCenter } from '@/components/blog/ResourceCenter'
import { IntakeCountdown } from '@/components/blog/IntakeCountdown'
import { OpportunityHub } from '@/components/blog/OpportunityHub'
import { SuccessStories } from '@/components/blog/SuccessStories'
import { NewsletterSection } from '@/components/blog/NewsletterSection'

export default function BlogPage() {
  return (
    <div className="flex flex-col bg-white font-sans text-[#111827]">
      {/* NAVBAR */}
      <div className="sticky top-0 z-40">
        <Navbar />
      </div>

      <main className="flex-grow">
        {/* HERO SECTION */}
        <BlogHero />

        {/* MAIN CONTENT */}
        <section className="relative bg-gradient-to-b from-white via-white to-[#F8FAFC] py-12 lg:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10">
              {/* ARTICLES */}
              <div className="lg:col-span-2">
                <ArticlesGrid category="All Articles" />
              </div>

              {/* SIDEBAR */}
              <div className="lg:col-span-1">
                <Sidebar />
              </div>
            </div>
          </div>
        </section>

        {/* UNIVERSITY SPOTLIGHT */}
        <UniversitySpotlight />

        {/* STUDENT LIFE IN KOREA */}
        <StudentLifeSection />

        {/* CAREER PATHWAY HUB */}
        <CareerPathwayHub />

        {/* RESOURCE CENTER */}
        <ResourceCenter />

        {/* INTAKE COUNTDOWN */}
        <IntakeCountdown />

        {/* OPPORTUNITY HUB */}
        <OpportunityHub />

        {/* STUDENT SUCCESS STORIES */}
        <SuccessStories />

        {/* NEWSLETTER SECTION */}
        <NewsletterSection />
      </main>

      <Footer />
    </div>
  )
}
