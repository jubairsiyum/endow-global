'use client'

import { useState, useEffect } from 'react'
import { trpc } from '@/lib/trpc-client'
import PageHeader from '@/components/ui/PageHeader'
import AdminTable from '@/components/ui/AdminTable'
import { Plus, Pencil, Trash2, X, Search, BookOpen, GraduationCap, DollarSign, EyeOff } from 'lucide-react'

interface CourseForm {
 universityId: string
 name: string
 slug: string
 subject: string
 level: string
 duration: string
 durationUnit: string
 tuitionFee: string
 currency: string
 language: string
 requirements: string
 hasScholarship: boolean
 scholarshipDetails: string
 description: string
 isActive: boolean
}

const emptyForm: CourseForm = {
 universityId: '', name: '', slug: '', subject: '', level: 'UNDERGRADUATE',
 duration: '', durationUnit: 'YEARS', tuitionFee: '', currency: 'USD',
 language: 'English', requirements: '', hasScholarship: false,
 scholarshipDetails: '', description: '', isActive: true,
}

const levels = ['UNDERGRADUATE', 'POSTGRADUATE', 'PHD', 'DIPLOMA', 'CERTIFICATE', 'FOUNDATION']
const durationUnits = ['YEARS', 'MONTHS']

function useDebounce<T>(value: T, delay: number): T {
 const [debouncedValue, setDebouncedValue] = useState<T>(value)
 useEffect(() => {
 const handler = setTimeout(() => setDebouncedValue(value), delay)
 return () => clearTimeout(handler)
 }, [value, delay])
 return debouncedValue
}

