'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CalendarDays, MapPin, Globe, Search, SlidersHorizontal } from 'lucide-react'
import { trpc } from '@/lib/trpc-client'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { FadeUp, FadeUpStagger, FadeUpItem } from '@/components/home/FadeUp'

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

const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string; label: string }> = {
  WEBINAR:  { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe', label: 'Webinar' },
  WORKSHOP: { bg: '#f5f3ff', text: '#7c3aed', border: '#ddd6fe', label: 'Workshop' },
  FAIR:     { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0', label: 'Education Fair' },
  SEMINAR:  { bg: '#fffbeb', text: '#d97706', border: '#fde68a', label: 'Seminar' },
  DEADLINE: { bg: '#fef2f2', text: '#dc2626', border: '#fecaca', label: 'Deadline' },
  OTHER:    { bg: '#f9fafb', text: '#4b5563', border: '#e5e7eb', label: 'Event' },
}

function formatDate(d: unknown): string {
  if (!d) return ''
  try {
    return new Date(d as string).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch { return '' }
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
        <section
          className="relative py-20 sm:py-28 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #C41E3A 0%, transparent 70%)' }} />
            <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full opacity-8" style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }} />
          </div>
          <div className="relative mx-auto max-w-[1180px] px-5 sm:px-8 text-center">
            <FadeUp>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/60 mb-6 backdrop-blur-sm">
                <CalendarDays size={12} />Events &amp; News
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Upcoming <span style={{ color: '#C41E3A' }}>Events</span>
              </h1>
              <p className="text-lg text-white/60 max-w-xl mx-auto">
                Education fairs, webinars, scholarship deadlines and more — stay in the loop.
              </p>
            </FadeUp>
          </div>
        </section>

        {/* Filters */}
        <section className="sticky top-0 z-30 border-b border-gray-100 bg-white/90 backdrop-blur-sm shadow-sm">
          <div className="mx-auto max-w-[1180px] px-5 sm:px-8 py-4 flex flex-col sm:flex-row gap-3 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => handleSearch(e.target.value)}
                placeholder="Search events…"
                className="w-full rounded-2xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition-all focus:border-[#C41E3A]"
              />
            </div>
            {/* Category pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-0.5 sm:pb-0">
              <SlidersHorizontal size={14} className="shrink-0 text-gray-400" />
              {CATEGORIES.map(c => (
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
              <p className="text-sm text-gray-500 mb-6">
                Showing <span className="font-semibold text-gray-900">{total}</span> event{total !== 1 ? 's' : ''}
              </p>
            )}

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
                    <div className="h-44 animate-pulse bg-gray-200" />
                    <div className="p-5 space-y-3">
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
                <p className="text-sm mt-1">Try a different filter or check back soon.</p>
              </div>
            ) : (
              <FadeUpStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" amount={0.06}>
                {events.map((event: any) => {
                  const cat = event.category || 'OTHER'
                  const style = CATEGORY_STYLES[cat] || CATEGORY_STYLES.OTHER
                  const isOnline = event.location?.toLowerCase().includes('online')

                  return (
                    <FadeUpItem key={event.slug}>
                      <Link href={`/events/${event.slug}`}>
                        <article className="group flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.13)] hover:-translate-y-1 h-full">
                          {/* Cover */}
                          {event.coverImage ? (
                            <div className="relative h-48 overflow-hidden bg-gray-100 shrink-0">
                              <img
                                src={event.coverImage}
                                alt={event.title}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                loading="lazy"
                              />
                              <div className="absolute top-3 left-3">
                                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold backdrop-blur-sm" style={{ background: style.bg, color: style.text, border: `1px solid ${style.border}` }}>
                                  {style.label}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="relative h-28 shrink-0 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${style.bg} 0%, ${style.border}40 100%)` }}>
                              <CalendarDays size={32} style={{ color: style.text, opacity: 0.3 }} />
                              <div className="absolute top-3 left-3">
                                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold" style={{ background: style.bg, color: style.text, border: `1px solid ${style.border}` }}>
                                  {style.label}
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="flex flex-col flex-1 p-5">
                            {event.eventDate && (
                              <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-2">
                                <CalendarDays size={11} className="text-[#C41E3A] shrink-0" />
                                <span>{formatDate(event.eventDate)}</span>
                              </div>
                            )}
                            <h2 className="text-base font-bold text-gray-900 leading-snug mb-2 group-hover:text-[#C41E3A] transition-colors line-clamp-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                              {event.title}
                            </h2>
                            {event.excerpt && (
                              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">{event.excerpt}</p>
                            )}
                            <div className="flex-1" />
                            <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-2">
                              <div className="flex items-center gap-1 text-[11px] text-gray-400">
                                {event.location && (
                                  <>
                                    {isOnline ? <Globe size={11} /> : <MapPin size={11} />}
                                    <span className="truncate max-w-[110px]">{event.location}</span>
                                  </>
                                )}
                              </div>
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#C41E3A] transition-all group-hover:gap-1.5">
                                Read more <ArrowRight size={11} className="transition-transform group-hover:translate-x-0.5" />
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
              <div className="flex items-center justify-center gap-3 mt-12">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
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
