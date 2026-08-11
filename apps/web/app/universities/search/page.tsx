'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import SearchFilterBar from '@/components/universities/search-filter-bar'
import {
  UniversityCard,
  UniversityCardSkeleton,
  containerVariants,
  type UniversityCardData,
} from '@/components/universities/UniversityCard'
import { trpc } from '@/lib/trpc-client'

function SearchResultsContent() {
  const searchParams = useSearchParams()
  const q = searchParams.get('q') || ''
  const country = searchParams.get('country') || ''
  const level = searchParams.get('level') || ''

  const { data: universities, isLoading } = trpc.university.search.useQuery(
    { q: q || undefined, country: country || undefined, limit: 48 },
    { enabled: true },
  )

  const hasQuery = q.trim().length > 0

  return (
    <div className="flex w-full flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-grow">
        {/* Header */}
        <section className="border-b border-gray-100 bg-gradient-to-b from-[#F5F6F9] to-white py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <Link
              href="/universities"
              className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 transition-colors hover:text-[#C41E3A]"
            >
              <ArrowLeft size={16} />
              Back to Universities
            </Link>

            {/* Filter Bar */}
            <div className="-mx-5 sm:-mx-6 lg:-mx-8">
              <SearchFilterBar />
            </div>

            {/* Results meta */}
            {hasQuery && !isLoading && (
              <div className="mt-8">
                <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
                  {universities && universities.length > 0 ? (
                    <>
                      <span className="text-[#C41E3A]">{universities.length}</span>{' '}
                      {universities.length === 1 ? 'university' : 'universities'} found
                    </>
                  ) : (
                    'No results found'
                  )}
                </h1>
                <p className="mt-2 text-sm text-gray-400">
                  {q && <span>for &ldquo;<span className="font-medium text-gray-600">{q}</span>&rdquo;</span>}
                  {country && <span> in <span className="font-medium text-gray-600">{country}</span></span>}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Results Grid */}
        <section className="bg-white px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-7xl">
            {isLoading ? (
              <UniversityCardSkeleton />
            ) : !hasQuery ? (
              <div className="py-20 text-center">
                <p className="text-lg font-medium text-gray-400">Enter a search term to find universities</p>
                <p className="mt-1 text-sm text-gray-300">Search by university name, program, city, or country</p>
              </div>
            ) : (universities ?? []).length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-lg font-medium text-gray-500">No universities found</p>
                <p className="mt-1 text-sm text-gray-400">Try adjusting your search or filters</p>
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                {(universities ?? []).map((uni: UniversityCardData) => (
                  <UniversityCard key={uni.id} uni={uni} />
                ))}
              </motion.div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex w-full flex-col overflow-x-hidden">
        <Navbar />
        <main className="flex-grow">
          <section className="bg-gradient-to-b from-[#F5F6F9] to-white py-12 sm:py-16">
            <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
              <Link href="/universities" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-400">
                <ArrowLeft size={16} />
                Back to Universities
              </Link>
              <SearchFilterBar />
            </div>
          </section>
          <section className="bg-white px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
            <div className="mx-auto max-w-7xl">
              <UniversityCardSkeleton />
            </div>
          </section>
        </main>
        <Footer />
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  )
}
