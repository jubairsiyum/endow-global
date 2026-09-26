'use client'

import { motion } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight, Landmark, MoreHorizontal, SearchX } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { trpc } from '@/lib/trpc-client'
import { UniversityCard, UniversityCardSkeleton, containerVariants } from '@/components/universities/UniversityCard'

type PageItem = number | 'ellipsis'

function getPageItems(page: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1)

  const items: PageItem[] = [1]
  if (page > 3) items.push('ellipsis')
  for (let current = Math.max(2, page - 1); current <= Math.min(totalPages - 1, page + 1); current += 1) {
    items.push(current)
  }
  if (page < totalPages - 2) items.push('ellipsis')
  items.push(totalPages)
  return items
}

export default function FeaturedUniversities() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const requestedPage = Number(searchParams.get('page') || 1)
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1
  const q = searchParams.get('q') || undefined
  const country = searchParams.get('country') || undefined
  const level = searchParams.get('level') || searchParams.get('degree') || undefined
  const perPage = 9

  const { data, isLoading, isFetching, isError } = trpc.university.list.useQuery({
    page,
    perPage,
    q,
    country,
    level,
  })

  const universities = data?.universities ?? []
  const total = data?.total ?? 0
  const totalPages = data?.totalPages ?? 1
  const pageItems = getPageItems(page, totalPages)

  useEffect(() => {
    if (!data || page <= data.totalPages) return

    const params = new URLSearchParams(searchParams.toString())
    if (data.totalPages === 1) params.delete('page')
    else params.set('page', String(data.totalPages))
    const queryString = params.toString()
    router.replace(queryString ? `/universities?${queryString}` : '/universities', { scroll: false })
  }, [data, page, router, searchParams])

  function goToPage(nextPage: number) {
    const safePage = Math.max(1, Math.min(nextPage, totalPages))
    const params = new URLSearchParams(searchParams.toString())
    if (safePage === 1) params.delete('page')
    else params.set('page', String(safePage))
    const queryString = params.toString()
    router.push(queryString ? `/universities?${queryString}` : '/universities', { scroll: false })

    requestAnimationFrame(() => {
      document.getElementById('partner-universities')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  return (
    <section id="partner-universities" className="relative scroll-mt-24 overflow-hidden bg-white px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-28 -top-28 h-[420px] w-[420px] rounded-full bg-red-50/60 blur-3xl" />
        <div className="absolute -right-24 top-8 h-[520px] w-[520px] rounded-full bg-rose-50/40 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-80px' }}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#C41E3A] shadow-sm">
            Partner Universities
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
            Explore <span className="text-[#C41E3A]">Universities</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600">
            Explore partner universities offering world-class education, exclusive scholarships, and
            guaranteed visa support — all in one place.
          </p>
          {!isLoading && total > 0 && (
            <p className="mt-3 text-sm font-medium text-gray-400">
              Showing <span className="text-gray-700">{(page - 1) * perPage + 1}–{Math.min(page * perPage, total)}</span> of {total} universities
            </p>
          )}
        </motion.div>

        {isLoading ? (
          <UniversityCardSkeleton />
        ) : isError ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-10 text-center">
            <p className="text-base font-semibold text-amber-800">University information is temporarily unavailable.</p>
            <p className="mt-1 text-sm text-amber-700">Please try again shortly.</p>
          </div>
        ) : universities.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/70 px-6 py-14 text-center">
            <SearchX className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-4 text-base font-semibold text-gray-700">No universities found</p>
            <p className="mt-1 text-sm text-gray-500">Try clearing your filters or searching for a different destination.</p>
            <Link href="/universities/search" className="mt-5 inline-flex rounded-full bg-[#C41E3A] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#A01830]">
              Search universities
            </Link>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className={`grid grid-cols-1 gap-5 transition-opacity sm:grid-cols-2 lg:grid-cols-3 ${isFetching ? 'opacity-60' : 'opacity-100'}`}
          >
            {universities.map((uni) => (
              <UniversityCard key={uni.id} uni={uni} />
            ))}
          </motion.div>
        )}

        {!isLoading && !isError && totalPages > 1 && (
          <nav aria-label="University pages" className="mt-12 flex flex-col items-center justify-between gap-5 border-t border-gray-100 pt-6 sm:flex-row">
            <p className="text-sm text-gray-500">
              Page <span className="font-semibold text-gray-900">{page}</span> of <span className="font-semibold text-gray-900">{totalPages}</span>
            </p>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1 || isFetching}
                aria-label="Previous page"
                className="inline-flex h-10 items-center gap-1 rounded-full border border-gray-200 bg-white px-3.5 text-sm font-semibold text-gray-600 transition-all hover:border-[#C41E3A]/30 hover:bg-[#FFF5F6] hover:text-[#C41E3A] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>
              <div className="flex items-center gap-1">
                {pageItems.map((item, index) => item === 'ellipsis' ? (
                  <span key={`ellipsis-${index}`} className="flex h-10 w-7 items-center justify-center text-gray-400" aria-hidden="true">
                    <MoreHorizontal className="h-4 w-4" />
                  </span>
                ) : (
                  <button
                    type="button"
                    key={item}
                    onClick={() => goToPage(item)}
                    disabled={isFetching}
                    aria-label={`Go to page ${item}`}
                    aria-current={item === page ? 'page' : undefined}
                    className={`h-10 min-w-10 rounded-full px-2.5 text-sm font-semibold transition-all ${item === page ? 'bg-[#C41E3A] text-white shadow-[0_8px_20px_rgba(196,30,58,0.22)]' : 'border border-gray-200 bg-white text-gray-600 hover:border-[#C41E3A]/30 hover:bg-[#FFF5F6] hover:text-[#C41E3A]'} disabled:cursor-not-allowed disabled:opacity-50`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages || isFetching}
                aria-label="Next page"
                className="inline-flex h-10 items-center gap-1 rounded-full border border-gray-200 bg-white px-3.5 text-sm font-semibold text-gray-600 transition-all hover:border-[#C41E3A]/30 hover:bg-[#FFF5F6] hover:text-[#C41E3A] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </nav>
        )}

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="mt-12 flex justify-center"
        >
          <Link
            href="/universities/search"
            className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#760B16] via-[#8B0E1A] to-[#A91324] px-9 py-4 text-sm font-bold text-white shadow-[0_18px_45px_rgba(201,161,91,0.34)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:shadow-[0_24px_60px_rgba(201,161,91,0.48)] sm:px-11"
          >
            <Landmark className="h-[18px] w-[18px] text-white" strokeWidth={2.2} />
            <span>Search by Program</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
