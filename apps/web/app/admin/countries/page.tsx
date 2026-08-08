'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus, Pencil, Trash2, Globe, RefreshCw, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { trpc } from '@/lib/trpc-client'
import { SABadge } from '@/components/super-admin/shared/SABadge'
import { SAButton } from '@/components/super-admin/shared/SAButton'
import { SAInput } from '@/components/super-admin/shared/SAInput'
import { SATooltip } from '@/components/super-admin/shared/SATooltip'

const CONTINENTS = ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania']

export default function SACountriesPage() {
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingCode, setEditingCode] = useState<string | null>(null)
  const [form, setForm] = useState({ code: '', name: '', flagUrl: '', continent: '' })

  const utils = trpc.useUtils()
  const { data: countryList, isLoading, error } = trpc.admin.countries.list.useQuery({ search: search || undefined })

  const createMutation = trpc.admin.countries.create.useMutation({
    onSuccess: () => { toast.success('Country created'); utils.admin.countries.list.invalidate(); resetForm() },
    onError: (e: any) => toast.error(e?.message || 'Failed to create country'),
  })
  const updateMutation = trpc.admin.countries.update.useMutation({
    onSuccess: () => { toast.success('Country updated'); utils.admin.countries.list.invalidate(); resetForm() },
    onError: (e: any) => toast.error(e?.message || 'Failed to update country'),
  })
  const deleteMutation = trpc.admin.countries.delete.useMutation({
    onSuccess: () => { toast.success('Country deleted'); utils.admin.countries.list.invalidate() },
    onError: (e: any) => toast.error(e?.message || 'Failed to delete country'),
  })

  function resetForm() {
    setShowForm(false); setEditingCode(null)
    setForm({ code: '', name: '', flagUrl: '', continent: '' })
  }

  function startEdit(c: any) {
    setEditingCode(c.code)
    setForm({ code: c.code || '', name: c.name || '', flagUrl: c.flagUrl || '', continent: c.continent || '' })
    setShowForm(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (editingCode) {
      updateMutation.mutate({ code: editingCode, name: form.name, flagUrl: form.flagUrl || undefined, continent: form.continent || undefined } as any)
    } else {
      createMutation.mutate({ code: form.code, name: form.name, flagUrl: form.flagUrl || undefined, continent: form.continent || undefined })
    }
  }

  const is = { background: '#ffffff', borderColor: '#e5e7eb', color: '#111827' } as const

  return (
    <div className="mx-auto max-w-[1440px] space-y-4">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold tracking-tight" style={{ color: '#111827', fontFamily: "'Space Grotesk', sans-serif" }}>Countries</h1>
          <p className="mt-0.5 text-[13px]" style={{ color: '#6b7280' }}>Manage study destination countries</p>
        </div>
        <SAButton variant="primary" size="md" onClick={() => { resetForm(); setShowForm(true) }}><Plus size={15} /> Add Country</SAButton>
      </motion.div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border p-5" style={{ background: '#ffffff', borderColor: '#e5e7eb' }}>
          <h2 className="mb-4 text-[15px] font-semibold" style={{ color: '#111827', fontFamily: "'Space Grotesk', sans-serif" }}>{editingCode ? 'Edit Country' : 'Add Country'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {[{ label: 'ISO Code *', key: 'code', required: true, maxLength: 2, placeholder: 'e.g. KR' }, { label: 'Name *', key: 'name', required: true }, { label: 'Flag URL', key: 'flagUrl', placeholder: 'https://...' }].map((f) => (
              <label key={f.key} className="flex flex-col gap-1">
                <span className="text-[11px] font-medium" style={{ color: '#6b7280' }}>{f.label}</span>
                <input value={(form as any)[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} required={f.required} maxLength={f.maxLength} placeholder={f.placeholder || f.label} className="rounded-md border px-3 py-1.5 text-[13px] outline-none" style={is} />
              </label>
            ))}
            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-medium" style={{ color: '#6b7280' }}>Continent</span>
              <select value={form.continent} onChange={(e) => setForm({ ...form, continent: e.target.value })} className="rounded-md border px-3 py-1.5 text-[13px] outline-none" style={is}>
                <option value="">Select...</option>
                {CONTINENTS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <div className="col-span-full flex items-center gap-2 pt-2">
              <SAButton type="submit" variant="primary" size="sm" disabled={createMutation.isPending || updateMutation.isPending}>{editingCode ? 'Update' : 'Create'}</SAButton>
              <SAButton type="button" variant="ghost" size="sm" onClick={resetForm}>Cancel</SAButton>
            </div>
          </form>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }} className="flex items-center gap-3">
        <div className="w-[300px]"><SAInput placeholder="Search countries..." icon={<Search size={14} />} value={search} onChange={(e) => setSearch(e.target.value)} /></div>
        <SAButton variant="ghost" size="sm" onClick={() => { setSearch(''); utils.admin.countries.list.invalidate() }}><RefreshCw size={12} /> Reset</SAButton>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }} className="overflow-hidden rounded-xl border" style={{ background: '#ffffff', borderColor: '#e5e7eb' }}>
        {isLoading ? (
          <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2" style={{ borderColor: '#E8A33D', borderTopColor: 'transparent' }} /></div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 px-4"><AlertTriangle size={28} style={{ color: '#F0625B' }} /><p className="mt-3 text-[14px] font-medium" style={{ color: '#F0625B' }}>Failed to load countries</p><SAButton variant="secondary" size="sm" className="mt-3" onClick={() => utils.admin.countries.list.invalidate()}>Retry</SAButton></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr style={{ background: '#ffffff' }}>{['Code', 'Name', 'Continent', 'Actions'].map((h) => <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#6b7280', fontFamily: "'JetBrains Mono', monospace" }}>{h}</th>)}</tr></thead>
              <tbody className="[&_tr]:border-t [&_tr]:border-[#e5e7eb]">
                {(countryList ?? []).map((c: any) => (
                  <tr key={c.code} className="transition-colors hover:bg-gray-50">
                    <td className="px-4 py-3"><span className="text-[12px] font-semibold" style={{ color: '#E8A33D', fontFamily: "'JetBrains Mono', monospace" }}>{c.code}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: 'rgba(79,209,165,0.08)' }}><Globe size={14} style={{ color: '#4FD1A5' }} /></div>
                        <span className="text-[13px] font-medium" style={{ color: '#111827' }}>{c.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[13px]" style={{ color: '#6b7280' }}>{c.continent || '—'}</td>
                    <td className="px-4 py-3"><div className="flex items-center gap-1">
                      <SATooltip content="Edit"><button onClick={() => startEdit(c)} className="flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-gray-100" style={{ color: '#E8A33D' }}><Pencil size={14} /></button></SATooltip>
                      <SATooltip content="Delete"><button onClick={() => { if (confirm(`Delete "${c.name}"?`)) deleteMutation.mutate({ code: c.code }) }} className="flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-red-50" style={{ color: '#F0625B' }}><Trash2 size={14} /></button></SATooltip>
                    </div></td>
                  </tr>
                ))}
                {(!countryList || countryList.length === 0) && (<tr><td colSpan={4} className="py-20 text-center"><Globe size={28} style={{ color: '#6b7280', margin: '0 auto 8px' }} /><p className="text-[13px]" style={{ color: '#6b7280' }}>{search ? 'No countries match your search' : 'No countries yet. Add your first one.'}</p></td></tr>)}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  )
}
