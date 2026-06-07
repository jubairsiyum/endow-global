'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Award, CalendarDays, MapPin } from 'lucide-react'
import { scholarships, universities } from '@/lib/universities/data'
import { calculateDaysRemaining } from '@/lib/universities/utils'

const featuredScholarships = scholarships.slice(0, 3)
const universityById = new Map(universities.map((university) => [university.id, university]))
const fallbackUniversityImage = '/universities/Hanseo University.png'

export default function ScholarshipSpotlight() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section className="relative overflow-x-hidden bg-white py-12 lg:py-14">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-0 top-0 h-[340px] w-[340px] rounded-full bg-red-500/10 opacity-20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-8 space-y-3 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1.5">
            <Award className="h-3.5 w-3.5 text-[#C41E3A]" />
            <span className="text-xs font-medium text-[#C41E3A]">Financial Aid</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 lg:text-4xl">
            Exclusive Scholarship Opportunities
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-600">
            Reduce your tuition burden with our partner universities&apos; exclusive scholarships
            and financial aid programs
          </p>
        </motion.div>

        {/* Scholarships Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {featuredScholarships.map((scholarship) => {
            const university = universityById.get(scholarship.universityId)
            const daysLeft = calculateDaysRemaining(scholarship.deadline)
            const isUrgent = daysLeft <= 7
            const deadlineLabel = new Date(scholarship.deadline).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })

            return (
              <motion.div
                key={scholarship.id}
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
                className="group relative h-[252px] overflow-hidden rounded-[20px] border border-[#EDE7DD] bg-white shadow-[0_14px_34px_rgba(15,23,42,0.07)] transition-all duration-300 hover:border-[#D9B873] hover:shadow-[0_20px_42px_rgba(139,14,26,0.14)]"
              >
                {isUrgent && <div className="absolute inset-0 bg-red-50/45" />}

                <div className="relative h-full">
                  <div className="relative h-16 overflow-hidden bg-[#111827]">
                    <Image
                      src={university?.banner ?? university?.logo ?? fallbackUniversityImage}
                      alt={`${scholarship.universityName} campus`}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover opacity-45 transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#5F0710]/90 via-[#8B0E1A]/70 to-[#C9A15B]/25" />
                  </div>

                  <div className="absolute left-4 right-4 top-4 flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 rounded-xl border border-white/70 bg-white p-1.5 shadow-[0_8px_18px_rgba(15,23,42,0.16)]">
                      <Image
                        src={university?.logo ?? fallbackUniversityImage}
                        alt={`${scholarship.universityName} logo`}
                        fill
                        sizes="48px"
                        className="object-contain p-1"
                      />
                    </div>

                    <div className="min-w-0 pt-1">
                      <h3 className="line-clamp-1 font-serif text-[19px] font-bold leading-6 tracking-normal text-white">
                        {scholarship.universityName}
                      </h3>
                      <p className="line-clamp-1 text-[13px] font-medium text-white/75">
                        {scholarship.requirements}
                      </p>
                    </div>
                  </div>

                  <div className="flex h-[120px] flex-col items-center justify-center px-5 pt-6 text-center">
                    <p className="font-serif text-[52px] font-semibold leading-none tracking-normal text-[#8B0E1A]">
                      {scholarship.percentage}%
                    </p>
                    <p className="mt-1 text-sm font-bold uppercase tracking-[0.18em] text-[#C9A15B]">
                      Scholarship
                    </p>
                  </div>

                  <div className="absolute inset-x-4 bottom-4">
                    <div className="mb-3 grid grid-cols-2 gap-2 text-[13px] font-semibold text-slate-600">
                      <div className="flex min-w-0 items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-[#C9A15B]" />
                        <span className="line-clamp-1">
                          {university?.country ?? 'International'}
                        </span>
                      </div>
                      <div className="flex min-w-0 items-center justify-end gap-1.5 text-right">
                        <CalendarDays className="h-3.5 w-3.5 shrink-0 text-[#C9A15B]" />
                        <span className="line-clamp-1">{deadlineLabel}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#760B16] via-[#8B0E1A] to-[#A91324] px-5 text-sm font-bold text-white shadow-[0_10px_22px_rgba(139,14,26,0.2)] transition-all duration-300 hover:shadow-[0_14px_28px_rgba(139,14,26,0.28)]"
                    >
                      Check Eligibility
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
