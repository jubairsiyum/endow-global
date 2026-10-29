'use client'

import { SAButton } from '@/components/super-admin/shared/SAButton'
import { SAInput } from '@/components/super-admin/shared/SAInput'
import StatusBadge from '@/components/ui/StatusBadge'
import { confirmToast } from '@/components/ui/confirmToast'
import { trpc } from '@/lib/trpc-client'
import { formatDistanceToNow } from 'date-fns'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Eye,
  FileCode2,
  FileSpreadsheet,
  FileText,
  Filter,
  Globe,
  GraduationCap,
  Languages,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
  Users,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { useCallback, useMemo, useState } from 'react'
import { toast } from 'sonner'

const PAGE_SIZE = 15

const STATUS_OPTIONS = [
  'DRAFT',
  'IN_PROGRESS',
  'SUBMITTED',
  'UNDER_REVIEW',
  'DOCUMENTS_REQUIRED',
  'ACCEPTED',
  'REJECTED',
  'WAITLISTED',
  'WITHDRAWN',
] as const

const LEVELS = ['Undergraduate', 'Masters', 'Doctorate', 'EAP', 'KLP']
const TESTS = ['None', 'IELTS', 'TOEFL', 'SAT', 'TOPIK']
const SOURCES = ['Social Sites', 'Website', 'Family, Friends & Relatives']

const selCls =
  'rounded-md border border-gray-200 bg-white px-3 py-1.5 text-[13px] text-gray-900 outline-none transition-colors dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white'

interface CourseApplicationItem {
  id: string
  status?: string | null
  submittedAt?: string | Date | null
  updatedAt?: string | Date | null
  currentStep?: number | null
  totalSteps?: number | null
  personalStatement?: string | null
  counselorNotes?: string | null
  personalInfo?: {
    surname?: string | null
    givenName?: string | null
    email?: string | null
    phone?: string | null
    whatsapp?: string | null
    gender?: string | null
    dob?: string | null
    country?: string | null
    city?: string | null
    nationality?: string | null
    photoUrl?: string | null
    heardFrom?: string | null
    referralName?: string | null
    reasonToChoose?: string | null
  } | null
  academicHistory?: {
    applyingTo?: string | null
    sscYear?: string | null
    sscResult?: string | null
    hscYear?: string | null
    hscResult?: string | null
    bachelorsYear?: string | null
    bachelorsResult?: string | null
    mastersYear?: string | null
    mastersResult?: string | null
    englishTest?: string | null
    ieltsScore?: string | null
    toeflScore?: string | null
    satScore?: string | null
    topikLevel?: string | null
    targetUniversity?: string | null
    targetCountry?: string | null
    courseName?: string | null
    courseSlug?: string | null
  } | null
  student?: {
    user?: {
      id?: string | null
      name?: string | null
      email?: string | null
      image?: string | null
    } | null
    profile?: {
      id?: string | null
      phone?: string | null
      whatsapp?: string | null
      countryOfResidence?: string | null
      nationality?: string | null
      city?: string | null
      gpa?: number | string | null
      highestEducation?: string | null
      ieltsScore?: number | string | null
      toeflScore?: number | string | null
      satScore?: number | string | null
      topikLevel?: string | null
      englishTest?: string | null
    } | null
  } | null
  course?: {
    id?: string | null
    name?: string | null
    slug?: string | null
    level?: string | null
    subject?: string | null
    university?: {
      id?: string | null
      name?: string | null
      country?: string | null
      city?: string | null
      logo?: string | null
    } | null
  } | null
  counselor?: {
    user?: {
      name?: string | null
      email?: string | null
    } | null
  } | null
}

interface InquiryItem {
  id: string
  userId?: string | null
  surname: string
  givenName: string
  dob?: string | null
  gender?: string | null
  phone: string
  whatsapp?: string | null
  email: string
  fatherName?: string | null
  motherName?: string | null
  hometown?: string | null
  nationality?: string | null
  addressLine1?: string | null
  addressLine2?: string | null
  city?: string | null
  state?: string | null
  zipCode?: string | null
  country: string
  applyingTo?: string | null
  sscYear?: string | null
  sscResult?: string | null
  hscYear?: string | null
  hscResult?: string | null
  bachelorsYear?: string | null
  bachelorsResult?: string | null
  mastersYear?: string | null
  mastersResult?: string | null
  targetCountry?: string | null
  targetUniversity?: string | null
  courseName?: string | null
  courseSlug?: string | null
  reasonToChoose?: string | null
  englishTest?: string | null
  ieltsScore?: string | null
  toeflScore?: string | null
  satScore?: string | null
  topikLevel?: string | null
  heardFrom?: string | null
  referralName?: string | null
  photoUrl?: string | null
  ipAddress?: string | null
  submittedAt: string | Date
}

function csvEscape(v: unknown): string {
  if (v === null || v === undefined) return ''
  const s = String(v).replace(/"/g, '""')
  return /[,"\n\r]/.test(s) ? `"${s}"` : s
}

function downloadBlob(c: string, f: string, m: string) {
  const b = new Blob(['\uFEFF' + c], { type: m })
  const u = URL.createObjectURL(b)
  const a = document.createElement('a')
  a.href = u
  a.download = f
  a.click()
  URL.revokeObjectURL(u)
}

function fmtDate(d: string | Date | null | undefined): string {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function cleanPhoneForWhatsApp(phone: string | null | undefined): string {
  if (!phone) return ''
  return phone.replace(/[^0-9]/g, '')
}

function getPaginationPages(currentPage: number, totalPages: number): (number | '...')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }
  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, '...', totalPages]
  }
  if (currentPage >= totalPages - 3) {
    return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  }
  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]
}

