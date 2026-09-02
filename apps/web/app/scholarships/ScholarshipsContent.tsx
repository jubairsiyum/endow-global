'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, CalendarDays, MapPin, Search, Award } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { trpc } from '@/lib/trpc-client'

const fallbackUniversityImage = '/universities/Hanseo University.png'

const COVERAGE_LABEL: Record<string, string> = {
  full: 'Full tuition coverage',
  partial: 'Partial tuition coverage',
  tuition_only: 'Tuition coverage',
  living_only: 'Living cost coverage',
}

const COVERAGE_HEADLINE: Record<string, string> = {
  full: 'Full',
  partial: 'Partial',
  tuition_only: 'Tuition',
  living_only: 'Living',
}

function formatDeadline(d: string | Date | null | undefined): string {
  if (!d) return 'Rolling'
  const date = typeof d === 'string' ? new Date(d) : d
  if (Number.isNaN(date.getTime())) return 'Rolling'
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function countryToSlug(country: string | null): string | null {
  if (!country) return null
  return country.trim().toLowerCase().replace(/\s+/g, '-')
}

export default function ScholarshipsContent() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const perPage = 6

  const { data, isLoading } = trpc.scholarship.list.useQuery({
    page,
    perPage,
    search: debouncedSearch || undefined,
  })

  const items = data?.items ?? []
  const totalPages = data?.totalPages ?? 1
  const total = data?.total ?? 0

  const handleSearch = (value: string) => {
    setSearch(value)
    // debounce 400ms
    setTimeout(() => {
      setDebouncedSearch(value)
      setPage(1)
    }, 400)
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FCFCFD]">
      <Navbar />
      <main className="flex-grow">
        {/* Header */}
        <section className="border-b border-gray-100 bg-gradient-to-b from-[#FCFCFD] via-white to-[#F8FAFC] px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-7xl text-center">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#C41E3A] shadow-sm">
              Scholarships
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl lg:text-5xl">
              All Scholarship <span className="text-[#C41E3A]">Opportunities</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-500">
              Browse all exclusive scholarships from our partner universities. Find the right coverage for your academic journey.
            </p>

            {/* Search */}
            <div className="mx-auto mt-8 max-w-xl">
              <div className="relative">
                <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search scholarships or universities..."
                  className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-5 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-[#C41E3A]/30 focus:ring-4 focus:ring-[#C41E3A]/10"
                />
              </div>
            </div>

            {total > 0 && (
              <p className="mt-4 text-sm text-gray-400">
                Showing {items.length} of {total} scholarships
              </p>
            )}
          </div>
        </section>

        {/* Grid */}
        <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="min-h-[240px] animate-pulse rounded-[24px] border border-slate-200/70 bg-white" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
              <Award size={48} className="mx-auto mb-3 text-slate-300" />
              <p className="text-sm font-medium text-slate-500">No scholarships found.</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
                {debouncedSearch ? `No results for "${debouncedSearch}". Try a different search term.` : 'New opportunities will appear here once added by the admin team.'}
              </p>
              {debouncedSearch && (
                <button
                  onClick={() => {
                    setSearch('')
                    setDebouncedSearch('')
                    setPage(1)
                  }}
                  className="mt-4 text-sm font-medium text-[#C41E3A] hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => {
                  const coverage = COVERAGE_LABEL[item.coverageType] ?? 'Scholarship coverage'
                  const headline =
                    item.amount != null ? `${item.currencySymbol}${Number(item.amount).toLocaleString()}` : COVERAGE_HEADLINE[item.coverageType] ?? 'Scholarship'
                  const deadlineLabel = formatDeadline(item.deadline as unknown as string | Date | null)

                  const getHref = () => {
                    if (item.linkUrl) return item.linkUrl
                    if (item.universityWebsite) return item.universityWebsite
                    const countrySlug = countryToSlug(item.country)
                    if (item.universitySlug && countrySlug) return `/universities/${countrySlug}/${item.universitySlug}`
                    return '/universities'
                  }
                  const href = getHref()
                  const isExternal = Boolean(item.linkUrl || item.universityWebsite)
                  const CardWrapper = isExternal ? 'a' : Link as unknown as typeof Link
                  const cardProps = isExternal
                    ? { href, target: '_blank' as const, rel: 'noopener noreferrer' as const }
                    : { href }

                  return (
                    <motion.article
                      key={item.id}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4 }}
                      className="group relative flex min-h-[240px] flex-col overflow-hidden rounded-[24px] border border-slate-200/70 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition-all duration-300 hover:border-[#C41E3A]/20 hover:shadow-[0_20px_60px_rgba(196,30,58,0.10)]"
                    >
                      <Link href={href} target={isExternal ? '_blank' : undefined} rel={isExternal ? 'noopener noreferrer' : undefined} aria-label={`View ${item.name} at ${item.universityName ?? 'University'}`} className="absolute inset-0 z-30" />

                      <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#C41E3A]/10 blur-3xl opacity-0 transition-all duration-700 group-hover:opacity-100" />
                      <div className="pointer-events-none absolute right-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#F1D5DB] bg-[#FAF1F3] transition-all duration-500 group-hover:scale-110 group-hover:border-[#C41E3A] group-hover:bg-[#C41E3A]">
                        <ArrowRight className="h-4 w-4 text-[#C41E3A] group-hover:text-white" />
                      </div>

                      <div className="relative z-10 mb-3 flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-100 bg-white shadow-sm">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.universityLogo || fallbackUniversityImage}
                            alt={`${item.universityName} logo`}
                            className="h-8 w-8 object-contain"
                            onError={(e) => {
                              ;(e.target as HTMLImageElement).src = fallbackUniversityImage
                            }}
                          />
                        </div>
                        <div className="min-w-0 flex-1 pt-0.5">
                          <h3 className="line-clamp-1 text-[17px] font-bold leading-6 text-[#111827]">{item.universityName || 'University'}</h3>
                          <p className="mt-1 flex items-center gap-1.5 text-[13px] font-semibold text-slate-500">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#C9A15B]" />
                            <span className="line-clamp-1">{item.country || 'International'}</span>
                          </p>
                        </div>
                      </div>

                      <div className="relative z-10 mb-4">
                        <h3 className="text-[42px] font-bold leading-none tracking-normal text-[#C41E3A]">{headline}</h3>
                        <p className="mt-2 text-sm text-slate-500">{coverage}</p>
                      </div>

                      <div className="relative z-10 mt-auto border-t border-slate-100 pt-4">
                        <p className="line-clamp-1 text-sm font-medium text-slate-500">{item.name}</p>
                        <div className="mt-3 flex items-center justify-between text-[13px] font-semibold text-slate-600">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-[#C9A15B]" />
                            {item.country || 'International'}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <CalendarDays className="h-3.5 w-3.5 text-[#C9A15B]" />
                            {deadlineLabel}
                          </span>
                        </div>
                      </div>
                    </motion.article>
                  )
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const p = i + 1
                      // Show first, last, current ±1, and ellipsis
                      if (totalPages > 7 && p !== 1 && p !== totalPages && Math.abs(p - page) > 1) {
                        if (p === 2 && page > 3) return <span key={p} className="px-1 text-gray-400">…</span>
                        if (p === totalPages - 1 && page < totalPages - 2) return <span key={p} className="px-1 text-gray-400">…</span>
                        if (p !== 2 && p !== totalPages - 1) return null
                      }
                      return (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`h-9 w-9 rounded-full text-sm font-semibold transition-colors ${p === page ? 'bg-[#C41E3A] text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
                        >
                          {p}
                        </button>
                      )
                    })}
                  </div>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}
