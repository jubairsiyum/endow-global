'use client'

import Link from 'next/link'
import { ArrowLeft, Clock, DollarSign, GraduationCap, Globe, Award, BookOpen, MapPin, ExternalLink, CheckCircle2, Layers, Star, CalendarDays, Monitor, FileText, Building2, ChevronRight, Send, Home } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { formatCurrency } from '@/lib/utils'
import { FadeUp } from '@/components/home/FadeUp'

const levelLabels: Record<string, string> = { UNDERGRADUATE: 'Undergraduate', POSTGRADUATE: 'Postgraduate', PHD: 'PhD', DIPLOMA: 'Diploma', CERTIFICATE: 'Certificate', FOUNDATION: 'Foundation' }
const modeLabels: Record<string, string> = { FULL_TIME: 'Full Time', PART_TIME: 'Part Time', ONLINE: 'Online', HYBRID: 'Hybrid' }

function safeArray(v: any): string[] {
  if (!v) return []
  if (Array.isArray(v)) return v
  if (typeof v === 'object') return []
  if (typeof v === 'string') { const s = v.trim(); if (!s) return []; try { const p = JSON.parse(s); if (Array.isArray(p)) return safeArray(p); if (typeof p === 'string') return safeArray(p) } catch {}; return [s] }
  return []
}

