'use client'

import Link from 'next/link'
import { ArrowLeft, Clock, DollarSign, GraduationCap, Globe, Award, BookOpen, MapPin, ExternalLink, CheckCircle2, Layers, Star, XCircle, CalendarDays, Monitor, FileText, Building2, ChevronRight } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { FadeUp } from '@/components/home/FadeUp'

const levelLabels: Record<string, string> = { UNDERGRADUATE: 'Undergraduate', POSTGRADUATE: 'Postgraduate', PHD: 'PhD', DIPLOMA: 'Diploma', CERTIFICATE: 'Certificate', FOUNDATION: 'Foundation' }
const modeLabels: Record<string, string> = { FULL_TIME: 'Full Time', PART_TIME: 'Part Time', ONLINE: 'Online', HYBRID: 'Hybrid' }

function safeArray(v: any): string[] {
  if (Array.isArray(v)) return v
  if (typeof v === 'string') {
    try { const p = JSON.parse(v); if (Array.isArray(p)) return p; if (typeof p === 'string') { const p2 = JSON.parse(p); return Array.isArray(p2) ? p2 : []; } } catch {}
  }
  return []
}

export default function CourseDetailContent({ course }: { course: any }) {
  const highlights = safeArray(course.highlights)
  const requirements = safeArray(course.requirements)
  const modules = Array.isArray(course.modules) ? course.modules : []
  const intakes = Array.isArray(course.intakes) ? course.intakes : []

  // Group modules by term
  const moduleGroups: Record<string, { core: any[]; optional: any[] }> = {}
  for (const m of modules) {
    const term = m.term || 'Other'
    if (!moduleGroups[term]) moduleGroups[term] = { core: [], optional: [] }
    if (m.type === 'CORE') moduleGroups[term].core.push(m)
    else moduleGroups[term].optional.push(m)
  }

  return (
    <div className="w-full flex flex-col overflow-x-hidden">
      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 relative z-10">
          <div className="pt-4 pb-6 lg:pb-8"><Navbar /></div>
          <div className="py-10 lg:py-16">
            <FadeUp>
              <Link href="/courses" className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[#C41E3A] transition-colors"><ArrowLeft size={16} />All Courses</Link>
            </FadeUp>
            <FadeUp>
              <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-[#C41E3A]/10 px-3 py-1 text-xs font-semibold text-[#C41E3A]">{levelLabels[course.level] ?? course.level}</span>
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">{course.subject}</span>
                    {course.expressOffer && <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700"><Star size={11} />Express Offer</span>}
                    {course.hasScholarship && <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700"><Award size={12} />Scholarship</span>}
                  </div>
                  <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">{course.name}</h1>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    {course.universityName && <span className="flex items-center gap-1.5"><GraduationCap size={16} className="text-[#C41E3A]" />{course.universityName}</span>}
                    {course.universityCountry && <span className="flex items-center gap-1.5"><MapPin size={16} className="text-gray-400" />{course.universityCity}, {course.universityCountry}</span>}
                    <span className="flex items-center gap-1.5"><Globe size={16} className="text-gray-400" />{course.language || 'English'}</span>
                    {course.modeOfStudy && <span className="flex items-center gap-1.5"><Monitor size={16} className="text-gray-400" />{modeLabels[course.modeOfStudy] || course.modeOfStudy}</span>}
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-center shadow-sm"><Clock size={18} className="mx-auto text-[#C41E3A]" /><p className="mt-1 text-sm font-bold text-gray-900">{course.duration} {course.durationUnit?.toLowerCase()}</p><p className="text-xs text-gray-500">Duration</p></div>
                  <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-center shadow-sm"><DollarSign size={18} className="mx-auto text-[#C41E3A]" /><p className="mt-1 text-sm font-bold text-gray-900">{formatCurrency(course.tuitionFee, course.currency)}</p><p className="text-xs text-gray-500">Per Year</p></div>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      <main className="flex-grow bg-gray-50">
        <section className="py-10 lg:py-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* MAIN */}
              <div className="space-y-6 lg:col-span-2">

                {/* Description */}
                <FadeUp>
                  <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
                    <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#C41E3A] to-transparent opacity-60" />
                    <div className="p-6">
                      <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900"><BookOpen size={20} className="text-[#C41E3A]" />About This Course</h2>
                      <div className="mt-4 prose prose-gray max-w-none text-sm leading-7 text-gray-600" dangerouslySetInnerHTML={{ __html: course.description || 'No description available.' }} />
                    </div>
                  </div>
                </FadeUp>

                {/* Key Highlights */}
                {highlights.length > 0 && (
                  <FadeUp>
                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
                      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#C41E3A] to-transparent opacity-60" />
                      <div className="p-6">
                        <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900"><Award size={20} className="text-[#C41E3A]" />Key Program Highlights</h2>
                        <ul className="mt-4 space-y-3">
                          {highlights.map((h: string, i: number) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-green-500" />
                              {h}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </FadeUp>
                )}

                {/* Course Modules */}
                {modules.length > 0 && (
                  <FadeUp>
                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
                      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#C41E3A] to-transparent opacity-60" />
                      <div className="p-6">
                        <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900"><Layers size={20} className="text-[#C41E3A]" />Course Modules</h2>
                        <div className="mt-4 space-y-5">
                          {Object.entries(moduleGroups).map(([term, groups]) => (
                            <div key={term}>
                              <h3 className="text-sm font-semibold text-[#C41E3A] mb-2">{term}</h3>
                              {groups.core.length > 0 && (
                                <div className="mb-3">
                                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Core Modules</span>
                                  <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {groups.core.map((m: any) => <div key={m.id} className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700"><span className="h-1.5 w-1.5 rounded-full bg-[#C41E3A] shrink-0" />{m.name}</div>)}
                                  </div>
                                </div>
                              )}
                              {groups.optional.length > 0 && (
                                <div>
                                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Optional Modules</span>
                                  <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {groups.optional.map((m: any) => <div key={m.id} className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700"><span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />{m.name}</div>)}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </FadeUp>
                )}

                {/* Requirements */}
                {requirements.length > 0 && (
                  <FadeUp>
                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
                      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#C41E3A] to-transparent opacity-60" />
                      <div className="p-6">
                        <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900"><FileText size={20} className="text-[#C41E3A]" />Requirements</h2>
                        <ul className="mt-4 space-y-2">
                          {requirements.map((r: string, i: number) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C41E3A]" />{r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </FadeUp>
                )}

                {/* Professional Accreditation */}
                {course.professionalAccreditation && (
                  <FadeUp>
                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
                      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#C41E3A] to-transparent opacity-60" />
                      <div className="p-6">
                        <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900"><Award size={20} className="text-[#C41E3A]" />Professional Accreditation</h2>
                        <p className="mt-3 text-sm text-gray-600 leading-relaxed">{course.professionalAccreditation}</p>
                      </div>
                    </div>
                  </FadeUp>
                )}
              </div>

              {/* SIDEBAR */}
              <div className="space-y-5">
                {/* Application Details */}
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Application Details</h3>
                  <div className="space-y-3 text-sm">
                    {course.applicationDeadline && <div className="flex items-center gap-3"><Clock size={15} className="text-gray-400 shrink-0" /><span className="text-gray-500">Apply by</span><span className="ml-auto font-medium text-gray-900">{new Date(course.applicationDeadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span></div>}
                    {course.startDate && <div className="flex items-center gap-3"><CalendarDays size={15} className="text-gray-400 shrink-0" /><span className="text-gray-500">Start date</span><span className="ml-auto font-medium text-gray-900">{new Date(course.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span></div>}
                    {course.campus && <div className="flex items-center gap-3"><Building2 size={15} className="text-gray-400 shrink-0" /><span className="text-gray-500">Campus</span><span className="ml-auto font-medium text-gray-900">{course.campus}</span></div>}
                    {course.offerResponseTime && <div className="flex items-center gap-3"><CheckCircle2 size={15} className="text-gray-400 shrink-0" /><span className="text-gray-500">Offer response</span><span className="ml-auto font-medium text-gray-900">{course.offerResponseTime}</span></div>}
                    {course.applicationFee != null && <div className="flex items-center gap-3"><DollarSign size={15} className="text-gray-400 shrink-0" /><span className="text-gray-500">Application fee</span><span className="ml-auto font-medium text-gray-900">{course.currency} {course.applicationFee}</span></div>}
                  </div>
                </div>

                {/* Admission Flags */}
                {(course.backlogsAccepted || course.gapYearsAccepted || course.englishTestWaiver || course.expressOffer) && (
                  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Admission</h3>
                    <div className="space-y-2.5">
                      {course.backlogsAccepted && <div className="flex items-center gap-3 text-sm"><CheckCircle2 size={15} className="text-green-500 shrink-0" /><span className="text-gray-700">Backlogs accepted</span></div>}
                      {course.gapYearsAccepted && <div className="flex items-center gap-3 text-sm"><CheckCircle2 size={15} className="text-green-500 shrink-0" /><span className="text-gray-700">Gap years accepted</span></div>}
                      {course.englishTestWaiver && <div className="flex items-center gap-3 text-sm"><CheckCircle2 size={15} className="text-green-500 shrink-0" /><span className="text-gray-700">English test waiver available</span></div>}
                      {course.expressOffer && <div className="flex items-center gap-3 text-sm"><Star size={15} className="text-amber-500 shrink-0" /><span className="text-gray-700">Express Offer available</span></div>}
                    </div>
                  </div>
                )}

                {/* Intakes */}
                {intakes.length > 0 && (
                  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Intake Dates</h3>
                    <div className="space-y-2">
                      {intakes.map((i: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm">
                          <span className="font-medium text-gray-900">{new Date(i.intakeDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                          {i.applyByDate && <span className="text-xs text-gray-500">Apply by {new Date(i.applyByDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Scholarship */}
                {course.hasScholarship && course.scholarshipDetails && (
                  <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-green-800"><Award size={16} />Scholarship Available</h3>
                    <p className="mt-2 text-sm text-green-700 leading-relaxed">{course.scholarshipDetails}</p>
                  </div>
                )}

                {/* University Card */}
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">University</h3>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-100 overflow-hidden">
                      {course.universityLogo ? <img src={course.universityLogo} alt="" className="h-full w-full object-contain p-1" /> : <Building2 size={18} className="text-gray-300" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{course.universityName}</p>
                      <p className="text-xs text-gray-500">{course.universityCity}, {course.universityCountry}</p>
                    </div>
                  </div>
                  {course.universityWebsite && (
                    <a href={course.universityWebsite} target="_blank" className="flex items-center justify-center gap-1.5 w-full rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                      <ExternalLink size={13} /> Visit University Website
                    </a>
                  )}
                </div>

                {/* CTA */}
                <a href={course.brochureUrl || '#'} className="flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-[#760B16] to-[#A91324] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-primary/15 hover:shadow-lg hover:shadow-primary/25 transition-all">
                  <BookOpen size={15} /> Apply Now
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
