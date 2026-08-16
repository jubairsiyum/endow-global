'use client'

import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  Search,
  X,
  Check,
  RotateCcw,
  ChevronDown,
  Globe,
  MapPin,
  Building2,
  GraduationCap,
  BookOpen,
  Zap,
  Clock,
  CalendarDays,
  DollarSign,
  FileCheck2,
} from 'lucide-react'
import { FEE_MAX_LIMIT, countActiveFilters } from './filter-utils'
import type { CourseFilters } from './filter-utils'

export type FilterOptions = {
  countries: string[]
  cities: string[]
  institutions: { id: string; name: string }[]
  subjects: string[]
  levels: string[]
  startYears: number[]
  feeMax: number
}

type SelectOption = { value: string; label: string; flag?: string }

const COUNTRY_FLAGS: Record<string, string> = {
  'United Kingdom': '🇬🇧',
  'United States': '🇺🇸',
  Canada: '🇨🇦',
  Australia: '🇦🇺',
  Germany: '🇩🇪',
  'New Zealand': '🇳🇿',
  Ireland: '🇮🇪',
  Netherlands: '🇳🇱',
  France: '🇫🇷',
  Switzerland: '🇨🇭',
  Spain: '🇪🇸',
  'United Arab Emirates': '🇦🇪',
  Poland: '🇵🇱',
  Malta: '🇲🇹',
  Cyprus: '🇨🇾',
  Hungary: '🇭🇺',
  Italy: '🇮🇹',
  Malaysia: '🇲🇾',
  Mauritius: '🇲🇺',
  Singapore: '🇸🇬',
  'South Korea': '🇰🇷',
}

const LEVEL_LABELS: Record<string, string> = {
  FOUNDATION: 'Foundation',
  UNDERGRADUATE: 'Undergraduate',
  POSTGRADUATE: 'Postgraduate',
  PHD: 'Doctorate',
  DIPLOMA: 'Diploma',
  CERTIFICATE: 'Certificate',
}

const LEVEL_ORDER = ['FOUNDATION', 'UNDERGRADUATE', 'POSTGRADUATE', 'PHD', 'DIPLOMA', 'CERTIFICATE']

const DURATION_OPTIONS: { label: string; value: string }[] = [
  { label: 'Less than 1 year', value: 'lt1' },
  { label: '1 - 2 years', value: '1_2' },
  { label: '2 - 3 years', value: '2_3' },
  { label: '3 - 4 years', value: '3_4' },
  { label: '4 - 5 years', value: '4_5' },
  { label: 'More than 5 years', value: 'gt5' },
]

function Section({
  icon,
  title,
  count = 0,
  children,
}: {
  icon: ReactNode
  title: string
  count?: number
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gray-100">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2.5 py-2.5 text-left"
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#C41E3A]/[0.07] text-[#C41E3A]">
          {icon}
        </span>
        <span className={`flex-1 text-[13px] font-semibold ${count > 0 ? 'text-[#C41E3A]' : 'text-gray-800'}`}>
          {title}
        </span>
        {count > 0 && (
          <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#C41E3A] to-[#A01830] px-1.5 text-[10px] font-bold text-white">
            {count}
          </span>
        )}
        <ChevronDown
          size={15}
          className={`shrink-0 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div className={open ? 'pb-3' : 'hidden'}>{children}</div>
    </div>
  )
}

function CheckIndicator({ checked }: { checked: boolean }) {
  return (
    <span
      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
        checked ? 'border-[#C41E3A] bg-gradient-to-br from-[#C41E3A] to-[#A01830]' : 'border-gray-300 bg-white'
      }`}
    >
      {checked && <Check size={12} strokeWidth={3} className="text-white" />}
    </span>
  )
}

