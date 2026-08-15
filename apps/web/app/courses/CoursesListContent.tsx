'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Search, MapPin, Clock, GraduationCap, Award, ChevronLeft, ChevronRight, BookOpen, ArrowRight } from 'lucide-react'

import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { trpc } from '@/lib/trpc-client'
import { formatCurrency } from '@/lib/utils'
import { FadeUp, FadeUpStagger, FadeUpItem } from '@/components/home/FadeUp'

const levelLabels: Record<string, string> = {
  UNDERGRADUATE: 'Undergraduate',
  POSTGRADUATE: 'Postgraduate',
  PHD: 'PhD',
  DIPLOMA: 'Diploma',
  CERTIFICATE: 'Certificate',
  FOUNDATION: 'Foundation',
}

const subjectAccents: Record<string, string> = {
  'Computer Science': '#C41E3A',
  'Business': '#A01830',
  'Engineering': '#8B0E1A',
  'Healthcare': '#991B1B',
  'Data Science': '#C41E3A',
  'Arts': '#A01830',
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
  initialSubjects: string[]
}

export default function CoursesListContent({ initialData, initialSubjects }: CoursesListContentProps) {
  const [page, setPage] = useState(initialData.page)

  const [search, setSearch] = useState('')
  const [subject, setSubject] = useState('')
  const [level, setLevel] = useState('')
  const [scholarship, setScholarship] = useState(false)

  const resultsRef = useRef<HTMLDivElement>(null)
  const prevPageRef = useRef(page)

  const isInitialQuery = page === initialData.page && !search && !subject && !level && !scholarship

  const { data, isLoading, isFetching } = trpc.course.list.useQuery(
    {
      query: search || undefined,
      subject: subject || undefined,
      level: level || undefined,
      hasScholarship: scholarship || undefined,
      page,
      perPage: 12,
    },
    {
      initialData: isInitialQuery ? initialData : undefined,
    }
  )

  const { data: subjects } = trpc.course.getSubjects.useQuery(undefined, {
    initialData: initialSubjects,
  })

  const syncUrl = (nextPage: number) => {
    const url = new URL(window.location.href)
    if (nextPage > 1) url.searchParams.set('page', String(nextPage))
    else url.searchParams.delete('page')
    window.history.replaceState(window.history.state, '', url.pathname + url.search)
  }

  const goToPage = (next: number) => {
    const clamped = Math.max(1, next)
    setPage(clamped)
    syncUrl(clamped)
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

  const displayData = data

  function getAccent(subj: string): string {
    for (const [key, color] of Object.entries(subjectAccents)) {
      if (subj.toLowerCase().includes(key.toLowerCase())) return color
    }
    return '#C41E3A'
  }

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
        {/* Filters + Results */}
        <section className="py-12 lg:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            {/* Filters */}
            <FadeUp>
              <div className="flex flex-wrap items-center gap-3">
                <select
                  aria-label="Filter by subject"
                  value={subject}
                  onChange={(e) => { setSubject(e.target.value); resetPage() }}
                  className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none transition-colors focus:border-[#C41E3A] focus:ring-2 focus:ring-[#C41E3A]/10"
                >
                  <option value="">All Subjects</option>
                  {subjects?.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>

                <select
                  aria-label="Filter by study level"
                  value={level}
                  onChange={(e) => { setLevel(e.target.value); resetPage() }}
                  className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none transition-colors focus:border-[#C41E3A] focus:ring-2 focus:ring-[#C41E3A]/10"
                >
                  <option value="">All Levels</option>
                  <option value="UNDERGRADUATE">Undergraduate</option>
                  <option value="POSTGRADUATE">Postgraduate</option>
                  <option value="PHD">PhD</option>
                  <option value="DIPLOMA">Diploma</option>
                  <option value="CERTIFICATE">Certificate</option>
                  <option value="FOUNDATION">Foundation</option>
                </select>

                <button
                  onClick={() => { setScholarship(!scholarship); resetPage() }}
                  className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition ${
                    scholarship
                      ? 'border-[#C41E3A] bg-[#C41E3A]/5 text-[#C41E3A]'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Award size={16} />
                  Scholarships
                </button>

                {displayData && (
                  <span className="ml-auto text-sm text-gray-500">
                    {displayData.total} course{displayData.total !== 1 ? 's' : ''} found
                  </span>
                )}
              </div>
            </FadeUp>

            {/* Results Grid */}
            <div ref={resultsRef} className="mt-8 scroll-mt-24">
              {isLoading ? (
                <FadeUpStagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" amount={0.08}>
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
                        onClick={() => { setSubject(s); setSearch(''); setLevel(''); setScholarship(false); resetPage() }}
                        className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:border-[#C41E3A] hover:bg-rose-50 hover:text-[#C41E3A]"
                      >
                        {s}
                      </button>
                    ))}
                    <button
                      onClick={() => { setSearch(''); setSubject(''); setLevel(''); setScholarship(false); resetPage() }}
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
                <FadeUpStagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" amount={0.08}>
                  {displayData?.hits.map((course) => {
                    const accent = getAccent(course.subject)
                    const courseUrl = course.universitySlug
                      ? `/institutions/${course.universitySlug}/${(course.level || 'postgraduate').toLowerCase()}/${course.slug}`
                      : `/courses/${course.slug}`
                    return (
                      <FadeUpItem key={course.id}>
                        <Link href={courseUrl}>
                          <article className="group relative h-full overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:border-gray-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                            {/* Top accent line */}
                            <div
                              className="h-[2px] w-full opacity-60 transition-opacity duration-300 group-hover:opacity-100"
                              style={{ background: `linear-gradient(to right, transparent, ${accent}, transparent)` }}
                            />

                            <div className="flex h-full flex-col p-6">
                              {/* Header */}
                              <div className="mb-4 flex items-start justify-between">
                                <span
                                  className="inline-flex items-center rounded-lg border px-2.5 py-1 text-[11px] font-bold"
                                  style={{
                                    borderColor: `${accent}20`,
                                    backgroundColor: `${accent}08`,
                                    color: accent,
                                  }}
                                >
                                  {levelLabels[course.level] ?? course.level}
                                </span>
                                {course.universityLogo && (
                                  <img
                                    src={course.universityLogo}
                                    alt={course.universityName ?? ''}
                                    className="h-9 w-9 rounded-lg object-contain"
                                  />
                                )}
                              </div>

                              {/* Content */}
                              <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#C41E3A] transition-colors">
                                {course.name}
                              </h3>
                              <p className="mt-1 text-sm font-medium text-gray-500">
                                {course.universityName}
                              </p>
                              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-500">
                                {course.description}
                              </p>

                              {/* Tags */}
                              <div className="mt-3 flex flex-wrap gap-1.5">
                                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                                  <Clock size={10} />
                                  {course.duration} {course.durationUnit?.toLowerCase()}
                                </span>
                                {course.universityCountry && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                                    <MapPin size={10} />
                                    {course.universityCountry}
                                  </span>
                                )}
                              </div>

                              {/* Footer */}
                              <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
                                <div>
                                  <span className="text-base font-bold text-gray-900">
                                    {formatCurrency(course.tuitionFee, course.currency)}
                                  </span>
                                  <span className="text-xs text-gray-400"> / year</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {course.hasScholarship && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-semibold text-green-700">
                                      <Award size={10} />
                                      Scholarship
                                    </span>
                                  )}
                                  <span
                                    className="inline-flex items-center gap-1 text-sm font-semibold transition-all group-hover:gap-2"
                                    style={{ color: accent }}
                                  >
                                    View
                                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                                  </span>
                                </div>
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
        </section>
      </main>

      <Footer />
    </div>
  )
}