export default function CoursesPage() {
 const [search, setSearch] = useState('')
 const debouncedSearch = useDebounce(search, 400)
 const [showModal, setShowModal] = useState(false)
 const [editingId, setEditingId] = useState<string | null>(null)
 const [form, setForm] = useState<CourseForm>(emptyForm)
 const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
 const [levelFilter, setLevelFilter] = useState('')
 const [universityFilter, setUniversityFilter] = useState('')

 const utils = trpc.useUtils()

 const { data: courses, isLoading } = trpc.admin.courses.list.useQuery({
 search: debouncedSearch || undefined,
 level: (levelFilter as any) || undefined,
 universityId: universityFilter || undefined,
 })

 const { data: universities } = trpc.admin.universities.list.useQuery({})

 const { data: subjects } = trpc.admin.courses.getSubjects.useQuery()

 const createMutation = trpc.admin.courses.create.useMutation({
 onSuccess: () => {
 utils.admin.courses.list.invalidate()
 setShowModal(false)
 setForm(emptyForm)
 },
 })

 const updateMutation = trpc.admin.courses.update.useMutation({
 onSuccess: () => {
 utils.admin.courses.list.invalidate()
 setShowModal(false)
 setEditingId(null)
 setForm(emptyForm)
 },
 })

 const deleteMutation = trpc.admin.courses.delete.useMutation({
 onSuccess: () => {
 utils.admin.courses.list.invalidate()
 setDeleteConfirm(null)
 },
 })

 function openCreate() {
 setEditingId(null)
 setForm(emptyForm)
 setShowModal(true)
 }

 function openEdit(c: any) {
 setEditingId(c.id)
 setForm({
 universityId: c.universityId || '',
 name: c.name || '',
 slug: c.slug || '',
 subject: c.subject || '',
 level: c.level || 'UNDERGRADUATE',
 duration: c.duration?.toString() || '',
 durationUnit: c.durationUnit || 'YEARS',
 tuitionFee: c.tuitionFee?.toString() || '',
 currency: c.currency || 'USD',
 language: c.language || 'English',
 requirements: Array.isArray(c.requirements) ? c.requirements.join(', ') : '',
 hasScholarship: c.hasScholarship ?? false,
 scholarshipDetails: c.scholarshipDetails || '',
 description: c.description || '',
 isActive: c.isActive ?? true,
 })
 setShowModal(true)
 }

 function handleSubmit(e: React.FormEvent) {
 e.preventDefault()
 const data = {
 ...form,
 duration: Number(form.duration),
 tuitionFee: Number(form.tuitionFee),
 requirements: form.requirements ? form.requirements.split(',').map(s => s.trim()).filter(Boolean) : [],
 }
 if (editingId) {
 updateMutation.mutate({ id: editingId, ...data } as any)
 } else {
 createMutation.mutate(data as any)
 }
 }

 function updateField(field: keyof CourseForm, value: string | boolean) {
 setForm(prev => ({ ...prev, [field]: value }))
 }

 const formatCurrency = (amount: number, currency: string = 'USD') => {
 return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)
 }

 return (
 <div className="space-y-6">
 <PageHeader
 title="Courses"
 description="Manage course listings. Changes reflect immediately on the frontend."
 buttonText="Add Course"
 onButtonClick={openCreate}
 />

 {/* SEARCH + FILTERS */}
 <div className="flex flex-col gap-3 lg:flex-row">
 <div className="relative flex-1">
 <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
 <input
 type="text"
 value={search}
 onChange={e => setSearch(e.target.value)}
 placeholder="Search by name or subject..."
 className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-5 text-gray-900 outline-none transition-all focus:border-primary"
 />
 </div>
 <select
 value={universityFilter}
 onChange={e => setUniversityFilter(e.target.value)}
 className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm text-gray-700 outline-none lg:w-56"
 >
 <option value="">All Universities</option>
 {(universities || []).map((u: any) => (
 <option key={u.id} value={u.id}>{u.name}</option>
 ))}
 </select>
 <select
 value={levelFilter}
 onChange={e => setLevelFilter(e.target.value)}
 className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm text-gray-700 outline-none lg:w-48"
 >
 <option value="">All Levels</option>
 {levels.map(l => <option key={l} value={l}>{l.replace('_', ' ')}</option>)}
 </select>
 </div>

 {/* TABLE */}
 <AdminTable>
 <div className="overflow-x-auto">
 <div className="grid min-w-[900px] grid-cols-7 border-b border-gray-100 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-600">
 <div>Course</div>
 <div>University</div>
 <div>Subject</div>
 <div>Level</div>
 <div>Duration</div>
 <div>Tuition</div>
 <div>Status</div>
 </div>

 {isLoading ? (
 <div className="py-10">
 <div className="flex justify-center pb-4">
 <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
 </div>
 {Array.from({ length: 5 }).map((_, i) => (
 <div key={i} className="grid min-w-[900px] grid-cols-7 items-center border-b border-gray-100 px-6 py-5">
 <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
 <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
 <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
 <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
 <div className="h-4 w-12 animate-pulse rounded bg-gray-200" />
 <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
 <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200" />
 </div>
 ))}
 </div>
 ) : (courses || []).length === 0 ? (
 <div className="flex flex-col items-center justify-center py-16 text-gray-400">
 <BookOpen size={48} className="mb-3" />
 <p className="text-lg font-semibold text-gray-500">No courses found</p>
 <p className="text-sm">Add your first course to get started.</p>
 </div>
 ) : (
 (courses || []).map((c: any) => (
 <div
 key={c.id}
 className="grid min-w-[900px] grid-cols-7 items-center border-b border-gray-100 px-6 py-5 transition-all hover:bg-gray-50"
 >
 <div>
 <div className="font-semibold text-gray-900">{c.name}</div>
 <div className="text-xs text-gray-400">{c.slug}</div>
 </div>
 <div className="flex items-center gap-1.5 text-gray-700">
 <GraduationCap size={13} className="text-gray-400" />
 <span className="truncate">{c.university?.name || '—'}</span>
 </div>
 <div className="text-sm text-gray-600">{c.subject}</div>
 <div>
 <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
 {c.level.replace('_', ' ')}
 </span>
 </div>
 <div className="text-sm text-gray-600">
 {c.duration} {c.durationUnit?.toLowerCase() || 'years'}
 </div>
 <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
 <DollarSign size={13} className="text-gray-400" />
 {formatCurrency(c.tuitionFee, c.currency)}
 </div>
 <div className="flex items-center gap-3">
 {c.isActive ? (
 <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">Active</span>
 ) : (
 <span className="inline-flex items-center gap-1 rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-500">
 <EyeOff size={11} /> Hidden
 </span>
 )}
 <button
 onClick={() => openEdit(c)}
 className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200"
 >
 <Pencil size={14} />
 </button>
 <button
 onClick={() => setDeleteConfirm(c.id)}
 className="rounded-xl bg-red-200 px-3 py-2 text-sm font-medium text-red-600 transition-all hover:bg-red-200"
 >
 <Trash2 size={14} />
 </button>
 </div>
 </div>
 ))
 )}
 </div>
 </AdminTable>

 {/* CREATE / EDIT MODAL */}
 {showModal && (
 <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4 ">
 <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-gray-200 bg-white shadow-2xl">
 <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
 <h2 className="text-xl font-bold text-gray-900">
 {editingId ? 'Edit Course' : 'Add Course'}
 </h2>
 <button onClick={() => { setShowModal(false); setEditingId(null); setForm(emptyForm) }} className="rounded-xl p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-600">
 <X size={18} />
 </button>
 </div>

 <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 px-6 py-6 sm:grid-cols-2">
 <div className="sm:col-span-2">
 <label className="mb-1.5 block text-sm font-medium text-gray-700">University *</label>
 <select required value={form.universityId} onChange={e => updateField('universityId', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary">
 <option value="">Select University</option>
 {(universities || []).map((u: any) => (
 <option key={u.id} value={u.id}>{u.name}</option>
 ))}
 </select>
 </div>
 <div className="sm:col-span-2">
 <label className="mb-1.5 block text-sm font-medium text-gray-700">Course Name *</label>
 <input required value={form.name} onChange={e => { updateField('name', e.target.value); updateField('slug', e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')) }} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary" />
 </div>
 <div>
 <label className="mb-1.5 block text-sm font-medium text-gray-700">Slug *</label>
 <input required value={form.slug} onChange={e => updateField('slug', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary" />
 </div>
 <div>
 <label className="mb-1.5 block text-sm font-medium text-gray-700">Subject *</label>
 <input required value={form.subject} onChange={e => updateField('subject', e.target.value)} placeholder="e.g. Computer Science" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary" />
 </div>
 <div>
 <label className="mb-1.5 block text-sm font-medium text-gray-700">Level *</label>
 <select required value={form.level} onChange={e => updateField('level', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary">
 {levels.map(l => <option key={l} value={l}>{l.replace('_', ' ')}</option>)}
 </select>
 </div>
 <div>
 <label className="mb-1.5 block text-sm font-medium text-gray-700">Duration *</label>
 <div className="flex gap-2">
 <input required type="number" min="1" value={form.duration} onChange={e => updateField('duration', e.target.value)} placeholder="e.g. 4" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary" />
 <select value={form.durationUnit} onChange={e => updateField('durationUnit', e.target.value)} className="w-28 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary">
 {durationUnits.map(u => <option key={u} value={u}>{u}</option>)}
 </select>
 </div>
 </div>
 <div>
 <label className="mb-1.5 block text-sm font-medium text-gray-700">Tuition Fee *</label>
 <div className="flex gap-2">
 <input required type="number" min="0" value={form.tuitionFee} onChange={e => updateField('tuitionFee', e.target.value)} placeholder="e.g. 25000" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary" />
 <select value={form.currency} onChange={e => updateField('currency', e.target.value)} className="w-20 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary">
 <option value="USD">USD</option>
 <option value="GBP">GBP</option>
 <option value="EUR">EUR</option>
 <option value="AUD">AUD</option>
 <option value="CAD">CAD</option>
 <option value="KRW">KRW</option>
 <option value="JPY">JPY</option>
 </select>
 </div>
 </div>
 <div>
 <label className="mb-1.5 block text-sm font-medium text-gray-700">Language</label>
 <input value={form.language} onChange={e => updateField('language', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary" />
 </div>
 <div className="sm:col-span-2">
 <label className="mb-1.5 block text-sm font-medium text-gray-700">Description *</label>
 <textarea required value={form.description} onChange={e => updateField('description', e.target.value)} rows={3} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary" />
 </div>
 <div className="sm:col-span-2">
 <label className="mb-1.5 block text-sm font-medium text-gray-700">Requirements (comma-separated)</label>
 <input value={form.requirements} onChange={e => updateField('requirements', e.target.value)} placeholder="e.g. High School Diploma, English Proficiency" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary" />
 </div>
 <div className="sm:col-span-2 flex items-center gap-6">
 <label className="flex items-center gap-2 cursor-pointer">
 <input type="checkbox" checked={form.hasScholarship} onChange={e => updateField('hasScholarship', e.target.checked)} className="h-4 w-4 rounded border-gray-300 accent-primary" />
 <span className="text-sm font-medium text-gray-700">Has Scholarship</span>
 </label>
 <label className="flex items-center gap-2 cursor-pointer">
 <input type="checkbox" checked={form.isActive} onChange={e => updateField('isActive', e.target.checked)} className="h-4 w-4 rounded border-gray-300 accent-primary" />
 <span className="text-sm font-medium text-gray-700">Active (visible on frontend)</span>
 </label>
 </div>
 {form.hasScholarship && (
 <div className="sm:col-span-2">
 <label className="mb-1.5 block text-sm font-medium text-gray-700">Scholarship Details</label>
 <textarea value={form.scholarshipDetails} onChange={e => updateField('scholarshipDetails', e.target.value)} rows={2} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary" />
 </div>
 )}
 <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
 <button type="button" onClick={() => { setShowModal(false); setEditingId(null); setForm(emptyForm) }} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
 Cancel
 </button>
 <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} style={{ background: '#AD0819', boxShadow: '0 4px 12px rgba(173,8,25,0.2)' }} className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 hover:shadow-lg disabled:opacity-50">
 {createMutation.isPending || updateMutation.isPending ? 'Saving...' : editingId ? 'Update Course' : 'Create Course'}
 </button>
 </div>
 </form>
 </div>
 </div>
 )}

 {/* DELETE CONFIRMATION MODAL */}
 {deleteConfirm && (
 <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4 ">
 <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl">
 <h3 className="text-lg font-bold text-gray-900">Delete Course?</h3>
 <p className="mt-2 text-sm text-gray-500">This action cannot be undone. Associated applications may be affected.</p>
 <div className="mt-6 flex justify-end gap-3">
 <button onClick={() => setDeleteConfirm(null)} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
 <button onClick={() => deleteMutation.mutate({ id: deleteConfirm })} disabled={deleteMutation.isPending} className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50">
 {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
 </button>
 </div>
 </div>
 </div>
 )}
 </div>
 )
}
