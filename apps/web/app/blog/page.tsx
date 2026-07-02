import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { BlogHero } from '@/components/blog/BlogHero'
import { ArticlesGrid } from '@/components/blog/ArticlesGrid'
import { Sidebar } from '@/components/blog/Sidebar'
import { UniversitySpotlight } from '@/components/blog/UniversitySpotlight'
import { StudentLifeSection } from '@/components/blog/StudentLifeSection'
import { CareerPathwayHub } from '@/components/blog/CareerPathwayHub'
import { ResourceCenter } from '@/components/blog/ResourceCenter'
import { IntakeCountdown } from '@/components/blog/IntakeCountdown'
import { OpportunityHub } from '@/components/blog/OpportunityHub'
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
        <ErrorBoundary sectionName="Blog Hero">
          <BlogHero />
        </ErrorBoundary>

        {/* MAIN CONTENT */}
        <ErrorBoundary sectionName="Articles & Sidebar">
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
        </ErrorBoundary>

        {/* UNIVERSITY SPOTLIGHT */}
        <ErrorBoundary sectionName="University Spotlight">
          <UniversitySpotlight />
        </ErrorBoundary>

        {/* STUDENT LIFE IN KOREA */}
        <ErrorBoundary sectionName="Student Life">
          <StudentLifeSection />
        </ErrorBoundary>

        {/* CAREER PATHWAY HUB */}
        <ErrorBoundary sectionName="Career Pathways">
          <CareerPathwayHub />
        </ErrorBoundary>

        {/* RESOURCE CENTER */}
        <ErrorBoundary sectionName="Resource Center">
          <ResourceCenter />
        </ErrorBoundary>

        {/* INTAKE COUNTDOWN */}
        <ErrorBoundary sectionName="Intake Countdown">
          <IntakeCountdown />
        </ErrorBoundary>

        {/* OPPORTUNITY HUB */}
        <ErrorBoundary sectionName="Opportunities">
          <OpportunityHub />
        </ErrorBoundary>

        {/* NEWSLETTER SECTION */}
        <ErrorBoundary sectionName="Newsletter">
          <NewsletterSection />
        </ErrorBoundary>
      </main>

      <Footer />
    </div>
  )
}
