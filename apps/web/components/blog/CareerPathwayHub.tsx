'use client'

import { motion } from 'framer-motion'
import { BookOpen, GraduationCap, Briefcase, TrendingUp, ArrowRight } from 'lucide-react'

const pathways = [
  {
    icon: BookOpen,
    title: 'Study',
    description: 'Choose from diverse programs and build your academic foundation',
    details: ['Select University', 'Apply Programs', 'Enroll & Start']
  },
  {
    icon: GraduationCap,
    title: 'Graduate',
    description: 'Complete your degree and gain valuable experience',
    details: ['Complete Coursework', 'Internships', 'Final Project']
  },
  {
    icon: Briefcase,
    title: 'Job',
    description: 'Secure a position with leading companies',
    details: ['Job Search', 'Interview', 'Offer']
  },
  {
    icon: TrendingUp,
    title: 'Career Growth',
    description: 'Advance your career with promotions and new opportunities',
    details: ['Professional Dev', 'Leadership', 'Success']
  }
]

export function CareerPathwayHub() {
  return (
    <section className="relative py-24 lg:py-32 bg-[#FEF2F2] border-y border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-[#111827] mb-4">Career Pathway Hub</h2>
          <p className="text-xl text-[#6B7280] max-w-2xl mx-auto">From student to career professional in four strategic steps</p>
        </motion.div>

        {/* PATHWAY TIMELINE */}
        <div className="relative">
          {/* CONNECTION LINE */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-px bg-[#C41E3A] opacity-30" />

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ staggerChildren: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10"
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
                  <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                    <div className="w-16 h-16 rounded-full bg-[#C41E3A] flex items-center justify-center text-white font-bold text-lg shadow-[0_10px_30px_rgba(196,30,58,0.18)] transition-shadow">
                      {index + 1}
                    </div>
                  </div>

                  {/* CARD */}
                  <div className="pt-16 p-8 rounded-xl bg-white border border-[#E5E7EB] hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-all duration-300 h-full">
                    <div className="flex justify-center mb-6">
                      <div className="w-16 h-16 rounded-lg bg-[#FEF2F2] border border-[#E5E7EB] flex items-center justify-center">
                        <Icon className="w-8 h-8 text-[#C41E3A]" />
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-[#111827] mb-3 text-center">{pathway.title}</h3>
                    <p className="text-base text-[#6B7280] text-center mb-6 leading-relaxed">{pathway.description}</p>

                    {/* DETAILS */}
                    <div className="space-y-2">
                      {pathway.details.map((detail, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm text-[#6B7280]">
                          <div className="w-2 h-2 rounded-full bg-[#C41E3A]" />
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ARROW */}
                  {index < pathways.length - 1 && (
                    <div className="hidden lg:flex absolute -right-6 top-24 items-center justify-center">
                      <ArrowRight className="w-6 h-6 text-[#C41E3A]" />
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
          className="text-center mt-16"
        >
          <button className="inline-flex h-14 items-center gap-2 px-8 rounded-lg bg-[#C41E3A] text-white font-semibold hover:bg-red-700 transition-colors group">
            View Career Resources <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}
