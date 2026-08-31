'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Search, SearchX, Sparkles, X, FilterX } from 'lucide-react'
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
  const router = useRouter()
  const q = searchParams.get('q') || ''
  const country = searchParams.get('country') || ''
  const levelRaw = searchParams.get('level') || searchParams.get('degree') || ''
  const level = levelRaw || ''

  const { data: universities, isLoading } = trpc.university.search.useQuery(
    { q: q || undefined, country: country || undefined, level: level || undefined, limit: 48 },
    { enabled: true },
  )

  const hasQuery = q.trim().length > 0
  const hasFilters = Boolean(country || level)
  const hasActiveSearch = hasQuery || hasFilters
  const resultCount = universities?.length ?? 0
  const isEmpty = !isLoading && hasActiveSearch && resultCount === 0

  const clearAll = () => router.push('/universities/search')
  const clearSearch = () => {
    const p = new URLSearchParams(searchParams.toString())
    p.delete('q')
    const qs = p.toString()
    router.push(qs ? `/universities/search?${qs}` : '/universities/search')
  }

  return (
    <div className="flex w-full flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-grow bg-[#FCFCFD]">
        {/* Compact Header — search + hierarchy */}
        <section className="border-b border-gray-100 bg-gradient-to-b from-[#F5F6F9] via-white to-white">
          <div className="mx-auto max-w-7xl px-5 pb-6 pt-[88px] sm:px-6 sm:pb-8 sm:pt-[96px] lg:px-8 lg:pb-8 lg:pt-[104px]">
            {/* Breadcrumb */}
            <Link
              href="/universities"
              className="mb-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-gray-400 transition-colors hover:text-[#C41E3A] sm:mb-6"
            >
              <ArrowLeft size={14} />
              Back to Universities
            </Link>

            {/* Search controls — balanced, not stretched */}
            <SearchFilterBar />

            {/* Strong visual hierarchy: query + count */}
            {hasActiveSearch && !isLoading && (
              <div className="mt-6 flex flex-col gap-3 border-t border-gray-100 pt-6 sm:mt-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 flex-wrap items-center gap-2.5">
                  {hasQuery ? (
                    <h1 className="flex flex-wrap items-center gap-2 text-[15px] font-semibold leading-tight text-gray-900 sm:text-[15.5px]">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C41E3A] px-3 py-1 text-xs font-bold text-white shadow-sm">
                        <Search size={12} />
                        &ldquo;{q.trim()}&rdquo;
                      </span>
                      {level && (
                        <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-700">
                          {level}
                        </span>
                      )}
                      {country && (
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700">
                          {country}
                        </span>
                      )}
                      <span className="hidden text-gray-300 sm:inline">—</span>
                      <span className="text-gray-900">
                        <span className="font-bold text-[#C41E3A]">{resultCount}</span>{' '}
                        <span className="font-medium text-gray-600">
                          {resultCount === 1 ? 'university' : 'universities'} found
                        </span>
                      </span>
                    </h1>
                  ) : (
                    <h1 className="flex flex-wrap items-center gap-2 text-[15px] font-semibold text-gray-900 sm:text-[15.5px]">
                      <span className="font-bold text-[#C41E3A]">{resultCount}</span>{' '}
                      <span className="font-medium text-gray-600">
                        {resultCount === 1 ? 'university' : 'universities'} found
                      </span>
                      {country && (
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700">
                          {country}
                        </span>
                      )}
                      {level && (
                        <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-700">
                          {level}
                        </span>
                      )}
                    </h1>
                  )}
                </div>

                {/* Right meta — subtle count / clear */}
                <div className="flex shrink-0 items-center gap-2 text-xs">
                  {isEmpty ? (
                    <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 font-semibold text-amber-700">
                      0 results
                    </span>
                  ) : (
                    <span className="hidden text-gray-400 sm:inline">
                      {hasQuery && country ? (
                        <>
                          in <span className="font-medium text-gray-600">{country}</span>
                        </>
                      ) : null}
                    </span>
                  )}
                  {hasActiveSearch && (
                    <button
                      onClick={clearAll}
                      className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2.5 py-1 font-semibold text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                    >
                      <X size={12} />
                      Clear
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* When no active search, show subtle helper */}
            {!hasActiveSearch && !isLoading && (
              <p className="mt-5 text-xs font-medium text-gray-400 sm:mt-6">
                Search by university name, program, city, or country — try “Engineering” or “Seoul”
              </p>
            )}
          </div>
        </section>

        {/* Results area — balanced padding, centered empty */}
        <section className="px-5 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <div className="mx-auto max-w-7xl">
            {isLoading ? (
              <UniversityCardSkeleton />
            ) : !hasActiveSearch ? (
              <div className="flex min-h-[380px] items-center justify-center py-8 sm:min-h-[420px]">
                <div className="w-full max-w-[520px] rounded-[20px] border border-gray-100 bg-white px-6 py-10 text-center shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:px-8 sm:py-12">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5F6F9] text-gray-400">
                    <Search size={22} />
                  </div>
                  <h2 className="mt-5 text-[18px] font-bold tracking-tight text-gray-900">Start your search</h2>
                  <p className="mx-auto mt-2 max-w-[36ch] text-sm leading-relaxed text-gray-500">
                    Enter a university, program, or country above to discover your ideal study destination.
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {['Engineering', 'Business', 'South Korea', 'Australia'].map((s) => (
                      <Link
                        key={s}
                        href={`/universities/search?q=${encodeURIComponent(s)}`}
                        className="rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:border-[#C41E3A]/20 hover:bg-[#FFF5F6] hover:text-[#C41E3A]"
                      >
                        {s}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : isEmpty ? (
              <div className="flex min-h-[420px] items-center justify-center py-6 sm:min-h-[480px] sm:py-8">
                <div className="w-full max-w-[560px] rounded-[24px] border border-gray-100 bg-white px-6 py-8 text-center shadow-[0_12px_40px_rgba(15,23,42,0.06)] sm:px-10 sm:py-10">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF5F6] text-[#C41E3A] shadow-sm">
                    <SearchX size={24} />
                  </div>
                  <h2 className="mt-5 text-[20px] font-bold tracking-tight text-gray-900 sm:text-[22px]">
                    No universities found
                  </h2>
                  <p className="mx-auto mt-2 max-w-[38ch] text-sm leading-relaxed text-gray-500">
                    {hasQuery ? (
                      <>
                        No results for <span className="font-semibold text-gray-700">&ldquo;{q.trim()}&rdquo;</span>
                        {country ? (
                          <>
                            {' '}
                            in <span className="font-semibold text-gray-700">{country}</span>
                          </>
                        ) : null}
                        . Try adjusting your search.
                      </>
                    ) : (
                      <>No universities match your current filters. Try adjusting them.</>
                    )}
                  </p>

                  {/* Helpful suggestions */}
                  <div className="mx-auto mt-6 max-w-[420px] rounded-2xl bg-[#F8FAFC] px-5 py-4 text-left">
                    <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gray-500">
                      <Sparkles size={12} className="text-[#C41E3A]" />
                      Suggestions
                    </p>
                    <ul className="mt-3 space-y-2.5 text-sm text-gray-600">
                      <li className="flex gap-2.5">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C41E3A]" />
                        <span>
                          <span className="font-semibold text-gray-900">Check your spelling</span> — small typos can hide results
                        </span>
                      </li>
                      <li className="flex gap-2.5">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C41E3A]" />
                        <span>
                          <span className="font-semibold text-gray-900">Try broader keywords</span> — e.g. “Engineering” instead of “Biomedical Engineering”
                        </span>
                      </li>
                      <li className="flex gap-2.5">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C41E3A]" />
                        <span className="flex flex-wrap items-center gap-1.5">
                          <span className="font-semibold text-gray-900">Remove filters</span> — {country || level ? 'clear your current' : 'try without'} country or degree filters
                          {(country || level) && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-gray-600 shadow-sm">
                              <FilterX size={10} />
                              {country || level}
                            </span>
                          )}
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-7 flex flex-col justify-center gap-2.5 sm:flex-row">
                    {hasQuery && (
                      <button
                        onClick={clearSearch}
                        className="inline-flex h-10 items-center justify-center rounded-full border border-gray-200 bg-white px-5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                      >
                        Clear search
                      </button>
                    )}
                    <button
                      onClick={clearAll}
                      className="inline-flex h-10 items-center justify-center rounded-full bg-[#C41E3A] px-5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(196,30,58,0.2)] transition-colors hover:bg-[#A01830]"
                    >
                      Clear all filters
                    </button>
                    <Link
                      href="/universities"
                      className="inline-flex h-10 items-center justify-center rounded-full border border-gray-200 bg-white px-5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      Browse all universities
                    </Link>
                  </div>
                </div>
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
    <Suspense
      fallback={
        <div className="flex w-full flex-col overflow-x-hidden">
          <Navbar />
          <main className="flex-grow bg-[#FCFCFD]">
            <section className="border-b border-gray-100 bg-gradient-to-b from-[#F5F6F9] via-white to-white">
              <div className="mx-auto max-w-7xl px-5 pb-6 pt-[88px] sm:px-6 sm:pb-8 sm:pt-[96px] lg:px-8 lg:pb-8 lg:pt-[104px]">
                <Link
                  href="/universities"
                  className="mb-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-gray-400 sm:mb-6"
                >
                  <ArrowLeft size={14} />
                  Back to Universities
                </Link>
                <SearchFilterBar />
              </div>
            </section>
            <section className="bg-[#FCFCFD] px-5 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
              <div className="mx-auto max-w-7xl">
                <UniversityCardSkeleton />
              </div>
            </section>
          </main>
          <Footer />
        </div>
      }
    >
      <SearchResultsContent />
    </Suspense>
  )
}
