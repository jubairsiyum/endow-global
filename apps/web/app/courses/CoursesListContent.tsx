'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Search, MapPin, Clock, GraduationCap, Award, ChevronLeft, ChevronRight, BookOpen, ArrowRight, SlidersHorizontal } from 'lucide-react'

import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { trpc } from '@/lib/trpc-client'
import { formatCurrency } from '@/lib/utils'
import { FadeUp, FadeUpStagger, FadeUpItem } from '@/components/home/FadeUp'
import { CourseFilters, FilterPanel } from './CourseFilters'
import { EMPTY_FILTERS, countActiveFilters, serializeFilters } from './filter-utils'
import type { CourseFilters as Filters } from './filter-utils'

const levelLabels: Record<string, string> = {
  UNDERGRADUATE: 'Undergraduate',
  POSTGRADUATE: 'Postgraduate',
  PHD: 'PhD',
  DIPLOMA: 'Diploma',
  CERTIFICATE: 'Certificate',
  FOUNDATION: 'Foundation',
}

function getPageItems(current: number, total: number): (number | '...')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const items: (number | '...')[] = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  if (start > 2) items.push('...')
  for (let i = start; i <= end; i++) items.push(i)
  if (end < total - 1) items.push('...')
  items.push(total)
  return items
}

type CourseListData = {
  hits: Array<{
    id: string
    name: string
    slug: string
    subject: string
    level: 'UNDERGRADUATE' | 'POSTGRADUATE' | 'PHD' | 'DIPLOMA' | 'CERTIFICATE' | 'FOUNDATION'
    duration: number
    durationUnit: string
    tuitionFee: number
    currency: string
    language: string
    hasScholarship: boolean
    scholarshipDetails: string | null
    description: string
    universityId: string
    universityName: string | null
    universitySlug: string | null
    universityCountry: string | null
    universityCity: string | null
    universityLogo: string | null
  }>
  total: number
  page: number
  totalPages: number
}

type CoursesListContentProps = {
  initialData: CourseListData
  initialFilters?: Filters
}

