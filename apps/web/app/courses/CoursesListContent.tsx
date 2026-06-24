'use client'

import { useState } from 'react'
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
  'Computer Science': '#3b82f6',
  'Business': '#f59e0b',
  'Engineering': '#10b981',
  'Healthcare': '#ef4444',
  'Data Science': '#8b5cf6',
  'Arts': '#ec4899',
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
  const [search, setSearch] = useState('')
  const [subject, setSubject] = useState('')
  const [level, setLevel] = useState('')
  const [scholarship, setScholarship] = useState(false)
  const [page, setPage] = useState(1)

  const { data, isLoading } = trpc.course.list.useQuery({
    query: search || undefined,
    subject: subject || undefined,
    level: level || undefined,
    hasScholarship: scholarship || undefined,
    page,
    perPage: 12,
  }, {
    initialData,
  })

  const { data: subjects } = trpc.course.getSubjects.useQuery(undefined, {
    initialData: initialSubjects,
  })

  const displayData = data ?? initialData

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
            <FadeUp delay={0.1}>
              <div className="mx-auto mt-8 max-w-3xl">
                <div className="relative rounded-full p-[1.5px] bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400">
                  <div className="flex items-center gap-3 rounded-full bg-white px-4 py-2 shadow-[0_2px_16px_rgba(0,0,0,0.06)] sm:px-5 sm:py-3">
                    <Search size={18} className="shrink-0 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search courses, subjects..."
                      value={search}
                      onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                      className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400 sm:text-[15px]"
                    />
                    <Button
                      onClick={() => setPage(1)}
                      className="shrink-0 rounded-full px-5 text-[13px]"
                    >
                      Search
                    </Button>
                  </div>
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
                  value={subject}
                  onChange={(e) => { setSubject(e.target.value); setPage(1) }}
                  className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none transition-colors focus:border-[#C41E3A] focus:ring-2 focus:ring-[#C41E3A]/10"
                >
                  <option value="">All Subjects</option>
                  {subjects?.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>

                <select
                  value={level}
                  onChange={(e) => { setLevel(e.target.value); setPage(1) }}
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
                  onClick={() => { setScholarship(!scholarship); setPage(1) }}
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
            <div className="mt-8">
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
                <div className="py-20 text-center">
                  <GraduationCap className="mx-auto h-16 w-16 text-gray-300" />
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">No courses found</h3>
                  <p className="mt-2 text-sm text-gray-500">Try adjusting your filters or search terms</p>
                </div>
              ) : (
                <FadeUpStagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" amount={0.08}>
                  {displayData?.hits.map((course) => {
                    const accent = getAccent(course.subject)
                    return (
                      <FadeUpItem key={course.id}>
                        <Link href={`/courses/${course.slug}`}>
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
                <div className="mt-10 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  {Array.from({ length: Math.min(5, displayData.totalPages) }, (_, i) => {
                    const start = Math.max(1, Math.min(page - 2, displayData.totalPages - 4))
                    const p = start + i
                    if (p > displayData.totalPages) return null
                    return (
                      <Button
                        key={p}
                        variant={p === page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </Button>
                    )
                  })}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(displayData.totalPages, p + 1))}
                    disabled={page === displayData.totalPages}
                  >
                    <ChevronRight size={16} />
                  </Button>
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
