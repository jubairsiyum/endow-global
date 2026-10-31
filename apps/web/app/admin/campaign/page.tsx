'use client'

import AdminTable from '@/components/ui/AdminTable'
import PageHeader from '@/components/ui/PageHeader'
import { trpc } from '@/lib/trpc-client'
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Download,
  ExternalLink,
  Eye,
  FileSpreadsheet,
  Mail,
  Phone,
  Plus,
  Printer,
  QrCode,
  RefreshCw,
  RotateCcw,
  Search,
  Trash2,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

type StatusType = 'ALL' | 'PARTIAL' | 'COMPLETED' | 'CONTACTED' | 'CONVERTED' | 'ARCHIVED'

interface ManualLeadForm {
  name: string
  email: string
  phone: string
  interestedProgram: string
  interestedCountry: string
  intakeYear: string
  reason: string
  status: 'PARTIAL' | 'COMPLETED' | 'CONTACTED' | 'CONVERTED' | 'ARCHIVED'
}

const emptyManualForm: ManualLeadForm = {
  name: '',
  email: '',
  phone: '',
  interestedProgram: "Bachelor's Degree",
  interestedCountry: 'South Korea',
  intakeYear: '2026',
  reason: '',
  status: 'COMPLETED',
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

export default function AdminCampaignPage() {
  // Filters State
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusType>('ALL')
  const [countryFilter, setCountryFilter] = useState('ALL')
  const [datePreset, setDatePreset] = useState<
    'ALL' | 'TODAY' | 'YESTERDAY' | '7DAYS' | '30DAYS' | 'THIS_MONTH' | 'CUSTOM'
  >('ALL')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [page, setPage] = useState(1)
  const limit = 15

  // Debounce search input to avoid flood and out-of-order queries
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  // Modals
  const [selectedLead, setSelectedLead] = useState<any | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isManualModalOpen, setIsManualModalOpen] = useState(false)
  const [manualForm, setManualForm] = useState<ManualLeadForm>(emptyManualForm)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const formatLocalDate = (d: Date): string => {
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Compute active date boundaries based on preset
  const computedDates = useMemo(() => {
    if (datePreset === 'ALL') {
      return { start: undefined, end: undefined }
    }

    if (datePreset === 'CUSTOM') {
      return {
        start: startDate || undefined,
        end: endDate || undefined,
      }
    }

    const now = new Date()
    const todayStr = formatLocalDate(now)

    switch (datePreset) {
      case 'TODAY':
        return { start: todayStr, end: todayStr }

      case 'YESTERDAY': {
        const y = new Date(now)
        y.setDate(y.getDate() - 1)
        const yStr = formatLocalDate(y)
        return { start: yStr, end: yStr }
      }

      case '7DAYS': {
        const past = new Date(now)
        past.setDate(past.getDate() - 7)
        return { start: formatLocalDate(past), end: todayStr }
      }

      case '30DAYS': {
        const past = new Date(now)
        past.setDate(past.getDate() - 30)
        return { start: formatLocalDate(past), end: todayStr }
      }

      case 'THIS_MONTH': {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        return { start: formatLocalDate(startOfMonth), end: todayStr }
      }

      default:
        return { start: undefined, end: undefined }
    }
  }, [datePreset, startDate, endDate])

  const hasActiveFilters = Boolean(
    search.trim() ||
    statusFilter !== 'ALL' ||
    countryFilter !== 'ALL' ||
    datePreset !== 'ALL' ||
    startDate ||
    endDate
  )

  const handleResetFilters = () => {
    setSearch('')
    setDebouncedSearch('')
    setStatusFilter('ALL')
    setCountryFilter('ALL')
    setDatePreset('ALL')
    setStartDate('')
    setEndDate('')
    setPage(1)
  }

  const utils = trpc.useUtils()

  // Queries
  const {
    data: listData,
    isLoading,
    refetch,
  } = trpc.campaign.list.useQuery({
    search: debouncedSearch.trim() || undefined,
    status: statusFilter,
    country: countryFilter !== 'ALL' ? countryFilter : undefined,
    startDate: computedDates.start,
    endDate: computedDates.end,
    page,
    limit,
  })

  // Global summary statistics for top KPI metric cards
  const { data: statsData } = trpc.campaign.stats.useQuery()

  // Mutations
  const updateStatusMutation = trpc.campaign.updateStatus.useMutation({
    onSuccess: () => {
      utils.campaign.list.invalidate()
      utils.campaign.stats.invalidate()
    },
  })

  const deleteMutation = trpc.campaign.delete.useMutation({
    onSuccess: () => {
      utils.campaign.list.invalidate()
      utils.campaign.stats.invalidate()
      setDeleteId(null)
    },
  })

  const createMutation = trpc.campaign.createManual.useMutation({
    onSuccess: () => {
      utils.campaign.list.invalidate()
      utils.campaign.stats.invalidate()
      setIsManualModalOpen(false)
      setManualForm(emptyManualForm)
    },
  })

  // Export Data Query (lazy triggered on click)
  const exportQuery = trpc.campaign.exportData.useQuery(
    {
      search: debouncedSearch.trim() || undefined,
      status: statusFilter,
      country: countryFilter !== 'ALL' ? countryFilter : undefined,
      startDate: computedDates.start,
      endDate: computedDates.end,
    },
    { enabled: false }
  )

  // Copy helper
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(label)
    setTimeout(() => setCopiedField(null), 2000)
  }

  // Handle Export CSV
  const handleExportCSV = async () => {
    const res = await exportQuery.refetch()
    const leads = res.data || []
    if (leads.length === 0) {
      alert('No campaign leads available for the selected filters.')
      return
    }

    const headers = [
      'SL',
      'Lead ID',
      'Name',
      'Email',
      'Phone',
      'Interested Program',
      'Interested Country',
      'Intake Year',
      'Reason / Motivation',
      'Completed Step',
      'Status',
      'Campaign Source',
      'UTM Medium',
      'UTM Campaign',
      'IP Address',
      'Submitted Date',
    ]

    const csvRows = [headers.join(',')]

    for (let idx = 0; idx < leads.length; idx++) {
      const lead = leads[idx]
      const escape = (str: any) => `"${String(str || '').replace(/"/g, '""')}"`
      const dateStr = lead.createdAt ? new Date(lead.createdAt).toISOString() : ''
      csvRows.push(
        [
          idx + 1,
          escape(lead.id),
          escape(lead.name),
          escape(lead.email),
          escape(lead.phone),
          escape(lead.interestedProgram),
          escape(lead.interestedCountry),
          escape(lead.intakeYear),
          escape(lead.reason),
          escape(lead.completedStep),
          escape(lead.status),
          escape(lead.utmSource),
          escape(lead.utmMedium),
          escape(lead.utmCampaign),
          escape(lead.ipAddress),
          escape(dateStr),
        ].join(',')
      )
    }

    const csvContent = '\uFEFF' + csvRows.join('\r\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const todayStr = new Date().toISOString().split('T')[0]
    link.href = url
    link.download = `Endow_Global_Campaign_Leads_${todayStr}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Handle Export Excel (.xls HTML table)
  const handleExportExcel = async () => {
    const res = await exportQuery.refetch()
    const leads = res.data || []
    if (leads.length === 0) {
      alert('No campaign leads available for the selected filters.')
      return
    }

    const tableRows = leads
      .map((lead, idx) => {
        const d = lead.createdAt ? new Date(lead.createdAt).toLocaleString() : ''
        return `
        <tr>
          <td>${idx + 1}</td>
          <td>${lead.id || ''}</td>
          <td>${lead.name || ''}</td>
          <td>${lead.email || ''}</td>
          <td>${lead.phone || ''}</td>
          <td>${lead.interestedProgram || ''}</td>
          <td>${lead.interestedCountry || ''}</td>
          <td>${lead.intakeYear || ''}</td>
          <td>${lead.reason || ''}</td>
          <td>Step ${lead.completedStep || 1} of 6</td>
          <td><b>${lead.status || ''}</b></td>
          <td>${lead.utmSource || ''}</td>
          <td>${lead.utmCampaign || ''}</td>
          <td>${lead.ipAddress || ''}</td>
          <td>${d}</td>
        </tr>`
      })
      .join('')

    const excelHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <style>
          th { background-color: #AD0819; color: #FFFFFF; font-weight: bold; border: 1px solid #7A0713; padding: 8px; }
          td { border: 1px solid #CCCCCC; padding: 6px; }
          tr:nth-child(even) { background-color: #F9F9F9; }
        </style>
      </head>
      <body>
        <h2>Endow Global Education - Campaign Leads Report</h2>
        <p>Generated: ${new Date().toLocaleString()}</p>
        <table>
          <thead>
            <tr>
              <th>SL</th>
              <th>Lead ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Program</th>
              <th>Country</th>
              <th>Intake</th>
              <th>Reason</th>
              <th>Progress</th>
              <th>Status</th>
              <th>Source</th>
              <th>Campaign</th>
              <th>IP Address</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </body>
      </html>
    `

    const blob = new Blob([excelHtml], { type: 'application/vnd.ms-excel;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const todayStr = new Date().toISOString().split('T')[0]
    link.href = url
    link.download = `Endow_Global_Campaign_Leads_${todayStr}.xls`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Print system handler
  const handlePrint = () => {
    window.print()
  }

  const leads = listData?.leads || []
  const totalCount = listData?.totalCount || 0
  const totalPages = listData?.totalPages || 1

  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  return (
    <div className="space-y-6 print:m-0 print:p-0">
      {/* Print View Stylesheet */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              @page {
                size: A4 landscape;
                margin: 8mm 10mm 10mm 10mm;
              }
              html, body {
                background: #ffffff !important;
                color: #000000 !important;
                font-size: 10pt !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              table {
                width: 100% !important;
                border-collapse: collapse !important;
              }
              th, td {
                border: 1px solid #d1d5db !important;
                padding: 5px 8px !important;
                color: #111827 !important;
                vertical-align: middle !important;
              }
              th {
                background-color: #f3f4f6 !important;
                font-weight: 700 !important;
                text-transform: uppercase !important;
                font-size: 8.5pt !important;
              }
              thead {
                display: table-header-group !important;
              }
              tr {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
              }
            }
          `,
        }}
      />

      {/* Printable Report Header (visible only when printing) */}
      <div className="mb-4 hidden border-b border-gray-400 pb-3 print:block">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              Endow Global Education — Campaign Leads Report
            </h1>
            <p className="mt-0.5 text-xs text-gray-600">
              Candidate Inquiries &amp; Audit &bull; Filter: <strong>{datePreset}</strong> (
              {computedDates.start || 'Start'} to {computedDates.end || 'Present'})
            </p>
          </div>
          <div className="text-right text-xs text-gray-600">
            <p>{mounted && `Printed: ${new Date().toLocaleString()}`}</p>
            <p>
              Total Records: <strong>{totalCount}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Screen Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center print:hidden">
        <PageHeader
          title="Campaign Leads"
          description="Manage QR code campaign inquiries, progressive drop-offs, and export lead data."
        />

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <button
            type="button"
            onClick={() => setIsManualModalOpen(true)}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#AD0819] px-3.5 py-2 text-xs font-semibold text-white shadow-sm shadow-[#AD0819]/25 transition-all hover:bg-[#8F0614] active:scale-[0.98]"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Lead</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-medium text-gray-800 transition-all hover:bg-gray-50 dark:border-white/10 dark:bg-[#18181b] dark:text-gray-200 dark:hover:bg-white/[0.04]"
            title="Download CSV file (compatible with Excel & Google Sheets)"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-green-600" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={handleExportExcel}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-medium text-gray-800 transition-all hover:bg-gray-50 dark:border-white/10 dark:bg-[#18181b] dark:text-gray-200 dark:hover:bg-white/[0.04]"
            title="Download styled Excel file (.xls)"
          >
            <Download className="h-3.5 w-3.5 text-blue-600" />
            <span>Export Excel</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-medium text-gray-800 transition-all hover:bg-gray-50 dark:border-white/10 dark:bg-[#18181b] dark:text-gray-200 dark:hover:bg-white/[0.04]"
            title="Print printable summary table"
          >
            <Printer className="h-3.5 w-3.5 text-gray-500" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 print:hidden">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Leads</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {statsData?.total ?? 0}
          </p>
          <span className="mt-0.5 block text-[11px] text-gray-400">All QR & Campaign entries</span>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Completed</p>
            <span className="rounded bg-green-50 px-1.5 py-0.5 text-[10px] font-bold text-green-600 dark:bg-green-950/60 dark:text-green-400">
              {statsData?.completionRate ?? 0}%
            </span>
          </div>
          <p className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">
            {statsData?.completed ?? 0}
          </p>
          <span className="mt-0.5 block text-[11px] text-gray-400">All 6 steps finished</span>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Partial Drop-offs</p>
          <p className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">
            {statsData?.partial ?? 0}
          </p>
          <span className="mt-0.5 block text-[11px] text-gray-400">Saved before step 6</span>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Today&apos;s Leads</p>
          <p className="mt-1 text-2xl font-bold text-[#AD0819]">{statsData?.todayCount ?? 0}</p>
          <span className="mt-0.5 block text-[11px] text-gray-400">Submissions today</span>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Converted / Contacted
          </p>
          <p className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">
            {(statsData?.contacted ?? 0) + (statsData?.converted ?? 0)}
          </p>
          <span className="mt-0.5 block text-[11px] text-gray-400">Followed up by staff</span>
        </div>
      </div>

      {/* Filter and Date Bar */}
      <div className="sm:p-4.5 space-y-3 rounded-2xl border border-gray-200 bg-white p-3.5 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b] print:hidden">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* Search Field with Clear Button */}
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="Search by name, email, phone, program, country, intake, lead ID..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-9 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#AD0819] focus:ring-2 focus:ring-[#AD0819]/20 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  setDebouncedSearch('')
                  setPage(1)
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                title="Clear search input"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Controls: Dropdowns & Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {/* Status Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="whitespace-nowrap text-xs font-semibold text-gray-500 dark:text-gray-400 sm:text-sm">
                Status:
              </span>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as StatusType)
                  setPage(1)
                }}
                className="rounded-xl border border-gray-200 bg-gray-50 px-2.5 py-2 text-xs font-medium text-gray-900 outline-none focus:border-[#AD0819] dark:border-white/10 dark:bg-white/[0.04] dark:text-white sm:px-3 sm:text-sm"
              >
                <option value="ALL">All Statuses</option>
                <option value="COMPLETED">Completed</option>
                <option value="PARTIAL">Partial (Drop-off)</option>
                <option value="CONTACTED">Contacted</option>
                <option value="CONVERTED">Converted</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            {/* Country Filter */}
            <div className="flex items-center gap-1.5">
              <span className="whitespace-nowrap text-xs font-semibold text-gray-500 dark:text-gray-400 sm:text-sm">
                Country:
              </span>
              <select
                value={countryFilter}
                onChange={(e) => {
                  setCountryFilter(e.target.value)
                  setPage(1)
                }}
                className="rounded-xl border border-gray-200 bg-gray-50 px-2.5 py-2 text-xs font-medium text-gray-900 outline-none focus:border-[#AD0819] dark:border-white/10 dark:bg-white/[0.04] dark:text-white sm:px-3 sm:text-sm"
              >
                <option value="ALL">All Countries</option>
                <option value="South Korea">South Korea</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="Germany">Germany</option>
                <option value="Japan">Japan</option>
                <option value="Malaysia">Malaysia</option>
              </select>
            </div>

            {/* Reset Filters Action */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50/70 px-2.5 py-2 text-xs font-semibold text-[#AD0819] transition-colors hover:bg-red-100/80 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-400 sm:px-3"
                title="Reset all search filters"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-xl border border-gray-200 p-2 text-gray-600 transition-colors hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/[0.04] sm:p-2.5"
              title="Refresh leads"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Date Filter Presets */}
        <div className="flex flex-wrap items-center gap-1.5 border-t border-gray-100 pt-3 dark:border-white/[0.05] sm:gap-2">
          <span className="flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400 sm:text-sm">
            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Date:
          </span>

          {[
            { id: 'ALL', label: 'All Time' },
            { id: 'TODAY', label: 'Today' },
            { id: 'YESTERDAY', label: 'Yesterday' },
            { id: '7DAYS', label: 'Last 7 Days' },
            { id: '30DAYS', label: 'Last 30 Days' },
            { id: 'THIS_MONTH', label: 'This Month' },
            { id: 'CUSTOM', label: 'Custom Range' },
          ].map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => {
                setDatePreset(preset.id as any)
                setPage(1)
              }}
              className={`rounded-xl px-2.5 py-1.5 text-xs font-medium transition-all sm:px-3 sm:text-sm ${
                datePreset === preset.id
                  ? 'bg-[#AD0819] font-semibold text-white shadow-sm ring-2 ring-[#AD0819]/25'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-white/[0.05] dark:text-gray-300 dark:hover:bg-white/10'
              }`}
            >
              {preset.label}
            </button>
          ))}

          {/* Custom Date Pickers */}
          {datePreset === 'CUSTOM' && (
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value)
                  setPage(1)
                }}
                className="rounded-xl border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-800 dark:border-white/10 dark:bg-white/[0.04] dark:text-gray-200 sm:text-sm"
              />
              <span className="text-xs text-gray-400 sm:text-sm">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value)
                  setPage(1)
                }}
                className="rounded-xl border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-800 dark:border-white/10 dark:bg-white/[0.04] dark:text-gray-200 sm:text-sm"
              />
            </div>
          )}
        </div>
      </div>

      {/* Leads Table */}
      <AdminTable className="print:rounded-none print:border-none print:shadow-none">
        <div className="flex flex-col justify-between gap-3 border-b border-gray-100 bg-white px-6 py-6 dark:border-white/[0.06] dark:bg-[#18181b] sm:flex-row sm:items-center print:hidden">
          <div>
            <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
              Campaign Leads Records
            </h2>
            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
              Real-time student submissions from QR codes and online campaigns
            </p>
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <span className="inline-flex items-center gap-1 rounded-xl bg-red-50 px-2.5 py-1 font-mono text-xs font-semibold text-[#AD0819] dark:bg-red-950/40 dark:text-red-300">
                Filtered view
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-gray-100 px-3 py-1.5 font-mono text-xs font-semibold text-gray-700 dark:bg-white/[0.06] dark:text-gray-200 sm:text-sm">
              Total: {totalCount} {totalCount === 1 ? 'lead' : 'leads'}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto print:overflow-visible">
          <table className="w-full text-left text-sm sm:text-base">
            <thead className="border-b border-gray-200 bg-gray-50 font-mono text-xs uppercase tracking-wider text-gray-700 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-gray-200 sm:text-sm">
              <tr>
                <th className="w-14 px-4 py-4 text-center font-bold">#</th>
                <th className="px-5 py-4 font-bold">Candidate</th>
                <th className="px-5 py-4 font-bold">Contact</th>
                <th className="px-5 py-4 font-bold">Target / Program</th>
                <th className="px-4 py-4 font-bold">Intake</th>
                <th className="px-4 py-4 font-bold">Progress</th>
                <th className="px-5 py-4 font-bold">Status</th>
                <th className="px-5 py-4 text-right font-bold print:hidden">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm dark:divide-white/[0.06]">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm text-gray-400">
                    <div className="flex items-center justify-center gap-2.5">
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#AD0819] border-t-transparent" />
                      <span className="text-base font-medium">Loading campaign leads...</span>
                    </div>
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-14 text-center text-gray-400">
                    <QrCode className="mx-auto mb-2 h-10 w-10 text-gray-300 opacity-60 dark:text-gray-600" />
                    <p className="text-base font-bold text-gray-700 dark:text-gray-300">
                      No campaign leads found
                    </p>
                    <p className="mt-1 text-sm text-gray-400">
                      {hasActiveFilters
                        ? 'No leads matched your current filters and search criteria.'
                        : 'No campaign leads have been captured yet.'}
                    </p>
                    {hasActiveFilters && (
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="mt-3.5 inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-gray-200"
                      >
                        <RotateCcw className="h-3.5 w-3.5 text-[#AD0819]" />
                        <span>Clear all filters</span>
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                leads.map((lead, idx) => {
                  const isCompleted = lead.completedStep === 6 || lead.status === 'COMPLETED'
                  const serial = (page - 1) * limit + idx + 1
                  return (
                    <tr
                      key={lead.id}
                      className="transition-colors hover:bg-gray-50/80 dark:hover:bg-white/[0.02]"
                    >
                      {/* Serial Number */}
                      <td className="px-4 py-4 text-center font-mono text-sm font-bold text-gray-600 dark:text-gray-400 sm:text-base">
                        {serial}
                      </td>

                      {/* Candidate Column */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-red-500/30 bg-gradient-to-br from-red-500/20 to-red-500/10 text-sm font-bold text-[#AD0819] print:hidden">
                            {lead.name ? lead.name.charAt(0).toUpperCase() : '?'}
                          </div>
                          <div>
                            <p className="text-sm font-bold leading-snug text-gray-900 dark:text-white sm:text-base">
                              {lead.name || 'Unnamed Lead'}
                            </p>
                            <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
                              {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : ''}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact Column */}
                      <td className="px-5 py-4">
                        <div className="space-y-1">
                          {lead.email ? (
                            <div className="flex items-center gap-2 text-xs font-medium text-gray-800 dark:text-gray-200 sm:text-sm">
                              <Mail className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                              <span className="max-w-[200px] truncate">{lead.email}</span>
                            </div>
                          ) : (
                            <span className="text-xs italic text-gray-400">No email</span>
                          )}

                          {lead.phone ? (
                            <div className="flex items-center gap-2 font-mono text-xs font-semibold text-gray-800 dark:text-gray-200 sm:text-sm">
                              <Phone className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                              <span>{lead.phone}</span>
                              <a
                                href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-1 text-emerald-500 hover:text-emerald-600 print:hidden"
                                title="Open WhatsApp chat"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          ) : (
                            <span className="text-xs italic text-gray-400">No phone</span>
                          )}
                        </div>
                      </td>

                      {/* Destination & Program */}
                      <td className="px-5 py-4">
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-gray-100 sm:text-base">
                            {lead.interestedCountry || 'Not selected'}
                          </p>
                          <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                            {lead.interestedProgram || 'Program pending'}
                          </span>
                        </div>
                      </td>

                      {/* Intake Year */}
                      <td className="px-4 py-4">
                        <span className="font-mono text-xs font-semibold text-gray-800 dark:text-gray-200 sm:text-sm">
                          {lead.intakeYear || '—'}
                        </span>
                      </td>

                      {/* Progress Badge */}
                      <td className="px-4 py-4">
                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700 dark:border-green-800 dark:bg-green-950/60 dark:text-green-300">
                            <CheckCircle className="h-3.5 w-3.5" />
                            <span>Step 6 (Done)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                            <Clock className="h-3.5 w-3.5" />
                            <span>Step {lead.completedStep}/6 (Partial)</span>
                          </span>
                        )}
                      </td>

                      {/* Status Dropdown (Screen) / Clean Text (Print) */}
                      <td className="px-5 py-4">
                        <select
                          value={lead.status}
                          onChange={(e) => {
                            updateStatusMutation.mutate({
                              id: lead.id,
                              status: e.target.value as any,
                            })
                          }}
                          className={`cursor-pointer rounded-xl border px-2.5 py-1.5 text-xs font-bold outline-none transition-colors sm:text-sm print:hidden ${
                            lead.status === 'COMPLETED'
                              ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/40 dark:text-green-300'
                              : lead.status === 'CONTACTED'
                                ? 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300'
                                : lead.status === 'CONVERTED'
                                  ? 'border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950/40 dark:text-purple-300'
                                  : lead.status === 'ARCHIVED'
                                    ? 'border-gray-200 bg-gray-100 text-gray-500 dark:border-white/10 dark:bg-white/[0.05]'
                                    : 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                          }`}
                        >
                          <option value="PARTIAL">PARTIAL</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CONTACTED">CONTACTED</option>
                          <option value="CONVERTED">CONVERTED</option>
                          <option value="ARCHIVED">ARCHIVED</option>
                        </select>
                        <span className="hidden font-mono text-xs font-bold uppercase tracking-wider text-black print:inline-block">
                          {lead.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right print:hidden">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedLead(lead)}
                            className="rounded-xl p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/[0.08] dark:hover:text-white"
                            title="View lead details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteId(lead.id)}
                            className="rounded-xl p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/40"
                            title="Delete lead"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalCount > 0 && (
          <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 p-4 text-xs text-gray-600 dark:border-white/[0.06] dark:text-gray-400 sm:flex-row sm:text-sm print:hidden">
            <div className="flex items-center gap-2">
              <span>
                Showing{' '}
                <strong className="text-gray-900 dark:text-white">{(page - 1) * limit + 1}</strong>{' '}
                to{' '}
                <strong className="text-gray-900 dark:text-white">
                  {Math.min(page * limit, totalCount)}
                </strong>{' '}
                of <strong className="text-gray-900 dark:text-white">{totalCount}</strong> leads
              </span>
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-semibold text-gray-600 dark:bg-white/[0.06] dark:text-gray-300">
                15 per page
              </span>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-1 sm:gap-1.5">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="inline-flex h-8 items-center gap-1 rounded-xl border border-gray-200 bg-white px-2.5 text-xs font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-[#18181b] dark:text-gray-300 dark:hover:bg-white/[0.04]"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>Prev</span>
                </button>

                <div className="flex items-center gap-1">
                  {getPaginationPages(page, totalPages).map((p, idx) =>
                    p === '...' ? (
                      <span key={`ellipsis-${idx}`} className="px-1.5 text-xs text-gray-400">
                        ...
                      </span>
                    ) : (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPage(Number(p))}
                        className={`inline-flex h-8 min-w-[32px] items-center justify-center rounded-xl px-2 text-xs font-semibold transition-all ${
                          page === p
                            ? 'bg-[#AD0819] text-white shadow-sm shadow-[#AD0819]/25'
                            : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:bg-[#18181b] dark:text-gray-300 dark:hover:bg-white/[0.04]'
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="inline-flex h-8 items-center gap-1 rounded-xl border border-gray-200 bg-white px-2.5 text-xs font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-[#18181b] dark:text-gray-300 dark:hover:bg-white/[0.04]"
                >
                  <span>Next</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </AdminTable>

      {/* LEAD DETAILS MODAL */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-black/60 backdrop-blur-sm print:hidden">
          <div className="flex min-h-full items-center justify-center p-3 py-6 sm:p-4 sm:py-8">
            <div className="relative flex max-h-[calc(100dvh-1.5rem)] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#18181b] sm:max-h-[calc(100dvh-4rem)]">
              <div className="flex shrink-0 items-start gap-3 border-b border-gray-100 p-5 pr-12 dark:border-white/[0.06] sm:p-6 sm:pr-14">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-lg font-bold text-primary">
                  {selectedLead.name ? selectedLead.name.charAt(0).toUpperCase() : '?'}
                </div>
                <div className="min-w-0 pt-0.5">
                  <h3 className="truncate text-base font-bold leading-tight text-gray-900 dark:text-white">
                    {selectedLead.name || 'Unnamed Lead'}
                  </h3>
                  <span className="mt-0.5 block truncate font-mono text-xs text-gray-400">
                    ID: {selectedLead.id}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                aria-label="Close"
                className="absolute right-4 top-4 rounded-xl p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-white/[0.08] dark:hover:text-white sm:right-5 sm:top-5"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-5 pt-4 text-xs sm:p-6 sm:pt-5">
                <div className="grid grid-cols-2 gap-2 rounded-2xl border border-gray-100 bg-gray-50 p-3 dark:border-white/[0.06] dark:bg-white/[0.02]">
                  <div>
                    <span className="block font-mono text-[10px] uppercase text-gray-400">
                      Email
                    </span>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <span className="truncate font-semibold text-gray-800 dark:text-gray-200">
                        {selectedLead.email || 'None'}
                      </span>
                      {selectedLead.email && (
                        <button
                          type="button"
                          onClick={() => handleCopy(selectedLead.email, 'email')}
                          className="text-gray-400 hover:text-primary"
                          title="Copy email"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="block font-mono text-[10px] uppercase text-gray-400">
                      Phone
                    </span>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <span className="font-mono font-semibold text-gray-800 dark:text-gray-200">
                        {selectedLead.phone || 'None'}
                      </span>
                      {selectedLead.phone && (
                        <button
                          type="button"
                          onClick={() => handleCopy(selectedLead.phone, 'phone')}
                          className="text-gray-400 hover:text-primary"
                          title="Copy phone"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 rounded-2xl border border-gray-100 bg-gray-50 p-3 dark:border-white/[0.06] dark:bg-white/[0.02]">
                  <div>
                    <span className="block font-mono text-[10px] uppercase text-gray-400">
                      Target Country
                    </span>
                    <span className="mt-0.5 block font-semibold text-gray-800 dark:text-gray-200">
                      {selectedLead.interestedCountry || 'Not Selected'}
                    </span>
                  </div>
                  <div>
                    <span className="block font-mono text-[10px] uppercase text-gray-400">
                      Degree Program
                    </span>
                    <span className="mt-0.5 block font-semibold text-gray-800 dark:text-gray-200">
                      {selectedLead.interestedProgram || 'Not Selected'}
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="block font-mono text-[10px] uppercase text-gray-400">
                      Intake Year
                    </span>
                    <span className="mt-0.5 block font-mono font-semibold text-gray-800 dark:text-gray-200">
                      {selectedLead.intakeYear || 'Not Selected'}
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="block font-mono text-[10px] uppercase text-gray-400">
                      Progress Level
                    </span>
                    <span className="mt-0.5 block font-semibold text-gray-800 dark:text-gray-200">
                      Step {selectedLead.completedStep} of 6 ({selectedLead.status})
                    </span>
                  </div>
                </div>

                {selectedLead.reason && (
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-3 dark:border-white/[0.06] dark:bg-white/[0.02]">
                    <span className="mb-1 block font-mono text-[10px] uppercase text-gray-400">
                      Why they want to go / Personal Note
                    </span>
                    <p className="italic leading-relaxed text-gray-700 dark:text-gray-300">
                      "{selectedLead.reason}"
                    </p>
                  </div>
                )}

                {/* Technical / Campaign Metadata */}
                <div className="space-y-1 rounded-2xl border border-gray-100 bg-gray-50 p-3 font-mono text-[11px] text-gray-500 dark:border-white/[0.06] dark:bg-white/[0.02]">
                  <div className="flex justify-between">
                    <span>Source:</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {selectedLead.utmSource || 'qr-campaign'}
                    </span>
                  </div>
                  {selectedLead.utmCampaign && (
                    <div className="flex justify-between">
                      <span>UTM Campaign:</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {selectedLead.utmCampaign}
                      </span>
                    </div>
                  )}
                  {selectedLead.ipAddress && (
                    <div className="flex justify-between">
                      <span>IP Address:</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {selectedLead.ipAddress}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Created:</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {selectedLead.createdAt
                        ? new Date(selectedLead.createdAt).toLocaleString()
                        : ''}
                    </span>
                  </div>
                </div>

                {copiedField && (
                  <div className="mt-2 text-center text-xs font-medium text-green-600">
                    Copied {copiedField} to clipboard!
                  </div>
                )}
              </div>

              {/* Quick Action Footer */}
              <div className="flex shrink-0 items-center justify-end gap-2 border-t border-gray-100 px-5 py-3.5 dark:border-white/[0.06] sm:px-6">
                {selectedLead.phone && (
                  <a
                    href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>WhatsApp</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedLead(null)}
                  className="rounded-xl bg-gray-100 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-200 dark:bg-white/[0.05] dark:text-gray-300 dark:hover:bg-white/10"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MANUAL LEAD CREATION MODAL */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-black/60 backdrop-blur-sm print:hidden">
          <div className="flex min-h-full items-center justify-center p-3 py-6 sm:p-4 sm:py-8">
            <div className="relative flex max-h-[calc(100dvh-1.5rem)] w-full max-w-md flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#18181b] sm:max-h-[calc(100dvh-4rem)]">
              <div className="shrink-0 border-b border-gray-100 px-5 py-4 pr-12 dark:border-white/[0.06] sm:px-6 sm:pr-14">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Add Campaign Lead Manually
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsManualModalOpen(false)}
                aria-label="Close"
                className="absolute right-4 top-4 rounded-xl p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-white/[0.08] dark:hover:text-white sm:right-5 sm:top-5"
              >
                <X className="h-4 w-4" />
              </button>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  createMutation.mutate(manualForm)
                }}
                className="flex min-h-0 flex-1 flex-col"
              >
                <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-5 py-4 text-xs sm:px-6">
                  <div>
                    <label className="mb-1 block font-medium text-gray-500">Candidate Name *</label>
                    <input
                      type="text"
                      required
                      value={manualForm.name}
                      onChange={(e) => setManualForm({ ...manualForm, name: e.target.value })}
                      placeholder="Full name"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 outline-none focus:border-primary dark:border-white/10 dark:bg-white/[0.04]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="mb-1 block font-medium text-gray-500">Email</label>
                      <input
                        type="email"
                        value={manualForm.email}
                        onChange={(e) => setManualForm({ ...manualForm, email: e.target.value })}
                        placeholder="email@example.com"
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 outline-none focus:border-primary dark:border-white/10 dark:bg-white/[0.04]"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block font-medium text-gray-500">Phone</label>
                      <input
                        type="tel"
                        value={manualForm.phone}
                        onChange={(e) => setManualForm({ ...manualForm, phone: e.target.value })}
                        placeholder="+880..."
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 outline-none focus:border-primary dark:border-white/10 dark:bg-white/[0.04]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="mb-1 block font-medium text-gray-500">
                        Interested Country
                      </label>
                      <select
                        value={manualForm.interestedCountry}
                        onChange={(e) =>
                          setManualForm({ ...manualForm, interestedCountry: e.target.value })
                        }
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 outline-none focus:border-primary dark:border-white/10 dark:bg-white/[0.04]"
                      >
                        <option value="South Korea">South Korea</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                        <option value="Germany">Germany</option>
                        <option value="Japan">Japan</option>
                        <option value="Malaysia">Malaysia</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block font-medium text-gray-500">Program Level</label>
                      <select
                        value={manualForm.interestedProgram}
                        onChange={(e) =>
                          setManualForm({ ...manualForm, interestedProgram: e.target.value })
                        }
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 outline-none focus:border-primary dark:border-white/10 dark:bg-white/[0.04]"
                      >
                        <option value="Bachelor's Degree">Bachelor's Degree</option>
                        <option value="Master's Degree">Master's Degree</option>
                        <option value="PhD / Doctorate">PhD / Doctorate</option>
                        <option value="Diploma / Vocational">Diploma / Vocational</option>
                        <option value="Language Course">Language Course</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="mb-1 block font-medium text-gray-500">Intake Year</label>
                      <select
                        value={manualForm.intakeYear}
                        onChange={(e) =>
                          setManualForm({ ...manualForm, intakeYear: e.target.value })
                        }
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 outline-none focus:border-primary dark:border-white/10 dark:bg-white/[0.04]"
                      >
                        <option value="2026">2026</option>
                        <option value="2027">2027</option>
                        <option value="2028">2028</option>
                        <option value="2029 or Later">2029 or Later</option>
                        <option value="Flexible">Flexible</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block font-medium text-gray-500">Status</label>
                      <select
                        value={manualForm.status}
                        onChange={(e) =>
                          setManualForm({ ...manualForm, status: e.target.value as any })
                        }
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 outline-none focus:border-primary dark:border-white/10 dark:bg-white/[0.04]"
                      >
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="CONVERTED">CONVERTED</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block font-medium text-gray-500">
                      Counselor Notes / Reason
                    </label>
                    <textarea
                      rows={2}
                      value={manualForm.reason}
                      onChange={(e) => setManualForm({ ...manualForm, reason: e.target.value })}
                      placeholder="Notes from walk-in or telephone conversation..."
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 outline-none focus:border-primary dark:border-white/10 dark:bg-white/[0.04]"
                    />
                  </div>
                </div>

                <div className="flex shrink-0 items-center justify-end gap-2 border-t border-gray-100 px-5 py-3.5 dark:border-white/[0.06] sm:px-6">
                  <button
                    type="button"
                    onClick={() => setIsManualModalOpen(false)}
                    className="rounded-xl bg-gray-100 px-4 py-2 text-xs font-medium text-gray-700 dark:bg-white/[0.05] dark:text-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="rounded-xl bg-[#AD0819] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#8F0614] disabled:opacity-50"
                  >
                    {createMutation.isPending ? 'Saving...' : 'Add Lead'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteId && (
        <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-black/60 backdrop-blur-sm print:hidden">
          <div className="flex min-h-full items-center justify-center p-3 py-6 sm:p-4 sm:py-8">
            <div className="w-full max-w-sm rounded-3xl border border-gray-200 bg-white p-5 text-center shadow-2xl dark:border-white/10 dark:bg-[#18181b] sm:p-6">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/40">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Delete Lead Record?
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                Are you sure you want to delete this lead? This action cannot be reversed.
              </p>
              <div className="mt-5 flex justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteId(null)}
                  className="rounded-xl bg-gray-100 px-4 py-2 text-xs font-medium text-gray-700 dark:bg-white/[0.05] dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => deleteMutation.mutate({ id: deleteId })}
                  disabled={deleteMutation.isPending}
                  className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {deleteMutation.isPending ? 'Deleting...' : 'Delete Permanently'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
