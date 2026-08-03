'use client'

import { useState } from 'react'
import { Search, ArrowUpDown, MoreHorizontal, AlertTriangle, Filter, SlidersHorizontal } from 'lucide-react'
import { SABadge } from '@/components/super-admin/shared/SABadge'
import { SAButton } from '@/components/super-admin/shared/SAButton'
import { SAInput } from '@/components/super-admin/shared/SAInput'
import { SATooltip } from '@/components/super-admin/shared/SATooltip'
import { cn } from '@/lib/utils'

// --- Mock data ---
interface Branch {
  id: string
  code: string
  name: string
  country: string
  city: string
  status: 'active' | 'inactive' | 'warning'
  counselors: number
  applications: number
  conversion: number
  revenue: number
  lastActive: string
}

const mockBranches: Branch[] = [
  { id: '1', code: 'DAC-01', name: 'Dhaka Main', country: 'Bangladesh', city: 'Dhaka', status: 'active', counselors: 12, applications: 842, conversion: 68.5, revenue: 245000, lastActive: '2 min ago' },
  { id: '2', code: 'SYD-01', name: 'Sydney Central', country: 'Australia', city: 'Sydney', status: 'active', counselors: 8, applications: 421, conversion: 72.1, revenue: 315000, lastActive: '5 min ago' },
  { id: '3', code: 'SEL-01', name: 'Seoul Gangnam', country: 'South Korea', city: 'Seoul', status: 'active', counselors: 15, applications: 689, conversion: 74.3, revenue: 198000, lastActive: 'Just now' },
  { id: '4', code: 'DXB-01', name: 'Dubai Marina', country: 'UAE', city: 'Dubai', status: 'warning', counselors: 5, applications: 198, conversion: 52.0, revenue: 87000, lastActive: '1 hour ago' },
  { id: '5', code: 'LON-01', name: 'London Central', country: 'United Kingdom', city: 'London', status: 'active', counselors: 10, applications: 534, conversion: 69.8, revenue: 290000, lastActive: '12 min ago' },
  { id: '6', code: 'KUL-01', name: 'Kuala Lumpur CC', country: 'Malaysia', city: 'Kuala Lumpur', status: 'active', counselors: 6, applications: 312, conversion: 65.2, revenue: 156000, lastActive: '30 min ago' },
  { id: '7', code: 'DAC-02', name: 'Chattogram Branch', country: 'Bangladesh', city: 'Chattogram', status: 'inactive', counselors: 3, applications: 87, conversion: 44.8, revenue: 32000, lastActive: '3 days ago' },
  { id: '8', code: 'JKT-01', name: 'Jakarta Pusat', country: 'Indonesia', city: 'Jakarta', status: 'active', counselors: 7, applications: 276, conversion: 61.9, revenue: 112000, lastActive: '45 min ago' },
  { id: '9', code: 'DEL-01', name: 'Delhi NCR', country: 'India', city: 'New Delhi', status: 'active', counselors: 9, applications: 428, conversion: 58.2, revenue: 185000, lastActive: '8 min ago' },
  { id: '10', code: 'NBO-01', name: 'Nairobi Hub', country: 'Kenya', city: 'Nairobi', status: 'warning', counselors: 4, applications: 156, conversion: 47.3, revenue: 54000, lastActive: '2 hours ago' },
]

// --- States ---
interface TableSkeletonProps {
  rows?: number
  cols?: number
}