export default function CoursesListContent({ initialData, initialFilters }: CoursesListContentProps) {
  const [page, setPage] = useState(initialData.page)

  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Filters>(initialFilters ?? EMPTY_FILTERS)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filtersTouched, setFiltersTouched] = useState(false)

  const resultsRef = useRef<HTMLDivElement>(null)
  const prevPageRef = useRef(page)

  const isInitialQuery = page === initialData.page && !search && !filtersTouched

  const { data, isLoading, isFetching } = trpc.course.list.useQuery(
    {
      query: search || undefined,
      countries: filters.countries.length ? filters.countries : undefined,
      cities: filters.cities.length ? filters.cities : undefined,
      institutionIds: filters.institutionIds.length ? filters.institutionIds : undefined,
      levels: filters.levels.length ? filters.levels : undefined,
      subjects: filters.subjects.length ? filters.subjects : undefined,
      expressOffer: filters.expressOffer || undefined,
      englishWaiver: filters.englishWaiver || undefined,
      durations: filters.durations.length ? filters.durations : undefined,
      startYears: filters.startYears.length ? filters.startYears : undefined,
      feeMin: filters.feeMin ?? undefined,
      feeMax: filters.feeMax ?? undefined,
      page,
      perPage: 12,
    },
    {
      initialData: isInitialQuery ? initialData : undefined,
    }
  )

  const { data: filterOptions } = trpc.course.getFilterOptions.useQuery(undefined)

  const syncUrl = (nextPage: number, nextFilters: Filters = filters) => {
    const params = serializeFilters(nextFilters)
    if (nextPage > 1) params.set('page', String(nextPage))
    const qs = params.toString()
    window.history.replaceState(window.history.state, '', `/courses${qs ? `?${qs}` : ''}`)
  }

  const goToPage = (next: number) => {
    const clamped = Math.max(1, next)
    setPage(clamped)
    syncUrl(clamped)
  }

  const updateFilters = (next: Filters) => {
    setFiltersTouched(true)
    setFilters(next)
    setPage(1)
    syncUrl(1, next)
  }

  const clearFilters = () => {
    setFiltersTouched(true)
    setFilters(EMPTY_FILTERS)
    setPage(1)
    syncUrl(1, EMPTY_FILTERS)
  }

  const resetPage = () => {
    if (page !== 1) {
      setPage(1)
      syncUrl(1)
    }
  }

  useEffect(() => {
    if (prevPageRef.current !== page) {
      prevPageRef.current = page
      const el = resultsRef.current
      if (!el) return
      const lenis = window.__lenis
      if (lenis && typeof lenis.scrollTo === 'function') {
        lenis.scrollTo(el, { offset: -96 })
      } else {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }, [page])

  const activeFilterCount = countActiveFilters(filters)
  const displayData = data

  return (
    <div className="w-full flex flex-col overflow-x-hidden">
      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 relative z-10">
          <div className="pt-4 pb-6 lg:pb-8">
            <Navbar />
          </div>

          <div className="py-16 lg:py-24">
            <FadeUp>
              <div className="text-center">
                <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-gray-500 shadow-sm">
                  <BookOpen size={13} />
                  Course Catalog
                </span>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                  Find Your <span className="text-[#C41E3A]">Perfect Course</span>
                </h1>
                <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-500 sm:text-lg">
                  Browse thousands of programs from partner universities worldwide
                </p>
              </div>
            </FadeUp>

            {/* Search Bar */}
            <FadeUp>
              <div className="mx-auto mt-8 max-w-3xl">
                <div className="flex items-center gap-3 rounded-full border border-[#C41E3A]/30 bg-white px-4 py-2 sm:px-5 sm:py-2.5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] transition-colors focus-within:border-[#C41E3A] focus-within:ring-2 focus-within:ring-[#C41E3A]/10">
                  <Search size={18} className="shrink-0 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search courses, subjects..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); resetPage() }}
                    className="w-full border-0 border-none bg-transparent p-0 text-sm text-gray-700 outline-none shadow-none focus:border-none focus:outline-none focus:ring-0 placeholder:text-gray-400 sm:text-[15px]"
                  />
                  <Button
                    onClick={() => resetPage()}
                    className="shrink-0 rounded-full bg-[#C41E3A] px-5 text-[13px] hover:bg-[#A01830]"
                  >
                    Search
                  </Button>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      <main className="flex-grow bg-gray-50">
        {/* Filters (sidebar) + Results */}
        <section className="py-8 lg:py-12">
          <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start lg:gap-8">
              {/* Filters sidebar (desktop) */}
              <aside className="sticky top-24 hidden lg:block">
                <div className="flex max-h-[calc(100vh-6rem)] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                  <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-4 py-3">
                    <h3 className="text-base font-bold text-gray-900">Filters</h3>
                    {activeFilterCount > 0 && (
                      <button
                        onClick={clearFilters}
                        className="text-sm font-medium text-[#C41E3A] transition-colors hover:underline"
                      >
                        Reset all
                      </button>
                    )}
                  </div>
                  <div data-lenis-prevent className="filter-scroll min-h-0 flex-1 overflow-y-auto px-4 py-2">
                    <FilterPanel
                      filters={filters}
                      onChange={updateFilters}
                      options={
                        filterOptions ?? {
                          countries: [],
                          cities: [],
                          institutions: [],
                          subjects: [],
                          levels: [],
                          startYears: [],
                          feeMax: 0,
                        }
                      }
                    />
                  </div>
                </div>
              </aside>

              {/* Results */}
              <div className="min-w-0">
                {/* Toolbar */}
                <div className="mb-5 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setFiltersOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:border-[#C41E3A]/30 hover:bg-rose-50/50 hover:text-[#C41E3A] lg:hidden"
                  >
                    <SlidersHorizontal size={16} />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-[#C41E3A] to-[#A01830] px-1.5 text-[11px] font-bold text-white">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>

                  {displayData && (
                    <span className="ml-auto text-sm text-gray-500">
                      {displayData.total} course{displayData.total !== 1 ? 's' : ''} found
                    </span>
                  )}
                </div>

            {/* Results Grid */}
            <div ref={resultsRef} className="scroll-mt-24">
              {isLoading ? (
                <FadeUpStagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3" amount={0.08}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <FadeUpItem key={i}>
                      <div className="animate-pulse overflow-hidden rounded-2xl border border-gray-100 bg-white">
                        <div className="h-[2px] w-full bg-gray-200" />
                        <div className="p-6">
                          <div className="h-4 w-3/4 rounded-lg bg-gray-200" />
                          <div className="mt-3 h-3 w-1/2 rounded-lg bg-gray-200" />
                          <div className="mt-4 h-16 rounded-lg bg-gray-100" />
                          <div className="mt-5 flex gap-2">
                            <div className="h-7 w-20 rounded-full bg-gray-200" />
                            <div className="h-7 w-24 rounded-full bg-gray-200" />
                          </div>
                        </div>
                      </div>
                    </FadeUpItem>
                  ))}
                </FadeUpStagger>
              ) : displayData?.hits.length === 0 ? (
                <div className="mx-auto max-w-xl rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-[#C41E3A]">
                    <GraduationCap className="h-8 w-8" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-gray-900">No courses match your criteria</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Try adjusting your filters or explore our popular study subjects below.
                  </p>

                  <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                    {['Computer Science', 'Business', 'Engineering', 'Healthcare'].map((s) => (
                      <button
                        key={s}
                        onClick={() => { setSearch(''); updateFilters({ ...filters, subjects: [s] }) }}
                        className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:border-[#C41E3A] hover:bg-rose-50 hover:text-[#C41E3A]"
                      >
                        {s}
                      </button>
                    ))}
                    <button
                      onClick={() => { setSearch(''); clearFilters() }}
                      className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-200"
                    >
                      Clear All Filters
                    </button>
                  </div>

                  <div className="mt-8 rounded-2xl border border-rose-100 bg-rose-50/50 p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#C41E3A]">Need Direct Assistance?</p>
                    <p className="mt-1 text-sm font-medium text-gray-800">Our advisors can find & match courses directly for you in South Korea & Australia.</p>
                    <Link
                      href="/register"
                      className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#C41E3A] px-5 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#A01830]"
                    >
                      Get Free Course Matching <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              ) : (
                <FadeUpStagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3" amount={0.08}>
                  {displayData?.hits.map((course) => {
                    const courseUrl = course.universitySlug
                      ? `/institutions/${course.universitySlug}/${(course.level || 'postgraduate').toLowerCase()}/${course.slug}`
                      : `/courses/${course.slug}`
                    return (
                      <FadeUpItem key={course.id}>
                        <Link href={courseUrl} className="block h-full">
                          <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C41E3A]/25 hover:shadow-[0_12px_40px_rgba(196,30,58,0.08)]">
                            {/* Header: logo + university + level */}
                            <div className="flex items-start gap-3 border-b border-gray-100 p-4 sm:p-5">
                              {course.universityLogo ? (
                                <img
                                  src={course.universityLogo}
                                  alt={course.universityName ?? ''}
                                  className="h-12 w-12 shrink-0 rounded-xl border border-gray-100 bg-white object-contain p-1"
                                />
                              ) : (
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-base font-bold text-gray-400">
                                  {(course.universityName ?? 'U').charAt(0)}
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-gray-900">{course.universityName}</p>
                                <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                                  <MapPin size={11} className="shrink-0" />
                                  <span className="truncate">
                                    {course.universityCity ? `${course.universityCity}, ` : ''}
                                    {course.universityCountry}
                                  </span>
                                </p>
                              </div>
                              <span className="shrink-0 rounded-md bg-[#C41E3A]/[0.07] px-2 py-1 text-[11px] font-bold text-[#C41E3A]">
                                {levelLabels[course.level] ?? course.level}
                              </span>
                            </div>

                            {/* Body */}
                            <div className="flex flex-1 flex-col p-4 sm:p-5">
                              <h3 className="line-clamp-2 text-base font-bold leading-snug text-gray-900 transition-colors group-hover:text-[#C41E3A]">
                                {course.name}
                              </h3>

                              <div className="mt-3 flex flex-wrap gap-1.5">
                                <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-[11px] font-medium text-gray-600">
                                  <Clock size={11} />
                                  {course.duration} {course.durationUnit?.toLowerCase()}
                                </span>
                                {course.language && (
                                  <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-[11px] font-medium text-gray-600">
                                    {course.language}
                                  </span>
                                )}
                              </div>

                              <div className="my-4 border-t border-dashed border-gray-200" />

                              <div className="flex items-end justify-between gap-3">
                                <div>
                                  <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">Annual Tuition</p>
                                  <p className="mt-0.5 text-lg font-bold text-gray-900">
                                    {formatCurrency(course.tuitionFee, course.currency)}
                                  </p>
                                </div>
                                {course.hasScholarship && (
                                  <span className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2 py-1 text-[11px] font-semibold text-green-700">
                                    <Award size={11} />
                                    Scholarship
                                  </span>
                                )}
                              </div>

                              <div className="mt-4">
                                <span className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#C41E3A]/25 bg-[#C41E3A]/[0.05] py-2 text-sm font-semibold text-[#C41E3A] transition-colors group-hover:border-transparent group-hover:bg-gradient-to-r group-hover:from-[#C41E3A] group-hover:to-[#A01830] group-hover:text-white">
                                  View Details
                                  <ArrowRight size={14} />
                                </span>
                              </div>
                            </div>
                          </article>
                        </Link>
                      </FadeUpItem>
                    )
                  })}
                </FadeUpStagger>
              )}
            </div>

            {/* Pagination */}
            {displayData && displayData.totalPages > 1 && (
              <FadeUp>
                <div className="mt-12 flex flex-col items-center gap-3">
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(page - 1)}
                      disabled={page === 1 || isFetching}
                      aria-label="Previous page"
                    >
                      <ChevronLeft size={16} />
                    </Button>

                    {getPageItems(page, displayData.totalPages).map((item, index) =>
                      item === '...' ? (
                        <span key={`ellipsis-${index}`} className="px-1.5 text-sm font-medium text-gray-400">
                          …
                        </span>
                      ) : (
                        <Button
                          key={item}
                          variant={item === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => goToPage(item)}
                          disabled={isFetching}
                          aria-current={item === page ? 'page' : undefined}
                        >
                          {item}
                        </Button>
                      )
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(page + 1)}
                      disabled={page === displayData.totalPages || isFetching}
                      aria-label="Next page"
                    >
                      <ChevronRight size={16} />
                    </Button>
                  </div>

                  <p className="text-sm text-gray-500">
                    Page {page} of {displayData.totalPages}
                    {isFetching && <span className="ml-2 text-[#C41E3A]">Loading…</span>}
                  </p>
                </div>
              </FadeUp>
            )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <CourseFilters
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        onChange={updateFilters}
        onClear={clearFilters}
        options={filterOptions ?? { countries: [], cities: [], institutions: [], subjects: [], levels: [], startYears: [], feeMax: 0 }}
        resultsCount={displayData?.total ?? 0}
      />

      <Footer />
    </div>
  )
}
