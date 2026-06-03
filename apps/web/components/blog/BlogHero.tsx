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
    <section className="relative overflow-hidden bg-white pt-24 lg:pt-32 pb-24 lg:pb-32">
      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[700px] h-[700px] rounded-full bg-[#FEF2F2] blur-3xl opacity-55 pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-[520px] h-[520px] rounded-full bg-[#F8FAFC] blur-3xl opacity-80 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          {/* LEFT CONTENT */}
          <div>
            <motion.div variants={itemVariants} className="mb-6">
              <div className="inline-block">
                <div className="flex h-10 items-center gap-2 px-4 rounded-full bg-[#FEF2F2] border border-[#E5E7EB]">
                  <Zap className="w-4 h-4 text-[#C41E3A]" />
                  <span className="text-sm font-semibold text-[#C41E3A]">Education Knowledge Hub</span>
                </div>
              </div>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-6xl lg:text-7xl font-bold text-[#111827] tracking-tight leading-[1.08] mb-6"
            >
              Insights, Guides &{' '}
              <span className="relative">
                Success Stories
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-[#C41E3A] rounded-full" />
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-[#6B7280] leading-relaxed mb-12 max-w-xl"
            >
              Study abroad guides, scholarship opportunities, visa updates, university insights, and real student success journeys.
            </motion.p>

            {/* STATISTICS */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 gap-8 max-w-lg"
            >
              <div className="rounded-xl border border-[#E5E7EB] bg-white/80 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                <p className="text-3xl font-bold text-[#111827]">500+</p>
                <p className="text-base text-[#6B7280] mt-1">Articles</p>
              </div>
              <div className="rounded-xl border border-[#E5E7EB] bg-white/80 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                <p className="text-3xl font-bold text-[#111827]">25K+</p>
                <p className="text-base text-[#6B7280] mt-1">Readers</p>
              </div>
              <div className="rounded-xl border border-[#E5E7EB] bg-white/80 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                <p className="text-3xl font-bold text-[#111827]">20+</p>
                <p className="text-base text-[#6B7280] mt-1">Universities</p>
              </div>
              <div className="rounded-xl border border-[#E5E7EB] bg-white/80 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                <p className="text-3xl font-bold text-[#111827]">30+</p>
                <p className="text-base text-[#6B7280] mt-1">Categories</p>
              </div>
            </motion.div>
          </div>

          {/* RIGHT - FEATURED ARTICLE CARD */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -8 }}
            className="relative"
          >
            <div className="rounded-xl overflow-hidden bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-shadow duration-300 border border-[#E5E7EB]">
              {/* CARD IMAGE */}
              <div className="relative h-72 w-full overflow-hidden bg-[#F8FAFC]">
                <Image
                  src="https://images.unsplash.com/photo-1491841573634-28e1ad7dc246?w=600&h=400&fit=crop"
                  alt="Featured article"
                  fill
                  className="object-cover"
                />
              </div>

              {/* CARD CONTENT */}
              <div className="p-8">
                {/* CATEGORY BADGE */}
                <div className="inline-block mb-4">
                  <span className="inline-flex h-10 items-center px-4 rounded-full bg-[#FEF2F2] text-[#C41E3A] text-sm font-semibold">
                    Scholarship Guide
                  </span>
                </div>

                {/* TITLE */}
                <h3 className="text-2xl font-bold text-[#111827] mb-3 line-clamp-2">
                  Complete GKS Scholarship Guide 2024
                </h3>

                {/* DESCRIPTION */}
                <p className="text-base text-[#6B7280] mb-6 line-clamp-3 leading-relaxed">
                  Everything you need to know about applying for the Global Korea Scholarship, from eligibility requirements to tips for a winning application.
                </p>

                {/* META */}
                <div className="flex items-center justify-between text-sm text-[#6B7280] border-t border-[#E5E7EB] pt-6">
                  <div className="flex items-center gap-4">
                    <span>By Endow Team</span>
                    <span>•</span>
                    <span>3 min read</span>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-6">
                  <button className="flex items-center gap-2 text-[#C41E3A] font-semibold hover:gap-3 transition-all">
                    Read More <ArrowRight className="w-5 h-5" />
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
