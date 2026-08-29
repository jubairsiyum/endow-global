'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { trpc } from '@/lib/trpc-client'
import PageHeader from '@/components/ui/PageHeader'
import AdminTable from '@/components/ui/AdminTable'
import { Plus, Pencil, Trash2, X, Search, Award, DollarSign, EyeOff } from 'lucide-react'

interface ScholarshipForm {
 universityId: string
 courseId: string
 name: string
 description: string
 amount: string
 currencyCode: string
 coverageType: string
 eligibility: string
 deadline: string
 linkUrl: string
 isActive: boolean
}

const emptyForm: ScholarshipForm = {
 universityId: '', courseId: '', name: '', description: '', amount: '',
 currencyCode: 'USD', coverageType: 'partial', eligibility: '',
 deadline: '', linkUrl: '', isActive: true,
}

const coverageTypes = [
 { value: 'full', label: 'Full Scholarship' },
 { value: 'partial', label: 'Partial' },
 { value: 'tuition_only', label: 'Tuition Only' },
 { value: 'living_only', label: 'Living Expenses' },
]

export default function ScholarshipsPage() {
 const [showModal, setShowModal] = useState(false)
 const [editingId, setEditingId] = useState<number | null>(null)
 const [form, setForm] = useState<ScholarshipForm>(emptyForm)
 const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
 const [search, setSearch] = useState('')
 const [universityFilter, setUniversityFilter] = useState<string>('')
 const [mounted, setMounted] = useState(false)
 useEffect(() => { setMounted(true) }, [])

 const utils = trpc.useUtils()

 const { data: scholarships, isLoading } = trpc.admin.scholarships.list.useQuery({
 universityId: universityFilter ? Number(universityFilter) : undefined,
 search: search || undefined,
 })

 const { data: universities } = trpc.admin.scholarships.getCatalogUniversities.useQuery()
 const { data: courses } = trpc.admin.scholarships.getCatalogCourses.useQuery()

 const createMutation = trpc.admin.scholarships.create.useMutation({
 onSuccess: () => {
 utils.admin.scholarships.list.invalidate()
 setShowModal(false)
 setForm(emptyForm)
 },
 })

 const updateMutation = trpc.admin.scholarships.update.useMutation({
 onSuccess: () => {
 utils.admin.scholarships.list.invalidate()
 setShowModal(false)
 setEditingId(null)
 setForm(emptyForm)
 },
 })

 const deleteMutation = trpc.admin.scholarships.delete.useMutation({
 onSuccess: () => {
 utils.admin.scholarships.list.invalidate()
 setDeleteConfirm(null)
 },
 })

 function openCreate() {
 setEditingId(null)
 setForm(emptyForm)
 setShowModal(true)
 }

 function openEdit(s: any) {
 setEditingId(s.id)
 setForm({
 universityId: s.universityId?.toString() || '',
 courseId: s.courseId?.toString() || '',
 name: s.name || '',
 description: s.description || '',
 amount: s.amount?.toString() || '',
 currencyCode: s.currencyCode || 'USD',
 coverageType: s.coverageType || 'partial',
 eligibility: s.eligibility || '',
 deadline: s.deadline ? new Date(s.deadline).toISOString().split('T')[0] : '',
 linkUrl: s.linkUrl || '',
 isActive: s.isActive ?? true,
 })
 setShowModal(true)
 }

 function handleSubmit(e: React.FormEvent) {
 e.preventDefault()
 const data: any = {
 name: form.name,
 description: form.description || undefined,
 amount: form.amount ? Number(form.amount) : undefined,
 currencyCode: form.currencyCode,
 coverageType: form.coverageType as any,
 eligibility: form.eligibility || undefined,
 deadline: form.deadline ? new Date(form.deadline) : undefined,
 linkUrl: form.linkUrl || undefined,
 isActive: form.isActive,
 universityId: form.universityId ? Number(form.universityId) : undefined,
 courseId: form.courseId ? Number(form.courseId) : undefined,
 }
 if (editingId) {
 updateMutation.mutate({ id: editingId, ...data })
 } else {
 createMutation.mutate(data)
 }
 }

 const formatCurrency = (amount: number, currency: string = 'USD') => {
 return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)
 }

 return (
 <div className="space-y-6">
 <PageHeader
 title="Scholarships"
 description="Manage scholarship opportunities for students."
 buttonText="Add Scholarship"
 onButtonClick={openCreate}
 />

 <div className="flex flex-col gap-3 lg:flex-row">
 <div className="relative flex-1">
 <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
 <input
 type="text"
 value={search}
 onChange={e => setSearch(e.target.value)}
 placeholder="Search by name..."
 className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-5 text-gray-900 outline-none transition-all focus:border-primary"
 />
 </div>
 <select
 value={universityFilter}
 onChange={e => setUniversityFilter(e.target.value)}
 className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm text-gray-700 outline-none lg:w-64"
 >
 <option value="">All Universities</option>
 {(universities || []).map((u: any) => (
 <option key={u.id} value={u.id}>{u.name}</option>
 ))}
 </select>
 </div>

 <AdminTable>
 <div className="overflow-x-auto">
 <div className="grid min-w-[900px] grid-cols-7 border-b border-gray-100 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-600">
 <div>Scholarship</div>
 <div>University</div>
 <div>Amount</div>
 <div>Coverage</div>
 <div>Deadline</div>
 <div>Status</div>
 <div>Actions</div>
 </div>

 {isLoading ? (
 <div className="py-10">
 <div className="flex justify-center pb-4">
 <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
 </div>
 </div>
 ) : (scholarships || []).length === 0 ? (
 <div className="flex flex-col items-center justify-center py-16 text-gray-400">
 <Award size={48} className="mb-3" />
 <p className="text-lg font-semibold text-gray-500">No scholarships found</p>
 <p className="text-sm">Add your first scholarship to get started.</p>
 </div>
 ) : (
 (scholarships || []).map((s: any) => (
 <div
 key={s.id}
 className="grid min-w-[900px] grid-cols-7 items-center border-b border-gray-100 px-6 py-5 transition-all hover:bg-gray-50"
 >
 <div>
 <div className="font-semibold text-gray-900">{s.name}</div>
 {s.course && <div className="text-xs text-gray-400">{s.course.title}</div>}
 </div>
 <div className="text-sm text-gray-600">{s.university?.name || '—'}</div>
 <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
 {s.amount ? (
 <>
 <DollarSign size={13} className="text-gray-400" />
 {formatCurrency(s.amount, s.currencyCode)}
 </>
 ) : '—'}
 </div>
 <div>
 <span className="inline-flex items-center rounded-full bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
 {coverageTypes.find(ct => ct.value === s.coverageType)?.label || s.coverageType}
 </span>
 </div>
 <div className="text-sm text-gray-600">
 {s.deadline ? new Date(s.deadline).toLocaleDateString() : '—'}
 </div>
 <div>
 {s.isActive ? (
 <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">Active</span>
 ) : (
 <span className="inline-flex items-center gap-1 rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-500">
 <EyeOff size={11} /> Inactive
 </span>
 )}
 </div>
 <div className="flex items-center gap-2">
 <button onClick={() => openEdit(s)} className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200">
 <Pencil size={14} />
 </button>
 {deleteConfirm === s.id ? (
 <div className="flex items-center gap-1">
 <button onClick={() => deleteMutation.mutate({ id: s.id })} className="rounded-lg bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600">Confirm</button>
 <button onClick={() => setDeleteConfirm(null)} className="rounded-lg bg-gray-200 px-2 py-1 text-xs text-gray-600 hover:bg-gray-300">Cancel</button>
 </div>
 ) : (
 <button onClick={() => setDeleteConfirm(s.id)} className="rounded-xl bg-red-200 px-3 py-2 text-sm font-medium text-red-600 transition-all hover:bg-red-200">
 <Trash2 size={14} />
 </button>
 )}
 </div>
 </div>
 ))
 )}
 </div>
 </AdminTable>

 {showModal && mounted && createPortal(
 <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 ">
 <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl">
 <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-5">
 <h2 className="text-xl font-bold text-gray-900">{editingId ? 'Edit Scholarship' : 'Add Scholarship'}</h2>
 <button onClick={() => { setShowModal(false); setEditingId(null); setForm(emptyForm) }} className="rounded-xl p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-600">
 <X size={18} />
 </button>
 </div>
 <div className="min-h-0 overflow-y-auto">
 <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 px-6 py-6 sm:grid-cols-2">
 <div className="sm:col-span-2">
 <label className="mb-1.5 block text-sm font-medium text-gray-700">Scholarship Name *</label>
 <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary" />
 </div>
 <div>
 <label className="mb-1.5 block text-sm font-medium text-gray-700">University</label>
 <select value={form.universityId} onChange={e => setForm({ ...form, universityId: e.target.value })} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary">
 <option value="">Select University</option>
 {(universities || []).map((u: any) => <option key={u.id} value={u.id}>{u.name}</option>)}
 </select>
 </div>
 <div>
 <label className="mb-1.5 block text-sm font-medium text-gray-700">Course</label>
 <select value={form.courseId} onChange={e => setForm({ ...form, courseId: e.target.value })} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary">
 <option value="">Select Course (optional)</option>
 {(courses || []).map((c: any) => <option key={c.id} value={c.id}>{c.title}</option>)}
 </select>
 </div>
 <div>
 <label className="mb-1.5 block text-sm font-medium text-gray-700">Amount</label>
 <input type="number" min="0" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary" />
 </div>
 <div>
 <label className="mb-1.5 block text-sm font-medium text-gray-700">Coverage Type</label>
 <select value={form.coverageType} onChange={e => setForm({ ...form, coverageType: e.target.value })} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary">
 {coverageTypes.map(ct => <option key={ct.value} value={ct.value}>{ct.label}</option>)}
 </select>
 </div>
 <div>
 <label className="mb-1.5 block text-sm font-medium text-gray-700">Deadline</label>
 <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary" />
 </div>
 <div>
 <label className="mb-1.5 block text-sm font-medium text-gray-700">Link URL</label>
 <input value={form.linkUrl} onChange={e => setForm({ ...form, linkUrl: e.target.value })} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary" />
 </div>
 <div className="sm:col-span-2">
 <label className="mb-1.5 block text-sm font-medium text-gray-700">Description</label>
 <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary" />
 </div>
 <div className="sm:col-span-2">
 <label className="mb-1.5 block text-sm font-medium text-gray-700">Eligibility Criteria</label>
 <textarea value={form.eligibility} onChange={e => setForm({ ...form, eligibility: e.target.value })} rows={2} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary" />
 </div>
 <div className="sm:col-span-2 flex items-center gap-2">
 <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="h-4 w-4 rounded border-gray-300 accent-primary" />
 <span className="text-sm font-medium text-gray-700">Active (visible on frontend)</span>
 </div>
 <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
 <button type="button" onClick={() => { setShowModal(false); setEditingId(null); setForm(emptyForm) }} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
 <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} style={{ background: '#AD0819', boxShadow: '0 4px 12px rgba(173,8,25,0.2)' }} className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 hover:shadow-lg disabled:opacity-50">
 {createMutation.isPending || updateMutation.isPending ? 'Saving...' : editingId ? 'Update' : 'Create'}
  </button>
  </div>
  </form>
  </div>
  </div>
  </div>,
  document.body
  )}
  </div>
  )
}
