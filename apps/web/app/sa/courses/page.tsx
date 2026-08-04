'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search, Plus, Pencil, Trash2, BookOpen, GraduationCap, RefreshCw, AlertTriangle,
  Building2, DollarSign, Globe, Clock, CheckCircle, XCircle, Shield, FileText,
  Layers, CalendarDays, MapPin, Monitor, Award, Star, Link2,
} from 'lucide-react'
import { trpc } from '@/lib/trpc-client'
import { SABadge } from '@/components/super-admin/shared/SABadge'
import { SAButton } from '@/components/super-admin/shared/SAButton'
import { SAInput } from '@/components/super-admin/shared/SAInput'
import { SATooltip } from '@/components/super-admin/shared/SATooltip'
import { QuillEditor } from '@/components/super-admin/shared/QuillEditor'

const LEVELS = ['UNDERGRADUATE', 'POSTGRADUATE', 'PHD', 'DIPLOMA', 'CERTIFICATE', 'FOUNDATION']
const MODE_OPTIONS = ['FULL_TIME', 'PART_TIME', 'ONLINE', 'HYBRID']

const defaultForm = {
  universityId: '', name: '', slug: '', subject: '',
  level: 'POSTGRADUATE' as string, duration: '1', tuitionFee: '0',
  currency: 'USD', language: 'English', description: '',
  campus: '', modeOfStudy: 'FULL_TIME' as string,
  highlights: '', professionalAccreditation: '',
  offerResponseTime: '', applicationFee: '',
  brochureUrl: '',
  isActive: true, hasScholarship: false, scholarshipDetails: '',
  backlogsAccepted: false, gapYearsAccepted: false,
  englishTestWaiver: false, expressOffer: false,
}

