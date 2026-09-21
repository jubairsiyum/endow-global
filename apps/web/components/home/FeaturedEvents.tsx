'use client'

import Link from 'next/link'
import { ArrowRight, CalendarDays, MapPin, Globe, Tag } from 'lucide-react'
import { trpc } from '@/lib/trpc-client'
import { FadeUp, FadeUpStagger, FadeUpItem } from '@/components/home/FadeUp'

type EventCategory = 'WEBINAR' | 'WORKSHOP' | 'FAIR' | 'SEMINAR' | 'DEADLINE' | 'OTHER'

const CATEGORY_STYLES: Record<EventCategory, { bg: string; text: string; border: string; label: string }> = {
  WEBINAR:  { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe', label: 'Webinar' },
  WORKSHOP: { bg: '#f5f3ff', text: '#7c3aed', border: '#ddd6fe', label: 'Workshop' },
  FAIR:     { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0', label: 'Education Fair' },
  SEMINAR:  { bg: '#fffbeb', text: '#d97706', border: '#fde68a', label: 'Seminar' },
  DEADLINE: { bg: '#fef2f2', text: '#dc2626', border: '#fecaca', label: 'Deadline' },
  OTHER:    { bg: '#f9fafb', text: '#4b5563', border: '#e5e7eb', label: 'Event' },
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
  } catch { return '' }
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
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-10">
            <div>
              <span
                className="text-[11px] uppercase tracking-[0.1em] mb-3 block font-semibold text-[#C41E3A]"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                Upcoming Events
              </span>
              <h2
                className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Featured <span className="text-[#C41E3A]">Events</span> &amp; News
              </h2>
              <p className="mt-2 text-sm text-gray-500 max-w-md">
                Stay updated with education fairs, webinars, scholarship deadlines and more.
              </p>
            </div>
            <Link
              href="/events"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#C41E3A] hover:text-[#A01830] shrink-0"
            >
              View all events <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </FadeUp>

        <FadeUpStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5" amount={0.06}>
          {(events as any[]).map((event: any) => {
            const cat = (event.category as EventCategory) || 'OTHER'
            const style = CATEGORY_STYLES[cat] || CATEGORY_STYLES.OTHER
            const dateStr = formatEventDate(event.eventDate, event.eventEndDate)
            const isOnline = event.location?.toLowerCase().includes('online')

            return (
              <FadeUpItem key={event.slug}>
                <Link href={`/events/${event.slug}`}>
                  <article className="group relative flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.13)] hover:-translate-y-1 h-full">

                    {/* Cover image */}
                    {event.coverImage ? (
                      <div className="relative h-44 overflow-hidden bg-gray-100 shrink-0">
                        <img
                          src={event.coverImage}
                          alt={event.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        {/* Category badge overlay */}
                        <div className="absolute top-3 left-3">
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
                        className="relative h-28 shrink-0 flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${style.bg} 0%, ${style.border}40 100%)`,
                        }}
                      >
                        <CalendarDays size={32} style={{ color: style.text, opacity: 0.3 }} />
                        <div className="absolute top-3 left-3">
                          <span
                            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold"
                            style={{ background: style.bg, color: style.text, border: `1px solid ${style.border}` }}
                          >
                            {style.label}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col flex-1 p-5">
                      {/* Date */}
                      {dateStr && (
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-2">
                          <CalendarDays size={11} className="shrink-0 text-[#C41E3A]" />
                          <span>{dateStr}</span>
                        </div>
                      )}

                      {/* Title */}
                      <h3
                        className="text-base font-bold text-gray-900 leading-snug mb-2 group-hover:text-[#C41E3A] transition-colors line-clamp-2"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        {event.title}
                      </h3>

                      {/* Excerpt */}
                      {event.excerpt && (
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">
                          {event.excerpt}
                        </p>
                      )}

                      {/* Spacer */}
                      <div className="flex-1" />

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-2">
                        {/* Location */}
                        <div className="flex items-center gap-1 text-[11px] text-gray-400">
                          {event.location ? (
                            <>
                              {isOnline
                                ? <Globe size={11} className="shrink-0" />
                                : <MapPin size={11} className="shrink-0" />}
                              <span className="truncate max-w-[100px]">{event.location}</span>
                            </>
                          ) : (
                            <span className="flex items-center gap-1">
                              <Tag size={11} />
                              {Array.isArray(event.tags) && event.tags[0] ? event.tags[0] : 'Event'}
                            </span>
                          )}
                        </div>
                        <span
                          className="inline-flex items-center gap-1 text-xs font-semibold transition-all group-hover:gap-1.5 text-[#C41E3A]"
                        >
                          Details <ArrowRight size={11} className="transition-transform group-hover:translate-x-0.5" />
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
