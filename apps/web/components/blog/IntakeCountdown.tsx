'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, Lightbulb } from 'lucide-react'

const intakes = [
  {
    season: 'March Intake',
    month: 'March 2026',
    deadline: 'December 15, 2025',
    status: 'Applications Open',
    daysLeft: 127,
    color: 'bg-[#C41E3A]',
    bgColor: 'bg-rose-50',
  },
  {
    season: 'June Intake',
    month: 'June 2026',
    deadline: 'March 31, 2026',
    status: 'Open Now',
    daysLeft: 89,
    color: 'bg-[#C41E3A]',
    bgColor: 'bg-rose-50',
  },
  {
    season: 'September Intake',
    month: 'September 2026',
    deadline: 'June 30, 2026',
    status: 'Most Popular',
    daysLeft: 45,
    color: 'bg-[#C41E3A]',
    bgColor: 'bg-rose-50',
  },
  {
    season: 'December Intake',
    month: 'December 2026',
    deadline: 'September 30, 2026',
    status: 'Limited Seats',
    daysLeft: 152,
    color: 'bg-[#C41E3A]',
    bgColor: 'bg-rose-50',
  },
]

export function IntakeCountdown() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <section className="relative border-y border-[#E5E7EB] bg-[#F8FAFC] py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#C41E3A] shadow-sm">
            Deadlines
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
            Intake Countdown
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-500">
            Application deadlines for upcoming intakes
          </p>
        </motion.div>

        {/* CARDS */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4"
        >
          {intakes.map((intake, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                y: -8,
                transition: { duration: 0.2 },
              }}
              className={`group relative overflow-hidden rounded-3xl border border-white/70 ${intake.bgColor}
              p-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)]
              transition-all duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]`}
            >
              {/* TOP ACCENT */}
              <div
                className={`absolute left-0 top-0 h-1 w-full ${intake.color}`}
              />

              {/* STATUS */}
              <div
                className={`mb-6 inline-flex items-center rounded-full px-4 py-2 text-xs font-semibold text-white ${intake.color}`}
              >
                {intake.status}
              </div>

              {/* TITLE */}
              <h3 className="mb-2 text-2xl font-bold text-[#111827]">
                {intake.season}
              </h3>

              <div className="mb-8 flex items-center gap-2 text-sm text-[#6B7280]">
                <Calendar className="h-4 w-4" />
                {intake.month}
              </div>

              {/* COUNTDOWN */}
              <div className="mb-8">
                <div className="flex items-end gap-2">
                  <span className="text-6xl font-bold tracking-tight text-[#111827]">
                    {intake.daysLeft}
                  </span>

                  <span className="mb-2 text-sm text-[#6B7280]">
                    days left
                  </span>
                </div>
              </div>

              {/* DIVIDER */}
              <div className="mb-6 h-px bg-[#E5E7EB]" />

              {/* FOOTER */}
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">
                    <Clock className="h-4 w-4 text-[#C41E3A]" />
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-[#6B7280]">
                      Deadline
                    </p>

                    <p className="font-semibold text-[#111827]">
                      {intake.deadline}
                    </p>
                  </div>
                </div>

                <button
                  className={`w-full rounded-xl py-3.5 font-semibold text-white transition-all duration-300 hover:scale-[1.02] ${intake.color}`}
                >
                  Apply Now
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* SLIM PRO TIP BANNER */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mx-auto mt-12 max-w-3xl"
        >
          <div className="flex flex-col gap-3 rounded-2xl border border-rose-100/80 bg-gradient-to-r from-rose-50/60 via-white to-rose-50/30 p-4 sm:flex-row sm:items-center sm:gap-4 sm:px-6 sm:py-4 shadow-sm">
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#C41E3A]/10 text-[#C41E3A]">
                <Lightbulb className="h-4.5 w-4.5" />
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C41E3A]/10 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-[#C41E3A]">
                Pro Tip
              </span>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Start preparing your application at least{' '}
              <strong className="font-semibold text-gray-900">3–4 months</strong> before
              the deadline. This gives you enough time to prepare SOPs,
              collect documents, secure recommendation letters, and improve
              your chances of admission and scholarships.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}