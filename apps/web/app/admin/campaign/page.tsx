'use client'

import React, { useState, useMemo } from 'react'
import AdminTable from '@/components/ui/AdminTable'
import PageHeader from '@/components/ui/PageHeader'
import { trpc } from '@/lib/trpc-client'
import {
  QrCode,
  Search,
  Filter,
  Download,
  Printer,
  Calendar,
  Eye,
  Trash2,
  CheckCircle,
  Clock,
  UserCheck,
  AlertTriangle,
  X,
  Plus,
  RefreshCw,
  ExternalLink,
  Phone,
  Mail,
  Copy,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  FileSpreadsheet,
  FileText,
} from 'lucide-react'

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

export default function AdminCampaignPage() {
  // Filters State
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusType>('ALL')
  const [countryFilter, setCountryFilter] = useState('ALL')
  const [datePreset, setDatePreset] = useState<'ALL' | 'TODAY' | 'YESTERDAY' | '7DAYS' | '30DAYS' | 'THIS_MONTH' | 'CUSTOM'>('ALL')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [page, setPage] = useState(1)
  const limit = 25

  // Modals
  const [selectedLead, setSelectedLead] = useState<any | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isManualModalOpen, setIsManualModalOpen] = useState(false)
  const [manualForm, setManualForm] = useState<ManualLeadForm>(emptyManualForm)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  // Compute active date boundaries based on preset
  const computedDates = useMemo(() => {
    if (datePreset === 'ALL') {
      return { start: undefined, end: undefined }
    }
    const now = new Date()
    const fmt = (d: Date) => d.toISOString().split('T')[0]

    if (datePreset === 'TODAY') {
      const today = fmt(now)
      return { start: today, end: today }
    }

    if (datePreset === 'YESTERDAY') {
      const y = new Date(now)
      y.setDate(y.getDate() - 1)
      const yStr = fmt(y)
      return { start: yStr, end: yStr }
    }

    if (datePreset === '7DAYS') {
      const past = new Date(now)
      past.setDate(past.getDate() - 7)
      return { start: fmt(past), end: fmt(now) }
    }

    if (datePreset === '30DAYS') {
      const past = new Date(now)
      past.setDate(past.getDate() - 30)
      return { start: fmt(past), end: fmt(now) }
    }

    if (datePreset === 'THIS_MONTH') {
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
      return { start: fmt(start), end: fmt(now) }
    }

    if (datePreset === 'CUSTOM') {
      return {
        start: startDate || undefined,
        end: endDate || undefined,
      }
    }

    return { start: undefined, end: undefined }
  }, [datePreset, startDate, endDate])

  const utils = trpc.useUtils()

  // Queries
  const { data: listData, isLoading, refetch } = trpc.campaign.list.useQuery({
    search: search.trim() || undefined,
    status: statusFilter,
    country: countryFilter !== 'ALL' ? countryFilter : undefined,
    startDate: computedDates.start,
    endDate: computedDates.end,
    page,
    limit,
  })

  const { data: statsData } = trpc.campaign.stats.useQuery({
    startDate: computedDates.start,
    endDate: computedDates.end,
  })

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
      search: search.trim() || undefined,
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

  return (
    <div className="space-y-6 print:m-0 print:p-0">
      {/* Printable Report Header (visible only when printing) */}
      <div className="hidden print:block mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold">Endow Global Education — Campaign Leads Audit</h1>
        <p className="text-sm text-gray-600">
          Generated on {new Date().toLocaleString()} • Date Filter: {datePreset} ({computedDates.start || 'Start'} to {computedDates.end || 'Now'})
        </p>
      </div>

      {/* Screen Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <PageHeader
          title="Campaign Leads"
          description="Manage QR code campaign inquiries, progressive drop-offs, and export lead data."
        />

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setIsManualModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Lead</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#18181b] border border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-200 text-xs font-medium hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-all"
            title="Download CSV file (compatible with Excel & Google Sheets)"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-green-600" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={handleExportExcel}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#18181b] border border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-200 text-xs font-medium hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-all"
            title="Download styled Excel file (.xls)"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Export Excel</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#18181b] border border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-200 text-xs font-medium hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-all"
            title="Print printable summary table"
          >
            <Printer className="w-3.5 h-3.5 text-gray-500" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 print:hidden">
        <div className="rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#18181b] p-4 shadow-sm">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Leads</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {statsData?.total ?? 0}
          </p>
          <span className="text-[11px] text-gray-400 mt-0.5 block">All QR & Campaign entries</span>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#18181b] p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Completed</p>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-50 dark:bg-green-950/60 text-green-600 dark:text-green-400">
              {statsData?.completionRate ?? 0}%
            </span>
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
            {statsData?.completed ?? 0}
          </p>
          <span className="text-[11px] text-gray-400 mt-0.5 block">All 6 steps finished</span>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#18181b] p-4 shadow-sm">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Partial Drop-offs</p>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
            {statsData?.partial ?? 0}
          </p>
          <span className="text-[11px] text-gray-400 mt-0.5 block">Saved before step 6</span>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#18181b] p-4 shadow-sm">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Today's Leads</p>
          <p className="text-2xl font-bold text-primary mt-1">
            {statsData?.todayCount ?? 0}
          </p>
          <span className="text-[11px] text-gray-400 mt-0.5 block">Submissions today</span>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#18181b] p-4 shadow-sm">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Converted / Contacted</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
            {(statsData?.contacted ?? 0) + (statsData?.converted ?? 0)}
          </p>
          <span className="text-[11px] text-gray-400 mt-0.5 block">Followed up by staff</span>
        </div>
      </div>

      {/* Filter and Date Bar */}
      <div className="rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#18181b] p-4.5 shadow-sm space-y-3.5 print:hidden">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          {/* Search Field */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="Search by name, email, phone, program, country..."
              className="w-full bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as StatusType)
                setPage(1)
              }}
              className="bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm font-medium text-gray-900 dark:text-white outline-none focus:border-primary"
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
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap">Country:</span>
            <select
              value={countryFilter}
              onChange={(e) => {
                setCountryFilter(e.target.value)
                setPage(1)
              }}
              className="bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm font-medium text-gray-900 dark:text-white outline-none focus:border-primary"
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

          <button
            type="button"
            onClick={() => refetch()}
            className="p-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors"
            title="Refresh leads"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Date Filter Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 dark:border-white/[0.05]">
          <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
            <Calendar className="w-4 h-4" /> Date Filter:
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
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                datePreset === preset.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-white/[0.05] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'
              }`}
            >
              {preset.label}
            </button>
          ))}

          {/* Custom Date Pickers */}
          {datePreset === 'CUSTOM' && (
            <div className="flex items-center gap-2 ml-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value)
                  setPage(1)
                }}
                className="bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-xl px-2.5 py-1 text-xs sm:text-sm text-gray-800 dark:text-gray-200"
              />
              <span className="text-xs sm:text-sm text-gray-400">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value)
                  setPage(1)
                }}
                className="bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-xl px-2.5 py-1 text-xs sm:text-sm text-gray-800 dark:text-gray-200"
              />
            </div>
          )}
        </div>
      </div>

      {/* Leads Table */}
      <AdminTable>
        <div className="px-6 py-4.5 border-b border-gray-100 dark:border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#18181b]">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white font-display">
              Campaign Leads Records
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Real-time student submissions from QR codes and online campaigns
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-white/[0.06] text-xs sm:text-sm font-semibold font-mono text-gray-700 dark:text-gray-200">
              Total: {totalCount} leads
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm sm:text-base">
            <thead className="bg-gray-50 dark:bg-white/[0.03] text-gray-700 dark:text-gray-200 uppercase font-mono text-xs sm:text-sm tracking-wider border-b border-gray-200 dark:border-white/[0.08]">
              <tr>
                <th className="px-4 py-4 font-bold text-center w-14">#</th>
                <th className="px-5 py-4 font-bold">Candidate</th>
                <th className="px-5 py-4 font-bold">Contact</th>
                <th className="px-5 py-4 font-bold">Target / Program</th>
                <th className="px-4 py-4 font-bold">Intake</th>
                <th className="px-4 py-4 font-bold">Progress</th>
                <th className="px-5 py-4 font-bold">Status</th>
                <th className="px-5 py-4 font-bold text-right print:hidden">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/[0.06] text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-400 text-sm">
                    <div className="flex items-center justify-center gap-2.5">
                      <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span className="font-medium text-base">Loading campaign leads...</span>
                    </div>
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-14 text-center text-gray-400">
                    <QrCode className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2 opacity-60" />
                    <p className="text-base font-bold text-gray-700 dark:text-gray-300">No campaign leads found</p>
                    <p className="text-sm text-gray-400 mt-1">Try clearing filters or date restrictions.</p>
                  </td>
                </tr>
              ) : (
                leads.map((lead, idx) => {
                  const isCompleted = lead.completedStep === 6 || lead.status === 'COMPLETED'
                  const serial = (page - 1) * limit + idx + 1
                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-gray-50/80 dark:hover:bg-white/[0.02] transition-colors"
                    >
                      {/* Serial Number */}
                      <td className="px-4 py-4 text-center font-mono font-bold text-sm sm:text-base text-gray-600 dark:text-gray-400">
                        {serial}
                      </td>

                      {/* Candidate Column */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500/20 to-primary/20 border border-red-500/30 flex items-center justify-center font-bold text-primary shrink-0 text-sm">
                            {lead.name ? lead.name.charAt(0).toUpperCase() : '?'}
                          </div>
                          <div>
                            <p className="font-bold text-sm sm:text-base text-gray-900 dark:text-white leading-snug">
                              {lead.name || 'Unnamed Lead'}
                            </p>
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                              {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : ''}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact Column */}
                      <td className="px-5 py-4">
                        <div className="space-y-1">
                          {lead.email ? (
                            <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200 text-xs sm:text-sm font-medium">
                              <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                              <span className="truncate max-w-[200px]">{lead.email}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 italic">No email</span>
                          )}

                          {lead.phone ? (
                            <div className="flex items-center gap-2 font-mono text-gray-800 dark:text-gray-200 text-xs sm:text-sm font-semibold">
                              <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                              <span>{lead.phone}</span>
                              <a
                                href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-500 hover:text-emerald-600 ml-1 print:hidden"
                                title="Open WhatsApp chat"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 italic">No phone</span>
                          )}
                        </div>
                      </td>

                      {/* Destination & Program */}
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-bold text-sm sm:text-base text-gray-900 dark:text-gray-100">
                            {lead.interestedCountry || 'Not selected'}
                          </p>
                          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 block mt-0.5">
                            {lead.interestedProgram || 'Program pending'}
                          </span>
                        </div>
                      </td>

                      {/* Intake Year */}
                      <td className="px-4 py-4">
                        <span className="font-mono font-semibold text-xs sm:text-sm text-gray-800 dark:text-gray-200">
                          {lead.intakeYear || '—'}
                        </span>
                      </td>

                      {/* Progress Badge */}
                      <td className="px-4 py-4">
                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 dark:bg-green-950/60 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Step 6 (Done)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Step {lead.completedStep}/6 (Partial)</span>
                          </span>
                        )}
                      </td>

                      {/* Status Dropdown */}
                      <td className="px-5 py-4">
                        <select
                          value={lead.status}
                          onChange={(e) => {
                            updateStatusMutation.mutate({
                              id: lead.id,
                              status: e.target.value as any,
                            })
                          }}
                          className={`text-xs sm:text-sm font-bold rounded-xl px-2.5 py-1.5 border outline-none cursor-pointer transition-colors ${
                            lead.status === 'COMPLETED'
                              ? 'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800'
                              : lead.status === 'CONTACTED'
                              ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                              : lead.status === 'CONVERTED'
                              ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                              : lead.status === 'ARCHIVED'
                              ? 'bg-gray-100 dark:bg-white/[0.05] text-gray-500 border-gray-200 dark:border-white/10'
                              : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                          }`}
                        >
                          <option value="PARTIAL">PARTIAL</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CONTACTED">CONTACTED</option>
                          <option value="CONVERTED">CONVERTED</option>
                          <option value="ARCHIVED">ARCHIVED</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right print:hidden">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedLead(lead)}
                            className="p-2 rounded-xl text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.08] transition-colors"
                            title="View lead details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteId(lead.id)}
                            className="p-2 rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                            title="Delete lead"
                          >
                            <Trash2 className="w-4 h-4" />
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
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 dark:border-white/[0.06] flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 print:hidden">
            <span>
              Showing page <strong className="text-gray-900 dark:text-white">{page}</strong> of <strong className="text-gray-900 dark:text-white">{totalPages}</strong> ({totalCount} total leads)
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-2 rounded-xl border border-gray-200 dark:border-white/10 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-white/[0.04]"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-2 rounded-xl border border-gray-200 dark:border-white/10 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-white/[0.04]"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </AdminTable>

      {/* LEAD DETAILS MODAL */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:hidden">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#18181b] border border-gray-200 dark:border-white/10 p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedLead(null)}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.08]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-lg">
                {selectedLead.name ? selectedLead.name.charAt(0).toUpperCase() : '?'}
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight">
                  {selectedLead.name || 'Unnamed Lead'}
                </h3>
                <span className="text-xs text-gray-400 font-mono">
                  ID: {selectedLead.id}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.06]">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-mono">Email</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                      {selectedLead.email || 'None'}
                    </span>
                    {selectedLead.email && (
                      <button
                        type="button"
                        onClick={() => handleCopy(selectedLead.email, 'email')}
                        className="text-gray-400 hover:text-primary"
                        title="Copy email"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-mono">Phone</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="font-semibold text-gray-800 dark:text-gray-200 font-mono">
                      {selectedLead.phone || 'None'}
                    </span>
                    {selectedLead.phone && (
                      <button
                        type="button"
                        onClick={() => handleCopy(selectedLead.phone, 'phone')}
                        className="text-gray-400 hover:text-primary"
                        title="Copy phone"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.06]">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-mono">Target Country</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5 block">
                    {selectedLead.interestedCountry || 'Not Selected'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-mono">Degree Program</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5 block">
                    {selectedLead.interestedProgram || 'Not Selected'}
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-gray-400 block text-[10px] uppercase font-mono">Intake Year</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5 block font-mono">
                    {selectedLead.intakeYear || 'Not Selected'}
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-gray-400 block text-[10px] uppercase font-mono">Progress Level</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5 block">
                    Step {selectedLead.completedStep} of 6 ({selectedLead.status})
                  </span>
                </div>
              </div>

              {selectedLead.reason && (
                <div className="p-3 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.06]">
                  <span className="text-gray-400 block text-[10px] uppercase font-mono mb-1">
                    Why they want to go / Personal Note
                  </span>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
                    "{selectedLead.reason}"
                  </p>
                </div>
              )}

              {/* Technical / Campaign Metadata */}
              <div className="p-3 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.06] text-[11px] text-gray-500 font-mono space-y-1">
                <div className="flex justify-between">
                  <span>Source:</span>
                  <span className="text-gray-700 dark:text-gray-300">{selectedLead.utmSource || 'qr-campaign'}</span>
                </div>
                {selectedLead.utmCampaign && (
                  <div className="flex justify-between">
                    <span>UTM Campaign:</span>
                    <span className="text-gray-700 dark:text-gray-300">{selectedLead.utmCampaign}</span>
                  </div>
                )}
                {selectedLead.ipAddress && (
                  <div className="flex justify-between">
                    <span>IP Address:</span>
                    <span className="text-gray-700 dark:text-gray-300">{selectedLead.ipAddress}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Created:</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {selectedLead.createdAt ? new Date(selectedLead.createdAt).toLocaleString() : ''}
                  </span>
                </div>
              </div>
            </div>

            {copiedField && (
              <div className="mt-2 text-center text-xs text-green-600 font-medium">
                Copied {copiedField} to clipboard!
              </div>
            )}

            {/* Quick Action Footer */}
            <div className="mt-5 pt-3 border-t border-gray-100 dark:border-white/[0.06] flex items-center justify-end gap-2">
              {selectedLead.phone && (
                <a
                  href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              )}
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/[0.05] text-gray-700 dark:text-gray-300 text-xs font-medium hover:bg-gray-200 dark:hover:bg-white/10"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MANUAL LEAD CREATION MODAL */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:hidden">
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-[#18181b] border border-gray-200 dark:border-white/10 p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setIsManualModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
              Add Campaign Lead Manually
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                createMutation.mutate(manualForm)
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-gray-500 mb-1 font-medium">Candidate Name *</label>
                <input
                  type="text"
                  required
                  value={manualForm.name}
                  onChange={(e) => setManualForm({ ...manualForm, name: e.target.value })}
                  placeholder="Full name"
                  className="w-full bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-500 mb-1 font-medium">Email</label>
                  <input
                    type="email"
                    value={manualForm.email}
                    onChange={(e) => setManualForm({ ...manualForm, email: e.target.value })}
                    placeholder="email@example.com"
                    className="w-full bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1 font-medium">Phone</label>
                  <input
                    type="tel"
                    value={manualForm.phone}
                    onChange={(e) => setManualForm({ ...manualForm, phone: e.target.value })}
                    placeholder="+880..."
                    className="w-full bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-500 mb-1 font-medium">Interested Country</label>
                  <select
                    value={manualForm.interestedCountry}
                    onChange={(e) => setManualForm({ ...manualForm, interestedCountry: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 outline-none focus:border-primary"
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
                  <label className="block text-gray-500 mb-1 font-medium">Program Level</label>
                  <select
                    value={manualForm.interestedProgram}
                    onChange={(e) => setManualForm({ ...manualForm, interestedProgram: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 outline-none focus:border-primary"
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
                  <label className="block text-gray-500 mb-1 font-medium">Intake Year</label>
                  <select
                    value={manualForm.intakeYear}
                    onChange={(e) => setManualForm({ ...manualForm, intakeYear: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 outline-none focus:border-primary"
                  >
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                    <option value="2028">2028</option>
                    <option value="2029 or Later">2029 or Later</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-500 mb-1 font-medium">Status</label>
                  <select
                    value={manualForm.status}
                    onChange={(e) => setManualForm({ ...manualForm, status: e.target.value as any })}
                    className="w-full bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 outline-none focus:border-primary"
                  >
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="CONVERTED">CONVERTED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-500 mb-1 font-medium">Counselor Notes / Reason</label>
                <textarea
                  rows={2}
                  value={manualForm.reason}
                  onChange={(e) => setManualForm({ ...manualForm, reason: e.target.value })}
                  placeholder="Notes from walk-in or telephone conversation..."
                  className="w-full bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-xl p-2.5 outline-none focus:border-primary"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/[0.05] text-gray-700 dark:text-gray-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-4 py-2 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 disabled:opacity-50"
                >
                  {createMutation.isPending ? 'Saving...' : 'Add Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:hidden">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#18181b] border border-gray-200 dark:border-white/10 p-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Delete Lead Record?</h3>
            <p className="text-xs text-gray-500 mt-1">
              Are you sure you want to delete this lead? This action cannot be reversed.
            </p>
            <div className="mt-5 flex justify-center gap-2">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/[0.05] text-gray-700 dark:text-gray-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => deleteMutation.mutate({ id: deleteId })}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

