'use client'

import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { trpc } from '@/lib/trpc-client'
import {
  Award,
  BookOpen,
  Building2,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  ExternalLink,
  Globe,
  Layers,
  MapPin,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, '')
}

function toArray(value: unknown): any[] {
  if (Array.isArray(value)) return value
  if (typeof value !== 'string') return []
  let parsed: unknown = value
  for (let i = 0; i < 2; i++) {
    try {
      parsed = JSON.parse(parsed as string)
    } catch {
      return []
    }
    if (!Array.isArray(parsed) && typeof parsed !== 'string') return []
  }
  return Array.isArray(parsed) ? parsed : []
}

function formatPlus(n: number | null | undefined): string {
  return n != null && n > 0 ? `${n}+` : '—'
}

export default function UniversityDetailPage() {
  const { university } = useParams<{ country: string; university: string }>()
  const { data: uni, isLoading } = trpc.university.getBySlug.useQuery({
    slug: university as string,
  })
  const [descExpanded, setDescExpanded] = useState(false)

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f7f2ec]">
        <Navbar />
        <div className="flex flex-1 items-center justify-center pt-16">
          <div className="border-primary h-10 w-10 animate-spin rounded-full border-2 border-t-transparent" />
        </div>
        <Footer />
      </div>
    )
  }

  if (!uni) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f7f2ec]">
        <Navbar />
        <div className="flex flex-1 flex-col items-center justify-center px-6 pt-16 text-center">
          <Building2 size={48} className="text-gray-300" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">University not found</h1>
          <p className="mt-2 text-gray-500">
            The university you&apos;re looking for doesn&apos;t exist or isn&apos;t available yet.
          </p>
          <Link
            href="/universities"
            className="shadow-primary/20 mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#760B16] to-[#A91324] px-6 py-3 text-sm font-bold text-white shadow-md"
          >
            Browse All Universities
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const courses = (uni as any).courses || []
  const highlights = toArray((uni as any).highlights)
  const rankings = toArray((uni as any).rankings)
  const descText = uni.description ? stripHtml(uni.description) : ''
  const descLong = descText.length > 160
  const descDisplay = descExpanded || !descLong ? descText : descText.slice(0, 160).trimEnd() + '…'

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f2ec]">
      <div className="relative z-30">
        <Navbar />
      </div>

      <section className="relative -mt-[72px] overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          {uni.coverImage ? (
            <img src={uni.coverImage} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/90 via-[#0f172a]/60 to-[#0f172a]/25" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-[180px] sm:px-6 sm:pb-16 sm:pt-[200px] lg:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:gap-6">
            <div className="flex h-[88px] w-[88px] shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-xl sm:h-[104px] sm:w-[104px]">
              {uni.logo ? (
                <img src={uni.logo} alt={uni.name} className="h-full w-full object-contain p-3" />
              ) : (
                <Building2 size={36} className="text-gray-400" />
              )}
            </div>

            <div className="min-w-0 flex-1 sm:pt-2">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur">
                  <MapPin size={11} />
                  {uni.country}
                </span>
                {uni.city && <span className="text-sm text-white/60">{uni.city}</span>}
                {uni.ranking && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/20 px-2.5 py-0.5 text-[11px] font-semibold text-amber-300">
                    <Award size={11} />
                    QS {uni.ranking}
                  </span>
                )}
                {uni.koreaRanking && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-400/20 px-2.5 py-0.5 text-[11px] font-semibold text-blue-300">
                    <Award size={11} />
                    Korea #{uni.koreaRanking}
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                {uni.name}
              </h1>

              {descText && (
                <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-white/70">
                  {descDisplay}
                  {descLong && (
                    <button
                      onClick={() => setDescExpanded(!descExpanded)}
                      className="ml-1 text-xs font-medium text-white/50 underline underline-offset-2 transition-colors hover:text-white"
                    >
                      {descExpanded ? 'Show less' : 'Read more'}
                    </button>
                  )}
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-3">
                {uni.website && (
                  <a
                    href={uni.website}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-md transition-colors hover:bg-gray-100"
                  >
                    <Globe size={14} /> Visit Official Website <ExternalLink size={11} />
                  </a>
                )}
                {(uni as any).brochureUrl && (
                  <a
                    href={(uni as any).brochureUrl}
                    target="_blank"
                    className="inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
                  >
                    <BookOpen size={14} /> Download Brochure
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'Est.', v: uni.established || '—' },
              { label: 'Students', v: formatPlus(uni.totalStudents) },
              { label: 'Intl. Students', v: formatPlus(uni.internationalStudents) },
              { label: 'QS Rank', v: uni.ranking ? String(uni.ranking) : '—' },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white/8 rounded-xl border border-white/10 px-4 py-3 text-center backdrop-blur"
              >
                <p className="text-lg font-bold text-white">{s.v}</p>
                <p className="mt-0.5 text-[11px] font-medium text-white/50">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-5 py-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {highlights.length > 0 && (
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
                    <Award size={16} className="text-amber-600" />
                  </div>
                  <h2 className="text-base font-semibold text-gray-900">Program Highlights</h2>
                </div>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {highlights.map((h: string, i: number) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 rounded-lg border border-gray-100 bg-gray-50/60 p-3"
                    >
                      <span className="bg-primary/15 mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full">
                        <span className="bg-primary h-1.5 w-1.5 rounded-full" />
                      </span>
                      <span className="text-sm leading-relaxed text-gray-700">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {rankings.length > 0 && (
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                    <Award size={16} className="text-blue-600" />
                  </div>
                  <h2 className="text-base font-semibold text-gray-900">Rankings & Recognition</h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {rankings.map((r: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0"
                    >
                      <span className="text-sm text-gray-700">{r.body || r}</span>
                      <span className="ml-3 shrink-0 text-xs font-medium text-gray-500">
                        {r.position}
                        {r.year ? ` (${r.year})` : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {uni.accreditation && (
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50">
                    <CheckCircle size={16} className="text-green-600" />
                  </div>
                  <h2 className="text-base font-semibold text-gray-900">Accreditation</h2>
                </div>
                <p className="text-sm leading-relaxed text-gray-600">{uni.accreditation}</p>
              </div>
            )}

            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between px-5 pb-3 pt-5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50">
                    <BookOpen size={16} className="text-purple-600" />
                  </div>
                  <h2 className="text-base font-semibold text-gray-900">Available Courses</h2>
                </div>
                {courses.length > 0 && (
                  <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-600">
                    {courses.length} programs
                  </span>
                )}
              </div>
              {courses.length === 0 ? (
                <div className="px-5 pb-5">
                  <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50/60 py-10 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50">
                      <BookOpen size={22} className="text-purple-400" />
                    </div>
                    <p className="mt-3 text-sm font-medium text-gray-600">No courses listed yet</p>
                    <p className="mx-auto mt-1 max-w-xs text-xs text-gray-400">
                      Courses for this university will be available here once added by the admin
                      team.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 px-5 pb-4">
                  {courses.map((c: any) => (
                    <Link
                      key={c.id}
                      href={`/institutions/${uni.slug}/${(c.level || 'postgraduate').toLowerCase()}/${c.slug}`}
                      className="group -mx-2 flex items-center justify-between rounded-lg px-2 py-3 transition-colors hover:bg-gray-50"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-50 transition-colors group-hover:bg-purple-100">
                          <BookOpen size={15} className="text-purple-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="group-hover:text-primary truncate text-sm font-semibold text-gray-900 transition-colors">
                            {c.name}
                          </p>
                          <div className="mt-0.5 flex items-center gap-3 text-[11px] text-gray-500">
                            <span className="inline-flex items-center gap-1">
                              <Layers size={10} />
                              {c.level?.replace(/_/g, ' ') || '—'}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Clock size={10} />
                              {c.duration} {c.durationUnit?.toLowerCase()}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Globe size={10} />
                              {c.language}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex shrink-0 items-center gap-3">
                        <span className="whitespace-nowrap text-sm font-bold text-gray-900">
                          {c.currency} {c.tuitionFee?.toLocaleString()}
                        </span>
                        <ChevronRight
                          size={15}
                          className="group-hover:text-primary shrink-0 text-gray-300 transition-colors"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold text-gray-900">Quick Facts</h3>
              <div className="space-y-3">
                {[
                  uni.established && {
                    icon: Calendar,
                    label: 'Established',
                    value: uni.established,
                  },
                  uni.totalStudents && {
                    icon: Users,
                    label: 'Total Students',
                    value: formatPlus(uni.totalStudents),
                  },
                  uni.internationalStudents && {
                    icon: Globe,
                    label: 'International Students',
                    value: formatPlus(uni.internationalStudents),
                  },
                  uni.ranking && { icon: Award, label: 'QS Ranking', value: String(uni.ranking) },
                  uni.koreaRanking && {
                    icon: Award,
                    label: 'Ranking in Korea',
                    value: `#${uni.koreaRanking}`,
                  },
                  { icon: Layers, label: 'Programs', value: `${courses.length} courses` },
                ]
                  .filter(Boolean)
                  .map((item: any, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <item.icon size={15} className="shrink-0 text-gray-400" />
                      <div className="flex min-w-0 flex-1 items-center justify-between">
                        <span className="text-xs text-gray-500">{item.label}</span>
                        <span className="text-xs font-semibold text-gray-900">{item.value}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {uni.website && (
              <a
                href={uni.website}
                target="_blank"
                rel="noopener"
                className="shadow-primary/15 hover:shadow-primary/25 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#760B16] to-[#A91324] px-5 py-3 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <Globe size={15} /> Visit Official Website <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
