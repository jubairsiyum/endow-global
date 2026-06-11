'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Zap } from 'lucide-react'

export function BlogHero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAFAFA] via-[#F8F9FB] to-white pb-10 pt-32 lg:pb-14 lg:pt-36">
      {/* BACKGROUND GLOW */}
      <div className="pointer-events-none absolute right-0 top-0 -mr-48 -mt-48 h-[420px] w-[420px] rounded-full bg-[#FEF2F2] opacity-40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 -mb-48 -ml-48 h-[420px] w-[420px] rounded-full bg-[#F8FAFC] opacity-60 blur-3xl" />
      <div className="bg-[#C41E3A]/4 absolute left-1/2 top-32 h-[380px] w-[380px] -translate-x-1/2 rounded-full blur-[120px]" />
      <div className="relative z-10 mx-auto max-w-[1380px] px-6 lg:px-10 xl:px-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[42%_58%] xl:gap-16"
        >
          {/* LEFT CONTENT */}
          <div>
            <motion.div variants={itemVariants} className="mb-4">
              <div className="inline-block">
                <div className="flex h-9 items-center gap-2 rounded-full border border-[#E5E7EB] bg-[#FEF2F2] px-3.5">
                  <Zap className="h-3.5 w-3.5 text-[#C41E3A]" />
                  <span className="text-xs font-semibold tracking-wide text-[#C41E3A]">
                    Education Knowledge Hub
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="mb-4 max-w-[700px] text-[34px] font-extrabold leading-[0.92] tracking-[-1.5px] md:text-[40px] lg:text-[52px]"
            >
              <div className="mb-4 h-1 w-24 rounded-full bg-gradient-to-r from-[#C41E3A] to-[#EF4444]" />
              <div className="text-[#111827]">
                Global Education
              </div>

              <div className="bg-gradient-to-r from-[#C41E3A] to-[#EF4444] bg-clip-text text-transparent">
                Insights &amp; Guides
              </div>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mb-7 max-w-[520px] text-base leading-relaxed text-[#6B7280]"
            >
              Study abroad guides, scholarship opportunities, visa updates, university insights, and
              real student success journeys.
            </motion.p>

            {/* STATISTICS */}
            <motion.div variants={itemVariants} className="grid max-w-[580px] grid-cols-3 gap-4">
              <div className="min-h-[95px] rounded-2xl border border-[#ECECEC] bg-white p-4 shadow-[0_6px_16px_rgba(15,23,42,0.05)] transition-all hover:shadow-md">
                <div className="mb-3 h-0.5 w-8 rounded-full bg-[#C41E3A]" />
                <p className="text-xl font-bold text-[#111827]">500+</p>
                <p className="mt-1.5 text-xs font-medium uppercase tracking-wider text-[#6B7280]">
                  Expert Articles
                </p>
              </div>

              <div className="min-h-[95px] rounded-2xl border border-[#ECECEC] bg-white p-4 shadow-[0_6px_16px_rgba(15,23,42,0.05)] transition-all hover:shadow-md">
                <div className="mb-3 h-0.5 w-8 rounded-full bg-[#C41E3A]" />
                <p className="text-xl font-bold text-[#111827]">25K+</p>
                <p className="mt-1.5 text-xs font-medium uppercase tracking-wider text-[#6B7280]">
                  Monthly Readers
                </p>
              </div>

              <div className="min-h-[95px] rounded-2xl border border-[#ECECEC] bg-white p-4 shadow-[0_6px_16px_rgba(15,23,42,0.05)] transition-all hover:shadow-md">
                <div className="mb-3 h-0.5 w-8 rounded-full bg-[#C41E3A]" />
                <p className="text-xl font-bold text-[#111827]">20+</p>
                <p className="mt-1.5 text-xs font-medium uppercase tracking-wider text-[#6B7280]">
                  Partner Universities
                </p>
              </div>
            </motion.div>
          </div>

          {/* RIGHT - FEATURED ARTICLE CARD */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -8 }}
            className="relative ml-auto w-full"
          >
            <div className="group overflow-hidden rounded-3xl border border-[#ECECEC] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.1)] transition-all duration-500 hover:shadow-[0_30px_80px_rgba(15,23,42,0.15)]">
              {/* CARD IMAGE */}
              <div className="relative h-[220px] w-full overflow-hidden bg-[#F8FAFC] lg:h-[300px]">

                <Image
                  src="/blog/gks-scholarship-guide.jpg"
                  alt="Complete GKS Scholarship Guide 2024"
                  fill
                  priority
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
                />


              </div>

              {/* CARD CONTENT */}
              <div className="p-4">
                {/* TITLE */}
                <h3 className="mb-2.5 line-clamp-2 text-[20px] font-bold leading-snug text-[#111827] lg:text-[20px]">
                  Complete GKS Scholarship Guide 2024
                </h3>

                {/* DESCRIPTION */}
                <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-[#6B7280]">
                  Everything you need to know about applying for the Global Korea Scholarship, from
                  eligibility requirements to tips for a winning application.
                </p>

                {/* META */}
                <div className="flex items-center justify-between border-t border-[#E5E7EB] pt-4 text-xs text-[#6B7280]">
                  <div className="flex items-center gap-3">
                    <span>By Endow Team</span>
                    <span>•</span>
                    <span>3 min read</span>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-3">
                  <button className="flex h-11 items-center gap-2 rounded-full bg-[#C41E3A] px-4 text-sm font-semibold text-white transition-all hover:bg-[#B11A33]">
                    Read Article
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
