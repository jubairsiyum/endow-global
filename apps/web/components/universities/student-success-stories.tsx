'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { studentStories } from '@/lib/universities/data'
import Image from 'next/image'

export default function StudentSuccessStories() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section className="relative overflow-x-hidden bg-white pt-0 pb-14 lg:pt-2 lg:pb-16">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-1/2 h-[400px] w-[400px] rounded-full bg-red-500/10 opacity-20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-8 text-center"
        >
          <h2 className="text-[clamp(2.6rem,4.2vw,4.8rem)] font-bold tracking-normal leading-[1.05]">
            <span className="text-[#071225]">Success </span>
            <span className="text-[#C41E3A]">Stories </span>
            <span className="text-[#071225]">from Our Students</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Real stories of transformation from students who achieved their dreams through our
            platform
          </p>
        </motion.div>

        {/* Stories Carousel */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {studentStories.map((story, idx) => (
            <motion.div
              key={story.id}
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.25 } }}
              className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-red-100 hover:shadow-red-100"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(196,30,58,0.06),transparent_50%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative space-y-4 p-5">
                {/* Student Avatar */}
                <div className="flex items-center gap-4">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-red-100">
                    <Image
                      src={story.image}
                      alt={story.name}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{story.name}</h3>
                    <p className="text-sm text-gray-600">{story.university}</p>
                  </div>
                  {story.visaApproval && (
                    <div className="rounded-full border border-red-100 bg-red-50 px-2.5 py-1">
                      <p className="text-xs font-bold text-[#C41E3A]">Visa</p>
                    </div>
                  )}
                </div>

                {/* Review Quote */}
                <blockquote className="text-sm leading-relaxed text-gray-700">
                  "{story.review}"
                </blockquote>

                {/* Rating */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: story.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#C41E3A] text-[#C41E3A]" />
                  ))}
                </div>

                {/* Details */}
                <div className="space-y-2.5 border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Scholarship</span>
                    <span className="font-bold text-[#C41E3A]">{story.scholarship}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Country</span>
                    <span className="font-bold text-gray-900">{story.country}</span>
                  </div>
                </div>

                {/* CTA */}
                <button className="h-10 w-full rounded-xl border border-red-100 bg-red-50 px-4 text-sm font-semibold text-[#C41E3A] transition-colors hover:bg-red-100">
                  Read Full Story
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <p className="mb-4 text-base text-gray-600">Ready to write your own success story?</p>
          <button className="inline-flex h-11 items-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-rose-500 px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(196,30,58,0.18)] transition-shadow hover:shadow-red-200">
            Start Your Journey Today
          </button>
        </motion.div>
      </div>
    </section>
  )
}