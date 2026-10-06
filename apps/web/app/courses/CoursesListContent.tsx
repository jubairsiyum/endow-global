'use client'

import {
  ArrowRight,
  Award,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  GraduationCap,
  Heart,
  MapPin,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FaBookOpen } from 'react-icons/fa6'
import { toast } from 'sonner'

import { FadeUp, FadeUpItem, FadeUpStagger } from '@/components/home/FadeUp'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/button'
import { useSession } from '@/lib/auth-client'
import { trpc } from '@/lib/trpc-client'
import { useRouter } from 'next/navigation'
import { CourseFilters, FilterPanel } from './CourseFilters'
import type { CourseFilters as Filters } from './filter-utils'
import { EMPTY_FILTERS, countActiveFilters, serializeFilters } from './filter-utils'

const levelLabels: Record<string, string> = {
  UNDERGRADUATE: 'Undergraduate',
  POSTGRADUATE: 'Postgraduate',
  PHD: 'PhD',
  DIPLOMA: 'Diploma',
  CERTIFICATE: 'Certificate',
  FOUNDATION: 'Foundation',
}

function formatTuitionDisplay(
  amount: number | null | undefined,
  currency: string | null | undefined
): { display: string | null; code: string | null } {
  if (amount == null || amount === 0) return { display: null, code: null }
  const code = (currency || 'USD').toUpperCase()
  try {
    const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: code }).format(
      amount
    )
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

