'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, MapPin, Clock, GraduationCap, Award, ChevronLeft, ChevronRight } from 'lucide-react'

import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { trpc } from '@/lib/trpc-client'
import { formatCurrency } from '@/lib/utils'

const levelLabels: Record<string, string> = {
  UNDERGRADUATE: 'Undergraduate',
  POSTGRADUATE: 'Postgraduate',
  PHD: 'PhD',
  DIPLOMA: 'Diploma',
  CERTIFICATE: 'Certificate',
  FOUNDATION: 'Foundation',
}

export default function CoursesPage() {
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
  })

  const { data: subjects } = trpc.course.getSubjects.useQuery()

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-gray-900">
      <div className="sticky top-0 z-40">
        <Navbar />
      </div>

      <main className="flex-grow">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#C41E3A] to-red-700 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Find Your Perfect Course
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
                Browse thousands of programs from partner universities worldwide
              </p>
            </div>

            {/* Search Bar */}
            <div className="mx-auto mt-8 max-w-3xl">
              <div className="flex items-center gap-2 rounded-2xl bg-white p-2 shadow-xl">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search courses, subjects..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                    className="h-12 w-full rounded-xl border-0 bg-gray-50 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#C41E3A]/20"
                  />
                </div>
                <Button
                  onClick={() => setPage(1)}
                  className="h-12 rounded-xl px-6"
                >
                  Search
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Filters + Results */}
        <section className="py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={subject}
                onChange={(e) => { setSubject(e.target.value); setPage(1) }}
                className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-[#C41E3A]"
              >
                <option value="">All Subjects</option>
                {subjects?.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              <select
                value={level}
                onChange={(e) => { setLevel(e.target.value); setPage(1) }}
                className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-[#C41E3A]"
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
                className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                  scholarship
                    ? 'border-[#C41E3A] bg-rose-50 text-[#C41E3A]'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Award size={16} />
                Scholarships
              </button>

              {data && (
                <span className="ml-auto text-sm text-gray-500">
                  {data.total} course{data.total !== 1 ? 's' : ''} found
                </span>
              )}
            </div>

            {/* Results Grid */}
            <div className="mt-8">
              {isLoading ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="animate-pulse rounded-lg border border-gray-100 bg-white p-5">
                      <div className="h-4 w-3/4 rounded bg-gray-200" />
                      <div className="mt-3 h-3 w-1/2 rounded bg-gray-200" />
                      <div className="mt-4 h-20 rounded bg-gray-100" />
                      <div className="mt-4 flex gap-2">
                        <div className="h-8 w-20 rounded-full bg-gray-200" />
                        <div className="h-8 w-24 rounded-full bg-gray-200" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : data?.hits.length === 0 ? (
                <div className="py-20 text-center">
                  <GraduationCap className="mx-auto h-16 w-16 text-gray-300" />
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">No courses found</h3>
                  <p className="mt-2 text-sm text-gray-500">Try adjusting your filters or search terms</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {data?.hits.map((course) => (
                    <Link
                      key={course.id}
                      href={`/courses/${course.slug}`}
                      className="group rounded-lg border border-gray-100 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition-all hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(15,23,42,0.1)]"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#C41E3A] transition-colors">
                            {course.name}
                          </h3>
                          <p className="mt-1 text-sm font-medium text-gray-500">
                            {course.universityName}
                          </p>
                        </div>
                        {course.universityLogo && (
                          <img
                            src={course.universityLogo}
                            alt={course.universityName ?? ''}
                            className="h-10 w-10 rounded-lg object-contain"
                          />
                        )}
                      </div>

                      <p className="mt-3 line-clamp-2 text-sm text-gray-600">
                        {course.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-[#C41E3A]">
                          <GraduationCap size={12} />
                          {levelLabels[course.level] ?? course.level}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                          <Clock size={12} />
                          {course.duration} {course.durationUnit?.toLowerCase()}
                        </span>
                        {course.universityCountry && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                            <MapPin size={12} />
                            {course.universityCountry}
                          </span>
                        )}
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                        <div>
                          <span className="text-lg font-bold text-gray-900">
                            {formatCurrency(course.tuitionFee, course.currency)}
                          </span>
                          <span className="text-xs text-gray-500"> / year</span>
                        </div>
                        {course.hasScholarship && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                            <Award size={12} />
                            Scholarship
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            {data && data.totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft size={16} />
                </Button>
                {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
                  const start = Math.max(1, Math.min(page - 2, data.totalPages - 4))
                  const p = start + i
                  if (p > data.totalPages) return null
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
                  onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                  disabled={page === data.totalPages}
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