function TableSkeleton({ rows = 8, cols = 8 }: TableSkeletonProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="px-4 py-3 text-left">
                <div
                  className="h-3 w-16 rounded animate-pulse"
                  style={{ background: 'rgba(136, 144, 168, 0.08)' }}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r}>
              {Array.from({ length: cols }).map((_, c) => (
                <td key={c} className="px-4 py-2.5">
                  <div
                    className="h-3 rounded animate-pulse"
                    style={{
                      width: `${40 + Math.random() * 80}px`,
                      background: 'rgba(136, 144, 168, 0.06)',
                    }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div
        className="flex h-14 w-14 items-center justify-center rounded-full"
        style={{ background: 'rgba(136, 144, 168, 0.04)' }}
      >
        <Filter size={24} style={{ color: '#8890A8' }} />
      </div>
      <h3
        className="mt-4 text-[15px] font-semibold"
        style={{ color: '#E8EAF2', fontFamily: "'Space Grotesk', sans-serif" }}
      >
        No branches found
      </h3>
      <p className="mt-1 text-[13px] text-center max-w-xs" style={{ color: '#8890A8' }}>
        Try adjusting your search or filters to find what you&apos;re looking for.
      </p>
      <SAButton variant="secondary" size="sm" className="mt-4">
        <SlidersHorizontal size={13} />
        Clear Filters
      </SAButton>
    </div>
  )
}

function ErrorState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div
        className="flex h-14 w-14 items-center justify-center rounded-full"
        style={{ background: 'rgba(240, 98, 91, 0.06)' }}
      >
        <AlertTriangle size={24} style={{ color: '#F0625B' }} />
      </div>
      <h3
        className="mt-4 text-[15px] font-semibold"
        style={{ color: '#E8EAF2', fontFamily: "'Space Grotesk', sans-serif" }}
      >
        Failed to load branches
      </h3>
      <p className="mt-1 text-[13px] text-center max-w-xs" style={{ color: '#8890A8' }}>
        There was a problem connecting to the server. Please try again.
      </p>
      <SAButton variant="primary" size="sm" className="mt-4" onClick={() => window.location.reload()}>
        Retry
      </SAButton>
    </div>
  )
}

// --- Table ---
interface BranchesTableProps {
  data?: Branch[]
  loading?: boolean
  error?: boolean
}

