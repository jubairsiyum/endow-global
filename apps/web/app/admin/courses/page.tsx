'use client'

import { QuillEditor } from '@/components/super-admin/shared/QuillEditor'
import AdminTable from '@/components/ui/AdminTable'
import PageHeader from '@/components/ui/PageHeader'
import { useSession } from '@/lib/auth-client'
import { hasPermission, parsePermissionsJSON } from '@/lib/rbac'
import { trpc } from '@/lib/trpc-client'
import { UserRole } from '@endow/types'
import {
  BookOpen,
  DollarSign,
  EyeOff,
  FileText,
  GraduationCap,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { toast } from 'sonner'

const LEVELS = ['UNDERGRADUATE', 'POSTGRADUATE', 'PHD', 'DIPLOMA', 'CERTIFICATE', 'FOUNDATION']
const MODES = ['FULL_TIME', 'PART_TIME', 'ONLINE', 'HYBRID']
const DURATION_UNITS = ['YEARS', 'MONTHS']
const CURRENCIES = ['USD', 'BDT', 'KRW', 'AUD', 'GBP', 'EUR', 'CAD', 'CNY', 'JPY']

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
  description: string
  isActive: boolean
  campus: string
  modeOfStudy: string
  highlights: string
  professionalAccreditation: string
  offerResponseTime: string
  applicationFee: string
  applicationFeeCurrency: string
  brochureUrl: string
  applicationDeadline: string
  startDate: string
  hasScholarship: boolean
  scholarshipDetails: string
  backlogsAccepted: boolean
  gapYearsAccepted: boolean
  englishTestWaiver: boolean
  expressOffer: boolean
}

const emptyForm: CourseForm = {
  universityId: '',
  name: '',
  slug: '',
  subject: '',
  level: 'POSTGRADUATE',
  duration: '',
  durationUnit: 'YEARS',
  tuitionFee: '',
  currency: 'USD',
  language: 'English',
  description: '',
  isActive: true,
  campus: '',
  modeOfStudy: 'FULL_TIME',
  highlights: '',
  professionalAccreditation: '',
  offerResponseTime: '',
  applicationFee: '',
  applicationFeeCurrency: 'USD',
  brochureUrl: '',
  applicationDeadline: '',
  startDate: '',
  hasScholarship: false,
  scholarshipDetails: '',
  backlogsAccepted: false,
  gapYearsAccepted: false,
  englishTestWaiver: false,
  expressOffer: false,
}

interface UniversityItem {
  id: string
  name: string
}

interface CourseItem {
  id: string
  name?: string | null
  slug?: string | null
  subject?: string | null
  level?: string | null
  duration?: number | null
  durationUnit?: string | null
  tuitionFee?: number | null
  currency?: string | null
  language?: string | null
  description?: string | null
  isActive?: boolean | null
  campus?: string | null
  modeOfStudy?: string | null
  highlights?: unknown
  professionalAccreditation?: string | null
  offerResponseTime?: string | null
  applicationFee?: number | null
  applicationFeeCurrency?: string | null
  brochureUrl?: string | null
  applicationDeadline?: string | Date | null
  startDate?: string | Date | null
  hasScholarship?: boolean | null
  scholarshipDetails?: string | null
  backlogsAccepted?: boolean | null
  gapYearsAccepted?: boolean | null
  englishTestWaiver?: boolean | null
  expressOffer?: boolean | null
  universityId?: string | null
  university?: {
    name?: string | null
  } | null
  requirements?: unknown
}

interface RequirementItem {
  cat: string
  title: string
  desc: string
}

interface SessionUser {
  role?: UserRole
  permissions?: string | string[]
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debouncedValue
}

function highlightsToText(value: unknown): string {
  if (Array.isArray(value)) return value.filter((v) => typeof v === 'string').join('\n')
  if (typeof value !== 'string') return ''
  let current: unknown = value
  for (let i = 0; i < 2; i++) {
    try {
      current = JSON.parse(current as string)
    } catch {
      break
    }
    if (Array.isArray(current)) return current.filter((v) => typeof v === 'string').join('\n')
    if (typeof current !== 'string') break
  }
  return typeof current === 'string' ? current : ''
}

