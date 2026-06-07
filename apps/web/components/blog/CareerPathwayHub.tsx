'use client'

import { motion } from 'framer-motion'
import { BookOpen, GraduationCap, Briefcase, TrendingUp, ArrowRight } from 'lucide-react'

const pathways = [
  {
    icon: BookOpen,
    title: 'Study',
    description: 'Choose from diverse programs and build your academic foundation',
    details: ['Select University', 'Apply Programs', 'Enroll & Start'],
  },
  {
    icon: GraduationCap,
    title: 'Graduate',
    description: 'Complete your degree and gain valuable experience',
    details: ['Complete Coursework', 'Internships', 'Final Project'],
  },
  {
    icon: Briefcase,
    title: 'Job',
    description: 'Secure a position with leading companies',
    details: ['Job Search', 'Interview', 'Offer'],
  },
  {
    icon: TrendingUp,
    title: 'Career Growth',
    description: 'Advance your career with promotions and new opportunities',
    details: ['Professional Dev', 'Leadership', 'Success'],
  },
]

export function CareerPathwayHub() {
  return (
    <section className="relative border-y border-[#E5E7EB] bg-[#FEF2F2] py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="mb-20 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-[#111827] lg:text-5xl">Career Pathway Hub</h2>
          <p className="mx-auto max-w-2xl text-xl text-[#6B7280]">
            From student to career professional in four strategic steps
          </p>
        </motion.div>

        {/* PATHWAY TIMELINE */}
        <div className="relative">
          {/* CONNECTION LINE */}
          <div className="absolute left-0 right-0 top-24 hidden h-px bg-[#C41E3A] opacity-30 lg:block" />

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ staggerChildren: 0.2 }}
            className="relative z-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
          >
            {pathways.map((pathway, index) => {
              const Icon = pathway.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="relative"
                >
                  {/* STEP INDICATOR */}
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 transform">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#C41E3A] text-lg font-bold text-white shadow-[0_10px_30px_rgba(196,30,58,0.18)] transition-shadow">
                      {index + 1}
                    </div>
                  </div>

                  {/* CARD */}
                  <div className="h-full rounded-xl border border-[#E5E7EB] bg-white p-8 pt-16 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
                    <div className="mb-6 flex justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-[#E5E7EB] bg-[#FEF2F2]">
                        <Icon className="h-8 w-8 text-[#C41E3A]" />
                      </div>
                    </div>

                    <h3 className="mb-3 text-center text-2xl font-bold text-[#111827]">
                      {pathway.title}
                    </h3>
                    <p className="mb-6 text-center text-base leading-relaxed text-[#6B7280]">
                      {pathway.description}
                    </p>

                    {/* DETAILS */}
                    <div className="space-y-2">
                      {pathway.details.map((detail, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm text-[#6B7280]">
                          <div className="h-2 w-2 rounded-full bg-[#C41E3A]" />
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ARROW */}
                  {index < pathways.length - 1 && (
                    <div className="absolute -right-6 top-24 hidden items-center justify-center lg:flex">
                      <ArrowRight className="h-6 w-6 text-[#C41E3A]" />
                    </div>
                  )}
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <button className="group inline-flex h-14 items-center gap-2 rounded-lg bg-[#C41E3A] px-8 font-semibold text-white transition-colors hover:bg-red-700">
            View Career Resources{' '}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}