export default function ApplicationsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [tab, setTab] = useState<'applications' | 'inquiries'>('applications')
  const [exportOpen, setExportOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  // Pagination states (15 items per page)
  const [appPage, setAppPage] = useState(1)
  const [inqPage, setInqPage] = useState(1)

  // Course app filters
  const [uniFilter, setUniFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  // Inquiry filters
  const [inqSearch, setInqSearch] = useState('')
  const [inqOriginCountry, setInqOriginCountry] = useState('')
  const [inqTargetCountry, setInqTargetCountry] = useState('')
  const [inqUni, setInqUni] = useState('')
  const [inqLevel, setInqLevel] = useState('')
  const [inqTest, setInqTest] = useState('')
  const [inqSource, setInqSource] = useState('')
  const [inqDateFrom, setInqDateFrom] = useState('')
  const [inqDateTo, setInqDateTo] = useState('')

  const utils = trpc.useUtils()
  const {
    data: appData,
    isLoading: isAppsLoading,
    error: appsError,
  } = trpc.admin.applications.list.useQuery({
    search: search || undefined,
    status: (statusFilter || undefined) as (typeof STATUS_OPTIONS)[number] | undefined,
    limit: 1000,
  })

  const {
    data: rawInquiries,
    isLoading: isInquiriesLoading,
    error: inqError,
  } = trpc.endow.listInquiries.useQuery()

  const { data: unis } = trpc.admin.universities.list.useQuery({})

  const deleteInquiryMutation = trpc.endow.deleteInquiry.useMutation({
    onSuccess: () => {
      toast.success('Inquiry deleted successfully')
      utils.endow.listInquiries.invalidate()
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete inquiry')
    },
  })

  const appList: CourseApplicationItem[] =
    (appData as { items?: CourseApplicationItem[] })?.items ??
    (Array.isArray(appData) ? (appData as CourseApplicationItem[]) : [])

  const inquiries: InquiryItem[] = (rawInquiries || []) as InquiryItem[]

  // Filter course applications
  const filteredApps = useMemo(() => {
    return appList.filter((a) => {
      if (uniFilter && a.course?.university?.id !== uniFilter) return false
      const ts = a.submittedAt || a.updatedAt
      if (dateFrom && ts && new Date(ts) < new Date(dateFrom)) return false
      if (dateTo && ts && new Date(ts) > new Date(dateTo + 'T23:59:59')) return false
      return true
    })
  }, [appList, uniFilter, dateFrom, dateTo])

  // Filter inquiries
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((i) => {
      if (inqSearch.trim()) {
        const q = inqSearch.toLowerCase().trim()
        const haystack = [
          i.givenName,
          i.surname,
          `${i.givenName} ${i.surname}`,
          i.email,
          i.phone,
          i.whatsapp,
          i.targetUniversity,
          i.targetCountry,
          i.country,
          i.city,
          i.courseName,
          i.hometown,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        if (!haystack.includes(q)) return false
      }
      if (inqOriginCountry && i.country !== inqOriginCountry) return false
      if (inqTargetCountry && i.targetCountry !== inqTargetCountry) return false
      if (inqUni && i.targetUniversity !== inqUni) return false
      if (inqLevel && i.applyingTo !== inqLevel) return false
      if (inqTest && i.englishTest !== inqTest) return false
      if (inqSource && i.heardFrom !== inqSource) return false
      if (inqDateFrom && new Date(i.submittedAt) < new Date(inqDateFrom)) return false
      if (inqDateTo && new Date(i.submittedAt) > new Date(inqDateTo + 'T23:59:59')) return false
      return true
    })
  }, [
    inquiries,
    inqSearch,
    inqOriginCountry,
    inqTargetCountry,
    inqUni,
    inqLevel,
    inqTest,
    inqSource,
    inqDateFrom,
    inqDateTo,
  ])

  // Course Applications KPI Stats
  const appStats = useMemo(() => {
    const list = appList
    const total = list.length
    const underReview = list.filter((a) =>
      ['UNDER_REVIEW', 'IN_PROGRESS', 'SUBMITTED', 'DOCUMENTS_REQUIRED'].includes(a.status || '')
    ).length
    const accepted = list.filter((a) => a.status === 'ACCEPTED').length

    const destinationCounts: Record<string, number> = {}
    list.forEach((a) => {
      const dest =
        a.course?.university?.country ||
        a.academicHistory?.targetCountry ||
        a.course?.university?.name
      if (dest) {
        destinationCounts[dest] = (destinationCounts[dest] || 0) + 1
      }
    })
    const topDestination =
      Object.entries(destinationCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—'

    return { total, underReview, accepted, topDestination }
  }, [appList])

  // Inquiries KPI Stats
  const inqStats = useMemo(() => {
    const list = inquiries
    const total = list.length
    const withTest = list.filter((i) => i.englishTest && i.englishTest !== 'None').length

    const countryCounts: Record<string, number> = {}
    list.forEach((i) => {
      if (i.targetCountry) {
        countryCounts[i.targetCountry] = (countryCounts[i.targetCountry] || 0) + 1
      }
    })
    const topCountry = Object.entries(countryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—'

    const levelCounts: Record<string, number> = {}
    list.forEach((i) => {
      if (i.applyingTo) {
        levelCounts[i.applyingTo] = (levelCounts[i.applyingTo] || 0) + 1
      }
    })
    const topLevel = Object.entries(levelCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—'

    return { total, withTest, topCountry, topLevel }
  }, [inquiries])

  // Pagination slicing (15 per page)
  const totalAppPages = Math.max(1, Math.ceil(filteredApps.length / PAGE_SIZE))
  const safeAppPage = Math.min(appPage, totalAppPages)
  const paginatedApps = useMemo(() => {
    const start = (safeAppPage - 1) * PAGE_SIZE
    return filteredApps.slice(start, start + PAGE_SIZE)
  }, [filteredApps, safeAppPage])

  const totalInqPages = Math.max(1, Math.ceil(filteredInquiries.length / PAGE_SIZE))
  const safeInqPage = Math.min(inqPage, totalInqPages)
  const paginatedInquiries = useMemo(() => {
    const start = (safeInqPage - 1) * PAGE_SIZE
    return filteredInquiries.slice(start, start + PAGE_SIZE)
  }, [filteredInquiries, safeInqPage])

  const uniOpts = unis || []
  const activeFilters =
    tab === 'applications'
      ? [uniFilter, dateFrom, dateTo].filter(Boolean).length
      : [
          inqOriginCountry,
          inqTargetCountry,
          inqUni,
          inqLevel,
          inqTest,
          inqSource,
          inqDateFrom,
          inqDateTo,
        ].filter(Boolean).length

  const doExport = useCallback(
    (format: 'csv' | 'json') => {
      const ts = new Date().toISOString().slice(0, 10)
      if (tab === 'applications') {
        const rows = filteredApps
        if (format === 'json') {
          downloadBlob(
            JSON.stringify(rows, null, 2),
            `course-apps-${ts}.json`,
            'application/json'
          )
          toast.success('Exported JSON')
          return
        }
        const csv = [
          [
            'Applicant Name',
            'Email',
            'Phone',
            'Country',
            'City',
            'Course',
            'Degree Level',
            'University',
            'Status',
            'English Test',
            'Counselor',
            'Submitted At',
          ].join(','),
        ]
        for (const a of rows)
          csv.push(
            [
              a.student?.user?.name ||
                (a.personalInfo
                  ? `${a.personalInfo.givenName || ''} ${a.personalInfo.surname || ''}`.trim()
                  : ''),
              a.student?.user?.email || a.personalInfo?.email || '',
              a.personalInfo?.phone || a.student?.profile?.phone || '',
              a.personalInfo?.country || a.student?.profile?.countryOfResidence || '',
              a.personalInfo?.city || a.student?.profile?.city || '',
              a.course?.name || '',
              a.course?.level || a.academicHistory?.applyingTo || '',
              a.course?.university?.name || '',
              a.status || '',
              a.academicHistory?.englishTest || a.student?.profile?.englishTest || 'None',
              a.counselor?.user?.name || 'Unassigned',
              fmtDate(a.submittedAt || a.updatedAt),
            ]
              .map(csvEscape)
              .join(',')
          )
        downloadBlob(csv.join('\n'), `course-applications-${ts}.csv`, 'text/csv')
      } else {
        const rows = filteredInquiries
        if (format === 'json') {
          downloadBlob(
            JSON.stringify(rows, null, 2),
            `inquiries-${ts}.json`,
            'application/json'
          )
          toast.success('Exported JSON')
          return
        }
        const csv = [
          [
            'Given Name',
            'Surname',
            'Email',
            'Phone',
            'WhatsApp',
            'Country of Residence',
            'City',
            'Target Country',
            'Target University',
            'Course Name',
            'Degree Level',
            'English Test',
            'IELTS Score',
            'TOEFL Score',
            'SAT Score',
            'TOPIK Level',
            'SSC Year',
            'SSC Result',
            'HSC Year',
            'HSC Result',
            'Bachelors Year',
            'Bachelors Result',
            'Masters Year',
            'Masters Result',
            'Reason to Choose',
            'Source',
            'Referral',
            'Submitted At',
          ].join(','),
        ]
        for (const i of rows)
          csv.push(
            [
              i.givenName,
              i.surname,
              i.email,
              i.phone,
              i.whatsapp || '',
              i.country,
              i.city || '',
              i.targetCountry || '',
              i.targetUniversity || '',
              i.courseName || '',
              i.applyingTo || '',
              i.englishTest || '',
              i.ieltsScore || '',
              i.toeflScore || '',
              i.satScore || '',
              i.topikLevel || '',
              i.sscYear || '',
              i.sscResult || '',
              i.hscYear || '',
              i.hscResult || '',
              i.bachelorsYear || '',
              i.bachelorsResult || '',
              i.mastersYear || '',
              i.mastersResult || '',
              i.reasonToChoose || '',
              i.heardFrom || '',
              i.referralName || '',
              fmtDate(i.submittedAt),
            ]
              .map(csvEscape)
              .join(',')
          )
        downloadBlob(csv.join('\n'), `apply-now-inquiries-${ts}.csv`, 'text/csv')
      }
      toast.success(`Exported ${format.toUpperCase()}`)
      setExportOpen(false)
    },
    [tab, filteredApps, filteredInquiries]
  )

  function resetFilters() {
    setUniFilter('')
    setDateFrom('')
    setDateTo('')
    setSearch('')
    setStatusFilter('')
    setInqSearch('')
    setInqOriginCountry('')
    setInqTargetCountry('')
    setInqUni('')
    setInqLevel('')
    setInqTest('')
    setInqSource('')
    setInqDateFrom('')
    setInqDateTo('')
    setAppPage(1)
    setInqPage(1)
  }

  function handleDeleteInquiry(id: string, name: string) {
    confirmToast({
      title: 'Delete Inquiry?',
      description: `Are you sure you want to permanently delete the inquiry from ${name}?`,
      confirmLabel: 'Delete',
      onConfirm: () => deleteInquiryMutation.mutate({ id }),
    })
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1
            className="text-[20px] font-bold tracking-tight text-gray-900 dark:text-white"
            style={{ fontFamily: "'Space Grotesk',sans-serif" }}
          >
            Applications & Inquiries
          </h1>
          <p className="mt-0.5 text-[13px] text-gray-500 dark:text-gray-400">
            Review logged-in course applications and guest apply-now inquiries (15 per page)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SAButton
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowFilters(!showFilters)
              if (showFilters) resetFilters()
            }}
            className="relative"
          >
            <Filter size={14} />
            Filters{' '}
            {activeFilters > 0 && (
              <span className="ml-1 rounded-full bg-[#c41e3a] px-1.5 py-px text-[9px] font-bold text-white">
                {activeFilters}
              </span>
            )}
          </SAButton>
          <div className="relative">
            <SAButton variant="secondary" size="sm" onClick={() => setExportOpen(!exportOpen)}>
              <Download size={14} />
              Export
              <ChevronDown size={12} />
            </SAButton>
            {exportOpen && (
              <div className="absolute right-0 top-full z-30 mt-1 w-48 rounded-xl border border-gray-200 bg-white py-1 shadow-xl dark:border-white/[0.08] dark:bg-[#18181b]">
                <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  {tab === 'applications' ? 'Course Applications' : 'Apply Now Inquiries'}
                </div>
                <button
                  onClick={() => doExport('csv')}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-[13px] text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/[0.06]"
                >
                  <FileSpreadsheet size={14} className="text-green-600" />
                  Export CSV
                </button>
                <button
                  onClick={() => doExport('json')}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-[13px] text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/[0.06]"
                >
                  <FileCode2 size={14} className="text-blue-600" />
                  Export JSON
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="flex w-fit gap-1 rounded-xl bg-gray-100 p-1 dark:bg-[#18181b]">
        {[
          { k: 'applications', l: 'Course Applications', c: appList.length },
          { k: 'inquiries', l: 'Apply Now Inquiries', c: inquiries.length },
        ].map((t) => (
          <button
            key={t.k}
            onClick={() => {
              setTab(t.k as 'applications' | 'inquiries')
              setShowFilters(false)
            }}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              tab === t.k
                ? 'bg-white text-gray-900 shadow-sm dark:bg-[#09090b] dark:text-white'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            {t.l}
            <span
              className={`ml-2 rounded-full px-2 py-0.5 text-xs font-semibold ${
                tab === t.k
                  ? 'bg-red-50 text-[#c41e3a] dark:bg-red-950/40 dark:text-red-400'
                  : 'bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
              }`}
            >
              {t.c}
            </span>
          </button>
        ))}
      </div>

      {/* Filter drawer */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Filter {tab === 'applications' ? 'Course Applications' : 'Inquiries'}
            </span>
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={12} />
              Clear all
            </button>
          </div>
          {tab === 'applications' ? (
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400">University</span>
                <select
                  value={uniFilter}
                  onChange={(e) => {
                    setUniFilter(e.target.value)
                    setAppPage(1)
                  }}
                  className={selCls}
                >
                  <option value="">All Universities</option>
                  {uniOpts.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400">Submitted From</span>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => {
                    setDateFrom(e.target.value)
                    setAppPage(1)
                  }}
                  className={selCls}
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400">Submitted To</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => {
                    setDateTo(e.target.value)
                    setAppPage(1)
                  }}
                  className={selCls}
                />
              </div>
              <span className="ml-2 text-[11px] text-gray-400">
                {filteredApps.length} of {appList.length} results
              </span>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400">Origin Country</span>
                <select
                  value={inqOriginCountry}
                  onChange={(e) => {
                    setInqOriginCountry(e.target.value)
                    setInqPage(1)
                  }}
                  className={selCls}
                >
                  <option value="">All Origin Countries</option>
                  {Array.from(new Set(inquiries.map((i) => i.country).filter(Boolean))).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400">Target Country</span>
                <select
                  value={inqTargetCountry}
                  onChange={(e) => {
                    setInqTargetCountry(e.target.value)
                    setInqPage(1)
                  }}
                  className={selCls}
                >
                  <option value="">All Target Countries</option>
                  {Array.from(
                    new Set(inquiries.map((i) => i.targetCountry).filter(Boolean) as string[])
                  ).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400">University</span>
                <select
                  value={inqUni}
                  onChange={(e) => {
                    setInqUni(e.target.value)
                    setInqPage(1)
                  }}
                  className={selCls}
                >
                  <option value="">All Universities</option>
                  {Array.from(
                    new Set(inquiries.map((i) => i.targetUniversity).filter(Boolean) as string[])
                  ).map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400">Degree Level</span>
                <select
                  value={inqLevel}
                  onChange={(e) => {
                    setInqLevel(e.target.value)
                    setInqPage(1)
                  }}
                  className={selCls}
                >
                  <option value="">All Degrees</option>
                  {LEVELS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400">English Test</span>
                <select
                  value={inqTest}
                  onChange={(e) => {
                    setInqTest(e.target.value)
                    setInqPage(1)
                  }}
                  className={selCls}
                >
                  <option value="">All Tests</option>
                  {TESTS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400">Source</span>
                <select
                  value={inqSource}
                  onChange={(e) => {
                    setInqSource(e.target.value)
                    setInqPage(1)
                  }}
                  className={selCls}
                >
                  <option value="">All Sources</option>
                  {SOURCES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400">From</span>
                <input
                  type="date"
                  value={inqDateFrom}
                  onChange={(e) => {
                    setInqDateFrom(e.target.value)
                    setInqPage(1)
                  }}
                  className={selCls}
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400">To</span>
                <input
                  type="date"
                  value={inqDateTo}
                  onChange={(e) => {
                    setInqDateTo(e.target.value)
                    setInqPage(1)
                  }}
                  className={selCls}
                />
              </div>
              <span className="ml-2 text-[11px] text-gray-400">
                {filteredInquiries.length} of {inquiries.length} results
              </span>
            </div>
          )}
        </motion.div>
      )}

      {/* MAIN TAB CONTENT */}
      {tab === 'applications' ? (
        <div className="space-y-4">
          {/* Quick Metrics Bar for Course Applications */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
              <div className="flex items-center gap-2 text-gray-400">
                <FileText size={15} className="text-[#c41e3a]" />
                <span className="text-xs font-medium">Total Applications</span>
              </div>
              <p className="mt-1.5 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {appStats.total}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
              <div className="flex items-center gap-2 text-gray-400">
                <Clock size={15} className="text-amber-500" />
                <span className="text-xs font-medium">In Review / Processing</span>
              </div>
              <p className="mt-1.5 text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
                {appStats.underReview}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
              <div className="flex items-center gap-2 text-gray-400">
                <CheckCircle2 size={15} className="text-emerald-500" />
                <span className="text-xs font-medium">Accepted</span>
              </div>
              <p className="mt-1.5 text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                {appStats.accepted}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
              <div className="flex items-center gap-2 text-gray-400">
                <Globe size={15} className="text-blue-500" />
                <span className="text-xs font-medium">Top Destination</span>
              </div>
              <p className="mt-1.5 truncate text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                {appStats.topDestination}
              </p>
            </div>
          </div>

          {/* Applications Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-1 flex-wrap items-center gap-3">
              <div className="w-full sm:w-[320px]">
                <SAInput
                  placeholder="Search student, email, phone, course, uni..."
                  icon={<Search size={14} />}
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setAppPage(1)
                  }}
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setAppPage(1)
                }}
                className={selCls}
              >
                {[''].concat(STATUS_OPTIONS).map((s) => (
                  <option key={s} value={s}>
                    {s ? s.replace(/_/g, ' ') : 'All Statuses'}
                  </option>
                ))}
              </select>
              {(search || statusFilter || uniFilter || dateFrom || dateTo) && (
                <SAButton
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={12} />
                  Clear Filters
                </SAButton>
              )}
            </div>

            <SAButton
              variant="ghost"
              size="sm"
              onClick={() => {
                utils.admin.applications.list.invalidate()
              }}
              title="Refresh list"
            >
              <RefreshCw size={13} />
              Refresh
            </SAButton>
          </div>

          {/* Applications Table */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]"
          >
            {isAppsLoading ? (
              <div className="flex items-center justify-center py-20">
                <div
                  className="h-8 w-8 animate-spin rounded-full border-2"
                  style={{ borderColor: '#E8A33D', borderTopColor: 'transparent' }}
                />
              </div>
            ) : appsError ? (
              <div className="flex flex-col items-center justify-center py-20">
                <AlertTriangle size={28} style={{ color: '#F0625B' }} />
                <p className="mt-3 text-sm font-medium text-red-500">Failed to load applications</p>
                <SAButton
                  variant="secondary"
                  size="sm"
                  className="mt-3"
                  onClick={() => utils.admin.applications.list.invalidate()}
                >
                  Retry
                </SAButton>
              </div>
            ) : filteredApps.length === 0 ? (
              <div className="py-24 text-center">
                <FileText size={32} className="mx-auto text-gray-300 dark:text-gray-600" />
                <p className="mt-3 text-sm font-semibold text-gray-900 dark:text-white">
                  {appList.length === 0
                    ? 'No course applications yet'
                    : 'No applications match your filters'}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  Applications submitted by logged-in students will automatically appear here with complete details.
                </p>
                {(search || statusFilter || uniFilter || dateFrom || dateTo) && (
                  <button
                    onClick={resetFilters}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-200"
                  >
                    Reset all filters
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50/80 dark:border-white/[0.08] dark:bg-[#18181b]/80">
                      {[
                        'Applicant',
                        'Course & University',
                        'Academics & Tests',
                        'Status',
                        'Counselor',
                        'Submitted / Updated',
                        'Actions',
                      ].map((h, idx) => (
                        <th
                          key={h}
                          className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 ${
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
                    {paginatedApps.map((app) => {
                      const studentName =
                        app.student?.user?.name ||
                        (app.personalInfo
                          ? `${app.personalInfo.givenName || ''} ${
                              app.personalInfo.surname || ''
                            }`.trim()
                          : null) ||
                        'Student'
                      const studentEmail = app.student?.user?.email || app.personalInfo?.email || ''
                      const studentPhone =
                        app.personalInfo?.phone || app.student?.profile?.phone || ''
                      const waNumber = cleanPhoneForWhatsApp(
                        app.personalInfo?.whatsapp ||
                          app.personalInfo?.phone ||
                          app.student?.profile?.whatsapp ||
                          app.student?.profile?.phone
                      )
                      const studentCountry =
                        app.personalInfo?.country ||
                        app.student?.profile?.countryOfResidence ||
                        ''
                      const studentCity =
                        app.personalInfo?.city || app.student?.profile?.city || ''
                      const studentImage =
                        app.student?.user?.image || app.personalInfo?.photoUrl || null
                      const initials =
                        studentName
                          .split(/\s+/)
                          .map((s) => s[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase() || 'ST'

                      const englishTest =
                        app.academicHistory?.englishTest || app.student?.profile?.englishTest
                      const testScore =
                        app.academicHistory?.ieltsScore ||
                        app.student?.profile?.ieltsScore ||
                        app.academicHistory?.toeflScore ||
                        app.student?.profile?.toeflScore ||
                        app.academicHistory?.satScore ||
                        app.student?.profile?.satScore ||
                        app.academicHistory?.topikLevel ||
                        app.student?.profile?.topikLevel
                      const gpaResult =
                        app.academicHistory?.bachelorsResult ||
                        app.academicHistory?.hscResult ||
                        app.academicHistory?.sscResult ||
                        app.student?.profile?.gpa
                      const degreeLevel =
                        app.course?.level ||
                        app.academicHistory?.applyingTo ||
                        app.student?.profile?.highestEducation

                      return (
                        <tr
                          key={app.id}
                          className="group transition-colors hover:bg-gray-50/70 dark:hover:bg-white/[0.02]"
                        >
                          {/* Student Info */}
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-3">
                              {studentImage ? (
                                <img
                                  src={studentImage}
                                  alt=""
                                  className="h-9 w-9 shrink-0 rounded-xl border border-gray-100 object-cover dark:border-white/[0.08]"
                                />
                              ) : (
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#c41e3a]/15 to-[#e8a33d]/15 text-xs font-bold text-[#c41e3a] dark:text-red-400">
                                  {initials}
                                </div>
                              )}
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <Link
                                    href={`/admin/applications/${app.id}`}
                                    className="truncate text-sm font-semibold text-gray-900 transition-colors hover:text-[#c41e3a] dark:text-white dark:hover:text-red-400"
                                  >
                                    {studentName}
                                  </Link>
                                </div>
                                <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                  <span className="truncate max-w-[150px]">{studentEmail}</span>
                                  {studentPhone && (
                                    <>
                                      <span>•</span>
                                      <span>{studentPhone}</span>
                                    </>
                                  )}
                                </div>
                                {(studentCountry || studentCity) && (
                                  <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
                                    <MapPin size={10} />
                                    <span>
                                      {[studentCity, studentCountry].filter(Boolean).join(', ')}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Course & University */}
                          <td className="px-4 py-3.5">
                            <div className="min-w-0 max-w-[240px]">
                              <div className="flex items-center gap-1.5">
                                {degreeLevel && (
                                  <span className="rounded-full bg-purple-50 px-2 py-0.5 text-xs font-semibold text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                                    {degreeLevel}
                                  </span>
                                )}
                                <span className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                  {app.course?.name || app.academicHistory?.courseName || 'Program'}
                                </span>
                              </div>
                              <div className="mt-1 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                <Globe size={11} className="text-[#c41e3a]" />
                                <span className="truncate">
                                  {app.course?.university?.name ||
                                    app.academicHistory?.targetUniversity ||
                                    'University'}
                                </span>
                                {app.course?.university?.country && (
                                  <>
                                    <span>•</span>
                                    <span className="text-gray-400">
                                      {app.course.university.country}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Academics & Language */}
                          <td className="px-4 py-3.5">
                            <div className="flex flex-col gap-1">
                              {englishTest && englishTest !== 'None' ? (
                                <span className="inline-flex items-center gap-1 w-fit rounded bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                                  {englishTest}
                                  {testScore ? `: ${String(testScore)}` : ''}
                                </span>
                              ) : (
                                <span className="text-xs text-gray-400">No English Test</span>
                              )}

                              {gpaResult && (
                                <span className="text-[10px] text-gray-500 dark:text-gray-400">
                                  Result / GPA: <b>{String(gpaResult)}</b>
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3.5">
                            <StatusBadge status={app.status || 'SUBMITTED'} />
                          </td>

                          {/* Counselor */}
                          <td className="px-4 py-3.5 text-xs text-gray-600 dark:text-gray-300">
                            {app.counselor?.user?.name ? (
                              <span className="font-medium text-gray-900 dark:text-white">
                                {app.counselor.user.name}
                              </span>
                            ) : (
                              <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500 dark:bg-white/[0.06] dark:text-gray-400">
                                Unassigned
                              </span>
                            )}
                          </td>

                          {/* Submitted / Updated Date */}
                          <td className="px-4 py-3.5 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                            <div className="font-medium text-gray-800 dark:text-gray-200">
                              {fmtDate(app.submittedAt || app.updatedAt)}
                            </div>
                            <span className="text-xs text-gray-400">
                              {app.updatedAt
                                ? formatDistanceToNow(new Date(app.updatedAt), { addSuffix: true })
                                : '—'}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Quick Email link */}
                              {studentEmail && (
                                <a
                                  href={`mailto:${studentEmail}`}
                                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition-colors hover:border-gray-300 hover:text-gray-700 dark:border-white/[0.08] dark:hover:text-white"
                                  title="Send Email"
                                >
                                  <Mail size={13} />
                                </a>
                              )}

                              {/* Quick WhatsApp link */}
                              {waNumber && (
                                <a
                                  href={`https://wa.me/${waNumber}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-200 text-emerald-600 transition-colors hover:bg-emerald-50 dark:border-emerald-900/40 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
                                  title="WhatsApp"
                                >
                                  <MessageCircle size={13} />
                                </a>
                              )}

                              {/* View Details Primary Button */}
                              <Link
                                href={`/admin/applications/${app.id}`}
                                className="inline-flex items-center gap-1 rounded-lg bg-gray-900 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                              >
                                <span>Details</span>
                                <ArrowRight size={12} />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls for Course Applications (15 per page) */}
            {filteredApps.length > 0 && (
              <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 bg-gray-50/50 px-4 py-3.5 dark:border-white/[0.06] dark:bg-[#18181b]/60 sm:flex-row">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Showing{' '}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {(safeAppPage - 1) * PAGE_SIZE + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {Math.min(safeAppPage * PAGE_SIZE, filteredApps.length)}
                  </span>{' '}
                  of{' '}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {filteredApps.length}
                  </span>{' '}
                  applications
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setAppPage((p) => Math.max(1, p - 1))}
                    disabled={safeAppPage <= 1}
                    className="inline-flex h-8 items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 dark:hover:bg-white/[0.06]"
                  >
                    <ChevronLeft size={14} />
                    <span>Prev</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {getPaginationPages(safeAppPage, totalAppPages).map((p, idx) =>
                      p === '...' ? (
                        <span key={`ellipsis-${idx}`} className="px-1 text-xs text-gray-400">
                          ...
                        </span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => setAppPage(Number(p))}
                          className={`inline-flex h-8 min-w-[32px] items-center justify-center rounded-lg px-2 text-xs font-semibold transition-colors ${
                            safeAppPage === p
                              ? 'bg-[#c41e3a] text-white shadow-sm'
                              : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 dark:hover:bg-white/[0.06]'
                          }`}
                        >
                          {p}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    onClick={() => setAppPage((p) => Math.min(totalAppPages, p + 1))}
                    disabled={safeAppPage >= totalAppPages}
                    className="inline-flex h-8 items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 dark:hover:bg-white/[0.06]"
                  >
                    <span>Next</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      ) : (
        /* APPLY NOW INQUIRIES TAB (NORMALIZED & PAGINATED 15 PER PAGE) */
        <div className="space-y-4">
          {/* Quick Metrics Bar for Inquiries */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
              <div className="flex items-center gap-2 text-gray-400">
                <Users size={15} className="text-[#c41e3a]" />
                <span className="text-xs font-medium">Total Inquiries</span>
              </div>
              <p className="mt-1.5 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {inqStats.total}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
              <div className="flex items-center gap-2 text-gray-400">
                <Globe size={15} className="text-blue-500" />
                <span className="text-xs font-medium">Top Destination</span>
              </div>
              <p className="mt-1.5 truncate text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                {inqStats.topCountry}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
              <div className="flex items-center gap-2 text-gray-400">
                <GraduationCap size={15} className="text-purple-500" />
                <span className="text-xs font-medium">Top Degree</span>
              </div>
              <p className="mt-1.5 truncate text-lg font-bold tracking-tight text-purple-600 dark:text-purple-400">
                {inqStats.topLevel}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
              <div className="flex items-center gap-2 text-gray-400">
                <Languages size={15} className="text-emerald-500" />
                <span className="text-xs font-medium">Test Takers</span>
              </div>
              <p className="mt-1.5 text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                {inqStats.withTest}
              </p>
            </div>
          </div>

          {/* Inquiries Search & Quick Controls Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-1 flex-wrap items-center gap-3">
              <div className="w-full sm:w-[320px]">
                <SAInput
                  placeholder="Search by student, email, phone, university..."
                  icon={<Search size={14} />}
                  value={inqSearch}
                  onChange={(e) => {
                    setInqSearch(e.target.value)
                    setInqPage(1)
                  }}
                />
              </div>

              <select
                value={inqLevel}
                onChange={(e) => {
                  setInqLevel(e.target.value)
                  setInqPage(1)
                }}
                className={selCls}
              >
                <option value="">All Degrees</option>
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>

              <select
                value={inqTest}
                onChange={(e) => {
                  setInqTest(e.target.value)
                  setInqPage(1)
                }}
                className={selCls}
              >
                <option value="">All Tests</option>
                {TESTS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              {(inqSearch || inqLevel || inqTest || activeFilters > 0) && (
                <SAButton
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={12} />
                  Clear Filters
                </SAButton>
              )}
            </div>

            <div className="flex items-center gap-2">
              <SAButton
                variant="ghost"
                size="sm"
                onClick={() => utils.endow.listInquiries.invalidate()}
                title="Refresh list"
              >
                <RefreshCw size={13} />
                Refresh
              </SAButton>
            </div>
          </div>

          {/* Inquiries List / Table */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]"
          >
            {isInquiriesLoading ? (
              <div className="flex items-center justify-center py-24">
                <div
                  className="h-8 w-8 animate-spin rounded-full border-2"
                  style={{ borderColor: '#c41e3a', borderTopColor: 'transparent' }}
                />
              </div>
            ) : inqError ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <AlertTriangle size={28} className="text-red-500" />
                <p className="mt-2 text-sm font-medium text-red-500">
                  Failed to load inquiry submissions
                </p>
                <SAButton
                  variant="secondary"
                  size="sm"
                  className="mt-3"
                  onClick={() => utils.endow.listInquiries.invalidate()}
                >
                  Retry
                </SAButton>
              </div>
            ) : filteredInquiries.length === 0 ? (
              <div className="py-24 text-center">
                <Mail size={32} className="mx-auto text-gray-300 dark:text-gray-600" />
                <p className="mt-3 text-sm font-semibold text-gray-900 dark:text-white">
                  {!inquiries.length
                    ? 'No inquiries received yet'
                    : 'No inquiries match your filters'}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  Submissions from the public /apply-now page without login will automatically show up here.
                </p>
                {(inqSearch || activeFilters > 0) && (
                  <button
                    onClick={resetFilters}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-200"
                  >
                    Reset all filters
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50/80 dark:border-white/[0.08] dark:bg-[#18181b]/80">
                      {[
                        'Applicant',
                        'Target Goal & Degree',
                        'Location',
                        'Test & Academics',
                        'Submitted',
                        'Actions',
                      ].map((h, idx) => (
                        <th
                          key={h}
                          className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 ${
                            idx === 5 ? 'text-right' : 'text-left'
                          }`}
                          style={{ fontFamily: "'JetBrains Mono',monospace" }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-white/[0.06]">
                    {paginatedInquiries.map((inq) => {
                      const waNumber = cleanPhoneForWhatsApp(inq.whatsapp || inq.phone)
                      const initials = `${inq.givenName?.[0] || ''}${
                        inq.surname?.[0] || ''
                      }`.toUpperCase()

                      return (
                        <tr
                          key={inq.id}
                          className="group transition-colors hover:bg-gray-50/70 dark:hover:bg-white/[0.02]"
                        >
                          {/* Student Info */}
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-3">
                              {inq.photoUrl ? (
                                <img
                                  src={inq.photoUrl}
                                  alt=""
                                  className="h-9 w-9 shrink-0 rounded-xl border border-gray-100 object-cover dark:border-white/[0.08]"
                                />
                              ) : (
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#c41e3a]/15 to-[#e8a33d]/15 text-xs font-bold text-[#c41e3a] dark:text-red-400">
                                  {initials || 'ST'}
                                </div>
                              )}
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <Link
                                    href={`/admin/applications/inquiries/${inq.id}`}
                                    className="truncate text-sm font-semibold text-gray-900 transition-colors hover:text-[#c41e3a] dark:text-white dark:hover:text-red-400"
                                  >
                                    {inq.givenName} {inq.surname}
                                  </Link>
                                  <span
                                    className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-white/[0.08] dark:text-gray-300"
                                    title="Guest inquiry submission without login"
                                  >
                                    Guest Inquiry
                                  </span>
                                </div>
                                <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                  <span className="truncate max-w-[150px]">{inq.email}</span>
                                  <span>•</span>
                                  <span>{inq.phone}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Target Goal & Degree */}
                          <td className="px-4 py-3.5">
                            <div className="min-w-0 max-w-[220px]">
                              <div className="flex items-center gap-1.5">
                                {inq.applyingTo && (
                                  <span className="rounded-full bg-purple-50 px-2 py-0.5 text-xs font-semibold text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                                    {inq.applyingTo}
                                  </span>
                                )}
                                <span className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                  {inq.targetUniversity || 'General Inquiry'}
                                </span>
                              </div>
                              <div className="mt-1 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                <Globe size={11} className="text-[#c41e3a]" />
                                <span className="truncate">{inq.targetCountry || '—'}</span>
                                {inq.courseName && (
                                  <>
                                    <span>•</span>
                                    <span className="truncate max-w-[100px] text-gray-400">
                                      {inq.courseName}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Residence Location */}
                          <td className="px-4 py-3.5 text-xs">
                            <div className="flex items-center gap-1 font-medium text-gray-800 dark:text-gray-200">
                              <MapPin size={12} className="text-gray-400" />
                              <span>{inq.country || '—'}</span>
                            </div>
                            {inq.city && (
                              <p className="mt-0.5 text-xs text-gray-400 pl-4">
                                {inq.city}
                              </p>
                            )}
                          </td>

                          {/* Language & Academics */}
                          <td className="px-4 py-3.5">
                            <div className="flex flex-col gap-1">
                              {inq.englishTest && inq.englishTest !== 'None' ? (
                                <span className="inline-flex items-center gap-1 w-fit rounded bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                                  {inq.englishTest}
                                  {(() => {
                                    const testKey = `${inq.englishTest.toLowerCase()}Score` as keyof InquiryItem
                                    const score = inq[testKey]
                                    return score ? `: ${String(score)}` : ''
                                  })()}
                                </span>
                              ) : (
                                <span className="text-xs text-gray-400">No Test</span>
                              )}

                              {(inq.hscResult || inq.bachelorsResult || inq.sscResult) && (
                                <span className="text-xs text-gray-400">
                                  Result: {inq.bachelorsResult || inq.hscResult || inq.sscResult}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Submitted Date */}
                          <td className="px-4 py-3.5 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1 font-medium text-gray-800 dark:text-gray-200">
                              {fmtDate(inq.submittedAt)}
                            </div>
                            <span className="text-xs text-gray-400">
                              {formatDistanceToNow(new Date(inq.submittedAt), {
                                addSuffix: true,
                              })}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Quick Email link */}
                              <a
                                href={`mailto:${inq.email}`}
                                className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition-colors hover:border-gray-300 hover:text-gray-700 dark:border-white/[0.08] dark:hover:text-white"
                                title="Send Email"
                              >
                                <Mail size={13} />
                              </a>

                              {/* Quick WhatsApp link */}
                              {waNumber && (
                                <a
                                  href={`https://wa.me/${waNumber}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-200 text-emerald-600 transition-colors hover:bg-emerald-50 dark:border-emerald-900/40 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
                                  title="WhatsApp"
                                >
                                  <MessageCircle size={13} />
                                </a>
                              )}

                              {/* View Details Primary Button */}
                              <Link
                                href={`/admin/applications/inquiries/${inq.id}`}
                                className="inline-flex items-center gap-1 rounded-lg bg-gray-900 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                              >
                                <span>Details</span>
                                <ArrowRight size={12} />
                              </Link>

                              {/* Delete button */}
                              <button
                                onClick={() =>
                                  handleDeleteInquiry(
                                    inq.id,
                                    `${inq.givenName} ${inq.surname}`
                                  )
                                }
                                className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-300 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                                title="Delete Inquiry"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls for Inquiries (15 per page) */}
            {filteredInquiries.length > 0 && (
              <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 bg-gray-50/50 px-4 py-3.5 dark:border-white/[0.06] dark:bg-[#18181b]/60 sm:flex-row">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Showing{' '}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {(safeInqPage - 1) * PAGE_SIZE + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {Math.min(safeInqPage * PAGE_SIZE, filteredInquiries.length)}
                  </span>{' '}
                  of{' '}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {filteredInquiries.length}
                  </span>{' '}
                  inquiries
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setInqPage((p) => Math.max(1, p - 1))}
                    disabled={safeInqPage <= 1}
                    className="inline-flex h-8 items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 dark:hover:bg-white/[0.06]"
                  >
                    <ChevronLeft size={14} />
                    <span>Prev</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {getPaginationPages(safeInqPage, totalInqPages).map((p, idx) =>
                      p === '...' ? (
                        <span key={`ellipsis-${idx}`} className="px-1 text-xs text-gray-400">
                          ...
                        </span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => setInqPage(Number(p))}
                          className={`inline-flex h-8 min-w-[32px] items-center justify-center rounded-lg px-2 text-xs font-semibold transition-colors ${
                            safeInqPage === p
                              ? 'bg-[#c41e3a] text-white shadow-sm'
                              : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 dark:hover:bg-white/[0.06]'
                          }`}
                        >
                          {p}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    onClick={() => setInqPage((p) => Math.min(totalInqPages, p + 1))}
                    disabled={safeInqPage >= totalInqPages}
                    className="inline-flex h-8 items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 dark:hover:bg-white/[0.06]"
                  >
                    <span>Next</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  )
}
