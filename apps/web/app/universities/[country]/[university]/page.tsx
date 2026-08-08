'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { trpc } from '@/lib/trpc-client'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { MapPin, Globe, Award, Building2, GraduationCap, ArrowLeft, BookOpen, ExternalLink } from 'lucide-react'

export default function UniversityDetailPage() {
  const { university } = useParams<{ country: string; university: string }>()
  const { data: uni, isLoading } = trpc.university.getBySlug.useQuery({ slug: university as string })

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
        <Footer />
      </div>
    )
  }

  if (!uni) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">University not found</h1>
          <p className="mt-2 text-gray-500">The university you&apos;re looking for doesn&apos;t exist or isn&apos;t available yet.</p>
          <Link href="/universities" className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#760B16] to-[#A91324] px-6 py-3 text-sm font-bold text-white">Browse All Universities</Link>
        </div>
        <Footer />
      </div>
    )
  }

  const courses = (uni as any).courses || []
  const highlights = Array.isArray((uni as any).highlights) ? (uni as any).highlights : (typeof (uni as any).highlights === 'string' ? JSON.parse(((uni as any).highlights || '[]')) : [])

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f2ec]">
      <Navbar />

      {/* Breadcrumb */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-3 sm:px-6 lg:px-8">
          <Link href="/universities" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            <ArrowLeft size={14} /> Back to Universities
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="relative bg-white">
        {uni.coverImage && (
          <div className="h-48 sm:h-64 w-full overflow-hidden">
            <img src={uni.coverImage} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="mx-auto max-w-7xl px-5 pb-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="-mt-10 sm:-mt-16 flex h-20 w-20 sm:h-24 sm:w-24 shrink-0 items-center justify-center rounded-xl border-4 border-white bg-white shadow-lg overflow-hidden">
              {uni.logo ? <img src={uni.logo} alt={uni.name} className="h-full w-full object-contain p-2" /> : <Building2 size={32} className="text-gray-300" />}
            </div>
            <div className="flex-1 pt-0 sm:pt-2">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary"><MapPin size={11} />{uni.country}</span>
                {uni.city && <span className="text-xs text-gray-500">{uni.city}</span>}
                {uni.ranking && <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700"><Award size={11} />#{uni.ranking}</span>}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{uni.name}</h1>
              {uni.description && <p className="mt-3 max-w-3xl text-sm text-gray-500 leading-relaxed" dangerouslySetInnerHTML={{ __html: uni.description }} />}
              {uni.website && (
                <a href={uni.website} target="_blank" rel="noopener" className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                  <Globe size={13} /> Website <ExternalLink size={11} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Est.', value: uni.established || '—', icon: Building2 },
              { label: 'Students', value: uni.totalStudents?.toLocaleString() || '—', icon: GraduationCap },
              { label: 'Intl. %', value: uni.internationalPercent ? `${uni.internationalPercent}%` : '—', icon: Globe },
              { label: 'Ranking', value: uni.ranking ? `#${uni.ranking}` : '—', icon: Award },
            ].map((s) => {
              const Icon = s.icon
              return (
                <div key={s.label} className="rounded-xl border border-gray-200 bg-white p-4 text-center">
                  <Icon size={16} className="mx-auto text-gray-400" />
                  <p className="mt-1 text-lg font-bold text-gray-900">{s.value}</p>
                  <p className="text-[11px] text-gray-500">{s.label}</p>
                </div>
              )
            })}
          </div>

          {/* Highlights */}
          {highlights.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="text-lg font-semibold text-gray-900">Program Highlights</h2>
              <ul className="mt-3 space-y-2">
                {highlights.map((h: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Accreditation */}
          {uni.accreditation && (
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="text-lg font-semibold text-gray-900">Accreditation</h2>
              <p className="mt-2 text-sm text-gray-600">{uni.accreditation}</p>
            </div>
          )}

          {/* Courses */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-gray-900">Available Courses</h2>
            {courses.length === 0 ? (
              <p className="mt-3 text-sm text-gray-500">No courses listed yet for this university.</p>
            ) : (
              <div className="mt-3 divide-y divide-gray-100">
                {courses.map((c: any) => (
                  <div key={c.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-50">
                        <BookOpen size={14} className="text-purple-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{c.name}</p>
                        <p className="text-xs text-gray-500">{c.level?.replace(/_/g, ' ') || ''} · {c.duration} {c.durationUnit?.toLowerCase() || 'years'}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 shrink-0 ml-3">
                      {c.currency} {c.tuitionFee?.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {uni.website && (
            <a href={uni.website} target="_blank" rel="noopener" className="block w-full rounded-xl bg-primary px-5 py-3 text-center text-sm font-semibold text-white hover:bg-brand-700 transition-colors">
              Visit Website <ExternalLink size={12} className="inline ml-1" />
            </a>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
