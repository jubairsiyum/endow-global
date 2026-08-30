'use client'

import { useState, useMemo } from 'react'
import { MODULES, type Permission } from '@/lib/rbac'
import { Search, Eye, ShieldCheck, ShieldOff, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const GROUP_ORDER = ['Core', 'People', 'Workflow', 'Catalog', 'Content', 'Communication', 'Insights', 'System'] as const

type Level = 'none' | 'view' | 'manage'

const MODULE_DESCRIPTIONS: Record<string, string> = {
  dashboard: 'Overview & stats',
  students: 'Student profiles & records',
  counselors: 'Counselor accounts',
  applications: 'Course applications',
  documents: 'Student documents',
  deadlines: 'Important dates',
  universities: 'University catalog',
  courses: 'Course catalog',
  scholarships: 'Scholarships',
  countries: 'Country catalog',
  messages: 'Student–counselor chats',
  resources: 'Blogs & file uploads',
  analytics: 'Platform analytics',
  testimonials: 'Student stories',
  notifications: 'System notifications',
  newsletters: 'Email subscribers',
  settings: 'Platform settings',
  branches: 'Branch offices',
  users: 'All user accounts',
  admins: 'Admin management',
  activity: 'Audit & activity logs',
  revenue: 'Revenue & payments',
}

function groupModules() {
  const map = new Map<string, typeof MODULES[number][]>()
  for (const m of MODULES) {
    const g = (m as any).group ?? 'Other'
    if (!map.has(g)) map.set(g, [])
    map.get(g)!.push(m)
  }
  return Array.from(map.entries()).sort((a, b) => {
    const ia = GROUP_ORDER.indexOf(a[0] as any)
    const ib = GROUP_ORDER.indexOf(b[0] as any)
    if (ia === -1 && ib === -1) return a[0].localeCompare(b[0])
    if (ia === -1) return 1
    if (ib === -1) return -1
    return ia - ib
  })
}

function getLevel(value: string[], modId: string): Level {
  const hasManage = value.includes(`${modId}:manage`)
  const hasView = value.includes(`${modId}:view`)
  if (hasManage) return 'manage'
  if (hasView) return 'view'
  return 'none'
}

function setLevel(value: string[], modId: string, level: Level): string[] {
  const view = `${modId}:view` as Permission
  const manage = `${modId}:manage` as Permission
  const without = value.filter((v) => v !== view && v !== manage)
  if (level === 'none') return without
  if (level === 'view') return [...without, view]
  return [...without, view, manage] // manage includes view for storage
}

export function PermissionEditor({
  value,
  onChange,
  disabled,
}: {
  value: string[]
  onChange: (next: string[]) => void
  disabled?: boolean
}) {
  const [search, setSearch] = useState('')
  const groups = groupModules()

  const filteredGroups = useMemo(() => {
    if (!search.trim()) return groups
    const q = search.toLowerCase()
    return groups
      .map(([g, mods]) => [g, mods.filter((m) => m.label.toLowerCase().includes(q) || m.id.toLowerCase().includes(q) || (MODULE_DESCRIPTIONS[m.id] ?? '').toLowerCase().includes(q))] as const)
      .filter(([, mods]) => mods.length > 0) as typeof groups
  }, [groups, search])

  const counts = useMemo(() => {
    let view = 0, manage = 0, none = 0
    for (const m of MODULES) {
      const l = getLevel(value, m.id)
      if (l === 'manage') manage++
      else if (l === 'view') view++
      else none++
    }
    return { view, manage, none, total: MODULES.length }
  }, [value])

  const setGroupLevel = (mods: typeof MODULES[number][], level: Level) => {
    let next = [...value]
    for (const m of mods) next = setLevel(next, m.id, level)
    onChange(Array.from(new Set(next)))
  }

  const setAll = (level: Level) => {
    if (level === 'none') { onChange([]); return }
    let next: string[] = []
    for (const m of MODULES) next = setLevel(next, m.id, level)
    onChange(Array.from(new Set(next)))
  }

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-[#f8fafc] px-3 py-2" style={{ borderColor: '#e5e7eb' }}>
        <div className="flex flex-wrap gap-1.5 text-[11px]">
          <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 font-medium" style={{ color: '#E8A33D', border: '1px solid #fde68a' }}>
            <ShieldCheck size={12} /> {counts.manage} Full access
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 font-medium" style={{ color: '#2563eb', border: '1px solid #bfdbfe' }}>
            <Eye size={12} /> {counts.view} View only
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 font-medium" style={{ color: '#6b7280', border: '1px solid #e5e7eb' }}>
            <ShieldOff size={12} /> {counts.none} No access
          </span>
        </div>
        <div className="flex gap-1">
          <button type="button" onClick={() => setAll('none')} disabled={disabled} className="rounded-md px-2 py-1 text-[11px] font-medium hover:bg-white" style={{ color: '#6b7280', border: '1px solid #e5e7eb' }}>Clear</button>
          <button type="button" onClick={() => setAll('view')} disabled={disabled} className="rounded-md px-2 py-1 text-[11px] font-medium hover:bg-white" style={{ color: '#2563eb', border: '1px solid #bfdbfe' }}>View all</button>
          <button type="button" onClick={() => setAll('manage')} disabled={disabled} className="rounded-md bg-[#E8A33D] px-2 py-1 text-[11px] font-medium text-white hover:bg-[#c48b2e]">Full access all</button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: '#9ca3af' }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search modules (e.g. Resources, Students…)"
          className="w-full rounded-lg border py-2 pl-8 pr-3 text-[13px] outline-none placeholder:text-gray-400 focus:border-[#E8A33D] focus:ring-1 focus:ring-[#E8A33D]/20"
          style={{ borderColor: '#e5e7eb' }}
        />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 rounded-md border border-dashed bg-white px-3 py-2 text-[11px]" style={{ borderColor: '#e5e7eb' }}>
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: '#9ca3af' }} /> No access — hidden from menu</span>
        <span className="inline-flex items-center gap-1.5"><Eye size={11} style={{ color: '#2563eb' }} /> View — can see & search</span>
        <span className="inline-flex items-center gap-1.5"><ShieldCheck size={11} style={{ color: '#E8A33D' }} /> Manage — view + create / edit / delete</span>
      </div>

      {/* Groups */}
      <div className="space-y-5">
        {filteredGroups.map(([group, mods]) => {
          const groupViewCount = mods.filter((m) => getLevel(value, m.id) === 'view').length
          const groupManageCount = mods.filter((m) => getLevel(value, m.id) === 'manage').length
          return (
            <div key={group}>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#111827' }}>{group}</h4>
                  <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium" style={{ color: '#6b7280' }}>{mods.length}</span>
                  {(groupManageCount > 0 || groupViewCount > 0) && (
                    <span className="text-[10px]" style={{ color: '#6b7280' }}>
                      · {groupManageCount ? `${groupManageCount} manage` : ''} {groupManageCount && groupViewCount ? '·' : ''} {groupViewCount ? `${groupViewCount} view` : ''}
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  <button type="button" onClick={() => setGroupLevel(mods as any, 'none')} disabled={disabled} className="rounded px-1.5 py-0.5 text-[10px] font-medium hover:bg-gray-50" style={{ color: '#6b7280' }}>None</button>
                  <button type="button" onClick={() => setGroupLevel(mods as any, 'view')} disabled={disabled} className="rounded px-1.5 py-0.5 text-[10px] font-medium hover:bg-blue-50" style={{ color: '#2563eb' }}>View all</button>
                  <button type="button" onClick={() => setGroupLevel(mods as any, 'manage')} disabled={disabled} className="rounded px-1.5 py-0.5 text-[10px] font-medium hover:bg-amber-50" style={{ color: '#d97706' }}>Manage all</button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {mods.map((m) => {
                  const level = getLevel(value, m.id)
                  return (
                    <div
                      key={m.id}
                      className={cn(
                        'flex flex-col gap-2 rounded-xl border p-3 transition-colors sm:flex-row sm:items-center sm:justify-between',
                        level === 'none' ? 'bg-white' : level === 'view' ? 'bg-blue-50/40' : 'bg-amber-50/40'
                      )}
                      style={{ borderColor: level === 'none' ? '#e5e7eb' : level === 'view' ? '#bfdbfe' : '#fde68a' }}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-semibold" style={{ color: '#111827' }}>{m.label}</span>
                          {level === 'view' && <span className="inline-flex items-center gap-0.5 rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold" style={{ color: '#2563eb' }}><Eye size={10} /> View</span>}
                          {level === 'manage' && <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold" style={{ color: '#92400e' }}><ShieldCheck size={10} /> Manage</span>}
                          {level === 'none' && <span className="inline-flex items-center gap-0.5 rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold" style={{ color: '#6b7280' }}><ShieldOff size={10} /> None</span>}
                        </div>
                        <p className="mt-0.5 text-[11px]" style={{ color: '#6b7280' }}>{MODULE_DESCRIPTIONS[m.id] ?? m.id}</p>
                        <p className="mt-0.5 hidden text-[10px] sm:block" style={{ color: '#9ca3af', fontFamily: "'JetBrains Mono', monospace" }}>{m.id}:view / {m.id}:manage</p>
                      </div>

                      {/* Segmented control */}
                      <div
                        role="group"
                        aria-label={`${m.label} permission`}
                        className="flex shrink-0 overflow-hidden rounded-full border bg-white p-0.5"
                        style={{ borderColor: '#e5e7eb' }}
                      >
                        {(['none', 'view', 'manage'] as Level[]).map((lvl) => {
                          const active = level === lvl
                          const label = lvl === 'none' ? 'No access' : lvl === 'view' ? 'View' : 'Manage'
                          const Icon = lvl === 'none' ? ShieldOff : lvl === 'view' ? Eye : ShieldCheck
                          return (
                            <button
                              key={lvl}
                              type="button"
                              role="radio"
                              aria-checked={active}
                              aria-label={`${m.label} ${label}`}
                              onClick={() => {
                                const next = setLevel(value, m.id, lvl)
                                onChange(next)
                              }}
                              disabled={disabled}
                              className={cn(
                                'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors',
                                active
                                  ? lvl === 'none'
                                    ? 'bg-gray-900 text-white shadow-sm'
                                    : lvl === 'view'
                                      ? 'bg-blue-600 text-white shadow-sm'
                                      : 'bg-[#E8A33D] text-white shadow-sm'
                                  : 'text-gray-500 hover:bg-gray-50'
                              )}
                            >
                              <Icon size={11} />
                              {label}
                              {active && <Check size={11} className="opacity-80" />}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
        {filteredGroups.length === 0 && (
          <div className="rounded-lg border border-dashed bg-white py-8 text-center text-[13px]" style={{ borderColor: '#e5e7eb', color: '#6b7280' }}>
            No modules match “{search}”
          </div>
        )}
      </div>
    </div>
  )
}
