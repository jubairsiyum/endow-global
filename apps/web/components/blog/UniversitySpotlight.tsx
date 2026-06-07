'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Globe, Users, BookOpen, Award, ArrowRight } from 'lucide-react'

export function UniversitySpotlight() {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section className="relative border-y border-[#E5E7EB] bg-[#F8FAFC] py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-[#111827] lg:text-5xl">
            University Spotlight
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-[#6B7280]">
            Featured University of the Week
          </p>
        </motion.div>

        {/* FEATURED UNIVERSITY CARD */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          whileHover={{ y: -4 }}
          className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-shadow"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* IMAGE */}
            <div className="relative h-96 overflow-hidden lg:h-full">
              <Image
                src="https://images.unsplash.com/photo-1594897369641-d7aaf6be1767?w=800&h=600&fit=crop"
                alt="Hanseo University"
                fill
                className="object-cover"
              />
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

                <h3 className="mb-2 text-4xl font-bold text-[#111827]">Hanseo University</h3>
                <p className="mb-8 text-lg text-[#6B7280]">
                  South Korea | Seosan, Chungcheongnam-do
                </p>

                {/* QUICK FACTS */}
                <div className="mb-10 grid grid-cols-2 gap-6 border-b border-[#E5E7EB] pb-10">
                  <div className="flex items-start gap-4">
                    <Award className="mt-1 h-6 w-6 flex-shrink-0 text-[#C41E3A]" />
                    <div>
                      <p className="text-sm text-[#6B7280]">World Ranking</p>
                      <p className="text-2xl font-bold text-[#111827]">Top 2000</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Users className="mt-1 h-6 w-6 flex-shrink-0 text-[#C41E3A]" />
                    <div>
                      <p className="text-sm text-[#6B7280]">Intl Students</p>
                      <p className="text-2xl font-bold text-[#111827]">3000+</p>
                    </div>
                  </div>
                </div>

                {/* DESCRIPTION */}
                <p className="mb-8 text-base leading-relaxed text-[#6B7280]">
                  Hanseo University is one of South Korea's leading private universities, offering
                  excellent programs in engineering, business, humanities, and sciences. Known for
                  its strong industry partnerships and scholarship opportunities for international
                  students.
                </p>

                {/* KEY HIGHLIGHTS */}
                <div className="mb-8 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-[#C41E3A]" />
                    <p className="text-[#111827]">
                      Strong scholarship opportunities for international students
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-[#C41E3A]" />
                    <p className="text-[#111827]">Modern campus with state-of-the-art facilities</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-[#C41E3A]" />
                    <p className="text-[#111827]">
                      Active exchange programs with 100+ partner universities
                    </p>
                  </div>
                </div>

                {/* CTA */}
                <button className="group inline-flex h-12 items-center gap-2 rounded-lg bg-[#C41E3A] px-8 font-semibold text-white transition-colors hover:bg-red-700">
                  Learn More{' '}
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
