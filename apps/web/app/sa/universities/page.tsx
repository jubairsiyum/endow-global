'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus, Pencil, Trash2, Building2, Globe, MapPin, RefreshCw, AlertTriangle } from 'lucide-react'
import { trpc } from '@/lib/trpc-client'
import { SABadge } from '@/components/super-admin/shared/SABadge'
import { SAButton } from '@/components/super-admin/shared/SAButton'
import { SAInput } from '@/components/super-admin/shared/SAInput'
import { SATooltip } from '@/components/super-admin/shared/SATooltip'

export default function SAUniversitiesPage() {
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '', slug: '', country: '', city: '', description: '',
    website: '', ranking: '', established: '', logo: '', isActive: true,
  })

  const utils = trpc.useUtils()
  const { data: uniList, isLoading, error } = trpc.admin.universities.list.useQuery({
    search: search || undefined,
  })

  const createMutation = trpc.admin.universities.create.useMutation({
    onSuccess: () => {
      utils.admin.universities.list.invalidate()
      resetForm()
    },
  })

  const updateMutation = trpc.admin.universities.update.useMutation({
    onSuccess: () => {
      utils.admin.universities.list.invalidate()
      resetForm()
    },
  })

  const deleteMutation = trpc.admin.universities.delete.useMutation({
    onSuccess: () => utils.admin.universities.list.invalidate(),
  })

  function resetForm() {
    setShowForm(false)
    setEditingId(null)
    setForm({ name: '', slug: '', country: '', city: '', description: '', website: '', ranking: '', established: '', logo: '', isActive: true })
  }

  function startEdit(uni: any) {
    setEditingId(uni.id)
    setForm({
      name: uni.name, slug: uni.slug, country: uni.country, city: uni.city,
      description: uni.description, website: uni.website || '',
      ranking: uni.ranking?.toString() || '', established: uni.established?.toString() || '',
      logo: uni.logo || '', isActive: uni.isActive,
    })
    setShowForm(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const data = {
      ...form,
      ranking: form.ranking ? parseInt(form.ranking) : undefined,
      established: form.established ? parseInt(form.established) : undefined,
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
            Universities
          </h1>
          <p className="mt-0.5 text-[13px]" style={{ color: '#8890A8' }}>
            Manage partner university catalog
          </p>
        </div>
        <SAButton variant="primary" size="md" onClick={() => { resetForm(); setShowForm(true) }}>
          <Plus size={15} /> Add University
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
            {editingId ? 'Edit University' : 'Add University'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {[
              { label: 'Name', key: 'name', required: true },
              { label: 'Slug', key: 'slug', required: true },
              { label: 'Country', key: 'country', required: true },
              { label: 'City', key: 'city', required: true },
              { label: 'Website', key: 'website' },
              { label: 'QS Ranking', key: 'ranking', type: 'number' },
              { label: 'Est. Year', key: 'established', type: 'number' },
              { label: 'Logo URL', key: 'logo' },
            ].map((f) => (
              <label key={f.key} className="flex flex-col gap-1">
                <span className="text-[11px] font-medium" style={{ color: '#8890A8' }}>
                  {f.label}{f.required ? ' *' : ''}
                </span>
                <input
                  type={f.type || 'text'}
                  value={(form as any)[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  required={f.required}
                  className="rounded-md border px-3 py-1.5 text-[13px] outline-none"
                  style={{
                    background: '#0E1220', borderColor: '#262C42', color: '#E8EAF2',
                  }}
                  placeholder={f.label}
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
                placeholder="Brief description..."
              />
            </label>
            <label className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              />
              <span className="text-[13px]" style={{ color: '#E8EAF2' }}>Active</span>
            </label>
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
          <SAInput
            placeholder="Search universities..."
            icon={<Search size={14} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <SAButton variant="ghost" size="sm" onClick={() => { setSearch(''); utils.admin.universities.list.invalidate() }}>
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
            <p className="mt-3 text-[14px] font-medium" style={{ color: '#F0625B' }}>Failed to load universities</p>
            <SAButton variant="secondary" size="sm" className="mt-3" onClick={() => utils.admin.universities.list.invalidate()}>Retry</SAButton>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: '#161B2E' }}>
                  {['Name', 'Country', 'City', 'Ranking', 'Courses', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#8890A8', fontFamily: "'JetBrains Mono', monospace" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="[&_tr]:border-t [&_tr]:border-[#262C42]/50">
                {(uniList ?? []).map((uni: any) => (
                  <tr key={uni.id} className="transition-colors hover:bg-[#E8A33D]/[0.04]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: 'rgba(79, 209, 165, 0.08)' }}>
                          <Building2 size={14} style={{ color: '#4FD1A5' }} />
                        </div>
                        <span className="text-[13px] font-medium" style={{ color: '#E8EAF2' }}>{uni.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[13px]" style={{ color: '#8890A8' }}>{uni.country}</td>
                    <td className="px-4 py-3 text-[13px]" style={{ color: '#8890A8' }}>{uni.city}</td>
                    <td className="px-4 py-3 text-[13px]" style={{ color: '#E8EAF2', fontFamily: "'JetBrains Mono', monospace" }}>
                      {uni.ranking ? `#${uni.ranking}` : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <SABadge variant="route">{uni.courses?.length ?? 0} courses</SABadge>
                    </td>
                    <td className="px-4 py-3">
                      <SABadge variant={uni.isActive ? 'success' : 'neutral'} dot>
                        {uni.isActive ? 'Active' : 'Inactive'}
                      </SABadge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <SATooltip content="Edit">
                          <button onClick={() => startEdit(uni)} className="flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-white/[0.06]" style={{ color: '#E8A33D' }}>
                            <Pencil size={14} />
                          </button>
                        </SATooltip>
                        <SATooltip content="Delete">
                          <button onClick={() => { if (confirm(`Delete "${uni.name}"?`)) deleteMutation.mutate({ id: uni.id }) }} className="flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-[#F0625B]/10" style={{ color: '#F0625B' }}>
                            <Trash2 size={14} />
                          </button>
                        </SATooltip>
                      </div>
                    </td>
                  </tr>
                ))}
                {(!uniList || uniList.length === 0) && (
                  <tr>
                    <td colSpan={7} className="py-20 text-center">
                      <Building2 size={28} style={{ color: '#8890A8', margin: '0 auto 8px' }} />
                      <p className="text-[13px]" style={{ color: '#8890A8' }}>
                        {search ? 'No universities match your search' : 'No universities yet. Add your first one.'}
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
