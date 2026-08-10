'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { trpc } from '@/lib/trpc-client'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { MapPin, Globe, Award, Building2, BookOpen, ExternalLink, Clock, Users, CheckCircle, Layers, ChevronRight, Calendar } from 'lucide-react'

function stripHtml(html: string) { return html.replace(/<[^>]+>/g, '') }

export default function UniversityDetailPage() {
  const { university } = useParams<{ country: string; university: string }>()
  const { data: uni, isLoading } = trpc.university.getBySlug.useQuery({ slug: university as string })
  const [descExpanded, setDescExpanded] = useState(false)

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f7f2ec]">
        <Navbar />
        <div className="flex flex-1 items-center justify-center pt-16">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
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
          <p className="mt-2 text-gray-500">The university you&apos;re looking for doesn&apos;t exist or isn&apos;t available yet.</p>
          <Link href="/universities" className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#760B16] to-[#A91324] px-6 py-3 text-sm font-bold text-white shadow-md shadow-primary/20">Browse All Universities</Link>
        </div>
        <Footer />
      </div>
    )
  }

  const courses = (uni as any).courses || []
  const highlights = Array.isArray((uni as any).highlights) ? (uni as any).highlights : (typeof (uni as any).highlights === 'string' ? JSON.parse(((uni as any).highlights || '[]')) : [])
  const rankings = Array.isArray((uni as any).rankings) ? (uni as any).rankings : (typeof (uni as any).rankings === 'string' ? JSON.parse(((uni as any).rankings || '[]')) : [])
  const descText = uni.description ? stripHtml(uni.description) : ''
  const descLong = descText.length > 160
  const descDisplay = descExpanded || !descLong ? descText : descText.slice(0, 160).trimEnd() + '…'

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f2ec]">
      <div className="relative z-30"><Navbar /></div>

      <section className="relative -mt-[72px]">
        <div className="absolute inset-0 h-[540px] sm:h-[520px] overflow-hidden">
          {uni.coverImage ? (
            <img src={uni.coverImage} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/90 via-[#0f172a]/60 to-[#0f172a]/25" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-[180px] sm:px-6 lg:px-8 sm:pb-16 sm:pt-[200px]">
          <div className="flex flex-col gap-5 sm:flex-row sm:gap-6">
            <div className="flex h-[88px] w-[88px] sm:h-[104px] sm:w-[104px] shrink-0 items-center justify-center rounded-2xl bg-white shadow-xl overflow-hidden">
              {uni.logo ? <img src={uni.logo} alt={uni.name} className="h-full w-full object-contain p-3" /> : <Building2 size={36} className="text-gray-400" />}
            </div>

            <div className="flex-1 min-w-0 sm:pt-2">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 backdrop-blur px-2.5 py-0.5 text-[11px] font-semibold text-white"><MapPin size={11} />{uni.country}</span>
                {uni.city && <span className="text-sm text-white/60">{uni.city}</span>}
                {uni.ranking && <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/20 px-2.5 py-0.5 text-[11px] font-semibold text-amber-300"><Award size={11} />#{uni.ranking}</span>}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">{uni.name}</h1>

              {descText && (
                <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-white/70">
                  {descDisplay}
                  {descLong && !descExpanded && (
                    <button onClick={() => setDescExpanded(true)} className="ml-1 text-white/50 hover:text-white underline underline-offset-2 font-medium transition-colors text-xs">Read more</button>
                  )}
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-3">
                {uni.website && (
                  <a href={uni.website} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100 transition-colors shadow-md">
                    <Globe size={14} /> Visit Official Website <ExternalLink size={11} />
                  </a>
                )}
                {(uni as any).brochureUrl && (
                  <a href={(uni as any).brochureUrl} target="_blank" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors">
                    <BookOpen size={14} /> Download Brochure
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Est.', v: uni.established || '—' },
              { label: 'Students', v: uni.totalStudents?.toLocaleString() || '—' },
              { label: 'Intl. %', v: uni.internationalPercent != null ? `${uni.internationalPercent}%` : '—' },
              { label: 'Rank', v: uni.ranking ? `#${uni.ranking}` : '—' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-white/8 backdrop-blur border border-white/10 py-3 px-4 text-center">
                <p className="text-lg font-bold text-white">{s.v}</p>
                <p className="text-[11px] text-white/50 mt-0.5 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          <div className="lg:col-span-2 space-y-4">

            {highlights.length > 0 && (
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50"><Award size={16} className="text-amber-600" /></div>
                  <h2 className="text-base font-semibold text-gray-900">Program Highlights</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {highlights.map((h: string, i: number) => (
                    <div key={i} className="flex items-start gap-2.5 rounded-lg border border-gray-100 bg-gray-50/60 p-3">
                      <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-primary/15 flex items-center justify-center"><span className="h-1.5 w-1.5 rounded-full bg-primary" /></span>
                      <span className="text-sm text-gray-700 leading-relaxed">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {rankings.length > 0 && (
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50"><Award size={16} className="text-blue-600" /></div>
                  <h2 className="text-base font-semibold text-gray-900">Rankings & Recognition</h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {rankings.map((r: any, i: number) => (
                    <div key={i} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                      <span className="text-sm text-gray-700">{r.body || r}</span>
                      <span className="text-xs font-medium text-gray-500 shrink-0 ml-3">{r.position}{r.year ? ` (${r.year})` : ''}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {uni.accreditation && (
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50"><CheckCircle size={16} className="text-green-600" /></div>
                  <h2 className="text-base font-semibold text-gray-900">Accreditation</h2>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{uni.accreditation}</p>
              </div>
            )}

            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between px-5 pt-5 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50"><BookOpen size={16} className="text-purple-600" /></div>
                  <h2 className="text-base font-semibold text-gray-900">Available Courses</h2>
                </div>
                {courses.length > 0 && <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-600">{courses.length} programs</span>}
              </div>
              {courses.length === 0 ? (
                <div className="px-5 pb-5">
                  <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50/60 py-10 text-center">
                    <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-purple-50"><BookOpen size={22} className="text-purple-400" /></div>
                    <p className="mt-3 text-sm font-medium text-gray-600">No courses listed yet</p>
                    <p className="mt-1 text-xs text-gray-400 max-w-xs mx-auto">Courses for this university will be available here once added by the admin team.</p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 px-5 pb-4">
                  {courses.map((c: any) => (
                    <Link key={c.id} href={`/universities/${uni.country.toLowerCase().replace(/\s+/g, '-')}/${uni.slug}/${c.slug}`} className="flex items-center justify-between py-3 group -mx-2 px-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-50 group-hover:bg-purple-100 transition-colors"><BookOpen size={15} className="text-purple-600" /></div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors truncate">{c.name}</p>
                          <div className="mt-0.5 flex items-center gap-3 text-[11px] text-gray-500">
                            <span className="inline-flex items-center gap-1"><Layers size={10} />{c.level?.replace(/_/g, ' ') || '—'}</span>
                            <span className="inline-flex items-center gap-1"><Clock size={10} />{c.duration} {c.durationUnit?.toLowerCase()}</span>
                            <span className="inline-flex items-center gap-1"><Globe size={10} />{c.language}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 ml-4">
                        <span className="text-sm font-bold text-gray-900 whitespace-nowrap">{c.currency} {c.tuitionFee?.toLocaleString()}</span>
                        <ChevronRight size={15} className="text-gray-300 group-hover:text-primary transition-colors shrink-0" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Facts</h3>
              <div className="space-y-3">
                {[
                  uni.established && { icon: Calendar, label: 'Established', value: uni.established },
                  uni.totalStudents && { icon: Users, label: 'Total Students', value: uni.totalStudents?.toLocaleString() },
                  uni.internationalPercent != null && { icon: Globe, label: 'International Students', value: `${uni.internationalPercent}%` },
                  uni.ranking && { icon: Award, label: 'Global Ranking', value: `#${uni.ranking}` },
                  { icon: Layers, label: 'Programs', value: `${courses.length} courses` },
                ].filter(Boolean).map((item: any, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <item.icon size={15} className="text-gray-400 shrink-0" />
                    <div className="flex-1 flex items-center justify-between min-w-0">
                      <span className="text-xs text-gray-500">{item.label}</span>
                      <span className="text-xs font-semibold text-gray-900">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {uni.website && (
              <a href={uni.website} target="_blank" rel="noopener" className="flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-[#760B16] to-[#A91324] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-primary/15 hover:shadow-lg hover:shadow-primary/25 transition-all hover:-translate-y-0.5">
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
