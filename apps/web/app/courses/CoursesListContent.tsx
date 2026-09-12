'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { Search, MapPin, Clock, GraduationCap, Award, ChevronLeft, ChevronRight, ChevronDown, BookOpen, ArrowRight, SlidersHorizontal, X } from 'lucide-react'

import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { trpc } from '@/lib/trpc-client'
import { formatCurrency } from '@/lib/utils'
import { FadeUp, FadeUpStagger, FadeUpItem } from '@/components/home/FadeUp'
import { CourseFilters, FilterPanel } from './CourseFilters'
import { EMPTY_FILTERS, countActiveFilters, serializeFilters } from './filter-utils'
import type { CourseFilters as Filters } from './filter-utils'

const levelLabels: Record<string, string> = {
  UNDERGRADUATE: 'Undergraduate',
  POSTGRADUATE: 'Postgraduate',
  PHD: 'PhD',
  DIPLOMA: 'Diploma',
  CERTIFICATE: 'Certificate',
  FOUNDATION: 'Foundation',
}

function formatTuitionDisplay(amount: number | null | undefined, currency: string | null | undefined): { display: string | null; code: string | null } {
  if (amount == null || amount === 0) return { display: null, code: null }
  const code = (currency || 'USD').toUpperCase()
  try {
    const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: code }).format(amount)
    return { display: formatted.replace(/\.00$/, ''), code }
  } catch {
    return { display: `${code} ${amount.toLocaleString()}`, code }
  }
}

const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'tuition_asc', label: 'Tuition: Low to High' },
  { value: 'tuition_desc', label: 'Tuition: High to Low' },
  { value: 'university_asc', label: 'University: A–Z' },
  { value: 'course_asc', label: 'Course: A–Z' },
  { value: 'newest', label: 'Newest' },
] as const

type SortValue = (typeof SORT_OPTIONS)[number]['value']

function getPageItems(current: number, total: number): (number | '...')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const items: (number | '...')[] = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  if (start > 2) items.push('...')
  for (let i = start; i <= end; i++) items.push(i)
  if (end < total - 1) items.push('...')
  items.push(total)
  return items
}

type CourseListData = {
  hits: Array<{
    id: string
    name: string
    slug: string
    subject: string
    level: 'UNDERGRADUATE' | 'POSTGRADUATE' | 'PHD' | 'DIPLOMA' | 'CERTIFICATE' | 'FOUNDATION'
    duration: number
    durationUnit: string
    tuitionFee: number
    currency: string
    language: string
    hasScholarship: boolean
    scholarshipDetails: string | null
    description: string
    universityId: string
    universityName: string | null
    universitySlug: string | null
    universityCountry: string | null
    universityCity: string | null
    universityLogo: string | null
  }>
  total: number
  page: number
  totalPages: number
}

type CoursesListContentProps = {
  initialData: CourseListData
  initialFilters?: Filters
  initialQuery?: string
  initialSort?: SortValue
}