export function BranchesTable({ data = mockBranches, loading = false, error = false }: BranchesTableProps) {
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState<keyof Branch | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const filtered = data.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.code.toLowerCase().includes(search.toLowerCase()) ||
      b.country.toLowerCase().includes(search.toLowerCase()) ||
      b.city.toLowerCase().includes(search.toLowerCase())
  )

  const sorted = [...filtered].sort((a, b) => {
    if (!sortField) return 0
    const aVal = a[sortField]
    const bVal = b[sortField]
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal
    }
    return sortDir === 'asc'
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal))
  })

  const handleSort = (field: keyof Branch) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  if (error) {
    return (
      <div
        className="overflow-hidden rounded-xl border"
        style={{ background: '#161B2E', borderColor: '#262C42' }}
      >
        <ErrorState />
      </div>
    )
  }

  return (
    <div
      className="overflow-hidden rounded-xl border"
      style={{ background: '#161B2E', borderColor: '#262C42' }}
    >
      {/* Toolbar */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3"
        style={{ borderColor: '#262C42' }}
      >
        <div className="flex items-center gap-3">
          <h2
            className="text-[15px] font-semibold"
            style={{ color: '#E8EAF2', fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Branches
          </h2>
          <SABadge variant="route">{sorted.length} total</SABadge>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-[220px]">
            <SAInput
              placeholder="Search branches..."
              icon={<Search size={14} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <SATooltip content="Filter columns">
            <SAButton variant="secondary" size="icon" aria-label="Filter columns">
              <SlidersHorizontal size={14} />
            </SAButton>
          </SATooltip>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton />
      ) : sorted.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                className="sticky top-0 z-10"
                style={{ background: '#161B2E' }}
              >
                {[
                  { label: 'Code', field: 'code' as keyof Branch, numeric: false },
                  { label: 'Branch Name', field: 'name' as keyof Branch, numeric: false },
                  { label: 'Country', field: 'country' as keyof Branch, numeric: false },
                  { label: 'City', field: 'city' as keyof Branch, numeric: false },
                  { label: 'Status', field: 'status' as keyof Branch, numeric: false },
                  { label: 'Counselors', field: 'counselors' as keyof Branch, numeric: true },
                  { label: 'Applications', field: 'applications' as keyof Branch, numeric: true },
                  { label: 'Conversion', field: 'conversion' as keyof Branch, numeric: true },
                  { label: 'Revenue', field: 'revenue' as keyof Branch, numeric: true },
                  { label: '', field: null, numeric: false },
                ].map((col) => (
                  <th
                    key={col.label}
                    className={cn(
                      'px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider',
                      col.numeric && 'text-right'
                    )}
                    style={{ color: '#8890A8' }}
                    onClick={col.field ? () => handleSort(col.field) : undefined}
                  >
                    {col.field ? (
                      <button
                        className="inline-flex items-center gap-1 hover:text-[#E8EAF2] transition-colors uppercase tracking-wider"
                        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px' }}
                      >
                        {col.label}
                        <ArrowUpDown size={10} />
                      </button>
                    ) : (
                      col.label
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="[&_tr]:border-t [&_tr]:border-[#262C42]/30">
              {sorted.map((branch) => {
                const statusVariant =
                  branch.status === 'active'
                    ? 'success'
                    : branch.status === 'warning'
                      ? 'warning'
                      : 'neutral'

                return (
                  <tr
                    key={branch.id}
                    className="group transition-colors hover:bg-[#E8A33D]/[0.04] focus-within:bg-[#E8A33D]/[0.06]"
                    tabIndex={0}
                    onFocus={(e) => {
                      // Visual focus for keyboard navigation
                      e.currentTarget.style.outline = 'none'
                      e.currentTarget.style.boxShadow = 'inset 0 0 0 1px #E8A33D'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.boxShadow = ''
                    }}
                  >
                    <td
                      className="px-3 py-2.5 text-[12px] font-medium"
                      style={{
                        color: '#E8EAF2',
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {branch.code}
                    </td>
                    <td className="px-3 py-2.5 text-[13px] font-medium" style={{ color: '#E8EAF2' }}>
                      {branch.name}
                    </td>
                    <td className="px-3 py-2.5 text-[13px]" style={{ color: '#8890A8' }}>
                      {branch.country}
                    </td>
                    <td className="px-3 py-2.5 text-[13px]" style={{ color: '#8890A8' }}>
                      {branch.city}
                    </td>
                    <td className="px-3 py-2.5">
                      <SABadge variant={statusVariant as 'success' | 'warning' | 'neutral'} dot>
                        {branch.status}
                      </SABadge>
                    </td>
                    <td
                      className="px-3 py-2.5 text-right text-[13px]"
                      style={{
                        color: '#E8EAF2',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {branch.counselors}
                    </td>
                    <td
                      className="px-3 py-2.5 text-right text-[13px]"
                      style={{
                        color: '#E8EAF2',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {branch.applications.toLocaleString()}
                    </td>
                    <td
                      className="px-3 py-2.5 text-right text-[13px]"
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontVariantNumeric: 'tabular-nums',
                        color: branch.conversion >= 65 ? '#4FD1A5' : '#E8A33D',
                      }}
                    >
                      {branch.conversion.toFixed(1)}%
                    </td>
                    <td
                      className="px-3 py-2.5 text-right text-[13px]"
                      style={{
                        color: '#E8EAF2',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      ${branch.revenue.toLocaleString()}
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <SATooltip content="More actions">
                        <button
                          className="flex h-7 w-7 items-center justify-center rounded-md opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 hover:bg-white/[0.06]"
                          style={{ color: '#8890A8' }}
                          aria-label="More actions"
                        >
                          <MoreHorizontal size={15} />
                        </button>
                      </SATooltip>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && sorted.length > 0 && (
        <div
          className="flex items-center justify-between border-t px-4 py-2.5"
          style={{ borderColor: '#262C42' }}
        >
          <span className="text-[12px]" style={{ color: '#8890A8' }}>
            Showing <span style={{ color: '#E8EAF2', fontFamily: "'JetBrains Mono', monospace" }}>1</span>–{''}
            <span style={{ color: '#E8EAF2', fontFamily: "'JetBrains Mono', monospace" }}>{sorted.length}</span> of{' '}
            <span style={{ color: '#E8EAF2', fontFamily: "'JetBrains Mono', monospace" }}>{sorted.length}</span>
          </span>
          <div className="flex items-center gap-1">
            <SAButton variant="secondary" size="sm" disabled>
              Previous
            </SAButton>
            <SAButton variant="secondary" size="sm">
              Next
            </SAButton>
          </div>
        </div>
      )}
    </div>
  )
}
