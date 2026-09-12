'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { trpc } from '@/lib/trpc-client'
import PageHeader from '@/components/ui/PageHeader'
import AdminTable from '@/components/ui/AdminTable'
import { Pencil, Trash2, X, Search, Award, DollarSign, EyeOff } from 'lucide-react'

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

type FormErrors = Partial<Record<keyof ScholarshipForm, string>>

const coverageTypes = [
  { value: 'full', label: 'Full Scholarship' },
  { value: 'partial', label: 'Partial' },
  { value: 'tuition_only', label: 'Tuition Only' },
  { value: 'living_only', label: 'Living Expenses' },
]

function validateForm(form: ScholarshipForm): FormErrors {
  const errors: FormErrors = {}
  if (!form.name.trim()) errors.name = 'Scholarship name is required'
  else if (form.name.trim().length > 255) errors.name = 'Name must be under 255 characters'
  if (!form.universityId) errors.universityId = 'Please select a university'
  if (form.amount !== '' && Number.isNaN(Number(form.amount))) errors.amount = 'Amount must be a valid number'
  else if (form.amount !== '' && Number(form.amount) < 0) errors.amount = 'Amount cannot be negative'
  if (form.linkUrl && form.linkUrl.trim() !== '') {
    try {
      const url = new URL(form.linkUrl.trim())
      if (!['http:', 'https:'].includes(url.protocol)) errors.linkUrl = 'Link must start with http:// or https://'
    } catch {
      errors.linkUrl = 'Please enter a valid URL (https://...)'
    }
  }
  if (form.deadline) {
    const d = new Date(form.deadline + 'T12:00:00')
    if (Number.isNaN(d.getTime())) errors.deadline = 'Invalid date'
  }
  if (!form.coverageType) errors.coverageType = 'Coverage type is required'
  return errors
}

function ToggleSwitch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#AD0819] focus-visible:ring-offset-2 ${checked ? 'bg-[#AD0819]' : 'bg-gray-200'}`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </button>
  )
}

