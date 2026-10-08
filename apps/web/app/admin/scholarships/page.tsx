'use client'

import AdminTable from '@/components/ui/AdminTable'
import PageHeader from '@/components/ui/PageHeader'
import { trpc } from '@/lib/trpc-client'
import { Award, DollarSign, EyeOff, Pencil, Search, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

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
  universityId: '',
  courseId: '',
  name: '',
  description: '',
  amount: '',
  currencyCode: 'USD',
  coverageType: 'partial',
  eligibility: '',
  deadline: '',
  linkUrl: '',
  isActive: true,
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
  if (form.amount !== '' && Number.isNaN(Number(form.amount)))
    errors.amount = 'Amount must be a valid number'
  else if (form.amount !== '' && Number(form.amount) < 0)
    errors.amount = 'Amount cannot be negative'
  if (form.linkUrl && form.linkUrl.trim() !== '') {
    try {
      const url = new URL(form.linkUrl.trim())
      if (!['http:', 'https:'].includes(url.protocol))
        errors.linkUrl = 'Link must start with http:// or https://'
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

function ToggleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label?: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c41e3a] focus-visible:ring-offset-2 ${
        checked ? 'bg-[#c41e3a]' : 'bg-gray-200 dark:bg-gray-800'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )
}

interface UniversityItem {
  id: string
  name: string
}

interface CourseItem {
  id: string
  title: string
}

interface ScholarshipItem {
  id: number
  name: string
  description?: string | null
  amount?: number | string | null
  currencyCode?: string
  coverageType?: string
  eligibility?: string | null
  deadline?: string | Date | null
  linkUrl?: string | null
  isActive?: boolean
  universityId?: number | null
  courseId?: number | null
  university?: { name?: string | null } | null
  course?: { title?: string | null } | null
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

  useEffect(() => {
    setMounted(true)
  }, [])

  const utils = trpc.useUtils()

  const {
    data: scholarshipsData,
    isLoading,
    error: listError,
  } = trpc.admin.scholarships.list.useQuery({
    universityId: universityFilter ? Number(universityFilter) : undefined,
    search: search || undefined,
  })

  const { data: universitiesData, error: uniError } =
    trpc.admin.scholarships.getCatalogUniversities.useQuery()
  const { data: coursesData, isLoading: coursesLoading } =
    trpc.admin.scholarships.getCatalogCourses.useQuery()

  const scholarships: ScholarshipItem[] = (scholarshipsData as ScholarshipItem[]) || []
  const universities: UniversityItem[] = (universitiesData as UniversityItem[]) || []
  const courses: CourseItem[] = (coursesData as CourseItem[]) || []

  const createMutation = trpc.admin.scholarships.create.useMutation({
    onSuccess: () => {
      utils.admin.scholarships.list.invalidate()
      setShowModal(false)
      setForm(emptyForm)
      setFormErrors({})
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      alert(err?.message || 'Failed to create scholarship')
    },
  })

  const updateMutation = trpc.admin.scholarships.update.useMutation({
    onSuccess: () => {
      utils.admin.scholarships.list.invalidate()
      setShowModal(false)
      setEditingId(null)
      setForm(emptyForm)
      setFormErrors({})
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      alert(err?.message || 'Failed to update scholarship')
    },
  })

  const deleteMutation = trpc.admin.scholarships.delete.useMutation({
    onSuccess: () => {
      utils.admin.scholarships.list.invalidate()
      setDeleteConfirm(null)
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      alert(err?.message || 'Failed to delete scholarship')
    },
  })

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setFormErrors({})
    setShowModal(true)
  }

  function openEdit(sch: ScholarshipItem) {
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
    const data = {
      name: form.name.trim(),
      description: form.description?.trim() || undefined,
      amount: amountNum !== undefined && !Number.isNaN(amountNum) ? amountNum : undefined,
      currencyCode: form.currencyCode || 'USD',
      coverageType: form.coverageType as 'full' | 'partial' | 'tuition_only' | 'living_only',
      eligibility: form.eligibility?.trim() || undefined,
      deadline: form.deadline ? new Date(form.deadline + 'T12:00:00') : undefined,
      linkUrl: form.linkUrl?.trim() || undefined,
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
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
      }).format(amount)
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
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name..."
            className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-5 text-gray-900 outline-none transition-all focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#18181b] dark:text-white dark:placeholder:text-gray-500"
          />
        </div>
        <select
          value={universityFilter}
          onChange={(e) => setUniversityFilter(e.target.value)}
          className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm text-gray-700 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 lg:w-64"
        >
          <option value="">All Universities</option>
          {universities.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      </div>

      {listError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400">
          Failed to load scholarships: {listError.message || 'Unknown error'}
        </div>
      )}
      {uniError && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-400">
          Failed to load universities for filter: {uniError.message}. Try refreshing.
        </div>
      )}

      <div className="shadow-xs overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/[0.08] dark:bg-[#18181b]">
        <AdminTable>
          <div className="overflow-x-auto">
            <div className="grid min-w-[900px] grid-cols-7 border-b border-gray-200 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-700 dark:border-white/[0.08] dark:bg-[#18181b]/80 dark:text-gray-300">
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
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#c41e3a]" />
                </div>
              </div>
            ) : scholarships.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
                <Award size={48} className="mb-3 text-gray-400 dark:text-gray-600" />
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  No scholarships found
                </p>
                <p className="text-sm text-gray-500">Add your first scholarship to get started.</p>
              </div>
            ) : (
              scholarships.map((s) => (
                <div
                  key={s.id}
                  className="grid min-w-[900px] grid-cols-7 items-center border-b border-gray-100 px-6 py-5 transition-colors hover:bg-gray-50 dark:border-white/[0.06] dark:hover:bg-white/[0.02]"
                >
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{s.name}</div>
                    {s.course && <div className="text-xs text-gray-400">{s.course.title}</div>}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {s.university?.name || '—'}
                  </div>
                  <div className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {s.amount != null ? (
                      <>
                        <DollarSign size={13} className="text-gray-400" />
                        {formatCurrency(Number(s.amount), s.currencyCode || 'USD')}
                      </>
                    ) : (
                      '—'
                    )}
                  </div>
                  <div>
                    <span className="inline-flex items-center rounded-full bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                      {coverageTypes.find((ct) => ct.value === s.coverageType)?.label ||
                        s.coverageType}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {s.deadline ? new Date(s.deadline).toLocaleDateString() : '—'}
                  </div>
                  <div>
                    {s.isActive ? (
                      <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-950/60 dark:text-green-300">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                        <EyeOff size={11} /> Inactive
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEdit(s)}
                      className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 dark:hover:bg-white/[0.06]"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(s.id)}
                      className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/60"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </AdminTable>
      </div>

      {showModal &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
            <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-white/[0.08] dark:bg-[#18181b]">
              <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-5 dark:border-white/[0.08]">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingId ? 'Edit Scholarship' : 'Add Scholarship'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false)
                    setEditingId(null)
                    setForm(emptyForm)
                    setFormErrors({})
                  }}
                  className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/[0.06] dark:hover:text-gray-300"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="min-h-0 overflow-y-auto">
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="grid grid-cols-1 gap-4 px-6 py-6 sm:grid-cols-2"
                >
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Scholarship Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. SNU Global Excellence"
                      className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-gray-900 outline-none dark:bg-[#09090b] dark:text-white ${
                        formErrors.name
                          ? 'border-red-300 focus:border-red-400'
                          : 'border-gray-200 focus:border-[#c41e3a] dark:border-white/[0.08]'
                      }`}
                    />
                    {formErrors.name && (
                      <p className="mt-1 text-xs text-red-600">{formErrors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      University <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.universityId}
                      onChange={(e) => setForm({ ...form, universityId: e.target.value })}
                      className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-gray-900 outline-none dark:bg-[#09090b] dark:text-white ${
                        formErrors.universityId
                          ? 'border-red-300 focus:border-red-400'
                          : 'border-gray-200 focus:border-[#c41e3a] dark:border-white/[0.08]'
                      }`}
                    >
                      <option value="">Select University</option>
                      {uniError ? (
                        <option disabled>Error loading universities</option>
                      ) : universities.length === 0 ? (
                        <option disabled>No universities found</option>
                      ) : (
                        universities.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.name}
                          </option>
                        ))
                      )}
                    </select>
                    {formErrors.universityId ? (
                      <p className="mt-1 text-xs text-red-600">{formErrors.universityId}</p>
                    ) : (
                      <p className="mt-1 text-xs text-gray-400">
                        Required — links scholarship to a catalog university.
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Course <span className="font-normal text-gray-400">(optional)</span>
                    </label>
                    <select
                      value={form.courseId}
                      onChange={(e) => setForm({ ...form, courseId: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                    >
                      <option value="">Select Course (optional)</option>
                      {coursesLoading ? (
                        <option disabled>Loading...</option>
                      ) : (
                        courses.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.title}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Amount
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.amount}
                      onChange={(e) => setForm({ ...form, amount: e.target.value })}
                      placeholder="e.g. 5000"
                      className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-gray-900 outline-none dark:bg-[#09090b] dark:text-white ${
                        formErrors.amount
                          ? 'border-red-300 focus:border-red-400'
                          : 'border-gray-200 focus:border-[#c41e3a] dark:border-white/[0.08]'
                      }`}
                    />
                    {formErrors.amount ? (
                      <p className="mt-1 text-xs text-red-600">{formErrors.amount}</p>
                    ) : (
                      <p className="mt-1 text-xs text-gray-400">Leave empty for full coverage.</p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Currency <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.currencyCode}
                      onChange={(e) => setForm({ ...form, currencyCode: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="KRW">KRW (₩)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="JPY">JPY (¥)</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Coverage Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.coverageType}
                      onChange={(e) => setForm({ ...form, coverageType: e.target.value })}
                      className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-gray-900 outline-none dark:bg-[#09090b] dark:text-white ${
                        formErrors.coverageType
                          ? 'border-red-300'
                          : 'border-gray-200 focus:border-[#c41e3a] dark:border-white/[0.08]'
                      }`}
                    >
                      {coverageTypes.map((ct) => (
                        <option key={ct.value} value={ct.value}>
                          {ct.label}
                        </option>
                      ))}
                    </select>
                    {formErrors.coverageType && (
                      <p className="mt-1 text-xs text-red-600">{formErrors.coverageType}</p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Deadline
                    </label>
                    <input
                      type="date"
                      value={form.deadline}
                      onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                      className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-gray-900 outline-none dark:bg-[#09090b] dark:text-white ${
                        formErrors.deadline
                          ? 'border-red-300'
                          : 'border-gray-200 focus:border-[#c41e3a] dark:border-white/[0.08]'
                      }`}
                    />
                    {formErrors.deadline && (
                      <p className="mt-1 text-xs text-red-600">{formErrors.deadline}</p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Link URL
                    </label>
                    <input
                      type="url"
                      value={form.linkUrl}
                      onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
                      placeholder="https://..."
                      className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-gray-900 outline-none dark:bg-[#09090b] dark:text-white ${
                        formErrors.linkUrl
                          ? 'border-red-300'
                          : 'border-gray-200 focus:border-[#c41e3a] dark:border-white/[0.08]'
                      }`}
                    />
                    {formErrors.linkUrl ? (
                      <p className="mt-1 text-xs text-red-600">{formErrors.linkUrl}</p>
                    ) : (
                      <p className="mt-1 text-xs text-gray-400">
                        Must start with https:// if provided.
                      </p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Description
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={2}
                      placeholder="Short description shown on the spotlight card"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Eligibility Criteria
                    </label>
                    <textarea
                      value={form.eligibility}
                      onChange={(e) => setForm({ ...form, eligibility: e.target.value })}
                      rows={2}
                      placeholder="e.g. GPA 3.5+, IELTS 6.5+"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 dark:border-white/[0.06] dark:bg-[#18181b]/50 sm:col-span-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">Active</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Visible on the public /universities spotlight
                      </p>
                    </div>
                    <ToggleSwitch
                      checked={form.isActive}
                      onChange={(v) => setForm({ ...form, isActive: v })}
                      label="Active toggle"
                    />
                  </div>
                  {(createMutation.error || updateMutation.error) && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400 sm:col-span-2">
                      {createMutation.error?.message ||
                        updateMutation.error?.message ||
                        'Something went wrong. Please check the fields and try again.'}
                    </div>
                  )}
                  <div className="flex justify-end gap-3 pt-2 sm:col-span-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false)
                        setEditingId(null)
                        setForm(emptyForm)
                        setFormErrors({})
                      }}
                      className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/[0.08] dark:text-gray-300 dark:hover:bg-white/[0.06]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      style={{ background: '#c41e3a', boxShadow: '0 4px 12px rgba(196,30,58,0.2)' }}
                      className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                      {isSaving ? 'Saving...' : editingId ? 'Update' : 'Create'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirm &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-white/[0.08] dark:bg-[#18181b]">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Delete Scholarship?
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                This action cannot be undone. The scholarship will be permanently removed.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/[0.08] dark:text-gray-300 dark:hover:bg-white/[0.06]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteMutation.mutate({ id: deleteConfirm })}
                  disabled={deleteMutation.isPending}
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                >
                  {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}
