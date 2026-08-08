'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus, Pencil, Trash2, Building2, MapPin, Globe, RefreshCw, AlertTriangle } from 'lucide-react'
import { trpc } from '@/lib/trpc-client'
import { SABadge } from '@/components/super-admin/shared/SABadge'
import { SAButton } from '@/components/super-admin/shared/SAButton'
import { SAInput } from '@/components/super-admin/shared/SAInput'
import { SATooltip } from '@/components/super-admin/shared/SATooltip'

const STATUS_OPTIONS = ['ACTIVE', 'INACTIVE', 'SETUP', 'CLOSED'] as const

const STATUS_VARIANT: Record<string, 'success' | 'neutral' | 'route' | 'alert'> = {
 ACTIVE: 'success',
 INACTIVE: 'neutral',
 SETUP: 'route',
 CLOSED: 'alert',
}

export default function SABranchesPage() {
 const [search, setSearch] = useState('')
 const [showForm, setShowForm] = useState(false)
 const [editingId, setEditingId] = useState<string | null>(null)
 const [form, setForm] = useState({
 code: '', name: '', country: '', city: '',
 address: '', phone: '', email: '', status: 'ACTIVE' as string,
 managerName: '', counselors: '0', applications: '0',
 })

 const utils = trpc.useUtils()
 const { data: branchList, isLoading, error } = trpc.admin.branches.list.useQuery({
 search: search || undefined,
 })

 const createMutation = trpc.admin.branches.create.useMutation({
 onSuccess: () => {
 utils.admin.branches.list.invalidate()
 resetForm()
 },
 })

 const updateMutation = trpc.admin.branches.update.useMutation({
 onSuccess: () => {
 utils.admin.branches.list.invalidate()
 resetForm()
 },
 })

 const deleteMutation = trpc.admin.branches.delete.useMutation({
 onSuccess: () => utils.admin.branches.list.invalidate(),
 })

 function resetForm() {
 setShowForm(false)
 setEditingId(null)
 setForm({
 code: '', name: '', country: '', city: '',
 address: '', phone: '', email: '', status: 'ACTIVE',
 managerName: '', counselors: '0', applications: '0',
 })
 }

 function startEdit(branch: any) {
 setEditingId(branch.id)
 setForm({
 code: branch.code, name: branch.name, country: branch.country,
 city: branch.city, address: branch.address || '',
 phone: branch.phone || '', email: branch.email || '',
 status: branch.status || 'ACTIVE',
 managerName: branch.managerName || '',
 counselors: branch.counselors?.toString() || '0',
 applications: branch.applications?.toString() || '0',
 })
 setShowForm(true)
 }

 function handleSubmit(e: React.FormEvent) {
 e.preventDefault()
 const data = {
 ...form,
 counselors: parseInt(form.counselors) || 0,
 applications: parseInt(form.applications) || 0,
 email: form.email || undefined,
 }
 if (editingId) {
 updateMutation.mutate({ id: editingId, ...data } as any)
 } else {
 createMutation.mutate(data as any)
 }
 }

 return (
 <div className="mx-auto max-w-[1440px] space-y-4">
 {/* Header */}
 <motion.div
 initial={{ opacity: 0, y: 8 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.3 }}
 className="flex items-center justify-between"
 >
 <div>
 <h1 className="text-[20px] font-bold tracking-tight" style={{ color: '#111827', fontFamily:"'Space Grotesk', sans-serif" }}>
 Branches
 </h1>
 <p className="mt-0.5 text-[13px]" style={{ color: '#6b7280' }}>
 Manage platform branch offices worldwide
 </p>
 </div>
 <SAButton variant="primary" size="md" onClick={() => { resetForm(); setShowForm(true) }}>
 <Plus size={15} /> Add Branch
 </SAButton>
 </motion.div>

 {/* Create/Edit Form */}
 {showForm && (
 <motion.div
 initial={{ opacity: 0, y: -8 }}
 animate={{ opacity: 1, y: 0 }}
 className="rounded-xl border p-5"
 style={{ background: '#ffffff', borderColor: '#e5e7eb' }}
 >
 <h2 className="mb-4 text-[15px] font-semibold" style={{ color: '#111827', fontFamily:"'Space Grotesk', sans-serif" }}>
 {editingId ? 'Edit Branch' : 'Add Branch'}
 </h2>
 <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
 {[
 { label: 'Branch Code', key: 'code', required: true, maxLength: 10, placeholder: 'e.g. DAC' },
 { label: 'Branch Name', key: 'name', required: true, placeholder: 'e.g. Dhaka Office' },
 { label: 'Country', key: 'country', required: true },
 { label: 'City', key: 'city', required: true },
 { label: 'Address', key: 'address' },
 { label: 'Phone', key: 'phone' },
 { label: 'Email', key: 'email', type: 'email' },
 { label: 'Manager Name', key: 'managerName' },
 ].map((f) => (
 <label key={f.key} className="flex flex-col gap-1">
 <span className="text-[11px] font-medium" style={{ color: '#6b7280' }}>
 {f.label}{f.required ? ' *' : ''}
 </span>
 <input
 type={f.type || 'text'}
 value={(form as any)[f.key]}
 onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
 required={f.required}
 maxLength={f.maxLength}
 className="rounded-md border px-3 py-1.5 text-[13px] outline-none"
 style={{ background: '#f8fafc', borderColor: '#e5e7eb', color: '#111827' }}
 placeholder={f.placeholder || f.label}
 />
 </label>
 ))}

 {/* Status */}
 <label className="flex flex-col gap-1">
 <span className="text-[11px] font-medium" style={{ color: '#6b7280' }}>Status</span>
 <select
 value={form.status}
 onChange={(e) => setForm({ ...form, status: e.target.value })}
 className="rounded-md border px-3 py-1.5 text-[13px] outline-none"
 style={{ background: '#f8fafc', borderColor: '#e5e7eb', color: '#111827' }}
 >
 {STATUS_OPTIONS.map((s) => (
 <option key={s} value={s}>{s}</option>
 ))}
 </select>
 </label>

 {/* Counselors */}
 <label className="flex flex-col gap-1">
 <span className="text-[11px] font-medium" style={{ color: '#6b7280' }}>Counselors</span>
 <input
 type="number"
 min={0}
 value={form.counselors}
 onChange={(e) => setForm({ ...form, counselors: e.target.value })}
 className="rounded-md border px-3 py-1.5 text-[13px] outline-none"
 style={{ background: '#f8fafc', borderColor: '#e5e7eb', color: '#111827' }}
 />
 </label>

 {/* Applications */}
 <label className="flex flex-col gap-1">
 <span className="text-[11px] font-medium" style={{ color: '#6b7280' }}>Applications</span>
 <input
 type="number"
 min={0}
 value={form.applications}
 onChange={(e) => setForm({ ...form, applications: e.target.value })}
 className="rounded-md border px-3 py-1.5 text-[13px] outline-none"
 style={{ background: '#f8fafc', borderColor: '#e5e7eb', color: '#111827' }}
 />
 </label>

 <div className="col-span-full flex items-center gap-2 pt-2">
 <SAButton type="submit" variant="primary" size="sm" disabled={createMutation.isPending || updateMutation.isPending}>
 {createMutation.isPending || updateMutation.isPending ? 'Saving...' : editingId ? 'Update' : 'Create'}
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
 placeholder="Search branches..."
 icon={<Search size={14} />}
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 />
 </div>
 <SAButton variant="ghost" size="sm" onClick={() => { setSearch(''); utils.admin.branches.list.invalidate() }}>
 <RefreshCw size={12} /> Reset
 </SAButton>
 </motion.div>

 {/* Table */}
 <motion.div
 initial={{ opacity: 0, y: 12 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.35, delay: 0.1 }}
 className="overflow-hidden rounded-xl border"
 style={{ background: '#ffffff', borderColor: '#e5e7eb' }}
 >
 {isLoading ? (
 <div className="flex items-center justify-center py-20">
 <div className="h-8 w-8 animate-spin rounded-full border-2" style={{ borderColor: '#E8A33D', borderTopColor: 'transparent' }} />
 </div>
 ) : error ? (
 <div className="flex flex-col items-center justify-center py-20 px-4">
 <AlertTriangle size={28} style={{ color: '#F0625B' }} />
 <p className="mt-3 text-[14px] font-medium" style={{ color: '#F0625B' }}>Failed to load branches</p>
 <SAButton variant="secondary" size="sm" className="mt-3" onClick={() => utils.admin.branches.list.invalidate()}>Retry</SAButton>
 </div>
 ) : (
 <div className="overflow-x-auto">
 <table className="w-full">
 <thead>
 <tr style={{ background: '#ffffff' }}>
 {['Code', 'Branch Name', 'Country', 'City', 'Manager', 'Counselors', 'Apps', 'Status', 'Actions'].map((h) => (
 <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#6b7280', fontFamily:"'JetBrains Mono', monospace" }}>
 {h}
 </th>
 ))}
 </tr>
 </thead>
 <tbody className="[&_tr]:border-t [&_tr]:border-[#e5e7eb]/50">
 {(branchList ?? []).map((branch: any) => (
 <tr key={branch.id} className="transition-colors hover:bg-[#E8A33D]/[0.04]">
 <td className="px-4 py-3">
 <span className="text-[12px] font-semibold" style={{ color: '#E8A33D', fontFamily:"'JetBrains Mono', monospace" }}>
 {branch.code}
 </span>
 </td>
 <td className="px-4 py-3">
 <div className="flex items-center gap-3">
 <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: 'rgba(234, 179, 8, 0.1)' }}>
 <Building2 size={14} style={{ color: '#E8A33D' }} />
 </div>
 <div>
 <span className="text-[13px] font-medium" style={{ color: '#111827' }}>{branch.name}</span>
 {branch.address && <p className="text-[11px] truncate max-w-[160px]" style={{ color: '#6b7280' }}>{branch.address}</p>}
 </div>
 </div>
 </td>
 <td className="px-4 py-3 text-[13px]" style={{ color: '#6b7280' }}>
 <div className="flex items-center gap-1.5">
 <Globe size={12} />{branch.country}
 </div>
 </td>
 <td className="px-4 py-3 text-[13px]" style={{ color: '#6b7280' }}>
 <div className="flex items-center gap-1.5">
 <MapPin size={12} />{branch.city}
 </div>
 </td>
 <td className="px-4 py-3 text-[13px]" style={{ color: branch.managerName ? '#111827' : '#6b7280' }}>
 {branch.managerName || 'â€”'}
 </td>
 <td className="px-4 py-3">
 <SABadge variant="route">{branch.counselors || 0}</SABadge>
 </td>
 <td className="px-4 py-3">
 <SABadge variant="success">{branch.applications || 0}</SABadge>
 </td>
 <td className="px-4 py-3">
 <SABadge variant={STATUS_VARIANT[branch.status] || 'neutral'} dot>
 {branch.status}
 </SABadge>
 </td>
 <td className="px-4 py-3">
 <div className="flex items-center gap-1">
 <SATooltip content="Edit">
 <button onClick={() => startEdit(branch)} className="flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-white/[0.06]" style={{ color: '#E8A33D' }}>
 <Pencil size={14} />
 </button>
 </SATooltip>
 <SATooltip content="Delete">
 <button onClick={() => { if (confirm(`Delete branch"${branch.name}"?`)) deleteMutation.mutate({ id: branch.id }) }} className="flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-[#F0625B]/10" style={{ color: '#F0625B' }}>
 <Trash2 size={14} />
 </button>
 </SATooltip>
 </div>
 </td>
 </tr>
 ))}
 {(!branchList || branchList.length === 0) && (
 <tr>
 <td colSpan={9} className="py-20 text-center">
 <Building2 size={28} style={{ color: '#6b7280', margin: '0 auto 8px' }} />
 <p className="text-[13px]" style={{ color: '#6b7280' }}>
 {search ? 'No branches match your search' : 'No branches yet. Add your first branch.'}
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
