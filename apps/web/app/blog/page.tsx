'use client'

import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/layout/Footer'
import { BlogHero } from '@/components/blog/BlogHero'
import { SearchFilterSection } from '@/components/blog/SearchFilterSection'
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
import { useState } from 'react'

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All Articles')

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-[#111827]">
      {/* NAVBAR */}
      <div className="sticky top-0 z-40">
        <Navbar />
      </div>

      <main className="flex-grow">
        {/* HERO SECTION */}
        <BlogHero />

        {/* SEARCH & FILTER */}
        <SearchFilterSection activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

        {/* MAIN CONTENT */}
        <section className="relative bg-white py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* ARTICLES */}
              <div className="lg:col-span-2">
                <ArticlesGrid category={activeCategory} />
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
