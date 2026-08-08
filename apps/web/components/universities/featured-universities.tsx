'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, type Variants } from 'framer-motion'
import { ArrowRight, Landmark, MapPin, Building2 } from 'lucide-react'
import { trpc } from '@/lib/trpc-client'

type UniversityCardData = {
  id: string
  name: string
  country: string
  city: string
  logo: string | null
  ranking: number | null
  description: string | null
  slug: string
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}

function UniversityCard({ uni }: { uni: UniversityCardData }) {
  const [imgError, setImgError] = useState(false)

  return (
    <motion.article
      variants={cardVariants}
      whileHover={{ y: -6, transition: { duration: 0.25, ease: 'easeOut' } }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:border-[#C41E3A]/20 hover:shadow-[0_20px_60px_rgba(196,30,58,0.10)]"
    >
      <div className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-[#8B0E1A] via-[#A91324] to-[#C9A15B] transition-transform duration-500 ease-out group-hover:scale-x-100" />

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start gap-4">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm flex items-center justify-center">
            {uni.logo && !imgError ? (
              <img
                src={uni.logo}
                alt={`${uni.name} logo`}
                className="h-full w-full object-contain p-1.5"
                onError={() => setImgError(true)}
              />
            ) : (
              <Building2 className="h-6 w-6 text-slate-300" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold leading-snug text-[#111827] line-clamp-2">
              {uni.name}
            </h3>
            <p className="mt-1 text-sm font-medium text-slate-500">
              {uni.city ? `${uni.city}, ` : ''}{uni.country}
            </p>
          </div>
        </div>

        {uni.description && (
          <p className="mt-3 text-xs leading-relaxed text-slate-400 line-clamp-2">{uni.description.replace(/<[^>]*>/g, '').slice(0, 120)}</p>
        )}

        <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-[#C9A15B]" />
          <span>{uni.country}</span>
          {uni.ranking && <span className="ml-auto text-[10px] text-[#C41E3A]">#{uni.ranking}</span>}
        </div>

        <div className="mt-auto flex items-end justify-between border-t border-slate-100 pt-4">
          <Link
            href={`/universities/${uni.country.toLowerCase().replace(/\s+/g, '-')}/${uni.slug}`}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-all duration-300 group-hover:border-[#C41E3A] group-hover:bg-[#C41E3A] group-hover:text-white"
            aria-label={`View ${uni.name}`}
          >
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </motion.article>
  )
}

function Skeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-52 animate-pulse rounded-2xl bg-slate-100" />
      ))}
    </div>
  )
}

export default function FeaturedUniversities() {
  const { data: universities, isLoading } = trpc.university.featured.useQuery()

  return (
    <section className="relative overflow-hidden bg-white px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
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
            Featured Universities
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
            Partner <span className="text-[#C41E3A]">Universities</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-500">
            Handpicked universities offering world-class education, exclusive scholarships, and
            guaranteed visa support — all in one place
          </p>
        </motion.div>

        {isLoading ? (
          <Skeleton />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {(universities ?? []).map((uni) => (
              <UniversityCard key={uni.id} uni={uni} />
            ))}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="mt-12 flex justify-center"
        >
          <Link
            href="/universities"
            className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#760B16] via-[#8B0E1A] to-[#A91324] px-9 py-4 text-sm font-bold text-white shadow-[0_18px_45px_rgba(201,161,91,0.34)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:shadow-[0_24px_60px_rgba(201,161,91,0.48)] sm:px-11"
          >
            <Landmark className="h-[18px] w-[18px] text-white" strokeWidth={2.2} />
            <span>View All Universities</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