function CheckboxRow({
  label,
  checked,
  onChange,
}: {
  label: ReactNode
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-2.5 rounded-md px-1.5 py-1 transition-colors ${
        checked ? 'bg-rose-50' : 'hover:bg-gray-50'
      }`}
    >
      <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <CheckIndicator checked={checked} />
      <span
        className={`min-w-0 flex-1 text-[13px] leading-5 ${checked ? 'font-semibold text-[#C41E3A]' : 'text-gray-700'}`}
      >
        {label}
      </span>
    </label>
  )
}

function ToggleRow({
  icon,
  label,
  description,
  checked,
  onChange,
}: {
  icon: ReactNode
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center gap-2.5 py-2.5 text-left transition-colors hover:bg-gray-50"
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#C41E3A]/[0.07] text-[#C41E3A]">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className={`block text-[13px] font-semibold ${checked ? 'text-[#C41E3A]' : 'text-gray-800'}`}>{label}</span>
        {description && <span className="block text-[11px] leading-4 text-gray-400">{description}</span>}
      </span>
      <span
        aria-hidden="true"
        className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors duration-200 ${
          checked ? 'bg-gradient-to-r from-[#C41E3A] to-[#A01830]' : 'bg-gray-300'
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </span>
    </button>
  )
}

function SearchableMultiSelect({
  label,
  options,
  selected,
  onChange,
  limit,
  placeholder,
}: {
  label: string
  options: SelectOption[]
  selected: string[]
  onChange: (next: string[]) => void
  limit?: number
  placeholder?: string
}) {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return options
    return options.filter((o) => o.label.toLowerCase().includes(q))
  }, [options, search])

  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value))
    } else if (limit === undefined || selected.length < limit) {
      onChange([...selected, value])
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-2.5 py-2 focus-within:border-[#C41E3A] focus-within:ring-1 focus-within:ring-[#C41E3A]/10">
        <Search size={14} className="shrink-0 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={placeholder ?? `Search ${label.toLowerCase()}...`}
          className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
        />
        {search && (
          <button type="button" onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600">
            <X size={14} />
          </button>
        )}
      </div>

      <div className="filter-scroll mt-1.5 max-h-56 space-y-0.5 overflow-y-auto overscroll-contain pr-1">
        {filtered.map((option) => {
          const isSelected = selected.includes(option.value)
          const isDisabled = limit !== undefined && !isSelected && selected.length >= limit
          return (
            <label
              key={option.value}
              className={`flex items-center gap-2.5 rounded-md px-1.5 py-1 transition-colors ${
                isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
              } ${isSelected ? 'bg-rose-50' : 'hover:bg-gray-50'}`}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={isSelected}
                disabled={isDisabled}
                onChange={() => toggle(option.value)}
              />
              <CheckIndicator checked={isSelected} />
              {option.flag && <span className="text-base leading-none">{option.flag}</span>}
              <span
                className={`min-w-0 flex-1 truncate text-[13px] ${
                  isSelected ? 'font-semibold text-[#C41E3A]' : 'text-gray-700'
                }`}
              >
                {option.label}
              </span>
            </label>
          )
        })}
        {filtered.length === 0 && <p className="px-1 py-2 text-sm text-gray-400">No matches found</p>}
      </div>

      {selected.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {selected.map((value) => {
            const option = options.find((o) => o.value === value)
            return (
              <span
                key={value}
                className="inline-flex items-center gap-1 rounded-full bg-[#C41E3A]/10 px-2 py-0.5 text-xs font-medium text-[#C41E3A]"
              >
                {option?.flag && <span>{option.flag}</span>}
                {option?.label ?? value}
                <button type="button" onClick={() => toggle(value)} className="text-[#C41E3A]/60 hover:text-[#C41E3A]">
                  <X size={11} />
                </button>
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function CourseFilters({
  open,
  onClose,
  filters,
  onChange,
  onClear,
  options,
  resultsCount,
}: {
  open: boolean
  onClose: () => void
  filters: CourseFilters
  onChange: (next: CourseFilters) => void
  onClear: () => void
  options: FilterOptions
  resultsCount: number
}) {
  const set = (patch: Partial<CourseFilters>) => onChange({ ...filters, ...patch })

  const feeMax = options.feeMax || FEE_MAX_LIMIT
  const activeCount = countActiveFilters(filters)

  useEffect(() => {
    const lenis = window.__lenis
    if (!lenis) return
    if (open) {
      lenis.stop()
    } else {
      lenis.start()
    }
  }, [open])

  const countryOptions = useMemo<SelectOption[]>(
    () =>
      (options.countries ?? []).map((name) => ({
        value: name,
        label: name,
        flag: COUNTRY_FLAGS[name] ?? '🌍',
      })),
    [options.countries]
  )

  const cityOptions = useMemo<SelectOption[]>(
    () => options.cities.map((c) => ({ value: c, label: c })),
    [options.cities]
  )
  const institutionOptions = useMemo<SelectOption[]>(
    () => options.institutions.map((u) => ({ value: u.id, label: u.name })),
    [options.institutions]
  )
  const subjectOptions = useMemo<SelectOption[]>(
    () => options.subjects.map((s) => ({ value: s, label: s })),
    [options.subjects]
  )

  const levelOptions = useMemo<SelectOption[]>(() => {
    const levels = [...(options.levels ?? [])].sort((a, b) => {
      const ia = LEVEL_ORDER.indexOf(a)
      const ib = LEVEL_ORDER.indexOf(b)
      if (ia === -1 && ib === -1) return a.localeCompare(b)
      if (ia === -1) return 1
      if (ib === -1) return -1
      return ia - ib
    })
    return levels.map((l) => ({ value: l, label: LEVEL_LABELS[l] ?? l }))
  }, [options.levels])

  const startYears = options.startYears ?? []

  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      <div
        data-lenis-prevent
        className={`absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-200 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-gray-900">Filters</h3>
            {activeCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-[#C41E3A] to-[#A01830] px-1.5 text-[11px] font-bold text-white">
                {activeCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close filters"
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto px-4">
          <Section icon={<Globe size={15} />} title="Destination" count={filters.countries.length}>
            <SearchableMultiSelect
              label="Destination"
              options={countryOptions}
              selected={filters.countries}
              onChange={(countries) => set({ countries })}
              placeholder="Search country..."
            />
          </Section>

          <Section icon={<MapPin size={15} />} title="City" count={filters.cities.length}>
            <SearchableMultiSelect
              label="City"
              options={cityOptions}
              selected={filters.cities}
              onChange={(cities) => set({ cities })}
              limit={5}
            />
          </Section>

          <Section icon={<Building2 size={15} />} title="Institution" count={filters.institutionIds.length}>
            <SearchableMultiSelect
              label="Institution"
              options={institutionOptions}
              selected={filters.institutionIds}
              onChange={(institutionIds) => set({ institutionIds })}
              limit={5}
            />
          </Section>

          <Section icon={<GraduationCap size={15} />} title="Study Level" count={filters.levels.length}>
            <div className="grid grid-cols-2 gap-x-3">
              {levelOptions.map((l) => (
                <CheckboxRow
                  key={l.value}
                  checked={filters.levels.includes(l.value)}
                  onChange={(checked) =>
                    set({
                      levels: checked ? [...filters.levels, l.value] : filters.levels.filter((v) => v !== l.value),
                    })
                  }
                  label={l.label}
                />
              ))}
            </div>
            {levelOptions.length === 0 && <p className="px-1 py-2 text-sm text-gray-400">No levels available</p>}
          </Section>

          <Section icon={<BookOpen size={15} />} title="Subject" count={filters.subjects.length}>
            <SearchableMultiSelect
              label="Subject"
              options={subjectOptions}
              selected={filters.subjects}
              onChange={(subjects) => set({ subjects })}
              limit={5}
            />
          </Section>

          <Section icon={<Clock size={15} />} title="Duration" count={filters.durations.length}>
            <div className="grid grid-cols-2 gap-x-3">
              {DURATION_OPTIONS.map((d) => (
                <CheckboxRow
                  key={d.value}
                  checked={filters.durations.includes(d.value)}
                  onChange={(checked) =>
                    set({
                      durations: checked ? [...filters.durations, d.value] : filters.durations.filter((v) => v !== d.value),
                    })
                  }
                  label={d.label}
                />
              ))}
            </div>
          </Section>

          <Section icon={<CalendarDays size={15} />} title="Start Year" count={filters.startYears.length}>
            {startYears.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {startYears.map((year) => {
                  const active = filters.startYears.includes(year)
                  return (
                    <button
                      key={year}
                      onClick={() =>
                        set({
                          startYears: active
                            ? filters.startYears.filter((v) => v !== year)
                            : [...filters.startYears, year],
                        })
                      }
                      className={`rounded-lg border px-3 py-1 text-[13px] font-semibold transition-colors ${
                        active
                          ? 'border-[#C41E3A] bg-[#C41E3A]/5 text-[#C41E3A]'
                          : 'border-gray-200 text-gray-600 hover:border-[#C41E3A]/30 hover:text-[#C41E3A]'
                      }`}
                    >
                      {year}
                    </button>
                  )
                })}
              </div>
            ) : (
              <p className="px-1 py-2 text-sm text-gray-400">No intake years available</p>
            )}
          </Section>

          <Section icon={<DollarSign size={15} />} title="Fee Range" count={filters.feeMin !== null || filters.feeMax !== null ? 1 : 0}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-gray-400">Min ($)</label>
                <input
                  type="number"
                  min={0}
                  max={feeMax}
                  value={filters.feeMin ?? ''}
                  onChange={(e) => set({ feeMin: e.target.value ? Number(e.target.value) : null })}
                  placeholder="0"
                  className="w-full rounded-lg border border-gray-200 py-1.5 px-2 text-sm text-gray-700 outline-none focus:border-[#C41E3A]"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-gray-400">Max ($)</label>
                <input
                  type="number"
                  min={0}
                  max={feeMax}
                  value={filters.feeMax ?? ''}
                  onChange={(e) => set({ feeMax: e.target.value ? Number(e.target.value) : null })}
                  placeholder={feeMax.toLocaleString()}
                  className="w-full rounded-lg border border-gray-200 py-1.5 px-2 text-sm text-gray-700 outline-none focus:border-[#C41E3A]"
                />
              </div>
            </div>
          </Section>

          <div className="border-b border-gray-100">
            <ToggleRow
              icon={<Zap size={15} />}
              label="Express Offer"
              description="Offer in Principle in hours"
              checked={filters.expressOffer}
              onChange={(expressOffer) => set({ expressOffer })}
            />
          </div>

          <div className="border-b border-gray-100">
            <ToggleRow
              icon={<FileCheck2 size={15} />}
              label="English Test Waiver"
              description="No English test required"
              checked={filters.englishWaiver}
              onChange={(englishWaiver) => set({ englishWaiver })}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 border-t border-gray-100 px-4 py-3">
          {activeCount > 0 && (
            <button
              onClick={onClear}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
            >
              <RotateCcw size={15} />
              Reset
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 rounded-lg bg-gradient-to-r from-[#EEF2FF] via-[#F4E8FF] to-[#FFE4F0] py-2.5 text-sm font-bold text-[#C41E3A] transition-opacity hover:opacity-90"
          >
            Show {resultsCount} results
          </button>
        </div>
      </div>
    </div>
  )
}
