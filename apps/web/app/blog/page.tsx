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
import { trpc } from '@/lib/trpc-client'

function sortByDateDesc(posts: any[]) {
  return posts.slice().sort((a, b) => {
    const ad = a.publishedAt ?? a.createdAt
    const bd = b.publishedAt ?? b.createdAt
    return new Date(bd ?? 0).getTime() - new Date(ad ?? 0).getTime()
  })
}

export default function BlogPage() {
  const { data: blogs } = trpc.resource.published.blogs.useQuery()
  const { data: files } = trpc.resource.published.files.useQuery()

  const posts = sortByDateDesc(blogs ?? [])
  const featured = posts.find((p) => p.featured) ?? posts[0] ?? null
  const trending = posts.filter((p) => p.section === 'trending').slice(0, 3)
  const scholarships = posts.filter((p) => p.section === 'scholarship').slice(0, 3)
  const visaUpdates = posts.filter((p) => p.section === 'visa').slice(0, 3)
  const featuredUniversity = posts.find((p) => p.section === 'featured_university') ?? null

  return (
    <div className="flex flex-col bg-white font-sans text-[#111827]">
      {/* NAVBAR */}
      <div className="sticky top-0 z-40">
        <Navbar />
      </div>

      <main className="flex-grow">
        {/* HERO SECTION */}
        <BlogHero featured={featured} />

        {/* MAIN CONTENT */}
        <section className="relative bg-gradient-to-b from-white via-white to-[#F8FAFC] py-12 lg:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10">
              {/* ARTICLES */}
              <div className="lg:col-span-2">
                <ArticlesGrid articles={posts} />
              </div>

              {/* SIDEBAR */}
              <div className="lg:col-span-1">
                <Sidebar trending={trending} scholarships={scholarships} visaUpdates={visaUpdates} />
              </div>
            </div>
          </div>
        </section>

        {/* UNIVERSITY SPOTLIGHT */}
        <UniversitySpotlight university={featuredUniversity} />

        {/* STUDENT LIFE IN KOREA */}
        <StudentLifeSection />

        {/* CAREER PATHWAY HUB */}
        <CareerPathwayHub />

        {/* RESOURCE CENTER */}
        <ResourceCenter resources={files ?? []} />

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