export default function CoursesListContent({ initialData, initialFilters, initialQuery, initialSort }: CoursesListContentProps) {
  const [page, setPage] = useState(initialData.page)

  const [search, setSearch] = useState(initialQuery ?? '')
  const [debouncedSearch, setDebouncedSearch] = useState(initialQuery ?? '')
  const [filters, setFilters] = useState<Filters>(initialFilters ?? EMPTY_FILTERS)
  const [sort, setSort] = useState<SortValue>(initialSort ?? 'recommended')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filtersTouched, setFiltersTouched] = useState(false)

  const resultsRef = useRef<HTMLDivElement>(null)
  const prevPageRef = useRef(page)
  const filtersRef = useRef(filters)
  const sortRef = useRef(sort)
  useEffect(() => {
    filtersRef.current = filters
  }, [filters])
  useEffect(() => {
    sortRef.current = sort
  }, [sort])

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400)
    return () => clearTimeout(t)
  }, [search])

  // Sync URL and reset page when debounced search changes (after debounce)
  const prevDebouncedRef = useRef(debouncedSearch)
  useEffect(() => {
    if (prevDebouncedRef.current !== debouncedSearch) {
      prevDebouncedRef.current = debouncedSearch
      if (debouncedSearch !== (initialQuery ?? '')) {
        setFiltersTouched(true)
      }
      if (page !== 1) setPage(1)
      const params = serializeFilters(filtersRef.current)
      if (sortRef.current !== 'recommended') params.set('sort', sortRef.current)
      if (debouncedSearch) params.set('query', debouncedSearch)
      window.history.replaceState(window.history.state, '', `/courses${params.toString() ? `?${params.toString()}` : ''}`)
    }
  }, [debouncedSearch])

  const isInitialQuery =
    page === initialData.page &&
    debouncedSearch === (initialQuery ?? '') &&
    !filtersTouched &&
    sort === (initialSort ?? 'recommended')

  const { data, isLoading, isFetching, isError } = trpc.course.list.useQuery(
    {
      query: debouncedSearch || undefined,
      countries: filters.countries.length ? filters.countries : undefined,
      cities: filters.cities.length ? filters.cities : undefined,
      institutionIds: filters.institutionIds.length ? filters.institutionIds : undefined,
      levels: filters.levels.length ? filters.levels : undefined,
      subjects: filters.subjects.length ? filters.subjects : undefined,
      expressOffer: filters.expressOffer || undefined,
      englishWaiver: filters.englishWaiver || undefined,
      durations: filters.durations.length ? filters.durations : undefined,
      startYears: filters.startYears.length ? filters.startYears : undefined,
      feeMin: filters.feeMin ?? undefined,
      feeMax: filters.feeMax ?? undefined,
      sort: sort !== 'recommended' ? sort : undefined,
      page,
      perPage: 12,
    },
    {
      initialData: isInitialQuery ? initialData : undefined,
    }
  )

  const { data: filterOptions } = trpc.course.getFilterOptions.useQuery(undefined)

  const { data: popularSearches } = trpc.course.getPopularSearches.useQuery(undefined)

  const syncUrl = useCallback(
    (nextPage: number, nextFilters: Filters, nextSort: SortValue, nextSearch: string = debouncedSearch) => {
      const params = serializeFilters(nextFilters)
      if (nextSort !== 'recommended') params.set('sort', nextSort)
      if (nextSearch) params.set('query', nextSearch)
      else params.delete('query')
      if (nextPage > 1) params.set('page', String(nextPage))
      const qs = params.toString()
      window.history.replaceState(window.history.state, '', `/courses${qs ? `?${qs}` : ''}`)
    },
    [debouncedSearch]
  )

  const goToPage = useCallback(
    (next: number) => {
      const clamped = Math.max(1, next)
      setPage(clamped)
      syncUrl(clamped, filters, sort)
    },
    [syncUrl, filters, sort]
  )

  const updateFilters = useCallback(
    (next: Filters) => {
      setFiltersTouched(true)
      setFilters(next)
      setPage(1)
      syncUrl(1, next, sort)
    },
    [syncUrl, sort]
  )

  const clearFilters = useCallback(() => {
    setFiltersTouched(true)
    setFilters(EMPTY_FILTERS)
    setPage(1)
    syncUrl(1, EMPTY_FILTERS, sort)
  }, [syncUrl, sort])

  const handleSortChange = useCallback(
    (nextSort: SortValue) => {
      setFiltersTouched(true)
      setSort(nextSort)
      setPage(1)
      syncUrl(1, filters, nextSort)
    },
    [syncUrl, filters]
  )

  const resetPage = useCallback(() => {
    if (page !== 1) {
      setPage(1)
      syncUrl(1, filters, sort)
    }
  }, [page, syncUrl, filters, sort])

  useEffect(() => {
    if (prevPageRef.current !== page) {
      prevPageRef.current = page
      const el = resultsRef.current
      if (!el) return
      const lenis = window.__lenis
      if (lenis && typeof lenis.scrollTo === 'function') {
        lenis.scrollTo(el, { offset: -96 })
      } else {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }, [page])

  const activeFilterCount = countActiveFilters(filters)
  const displayData = data

  const activeFilterChips = useMemo(() => {
    const chips: { key: string; label: string; remove: () => void }[] = []

    filters.countries.forEach((c) =>
      chips.push({
        key: `country-${c}`,
        label: c,
        remove: () => updateFilters({ ...filters, countries: filters.countries.filter((x) => x !== c) }),
      })
    )
    filters.cities.forEach((c) =>
      chips.push({
        key: `city-${c}`,
        label: c,
        remove: () => updateFilters({ ...filters, cities: filters.cities.filter((x) => x !== c) }),
      })
    )
    filters.levels.forEach((l) =>
      chips.push({
        key: `level-${l}`,
        label: levelLabels[l] ?? l,
        remove: () => updateFilters({ ...filters, levels: filters.levels.filter((x) => x !== l) }),
      })
    )
    filters.subjects.forEach((s) =>
      chips.push({
        key: `subject-${s}`,
        label: s,
        remove: () => updateFilters({ ...filters, subjects: filters.subjects.filter((x) => x !== s) }),
      })
    )
    filters.institutionIds.forEach((id) => {
      const inst = filterOptions?.institutions.find((u) => u.id === id)
      chips.push({
        key: `inst-${id}`,
        label: inst?.name ?? id,
        remove: () =>
          updateFilters({ ...filters, institutionIds: filters.institutionIds.filter((x) => x !== id) }),
      })
    })
    if (filters.expressOffer) {
      chips.push({
        key: 'express',
        label: 'Express Offer',
        remove: () => updateFilters({ ...filters, expressOffer: false }),
      })
    }
    if (filters.englishWaiver) {
      chips.push({
        key: 'waiver',
        label: 'English Waiver',
        remove: () => updateFilters({ ...filters, englishWaiver: false }),
      })
    }
    if (filters.feeMin !== null || filters.feeMax !== null) {
      chips.push({
        key: 'fee',
        label: 'Fee range',
        remove: () => updateFilters({ ...filters, feeMin: null, feeMax: null }),
      })
    }

    return chips
  }, [filters, filterOptions, updateFilters])

  return (
    <div className="w-full flex flex-col overflow-x-clip">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#FDFDFF] to-[#F4F6FB]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-rose-50/70 blur-[120px]" />
          <div className="absolute -right-24 top-32 h-72 w-72 rounded-full bg-blue-50/60 blur-3xl" />
          <div className="absolute -left-24 top-48 h-72 w-72 rounded-full bg-amber-50/50 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="pt-4 pb-6 lg:pb-8">
            <Navbar />
          </div>

          <div className="pb-14 pt-16 lg:pb-20 lg:pt-24">
            <FadeUp>
              <div className="text-center">
                <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#C41E3A]/15 bg-[#C41E3A]/[0.04] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#C41E3A]">
                  <BookOpen size={13} />
                  Course Catalog
                </span>
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-950 sm:text-4xl lg:text-5xl">
                  Find Your <span className="text-[#C41E3A]">Perfect Course</span>
                </h1>
                <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-500 sm:text-lg">
                  Browse thousands of programs from partner universities worldwide
                </p>
              </div>
            </FadeUp>

            {/* Search Bar */}
            <FadeUp>
              <div className="mx-auto mt-8 max-w-3xl">
                <div className="flex items-center gap-3 rounded-full border border-gray-200 bg-white px-4 py-2 shadow-sm transition-all focus-within:border-[#C41E3A]/40 focus-within:shadow-[0_2px_16px_rgba(196,30,58,0.08)] focus-within:ring-2 focus-within:ring-[#C41E3A]/10 sm:px-5 sm:py-2.5">
                  <Search size={18} className="shrink-0 text-gray-400" aria-hidden="true" />
                  <input
                    type="search"
                    aria-label="Search courses, universities, or subjects"
                    placeholder="Search courses, universities, or subjects..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setDebouncedSearch((e.target as HTMLInputElement).value)
                        ;(e.target as HTMLInputElement).blur()
                      }
                    }}
                    className="w-full border-0 bg-transparent p-0 text-sm text-gray-900 outline-none placeholder:text-gray-400 sm:text-[15px]"
                  />
                  {search && (
                    <button
                      type="button"
                      aria-label="Clear search"
                      onClick={() => setSearch('')}
                      className="shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C41E3A]"
                    >
                      <X size={16} />
                    </button>
                  )}
                  <Button
                    onClick={() => setDebouncedSearch(search)}
                    className="hidden shrink-0 rounded-full bg-[#C41E3A] px-6 py-2 text-[13px] font-semibold text-white hover:bg-[#A01830] sm:inline-flex"
                    aria-label="Search courses"
                  >
                    Search
                  </Button>
                </div>

                {/* Popular searches — act as subject filters */}
                {popularSearches && popularSearches.length > 0 && (
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                    <span className="text-sm font-medium text-gray-400">Popular:</span>
                    {popularSearches.map((term) => {
                      const isActive = filters.subjects.includes(term)
                      return (
                        <button
                          key={term}
                          aria-pressed={isActive}
                          onClick={() => {
                            const nextSubjects = isActive ? filters.subjects.filter((s) => s !== term) : [...filters.subjects, term]
                            updateFilters({ ...filters, subjects: nextSubjects })
                          }}
                          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                            isActive
                              ? 'border-[#C41E3A] bg-[#C41E3A] text-white shadow-sm'
                              : 'border-gray-200 bg-white text-gray-600 hover:border-[#C41E3A]/30 hover:bg-rose-50 hover:text-[#C41E3A]'
                          }`}
                        >
                          {term}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </FadeUp>

            {/* Trust stats */}
            <FadeUp>
              <div className="mx-auto mt-12 flex max-w-3xl items-stretch divide-x divide-gray-100 rounded-2xl border border-gray-200 bg-white/80 px-2 py-5 shadow-sm backdrop-blur sm:px-4">
                {[
                  { value: `${displayData?.total ?? initialData.total}`, label: 'Courses' },
                  { value: `${filterOptions?.institutions.length ?? 0}`, label: 'Universities' },
                  { value: `${filterOptions?.countries.length ?? 0}`, label: 'Countries' },
                  { value: '98%', label: 'Visa Success' },
                ].map((s, i) => (
                  <div key={i} className="flex-1 px-3 text-center">
                    <p className="text-2xl font-extrabold text-gray-900 sm:text-3xl">{s.value}</p>
                    <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-gray-400 sm:text-xs">{s.label}</p>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      <main className="flex-grow bg-gray-50">
        {/* Filters (sidebar) + Results */}
        <section className="py-8 lg:py-12">
          <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start lg:gap-8">
              {/* Filters sidebar (desktop) */}
              <aside className="sticky top-24 hidden lg:block">
                <div className="flex max-h-[calc(100vh-6rem)] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                  <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-4 py-3">
                    <h3 className="text-base font-bold text-gray-900">Filters</h3>
                    {activeFilterCount > 0 && (
                      <button
                        onClick={clearFilters}
                        className="text-sm font-medium text-[#C41E3A] transition-colors hover:underline"
                      >
                        Reset all
                      </button>
                    )}
                  </div>
                  <div data-lenis-prevent className="filter-scroll min-h-0 flex-1 overflow-y-auto px-4 py-2">
                    <FilterPanel
                      filters={filters}
                      onChange={updateFilters}
                      options={
                        filterOptions ?? {
                          countries: [],
                          cities: [],
                          institutions: [],
                          subjects: [],
                          levels: [],
                          startYears: [],
                          feeMax: 0,
                        }
                      }
                    />
                  </div>
                </div>
              </aside>

              {/* Results */}
              <div className="min-w-0">
                {/* Results toolbar */}
                <div className="mb-5">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="text-lg font-bold text-gray-900 sm:text-xl" aria-live="polite">
                        {displayData
                          ? `${displayData.total} ${displayData.total === 1 ? 'course' : 'courses'} found`
                          : 'Courses'}
                        {isFetching && !isLoading && <span className="ml-2 text-sm font-normal text-[#C41E3A]">Updating…</span>}
                      </h2>
                      {/* Desktop sort */}
                      <div className="hidden items-center gap-2 lg:flex">
                        <label htmlFor="sort-desktop" className="text-sm font-medium text-gray-500">
                          Sort:
                        </label>
                        <div className="relative">
                          <select
                            id="sort-desktop"
                            value={sort}
                            onChange={(e) => handleSortChange(e.target.value as SortValue)}
                            className="appearance-none rounded-xl border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm font-medium text-gray-700 outline-none transition-colors hover:border-gray-300 focus:border-[#C41E3A] focus:ring-2 focus:ring-[#C41E3A]/10"
                          >
                            {SORT_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                        </div>
                      </div>
                    </div>

                    {/* Mobile toolbar: Filters + Sort */}
                    <div className="flex items-center gap-2 lg:hidden">
                      <button
                        onClick={() => setFiltersOpen(true)}
                        aria-label={`Open filters${activeFilterCount ? `, ${activeFilterCount} active` : ''}`}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:border-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C41E3A] focus-visible:ring-offset-1"
                      >
                        <SlidersHorizontal size={16} aria-hidden="true" />
                        Filters
                        {activeFilterCount > 0 && (
                          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#C41E3A] px-1.5 text-[11px] font-bold text-white">
                            {activeFilterCount}
                          </span>
                        )}
                      </button>
                      <div className="relative flex-1">
                        <label htmlFor="sort-mobile" className="sr-only">
                          Sort courses
                        </label>
                        <select
                          id="sort-mobile"
                          value={sort}
                          onChange={(e) => handleSortChange(e.target.value as SortValue)}
                          className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-3 pr-8 text-sm font-medium text-gray-700 outline-none transition-colors hover:border-gray-300 focus:border-[#C41E3A] focus:ring-2 focus:ring-[#C41E3A]/10"
                        >
                          {SORT_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                      </div>
                    </div>

                    {activeFilterChips.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2">
                        {activeFilterChips.map((chip) => (
                          <button
                            key={chip.key}
                            onClick={chip.remove}
                            aria-label={`Remove filter ${chip.label}`}
                            className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 transition-colors hover:border-[#C41E3A]/40 hover:text-[#C41E3A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C41E3A] focus-visible:ring-offset-1"
                          >
                            {chip.label}
                            <X size={12} className="text-gray-400" aria-hidden="true" />
                          </button>
                        ))}
                        <button
                          onClick={clearFilters}
                          className="text-xs font-semibold text-[#C41E3A] transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C41E3A] focus-visible:ring-offset-1 rounded"
                        >
                          Clear all
                        </button>
                      </div>
                    )}
                  </div>
                </div>

            {/* Results Grid */}
            <div ref={resultsRef} className="scroll-mt-24">
              {isError ? (
                <div className="mx-auto max-w-xl rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                    <X size={24} aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-gray-900">Unable to load courses</h3>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-500">
                    Something went wrong while loading the course catalog. Please try again.
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-6 inline-flex items-center justify-center rounded-full bg-[#C41E3A] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#A01830] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C41E3A] focus-visible:ring-offset-2"
                  >
                    Try again
                  </button>
                </div>
              ) : isLoading ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-4">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 shrink-0 animate-pulse rounded-lg bg-gray-100" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
                          <div className="h-3 w-1/2 animate-pulse rounded bg-gray-100" />
                        </div>
                        <div className="h-6 w-16 animate-pulse rounded-md bg-gray-100" />
                      </div>
                      <div className="mt-4 h-5 w-3/4 animate-pulse rounded bg-gray-100" />
                      <div className="mt-1 h-5 w-1/2 animate-pulse rounded bg-gray-100" />
                      <div className="mt-3 flex gap-2">
                        <div className="h-6 w-20 animate-pulse rounded-md bg-gray-100" />
                        <div className="h-6 w-16 animate-pulse rounded-md bg-gray-100" />
                      </div>
                      <div className="mt-auto border-t border-gray-100 pt-4">
                        <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
                        <div className="mt-2 h-6 w-32 animate-pulse rounded bg-gray-100" />
                        <div className="mt-3 h-10 animate-pulse rounded-lg bg-gray-100" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : displayData?.hits.length === 0 ? (
                <div className="mx-auto max-w-xl rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-[#C41E3A]">
                    <GraduationCap className="h-8 w-8" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-gray-900">No courses match your criteria</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Try adjusting your filters or explore our popular study subjects below.
                  </p>

                  <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                    {['Computer Science', 'Business', 'Engineering', 'Healthcare'].map((s) => (
                      <button
                        key={s}
                        onClick={() => { setSearch(''); updateFilters({ ...filters, subjects: [s] }) }}
                        className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:border-[#C41E3A] hover:bg-rose-50 hover:text-[#C41E3A]"
                      >
                        {s}
                      </button>
                    ))}
                    <button
                      onClick={() => { setSearch(''); clearFilters() }}
                      className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-200"
                    >
                      Clear All Filters
                    </button>
                  </div>

                  <div className="mt-8 rounded-2xl border border-rose-100 bg-rose-50/50 p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#C41E3A]">Need Direct Assistance?</p>
                    <p className="mt-1 text-sm font-medium text-gray-800">Our advisors can find & match courses directly for you in South Korea & Australia.</p>
                    <Link
                      href="/register"
                      className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#C41E3A] px-5 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#A01830]"
                    >
                      Get Free Course Matching <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              ) : (
                <FadeUpStagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3" amount={0.08}>
                  {displayData?.hits.map((course) => {
                    const courseUrl = course.universitySlug
                      ? `/institutions/${course.universitySlug}/${(course.level || 'postgraduate').toLowerCase()}/${course.slug}`
                      : `/courses/${course.slug}`
                    const tuition = formatTuitionDisplay(course.tuitionFee as unknown as number, course.currency)
                    const hasTuition = tuition.display !== null
                    return (
                      <FadeUpItem key={course.id} className="flex">
                        <Link
                          href={courseUrl}
                          aria-label={`View ${course.name} at ${course.universityName}`}
                          className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C41E3A] focus-visible:ring-offset-2 transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
                        >
                          {/* Header: logo + university + location */}
                          <div className="flex items-start gap-3.5 p-4 pb-3">
                            {course.universityLogo ? (
                              <img
                                src={course.universityLogo}
                                alt=""
                                aria-hidden="true"
                                className="h-11 w-11 shrink-0 rounded-xl border border-gray-100 bg-white object-contain p-2"
                                loading="lazy"
                              />
                            ) : (
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 text-gray-400" aria-hidden="true">
                                <GraduationCap size={18} />
                              </div>
                            )}
                            <div className="min-w-0 flex-1 pt-0.5">
                              <p className="line-clamp-2 break-words text-[15px] font-bold leading-snug tracking-tight text-gray-900">
                                {course.universityName || 'University'}
                              </p>
                              <p className="mt-1 flex items-center gap-1 text-xs leading-none text-gray-500">
                                <MapPin size={11} className="shrink-0 text-gray-400" aria-hidden="true" />
                                <span className="truncate">
                                  {course.universityCity ? `${course.universityCity}, ` : ''}
                                  {course.universityCountry || 'International'}
                                </span>
                              </p>
                              <span className="mt-2 inline-flex rounded-md bg-[#F8F5F0] px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#8B7355]">
                                {levelLabels[course.level] ?? course.level}
                              </span>
                            </div>
                          </div>

                          {/* Body */}
                          <div className="flex flex-1 flex-col p-4 pt-0">
                            <h3 className="min-h-[3rem] line-clamp-2 break-words text-[15px] font-bold leading-snug text-gray-900 transition-colors group-hover:text-[#C41E3A] group-focus-visible:text-[#C41E3A]">
                              {course.name}
                            </h3>

                            <div className="mt-2.5 flex flex-wrap gap-1.5">
                              {course.duration ? (
                                <span className="inline-flex items-center gap-1 rounded-md bg-gray-50 px-2 py-1 text-[11px] font-medium text-gray-600">
                                  <Clock size={11} aria-hidden="true" />
                                  {course.duration} {course.durationUnit?.toLowerCase() || 'year'}
                                </span>
                              ) : null}
                              {course.language && (
                                <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-[11px] font-medium text-gray-600">
                                  {course.language}
                                </span>
                              )}
                            </div>

                            <div className="mt-auto pt-4">
                              <div className="border-t border-gray-100 pt-4">
                                <div className="flex items-end justify-between gap-3">
                                  <div className="min-w-0">
                                    <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">Annual tuition</p>
                                    {hasTuition ? (
                                      <p className="mt-1 flex flex-wrap items-baseline gap-1.5">
                                        <span className="text-[17px] font-bold leading-none tracking-tight text-gray-900">{tuition.display}</span>
                                        {tuition.code && (
                                          <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{tuition.code}</span>
                                        )}
                                      </p>
                                    ) : (
                                      <p className="mt-1 text-sm font-medium text-gray-500">Contact university</p>
                                    )}
                                  </div>
                                  {course.hasScholarship && (
                                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                                      <Award size={11} aria-hidden="true" />
                                      Scholarship
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="mt-3">
                                <span className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white py-2.5 text-[13px] font-semibold text-gray-700 transition-colors group-hover:border-[#C41E3A] group-hover:bg-[#C41E3A] group-hover:text-white group-focus-visible:border-[#C41E3A] group-focus-visible:bg-[#C41E3A] group-focus-visible:text-white">
                                  View Details
                                  <ArrowRight size={14} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </FadeUpItem>
                    )
                  })}
                </FadeUpStagger>
              )}
            </div>

            {/* Pagination */}
            {displayData && displayData.totalPages > 1 && (
              <FadeUp>
                <div className="mt-12 flex flex-col items-center gap-3">
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(page - 1)}
                      disabled={page === 1 || isFetching}
                      aria-label="Previous page"
                    >
                      <ChevronLeft size={16} />
                    </Button>

                    {getPageItems(page, displayData.totalPages).map((item, index) =>
                      item === '...' ? (
                        <span key={`ellipsis-${index}`} className="px-1.5 text-sm font-medium text-gray-400">
                          …
                        </span>
                      ) : (
                        <Button
                          key={item}
                          variant={item === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => goToPage(item)}
                          disabled={isFetching}
                          aria-current={item === page ? 'page' : undefined}
                        >
                          {item}
                        </Button>
                      )
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(page + 1)}
                      disabled={page === displayData.totalPages || isFetching}
                      aria-label="Next page"
                    >
                      <ChevronRight size={16} />
                    </Button>
                  </div>

                  <p className="text-sm text-gray-500">
                    Page {page} of {displayData.totalPages}
                    {isFetching && <span className="ml-2 text-[#C41E3A]">Loading…</span>}
                  </p>
                </div>
              </FadeUp>
            )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <CourseFilters
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        onChange={updateFilters}
        onClear={clearFilters}
        options={filterOptions ?? { countries: [], cities: [], institutions: [], subjects: [], levels: [], startYears: [], feeMax: 0 }}
        resultsCount={displayData?.total ?? 0}
      />

      <Footer />
    </div>
  )
}