export default function ScholarshipsPage() {
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<ScholarshipForm>(emptyForm)
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [universityFilter, setUniversityFilter] = useState<string>('')
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const utils = trpc.useUtils()

  const { data: scholarships, isLoading, error: listError } = trpc.admin.scholarships.list.useQuery({
    universityId: (universityFilter as unknown as string | number | undefined) || undefined,
    search: search || undefined,
  })

  const { data: universities, isLoading: uniLoading, error: uniError } = trpc.admin.scholarships.getCatalogUniversities.useQuery()
  const { data: courses, isLoading: coursesLoading } = trpc.admin.scholarships.getCatalogCourses.useQuery()

  const createMutation = trpc.admin.scholarships.create.useMutation({
    onSuccess: () => {
      utils.admin.scholarships.list.invalidate()
      ;(utils as unknown as { scholarship?: { featured?: { invalidate: () => void } } }).scholarship?.featured?.invalidate?.()
      setShowModal(false)
      setForm(emptyForm)
      setFormErrors({})
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : (err as { message?: string })?.message || 'Failed to create scholarship'
      alert(msg)
    },
  })

  const updateMutation = trpc.admin.scholarships.update.useMutation({
    onSuccess: () => {
      utils.admin.scholarships.list.invalidate()
      ;(utils as unknown as { scholarship?: { featured?: { invalidate: () => void } } }).scholarship?.featured?.invalidate?.()
      setShowModal(false)
      setEditingId(null)
      setForm(emptyForm)
      setFormErrors({})
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : (err as { message?: string })?.message || 'Failed to update scholarship'
      alert(msg)
    },
  })

  const deleteMutation = trpc.admin.scholarships.delete.useMutation({
    onSuccess: () => {
      utils.admin.scholarships.list.invalidate()
      ;(utils as unknown as { scholarship?: { featured?: { invalidate: () => void } } }).scholarship?.featured?.invalidate?.()
      setDeleteConfirm(null)
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : (err as { message?: string })?.message || 'Failed to delete scholarship'
      alert(msg)
    },
  })

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setFormErrors({})
    setShowModal(true)
  }

  function openEdit(s: unknown) {
    const sch = s as { id: number; universityId?: number | null; courseId?: number | null; name?: string; description?: string | null; amount?: number | string | null; currencyCode?: string; coverageType?: string; eligibility?: string | null; deadline?: string | Date | null; linkUrl?: string | null; isActive?: boolean }
    setEditingId(sch.id)
    setForm({
      universityId: sch.universityId?.toString() || '',
      courseId: sch.courseId?.toString() || '',
      name: sch.name || '',
      description: sch.description || '',
      amount: sch.amount?.toString() || '',
      currencyCode: sch.currencyCode || 'USD',
      coverageType: sch.coverageType || 'partial',
      eligibility: sch.eligibility || '',
      deadline: sch.deadline ? new Date(sch.deadline).toISOString().split('T')[0] : '',
      linkUrl: sch.linkUrl || '',
      isActive: sch.isActive ?? true,
    })
    setFormErrors({})
    setShowModal(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errors = validateForm(form)
    setFormErrors(errors)
    if (Object.keys(errors).length > 0) return

    const amountNum = form.amount !== '' ? Number(form.amount) : undefined
    const data: {
      name: string
      description?: string
      amount?: number
      currencyCode: string
      coverageType: 'full' | 'partial' | 'tuition_only' | 'living_only'
      eligibility?: string
      deadline?: Date
      linkUrl?: string
      isActive: boolean
      universityId?: string | number
      courseId?: string | number
    } = {
      name: form.name.trim(),
      description: form.description?.trim() || undefined,
      amount: amountNum !== undefined && !Number.isNaN(amountNum) ? amountNum : undefined,
      currencyCode: form.currencyCode || 'USD',
      coverageType: form.coverageType as 'full' | 'partial' | 'tuition_only' | 'living_only',
      eligibility: form.eligibility?.trim() || undefined,
      deadline: form.deadline ? new Date(form.deadline + 'T12:00:00') : undefined,
      linkUrl: form.linkUrl?.trim() || undefined,
      isActive: form.isActive,
      universityId: form.universityId || undefined,
      courseId: form.courseId || undefined,
    }
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...data })
    } else {
      createMutation.mutate(data as never)
    }
  }

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    try {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)
    } catch {
      return `${currency} ${amount.toLocaleString()}`
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending

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
          {(universities || []).map((u: { id: string; name: string }) => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
      </div>

      {listError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Failed to load scholarships: {(listError as { message?: string })?.message || 'Unknown error'}
        </div>
      )}
      {uniError && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Failed to load universities for filter: {(uniError as { message?: string })?.message}. Try refreshing.
        </div>
      )}

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
                  {s.amount != null ? (
                    <>
                      <DollarSign size={13} className="text-gray-400" />
                      {formatCurrency(s.amount, s.currencyCode || 'USD')}
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
              <button onClick={() => { setShowModal(false); setEditingId(null); setForm(emptyForm); setFormErrors({}) }} className="rounded-xl p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <div className="min-h-0 overflow-y-auto">
              <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 gap-4 px-6 py-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Scholarship Name <span className="text-red-500">*</span></label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. SNU Global Excellence" className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm outline-none ${formErrors.name ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-primary'}`} />
                  {formErrors.name && <p className="mt-1 text-xs text-red-600">{formErrors.name}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">University <span className="text-red-500">*</span></label>
                  <select value={form.universityId} onChange={e => setForm({ ...form, universityId: e.target.value })} className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm outline-none ${formErrors.universityId ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-primary'}`}>
                    <option value="">Select University</option>
                    {uniLoading ? <option disabled>Loading...</option> : (universities || []).length === 0 ? <option disabled>No universities — seed catalog first</option> : (universities || []).map((u: { id: string; name: string }) => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                  {formErrors.universityId ? <p className="mt-1 text-xs text-red-600">{formErrors.universityId}</p> : <p className="mt-1 text-xs text-gray-400">Required — links scholarship to a catalog university.</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Course <span className="text-gray-400 font-normal">(optional)</span></label>
                  <select value={form.courseId} onChange={e => setForm({ ...form, courseId: e.target.value })} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary">
                    <option value="">Select Course (optional)</option>
                    {coursesLoading ? <option disabled>Loading...</option> : (courses || []).map((c: { id: string; title: string }) => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Amount</label>
                  <input type="number" min="0" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="e.g. 5000" className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm outline-none ${formErrors.amount ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-primary'}`} />
                  {formErrors.amount ? <p className="mt-1 text-xs text-red-600">{formErrors.amount}</p> : <p className="mt-1 text-xs text-gray-400">Leave empty for full coverage.</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Currency <span className="text-red-500">*</span></label>
                  <select value={form.currencyCode} onChange={e => setForm({ ...form, currencyCode: e.target.value })} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary">
                    <option value="USD">USD ($)</option>
                    <option value="KRW">KRW (₩)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="JPY">JPY (¥)</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Coverage Type <span className="text-red-500">*</span></label>
                  <select value={form.coverageType} onChange={e => setForm({ ...form, coverageType: e.target.value })} className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm outline-none ${formErrors.coverageType ? 'border-red-300' : 'border-gray-200 focus:border-primary'}`}>
                    {coverageTypes.map(ct => <option key={ct.value} value={ct.value}>{ct.label}</option>)}
                  </select>
                  {formErrors.coverageType && <p className="mt-1 text-xs text-red-600">{formErrors.coverageType}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Deadline</label>
                  <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm outline-none ${formErrors.deadline ? 'border-red-300' : 'border-gray-200 focus:border-primary'}`} />
                  {formErrors.deadline && <p className="mt-1 text-xs text-red-600">{formErrors.deadline}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Link URL</label>
                  <input type="url" value={form.linkUrl} onChange={e => setForm({ ...form, linkUrl: e.target.value })} placeholder="https://..." className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm outline-none ${formErrors.linkUrl ? 'border-red-300' : 'border-gray-200 focus:border-primary'}`} />
                  {formErrors.linkUrl ? <p className="mt-1 text-xs text-red-600">{formErrors.linkUrl}</p> : <p className="mt-1 text-xs text-gray-400">Must start with https:// if provided.</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Description</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Short description shown on the spotlight card" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Eligibility Criteria</label>
                  <textarea value={form.eligibility} onChange={e => setForm({ ...form, eligibility: e.target.value })} rows={2} placeholder="e.g. GPA 3.5+, IELTS 6.5+" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary" />
                </div>
                <div className="sm:col-span-2 flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Active</p>
                    <p className="text-xs text-gray-500">Visible on the public /universities spotlight</p>
                  </div>
                  <ToggleSwitch checked={form.isActive} onChange={v => setForm({ ...form, isActive: v })} label="Active toggle" />
                </div>
                {(createMutation.isError || updateMutation.isError) && (
                  <div className="sm:col-span-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {(createMutation.error as { message?: string })?.message || (updateMutation.error as { message?: string })?.message || 'Something went wrong. Please check the fields and try again.'}
                  </div>
                )}
                <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => { setShowModal(false); setEditingId(null); setForm(emptyForm); setFormErrors({}) }} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                  <button type="submit" disabled={isSaving} style={{ background: '#AD0819', boxShadow: '0 4px 12px rgba(173,8,25,0.2)' }} className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 hover:shadow-lg disabled:opacity-50">
                    {isSaving ? 'Saving...' : editingId ? 'Update' : 'Create'}
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
