'use client'

import Link from 'next/link'
import { ArrowRight, BookOpen, Clock, MapPin } from 'lucide-react'
import { trpc } from '@/lib/trpc-client'
import { FadeUp, FadeUpStagger, FadeUpItem } from '@/components/home/FadeUp'

const accentColors = [
  { accent: '#C41E3A', soft: '#FFF3F5', border: '#F1D7DD' },
  { accent: '#6D5B8C', soft: '#F6F3FB', border: '#E5DFF0' },
  { accent: '#3F7D86', soft: '#F0F8F8', border: '#D8EAEA' },
  { accent: '#B88952', soft: '#FBF6EF', border: '#EEE1D2' },
  { accent: '#7B6D8D', soft: '#F6F4F8', border: '#E6E1EA' },
  { accent: '#527A92', soft: '#F1F6F9', border: '#DCE8EE' },
]
const levelLabels: Record<string, string> = {
  UNDERGRADUATE: 'Bachelors',
  POSTGRADUATE: 'Masters',
  PHD: 'PhD',
  DIPLOMA: 'Diploma',
  CERTIFICATE: 'Certificate',
  FOUNDATION: 'Foundation',
}

type TrendingCourse = {
  slug?: string
  universitySlug?: string
  universityName?: string
  universityCountry?: string
  name?: string
  level?: string
  duration?: number | string
  durationUnit?: string
  currency?: string
  tuitionFee?: number
}

export default function TrendingCourses() {
  const { data: result } = trpc.course.list.useQuery({ perPage: 6 })
  const courses = (result as { hits?: TrendingCourse[] } | undefined)?.hits?.slice(0, 6) ?? []

  if (!courses.length) return null

  return (
    <section className="relative overflow-hidden bg-[#F8F8FB] py-16 sm:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_55%_at_8%_18%,rgba(196,30,58,0.06),transparent_70%),radial-gradient(ellipse_48%_50%_at_92%_82%,rgba(82,122,146,0.06),transparent_70%)]" />
      <div className="pointer-events-none absolute -right-28 top-16 h-72 w-72 rounded-full border border-[#C41E3A]/[0.06]" />
      <div className="pointer-events-none absolute -right-16 top-28 h-48 w-48 rounded-full border border-[#C41E3A]/[0.05]" />

      <div className="relative z-10 mx-auto max-w-[1180px] px-5 sm:px-8">
        <FadeUp>
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span
                className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#C41E3A]/10 bg-white/75 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#A01830] shadow-sm"
                style={{ fontFamily: "'IBM Plex Mono',monospace" }}
              >
                <BookOpen size={13} />
                Popular Programs
              </span>
              <h2
                className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl"
                style={{ fontFamily: "'Space Grotesk',sans-serif" }}
              >
                Featured <span className="text-[#C41E3A]">courses</span> from our partners
              </h2>
            </div>
            <Link
              href="/courses"
              className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[#A01830] hover:text-[#7A0713]"
            >
              View all courses{' '}
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </FadeUp>

        <FadeUpStagger
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          amount={0.06}
        >
          {courses.map((course, i) => {
            const accent = accentColors[i % accentColors.length]
            return (
              <FadeUpItem key={course.slug || i}>
                <Link
                  href={`/institutions/${course.universitySlug || 'unknown'}/${(course.level || 'postgraduate').toLowerCase()}/${course.slug}`}
                >
                  <article
                    className="group relative overflow-hidden rounded-2xl border bg-white/85 shadow-[0_8px_28px_rgba(16,27,61,0.045)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_16px_42px_rgba(16,27,61,0.09)]"
                    style={{ borderColor: accent.border }}
                  >
                    {/* Accent line */}
                    <div
                      className="h-0.5 w-full opacity-70 transition-opacity group-hover:opacity-100"
                      style={{
                        background: `linear-gradient(to right, transparent, ${accent.accent}, transparent)`,
                      }}
                    />
                    <div className="p-5 sm:p-6">
                      {/* University */}
                      <div className="mb-3 flex items-center gap-1.5 text-[12px] text-gray-500">
                        <MapPin size={12} className="shrink-0" style={{ color: accent.accent }} />
                        <span className="truncate">{course.universityName || 'University'}</span>
                        {course.universityCountry && (
                          <span className="text-gray-400">· {course.universityCountry}</span>
                        )}
                      </div>
                      {/* Course name */}
                      <h3
                        className="mb-2 line-clamp-2 text-base font-bold leading-snug text-gray-900 transition-colors group-hover:text-[#A01830]"
                        style={{ fontFamily: "'Space Grotesk',sans-serif" }}
                      >
                        {course.name}
                      </h3>
                      {/* Badges */}
                      <div className="mb-4 flex flex-wrap items-center gap-2">
                        <span
                          className="inline-flex items-center rounded-lg px-2 py-0.5 text-[10px] font-semibold"
                          style={{
                            background: accent.soft,
                            color: accent.accent,
                            border: `1px solid ${accent.border}`,
                          }}
                        >
                          {(course.level && (levelLabels[course.level] || course.level)) ||
                            'Program'}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] text-gray-400">
                          <Clock size={11} />
                          {course.duration} {course.durationUnit?.toLowerCase()}
                        </span>
                      </div>
                      {/* Footer */}
                      <div
                        className="flex items-center justify-between border-t pt-3"
                        style={{ borderColor: accent.border }}
                      >
                        <span className="text-sm font-bold text-gray-900">
                          {course.currency} {course.tuitionFee?.toLocaleString()}
                          <span className="ml-0.5 text-[10px] font-normal text-gray-400">/yr</span>
                        </span>
                        <span
                          className="inline-flex items-center gap-1 text-xs font-semibold transition-all group-hover:gap-1.5"
                          style={{ color: accent.accent }}
                        >
                          Details{' '}
                          <ArrowRight
                            size={12}
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
