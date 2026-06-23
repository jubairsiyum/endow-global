'use client'

import { motion } from 'framer-motion'
import { BookOpen, GraduationCap, Briefcase, TrendingUp, ArrowRight } from 'lucide-react'

const pathways = [
  {
    icon: BookOpen,
    step: 'STEP 01',
    title: 'Study',
    description: 'Choose from diverse programs and build your academic foundation',
    details: ['Select University', 'Apply Programs', 'Enroll & Start'],
  },
  {
    icon: GraduationCap,
    step: 'STEP 02',
    title: 'Graduate',
    description: 'Complete your degree and gain valuable experience',
    details: ['Complete Coursework', 'Internships', 'Final Project'],
  },
  {
    icon: Briefcase,
    step: 'STEP 03',
    title: 'Job',
    description: 'Secure a position with leading companies',
    details: ['Job Search', 'Interview', 'Offer'],
  },
  {
    icon: TrendingUp,
    step: 'STEP 04',
    title: 'Career Growth',
    description: 'Advance your career with promotions and new opportunities',
    details: ['Professional Dev', 'Leadership', 'Success'],
  },
]

function MilestoneCard({ pathway, index }: { pathway: typeof pathways[0]; index: number }) {
  const Icon = pathway.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col items-center"
    >
      {/* ICON */}
      <div className="h-10 w-10 rounded-full bg-white shadow-[0_8px_20px_rgba(0,0,0,0.08)] flex items-center justify-center mb-4">
        <Icon className="h-5 w-5 text-[#C41E3A]" strokeWidth={2} />
      </div>

      {/* CONNECTOR LINE */}
      <div className="w-px h-5 bg-[#E5E7EB] mb-4" />

      {/* CARD */}
      <motion.div
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="group w-full max-w-[240px]"
      >
        <div className="h-[320px] rounded-[24px] bg-white border border-[#F1F5F9] shadow-[0_10px_30px_rgba(15,23,42,0.06)] p-6 transition-shadow duration-300 group-hover:shadow-[0_20px_50px_rgba(196,30,58,0.12)] overflow-hidden flex flex-col">
          {/* STEP BADGE */}
          <div className="mb-3 inline-flex items-center rounded-full bg-[#FEECEF] px-3 py-1 self-start">
            <span className="text-[11px] font-bold tracking-[0.12em] text-[#C41E3A]">
              {pathway.step}
            </span>
          </div>

          {/* TITLE */}
          <h3 className="text-[20px] font-bold leading-tight tracking-tight text-[#0F172A] mb-2">
            {pathway.title}
          </h3>

          {/* ACCENT LINE */}
          <div className="w-10 h-1 rounded-full bg-[#C41E3A] mb-3" />

          {/* DESCRIPTION */}
          <p className="text-sm leading-6 text-[#64748B] mb-3">
            {pathway.description}
          </p>

          {/* BULLET LIST */}
          <div className="space-y-2 mt-auto">
            {pathway.details.map((detail, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#C41E3A] flex-shrink-0" />
                <span className="text-sm text-[#475569]">{detail}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function CareerPathwayHub() {
  return (
    <section className="relative border-y border-[#E5E7EB] bg-[#FEF2F2]">
      {/* ROADMAP IMAGE - BACKGROUND ONLY */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
        <img
          src="/images/career-pathway-bg.png"
          className="w-full h-full object-contain opacity-30"
          alt=""
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-16">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <h2 className="text-5xl lg:text-6xl font-bold tracking-tight leading-none text-[#0F172A]">
            Career <span className="text-[#C41E3A]">Pathway</span> Hub
          </h2>
          <p className="mt-4 text-lg text-[#64748B]">
            From student to career professional in four strategic steps
          </p>
        </motion.div>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center max-w-6xl mx-auto">
          {pathways.map((pathway, index) => (
            <MilestoneCard key={index} pathway={pathway} index={index} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <button className="group inline-flex h-12 items-center gap-2 rounded-lg bg-[#C41E3A] px-6 text-sm font-semibold text-white transition-colors hover:bg-red-700">
            View Career Resources
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}
