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
  const [level, setLevel] = useState(searchParams.get('level') || '')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setQ(searchParams.get('q') || '')
    setCountry(searchParams.get('country') || '')
    setLevel(searchParams.get('level') || '')
  }, [searchParams])

  const buildUrl = useCallback((overrides: Record<string, string>) => {
    const p = new URLSearchParams(searchParams.toString())
    Object.entries(overrides).forEach(([k, v]) => {
      if (v) p.set(k, v)
      else p.delete(k)
    })
    return `/universities/search?${p.toString()}`
  }, [searchParams])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(buildUrl({ q: q.trim(), country, level }))
  }

  const handleClear = () => {
    setQ(''); setCountry(''); setLevel('')
    router.push('/universities/search')
  }

  const hasFilters = q.trim() || country || level

  return (
    <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Main search row */}
        <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-2 shadow-[0_4px_24px_rgba(16,27,61,0.06)]">
          <div className="flex min-w-0 flex-1 items-center gap-2.5 pl-3">
            <Search size={18} className="shrink-0 text-gray-400" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search universities, programs, or countries..."
              className="w-full border-0 bg-transparent py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 sm:text-[15px]"
            />
            {q && (
              <button type="button" onClick={() => setQ('')} className="shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                <X size={16} />
              </button>
            )}
          </div>
          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors ${isOpen ? 'bg-[#C41E3A] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              <SlidersHorizontal size={14} />
              Filters
              {(country || level) && <span className="ml-0.5 h-1.5 w-1.5 rounded-full bg-[#C41E3A]" />}
            </button>
            <button type="submit" className="rounded-xl bg-[#C41E3A] px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#A01830] sm:text-sm">
              Search
            </button>
          </div>
          {/* Mobile search button */}
          <button type="submit" className="shrink-0 rounded-xl bg-[#C41E3A] p-2.5 text-white sm:hidden">
            <Search size={18} />
          </button>
        </div>

        {/* Expanded filter panel */}
        {isOpen && (
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_4px_24px_rgba(16,27,61,0.06)]">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <Globe size={12} className="mr-1 inline" />
                  Country
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-[#C41E3A] focus:outline-none focus:ring-1 focus:ring-[#C41E3A]/20"
                >
                  <option value="">Any Country</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <GraduationCap size={12} className="mr-1 inline" />
                  Degree Level
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-[#C41E3A] focus:outline-none focus:ring-1 focus:ring-[#C41E3A]/20"
                >
                  {LEVELS.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <button type="button" onClick={handleClear} className="h-10 flex-1 rounded-lg border border-gray-200 px-4 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50">
                Clear All
              </button>
              <button type="submit" className="h-10 flex-1 rounded-lg bg-[#C41E3A] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#A01830]">
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Active filter chips */}
        {hasFilters && (
          <div className="flex flex-wrap items-center gap-2">
            {q.trim() && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#C41E3A]/10 px-3 py-1 text-xs font-semibold text-[#C41E3A]">
                &ldquo;{q.trim()}&rdquo;
                <button type="button" onClick={() => { setQ(''); router.push(buildUrl({ q: '', country, level })) }}>
                  <X size={12} />
                </button>
              </span>
            )}
            {country && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                {country}
                <button type="button" onClick={() => { setCountry(''); router.push(buildUrl({ q, country: '', level })) }}>
                  <X size={12} />
                </button>
              </span>
            )}
            {level && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600">
                {LEVELS.find((l) => l.value === level)?.label || level}
                <button type="button" onClick={() => { setLevel(''); router.push(buildUrl({ q, country, level: '' })) }}>
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