function hasRichTextContent(value: string): boolean {
  return (
    value
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .trim().length > 0
  )
}

export default function CoursesPage() {
  const { data: session } = useSession()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 400)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<CourseForm>(emptyForm)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [reqItems, setReqItems] = useState<RequirementItem[]>([])
  const [levelFilter, setLevelFilter] = useState('')
  const [universityFilter, setUniversityFilter] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const utils = trpc.useUtils()
  const sessionUser = session?.user as SessionUser | undefined
  const role = sessionUser?.role
  const permissions = parsePermissionsJSON(sessionUser?.permissions)
  const canManage =
    role === UserRole.SUPER_ADMIN || hasPermission(permissions, 'courses:manage', role)

  const { data: coursesData, isLoading } = trpc.admin.courses.list.useQuery({
    search: debouncedSearch || undefined,
    level: levelFilter ? (levelFilter as any) : undefined,
    universityId: universityFilter || undefined,
  })
  const { data: universitiesData } = trpc.admin.universities.list.useQuery({})
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: _subjects } = trpc.admin.courses.getSubjects.useQuery()

  const courses: CourseItem[] = (coursesData as CourseItem[]) || []
  const universities: UniversityItem[] = (universitiesData as UniversityItem[]) || []

  const createMutation = trpc.admin.courses.create.useMutation({
    onSuccess: () => {
      toast.success('Course created')
      utils.admin.courses.list.invalidate()
      setShowModal(false)
      setForm(emptyForm)
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (e: any) => toast.error(e?.message || 'Failed to create course'),
  })

  const updateMutation = trpc.admin.courses.update.useMutation({
    onSuccess: () => {
      toast.success('Course updated')
      utils.admin.courses.list.invalidate()
      setShowModal(false)
      setEditingId(null)
      setForm(emptyForm)
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (e: any) => toast.error(e?.message || 'Failed to update course'),
  })

  const deleteMutation = trpc.admin.courses.delete.useMutation({
    onSuccess: () => {
      toast.success('Course deleted')
      utils.admin.courses.list.invalidate()
      setDeleteConfirm(null)
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (e: any) => toast.error(e?.message || 'Failed to delete course'),
  })

  function setF(key: string, value: unknown) {
    setForm((p) => ({ ...p, [key]: value }))
  }

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setReqItems([])
    setShowModal(true)
  }

  function openEdit(c: CourseItem) {
    setEditingId(c.id)
    setForm({
      universityId: c.universityId || '',
      name: c.name || '',
      slug: c.slug || '',
      subject: c.subject || '',
      level: c.level || 'POSTGRADUATE',
      duration: c.duration?.toString() || '',
      durationUnit: c.durationUnit || 'YEARS',
      tuitionFee: c.tuitionFee?.toString() || '',
      currency: c.currency || 'USD',
      language: c.language || 'English',
      description: c.description || '',
      isActive: c.isActive ?? true,
      campus: c.campus || '',
      modeOfStudy: c.modeOfStudy || 'FULL_TIME',
      highlights: highlightsToText(c.highlights),
      professionalAccreditation: c.professionalAccreditation || '',
      offerResponseTime: c.offerResponseTime || '',
      applicationFee: c.applicationFee?.toString() || '',
      applicationFeeCurrency: c.applicationFeeCurrency || 'USD',
      brochureUrl: c.brochureUrl || '',
      applicationDeadline: c.applicationDeadline
        ? new Date(c.applicationDeadline).toISOString().slice(0, 10)
        : '',
      startDate: c.startDate ? new Date(c.startDate).toISOString().slice(0, 10) : '',
      hasScholarship: c.hasScholarship || false,
      scholarshipDetails: c.scholarshipDetails || '',
      backlogsAccepted: c.backlogsAccepted || false,
      gapYearsAccepted: c.gapYearsAccepted || false,
      englishTestWaiver: c.englishTestWaiver || false,
      expressOffer: c.expressOffer || false,
    })
    setShowModal(true)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existingReqs: any[] = Array.isArray(c.requirements)
      ? c.requirements
      : typeof c.requirements === 'string'
        ? (() => {
            try {
              return JSON.parse(c.requirements)
            } catch {
              return []
            }
          })()
        : []

    setReqItems(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      existingReqs.map((r: any) => {
        if (typeof r === 'object' && r && r.title) return r
        const str = typeof r === 'string' ? r : String(r)
        const match = str.match(/^([^:]+):\s*(.+?)(?:\s*\(([^)]+)\))?$/)
        return match
          ? { cat: match[1].trim(), title: match[2].trim(), desc: match[3]?.trim() || '' }
          : { cat: 'OTHER', title: str, desc: '' }
      })
    )
  }

  function onSave() {
    if (!form.name.trim() || !form.slug.trim() || !form.universityId) {
      toast.error('Required fields missing')
      return
    }
    if (!hasRichTextContent(form.description)) {
      toast.error('Course description is required')
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = {
      ...form,
      duration: parseInt(form.duration) || 1,
      tuitionFee: parseInt(form.tuitionFee) || 0,
      applicationFee: form.applicationFee ? parseFloat(form.applicationFee) : undefined,
      highlights: form.highlights
        ? form.highlights
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      applicationDeadline: form.applicationDeadline
        ? new Date(form.applicationDeadline)
        : undefined,
      startDate: form.startDate ? new Date(form.startDate) : undefined,
      brochureUrl: form.brochureUrl || undefined,
      offerResponseTime: form.offerResponseTime || undefined,
      professionalAccreditation: form.professionalAccreditation || undefined,
      campus: form.campus || undefined,
      modeOfStudy: form.modeOfStudy,
      requirements: reqItems
        .filter((r) => r.title.trim())
        .map((r) => `${r.cat}: ${r.title}${r.desc ? ` (${r.desc})` : ''}`),
      scholarshipDetails: form.scholarshipDetails || undefined,
    }

    if (editingId) updateMutation.mutate({ id: editingId, ...data })
    else createMutation.mutate(data)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Courses"
        description="Manage course catalog across partner universities."
        buttonText={canManage ? 'Add Course' : undefined}
        onButtonClick={canManage ? openCreate : undefined}
      />
      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or subject…"
            className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-5 text-gray-900 outline-none transition-all focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#18181b] dark:text-white dark:placeholder-gray-500"
          />
        </div>
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm text-gray-700 outline-none dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 lg:w-44"
        >
          <option value="">All Levels</option>
          {LEVELS.map((l) => (
            <option key={l} value={l}>
              {l.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
        <select
          value={universityFilter}
          onChange={(e) => setUniversityFilter(e.target.value)}
          className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm text-gray-700 outline-none dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 lg:w-48"
        >
          <option value="">All Universities</option>
          {universities.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      </div>

      <div className="shadow-xs overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/[0.08] dark:bg-[#18181b]">
        <AdminTable>
          <div className="overflow-x-auto">
            <div className="grid min-w-[900px] grid-cols-7 border-b border-gray-200 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-700 dark:border-white/[0.08] dark:bg-[#18181b]/80 dark:text-gray-300">
              <div>Course</div>
              <div>University</div>
              <div>Level</div>
              <div>Mode</div>
              <div>Fee</div>
              <div>Status</div>
              <div>Actions</div>
            </div>
            {isLoading ? (
              <div className="py-10">
                <div className="flex justify-center pb-4">
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#c41e3a]" />
                </div>
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="grid min-w-[900px] grid-cols-7 items-center border-b border-gray-100 px-6 py-5 dark:border-white/[0.06]"
                    >
                      <div className="h-4 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                      <div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                      <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
                      <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                      <div className="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                      <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
                      <div className="h-8 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                    </div>
                  ))}
              </div>
            ) : courses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
                <BookOpen size={48} className="mb-3 text-gray-400 dark:text-gray-600" />
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  No courses found
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Add your first course to get started.
                </p>
              </div>
            ) : (
              courses.map((c) => (
                <div
                  key={c.id}
                  className="grid min-w-[900px] grid-cols-7 items-center border-b border-gray-100 px-6 py-5 transition-colors hover:bg-gray-50 dark:border-white/[0.06] dark:hover:bg-white/[0.02]"
                >
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{c.name}</div>
                    <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                      {c.subject}
                      {c.campus ? ` · ${c.campus}` : ''}
                    </div>
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    {c.university?.name || '—'}
                  </div>
                  <div>
                    <span className="inline-flex items-center rounded-full bg-[#c41e3a]/10 px-2.5 py-0.5 text-xs font-semibold text-[#c41e3a] dark:bg-[#c41e3a]/20 dark:text-[#e05266]">
                      {c.level?.replace(/_/g, ' ') || '—'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {c.modeOfStudy ? c.modeOfStudy.replace(/_/g, ' ') : '—'}
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {c.currency} {c.tuitionFee?.toLocaleString()}
                  </div>
                  <div>
                    {c.isActive ? (
                      <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-950/60 dark:text-green-300">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                        <EyeOff size={11} />
                        Hidden
                      </span>
                    )}
                  </div>
                  {canManage && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(c)}
                        className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 dark:hover:bg-white/[0.06]"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(c.id)}
                        className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/60"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
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
            <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-white/[0.08] dark:bg-[#18181b]">
              <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-5 dark:border-white/[0.08]">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingId ? 'Edit Course' : 'Add Course'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false)
                    setEditingId(null)
                    setForm(emptyForm)
                  }}
                  className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/[0.06] dark:hover:text-gray-300"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="min-h-0 overflow-y-auto">
                <div className="grid grid-cols-1 gap-4 px-6 py-6 sm:grid-cols-2">
                  {/* Basic Info */}
                  <div className="mb-1 sm:col-span-2">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                      <BookOpen size={15} className="text-[#c41e3a]" />
                      Basic Information
                    </h3>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      University *
                    </label>
                    <select
                      value={form.universityId}
                      onChange={(e) => setF('universityId', e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                    >
                      <option value="">Select…</option>
                      {universities.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {[
                    {
                      l: 'Course Name *',
                      k: 'name',
                      onCh: (v: string) => {
                        setF('name', v)
                        if (!editingId)
                          setF(
                            'slug',
                            v
                              .toLowerCase()
                              .replace(/[^a-z0-9\s-]/g, '')
                              .replace(/\s+/g, '-')
                              .replace(/-+/g, '-')
                              .replace(/^-|-$/g, '')
                          )
                      },
                    },
                  ].map((f) => (
                    <div key={f.k}>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {f.l}
                      </label>
                      <input
                        value={(form as any)[f.k]}
                        onChange={(e) =>
                          f.onCh ? f.onCh(e.target.value) : setF(f.k, e.target.value)
                        }
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      URL Slug *
                    </label>
                    <input
                      value={form.slug}
                      onChange={(e) => setF('slug', e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 font-mono text-sm font-medium text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Subject
                    </label>
                    <input
                      value={form.subject}
                      onChange={(e) => setF('subject', e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                    />
                  </div>
                  {[
                    {
                      l: 'Level',
                      k: 'level',
                      type: 'select',
                      options: LEVELS.map((l) => ({ v: l, label: l.replace(/_/g, ' ') })),
                    },
                    {
                      l: 'Mode of Study',
                      k: 'modeOfStudy',
                      type: 'select',
                      options: MODES.map((m) => ({ v: m, label: m.replace(/_/g, ' ') })),
                    },
                  ].map((f) => (
                    <div key={f.k}>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {f.l}
                      </label>
                      <select
                        value={(form as any)[f.k]}
                        onChange={(e) => setF(f.k, e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                      >
                        {f.options.map((o) => (
                          <option key={o.v} value={o.v}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Campus
                    </label>
                    <input
                      value={form.campus}
                      onChange={(e) => setF('campus', e.target.value)}
                      placeholder="e.g. Aston Birmingham Campus"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white dark:placeholder-gray-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Description *
                    </label>
                    <QuillEditor
                      value={form.description}
                      onChange={(value) => setF('description', value)}
                      placeholder="Write a clear overview of the course..."
                      minHeight={180}
                    />
                  </div>

                  {/* Study Details */}
                  <div className="mb-1 sm:col-span-2">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                      <DollarSign size={15} className="text-[#c41e3a]" />
                      Study Details
                    </h3>
                  </div>
                  {[
                    { l: 'Duration', k: 'duration', t: 'number' },
                    {
                      l: 'Duration Unit',
                      k: 'durationUnit',
                      type: 'select',
                      options: DURATION_UNITS.map((u) => ({ v: u, label: u })),
                    },
                    { l: 'Tuition Fee', k: 'tuitionFee', t: 'number' },
                    { l: 'Currency', k: 'currency' },
                    { l: 'Language', k: 'language' },
                  ].map((f) =>
                    f.type === 'select' ? (
                      <div key={f.k}>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          {f.l}
                        </label>
                        <select
                          value={(form as any)[f.k]}
                          onChange={(e) => setF(f.k, e.target.value)}
                          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                        >
                          {f.options.map((o) => (
                            <option key={o.v} value={o.v}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div key={f.k}>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          {f.l}
                        </label>
                        <input
                          type={f.t || 'text'}
                          value={(form as any)[f.k]}
                          onChange={(e) => setF(f.k, e.target.value)}
                          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                        />
                      </div>
                    )
                  )}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={form.startDate}
                      onChange={(e) => setF('startDate', e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Apply By
                    </label>
                    <input
                      type="date"
                      value={form.applicationDeadline}
                      onChange={(e) => setF('applicationDeadline', e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                    />
                  </div>

                  {/* Admission */}
                  <div className="mb-1 sm:col-span-2">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                      <GraduationCap size={15} className="text-[#c41e3a]" />
                      Admission & Offers
                    </h3>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Application Fee
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={form.applicationFee}
                      onChange={(e) => setF('applicationFee', e.target.value)}
                      placeholder="e.g. 100"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white dark:placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Application Fee Currency
                    </label>
                    <select
                      value={form.applicationFeeCurrency}
                      onChange={(e) => setF('applicationFeeCurrency', e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                    >
                      {CURRENCIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  {[
                    { l: 'Offer Response Time', k: 'offerResponseTime', p: 'e.g. 2 days' },
                    {
                      l: 'Professional Accreditation',
                      k: 'professionalAccreditation',
                      p: 'e.g. CMI Level 7',
                    },
                    { l: 'Brochure URL', k: 'brochureUrl', p: 'https://…' },
                  ].map((f) => (
                    <div key={f.k}>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {f.l}
                      </label>
                      <input
                        type="text"
                        value={(form as any)[f.k]}
                        onChange={(e) => setF(f.k, e.target.value)}
                        placeholder={f.p}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white dark:placeholder-gray-500"
                      />
                    </div>
                  ))}
                  <div className="flex flex-wrap gap-3 sm:col-span-2">
                    {[
                      { k: 'backlogsAccepted', l: 'Backlogs Accepted' },
                      { k: 'gapYearsAccepted', l: 'Gap Years Accepted' },
                      { k: 'englishTestWaiver', l: 'English Test Waiver' },
                      { k: 'expressOffer', l: 'Express Offer' },
                    ].map(({ k, l }) => (
                      <button
                        type="button"
                        key={k}
                        onClick={() => setF(k, !(form as any)[k])}
                        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                          (form as any)[k]
                            ? 'border-green-300 bg-green-50 text-green-700 dark:border-green-900/40 dark:bg-green-950/40 dark:text-green-300'
                            : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 dark:border-white/[0.08] dark:bg-[#09090b] dark:text-gray-400'
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            (form as any)[k] ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'
                          }`}
                        />
                        {l}
                      </button>
                    ))}
                  </div>

                  {/* Highlights */}
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Key Highlights (one per line)
                    </label>
                    <textarea
                      value={form.highlights}
                      onChange={(e) => setF('highlights', e.target.value)}
                      rows={4}
                      placeholder="Recognised for quality: Triple accreditation&#10;Top 5% globally (QS World Rankings)"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white dark:placeholder-gray-500"
                    />
                  </div>

                  {/* Requirements */}
                  <div className="sm:col-span-2">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                        <FileText size={15} className="text-[#c41e3a]" />
                        Requirements
                      </h3>
                      <button
                        type="button"
                        onClick={() =>
                          setReqItems((p) => [...p, { cat: 'ACADEMIC', title: '', desc: '' }])
                        }
                        className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 dark:hover:bg-white/[0.06]"
                      >
                        <Plus size={12} />
                        Add Requirement
                      </button>
                    </div>
                    {reqItems.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-gray-200 py-4 text-center dark:border-white/[0.08]">
                        <p className="text-xs text-gray-400">
                          No requirements added yet. Click &quot;Add Requirement&quot; to start.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {reqItems.map((r, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <select
                              value={r.cat}
                              onChange={(e) =>
                                setReqItems((p) =>
                                  p.map((x, j) => (j === i ? { ...x, cat: e.target.value } : x))
                                )
                              }
                              className="w-[140px] shrink-0 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                            >
                              {[
                                'ACADEMIC',
                                'ENGLISH_LANGUAGE',
                                'IDENTITY',
                                'MEDICAL',
                                'PROFESSIONAL',
                                'OTHER',
                              ].map((c) => (
                                <option key={c} value={c}>
                                  {c.replace(/_/g, ' ')}
                                </option>
                              ))}
                            </select>
                            <input
                              value={r.title}
                              onChange={(e) =>
                                setReqItems((p) =>
                                  p.map((x, j) => (j === i ? { ...x, title: e.target.value } : x))
                                )
                              }
                              placeholder="Requirement title"
                              className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white dark:placeholder-gray-500"
                            />
                            <input
                              value={r.desc}
                              onChange={(e) =>
                                setReqItems((p) =>
                                  p.map((x, j) => (j === i ? { ...x, desc: e.target.value } : x))
                                )
                              }
                              placeholder="Min. %"
                              className="w-[100px] shrink-0 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white dark:placeholder-gray-500"
                            />
                            <button
                              type="button"
                              onClick={() => setReqItems((p) => p.filter((_, j) => j !== i))}
                              className="shrink-0 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/40"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Toggles */}
                  <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
                    <button
                      type="button"
                      onClick={() => setF('isActive', !form.isActive)}
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                        form.isActive
                          ? 'border-green-300 bg-green-50 text-green-700 dark:border-green-900/40 dark:bg-green-950/40 dark:text-green-300'
                          : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 dark:border-white/[0.08] dark:bg-[#09090b] dark:text-gray-400'
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          form.isActive ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'
                        }`}
                      />
                      Active / Published
                    </button>
                    <button
                      type="button"
                      onClick={() => setF('hasScholarship', !form.hasScholarship)}
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                        form.hasScholarship
                          ? 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-300'
                          : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 dark:border-white/[0.08] dark:bg-[#09090b] dark:text-gray-400'
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          form.hasScholarship ? 'bg-amber-500' : 'bg-gray-300 dark:bg-gray-700'
                        }`}
                      />
                      Has Scholarship
                    </button>
                    {form.hasScholarship && (
                      <input
                        value={form.scholarshipDetails}
                        onChange={(e) => setF('scholarshipDetails', e.target.value)}
                        placeholder="Scholarship details…"
                        className="min-w-[200px] flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white dark:placeholder-gray-500"
                      />
                    )}
                  </div>

                  <div className="flex justify-end gap-3 pt-2 sm:col-span-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false)
                        setEditingId(null)
                        setForm(emptyForm)
                      }}
                      className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 dark:hover:bg-white/[0.06]"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={onSave}
                      disabled={createMutation.isPending || updateMutation.isPending}
                      style={{ background: '#c41e3a', boxShadow: '0 4px 12px rgba(196,30,58,0.2)' }}
                      className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-95 disabled:opacity-50"
                    >
                      {createMutation.isPending || updateMutation.isPending
                        ? 'Saving...'
                        : editingId
                          ? 'Update Course'
                          : 'Create Course'}
                    </button>
                  </div>
                </div>
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
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete Course?</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                This action cannot be undone. The course will be permanently removed from the
                catalog.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 dark:hover:bg-white/[0.06]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteMutation.mutate({ id: deleteConfirm })}
                  disabled={deleteMutation.isPending}
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
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
