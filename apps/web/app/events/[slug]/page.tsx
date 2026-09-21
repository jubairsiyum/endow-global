import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CalendarDays, MapPin, Globe, ArrowLeft, ExternalLink, Tag, Eye } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { db } from '@endow/db'
import { schema } from '@endow/db'
import { eq as _eq, and as _and, sql as _sql } from 'drizzle-orm'

const eq = _eq as any
const and = _and as any
const sql = _sql as any

const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string; label: string }> = {
  WEBINAR:  { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe', label: 'Webinar' },
  WORKSHOP: { bg: '#f5f3ff', text: '#7c3aed', border: '#ddd6fe', label: 'Workshop' },
  FAIR:     { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0', label: 'Education Fair' },
  SEMINAR:  { bg: '#fffbeb', text: '#d97706', border: '#fde68a', label: 'Seminar' },
  DEADLINE: { bg: '#fef2f2', text: '#dc2626', border: '#fecaca', label: 'Deadline' },
  OTHER:    { bg: '#f9fafb', text: '#4b5563', border: '#e5e7eb', label: 'Event' },
}

function formatDate(d: unknown, opts?: Intl.DateTimeFormatOptions): string {
  if (!d) return ''
  try {
    return new Date(d as string).toLocaleDateString('en-US', opts ?? { day: 'numeric', month: 'long', year: 'numeric' })
  } catch { return '' }
}

async function getEvent(slug: string) {
  const event = await db
    .select()
    .from(schema.events)
    .where(and(eq(schema.events.slug, slug), eq(schema.events.isPublished, true)))
    .limit(1)
    .then((r: any[]) => r[0] ?? null)

  if (event) {
    // Fire-and-forget view count
    db.update(schema.events)
      .set({ viewCount: sql`${schema.events.viewCount} + 1` })
      .where(eq(schema.events.id, event.id))
      .catch(() => {})
  }

  return event
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const event = await getEvent(params.slug)
  if (!event) return { title: 'Event Not Found' }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  return {
    title: event.metaTitle || `${event.title} | Endow Global Events`,
    description: event.metaDescription || event.excerpt || `Join us for ${event.title}`,
    openGraph: {
      title: event.title,
      description: event.excerpt || '',
      url: `${appUrl}/events/${event.slug}`,
      images: event.ogImageUrl || event.coverImage
        ? [{ url: (event.ogImageUrl || event.coverImage) as string }]
        : [],
    },
  }
}

export default async function EventDetailPage({ params }: { params: { slug: string } }) {
  const event = await getEvent(params.slug)
  if (!event) notFound()

  const cat = event.category || 'OTHER'
  const catStyle = CATEGORY_STYLES[cat] || CATEGORY_STYLES.OTHER
  const isOnline = event.location?.toLowerCase().includes('online')
  const tags = Array.isArray(event.tags) ? event.tags : []
  const dateStr = formatDate(event.eventDate)
  const endDateStr = event.eventEndDate ? formatDate(event.eventEndDate) : null

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.excerpt || event.content,
    startDate: event.eventDate,
    endDate: event.eventEndDate,
    location: event.location
      ? {
          '@type': isOnline ? 'VirtualLocation' : 'Place',
          name: event.location,
        }
      : undefined,
    image: event.coverImage || event.ogImageUrl,
    url: `${appUrl}/events/${event.slug}`,
    organizer: { '@type': 'Organization', name: 'Endow Global Education' },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-grow">

          {/* Hero */}
          <section
            className="relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}
          >
            {event.coverImage && (
              <div className="absolute inset-0">
                <img src={event.coverImage} alt="" className="h-full w-full object-cover opacity-20" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(15,23,42,0.8) 0%, rgba(15,23,42,0.95) 100%)' }} />
              </div>
            )}
            <div className="relative mx-auto max-w-[1180px] px-5 sm:px-8 py-16 sm:py-24">
              {/* Back */}
              <Link
                href="/events"
                className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/80 mb-8 transition-colors"
              >
                <ArrowLeft size={14} /> Back to Events
              </Link>

              {/* Category badge */}
              <div className="mb-4">
                <span
                  className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold"
                  style={{ background: catStyle.bg, color: catStyle.text, border: `1px solid ${catStyle.border}` }}
                >
                  {catStyle.label}
                </span>
              </div>

              {/* Title */}
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 max-w-3xl leading-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {event.title}
              </h1>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
                {dateStr && (
                  <span className="flex items-center gap-1.5">
                    <CalendarDays size={14} className="text-[#C41E3A]" />
                    {dateStr}{endDateStr && endDateStr !== dateStr ? ` – ${endDateStr}` : ''}
                  </span>
                )}
                {event.location && (
                  <span className="flex items-center gap-1.5">
                    {isOnline ? <Globe size={14} className="text-blue-400" /> : <MapPin size={14} className="text-blue-400" />}
                    {event.location}
                  </span>
                )}
                {event.author && (
                  <span className="flex items-center gap-1.5 text-white/40">
                    By {event.author}
                  </span>
                )}
                {event.viewCount > 0 && (
                  <span className="flex items-center gap-1.5 text-white/30">
                    <Eye size={12} /> {event.viewCount} views
                  </span>
                )}
              </div>

              {/* Registration CTA */}
              {event.registrationUrl && (
                <div className="mt-8">
                  <a
                    href={event.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold text-white transition-all hover:opacity-90"
                    style={{ background: '#C41E3A', boxShadow: '0 8px 24px rgba(196,30,58,0.35)' }}
                  >
                    Register Now <ExternalLink size={14} />
                  </a>
                </div>
              )}
            </div>
          </section>

          {/* Content */}
          <section className="py-14" style={{ background: '#F8F9FB' }}>
            <div className="mx-auto max-w-[780px] px-5 sm:px-8">
              <div className="rounded-3xl border border-gray-100 bg-white p-8 sm:p-12 shadow-sm">

                {/* Excerpt */}
                {event.excerpt && (
                  <p className="text-lg text-gray-600 leading-relaxed mb-8 font-medium border-l-4 pl-5" style={{ borderColor: '#C41E3A' }}>
                    {event.excerpt}
                  </p>
                )}

                {/* Content */}
                {event.content ? (
                  <div
                    className="prose prose-gray max-w-none text-gray-700 leading-relaxed"
                    style={{ whiteSpace: 'pre-wrap' }}
                  >
                    {event.content}
                  </div>
                ) : (
                  !event.excerpt && (
                    <p className="text-gray-400 italic">No content available for this event.</p>
                  )
                )}

                {/* Tags */}
                {tags.length > 0 && (
                  <div className="mt-10 pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Tag size={14} className="text-gray-400 shrink-0" />
                      {tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bottom CTA */}
                {event.registrationUrl && (
                  <div className="mt-10 flex items-center justify-between rounded-2xl border border-[#C41E3A]/10 bg-[#C41E3A]/5 px-6 py-5">
                    <div>
                      <p className="text-sm font-bold text-gray-900">Interested in this event?</p>
                      <p className="text-xs text-gray-500 mt-0.5">Register your seat now — limited places available.</p>
                    </div>
                    <a
                      href={event.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all hover:opacity-90 shrink-0"
                      style={{ background: '#C41E3A' }}
                    >
                      Register <ExternalLink size={13} />
                    </a>
                  </div>
                )}
              </div>

              {/* Back link */}
              <div className="mt-8 text-center">
                <Link
                  href="/events"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#C41E3A] hover:text-[#A01830] transition-colors"
                >
                  <ArrowLeft size={14} /> View all events
                </Link>
              </div>
            </div>
          </section>

        </main>
        <Footer />
      </div>
    </>
  )
}
