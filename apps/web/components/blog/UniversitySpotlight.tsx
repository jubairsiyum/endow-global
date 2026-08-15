'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Globe, ArrowRight } from 'lucide-react'

export function UniversitySpotlight({ university }: { university: any | null }) {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  if (!university) return null

  return (
    <section className="relative border-y border-[#E5E7EB] bg-[#F8FAFC] py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mb-16 text-center"
        >
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#C41E3A] shadow-sm">
            Featured University
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
            University Spotlight
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-500">
            Featured University of the Week
          </p>
        </motion.div>

        {/* FEATURED UNIVERSITY CARD */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          whileHover={{ y: -4 }}
          className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-shadow"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* IMAGE */}
            <div className="relative h-96 overflow-hidden lg:h-full">
              {university.coverImage ? (
                <Image src={university.coverImage} alt={university.title} fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#F8FAFC] text-6xl font-bold text-gray-200">
                  {university.title?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
              <div className="absolute inset-0 bg-[#111827]/25" />
            </div>

            {/* CONTENT */}
            <div className="flex flex-col justify-center p-12 lg:p-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <div className="mb-6 inline-block">
                  <div className="flex h-10 items-center gap-2 rounded-full border border-[#E5E7EB] bg-[#FEF2F2] px-4">
                    <Globe className="h-4 w-4 text-[#C41E3A]" />
                    <span className="text-sm font-semibold text-[#C41E3A]">Featured This Week</span>
                  </div>
                </div>

                <h3 className="mb-2 text-4xl font-bold text-[#111827]">{university.title}</h3>
                {university.category && (
                  <p className="mb-8 text-lg text-[#6B7280]">{university.category}</p>
                )}

                {/* DESCRIPTION */}
                <p className="mb-8 text-base leading-relaxed text-[#6B7280]">
                  {university.description || ''}
                </p>

                {/* CTA */}
                <Link
                  href={`/blog/${university.slug}`}
                  className="group inline-flex h-12 items-center gap-2 rounded-lg bg-[#C41E3A] px-8 font-semibold text-white transition-colors hover:bg-red-700"
                >
                  Learn More
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
