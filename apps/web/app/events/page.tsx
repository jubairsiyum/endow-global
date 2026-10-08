'use client'

import { FadeUp, FadeUpItem, FadeUpStagger } from '@/components/home/FadeUp'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { trpc } from '@/lib/trpc-client'
import { motion } from 'framer-motion'

import { ArrowRight, CalendarDays, Globe, MapPin, Search, SlidersHorizontal } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

type EventCategory = 'WEBINAR' | 'WORKSHOP' | 'FAIR' | 'SEMINAR' | 'DEADLINE' | 'OTHER'

const CATEGORIES: { value: EventCategory | ''; label: string }[] = [
  { value: '', label: 'All Events' },
  { value: 'WEBINAR', label: 'Webinars' },
  { value: 'WORKSHOP', label: 'Workshops' },
  { value: 'FAIR', label: 'Education Fairs' },
  { value: 'SEMINAR', label: 'Seminars' },
  { value: 'DEADLINE', label: 'Deadlines' },
  { value: 'OTHER', label: 'Other' },
]

const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string; label: string }> =
  {
    WEBINAR: { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe', label: 'Webinar' },
    WORKSHOP: { bg: '#f5f3ff', text: '#7c3aed', border: '#ddd6fe', label: 'Workshop' },
    FAIR: { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0', label: 'Education Fair' },
    SEMINAR: { bg: '#fffbeb', text: '#d97706', border: '#fde68a', label: 'Seminar' },
    DEADLINE: { bg: '#fef2f2', text: '#dc2626', border: '#fecaca', label: 'Deadline' },
    OTHER: { bg: '#f9fafb', text: '#4b5563', border: '#e5e7eb', label: 'Event' },
  }

function formatDate(d: unknown): string {
  if (!d) return ''
  try {
    return new Date(d as string).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return ''
  }
}

export default function EventsPage() {
  const [category, setCategory] = useState<EventCategory | ''>('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = trpc.event.list.useQuery(
    { page, perPage: 9, category: category || undefined, search: search.trim() || undefined },
    { staleTime: 2 * 60 * 1000 }
  )

  const events = (data as any)?.events || []
  const totalPages = (data as any)?.totalPages || 1
  const total = (data as any)?.total || 0

  function handleSearch(val: string) {
    setSearch(val)
    setPage(1)
  }

  function handleCategory(val: EventCategory | '') {
    setCategory(val)
    setPage(1)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero */}
        <section className="relative overflow-hidden bg-[#0b0f19] py-24 sm:py-32">
          {/* Background Glow Effects */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div
              className="absolute -right-40 -top-40 h-[550px] w-[550px] rounded-full opacity-40 blur-3xl"
              style={{
                background: 'radial-gradient(circle, rgba(196,30,58,0.35) 0%, transparent 70%)',
              }}
            />
            <div
              className="absolute -bottom-32 -left-32 h-[550px] w-[550px] rounded-full opacity-30 blur-3xl"
              style={{
                background: 'radial-gradient(circle, rgba(196,30,58,0.35) 0%, transparent 70%)',
              }}
            />
            {/* Subtle Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
          </div>

          <div className="relative mx-auto max-w-[1180px] px-5 text-center sm:px-8">
            <FadeUp>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="inline-block"
              >
                <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/80 shadow-inner backdrop-blur-md">
                  <CalendarDays size={13} style={{ color: '#C41E3A' }} />
                  Events &amp; News
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-5 text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Upcoming{' '}
                <span className="bg-gradient-to-r from-[#C41E3A] to-[#df2342] bg-clip-text text-transparent">
                  Events
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mx-auto max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg"
              >
                Education fairs, interactive webinars, crucial scholarship deadlines, and global
                admissions updates — stay fully in the loop.
              </motion.p>
            </FadeUp>
          </div>
        </section>

        {/* Filters */}
        <section className="sticky top-16 z-30 border-b border-gray-100 bg-white shadow-sm sm:top-20">
          <div className="mx-auto flex max-w-[1180px] flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:px-8">
            {/* Search */}
            <div className="relative w-full sm:max-w-xs lg:w-80">
              <Search
                size={15}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search events…"
                className="w-full rounded-2xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition-all focus:border-[#C41E3A]"
              />
            </div>
            {/* Category pills */}
            <div className="scrollbar-none flex w-full items-center gap-2 overflow-x-auto pb-1 sm:w-auto sm:pb-0">
              <SlidersHorizontal size={14} className="shrink-0 text-gray-400" />
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  onClick={() => handleCategory(c.value)}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    category === c.value
                      ? 'bg-[#C41E3A] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="py-14" style={{ background: '#F8F9FB' }}>
          <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
            {total > 0 && (
              <p className="mb-6 text-sm text-gray-500">
                Showing <span className="font-semibold text-gray-900">{total}</span> event
                {total !== 1 ? 's' : ''}
              </p>
            )}

            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="overflow-hidden rounded-2xl border border-gray-100 bg-white"
                    >
                      <div className="h-44 animate-pulse bg-gray-200" />
                      <div className="space-y-3 p-5">
                        <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                        <div className="h-5 w-full animate-pulse rounded bg-gray-200" />
                        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                      </div>
                    </div>
                  ))}
              </div>
            ) : !events.length ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <CalendarDays size={56} className="mb-4 opacity-30" />
                <p className="text-xl font-semibold text-gray-500">No events found</p>
                <p className="mt-1 text-sm">Try a different filter or check back soon.</p>
              </div>
            ) : (
              <FadeUpStagger
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                amount={0.06}
              >
                {events.map((event: any) => {
                  const cat = event.category || 'OTHER'
                  const style = CATEGORY_STYLES[cat] || CATEGORY_STYLES.OTHER
                  const isOnline = event.location?.toLowerCase().includes('online')

                  return (
                    <FadeUpItem key={event.slug}>
                      <Link href={`/events/${event.slug}`}>
                        <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.13)]">
                          {/* Cover */}
                          {event.coverImage ? (
                            <div className="relative h-48 shrink-0 overflow-hidden bg-gray-100">
                              <img
                                src={event.coverImage}
                                alt={event.title}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                loading="lazy"
                              />
                              <div className="absolute left-3 top-3">
                                <span
                                  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold backdrop-blur-sm"
                                  style={{
                                    background: style.bg,
                                    color: style.text,
                                    border: `1px solid ${style.border}`,
                                  }}
                                >
                                  {style.label}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div
                              className="relative flex h-28 shrink-0 items-center justify-center"
                              style={{
                                background: `linear-gradient(135deg, ${style.bg} 0%, ${style.border}40 100%)`,
                              }}
                            >
                              <CalendarDays size={32} style={{ color: style.text, opacity: 0.3 }} />
                              <div className="absolute left-3 top-3">
                                <span
                                  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold"
                                  style={{
                                    background: style.bg,
                                    color: style.text,
                                    border: `1px solid ${style.border}`,
                                  }}
                                >
                                  {style.label}
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="flex flex-1 flex-col p-5">
                            {event.eventDate && (
                              <div className="mb-2 flex items-center gap-1.5 text-[11px] text-gray-500">
                                <CalendarDays size={11} className="shrink-0 text-[#C41E3A]" />
                                <span>{formatDate(event.eventDate)}</span>
                              </div>
                            )}
                            <h2
                              className="mb-2 line-clamp-2 text-base font-bold leading-snug text-gray-900 transition-colors group-hover:text-[#C41E3A]"
                              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                            >
                              {event.title}
                            </h2>
                            {event.excerpt && (
                              <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-gray-500">
                                {event.excerpt}
                              </p>
                            )}
                            <div className="flex-1" />
                            <div className="mt-2 flex items-center justify-between border-t border-gray-50 pt-3">
                              <div className="flex items-center gap-1 text-[11px] text-gray-400">
                                {event.location && (
                                  <>
                                    {isOnline ? <Globe size={11} /> : <MapPin size={11} />}
                                    <span className="max-w-[110px] truncate">{event.location}</span>
                                  </>
                                )}
                              </div>
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#C41E3A] transition-all group-hover:gap-1.5">
                                Read more{' '}
                                <ArrowRight
                                  size={11}
                                  className="transition-transform group-hover:translate-x-0.5"
                                />
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-3">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-500">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
