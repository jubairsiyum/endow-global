'use client'

import { useAdminCreateShortcut } from '@/lib/hooks/useAdminCreateShortcut'
import AdminTable from '@/components/ui/AdminTable'
import PageHeader from '@/components/ui/PageHeader'
import StatusBadge from '@/components/ui/StatusBadge'
import { useSession } from '@/lib/auth-client'
import { hasPermission, parsePermissionsJSON } from '@/lib/rbac'
import { trpc } from '@/lib/trpc-client'
import { UserRole } from '@endow/types'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  BookOpen,
  Calendar,
  ChevronDown,
  Copy,
  Download,
  ExternalLink,
  FileSpreadsheet,
  Filter,
  GraduationCap,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  Search,
  ShieldAlert,
  ShieldCheck,
  User,
  UserCheck,
  Users,
  UserX,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const createStudentSchema = z.object({
  name: z.string().trim().min(1, 'Full name is required'),
  email: z.string().trim().email('Valid email address is required'),
  phone: z.string().trim().optional(),
  nationality: z.string().trim().optional(),
  countryOfResidence: z.string().trim().optional(),
  highestEducation: z.enum(['HIGH_SCHOOL', 'BACHELORS', 'MASTERS', 'PHD']),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .optional()
    .or(z.literal('')),
})

type CreateStudentFormValues = z.infer<typeof createStudentSchema>

interface SessionUser {
  role?: UserRole
  permissions?: string | string[]
}

interface StudentItem {
  id: string
  name?: string | null
  email?: string | null
  emailVerified?: boolean | null
  image?: string | null
  createdAt?: string | Date | null
  applicationsCount?: number
  studentProfile?: {
    id?: string | null
    phone?: string | null
    nationality?: string | null
    countryOfResidence?: string | null
    highestEducation?: string | null
    interestedProgram?: string | null
    gpa?: number | null
    ieltsScore?: number | null
    targetCountries?: string[] | null
    assignedCounselorId?: string | null
    assignedCounselor?: {
      id?: string | null
      user?: {
        name?: string | null
        email?: string | null
      } | null
    } | null
  } | null
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debouncedValue
}

