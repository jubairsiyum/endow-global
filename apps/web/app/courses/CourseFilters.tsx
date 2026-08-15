'use client'

import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  Search,
  X,
  RotateCcw,
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
import { FEE_MAX_LIMIT } from './filter-utils'
import type { CourseFilters } from './filter-utils'

export type FilterOptions = {
  countries: string[]
  cities: string[]
  institutions: { id: string; name: string }[]
  subjects: string[]
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

const LEVEL_OPTIONS: { label: string; value: string }[] = [
  { label: 'Undergraduate', value: 'UNDERGRADUATE' },
  { label: 'Postgraduate', value: 'POSTGRADUATE' },
  { label: 'Foundation', value: 'FOUNDATION' },
  { label: 'Doctorate', value: 'PHD' },
]

const DURATION_OPTIONS: { label: string; value: string }[] = [
  { label: 'Less than 1 year', value: 'lt1' },
  { label: '1 - 2 years', value: '1_2' },
  { label: '2 - 3 years', value: '2_3' },
  { label: '3 - 4 years', value: '3_4' },
  { label: '4 - 5 years', value: '4_5' },
  { label: 'More than 5 years', value: 'gt5' },
]

const START_YEARS = [2026, 2027, 2028, 2029]

function SectionHeader({
  icon,
  title,
  hint,
  right,
}: {
  icon: ReactNode
  title: string
  hint?: string
  right?: ReactNode
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#C41E3A]/[0.08] text-[#C41E3A]">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <h4 className="text-[13px] font-bold uppercase tracking-wide text-gray-900">{title}</h4>
        {hint && <p className="text-[11px] leading-4 text-gray-400">{hint}</p>}
      </div>
      {right}
    </div>
  )
}

function SelectionCounter({ count, limit }: { count: number; limit?: number }) {
  return (
    <span className={`shrink-0 text-[11px] font-medium ${limit !== undefined && count >= limit ? 'text-[#C41E3A]' : 'text-gray-400'}`}>
      {count > 0 ? `${count} selected` : limit !== undefined ? `Up to ${limit}` : ''}
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
    <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-50">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 shrink-0 rounded border-gray-300 accent-[#C41E3A]"
      />
      <span className="flex-1 text-sm text-gray-700">{label}</span>
    </label>
  )
}

function Toggle({
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
      onClick={() => onChange(!checked)}
      className={`flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors ${
        checked ? 'border-[#C41E3A]/30 bg-rose-50/50' : 'border-gray-200 bg-white hover:border-[#C41E3A]/20 hover:bg-gray-50'
      }`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#C41E3A]/[0.08] text-[#C41E3A]">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-gray-800">{label}</span>
        {description && <span className="mt-0.5 block text-xs leading-4 text-gray-400">{description}</span>}
      </span>
      <span className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${checked ? 'bg-[#C41E3A]' : 'bg-gray-300'}`}>
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-0.5'}`}
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
      <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 shadow-sm focus-within:border-[#C41E3A] focus-within:ring-2 focus-within:ring-[#C41E3A]/10">
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

      <div className="mt-2 max-h-52 space-y-0.5 overflow-y-auto pr-1">
        {filtered.map((option) => {
          const isSelected = selected.includes(option.value)
          const isDisabled = limit !== undefined && !isSelected && selected.length >= limit
          return (
            <label
              key={option.value}
              className={`flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors ${
                isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-gray-50'
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                disabled={isDisabled}
                onChange={() => toggle(option.value)}
                className="h-4 w-4 shrink-0 rounded border-gray-300 accent-[#C41E3A]"
              />
              {option.flag && <span className="text-base leading-none">{option.flag}</span>}
              <span className="min-w-0 flex-1 truncate text-sm text-gray-700">{option.label}</span>
            </label>
          )
        })}
        {filtered.length === 0 && <p className="px-2 py-3 text-sm text-gray-400">No matches found</p>}
      </div>

      {selected.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
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

  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      <div
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-200 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-gray-900">Filters</h3>
            <span className="rounded-full bg-[#C41E3A]/10 px-2.5 py-0.5 text-xs font-semibold text-[#C41E3A]">
              {resultsCount} results
            </span>
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
        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
          {/* Destination */}
          <div>
            <SectionHeader
              icon={<Globe size={15} />}
              title="Destination"
              hint="Where do you want to study?"
              right={<SelectionCounter count={filters.countries.length} />}
            />
            <div className="mt-3">
              <SearchableMultiSelect
                label="Destination"
                options={countryOptions}
                selected={filters.countries}
                onChange={(countries) => set({ countries })}
                placeholder="Search country..."
              />
            </div>
          </div>

          {/* City */}
          <div className="border-t border-gray-100 pt-5">
            <SectionHeader icon={<MapPin size={15} />} title="City" right={<SelectionCounter count={filters.cities.length} limit={5} />} />
            <div className="mt-3">
              <SearchableMultiSelect
                label="City"
                options={cityOptions}
                selected={filters.cities}
                onChange={(cities) => set({ cities })}
                limit={5}
              />
            </div>
          </div>

          {/* Institution */}
          <div className="border-t border-gray-100 pt-5">
            <SectionHeader
              icon={<Building2 size={15} />}
              title="Institution"
              right={<SelectionCounter count={filters.institutionIds.length} limit={5} />}
            />
            <div className="mt-3">
              <SearchableMultiSelect
                label="Institution"
                options={institutionOptions}
                selected={filters.institutionIds}
                onChange={(institutionIds) => set({ institutionIds })}
                limit={5}
              />
            </div>
          </div>

          {/* Study Level */}
          <div className="border-t border-gray-100 pt-5">
            <SectionHeader icon={<GraduationCap size={15} />} title="Study Level" />
            <div className="mt-2 space-y-0.5">
              {LEVEL_OPTIONS.map((l) => (
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
          </div>

          {/* Subject */}
          <div className="border-t border-gray-100 pt-5">
            <SectionHeader icon={<BookOpen size={15} />} title="Subject" right={<SelectionCounter count={filters.subjects.length} limit={5} />} />
            <div className="mt-3">
              <SearchableMultiSelect
                label="Subject"
                options={subjectOptions}
                selected={filters.subjects}
                onChange={(subjects) => set({ subjects })}
                limit={5}
              />
            </div>
          </div>

          {/* Express Offer */}
          <div className="border-t border-gray-100 pt-5">
            <Toggle
              icon={<Zap size={17} />}
              label="Express Offer"
              description="Offer in Principle in just a few hours"
              checked={filters.expressOffer}
              onChange={(expressOffer) => set({ expressOffer })}
            />
          </div>

          {/* Duration */}
          <div className="border-t border-gray-100 pt-5">
            <SectionHeader icon={<Clock size={15} />} title="Duration" />
            <div className="mt-2 space-y-0.5">
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
          </div>

          {/* Start Year */}
          <div className="border-t border-gray-100 pt-5">
            <SectionHeader icon={<CalendarDays size={15} />} title="Start Year" />
            <div className="mt-2 grid grid-cols-4 gap-2">
              {START_YEARS.map((year) => {
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
                    className={`rounded-lg border px-2 py-2 text-sm font-semibold transition-colors ${
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
          </div>

          {/* Fee Range */}
          <div className="border-t border-gray-100 pt-5">
            <SectionHeader icon={<DollarSign size={15} />} title="Fee Range" hint="Tuition fee per year (USD)" />
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-gray-400">Min</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">$</span>
                  <input
                    type="number"
                    min={0}
                    max={FEE_MAX_LIMIT}
                    value={filters.feeMin ?? ''}
                    onChange={(e) => set({ feeMin: e.target.value ? Number(e.target.value) : null })}
                    placeholder="0"
                    className="w-full rounded-xl border border-gray-200 py-2.5 pl-7 pr-3 text-sm text-gray-700 outline-none focus:border-[#C41E3A]"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-gray-400">Max</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">$</span>
                  <input
                    type="number"
                    min={0}
                    max={FEE_MAX_LIMIT}
                    value={filters.feeMax ?? ''}
                    onChange={(e) => set({ feeMax: e.target.value ? Number(e.target.value) : null })}
                    placeholder={FEE_MAX_LIMIT.toLocaleString()}
                    className="w-full rounded-xl border border-gray-200 py-2.5 pl-7 pr-3 text-sm text-gray-700 outline-none focus:border-[#C41E3A]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* English Waiver */}
          <div className="border-t border-gray-100 pt-5">
            <Toggle
              icon={<FileCheck2 size={17} />}
              label="English Test Waiver"
              description="Show courses that accept students without an English test"
              checked={filters.englishWaiver}
              onChange={(englishWaiver) => set({ englishWaiver })}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 border-t border-gray-100 px-5 py-4">
          <button
            onClick={onClear}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
          >
            <RotateCcw size={15} />
            Clear all
          </button>
          <button
            onClick={onClose}
            className="flex-1 rounded-lg bg-[#C41E3A] py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#A01830]"
          >
            Apply filters
          </button>
        </div>
      </div>
    </div>
  )
}
