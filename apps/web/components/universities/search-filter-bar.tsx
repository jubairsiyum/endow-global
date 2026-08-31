'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X, SlidersHorizontal, Globe, GraduationCap } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'

const COUNTRIES = ['South Korea', 'Australia', 'USA', 'UK', 'Canada', 'Japan', 'Germany', 'France']
const LEVELS = [
  { value: '', label: 'All Levels' },
  { value: 'UNDERGRADUATE', label: 'Undergraduate' },
  { value: 'POSTGRADUATE', label: 'Postgraduate' },
  { value: 'PHD', label: 'PhD' },
  { value: 'DIPLOMA', label: 'Diploma' },
  { value: 'CERTIFICATE', label: 'Certificate' },
  { value: 'FOUNDATION', label: 'Foundation' },
]

export default function SearchFilterBar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [q, setQ] = useState(searchParams.get('q') || '')
  const [country, setCountry] = useState(searchParams.get('country') || '')
  const [level, setLevel] = useState(searchParams.get('level') || searchParams.get('degree') || '')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setQ(searchParams.get('q') || '')
    setCountry(searchParams.get('country') || '')
    setLevel(searchParams.get('level') || searchParams.get('degree') || '')
  }, [searchParams])

  const buildUrl = useCallback((overrides: Record<string, string>) => {
    const p = new URLSearchParams(searchParams.toString())
    Object.entries(overrides).forEach(([k, v]) => {
      if (v) p.set(k, v)
      else p.delete(k)
    })
    if ('level' in overrides) p.delete('degree')
    if ('q' in overrides || 'country' in overrides || 'level' in overrides) {
      // keep URL clean — remove empty degree alias
      if (!p.get('level')) p.delete('degree')
    }
    return `/universities/search?${p.toString()}`
  }, [searchParams])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(buildUrl({ q: q.trim(), country, level }))
  }

  const handleClear = () => {
    setQ(''); setCountry(''); setLevel('')
    // clear both level and legacy degree param
    const p = new URLSearchParams(searchParams.toString())
    p.delete('q'); p.delete('country'); p.delete('level'); p.delete('degree')
    const qs = p.toString()
    router.push(qs ? `/universities/search?${qs}` : '/universities/search')
  }

  const hasActiveChips = Boolean(country || level)

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Main search row — more compact, balanced */}
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-1.5 shadow-[0_2px_12px_rgba(16,27,61,0.05)] sm:gap-3 sm:rounded-2xl sm:p-2">
          <div className="flex min-w-0 flex-1 items-center gap-2 pl-2.5 sm:gap-2.5 sm:pl-3">
            <Search size={17} className="shrink-0 text-gray-400" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search universities, programs, or countries..."
              className="w-full border-0 bg-transparent py-2 text-[14px] text-gray-900 outline-none placeholder:text-gray-400 sm:text-[15px]"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ('')}
                aria-label="Clear search"
                className="shrink-0 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={15} />
              </button>
            )}
          </div>
          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors ${isOpen ? 'bg-[#C41E3A] text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              <SlidersHorizontal size={14} />
              Filters
              {(country || level) && <span className="ml-0.5 h-1.5 w-1.5 rounded-full bg-[#C41E3A] ring-2 ring-white" />}
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#C41E3A] px-5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#A01830] sm:text-sm"
            >
              Search
            </button>
          </div>
          {/* Mobile search button */}
          <button
            type="submit"
            aria-label="Search"
            className="shrink-0 rounded-xl bg-[#C41E3A] p-2.5 text-white shadow-sm transition-colors hover:bg-[#A01830] sm:hidden"
          >
            <Search size={16} />
          </button>
        </div>

        {/* Expanded filter panel — compact */}
        {isOpen && (
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-[0_4px_20px_rgba(16,27,61,0.06)] sm:rounded-2xl sm:p-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  <Globe size={11} className="mr-1 inline -mt-0.5" />
                  Country
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-[#C41E3A] focus:outline-none focus:ring-1 focus:ring-[#C41E3A]/20 sm:h-10"
                >
                  <option value="">Any Country</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  <GraduationCap size={11} className="mr-1 inline -mt-0.5" />
                  Degree Level
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-[#C41E3A] focus:outline-none focus:ring-1 focus:ring-[#C41E3A]/20 sm:h-10"
                >
                  {LEVELS.map((l) => (
                    <option key={l.value} value={l.value}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4 flex gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={handleClear}
                className="h-9 flex-1 rounded-lg border border-gray-200 px-4 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 sm:h-10"
              >
                Clear All
              </button>
              <button
                type="submit"
                className="h-9 flex-1 rounded-lg bg-[#C41E3A] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#A01830] sm:h-10"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Active filter chips — country/level only (q is shown in header meta to avoid duplication) */}
        {hasActiveChips && (
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            {country && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {country}
                <button
                  type="button"
                  aria-label="Remove country filter"
                  onClick={() => {
                    setCountry('')
                    router.push(buildUrl({ q, country: '', level }))
                  }}
                  className="rounded-full p-0.5 hover:bg-blue-100"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {level && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                {LEVELS.find((l) => l.value === level)?.label || level}
                <button
                  type="button"
                  aria-label="Remove level filter"
                  onClick={() => {
                    setLevel('')
                    router.push(buildUrl({ q, country, level: '' }))
                  }}
                  className="rounded-full p-0.5 hover:bg-amber-100"
                >
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
        )}
      </form>
    </div>
  )
}
