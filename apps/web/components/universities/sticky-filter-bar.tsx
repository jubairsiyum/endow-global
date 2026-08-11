'use client'

import { motion } from 'framer-motion'
import { Search, DollarSign, Sparkles, Filter, Globe } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function StickyFilterBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchVal, setSearchVal] = useState(searchParams.get('q') || '')
  const [countryFilter, setCountryFilter] = useState(searchParams.get('country') || '')
  const [degreeFilter, setDegreeFilter] = useState(searchParams.get('degree') || '')

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 600)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setSearchVal(searchParams.get('q') || '')
    setCountryFilter(searchParams.get('country') || '')
  }, [searchParams])

  const applyFilters = () => {
    const p = new URLSearchParams()
    if (searchVal.trim()) p.set('q', searchVal.trim())
    if (countryFilter) p.set('country', countryFilter)
    if (degreeFilter) p.set('degree', degreeFilter)
    router.replace(`/universities?${p.toString()}`, { scroll: false })
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    applyFilters()
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 600)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="pointer-events-none fixed bottom-6 left-1/2 z-40 w-full max-w-2xl -translate-x-1/2"
    >
      <motion.div
        layout
        className="pointer-events-auto mx-4 overflow-hidden rounded-full border border-gray-200 bg-white/90 shadow-[0_14px_44px_rgba(15,23,42,0.12)] backdrop-blur-md"
      >
        <form onSubmit={handleSearchSubmit} className="flex h-14 items-center gap-3 px-4">
          {/* Search Input */}
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <Search className="h-4 w-4 shrink-0 text-[#C41E3A]" />
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search universities..."
              className="flex-1 bg-transparent text-sm text-gray-950 placeholder-gray-500 outline-none"
            />
          </div>

          {/* Quick Filters */}
          {!isExpanded && (
            <div className="hidden items-center gap-2 sm:flex">
              <button type="button" className="flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-[#C41E3A] transition-colors hover:bg-red-100">
                <Globe className="h-3 w-3" />
                Country
              </button>
              <button type="button" className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 transition-colors hover:bg-red-50 hover:text-[#C41E3A]">
                <DollarSign className="h-3 w-3" />
                Budget
              </button>
              <button type="button" className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 transition-colors hover:bg-red-50 hover:text-[#C41E3A]">
                <Sparkles className="h-3 w-3" />
                Scholarship
              </button>
            </div>
          )}

          {/* Expand Button */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="rounded-full bg-gradient-to-r from-red-600 to-rose-500 p-2 text-white shadow-[0_8px_22px_rgba(196,30,58,0.20)] transition-transform hover:scale-105"
          >
            <Filter className="h-4 w-4" />
          </button>
        </form>

        {/* Expanded Filters */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 border-t border-red-100 bg-white/95 p-5"
          >
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {/* Country Filter */}
              <select
                aria-label="Filter by country"
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-[#C41E3A] focus:outline-none"
              >
                <option value="">Any Country</option>
                <option value="South Korea">South Korea</option>
                <option value="Australia">Australia</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
                <option value="Canada">Canada</option>
              </select>

              {/* Budget Filter */}
              <select aria-label="Filter by budget" className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-[#C41E3A] focus:outline-none">
                <option value="">All Budgets</option>
                <option value="1">Under $20k</option>
                <option value="2">$20k - $40k</option>
                <option value="3">$40k - $60k</option>
                <option value="4">$60k+</option>
              </select>

              {/* Scholarship Filter */}
              <select aria-label="Filter by scholarship" className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-[#C41E3A] focus:outline-none">
                <option value="">All Scholarships</option>
                <option value="50">50%+</option>
                <option value="75">75%+</option>
                <option value="100">100%</option>
              </select>

              {/* Degree Level */}
              <select
                aria-label="Filter by degree level"
                value={degreeFilter}
                onChange={(e) => setDegreeFilter(e.target.value)}
                className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-[#C41E3A] focus:outline-none"
              >
                <option value="">All Levels</option>
                <option value="bachelor">Bachelor&apos;s</option>
                <option value="master">Master&apos;s</option>
                <option value="phd">PhD</option>
              </select>
            </div>

            {/* Filter Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => { setSearchVal(''); setCountryFilter(''); setDegreeFilter(''); setIsExpanded(false); router.replace('/universities', { scroll: false }) }}
                className="h-10 flex-1 rounded-lg border border-gray-200 px-4 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => { applyFilters(); setIsExpanded(false) }}
                className="h-10 flex-1 rounded-lg bg-gradient-to-r from-red-600 to-rose-500 px-4 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(196,30,58,0.18)] transition-shadow hover:shadow-red-200"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}
