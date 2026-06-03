'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Globe, Users, BookOpen, Award, ArrowRight } from 'lucide-react'

export function UniversitySpotlight() {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <section className="relative py-24 lg:py-32 bg-[#F8FAFC] border-y border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-[#111827] mb-4">University Spotlight</h2>
          <p className="text-xl text-[#6B7280] max-w-2xl mx-auto">Featured University of the Week</p>
        </motion.div>

        {/* FEATURED UNIVERSITY CARD */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          whileHover={{ y: -4 }}
          className="rounded-xl overflow-hidden bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-shadow border border-[#E5E7EB]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* IMAGE */}
            <div className="relative h-96 lg:h-full overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1594897369641-d7aaf6be1767?w=800&h=600&fit=crop"
                alt="Hanseo University"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[#111827]/25" />
            </div>

            {/* CONTENT */}
            <div className="p-12 lg:p-16 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <div className="inline-block mb-6">
                  <div className="flex h-10 items-center gap-2 px-4 rounded-full bg-[#FEF2F2] border border-[#E5E7EB]">
                    <Globe className="w-4 h-4 text-[#C41E3A]" />
                    <span className="text-sm font-semibold text-[#C41E3A]">Featured This Week</span>
                  </div>
                </div>

                <h3 className="text-4xl font-bold text-[#111827] mb-2">Hanseo University</h3>
                <p className="text-lg text-[#6B7280] mb-8">South Korea | Seosan, Chungcheongnam-do</p>

                {/* QUICK FACTS */}
                <div className="grid grid-cols-2 gap-6 mb-10 pb-10 border-b border-[#E5E7EB]">
                  <div className="flex items-start gap-4">
                    <Award className="w-6 h-6 text-[#C41E3A] flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm text-[#6B7280]">World Ranking</p>
                      <p className="text-2xl font-bold text-[#111827]">Top 2000</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Users className="w-6 h-6 text-[#C41E3A] flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm text-[#6B7280]">Intl Students</p>
                      <p className="text-2xl font-bold text-[#111827]">3000+</p>
                    </div>
                  </div>
                </div>

                {/* DESCRIPTION */}
                <p className="text-base text-[#6B7280] leading-relaxed mb-8">
                  Hanseo University is one of South Korea's leading private universities, offering excellent programs in engineering, business, humanities, and sciences. Known for its strong industry partnerships and scholarship opportunities for international students.
                </p>

                {/* KEY HIGHLIGHTS */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#C41E3A]" />
                    <p className="text-[#111827]">Strong scholarship opportunities for international students</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#C41E3A]" />
                    <p className="text-[#111827]">Modern campus with state-of-the-art facilities</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#C41E3A]" />
                    <p className="text-[#111827]">Active exchange programs with 100+ partner universities</p>
                  </div>
                </div>

                {/* CTA */}
                <button className="inline-flex h-12 items-center gap-2 px-8 rounded-lg bg-[#C41E3A] text-white font-semibold hover:bg-red-700 transition-colors group">
                  Learn More <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
