'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock } from 'lucide-react'

const intakes = [
  {
    season: 'Spring Intake',
    month: 'March 2024',
    deadline: 'December 15, 2024',
    status: 'Application Open',
    daysLeft: 127,
    color: 'bg-[#C41E3A]',
    bgColor: 'bg-[#F8FAFC]'
  },
  {
    season: 'Fall Intake',
    month: 'September 2024',
    deadline: 'June 30, 2024',
    status: 'Application Closing Soon',
    daysLeft: 28,
    color: 'bg-[#C41E3A]',
    bgColor: 'bg-[#FEF2F2]'
  }
]

export function IntakeCountdown() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
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
          <h2 className="text-4xl lg:text-5xl font-bold text-[#111827] mb-4">Intake Countdown</h2>
          <p className="text-xl text-[#6B7280] max-w-2xl mx-auto">Application deadlines for upcoming intakes</p>
        </motion.div>

        {/* INTAKE CARDS */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
        >
          {intakes.map((intake, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className={`rounded-xl ${intake.bgColor} border border-[#E5E7EB] p-10 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-all duration-300`}
            >
              {/* HEADER */}
              <div className="flex items-start justify-between gap-4 mb-8">
                <div>
                  <h3 className="text-3xl font-bold text-[#111827] mb-2">{intake.season}</h3>
                  <p className="text-base text-[#6B7280] flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {intake.month}
                  </p>
                </div>
                <div className={`h-10 px-4 rounded-full ${intake.color} text-white text-sm font-semibold flex items-center whitespace-nowrap`}>
                  {intake.status}
                </div>
              </div>

              {/* COUNTDOWN */}
              <div className="mb-8 pb-8 border-b border-[#E5E7EB]">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-[#111827]">{intake.daysLeft}</span>
                  <span className="text-base text-[#6B7280]">days left to apply</span>
                </div>
              </div>

              {/* DEADLINE */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-[#111827]">
                  <Clock className="w-5 h-5 text-[#C41E3A]" />
                  <div>
                    <p className="text-xs text-[#6B7280] mb-1">Deadline</p>
                    <p className="font-semibold">{intake.deadline}</p>
                  </div>
                </div>
                <button className={`h-12 px-6 rounded-lg ${intake.color} text-white font-semibold hover:shadow-[0_10px_30px_rgba(196,30,58,0.18)] transition-all`}>
                  Apply Now
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* INFO BOX */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          className="max-w-3xl mx-auto p-8 rounded-xl bg-white border border-[#E5E7EB]"
        >
          <h4 className="text-xl font-bold text-[#111827] mb-3">Pro Tip</h4>
          <p className="text-base text-[#6B7280] leading-relaxed">Start preparing your application at least 3-4 months before the deadline. Our resources can help you create a compelling application package.</p>
        </motion.div>
      </div>
    </section>
  )
}
