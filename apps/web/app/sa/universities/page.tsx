'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search, Plus, Pencil, Trash2, Building2, Globe, MapPin, RefreshCw, AlertTriangle,
  Award, Star, Eye, Image,
} from 'lucide-react'
import { toast } from 'sonner'
import { trpc } from '@/lib/trpc-client'
import { SABadge } from '@/components/super-admin/shared/SABadge'
import { SAButton } from '@/components/super-admin/shared/SAButton'
import { SAInput } from '@/components/super-admin/shared/SAInput'
import { SATooltip } from '@/components/super-admin/shared/SATooltip'
import { QuillEditor } from '@/components/super-admin/shared/QuillEditor'
import { ImageUploader } from '@/components/super-admin/shared/ImageUploader'

const defaultForm = {
  name: '', slug: '', country: '', city: '', description: '',
  website: '', ranking: '', established: '',
  totalStudents: '', internationalPercent: '',
  logo: '', coverImage: '',
  accreditation: '',
  rankingsJson: '',
  isActive: true, featured: false,
}

export default function SAUniversitiesPage() {
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ ...defaultForm })

  const utils = trpc.useUtils()
  const { data: uniList, isLoading, error } = trpc.admin.universities.list.useQuery({ search: search || undefined })

  const createMutation = trpc.admin.universities.create.useMutation({
    onSuccess: () => { toast.success('University created'); utils.admin.universities.list.invalidate(); resetForm() },
    onError: (e: any) => toast.error(e?.message || 'Failed to create university'),
  })
  const updateMutation = trpc.admin.universities.update.useMutation({
    onSuccess: () => { toast.success('University updated'); utils.admin.universities.list.invalidate(); resetForm() },
    onError: (e: any) => toast.error(e?.message || 'Failed to update university'),
  })
  const deleteMutation = trpc.admin.universities.delete.useMutation({
    onSuccess: () => { toast.success('University deleted'); utils.admin.universities.list.invalidate() },
    onError: (e: any) => toast.error(e?.message || 'Failed to delete university'),
  })

  function resetForm() {
    setShowForm(false); setEditingId(null)
    setForm({ ...defaultForm })
  }

  function startEdit(uni: any) {
    setEditingId(uni.id)
    setForm({
      name: uni.name || '', slug: uni.slug || '', country: uni.country || '', city: uni.city || '',
      description: uni.description || '', website: uni.website || '',
      ranking: uni.ranking?.toString() || '', established: uni.established?.toString() || '',
      totalStudents: uni.totalStudents?.toString() || '', internationalPercent: uni.internationalPercent?.toString() || '',
      logo: uni.logo || '', coverImage: uni.coverImage || '',
      accreditation: uni.accreditation || '',
      rankingsJson: Array.isArray(uni.rankings) ? (uni.rankings as any[]).map((r: any) => `${r.body || ''}: ${r.position || ''} (${r.year || ''}) — ${r.category || ''}`).join('\n') : (typeof uni.rankings === 'string' ? uni.rankings : ''),
      isActive: uni.isActive ?? true, featured: uni.featured ?? false,
    })
    setShowForm(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const rankingsData = form.rankingsJson
      ? form.rankingsJson.split('\n').map((line) => {
          const match = line.match(/^(.+?):\s*(.+?)\s*\((\d{4})\)(?:\s*—\s*(.+))?$/)
          if (match) return { body: match[1].trim(), position: match[2].trim(), year: parseInt(match[3]), category: match[4]?.trim() || '' }
          return { body: line.trim(), position: '', year: new Date().getFullYear(), category: '' }
        })
      : []

    const data: any = {
      ...form,
      ranking: form.ranking ? parseInt(form.ranking) : undefined,
      established: form.established ? parseInt(form.established) : undefined,
      totalStudents: form.totalStudents ? parseInt(form.totalStudents) : undefined,
      internationalPercent: form.internationalPercent ? parseFloat(form.internationalPercent) : undefined,
      rankings: rankingsData,
      accreditation: form.accreditation || undefined,
      logo: form.logo || undefined,
      coverImage: form.coverImage || undefined,
      rankingsJson: undefined,
    }
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...data } as any)
    } else {
      createMutation.mutate(data as any)
    }
  }

  function setField(key: string, value: any) { setForm((prev) => ({ ...prev, [key]: value })) }
  function toggleField(key: string) { setForm((prev) => ({ ...prev, [key]: !(prev as any)[key] })) }

  const inputStyle = { background: '#0E1220', borderColor: '#262C42', color: '#E8EAF2' } as const

  return (
    <div className="mx-auto max-w-[1440px] space-y-4">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold tracking-tight" style={{ color: '#E8EAF2', fontFamily: "'Space Grotesk', sans-serif" }}>Universities</h1>
          <p className="mt-0.5 text-[13px]" style={{ color: '#8890A8' }}>Manage partner university catalog</p>
        </div>
        <SAButton variant="primary" size="md" onClick={() => { resetForm(); setShowForm(true) }}><Plus size={15} /> Add University</SAButton>
      </motion.div>

      {/* Create/Edit Form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border p-6" style={{ background: '#161B2E', borderColor: '#262C42' }}>
          <h2 className="mb-5 text-[16px] font-semibold" style={{ color: '#E8EAF2', fontFamily: "'Space Grotesk', sans-serif" }}>{editingId ? 'Edit University' : 'Add New University'}</h2>
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* ── Basic Information ── */}
            <div>
              <div className="mb-3 flex items-center gap-2 pb-2 border-b" style={{ borderColor: '#262C42' }}><Building2 size={14} style={{ color: '#4FD1A5' }} /><span className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: '#4FD1A5' }}>Basic Information</span></div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {[{ label: 'Name', key: 'name', required: true }, { label: 'URL Slug', key: 'slug', required: true }, { label: 'Country', key: 'country', required: true }, { label: 'City', key: 'city', required: true }, { label: 'Website', key: 'website', placeholder: 'https://...' }].map((f) => (
                  <label key={f.key} className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium" style={{ color: '#8890A8' }}>{f.label}{f.required ? ' *' : ''}</span>
                    <input value={(form as any)[f.key]} onChange={(e) => setField(f.key, e.target.value)} required={f.required} placeholder={f.placeholder || f.label} className="rounded-md border px-3 py-1.5 text-[13px] outline-none" style={inputStyle} />
                  </label>
                ))}
                <label className="flex flex-col gap-1 col-span-full">
                  <span className="text-[11px] font-medium" style={{ color: '#8890A8' }}>Description *</span>
                  <QuillEditor value={form.description} onChange={(v) => setField('description', v)} placeholder="Write university description..." minHeight={160} />
                </label>
              </div>
            </div>

            {/* ── Brand Assets ── */}
            <div>
              <div className="mb-3 flex items-center gap-2 pb-2 border-b" style={{ borderColor: '#262C42' }}><Image size={14} style={{ color: '#E8A33D' }} /><span className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: '#E8A33D' }}>Brand Assets</span></div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <ImageUploader value={form.logo} onChange={(v) => setField('logo', v)} label="University Logo" previewHeight={160} />
                <ImageUploader value={form.coverImage} onChange={(v) => setField('coverImage', v)} label="Cover Image" previewHeight={120} />
              </div>
            </div>

            {/* ── Rankings & Stats ── */}
            <div>
              <div className="mb-3 flex items-center gap-2 pb-2 border-b" style={{ borderColor: '#262C42' }}><Award size={14} style={{ color: '#a78bfa' }} /><span className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: '#a78bfa' }}>Rankings & Statistics</span></div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {[{ label: 'QS / Global Ranking', key: 'ranking', type: 'number', placeholder: 'e.g. 32' }, { label: 'Established Year', key: 'established', type: 'number', placeholder: 'e.g. 1824' }, { label: 'Total Students', key: 'totalStudents', type: 'number', placeholder: 'e.g. 40000' }, { label: 'International %', key: 'internationalPercent', type: 'number', step: '0.1', placeholder: 'e.g. 38.5' }].map((f) => (
                  <label key={f.key} className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium" style={{ color: '#8890A8' }}>{f.label}</span>
                    <input type={f.type} value={(form as any)[f.key]} onChange={(e) => setField(f.key, e.target.value)} step={f.step as any} placeholder={f.placeholder} className="rounded-md border px-3 py-1.5 text-[13px] outline-none" style={inputStyle} />
                  </label>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-1 gap-3">
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] font-medium" style={{ color: '#8890A8' }}>Detailed Rankings (one per line: "Body: Position (Year) — Category")</span>
                  <textarea value={form.rankingsJson} onChange={(e) => setField('rankingsJson', e.target.value)} rows={4}
                    placeholder={`QS World Rankings: 32 (2024) — Global\nTimes Higher Education: 25 (2024) — World\nFinancial Times: 15 (2025) — UK Business Schools`}
                    className="rounded-md border px-3 py-1.5 text-[13px] outline-none resize-y" style={{ ...inputStyle, minHeight: 80 }} />
                </label>
              </div>
            </div>

            {/* ── Accreditation & Reputation ── */}
            <div>
              <div className="mb-3 flex items-center gap-2 pb-2 border-b" style={{ borderColor: '#262C42' }}><Star size={14} style={{ color: '#E8A33D' }} /><span className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: '#E8A33D' }}>Accreditation & Reputation</span></div>
              <label className="flex flex-col gap-1">
                <span className="text-[11px] font-medium" style={{ color: '#8890A8' }}>Accreditation Details</span>
                <textarea value={form.accreditation} onChange={(e) => setField('accreditation', e.target.value)} rows={2}
                  placeholder="Triple accredited: AACSB, EQUIS, AMBA. Among 1% of business schools worldwide with triple accreditation."
                  className="rounded-md border px-3 py-1.5 text-[13px] outline-none resize-none" style={{ ...inputStyle, minHeight: 60 }} />
              </label>
            </div>

            {/* ── Status & Visibility ── */}
            <div>
              <div className="mb-3 flex items-center gap-2 pb-2 border-b" style={{ borderColor: '#262C42' }}><Eye size={14} style={{ color: '#8890A8' }} /><span className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: '#8890A8' }}>Status & Visibility</span></div>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isActive} onChange={() => toggleField('isActive')} className="accent-[#4FD1A5]" />
                  <span className="text-[12px]" style={{ color: form.isActive ? '#E8EAF2' : '#8890A8' }}>Active / Published</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={() => toggleField('featured')} className="accent-[#E8A33D]" />
                  <Star size={13} style={{ color: form.featured ? '#E8A33D' : '#8890A8' }} />
                  <span className="text-[12px]" style={{ color: form.featured ? '#E8EAF2' : '#8890A8' }}>Featured University</span>
                </label>
              </div>
            </div>

            {/* ── Submit ── */}
            <div className="flex items-center gap-3 pt-2 border-t" style={{ borderColor: '#262C42' }}>
              <SAButton type="submit" variant="primary" size="md" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? 'Saving...' : editingId ? 'Update University' : 'Create University'}
              </SAButton>
              <SAButton type="button" variant="ghost" size="md" onClick={resetForm}>Cancel</SAButton>
            </div>
          </form>
        </motion.div>
      )}

      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }} className="flex items-center gap-3">
        <div className="w-[300px]"><SAInput placeholder="Search universities..." icon={<Search size={14} />} value={search} onChange={(e) => setSearch(e.target.value)} /></div>
        <SAButton variant="ghost" size="sm" onClick={() => { setSearch(''); utils.admin.universities.list.invalidate() }}><RefreshCw size={12} /> Reset</SAButton>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }} className="overflow-hidden rounded-xl border" style={{ background: '#161B2E', borderColor: '#262C42' }}>
        {isLoading ? (
          <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2" style={{ borderColor: '#E8A33D', borderTopColor: 'transparent' }} /></div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 px-4"><AlertTriangle size={28} style={{ color: '#F0625B' }} /><p className="mt-3 text-[14px] font-medium" style={{ color: '#F0625B' }}>Failed to load universities</p><SAButton variant="secondary" size="sm" className="mt-3" onClick={() => utils.admin.universities.list.invalidate()}>Retry</SAButton></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr style={{ background: '#161B2E' }}>{['Logo', 'Name', 'Country', 'City', 'Ranking', 'Students', 'Accredited', 'Status', 'Actions'].map((h) => <th key={h} className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#8890A8', fontFamily: "'JetBrains Mono', monospace" }}>{h}</th>)}</tr></thead>
              <tbody className="[&_tr]:border-t [&_tr]:border-[#262C42]/50">
                {(uniList ?? []).map((uni: any) => (
                  <tr key={uni.id} className="transition-colors hover:bg-[#E8A33D]/[0.04]">
                    <td className="px-3 py-3">
                      <div className="h-8 w-8 relative rounded-lg overflow-hidden border flex items-center justify-center shrink-0" style={{ borderColor: '#262C42', background: '#0E1220' }}>
                        <Building2 size={14} style={{ color: '#4FD1A5' }} />
                        {uni.logo && <img src={uni.logo} alt="" className="absolute inset-0 h-full w-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-medium block truncate max-w-[200px]" style={{ color: '#E8EAF2' }}>{uni.name}</span>
                        {uni.featured && <Star size={11} style={{ color: '#E8A33D' }} />}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-[12px]" style={{ color: '#8890A8' }}><div className="flex items-center gap-1"><Globe size={11} />{uni.country}</div></td>
                    <td className="px-3 py-3 text-[12px]" style={{ color: '#8890A8' }}><div className="flex items-center gap-1"><MapPin size={11} />{uni.city}</div></td>
                    <td className="px-3 py-3 text-[12px]" style={{ color: '#E8EAF2', fontFamily: "'JetBrains Mono', monospace" }}>{uni.ranking ? `#${uni.ranking}` : '—'}</td>
                    <td className="px-3 py-3 text-[12px]" style={{ color: '#E8EAF2' }}>{uni.totalStudents?.toLocaleString() || '—'}</td>
                    <td className="px-3 py-3">{uni.accreditation ? <SABadge variant="success">Accredited</SABadge> : <span className="text-[11px]" style={{ color: '#8890A8' }}>—</span>}</td>
                    <td className="px-3 py-3"><SABadge variant={uni.isActive ? 'success' : 'neutral'} dot>{uni.isActive ? 'Active' : 'Inactive'}</SABadge></td>
                    <td className="px-3 py-3"><div className="flex items-center gap-1">
                      <SATooltip content="Edit"><button onClick={() => startEdit(uni)} className="flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-white/[0.06]" style={{ color: '#E8A33D' }}><Pencil size={14} /></button></SATooltip>
                      <SATooltip content="Delete"><button onClick={() => { if (confirm(`Delete "${uni.name}"?`)) deleteMutation.mutate({ id: uni.id }) }} className="flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-[#F0625B]/10" style={{ color: '#F0625B' }}><Trash2 size={14} /></button></SATooltip>
                    </div></td>
                  </tr>
                ))}
                {(!uniList || uniList.length === 0) && (<tr><td colSpan={9} className="py-20 text-center"><Building2 size={28} style={{ color: '#8890A8', margin: '0 auto 8px' }} /><p className="text-[13px]" style={{ color: '#8890A8' }}>{search ? 'No universities match your search' : 'No universities yet. Add your first one.'}</p></td></tr>)}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  )
}
