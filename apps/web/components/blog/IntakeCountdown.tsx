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
    bgColor: 'bg-[#F8FAFC]',
  },
  {
    season: 'Fall Intake',
    month: 'September 2024',
    deadline: 'June 30, 2024',
    status: 'Application Closing Soon',
    daysLeft: 28,
    color: 'bg-[#C41E3A]',
    bgColor: 'bg-[#FEF2F2]',
  },
]

export function IntakeCountdown() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
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
          <h2 className="mb-4 text-4xl font-bold text-[#111827] lg:text-5xl">Intake Countdown</h2>
          <p className="mx-auto max-w-2xl text-xl text-[#6B7280]">
            Application deadlines for upcoming intakes
          </p>
        </motion.div>

        {/* INTAKE CARDS */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2"
        >
          {intakes.map((intake, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className={`rounded-xl ${intake.bgColor} border border-[#E5E7EB] p-10 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]`}
            >
              {/* HEADER */}
              <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                  <h3 className="mb-2 text-3xl font-bold text-[#111827]">{intake.season}</h3>
                  <p className="flex items-center gap-2 text-base text-[#6B7280]">
                    <Calendar className="h-4 w-4" />
                    {intake.month}
                  </p>
                </div>
                <div
                  className={`h-10 rounded-full px-4 ${intake.color} flex items-center whitespace-nowrap text-sm font-semibold text-white`}
                >
                  {intake.status}
                </div>
              </div>

              {/* COUNTDOWN */}
              <div className="mb-8 border-b border-[#E5E7EB] pb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-[#111827]">{intake.daysLeft}</span>
                  <span className="text-base text-[#6B7280]">days left to apply</span>
                </div>
              </div>

              {/* DEADLINE */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-[#111827]">
                  <Clock className="h-5 w-5 text-[#C41E3A]" />
                  <div>
                    <p className="mb-1 text-xs text-[#6B7280]">Deadline</p>
                    <p className="font-semibold">{intake.deadline}</p>
                  </div>
                </div>
                <button
                  className={`h-12 rounded-lg px-6 ${intake.color} font-semibold text-white transition-all hover:shadow-[0_10px_30px_rgba(196,30,58,0.18)]`}
                >
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
          className="mx-auto max-w-3xl rounded-xl border border-[#E5E7EB] bg-white p-8"
        >
          <h4 className="mb-3 text-xl font-bold text-[#111827]">Pro Tip</h4>
          <p className="text-base leading-relaxed text-[#6B7280]">
            Start preparing your application at least 3-4 months before the deadline. Our resources
            can help you create a compelling application package.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
