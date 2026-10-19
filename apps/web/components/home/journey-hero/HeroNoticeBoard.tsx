'use client'

import { trpc } from '@/lib/trpc-client'
import { AnimatePresence, motion } from 'framer-motion'
import { Calendar, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

interface DeadlineItem {
  id: string
  universityId: string
  universityName: string
  universitySlug: string
  universityLogo?: string | null
  country?: string | null
  city?: string | null
  courseName?: string | null
  deadline?: string | null
}

const FALLBACK_ITEMS: DeadlineItem[] = [
  {
    id: 'fb-1',
    universityId: 'fb-1',
    universityName: 'Kyungsung University',
    universitySlug: 'kyungsung-university',
    universityLogo: '/universities/Busan University.png',
    country: 'South Korea',
    deadline: '2026-11-30T00:00:00.000Z',
  },
  {
    id: 'fb-2',
    universityId: 'fb-2',
    universityName: 'Busan University of Foreign Studies',
    universitySlug: 'busan-university-of-foreign-studies',
    universityLogo: '/universities/BUFS_logo.jpg',
    country: 'South Korea',
    deadline: '2026-12-15T00:00:00.000Z',
  },
  {
    id: 'fb-3',
    universityId: 'fb-3',
    universityName: 'Kyung Hee University',
    universitySlug: 'kyung-hee-university',
    universityLogo: '/universities/Kyung Hee University.png',
    country: 'South Korea',
    deadline: '2027-01-15T00:00:00.000Z',
  },
  {
    id: 'fb-4',
    universityId: 'fb-4',
    universityName: 'Sejong University',
    universitySlug: 'sejong-university',
    universityLogo: '/universities/Sejong University.png',
    country: 'South Korea',
    deadline: '2027-02-28T00:00:00.000Z',
  },
  {
    id: 'fb-5',
    universityId: 'fb-5',
    universityName: 'Hanseo University',
    universitySlug: 'hanseo-university',
    universityLogo: '/universities/Hanseo University.png',
    country: 'South Korea',
    deadline: '2027-03-31T00:00:00.000Z',
  },
]

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function getUniversityHref(item: DeadlineItem): string {
  if (!item.universitySlug) return '/universities'
  const countrySlug = slugify(item.country || 'South Korea')
  return `/universities/${countrySlug}/${item.universitySlug}`
}

function formatDeadlineDate(dateStr?: string | null): string {
  if (!dateStr) return 'Rolling Admission'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

export function HeroNoticeBoard() {
  const { data: dbItems } = trpc.university.upcomingDeadlines.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })

  const items: DeadlineItem[] = useMemo(() => {
    if (dbItems && dbItems.length > 0) {
      return dbItems
    }
    return FALLBACK_ITEMS
  }, [dbItems])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  // Auto vertical swap timer
  useEffect(() => {
    if (items.length <= 1 || isPaused) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length)
    }, 3800)

    return () => clearInterval(interval)
  }, [items.length, isPaused])

  // Ensure index remains in bounds when items change
  useEffect(() => {
    if (currentIndex >= items.length) {
      setCurrentIndex(0)
    }
  }, [items.length, currentIndex])

  const currentItem = items[currentIndex] || items[0]

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }))
  }

  const hasImageError = Boolean(currentItem && imageErrors[currentItem.id])
  const showLogo = Boolean(currentItem?.universityLogo && !hasImageError)

  return (
    <div
      className="group relative mt-6 flex max-w-xl flex-col"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Upcoming university admission deadlines notice board"
    >
      {/* [Notice] Badge on top */}
      <div className="mb-2.5 flex items-center gap-2">
        <div className="text-md inline-flex items-center gap-1.5 rounded-full py-1 font-bold uppercase tracking-wider text-[#C41E3A]">
          <span className="text-[#101B3D]">Notice</span>
        </div>
      </div>

      {/* Content Card (no background) with vertical swapping */}
      <div className="h-13 relative flex min-w-0 items-center overflow-hidden sm:h-14">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={currentItem.id || currentIndex}
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -24, opacity: 0 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="flex w-full items-center"
          >
            <Link
              href={getUniversityHref(currentItem)}
              className="group/item flex w-full min-w-0 items-center gap-3 text-left transition-transform hover:translate-x-0.5 sm:gap-3.5"
            >
              {/* [ logo ] - larger size */}
              <div className="shadow-2xs relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200/90 bg-white sm:h-12 sm:w-12">
                {showLogo ? (
                  <Image
                    src={currentItem.universityLogo!}
                    alt={currentItem.universityName}
                    width={48}
                    height={48}
                    className="h-full w-full object-contain p-1"
                    onError={() => handleImageError(currentItem.id)}
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#101B3D] to-[#243567] text-xs font-bold text-white sm:text-sm">
                    {getInitials(currentItem.universityName)}
                  </div>
                )}
              </div>

              {/* Uni name | deadline date */}
              <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-2.5">
                <span className="truncate text-sm font-semibold text-[#101B3D] transition-colors group-hover/item:text-[#C41E3A] sm:text-base">
                  {currentItem.universityName}
                </span>

                {/* Separator | */}
                <span className="shrink-0 select-none text-sm font-light text-slate-300 sm:text-base">
                  |
                </span>

                {/* deadline date. */}
                <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-xs font-medium text-slate-600 sm:text-sm">
                  <Calendar size={13} className="shrink-0 text-[#C41E3A]" />
                  <span>
                    Deadline:{' '}
                    <strong className="font-semibold text-[#101B3D]">
                      {formatDeadlineDate(currentItem.deadline)}
                    </strong>
                  </span>
                </span>
              </div>

              {/* Hover arrow hint */}
              <ChevronRight
                size={16}
                className="ml-1 hidden shrink-0 text-slate-400 transition-all group-hover/item:translate-x-0.5 group-hover/item:text-[#C41E3A] sm:block"
              />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
