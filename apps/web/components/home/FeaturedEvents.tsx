'use client'

import { FadeUp, FadeUpItem, FadeUpStagger } from '@/components/home/FadeUp'
import { trpc } from '@/lib/trpc-client'
import { ArrowRight, CalendarDays, Globe, MapPin, Tag } from 'lucide-react'
import Link from 'next/link'

type EventCategory = 'WEBINAR' | 'WORKSHOP' | 'FAIR' | 'SEMINAR' | 'DEADLINE' | 'OTHER'

const CATEGORY_STYLES: Record<
  EventCategory,
  { bg: string; text: string; border: string; label: string }
> = {
  WEBINAR: { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe', label: 'Webinar' },
  WORKSHOP: { bg: '#f5f3ff', text: '#7c3aed', border: '#ddd6fe', label: 'Workshop' },
  FAIR: { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0', label: 'Education Fair' },
  SEMINAR: { bg: '#fffbeb', text: '#d97706', border: '#fde68a', label: 'Seminar' },
  DEADLINE: { bg: '#fef2f2', text: '#dc2626', border: '#fecaca', label: 'Deadline' },
  OTHER: { bg: '#f9fafb', text: '#4b5563', border: '#e5e7eb', label: 'Event' },
}

function formatEventDate(start: unknown, end: unknown): string {
  if (!start) return ''
  try {
    const s = new Date(start as string)
    const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }
    if (!end) return s.toLocaleDateString('en-US', opts)
    const e = new Date(end as string)
    if (s.toDateString() === e.toDateString()) return s.toLocaleDateString('en-US', opts)
    // Same month
    if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
      return `${s.getDate()}–${e.toLocaleDateString('en-US', opts)}`
    }
    return `${s.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} – ${e.toLocaleDateString('en-US', opts)}`
  } catch {
    return ''
  }
}

export default function FeaturedEvents() {
  const { data: events } = trpc.event.featured.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
  })

  if (!events?.length) return null

  return (
    <section className="py-16 sm:py-24" style={{ background: '#fff' }}>
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
        <FadeUp>
          <div className="mb-10 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <span className="mb-3 inline-block rounded-full bg-[#C41E3A]/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#C41E3A]">
                Upcoming Events
              </span>
              <h2 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-[#0E1116] sm:text-5xl">
                Featured <span style={{ color: '#C41E3A' }}>Events</span> &amp; News
              </h2>

              <p className="mt-5 text-base leading-relaxed text-[#4b5563] sm:text-lg">
                Stay updated with education fairs, webinars, scholarship deadlines and more.
              </p>
            </div>
            <Link
              href="/events"
              className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[#C41E3A] hover:text-[#A01830]"
            >
              View all events{' '}
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </FadeUp>

        <FadeUpStagger
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          amount={0.06}
        >
          {(events as any[]).map((event: any) => {
            const cat = (event.category as EventCategory) || 'OTHER'
            const style = CATEGORY_STYLES[cat] || CATEGORY_STYLES.OTHER
            const dateStr = formatEventDate(event.eventDate, event.eventEndDate)
            const isOnline = event.location?.toLowerCase().includes('online')

            return (
              <FadeUpItem key={event.slug}>
                <Link href={`/events/${event.slug}`}>
                  <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.13)]">
                    {/* Cover image */}
                    {event.coverImage ? (
                      <div className="relative h-44 shrink-0 overflow-hidden bg-gray-100">
                        <img
                          src={event.coverImage}
                          alt={event.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        {/* Category badge overlay */}
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
                      /* Gradient placeholder when no cover image */
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
                      {/* Date */}
                      {dateStr && (
                        <div className="mb-2 flex items-center gap-1.5 text-[11px] text-gray-500">
                          <CalendarDays size={11} className="shrink-0 text-[#C41E3A]" />
                          <span>{dateStr}</span>
                        </div>
                      )}

                      {/* Title */}
                      <h3
                        className="mb-2 line-clamp-2 text-base font-bold leading-snug text-gray-900 transition-colors group-hover:text-[#C41E3A]"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        {event.title}
                      </h3>

                      {/* Excerpt */}
                      {event.excerpt && (
                        <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-gray-500">
                          {event.excerpt}
                        </p>
                      )}

                      {/* Spacer */}
                      <div className="flex-1" />

                      {/* Footer */}
                      <div className="mt-2 flex items-center justify-between border-t border-gray-50 pt-3">
                        {/* Location */}
                        <div className="flex items-center gap-1 text-[11px] text-gray-400">
                          {event.location ? (
                            <>
                              {isOnline ? (
                                <Globe size={11} className="shrink-0" />
                              ) : (
                                <MapPin size={11} className="shrink-0" />
                              )}
                              <span className="max-w-[100px] truncate">{event.location}</span>
                            </>
                          ) : (
                            <span className="flex items-center gap-1">
                              <Tag size={11} />
                              {Array.isArray(event.tags) && event.tags[0] ? event.tags[0] : 'Event'}
                            </span>
                          )}
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#C41E3A] transition-all group-hover:gap-1.5">
                          Details{' '}
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
      </div>
    </section>
  )
}
