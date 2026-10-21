'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/layout/Footer'
import { BlogHero } from '@/components/blog/BlogHero'
import { SearchFilterSection } from '@/components/blog/SearchFilterSection'
import { ArticlesGrid } from '@/components/blog/ArticlesGrid'
import { Sidebar } from '@/components/blog/Sidebar'
import { UniversitySpotlight } from '@/components/blog/UniversitySpotlight'
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

function BlogContent() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')
  const [activeCategory, setActiveCategory] = useState<string>('All Articles')

  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam)
    }
  }, [categoryParam])

  const { data: blogs, isLoading: blogsLoading } = trpc.resource.published.blogs.useQuery()
  const { data: files } = trpc.resource.published.files.useQuery()

  const posts = useMemo(() => sortByDateDesc(blogs ?? []), [blogs])
  const featuredPosts = useMemo(() => {
    const feat = posts.filter((p) => p.featured)
    if (feat.length > 0) return feat
    return posts.slice(0, 3)
  }, [posts])
  const featured = featuredPosts[0] ?? null

  // Ensure trending is never empty: use explicit section 'trending' first, or top viewed / latest posts
  const trending = useMemo(() => {
    const explicit = posts.filter((p) => p.section === 'trending')
    if (explicit.length > 0) return explicit.slice(0, 4)
    return posts.slice().sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).slice(0, 4)
  }, [posts])

  // Scholarships sidebar items
  const scholarships = useMemo(() => {
    const explicit = posts.filter(
      (p) => p.section === 'scholarship' || (p.category || '').toLowerCase().includes('scholarship')
    )
    if (explicit.length > 0) return explicit.slice(0, 3)
    return posts.slice(0, 2)
  }, [posts])

  // Visa updates sidebar items
  const visaUpdates = useMemo(() => {
    const explicit = posts.filter(
      (p) => p.section === 'visa' || (p.category || '').toLowerCase().includes('visa')
    )
    if (explicit.length > 0) return explicit.slice(0, 3)
    return posts.slice(1, 3)
  }, [posts])

  const featuredUniversity = posts.find((p) => p.section === 'featured_university') ?? null

  const displayedArticles = useMemo(() => {
    if (!activeCategory || activeCategory === 'All Articles') {
      return posts
    }
    const target = activeCategory.toLowerCase().trim()
    return posts.filter((p) => {
      const cat = (p.category || '').toLowerCase().trim()
      const sec = (p.section || '').toLowerCase().trim()
      if (target === 'student life') {
        return cat === 'student life' || cat === 'lifestyle' || sec === 'student_life'
      }
      return cat === target || sec === target
    })
  }, [posts, activeCategory])

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    const params = new URLSearchParams(window.location.search)
    if (category === 'All Articles') {
      params.delete('category')
    } else {
      params.set('category', category)
    }
    const qs = params.toString()
    window.history.replaceState(null, '', qs ? `${window.location.pathname}?${qs}` : window.location.pathname)
  }

  return (
    <div className="flex flex-col bg-white font-sans text-[#111827]">
      {/* NAVBAR */}
      <div className="sticky top-0 z-40">
        <Navbar />
      </div>

      <main className="flex-grow">
        {/* HERO SECTION */}
        <BlogHero featuredPosts={featuredPosts} featured={featured} />

        {/* SEARCH & CATEGORY FILTER */}
        <div id="articles" className="scroll-mt-24">
          <SearchFilterSection
            activeCategory={activeCategory}
            setActiveCategory={handleCategoryChange}
          />
        </div>

        {/* MAIN ARTICLES GRID & SIDEBAR */}
        <section className="relative bg-gradient-to-b from-white via-white to-[#F8FAFC] py-12 lg:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_310px] xl:grid-cols-[1fr_330px] lg:gap-8 xl:gap-10">
              {/* ARTICLES */}
              <div className="min-w-0">
                <ArticlesGrid articles={displayedArticles} />
              </div>

              {/* SIDEBAR (Trending Now, Latest Scholarships, Visa Updates) */}
              <div className="w-full lg:w-[310px] xl:w-[330px] shrink-0">
                <Sidebar
                  trending={trending}
                  scholarships={scholarships}
                  visaUpdates={visaUpdates}
                  isLoading={blogsLoading}
                />
              </div>
            </div>
          </div>
        </section>

        {/* UNIVERSITY SPOTLIGHT */}
        <UniversitySpotlight university={featuredUniversity} />

        {/* CAREER PATHWAY HUB */}
        <CareerPathwayHub />

        {/* RESOURCE CENTER */}
        <ResourceCenter resources={files ?? []} />

        {/* INTAKE COUNTDOWN */}
        <IntakeCountdown />

        {/* OPPORTUNITY HUB */}
        <OpportunityHub />

        {/* STUDENT SUCCESS STORIES / REVIEWS */}
        <SuccessStories />

        {/* NEWSLETTER SECTION */}
        <NewsletterSection />
      </main>

      <Footer />
    </div>
  )
}

export default function BlogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <BlogContent />
    </Suspense>
  )
}
