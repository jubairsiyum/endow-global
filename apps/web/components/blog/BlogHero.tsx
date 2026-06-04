'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Zap } from 'lucide-react'

export function BlogHero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAFAFA] via-[#F8F9FB] to-white pt-24 lg:pt-28 pb-10 lg:pb-14">
      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 right-0 -mr-48 -mt-48 w-[420px] h-[420px] rounded-full bg-[#FEF2F2] blur-3xl opacity-40 pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-48 -mb-48 w-[420px] h-[420px] rounded-full bg-[#F8FAFC] blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[380px] h-[380px] bg-[#C41E3A]/4 blur-[120px] rounded-full" />
      <div className="max-w-[1380px] mx-auto px-6 lg:px-10 xl:px-12 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-8 xl:gap-12 items-center"
        >
          {/* LEFT CONTENT */}
          <div>
            <motion.div variants={itemVariants} className="mb-5">
              <div className="inline-block">
                <div className="flex h-9 items-center gap-2 px-3.5 rounded-full bg-[#FEF2F2] border border-[#E5E7EB]">
                  <Zap className="w-3.5 h-3.5 text-[#C41E3A]" />
                  <span className="text-xs font-semibold text-[#C41E3A] tracking-wide">Education Knowledge Hub</span>
                </div>
              </div>
            </motion.div>

            <motion.h1
            
              variants={itemVariants}
              className="max-w-[580px] text-[32px] md:text-[40px] lg:text-[52px] font-extrabold leading-[1.0] tracking-[-1.5px] mb-5"
            >
              <div className="w-24 h-1 rounded-full bg-gradient-to-r from-[#C41E3A] to-[#EF4444] mb-6" />
              <span className="text-[#111827]">
                Global Education
              </span>

              <br />

              <span className="bg-gradient-to-r from-[#C41E3A] to-[#EF4444] bg-clip-text text-transparent">
                Insights & Guides
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-base text-[#6B7280] leading-relaxed mb-7 max-w-[520px]"
            >
              Study abroad guides, scholarship opportunities, visa updates, university insights, and real student success journeys.
            </motion.p>

            {/* STATISTICS */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-4 max-w-[580px]"
            >
              <div className="rounded-2xl border border-[#ECECEC] bg-white p-4 min-h-[115px] shadow-[0_6px_16px_rgba(15,23,42,0.05)] hover:shadow-md transition-all">
                <div className="w-8 h-0.5 rounded-full bg-[#C41E3A] mb-3" />
                <p className="text-xl font-bold text-[#111827]">500+</p>
                <p className="text-xs uppercase tracking-wider text-[#6B7280] mt-1.5 font-medium">Expert Articles</p>
              </div>

              <div className="rounded-2xl border border-[#ECECEC] bg-white p-4 min-h-[115px] shadow-[0_6px_16px_rgba(15,23,42,0.05)] hover:shadow-md transition-all">
                <div className="w-8 h-0.5 rounded-full bg-[#C41E3A] mb-3" />
                <p className="text-xl font-bold text-[#111827]">25K+</p>
                <p className="text-xs uppercase tracking-wider text-[#6B7280] mt-1.5 font-medium">Monthly Readers</p>
              </div>

              <div className="rounded-2xl border border-[#ECECEC] bg-white p-4 min-h-[115px] shadow-[0_6px_16px_rgba(15,23,42,0.05)] hover:shadow-md transition-all">
                <div className="w-8 h-0.5 rounded-full bg-[#C41E3A] mb-3" />
                <p className="text-xl font-bold text-[#111827]">20+</p>
                <p className="text-xs uppercase tracking-wider text-[#6B7280] mt-1.5 font-medium">Partner Universities</p>
              </div>
            </motion.div>
          </div>

          {/* RIGHT - FEATURED ARTICLE CARD */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -8 }}
            className="relative w-full ml-auto"
          >
            <div className="rounded-3xl overflow-hidden bg-white shadow-[0_20px_60px_rgba(15,23,42,0.1)] transition-shadow duration-300 border border-[#ECECEC]">
              {/* CARD IMAGE */}
              <div className="relative h-[260px] lg:h-[300px] w-full overflow-hidden bg-[#F8FAFC]">
                <Image
                  src="https://images.unsplash.com/photo-1491841573634-28e1ad7dc246?w=600&h=400&fit=crop"
                  alt="Featured article"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>

              {/* CARD CONTENT */}
              <div className="p-5">
                {/* CATEGORY BADGE */}
                <div className="inline-block mb-3">
                  <span className="inline-flex items-center h-9 px-3.5 rounded-full bg-red-50 border border-red-100 text-[#C41E3A] text-xs font-bold uppercase tracking-wider">
                    Scholarship Guide
                  </span>
                </div>

                {/* TITLE */}
                <h3 className="text-[20px] lg:text-[22px] leading-snug font-bold text-[#111827] mb-2.5 line-clamp-2">
                  Complete GKS Scholarship Guide 2024
                </h3>

                {/* DESCRIPTION */}
                <p className="text-sm text-[#6B7280] mb-5 line-clamp-3 leading-relaxed">
                  Everything you need to know about applying for the Global Korea Scholarship, from eligibility requirements to tips for a winning application.
                </p>

                {/* META */}
                <div className="flex items-center justify-between text-xs text-[#6B7280] border-t border-[#E5E7EB] pt-4">
                  <div className="flex items-center gap-3">
                    <span>By Endow Team</span>
                    <span>•</span>
                    <span>3 min read</span>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-5">
                  <button className="h-11 px-4 rounded-full bg-[#C41E3A] text-white text-sm font-semibold flex items-center gap-2 hover:bg-[#B11A33] transition-all">
                    Read Article
                    <ArrowRight className="w-3.5 h-3.5" />
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