export default function CoursesListContent({
  initialData,
  initialFilters,
  initialQuery,
  initialSort,
}: CoursesListContentProps) {
  const [page, setPage] = useState(initialData.page)

  const [search, setSearch] = useState(initialQuery ?? '')
  const [debouncedSearch, setDebouncedSearch] = useState(initialQuery ?? '')
  const [filters, setFilters] = useState<Filters>(initialFilters ?? EMPTY_FILTERS)
  const [sort, setSort] = useState<SortValue>(initialSort ?? 'recommended')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filtersTouched, setFiltersTouched] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()
  const [favorites, setFavorites] = useState<Record<string, boolean>>({})

  const { data: shortlistedIds } = trpc.dashboard.shortlist.ids.useQuery(undefined, {
    enabled: !!session,
  })

  const addShortlist = trpc.dashboard.shortlist.add.useMutation()
  const removeShortlist = trpc.dashboard.shortlist.remove.useMutation()
  const utils = trpc.useUtils()

  useEffect(() => {
    if (shortlistedIds) {
      const map: Record<string, boolean> = {}
      shortlistedIds.forEach((id: string) => {
        map[id] = true
      })
      setFavorites(map)
    }
  }, [shortlistedIds])

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
      window.history.replaceState(
        window.history.state,
        '',
        `/courses${params.toString() ? `?${params.toString()}` : ''}`
      )
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
    (
      nextPage: number,
      nextFilters: Filters,
      nextSort: SortValue,
      nextSearch: string = debouncedSearch
    ) => {
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
        remove: () =>
          updateFilters({ ...filters, countries: filters.countries.filter((x) => x !== c) }),
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
        remove: () =>
          updateFilters({ ...filters, subjects: filters.subjects.filter((x) => x !== s) }),
      })
    )
    filters.institutionIds.forEach((id) => {
      const inst = filterOptions?.institutions.find((u) => u.id === id)
      chips.push({
        key: `inst-${id}`,
        label: inst?.name ?? id,
        remove: () =>
          updateFilters({
            ...filters,
            institutionIds: filters.institutionIds.filter((x) => x !== id),
          }),
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

  const handleToggleFavorite = async (e: React.MouseEvent, courseId: string) => {
    e.preventDefault()
    e.stopPropagation()

    if (!session) {
      router.push('/login')
      return
    }

    const isCurrentlyFav = favorites[courseId]

    // Optimistic UI update
    setFavorites((prev) => ({
      ...prev,
      [courseId]: !isCurrentlyFav,
    }))

    try {
      if (isCurrentlyFav) {
        await removeShortlist.mutateAsync({ courseId })
        toast.success('Removed from shortlist')
      } else {
        await addShortlist.mutateAsync({ courseId })
        toast.success('Saved to shortlist')
      }
      await utils.dashboard.shortlist.list.invalidate()
    } catch (error: unknown) {
      // Revert state if error occurs
      setFavorites((prev) => ({
        ...prev,
        [courseId]: isCurrentlyFav,
      }))
      toast.error(error instanceof Error ? error.message : 'Could not update shortlist')
    }
  }

  return (
    <div className="flex w-full flex-col overflow-x-clip">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#FDFDFF] to-[#F4F6FB]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-rose-50/70 blur-[120px]" />
          <div className="absolute -right-24 top-32 h-72 w-72 rounded-full bg-blue-50/60 blur-3xl" />
          <div className="absolute -left-24 top-48 h-72 w-72 rounded-full bg-amber-50/50 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="pb-6 pt-4 lg:pb-8">
            <Navbar />
          </div>

          <div className="pb-14 pt-16 lg:pb-20 lg:pt-24">
            <FadeUp>
              <div className="text-center">
                <span className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-[#9C0D0D]/20 bg-white/70 px-4 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#9C0D0D] shadow-[0_1px_2px_rgba(17,24,39,0.04)]">
                  <FaBookOpen size={18} style={{ color: 'rgb(156, 13, 13)' }} />
                  Course Catalog
                </span>
                <h1 className="text-[32px] font-extrabold leading-[1.12] tracking-tight text-gray-950 sm:text-[38px] lg:text-[50px]">
                  Find Your <span className="text-[#C41E3A]">Perfect Course</span>
                </h1>
                <span
                  className="mx-auto mt-6 block h-[3px] w-20 rounded-full bg-gradient-to-r from-[#C41E3A] via-[#B8934A] to-[#C41E3A]"
                  aria-hidden="true"
                />
                <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 sm:text-xl">
                  Browse thousands of programs from partner universities worldwide
                </p>
              </div>
            </FadeUp>

            {/* Search Bar */}
            <FadeUp>
              <div className="mx-auto mt-8 max-w-3xl">
                <div className="flex items-center gap-3 rounded-full border border-gray-200 bg-white px-5 py-3 shadow-[0_2px_10px_rgba(17,24,39,0.05)] transition-all focus-within:border-[#C41E3A]/40 focus-within:shadow-[0_4px_22px_rgba(196,30,58,0.12)] focus-within:ring-2 focus-within:ring-[#C41E3A]/10 sm:px-6 sm:py-3.5">
                  <Search size={20} className="shrink-0 text-gray-400" aria-hidden="true" />
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
                    className="w-full border-0 bg-transparent p-0 text-base text-gray-900 outline-none placeholder:text-gray-500 sm:text-[17px]"
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
                    className="hidden shrink-0 rounded-full bg-[#C41E3A] px-7 py-2.5 text-[15px] font-semibold text-white shadow-[0_2px_10px_rgba(196,30,58,0.25)] transition-colors hover:bg-[#A01830] sm:inline-flex"
                    aria-label="Search courses"
                  >
                    Search
                  </Button>
                </div>

                {/* Popular searches — act as subject filters */}
                {popularSearches && popularSearches.length > 0 && (
                  <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                    <span className="text-base font-medium text-gray-500">Popular:</span>
                    {popularSearches.map((term) => {
                      const isActive = filters.subjects.includes(term)
                      return (
                        <button
                          key={term}
                          aria-pressed={isActive}
                          onClick={() => {
                            const nextSubjects = isActive
                              ? filters.subjects.filter((s) => s !== term)
                              : [...filters.subjects, term]
                            updateFilters({ ...filters, subjects: nextSubjects })
                          }}
                          className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                            isActive
                              ? 'border-[#C41E3A] bg-[#C41E3A] text-white shadow-[0_2px_10px_rgba(196,30,58,0.25)]'
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
              <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-gray-200/70 bg-white px-4 py-8 shadow-[0_1px_2px_rgba(17,24,39,0.04),0_16px_40px_-26px_rgba(17,24,39,0.22)] sm:px-8">
                <div className="flex flex-wrap items-stretch gap-4 divide-gray-100 md:flex-nowrap md:divide-x">
                  {[
                    { value: `${displayData?.total ?? initialData.total}`, label: 'Courses' },
                    { value: `${filterOptions?.institutions.length ?? 0}`, label: 'Universities' },
                    { value: `${filterOptions?.countries.length ?? 0}`, label: 'Countries' },
                    { value: '98%', label: 'Visa Success' },
                  ].map((s, i) => (
                    <div key={i} className="flex-1 px-3 text-center">
                      <p
                        className={`text-2xl font-extrabold tabular-nums leading-none tracking-tight sm:text-3xl ${
                          i === 3 ? 'text-[#C41E3A]' : 'text-gray-900'
                        }`}
                      >
                        {s.value}
                      </p>
                      <p className="text-md mt-3 font-medium uppercase tracking-[0.12em] text-gray-500 sm:text-sm">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      <main className="flex-grow bg-gray-50">
        {/* Filters (sidebar) + Results */}
        <section className="py-8 lg:py-12">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-[270px_minmax(0,1fr)] lg:items-start lg:gap-6">
              {/* Filters sidebar (desktop) - Made slightly narrower */}
              <aside className="sticky top-24 hidden lg:block">
                <div className="flex max-h-[calc(100vh-6rem)] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_12px_36px_-18px_rgba(17,24,39,0.22)]">
                  <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-5 py-4">
                    <h3 className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-gray-900">
                      <span
                        className="h-5 w-1 rounded-full bg-gradient-to-b from-[#C41E3A] to-[#B8934A]"
                        aria-hidden="true"
                      />
                      Filters
                    </h3>
                    {activeFilterCount > 0 && (
                      <button
                        onClick={clearFilters}
                        className="text-base font-medium text-[#C41E3A] transition-colors hover:underline"
                      >
                        Reset all
                      </button>
                    )}
                  </div>
                  <div
                    data-lenis-prevent
                    className="filter-scroll min-h-0 flex-1 overflow-y-auto px-4 py-2"
                  >
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

              {/* Results - Expanded width */}
              <div className="min-w-0">
                {/* Results toolbar */}
                <div className="mb-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-3 border-b border-gray-200 pb-4">
                      <h2
                        className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-gray-900 sm:text-[22px]"
                        aria-live="polite"
                      >
                        <span
                          className="h-5 w-1 rounded-full bg-gradient-to-b from-[#C41E3A] to-[#B8934A]"
                          aria-hidden="true"
                        />
                        <span>
                          {displayData
                            ? `${displayData.total} ${displayData.total === 1 ? 'course' : 'courses'} found`
                            : 'Courses'}
                          {isFetching && !isLoading && (
                            <span className="ml-2 text-base font-normal text-[#C41E3A]">
                              Updating…
                            </span>
                          )}
                        </span>
                      </h2>
                      {/* Desktop sort */}
                      <div className="hidden items-center gap-2 lg:flex">
                        <label
                          htmlFor="sort-desktop"
                          className="text-base font-medium text-gray-500"
                        >
                          Sort:
                        </label>
                        <div className="relative">
                          <select
                            id="sort-desktop"
                            value={sort}
                            onChange={(e) => handleSortChange(e.target.value as SortValue)}
                            className="appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-4 pr-9 text-base font-medium text-gray-700 outline-none transition-colors hover:border-gray-300 focus:border-[#C41E3A] focus:ring-2 focus:ring-[#C41E3A]/10"
                          >
                            {SORT_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={16}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Mobile toolbar: Filters + Sort */}
                    <div className="flex items-center gap-2 lg:hidden">
                      <button
                        onClick={() => setFiltersOpen(true)}
                        aria-label={`Open filters${activeFilterCount ? `, ${activeFilterCount} active` : ''}`}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-base font-semibold text-gray-700 shadow-sm transition-colors hover:border-gray-300 hover:text-[#C41E3A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C41E3A] focus-visible:ring-offset-1"
                      >
                        <SlidersHorizontal size={18} aria-hidden="true" />
                        Filters
                        {activeFilterCount > 0 && (
                          <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-[#C41E3A] px-1.5 text-sm font-bold text-white">
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
                          className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-4 pr-9 text-base font-medium text-gray-700 outline-none transition-colors hover:border-gray-300 focus:border-[#C41E3A] focus:ring-2 focus:ring-[#C41E3A]/10"
                        >
                          {SORT_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={16}
                          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                          aria-hidden="true"
                        />
                      </div>
                    </div>

                    {activeFilterChips.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2">
                        {activeFilterChips.map((chip) => (
                          <button
                            key={chip.key}
                            onClick={chip.remove}
                            aria-label={`Remove filter ${chip.label}`}
                            className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:border-[#C41E3A]/40 hover:text-[#C41E3A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C41E3A] focus-visible:ring-offset-1"
                          >
                            {chip.label}
                            <X size={14} className="text-gray-400" aria-hidden="true" />
                          </button>
                        ))}
                        <button
                          onClick={clearFilters}
                          className="rounded text-sm font-semibold text-[#C41E3A] transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C41E3A] focus-visible:ring-offset-1"
                        >
                          Clear all
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Results Grid - Adjusted columns for better card width */}
                <div ref={resultsRef} className="scroll-mt-24">
                  {isError ? (
                    <div className="mx-auto max-w-xl rounded-2xl border border-red-100 bg-white p-10 text-center shadow-[0_16px_44px_-22px_rgba(17,24,39,0.25)]">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
                        <X size={26} aria-hidden="true" />
                      </div>
                      <h3 className="mt-5 text-[22px] font-bold tracking-tight text-gray-900">
                        Unable to load courses
                      </h3>
                      <p className="mx-auto mt-2.5 max-w-md text-base leading-7 text-gray-500">
                        Something went wrong while loading the course catalog. Please try again.
                      </p>
                      <button
                        onClick={() => window.location.reload()}
                        className="mt-7 inline-flex items-center justify-center rounded-full bg-[#C41E3A] px-7 py-3 text-base font-semibold text-white shadow-[0_4px_16px_rgba(196,30,58,0.28)] transition-colors hover:bg-[#A01830] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C41E3A] focus-visible:ring-offset-2"
                      >
                        Try again
                      </button>
                    </div>
                  ) : isLoading ? (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex flex-col overflow-hidden rounded-2xl border border-gray-200/70 bg-white"
                        >
                          <div className="p-5">
                            <div className="flex items-start gap-3.5">
                              <div className="h-12 w-12 shrink-0 animate-pulse rounded-xl bg-gray-100" />
                              <div className="flex-1 space-y-2">
                                <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
                                <div className="h-3 w-1/2 animate-pulse rounded bg-gray-100" />
                              </div>
                              <div className="h-7 w-16 animate-pulse rounded-md bg-gray-100" />
                            </div>
                            <div className="mt-4 h-5 w-3/4 animate-pulse rounded bg-gray-100" />
                            <div className="mt-2 h-5 w-1/2 animate-pulse rounded bg-gray-100" />
                            <div className="mt-4 flex gap-2">
                              <div className="h-7 w-20 animate-pulse rounded-md bg-gray-100" />
                              <div className="h-7 w-16 animate-pulse rounded-md bg-gray-100" />
                            </div>
                            <div className="mt-auto border-t border-gray-100 pt-5">
                              <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
                              <div className="mt-2.5 h-7 w-32 animate-pulse rounded bg-gray-100" />
                              <div className="mt-4 h-11 animate-pulse rounded-lg bg-gray-100" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : displayData?.hits.length === 0 ? (
                    <div className="mx-auto max-w-2xl rounded-3xl border border-gray-100 bg-white p-10 text-center shadow-[0_16px_44px_-22px_rgba(17,24,39,0.25)]">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#C41E3A]/10 bg-rose-50 text-[#C41E3A]">
                        <GraduationCap className="h-8 w-8" />
                      </div>
                      <h3 className="mt-5 text-[22px] font-bold tracking-tight text-gray-900">
                        No courses match your criteria
                      </h3>
                      <p className="mx-auto mt-2.5 max-w-md text-base leading-7 text-gray-500">
                        Try adjusting your filters or explore our popular study subjects below.
                      </p>

                      <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
                        {['Computer Science', 'Business', 'Engineering', 'Healthcare'].map((s) => (
                          <button
                            key={s}
                            onClick={() => {
                              setSearch('')
                              updateFilters({ ...filters, subjects: [s] })
                            }}
                            className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-[#C41E3A] hover:bg-rose-50 hover:text-[#C41E3A]"
                          >
                            {s}
                          </button>
                        ))}
                        <button
                          onClick={() => {
                            setSearch('')
                            clearFilters()
                          }}
                          className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-200"
                        >
                          Clear All Filters
                        </button>
                      </div>

                      <div className="border-[#C41E3A]/12 mt-9 rounded-2xl border bg-gradient-to-br from-rose-50/70 to-white p-6">
                        <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#C41E3A]">
                          Need Direct Assistance?
                        </p>
                        <p className="mx-auto mt-2 max-w-sm text-base font-medium leading-7 text-gray-800">
                          Our advisors can find & match courses directly for you in South Korea &
                          Australia.
                        </p>
                        <Link
                          href="/register"
                          className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#C41E3A] px-6 py-3 text-sm font-bold text-white shadow-[0_4px_16px_rgba(196,30,58,0.28)] transition-colors hover:bg-[#A01830]"
                        >
                          Get Free Course Matching <ArrowRight size={15} />
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <FadeUpStagger
                      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
                      amount={0.08}
                    >
                      {displayData?.hits.map((course) => {
                        const courseUrl = course.universitySlug
                          ? `/institutions/${course.universitySlug}/${(course.level || 'postgraduate').toLowerCase()}/${course.slug}`
                          : `/courses/${course.slug}`
                        const tuition = formatTuitionDisplay(
                          course.tuitionFee as unknown as number,
                          course.currency
                        )
                        const hasTuition = tuition.display !== null
                        return (
                          <FadeUpItem key={course.id} className="flex">
                            <div className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)]">
                              {/* Heart Icon Button */}
                              <button
                                type="button"
                                onClick={(e) => handleToggleFavorite(e, course.id)}
                                aria-label="Save to shortlist"
                                className="absolute right-4 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-white/90 text-gray-500 shadow-sm backdrop-blur-md transition-transform duration-200 hover:scale-110 hover:text-[#C41E3A]"
                              >
                                <Heart
                                  size={18}
                                  className={
                                    favorites[course.id]
                                      ? 'fill-[#C41E3A] text-[#C41E3A]'
                                      : 'text-gray-400 group-hover:text-[#C41E3A]'
                                  }
                                />
                              </button>

                              <Link
                                href={courseUrl}
                                aria-label={`View ${course.name} at ${course.universityName}`}
                                className="flex h-full w-full flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C41E3A] focus-visible:ring-offset-2"
                              >
                                {/* Header: Logo + University + Location */}
                                <div className="flex items-start gap-4 p-6 pb-4 pr-14">
                                  {course.universityLogo ? (
                                    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-gray-100 bg-gray-50/80 p-2.5 shadow-sm">
                                      <img
                                        src={course.universityLogo}
                                        alt=""
                                        aria-hidden="true"
                                        className="h-full w-full object-contain"
                                        loading="lazy"
                                      />
                                    </div>
                                  ) : (
                                    <div
                                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-gray-100 bg-rose-50 text-[#C41E3A]"
                                      aria-hidden="true"
                                    >
                                      <GraduationCap size={24} />
                                    </div>
                                  )}

                                  <div className="min-w-0 flex-1 pt-0.5">
                                    <p className="line-clamp-1 text-sm font-bold uppercase tracking-wider text-gray-400">
                                      {course.universityName || 'University'}
                                    </p>
                                    <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-gray-600">
                                      <MapPin
                                        size={13}
                                        className="shrink-0 text-[#C41E3A]"
                                        aria-hidden="true"
                                      />
                                      <span className="truncate">
                                        {course.universityCity ? `${course.universityCity}, ` : ''}
                                        {course.universityCountry || 'International'}
                                      </span>
                                    </p>
                                    <div className="mt-2.5">
                                      <span className="inline-flex rounded-full bg-rose-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#C41E3A]">
                                        {levelLabels[course.level] ?? course.level}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Body: Course Name & Meta */}
                                <div className="flex flex-1 flex-col px-6 pb-6 pt-2">
                                  <h3 className="line-clamp-2 min-h-[3.6rem] text-[18px] font-bold leading-snug text-gray-900 transition-colors group-hover:text-[#C41E3A]">
                                    {course.name}
                                  </h3>

                                  <div className="mt-4 flex flex-wrap gap-2">
                                    {course.duration ? (
                                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100/70 px-3 py-1.5 text-xs font-semibold text-gray-700">
                                        <Clock
                                          size={13}
                                          className="text-gray-400"
                                          aria-hidden="true"
                                        />
                                        {course.duration}{' '}
                                        {course.durationUnit?.toLowerCase() || 'year'}
                                      </span>
                                    ) : null}
                                    {course.language && (
                                      <span className="inline-flex items-center rounded-lg bg-gray-100/70 px-3 py-1.5 text-xs font-semibold text-gray-700">
                                        {course.language}
                                      </span>
                                    )}
                                  </div>

                                  {/* Footer: Tuition & Action */}
                                  <div className="mt-auto pt-6">
                                    <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                                      <div className="min-w-0">
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                          Annual tuition
                                        </p>
                                        {hasTuition ? (
                                          <p className="mt-1 flex items-baseline gap-1.5">
                                            <span className="text-[20px] font-extrabold tracking-tight text-gray-900">
                                              {tuition.display}
                                            </span>
                                            {tuition.code && (
                                              <span className="text-xs font-bold text-gray-400">
                                                {tuition.code}
                                              </span>
                                            )}
                                          </p>
                                        ) : (
                                          <p className="mt-1 text-sm font-semibold text-gray-600">
                                            Contact university
                                          </p>
                                        )}
                                      </div>

                                      {course.hasScholarship && (
                                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-200/60 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 shadow-sm">
                                          <Award size={12} aria-hidden="true" />
                                          Scholarship
                                        </span>
                                      )}
                                    </div>

                                    {/* Action Button */}
                                    <div className="mt-5">
                                      <span className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 text-sm font-semibold text-white transition-all duration-300 group-hover:bg-[#C41E3A] group-hover:shadow-[0_4px_16px_rgba(196,30,58,0.25)]">
                                        View Course Details
                                        <ArrowRight
                                          size={15}
                                          aria-hidden="true"
                                          className="transition-transform duration-300 group-hover:translate-x-1"
                                        />
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            </div>
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
                          className="h-11 w-11 p-0"
                          onClick={() => goToPage(page - 1)}
                          disabled={page === 1 || isFetching}
                          aria-label="Previous page"
                        >
                          <ChevronLeft size={18} />
                        </Button>

                        {getPageItems(page, displayData.totalPages).map((item, index) =>
                          item === '...' ? (
                            <span
                              key={`ellipsis-${index}`}
                              className="px-2 text-base font-medium text-gray-500"
                            >
                              …
                            </span>
                          ) : (
                            <Button
                              key={item}
                              variant={item === page ? 'default' : 'outline'}
                              size="sm"
                              className="h-11 min-w-11 px-4 text-base"
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
                          className="h-11 w-11 p-0"
                          onClick={() => goToPage(page + 1)}
                          disabled={page === displayData.totalPages || isFetching}
                          aria-label="Next page"
                        >
                          <ChevronRight size={18} />
                        </Button>
                      </div>

                      <p className="text-base text-gray-500">
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
        resultsCount={displayData?.total ?? 0}
      />

      <Footer />
    </div>
  )
}
