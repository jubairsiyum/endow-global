'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus, Pencil, Trash2, BookOpen, GraduationCap, RefreshCw, AlertTriangle } from 'lucide-react'
import { trpc } from '@/lib/trpc-client'
import { SABadge } from '@/components/super-admin/shared/SABadge'
import { SAButton } from '@/components/super-admin/shared/SAButton'
import { SAInput } from '@/components/super-admin/shared/SAInput'
import { SATooltip } from '@/components/super-admin/shared/SATooltip'

const LEVELS = ['UNDERGRADUATE', 'POSTGRADUATE', 'PHD', 'DIPLOMA', 'CERTIFICATE', 'FOUNDATION']

export default function SACoursesPage() {
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    universityId: '', name: '', slug: '', subject: '',
    level: 'POSTGRADUATE' as string, duration: '1', tuitionFee: '0',
    currency: 'USD', language: 'English', description: '',
    isActive: true, hasScholarship: false, scholarshipDetails: '',
  })

  const utils = trpc.useUtils()
  const { data: courseList, isLoading, error } = trpc.admin.courses.list.useQuery({
    search: search || undefined,
  })
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
    setForm({ universityId: '', name: '', slug: '', subject: '', level: 'POSTGRADUATE', duration: '1', tuitionFee: '0', currency: 'USD', language: 'English', description: '', isActive: true, hasScholarship: false, scholarshipDetails: '' })
  }

  function startEdit(course: any) {
    setEditingId(course.id)
    setForm({
      universityId: course.universityId || course.university?.id || '',
      name: course.name, slug: course.slug, subject: course.subject,
      level: course.level, duration: course.duration?.toString() || '1',
      tuitionFee: course.tuitionFee?.toString() || '0',
      currency: course.currency || 'USD', language: course.language || 'English',
      description: course.description || '', isActive: course.isActive,
      hasScholarship: course.hasScholarship || false,
      scholarshipDetails: course.scholarshipDetails || '',
    })
    setShowForm(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const data = {
      ...form,
      duration: parseInt(form.duration),
      tuitionFee: parseInt(form.tuitionFee),
      requirements: [] as string[],
    }
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...data } as any)
    } else {
      createMutation.mutate(data as any)
    }
  }

  return (
    <div className="mx-auto max-w-[1440px] space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-[20px] font-bold tracking-tight" style={{ color: '#E8EAF2', fontFamily: "'Space Grotesk', sans-serif" }}>
            Courses
          </h1>
          <p className="mt-0.5 text-[13px]" style={{ color: '#8890A8' }}>
            Manage course catalog across all partner universities
          </p>
        </div>
        <SAButton variant="primary" size="md" onClick={() => { resetForm(); setShowForm(true) }}>
          <Plus size={15} /> Add Course
        </SAButton>
      </motion.div>

      {/* Create/Edit Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border p-5"
          style={{ background: '#161B2E', borderColor: '#262C42' }}
        >
          <h2 className="text-[15px] font-semibold mb-4" style={{ color: '#E8EAF2', fontFamily: "'Space Grotesk', sans-serif" }}>
            {editingId ? 'Edit Course' : 'Add Course'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-medium" style={{ color: '#8890A8' }}>University *</span>
              <select
                value={form.universityId}
                onChange={(e) => setForm({ ...form, universityId: e.target.value })}
                required
                className="rounded-md border px-3 py-1.5 text-[13px] outline-none"
                style={{ background: '#0E1220', borderColor: '#262C42', color: '#E8EAF2' }}
              >
                <option value="">Select university...</option>
                {(uniList ?? []).map((u: any) => (
                  <option key={u.id} value={u.id} style={{ background: '#161B2E' }}>{u.name} ({u.country})</option>
                ))}
              </select>
            </label>
            {[
              { label: 'Name', key: 'name', required: true },
              { label: 'Slug', key: 'slug', required: true },
              { label: 'Subject', key: 'subject', required: true },
            ].map((f) => (
              <label key={f.key} className="flex flex-col gap-1">
                <span className="text-[11px] font-medium" style={{ color: '#8890A8' }}>{f.label}{f.required ? ' *' : ''}</span>
                <input
                  value={(form as any)[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  required={f.required}
                  className="rounded-md border px-3 py-1.5 text-[13px] outline-none"
                  style={{ background: '#0E1220', borderColor: '#262C42', color: '#E8EAF2' }}
                />
              </label>
            ))}
            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-medium" style={{ color: '#8890A8' }}>Level *</span>
              <select
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
                className="rounded-md border px-3 py-1.5 text-[13px] outline-none"
                style={{ background: '#0E1220', borderColor: '#262C42', color: '#E8EAF2' }}
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l} style={{ background: '#161B2E' }}>{l.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </label>
            {[
              { label: 'Duration (years)', key: 'duration', type: 'number' },
              { label: 'Tuition Fee ($)', key: 'tuitionFee', type: 'number' },
              { label: 'Currency', key: 'currency' },
              { label: 'Language', key: 'language' },
            ].map((f) => (
              <label key={f.key} className="flex flex-col gap-1">
                <span className="text-[11px] font-medium" style={{ color: '#8890A8' }}>{f.label}</span>
                <input
                  type={f.type || 'text'}
                  value={(form as any)[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  className="rounded-md border px-3 py-1.5 text-[13px] outline-none"
                  style={{ background: '#0E1220', borderColor: '#262C42', color: '#E8EAF2' }}
                />
              </label>
            ))}
            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-medium" style={{ color: '#8890A8' }}>Description *</span>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
                rows={2}
                className="rounded-md border px-3 py-1.5 text-[13px] outline-none resize-none"
                style={{ background: '#0E1220', borderColor: '#262C42', color: '#E8EAF2' }}
              />
            </label>
            <div className="flex items-center gap-4 pt-5">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                <span className="text-[13px]" style={{ color: '#E8EAF2' }}>Active</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.hasScholarship} onChange={(e) => setForm({ ...form, hasScholarship: e.target.checked })} />
                <span className="text-[13px]" style={{ color: '#E8EAF2' }}>Scholarship</span>
              </label>
            </div>
            <div className="col-span-full flex items-center gap-2 pt-2">
              <SAButton type="submit" variant="primary" size="sm" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingId ? 'Update' : 'Create'}
              </SAButton>
              <SAButton type="button" variant="ghost" size="sm" onClick={resetForm}>Cancel</SAButton>
            </div>
          </form>
        </motion.div>
      )}

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="flex items-center gap-3"
      >
        <div className="w-[300px]">
          <SAInput placeholder="Search courses..." icon={<Search size={14} />} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <SAButton variant="ghost" size="sm" onClick={() => { setSearch(''); utils.admin.courses.list.invalidate() }}>
          <RefreshCw size={12} /> Reset
        </SAButton>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="overflow-hidden rounded-xl border"
        style={{ background: '#161B2E', borderColor: '#262C42' }}
      >
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
                  {['Name', 'University', 'Subject', 'Level', 'Fee', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#8890A8', fontFamily: "'JetBrains Mono', monospace" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="[&_tr]:border-t [&_tr]:border-[#262C42]/50">
                {(courseList ?? []).map((course: any) => (
                  <tr key={course.id} className="transition-colors hover:bg-[#E8A33D]/[0.04]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: 'rgba(167, 139, 250, 0.08)' }}>
                          <BookOpen size={14} style={{ color: '#a78bfa' }} />
                        </div>
                        <span className="text-[13px] font-medium" style={{ color: '#E8EAF2' }}>{course.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[13px]" style={{ color: '#8890A8' }}>
                      {course.university?.name || '—'}
                    </td>
                    <td className="px-4 py-3 text-[13px]" style={{ color: '#8890A8' }}>{course.subject}</td>
                    <td className="px-4 py-3">
                      <SABadge variant={'route'}>{course.level?.replace(/_/g, ' ') ?? '—'}</SABadge>
                    </td>
                    <td className="px-4 py-3 text-[13px]" style={{ color: '#E8EAF2', fontFamily: "'JetBrains Mono', monospace" }}>
                      {course.currency} {course.tuitionFee?.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <SABadge variant={course.isActive ? 'success' : 'neutral'} dot>
                        {course.isActive ? 'Active' : 'Inactive'}
                      </SABadge>
                    </td>
                    <td className="px-4 py-3">
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
                    <td colSpan={7} className="py-20 text-center">
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