function fmtDate(date: string | Date | null | undefined): string {
  if (!date) return '—'
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function cleanPhoneForWhatsApp(phone: string | null | undefined): string {
  if (!phone) return ''
  return phone.replace(/[^0-9]/g, '')
}

export default function StudentsPage() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 400)
  const [cursor, setCursor] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  // Filters state
  const [counselorFilter, setCounselorFilter] = useState('ALL')
  const [educationFilter, setEducationFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [appsFilter, setAppsFilter] = useState('ALL')

  useAdminCreateShortcut('students', () => {
    if (canManage) setShowCreateModal(true)
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const { data: session } = useSession()
  const sessionUser = session?.user as SessionUser | undefined
  const role = sessionUser?.role
  const permissions = parsePermissionsJSON(sessionUser?.permissions)
  const canManage =
    role === UserRole.SUPER_ADMIN || hasPermission(permissions, 'students:manage', role)

  const utils = trpc.useUtils()
  const createMutation = trpc.admin.students.create.useMutation()
  const { data: counselorsData } = trpc.admin.counselors.list.useQuery()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const counselors = (counselorsData as any[]) || []

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateStudentFormValues>({
    resolver: zodResolver(createStudentSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      nationality: '',
      countryOfResidence: '',
      highestEducation: 'HIGH_SCHOOL',
      password: '',
    },
  })

  const onSubmit = async (values: CreateStudentFormValues) => {
    try {
      await createMutation.mutateAsync({
        name: values.name,
        email: values.email,
        phone: values.phone || undefined,
        nationality: values.nationality || undefined,
        countryOfResidence: values.countryOfResidence || undefined,
        highestEducation: values.highestEducation,
        password: values.password || undefined,
      })
      toast.success('Student added successfully')
      utils.admin.students.list.invalidate()
      setShowCreateModal(false)
      reset()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to add student')
    }
  }

  const { data, isLoading, error } = trpc.admin.students.list.useQuery({
    search: debouncedSearch || undefined,
    cursor: cursor,
    limit: 50,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errObj = error as any
  const isForbidden =
    errObj?.data?.httpStatus === 403 ||
    errObj?.data?.code === 'FORBIDDEN' ||
    errObj?.message?.includes('FORBIDDEN')

  const rawList: StudentItem[] = data?.items || []

  // Client-side filtering across the loaded batch
  const filteredStudents = useMemo(() => {
    return rawList.filter((s) => {
      // Counselor filter
      if (counselorFilter === 'UNASSIGNED') {
        if (s.studentProfile?.assignedCounselor?.user?.name) return false
      } else if (counselorFilter !== 'ALL') {
        const cName = s.studentProfile?.assignedCounselor?.user?.name || ''
        const cId = s.studentProfile?.assignedCounselorId || ''
        if (cName !== counselorFilter && cId !== counselorFilter) return false
      }

      // Education filter
      if (educationFilter !== 'ALL') {
        if (s.studentProfile?.highestEducation !== educationFilter) return false
      }

      // Status filter
      if (statusFilter === 'VERIFIED' && !s.emailVerified) return false
      if (statusFilter === 'PENDING' && s.emailVerified) return false

      // Apps filter
      if (appsFilter === 'WITH_APPS' && (!s.applicationsCount || s.applicationsCount <= 0)) {
        return false
      }
      if (appsFilter === 'NO_APPS' && (s.applicationsCount ?? 0) > 0) {
        return false
      }

      return true
    })
  }, [rawList, counselorFilter, educationFilter, statusFilter, appsFilter])

  const activeFiltersCount = [
    counselorFilter !== 'ALL',
    educationFilter !== 'ALL',
    statusFilter !== 'ALL',
    appsFilter !== 'ALL',
  ].filter(Boolean).length

  const resetFilters = () => {
    setCounselorFilter('ALL')
    setEducationFilter('ALL')
    setStatusFilter('ALL')
    setAppsFilter('ALL')
  }

  // Quick stats
  const totalStudents = rawList.length
  const verifiedCount = rawList.filter((s) => s.emailVerified).length
  const assignedCount = rawList.filter((s) => s.studentProfile?.assignedCounselor?.user?.name).length
  const withAppsCount = rawList.filter((s) => (s.applicationsCount || 0) > 0).length

  const exportStudents = (format: 'csv' | 'json') => {
    if (format === 'csv') {
      const headers = [
        'ID',
        'Name',
        'Email',
        'Phone',
        'Nationality',
        'Country',
        'Highest Education',
        'GPA',
        'IELTS',
        'Applications Count',
        'Counselor',
        'Email Verified',
        'Created At',
      ]
      const rows = filteredStudents.map((s) => [
        s.id,
        s.name || '',
        s.email || '',
        s.studentProfile?.phone || '',
        s.studentProfile?.nationality || '',
        s.studentProfile?.countryOfResidence || '',
        s.studentProfile?.highestEducation || '',
        s.studentProfile?.gpa ?? '',
        s.studentProfile?.ieltsScore ?? '',
        s.applicationsCount || 0,
        s.studentProfile?.assignedCounselor?.user?.name || 'Unassigned',
        s.emailVerified ? 'VERIFIED' : 'PENDING',
        s.createdAt ? new Date(s.createdAt).toISOString() : '',
      ])
      const csvContent = [
        headers.join(','),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...rows.map((r) => r.map((c: any) => `"${String(c).replace(/"/g, '""')}"`).join(',')),
      ].join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `students_export_${new Date().toISOString().slice(0, 10)}.csv`
      link.click()
      toast.success('Students exported to CSV')
    } else {
      const jsonContent = JSON.stringify(filteredStudents, null, 2)
      const blob = new Blob([jsonContent], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `students_export_${new Date().toISOString().slice(0, 10)}.json`
      link.click()
      toast.success('Students exported to JSON')
    }
    setExportOpen(false)
  }

  return (
    <div className="w-full space-y-6 pb-12">
      {/* ─── 1. HEADER & TOP ACTIONS ─── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Students Directory"
          description="Manage registered student profiles, academic records, applications, and advisor assignments."
          buttonText={canManage ? 'Add New Student' : undefined}
          onButtonClick={canManage ? () => setShowCreateModal(true) : undefined}
        />

        <div className="flex items-center gap-2">
          {/* Filters Toggle Button */}
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold shadow-2xs transition-colors ${
              activeFiltersCount > 0
                ? 'border-[#c41e3a] bg-red-50 text-[#c41e3a] dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300'
                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 dark:hover:bg-white/[0.06]'
            }`}
          >
            <Filter size={14} />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="ml-0.5 rounded-full bg-[#c41e3a] px-1.5 py-0.2 text-[10px] font-bold text-white">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Export Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setExportOpen(!exportOpen)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-2xs transition-colors hover:bg-gray-50 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 dark:hover:bg-white/[0.06]"
            >
              <Download size={14} />
              <span>Export</span>
              <ChevronDown size={12} />
            </button>
            {exportOpen && (
              <div className="absolute right-0 top-full z-30 mt-1 w-44 rounded-xl border border-gray-200 bg-white py-1 shadow-xl dark:border-white/[0.08] dark:bg-[#18181b]">
                <button
                  type="button"
                  onClick={() => exportStudents('csv')}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/[0.06]"
                >
                  <FileSpreadsheet size={14} className="text-emerald-600" />
                  Export as CSV
                </button>
                <button
                  type="button"
                  onClick={() => exportStudents('json')}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/[0.06]"
                >
                  <Download size={14} className="text-blue-600" />
                  Export as JSON
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── 2. KPI METRICS CARDS ─── */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-2xs dark:border-white/[0.08] dark:bg-[#18181b]">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Students</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-[#c41e3a] dark:bg-red-950/50 dark:text-red-400">
              <Users size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {totalStudents}
          </p>
          <p className="mt-0.5 text-xs text-gray-400">Registered platform learners</p>
        </div>

        <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-2xs dark:border-white/[0.08] dark:bg-[#18181b]">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Verified Accounts</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <ShieldCheck size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {verifiedCount}
          </p>
          <p className="mt-0.5 text-xs text-gray-400">
            {totalStudents > 0 ? `${Math.round((verifiedCount / totalStudents) * 100)}% verified rate` : '0%'}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-2xs dark:border-white/[0.08] dark:bg-[#18181b]">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Assigned Advisors</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <UserCheck size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {assignedCount}
          </p>
          <p className="mt-0.5 text-xs text-gray-400">
            {totalStudents - assignedCount} unassigned
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-2xs dark:border-white/[0.08] dark:bg-[#18181b]">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Active Applicants</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
              <BookOpen size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {withAppsCount}
          </p>
          <p className="mt-0.5 text-xs text-gray-400">Students with course submissions</p>
        </div>
      </div>

      {/* ─── 3. SEARCH & FILTER CONTROLS ─── */}
      <div className="space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCursor(null)
            }}
            placeholder="Search students by name, email, or phone..."
            className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-5 text-sm text-gray-900 outline-none transition-all focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#18181b] dark:text-white dark:placeholder:text-gray-500"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Drawer */}
        {showFilters && (
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Filter Students Directory
              </span>
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X size={12} />
                  Reset all filters
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">
                  Counselor / Advisor
                </label>
                <select
                  value={counselorFilter}
                  onChange={(e) => setCounselorFilter(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                >
                  <option value="ALL">All Advisors</option>
                  <option value="UNASSIGNED">Unassigned Only</option>
                  {counselors
                    .filter((c) => c.counselorProfile?.id)
                    .map((c) => (
                      <option key={c.counselorProfile!.id} value={c.name || c.email}>
                        {c.name || c.email}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">
                  Education Level
                </label>
                <select
                  value={educationFilter}
                  onChange={(e) => setEducationFilter(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                >
                  <option value="ALL">All Education Levels</option>
                  <option value="HIGH_SCHOOL">High School</option>
                  <option value="BACHELORS">{"Bachelor's"}</option>
                  <option value="MASTERS">{"Master's"}</option>
                  <option value="PHD">PhD</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">
                  Account Verification
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="VERIFIED">Verified Only</option>
                  <option value="PENDING">Pending Verification</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">
                  Course Submissions
                </label>
                <select
                  value={appsFilter}
                  onChange={(e) => setAppsFilter(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                >
                  <option value="ALL">All Students</option>
                  <option value="WITH_APPS">Has Applications</option>
                  <option value="NO_APPS">No Applications Yet</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── 4. ADD STUDENT MODAL ─── */}
      {showCreateModal &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
            <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-white/[0.08] dark:bg-[#18181b]">
              <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-5 dark:border-white/[0.08]">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Student</h2>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    reset()
                  }}
                  className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/[0.06] dark:hover:text-gray-300"
                >
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col overflow-hidden">
                <div className="space-y-4 overflow-y-auto px-6 py-6">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Alex Johnson"
                      {...register('name')}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="student@example.com"
                      {...register('email')}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Initial Password (optional)
                    </label>
                    <input
                      type="password"
                      placeholder="At least 8 characters"
                      {...register('password')}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                    />
                    {errors.password && (
                      <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Phone
                      </label>
                      <input
                        type="tel"
                        placeholder="+1 234 567 8900"
                        {...register('phone')}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Nationality
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Bangladesh"
                        {...register('nationality')}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                      />
                      {errors.nationality && (
                        <p className="mt-1 text-xs text-red-500">{errors.nationality.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Country of Residence
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Canada"
                        {...register('countryOfResidence')}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                      />
                      {errors.countryOfResidence && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.countryOfResidence.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Highest Education
                      </label>
                      <select
                        {...register('highestEducation')}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                      >
                        <option value="HIGH_SCHOOL">High School</option>
                        <option value="BACHELORS">{"Bachelor's"}</option>
                        <option value="MASTERS">{"Master's"}</option>
                        <option value="PHD">PhD</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4 dark:border-white/[0.08] dark:bg-[#18181b]/50">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false)
                      reset()
                    }}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 dark:hover:bg-white/[0.06]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || createMutation.isPending}
                    style={{ background: '#c41e3a', boxShadow: '0 4px 12px rgba(196,30,58,0.2)' }}
                    className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-95 disabled:opacity-50"
                  >
                    {isSubmitting || createMutation.isPending ? 'Adding Student...' : 'Add Student'}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* ─── 5. DETAILED STUDENTS TABLE ─── */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs dark:border-white/[0.08] dark:bg-[#18181b]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80 dark:border-white/[0.08] dark:bg-[#18181b]/80">
                {[
                  'Student Applicant',
                  'Academic & Education',
                  'Location',
                  'Applications',
                  'Assigned Counselor',
                  'Status & Joined',
                  'Actions',
                ].map((h, idx) => (
                  <th
                    key={h}
                    className={`px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 ${
                      idx === 6 ? 'text-right' : 'text-left'
                    }`}
                    style={{ fontFamily: "'JetBrains Mono',monospace" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-white/[0.06]">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#c41e3a]" />
                      <p className="text-xs font-medium text-gray-400">Loading student directory...</p>
                    </div>
                  </td>
                </tr>
              ) : isForbidden ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center px-4">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-500 dark:bg-amber-950/40 dark:text-amber-400">
                        <ShieldAlert size={22} />
                      </div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        Permission required
                      </p>
                      <p className="mt-1 max-w-sm text-xs text-gray-500 dark:text-gray-400">
                        Your account requires the <code className="font-mono">students:view</code> permission.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                      Failed to load students
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {errObj?.message || 'Unexpected error'}
                    </p>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <UserX size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      No students match your criteria
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Try clearing filters or searching with a different keyword.
                    </p>
                    {activeFiltersCount > 0 && (
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="mt-3 text-xs font-semibold text-[#c41e3a] hover:underline"
                      >
                        Reset filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const sName = student.name || 'Student'
                  const sEmail = student.email || ''
                  const sPhone = student.studentProfile?.phone || ''
                  const sWa = cleanPhoneForWhatsApp(sPhone)
                  const initials =
                    sName
                      .split(/\s+/)
                      .map((s) => s[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase() || 'ST'

                  const counselorName =
                    student.studentProfile?.assignedCounselor?.user?.name || null
                  const counselorEmail =
                    student.studentProfile?.assignedCounselor?.user?.email || null

                  const highestEdu = student.studentProfile?.highestEducation
                  const gpa = student.studentProfile?.gpa
                  const ielts = student.studentProfile?.ieltsScore
                  const appsCount = student.applicationsCount || 0

                  return (
                    <tr
                      key={student.id}
                      className="group transition-colors hover:bg-gray-50/70 dark:hover:bg-white/[0.02]"
                    >
                      {/* 1. Student Applicant Info */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          {student.image ? (
                            <img
                              src={student.image}
                              alt=""
                              className="h-10 w-10 shrink-0 rounded-xl border border-gray-100 object-cover dark:border-white/[0.08]"
                            />
                          ) : (
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#c41e3a]/15 to-[#e8a33d]/15 text-xs font-bold text-[#c41e3a] dark:text-red-400">
                              {initials}
                            </div>
                          )}

                          <div className="min-w-0">
                            <Link
                              href={`/admin/students/${student.id}`}
                              className="truncate text-sm font-semibold text-gray-900 transition-colors hover:text-[#c41e3a] dark:text-white dark:hover:text-red-400 block"
                            >
                              {sName}
                            </Link>
                            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                              <span className="truncate max-w-[170px]">{sEmail}</span>
                              {sEmail && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    navigator.clipboard.writeText(sEmail)
                                    toast.success('Email copied')
                                  }}
                                  title="Copy email"
                                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                >
                                  <Copy size={11} />
                                </button>
                              )}
                            </div>

                            {sPhone && (
                              <div className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-400">
                                <span>{sPhone}</span>
                                {sWa && (
                                  <a
                                    href={`https://wa.me/${sWa}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="Open WhatsApp"
                                    className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                                  >
                                    <MessageCircle size={11} />
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* 2. Academic & Education */}
                      <td className="px-4 py-3.5">
                        <div className="space-y-1">
                          {highestEdu ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                              <GraduationCap size={12} />
                              {highestEdu === 'BACHELORS'
                                ? "Bachelor's"
                                : highestEdu === 'MASTERS'
                                  ? "Master's"
                                  : highestEdu === 'HIGH_SCHOOL'
                                    ? 'High School'
                                    : highestEdu}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">Not recorded</span>
                          )}

                          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            {gpa && (
                              <span className="font-medium text-gray-700 dark:text-gray-300">
                                GPA: <b>{String(gpa)}</b>
                              </span>
                            )}
                            {ielts && (
                              <span className="rounded bg-emerald-50 px-1.5 py-0.2 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                                IELTS: {String(ielts)}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* 3. Location */}
                      <td className="px-4 py-3.5 text-xs">
                        <div className="flex items-center gap-1 font-medium text-gray-800 dark:text-gray-200">
                          <MapPin size={12} className="text-gray-400 shrink-0" />
                          <span className="truncate max-w-[130px]">
                            {student.studentProfile?.countryOfResidence ||
                              student.studentProfile?.nationality ||
                              '—'}
                          </span>
                        </div>
                        {student.studentProfile?.nationality &&
                          student.studentProfile.countryOfResidence &&
                          student.studentProfile.nationality !== student.studentProfile.countryOfResidence && (
                            <p className="mt-0.5 pl-4 text-[11px] text-gray-400 truncate max-w-[130px]">
                              Citizenship: {student.studentProfile.nationality}
                            </p>
                          )}
                      </td>

                      {/* 4. Applications */}
                      <td className="px-4 py-3.5">
                        {appsCount > 0 ? (
                          <Link
                            href={`/admin/applications?search=${encodeURIComponent(sEmail)}`}
                            className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700 transition-colors hover:bg-purple-100 dark:bg-purple-950/60 dark:text-purple-300 dark:hover:bg-purple-900/40"
                          >
                            <BookOpen size={12} />
                            <span>
                              {appsCount} {appsCount === 1 ? 'Application' : 'Applications'}
                            </span>
                          </Link>
                        ) : (
                          <span className="text-xs text-gray-400">No applications</span>
                        )}
                      </td>

                      {/* 5. Assigned Counselor */}
                      <td className="px-4 py-3.5 text-xs">
                        {counselorName ? (
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                              {counselorName.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-medium text-gray-900 dark:text-white">
                                {counselorName}
                              </p>
                              {counselorEmail && (
                                <p className="truncate text-[10px] text-gray-400">
                                  {counselorEmail}
                                </p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
                            Unassigned
                          </span>
                        )}
                      </td>

                      {/* 6. Status & Joined */}
                      <td className="px-4 py-3.5 text-xs whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {student.emailVerified ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                              <ShieldCheck size={11} /> Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:bg-white/[0.08] dark:text-gray-300">
                              Pending
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-[11px] text-gray-400">
                          Joined {fmtDate(student.createdAt)}
                        </p>
                      </td>

                      {/* 7. Actions */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {sEmail && (
                            <a
                              href={`mailto:${sEmail}`}
                              title="Send Email"
                              className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition-colors hover:border-gray-300 hover:text-gray-700 dark:border-white/[0.08] dark:hover:text-white"
                            >
                              <Mail size={13} />
                            </a>
                          )}
                          {sWa && (
                            <a
                              href={`https://wa.me/${sWa}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Chat on WhatsApp"
                              className="flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-200 text-emerald-600 transition-colors hover:bg-emerald-50 dark:border-emerald-900/40 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
                            >
                              <MessageCircle size={13} />
                            </a>
                          )}
                          <Link
                            href={`/admin/students/${student.id}`}
                            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-200 dark:hover:bg-white/[0.06]"
                          >
                            <span>Profile</span>
                            <ExternalLink size={11} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── 6. PAGINATION & RECORD COUNTS ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredStudents.length}</span> students
          {rawList.length !== filteredStudents.length && ` (filtered from ${rawList.length})`}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!cursor}
            onClick={() => setCursor(null)}
            className="rounded-xl border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-medium text-gray-700 transition-colors disabled:opacity-50 hover:bg-gray-50 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 dark:hover:bg-white/[0.06]"
          >
            First Page
          </button>
          <button
            type="button"
            disabled={!data?.nextCursor}
            onClick={() => data?.nextCursor && setCursor(data.nextCursor)}
            style={{ background: '#c41e3a' }}
            className="rounded-xl px-4 py-1.5 text-xs font-semibold text-white shadow-xs transition-opacity hover:opacity-95 disabled:opacity-50"
          >
            Next Page &rarr;
          </button>
        </div>
      </div>
    </div>
  )
}