export default function CourseDetailContent({ course }: { course: any }) {
  const highlights = safeArray(course.highlights)
  const requirements = safeArray(course.requirements)
  const modules = Array.isArray(course.modules) ? course.modules : []
  const intakes = Array.isArray(course.intakes) ? course.intakes : []
  const uniSlug = course.universitySlug || ''
  const levelSlug = (course.level || 'postgraduate').toLowerCase()
  const courseSlug = course.slug || ''

  const moduleGroups: Record<string, { core: any[]; optional: any[] }> = {}
  for (const m of modules) { const term = m.term || 'Other'; if (!moduleGroups[term]) moduleGroups[term] = { core: [], optional: [] }; if (m.type === 'CORE') moduleGroups[term].core.push(m); else moduleGroups[term].optional.push(m) }

  return (
    <div className="w-full flex flex-col overflow-x-hidden">
      <Navbar />
      {/* Breadcrumb */}
      <section className="bg-white border-b border-gray-100 pt-24 pb-4">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 flex-wrap" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-gray-600 transition-colors" title="Home">
                <Home size={14} className="fill-gray-400 text-gray-400 hover:fill-gray-600 hover:text-gray-600" />
              </Link>
            <ChevronRight size={12} />
            <Link href="/universities" className="hover:text-gray-600 transition-colors">Universities</Link>
            <ChevronRight size={12} />
            {uniSlug && <><Link href={`/universities/${course.universityCountry?.toLowerCase().replace(/\s+/g, '-')}/${uniSlug}`} className="hover:text-gray-600 transition-colors">{course.universityName}</Link><ChevronRight size={12} /></>}
            <span className="text-gray-700 font-medium truncate">{course.name}</span>
          </nav>
        </div>
      </section>

      {/* Hero — sticky on scroll */}
      <div style={{ position: 'sticky', top: 0, zIndex: 20 }} className="bg-white border-b border-gray-100 shadow-sm">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="py-3 lg:py-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 mb-1">
                  <span className="inline-flex items-center rounded-full bg-[#C41E3A]/10 px-2 py-0.5 text-[11px] font-semibold text-[#C41E3A]">{levelLabels[course.level] ?? course.level}</span>
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">{course.subject}</span>
                  {course.expressOffer && <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700"><Star size={10} />Express</span>}
                </div>
                <h1 className="text-lg font-bold text-gray-900 truncate lg:text-xl">{course.name}</h1>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-0.5 text-xs text-gray-500">
                  {course.universityName && <span className="flex items-center gap-1"><GraduationCap size={12} className="text-[#C41E3A]" />{course.universityName}</span>}
                  {course.universityCountry && <span className="flex items-center gap-1"><MapPin size={12} />{course.universityCity}, {course.universityCountry}</span>}
                  {course.modeOfStudy && <span>{modeLabels[course.modeOfStudy]}</span>}
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right"><p className="text-xs text-gray-400">Duration</p><p className="text-sm font-bold text-gray-900">{course.duration} {course.durationUnit?.toLowerCase()}</p></div>
                {course.tuitionFee > 0 && <div className="text-right"><p className="text-xs text-gray-400">Per Year</p><p className="text-sm font-bold text-gray-900">{formatCurrency(course.tuitionFee, course.currency)}</p></div>}
              </div>
            </div>
          </div>
        </div>
      </div>
      <main className="flex-grow bg-gray-50">
        <section className="py-8 lg:py-12">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

              {/* LEFT - Content */}
              <div className="lg:col-span-2 space-y-5 order-2 lg:order-1">

                {/* About */}
                <FadeUp>
                  <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm">
                    <h2 className="flex items-center gap-2.5 text-lg font-bold text-gray-900"><BookOpen size={20} className="text-[#C41E3A]" />About This Course</h2>
                    <div className="mt-4 text-sm leading-7 text-gray-600 space-y-3 text-justify" dangerouslySetInnerHTML={{ __html: course.description || 'No description available.' }} />
                  </div>
                </FadeUp>

                {highlights.length > 0 && (
                  <FadeUp>
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm">
                      <h2 className="flex items-center gap-2.5 text-lg font-bold text-gray-900"><Award size={20} className="text-amber-500" />Key Program Highlights</h2>
                      <ul className="mt-4 space-y-3">
                        {highlights.map((h: string, i: number) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-gray-700"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-green-500" />{h}</li>
                        ))}
                      </ul>
                    </div>
                  </FadeUp>
                )}

                {modules.length > 0 && (
                  <FadeUp>
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm">
                      <h2 className="flex items-center gap-2.5 text-lg font-bold text-gray-900"><Layers size={20} className="text-purple-500" />Course Modules</h2>
                      <div className="mt-4 space-y-5">
                        {Object.entries(moduleGroups).map(([term, groups]) => (
                          <div key={term}>
                            <h3 className="text-sm font-semibold text-[#C41E3A] mb-2">{term}</h3>
                            {groups.core.length > 0 && <div className="mb-2"><span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Core Modules</span><div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-2">{groups.core.map((m: any) => <div key={m.id} className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700"><span className="h-1.5 w-1.5 rounded-full bg-[#C41E3A] shrink-0" />{m.name}</div>)}</div></div>}
                            {groups.optional.length > 0 && <div><span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Optional Modules</span><div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-2">{groups.optional.map((m: any) => <div key={m.id} className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700"><span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />{m.name}</div>)}</div></div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </FadeUp>
                )}

                {requirements.length > 0 && (
                  <FadeUp>
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm">
                      <h2 className="flex items-center gap-2.5 text-lg font-bold text-gray-900"><FileText size={20} className="text-blue-500" />Requirements</h2>
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {requirements.map((r: string, i: number) => (
                          <div key={i} className="flex items-start gap-2.5 rounded-lg border border-gray-100 bg-gray-50/60 p-3 text-sm text-gray-700">
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C41E3A]" />
                            <div>
                              <span className="font-medium text-gray-900">{r.includes(':') ? r.split(':')[0] : ''}</span>
                              <span className="text-gray-600">{r.includes(':') ? r.slice(r.indexOf(':')) : r}</span>
      </div>

      {/* Main */}
                          </div>
                        ))}
                      </div>
                    </div>
                  </FadeUp>
                )}

                {course.professionalAccreditation && (
                  <FadeUp>
                    <div className="rounded-2xl border border-green-200 bg-green-50/50 p-5 sm:p-6 shadow-sm">
                      <h2 className="flex items-center gap-2.5 text-lg font-bold text-green-800"><Award size={20} />Professional Accreditation</h2>
                      <p className="mt-3 text-sm text-green-700 leading-relaxed">{course.professionalAccreditation}</p>
                    </div>
                  </FadeUp>
                )}
              </div>

              {/* RIGHT - Sidebar */}
              <div className="space-y-4 order-1 lg:order-2">
                {/* Quick Facts Card */}
                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-[#760B16] to-[#A91324] px-5 py-3.5">
                    <h3 className="text-sm font-bold text-white">Application Details</h3>
                  </div>
                  <div className="p-5 space-y-3.5">
                    {course.applicationDeadline && <div className="flex items-center gap-3"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50"><Clock size={14} className="text-red-500" /></div><div className="flex-1 min-w-0"><p className="text-[11px] text-gray-400 uppercase tracking-wider">Apply By</p><p className="text-sm font-semibold text-gray-900">{new Date(course.applicationDeadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p></div></div>}
                    {course.startDate && <div className="flex items-center gap-3"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50"><CalendarDays size={14} className="text-blue-500" /></div><div className="flex-1 min-w-0"><p className="text-[11px] text-gray-400 uppercase tracking-wider">Start Date</p><p className="text-sm font-semibold text-gray-900">{new Date(course.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p></div></div>}
                    {course.campus && <div className="flex items-center gap-3"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-50"><Building2 size={14} className="text-purple-500" /></div><div className="flex-1 min-w-0"><p className="text-[11px] text-gray-400 uppercase tracking-wider">Campus</p><p className="text-sm font-semibold text-gray-900">{course.campus}</p></div></div>}
                    {course.offerResponseTime && <div className="flex items-center gap-3"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-50"><CheckCircle2 size={14} className="text-green-500" /></div><div className="flex-1 min-w-0"><p className="text-[11px] text-gray-400 uppercase tracking-wider">Offer Response</p><p className="text-sm font-semibold text-gray-900">{course.offerResponseTime}</p></div></div>}
                    {course.applicationFee != null && <div className="flex items-center gap-3"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50"><DollarSign size={14} className="text-amber-500" /></div><div className="flex-1 min-w-0"><p className="text-[11px] text-gray-400 uppercase tracking-wider">Application Fee</p><p className="text-sm font-semibold text-gray-900">{course.currency} {course.applicationFee}</p></div></div>}
                    <div className="flex items-center gap-3"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50"><Monitor size={14} className="text-indigo-500" /></div><div className="flex-1 min-w-0"><p className="text-[11px] text-gray-400 uppercase tracking-wider">Mode of Study</p><p className="text-sm font-semibold text-gray-900">{modeLabels[course.modeOfStudy] || '—'}</p></div></div>
                  </div>
                </div>

                {/* Admission Flags */}
                {(course.backlogsAccepted || course.gapYearsAccepted || course.englishTestWaiver || course.expressOffer) && (
                  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-900 mb-3">Admission</h3>
                    <div className="space-y-2">
                      {course.backlogsAccepted && <div className="flex items-center gap-2.5 text-sm"><div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-green-50"><CheckCircle2 size={14} className="text-green-500" /></div><span className="text-gray-700">Backlogs accepted</span></div>}
                      {course.gapYearsAccepted && <div className="flex items-center gap-2.5 text-sm"><div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-green-50"><CheckCircle2 size={14} className="text-green-500" /></div><span className="text-gray-700">Gap years accepted</span></div>}
                      {course.englishTestWaiver && <div className="flex items-center gap-2.5 text-sm"><div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-green-50"><CheckCircle2 size={14} className="text-green-500" /></div><span className="text-gray-700">English test waiver available</span></div>}
                      {course.expressOffer && <div className="flex items-center gap-2.5 text-sm"><div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-50"><Star size={14} className="text-amber-500" /></div><span className="text-gray-700">Express Offer available</span></div>}
                    </div>
                  </div>
                )}

                {/* Intakes */}
                {intakes.length > 0 && (
                  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-900 mb-3">Intake Dates</h3>
                    <div className="space-y-2">
                      {intakes.map((i: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between rounded-xl border border-gray-100 px-3.5 py-2.5">
                          <span className="text-sm font-semibold text-gray-900">{new Date(i.intakeDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                          {i.applyByDate && <span className="text-[11px] text-gray-500">Apply by {new Date(i.applyByDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* University Card */}
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-100 overflow-hidden bg-white">
                      {course.universityLogo ? <img src={course.universityLogo} alt="" className="h-full w-full object-contain p-1.5" /> : <Building2 size={18} className="text-gray-300" />}
                    </div>
                    <div className="min-w-0"><p className="text-sm font-semibold text-gray-900 truncate">{course.universityName}</p><p className="text-[11px] text-gray-500">{course.universityCity}, {course.universityCountry}</p></div>
                  </div>
                  {course.universityWebsite && <a href={course.universityWebsite} target="_blank" className="flex items-center justify-center gap-1.5 w-full rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"><ExternalLink size={13} />Visit University Website</a>}
                </div>

                {/* Scholarship */}
                {course.hasScholarship && course.scholarshipDetails && (
                  <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 p-5">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-amber-800"><Award size={16} />Scholarship Available</h3>
                    <p className="mt-2 text-sm text-amber-700 leading-relaxed">{course.scholarshipDetails}</p>
                  </div>
                )}

                {/* CTA */}
                <a href="#" className="flex items-center justify-center gap-2 w-full rounded-2xl bg-gradient-to-r from-[#760B16] to-[#A91324] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5">
                  <Send size={16} /> Apply Now <ChevronRight size={15} />
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