export default function SACoursesPage() {
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ ...defaultForm })

  const utils = trpc.useUtils()
  const { data: courseList, isLoading, error } = trpc.admin.courses.list.useQuery({ search: search || undefined })
  const { data: uniList } = trpc.admin.universities.list.useQuery({})

  const createMutation = trpc.admin.courses.create.useMutation({
    onSuccess: () => { utils.admin.courses.list.invalidate(); resetForm() },
  })
  const updateMutation = trpc.admin.courses.update.useMutation({
    onSuccess: () => { utils.admin.courses.list.invalidate(); resetForm() },
  })
  const deleteMutation = trpc.admin.courses.delete.useMutation({
    onSuccess: () => utils.admin.courses.list.invalidate(),
  })

  function resetForm() {
    setShowForm(false)
    setEditingId(null)
    setForm({ ...defaultForm })
  }

  function startEdit(course: any) {
    setEditingId(course.id)
    setForm({
      universityId: course.universityId || course.university?.id || '',
      name: course.name || '', slug: course.slug || '', subject: course.subject || '',
      level: course.level || 'POSTGRADUATE',
      duration: course.duration?.toString() || '1',
      tuitionFee: course.tuitionFee?.toString() || '0',
      currency: course.currency || 'USD', language: course.language || 'English',
      description: course.description || '',
      campus: course.campus || '', modeOfStudy: course.modeOfStudy || 'FULL_TIME',
      highlights: Array.isArray(course.highlights) ? course.highlights.join('\n') : (course.highlights || ''),
      professionalAccreditation: course.professionalAccreditation || '',
      offerResponseTime: course.offerResponseTime || '',
      applicationFee: course.applicationFee?.toString() || '',
      brochureUrl: course.brochureUrl || '',
      isActive: course.isActive ?? true,
      hasScholarship: course.hasScholarship || false,
      scholarshipDetails: course.scholarshipDetails || '',
      backlogsAccepted: course.backlogsAccepted || false,
      gapYearsAccepted: course.gapYearsAccepted || false,
      englishTestWaiver: course.englishTestWaiver || false,
      expressOffer: course.expressOffer || false,
    })
    setShowForm(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const data: any = {
      universityId: form.universityId,
      name: form.name, slug: form.slug, subject: form.subject,
      level: form.level as any, duration: parseInt(form.duration) || 1,
      tuitionFee: parseInt(form.tuitionFee) || 0,
      currency: form.currency, language: form.language, description: form.description,
      campus: form.campus || undefined,
      modeOfStudy: form.modeOfStudy as any,
      highlights: form.highlights ? form.highlights.split('\n').map((s) => s.trim()).filter(Boolean) : [],
      professionalAccreditation: form.professionalAccreditation || undefined,
      offerResponseTime: form.offerResponseTime || undefined,
      applicationFee: form.applicationFee ? parseFloat(form.applicationFee) : undefined,
      brochureUrl: form.brochureUrl || undefined,
      isActive: form.isActive,
      hasScholarship: form.hasScholarship,
      scholarshipDetails: form.scholarshipDetails || undefined,
      backlogsAccepted: form.backlogsAccepted,
      gapYearsAccepted: form.gapYearsAccepted,
      englishTestWaiver: form.englishTestWaiver,
      expressOffer: form.expressOffer,
    }
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...data } as any)
    } else {
      createMutation.mutate(data as any)
    }
  }

  function setField(key: string, value: any) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function toggleField(key: string) {
    setForm((prev) => ({ ...prev, [key]: !(prev as any)[key] }))
  }

  return (
    <div className="mx-auto max-w-[1440px] space-y-4">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold tracking-tight" style={{ color: '#E8EAF2', fontFamily: "'Space Grotesk', sans-serif" }}>Courses</h1>
          <p className="mt-0.5 text-[13px]" style={{ color: '#8890A8' }}>Manage course catalog across partner universities</p>
        </div>
        <SAButton variant="primary" size="md" onClick={() => { resetForm(); setShowForm(true) }}>
          <Plus size={15} /> Add Course
        </SAButton>
      </motion.div>

      {/* Create/Edit Form — Full Single Page */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border p-6" style={{ background: '#161B2E', borderColor: '#262C42' }}>
          <h2 className="mb-5 text-[16px] font-semibold" style={{ color: '#E8EAF2', fontFamily: "'Space Grotesk', sans-serif" }}>
            {editingId ? 'Edit Course' : 'Add New Course'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* ── Section: Basic Information ── */}
            <div>
              <div className="mb-3 flex items-center gap-2 pb-2 border-b" style={{ borderColor: '#262C42' }}>
                <BookOpen size={14} style={{ color: '#E8A33D' }} />
                <span className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: '#E8A33D' }}>Basic Information</span>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] font-medium" style={{ color: '#8890A8' }}>University *</span>
                  <select value={form.universityId} onChange={(e) => setField('universityId', e.target.value)} required
                    className="rounded-md border px-3 py-1.5 text-[13px] outline-none" style={{ background: '#0E1220', borderColor: '#262C42', color: '#E8EAF2' }}>
                    <option value="">Select university...</option>
                    {(uniList ?? []).map((u: any) => (
                      <option key={u.id} value={u.id} style={{ background: '#161B2E' }}>{u.name} ({u.country})</option>
                    ))}
                  </select>
                </label>
                {[
                  { label: 'Course Name', key: 'name', required: true },
                  { label: 'URL Slug', key: 'slug', required: true },
                  { label: 'Subject', key: 'subject', required: true },
                  { label: 'Campus', key: 'campus', placeholder: 'e.g. Aston Birmingham Campus' },
                ].map((f) => (
                  <label key={f.key} className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium" style={{ color: '#8890A8' }}>{f.label}{f.required ? ' *' : ''}</span>
                    <input value={(form as any)[f.key]} onChange={(e) => setField(f.key, e.target.value)} required={f.required}
                      placeholder={f.placeholder || f.label}
                      className="rounded-md border px-3 py-1.5 text-[13px] outline-none" style={{ background: '#0E1220', borderColor: '#262C42', color: '#E8EAF2' }} />
                  </label>
                ))}
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] font-medium" style={{ color: '#8890A8' }}>Level *</span>
                  <select value={form.level} onChange={(e) => setField('level', e.target.value)}
                    className="rounded-md border px-3 py-1.5 text-[13px] outline-none" style={{ background: '#0E1220', borderColor: '#262C42', color: '#E8EAF2' }}>
                    {LEVELS.map((l) => <option key={l} value={l} style={{ background: '#161B2E' }}>{l.replace(/_/g, ' ')}</option>)}
                  </select>
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] font-medium" style={{ color: '#8890A8' }}>Mode of Study</span>
                  <select value={form.modeOfStudy} onChange={(e) => setField('modeOfStudy', e.target.value)}
                    className="rounded-md border px-3 py-1.5 text-[13px] outline-none" style={{ background: '#0E1220', borderColor: '#262C42', color: '#E8EAF2' }}>
                    {MODE_OPTIONS.map((m) => <option key={m} value={m} style={{ background: '#161B2E' }}>{m.replace(/_/g, ' ')}</option>)}
                  </select>
                </label>
                <label className="flex flex-col gap-1 col-span-full">
                  <span className="text-[11px] font-medium" style={{ color: '#8890A8' }}>Description *</span>
                  <QuillEditor
                    value={form.description}
                    onChange={(v) => setField('description', v)}
                    placeholder="Write a detailed course description..."
                    minHeight={180}
                  />
                </label>
              </div>
            </div>

            {/* ── Section: Study Details ── */}
            <div>
              <div className="mb-3 flex items-center gap-2 pb-2 border-b" style={{ borderColor: '#262C42' }}>
                <DollarSign size={14} style={{ color: '#4FD1A5' }} />
                <span className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: '#4FD1A5' }}>Study Details</span>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { label: 'Duration (years)', key: 'duration', type: 'number', min: 1 },
                  { label: 'Tuition Fee', key: 'tuitionFee', type: 'number', min: 0 },
                  { label: 'Currency', key: 'currency', placeholder: 'GBP, USD, EUR...' },
                  { label: 'Language', key: 'language' },
                  { label: 'Brochure URL', key: 'brochureUrl', placeholder: 'https://...' },
                ].map((f) => (
                  <label key={f.key} className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium" style={{ color: '#8890A8' }}>{f.label}</span>
                    <input type={f.type || 'text'} value={(form as any)[f.key]} onChange={(e) => setField(f.key, e.target.value)}
                      min={f.min} placeholder={f.placeholder || f.label}
                      className="rounded-md border px-3 py-1.5 text-[13px] outline-none" style={{ background: '#0E1220', borderColor: '#262C42', color: '#E8EAF2' }} />
                  </label>
                ))}
              </div>
            </div>

            {/* ── Section: Admission & Offers ── */}
            <div>
              <div className="mb-3 flex items-center gap-2 pb-2 border-b" style={{ borderColor: '#262C42' }}>
                <CheckCircle size={14} style={{ color: '#a78bfa' }} />
                <span className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: '#a78bfa' }}>Admission & Offers</span>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { label: 'Application Fee', key: 'applicationFee', type: 'number', min: 0, placeholder: 'e.g. 50' },
                  { label: 'Offer Response Time', key: 'offerResponseTime', placeholder: 'e.g. 2 days, 24 hours' },
                  { label: 'Professional Accreditation', key: 'professionalAccreditation', placeholder: 'e.g. CMI Level 7, AACSB' },
                ].map((f) => (
                  <label key={f.key} className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium" style={{ color: '#8890A8' }}>{f.label}</span>
                    <input type={f.type || 'text'} value={(form as any)[f.key]} onChange={(e) => setField(f.key, e.target.value)}
                      min={f.min} placeholder={f.placeholder || f.label}
                      className="rounded-md border px-3 py-1.5 text-[13px] outline-none" style={{ background: '#0E1220', borderColor: '#262C42', color: '#E8EAF2' }} />
                  </label>
                ))}
              </div>

              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                {[
                  { key: 'backlogsAccepted', icon: XCircle, label: 'Backlogs Accepted' },
                  { key: 'gapYearsAccepted', icon: CalendarDays, label: 'Gap Years Accepted' },
                  { key: 'englishTestWaiver', icon: Globe, label: 'English Test Waiver' },
                  { key: 'expressOffer', icon: Star, label: 'Express Offer Available' },
                ].map(({ key, icon: Icon, label }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={(form as any)[key]} onChange={() => toggleField(key)}
                      className="accent-[#E8A33D]" />
                    <Icon size={13} style={{ color: (form as any)[key] ? '#E8A33D' : '#8890A8' }} />
                    <span className="text-[12px]" style={{ color: (form as any)[key] ? '#E8EAF2' : '#8890A8' }}>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* ── Section: Program Highlights ── */}
            <div>
              <div className="mb-3 flex items-center gap-2 pb-2 border-b" style={{ borderColor: '#262C42' }}>
                <Award size={14} style={{ color: '#E8A33D' }} />
                <span className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: '#E8A33D' }}>Program Highlights</span>
              </div>
              <label className="flex flex-col gap-1">
                <span className="text-[11px] font-medium" style={{ color: '#8890A8' }}>Key Highlights (one per line)</span>
                <textarea value={form.highlights} onChange={(e) => setField('highlights', e.target.value)} rows={4}
                  placeholder={`Recognised for quality: Triple accreditation\nTop 5% globally (QS World Rankings 2027)\n4th in the UK (Eduniversal Best Masters 2025)`}
                  className="rounded-md border px-3 py-1.5 text-[13px] outline-none resize-y"
                  style={{ background: '#0E1220', borderColor: '#262C42', color: '#E8EAF2', minHeight: 80 }} />
              </label>
            </div>

            {/* ── Section: Toggles ── */}
            <div>
              <div className="mb-3 flex items-center gap-2 pb-2 border-b" style={{ borderColor: '#262C42' }}>
                <Shield size={14} style={{ color: '#8890A8' }} />
                <span className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: '#8890A8' }}>Status & Scholarship</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isActive} onChange={() => toggleField('isActive')}
                    className="accent-[#4FD1A5]" />
                  <span className="text-[12px]" style={{ color: form.isActive ? '#E8EAF2' : '#8890A8' }}>Active / Published</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.hasScholarship} onChange={() => toggleField('hasScholarship')}
                    className="accent-[#E8A33D]" />
                  <span className="text-[12px]" style={{ color: form.hasScholarship ? '#E8EAF2' : '#8890A8' }}>Has Scholarship</span>
                </label>
                {form.hasScholarship && (
                  <input value={form.scholarshipDetails} onChange={(e) => setField('scholarshipDetails', e.target.value)}
                    placeholder="Scholarship details..."
                    className="rounded-md border px-3 py-1.5 text-[12px] outline-none flex-1 min-w-[200px]"
                    style={{ background: '#0E1220', borderColor: '#262C42', color: '#E8EAF2' }} />
                )}
              </div>
            </div>

            {/* ── Submit ── */}
            <div className="flex items-center gap-3 pt-2 border-t" style={{ borderColor: '#262C42' }}>
              <SAButton type="submit" variant="primary" size="md" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? 'Saving...' : editingId ? 'Update Course' : 'Create Course'}
              </SAButton>
              <SAButton type="button" variant="ghost" size="md" onClick={resetForm}>Cancel</SAButton>
            </div>
          </form>
        </motion.div>
      )}

      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }} className="flex items-center gap-3">
        <div className="w-[300px]">
          <SAInput placeholder="Search courses..." icon={<Search size={14} />} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <SAButton variant="ghost" size="sm" onClick={() => { setSearch(''); utils.admin.courses.list.invalidate() }}>
          <RefreshCw size={12} /> Reset
        </SAButton>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }}
        className="overflow-hidden rounded-xl border" style={{ background: '#161B2E', borderColor: '#262C42' }}>
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2" style={{ borderColor: '#E8A33D', borderTopColor: 'transparent' }} />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <AlertTriangle size={28} style={{ color: '#F0625B' }} />
            <p className="mt-3 text-[14px] font-medium" style={{ color: '#F0625B' }}>Failed to load courses</p>
            <SAButton variant="secondary" size="sm" className="mt-3" onClick={() => utils.admin.courses.list.invalidate()}>Retry</SAButton>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: '#161B2E' }}>
                  {['Name', 'University', 'Level', 'Mode', 'Fee', 'Express', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#8890A8', fontFamily: "'JetBrains Mono', monospace" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="[&_tr]:border-t [&_tr]:border-[#262C42]/50">
                {(courseList ?? []).map((course: any) => (
                  <tr key={course.id} className="transition-colors hover:bg-[#E8A33D]/[0.04]">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg shrink-0" style={{ background: 'rgba(167, 139, 250, 0.08)' }}>
                          <BookOpen size={14} style={{ color: '#a78bfa' }} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[13px] font-medium block truncate max-w-[220px]" style={{ color: '#E8EAF2' }}>{course.name}</span>
                          <span className="text-[11px]" style={{ color: '#8890A8' }}>{course.subject}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-[13px]" style={{ color: '#8890A8' }}>{course.university?.name || '—'}</td>
                    <td className="px-3 py-3">
                      <SABadge variant="route">{course.level?.replace(/_/g, ' ') ?? '—'}</SABadge>
                    </td>
                    <td className="px-3 py-3 text-[12px]" style={{ color: '#8890A8' }}>
                      {course.modeOfStudy ? course.modeOfStudy.replace(/_/g, ' ') : '—'}
                    </td>
                    <td className="px-3 py-3 text-[12px]" style={{ color: '#E8EAF2', fontFamily: "'JetBrains Mono', monospace" }}>
                      {course.currency} {course.tuitionFee?.toLocaleString()}
                    </td>
                    <td className="px-3 py-3">
                      {course.expressOffer ? <SABadge variant="success" dot>Express</SABadge> : <span className="text-[11px]" style={{ color: '#8890A8' }}>—</span>}
                    </td>
                    <td className="px-3 py-3">
                      <SABadge variant={course.isActive ? 'success' : 'neutral'} dot>{course.isActive ? 'Active' : 'Inactive'}</SABadge>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1">
                        <SATooltip content="Edit">
                          <button onClick={() => startEdit(course)} className="flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-white/[0.06]" style={{ color: '#E8A33D' }}>
                            <Pencil size={14} />
                          </button>
                        </SATooltip>
                        <SATooltip content="Delete">
                          <button onClick={() => { if (confirm(`Delete "${course.name}"?`)) deleteMutation.mutate({ id: course.id }) }} className="flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-[#F0625B]/10" style={{ color: '#F0625B' }}>
                            <Trash2 size={14} />
                          </button>
                        </SATooltip>
                      </div>
                    </td>
                  </tr>
                ))}
                {(!courseList || courseList.length === 0) && (
                  <tr>
                    <td colSpan={8} className="py-20 text-center">
                      <GraduationCap size={28} style={{ color: '#8890A8', margin: '0 auto 8px' }} />
                      <p className="text-[13px]" style={{ color: '#8890A8' }}>
                        {search ? 'No courses match your search' : 'No courses yet. Add your first one.'}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  )
}
