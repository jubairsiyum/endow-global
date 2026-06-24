'use client'

import Link from "next/link"
import Image from "next/image"
import { motion, type Variants } from "framer-motion"
import { ArrowRight, Landmark, MapPin } from "lucide-react"
import ScrollFloat from "@/components/animations/ScrollFloat"
import { ROUTES } from "@/lib/config/routes"
import {
  universityOpportunities,
  type UniversityOpportunity,
} from "@/lib/data/university-opportunities"

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.12,
    },
  },
}

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 26,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: 'easeOut',
    },
  },
}

function UniversityCard({ opportunity }: { opportunity: UniversityOpportunity }) {
  return (
    <motion.article
      variants={cardVariants}
      whileHover={{
        y: -6,
        transition: {
          duration: 0.25,
          ease: 'easeOut',
        },
      }}
      className="group relative h-[118px] overflow-hidden rounded-[20px] border border-[#F1F5F9] bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.055)] transition-shadow duration-300 hover:shadow-[0_20px_44px_rgba(139,14,26,0.14)]"
    >
      <div className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-[#8B0E1A] via-[#A91324] to-[#C9A15B] transition-transform duration-500 ease-out group-hover:scale-x-100" />

      <div className="grid h-full w-full grid-cols-[48px_minmax(0,1fr)_90px] items-center gap-3">
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center self-center">
          <Image
            src={opportunity.logo}
            alt={`${opportunity.university} logo`}
            fill
            sizes="48px"
            className="object-contain"
          />
        </div>

        <div className="min-w-0 self-center overflow-hidden pr-1">
          <h3 className="line-clamp-2 max-w-full overflow-hidden text-lg font-semibold leading-[1.2] tracking-normal text-[#111827]">
            {opportunity.program}
          </h3>

          <p className="mt-1.5 line-clamp-1 max-w-full overflow-hidden text-ellipsis text-[13px] font-medium leading-4 text-slate-500">
            {opportunity.university}
          </p>

          <div className="mt-1.5 flex max-w-full items-center gap-1 overflow-hidden text-[11px] font-semibold uppercase leading-4 tracking-wider text-slate-400">
            <MapPin aria-hidden="true" className="h-3 w-3 shrink-0 text-[#C9A15B]" />
            <span className="line-clamp-1 min-w-0 overflow-hidden text-ellipsis">
              {opportunity.location}
            </span>
          </div>
        </div>

        <div className="flex h-full min-w-0 flex-col items-end justify-center gap-3 border-l border-[#EEF2F6] pl-3 text-right">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-slate-400">From</p>

            <p className="mt-1 whitespace-nowrap text-base font-bold leading-none tracking-normal text-[#8B0E1A] transition-colors duration-300 group-hover:text-[#6F0914]">
              {opportunity.price}
            </p>
          </div>

          <Link
            href={ROUTES.universities}
            aria-label={`View ${opportunity.program} at ${opportunity.university}`}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#8B0E1A] text-[#8B0E1A] transition-all duration-300 group-hover:bg-[#8B0E1A] group-hover:text-white"
          >
            <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </motion.article>
  )
}

export default function FeaturedUniversities() {
  return (
    <section className="relative overflow-hidden bg-[#FBFAF7] px-4 pb-16 pt-2 lg:pt-4 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-28 -top-28 h-[420px] w-[420px] rounded-full bg-white/90 blur-3xl" />
        <div className="absolute -right-24 top-8 h-[520px] w-[520px] rounded-full bg-[#F7EBD5]/70 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E8D5B1] to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1500px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            ease: 'easeOut',
          }}
          viewport={{ once: true, margin: '-80px' }}
          className="mx-auto mb-6 max-w-4xl text-center"
        >
          <ScrollFloat
            animationDuration={1.1}
            ease="back.inOut(1.8)"
            scrollStart="top bottom-=15%"
            scrollEnd="center center"
            stagger={0.015}
            containerClassName="scroll-title-highlight-university text-center !my-0"
            textClassName="text-[clamp(2.5rem,5vw,4.5rem)] font-bold tracking-normal leading-none text-[#111827]"
            segments={[
              { text: 'University ' },
              { text: 'Opportunities', className: 'text-[#C41E3A]' },
            ]}
          />

          <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-slate-500 sm:text-lg">
            Handpicked universities offering world-class education, exclusive scholarships, and
            guaranteed visa support — all in one place
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
          {universityOpportunities.map((opportunity) => (
            <UniversityCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.18,
            ease: 'easeOut',
          }}
          viewport={{ once: true }}
          className="mt-12 flex justify-center"
        >
          <Link
            href={ROUTES.universities}
            aria-label="View all universities"
            className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#760B16] via-[#8B0E1A] to-[#A91324] px-9 py-4 text-sm font-bold text-white shadow-[0_18px_45px_rgba(201,161,91,0.34)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:shadow-[0_24px_60px_rgba(201,161,91,0.48)] sm:px-11"
          >
            <Landmark aria-hidden="true" className="h-[18px] w-[18px] text-white" strokeWidth={2.2} />
            <span>View All Universities</span>
            <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
