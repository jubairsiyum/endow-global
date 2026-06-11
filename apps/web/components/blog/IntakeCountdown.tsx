'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock } from 'lucide-react'

const intakes = [
  {
    season: 'March Intake',
    month: 'March 2026',
    deadline: 'December 15, 2025',
    status: 'Applications Open',
    daysLeft: 127,
    color: 'bg-emerald-600',
    bgColor: 'bg-emerald-50',
  },
  {
    season: 'June Intake',
    month: 'June 2026',
    deadline: 'March 31, 2026',
    status: 'Open Now',
    daysLeft: 89,
    color: 'bg-sky-600',
    bgColor: 'bg-sky-50',
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
    color: 'bg-amber-600',
    bgColor: 'bg-amber-50',
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
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-[#111827] lg:text-5xl">
            Intake Countdown
          </h2>

          <p className="mx-auto max-w-2xl text-lg text-[#6B7280] lg:text-xl">
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

        {/* PRO TIP */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mt-16 max-w-4xl rounded-3xl border border-[#E5E7EB] bg-white p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)]"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C41E3A]/10">
              <span className="text-xl">💡</span>
            </div>

            <div>
              <h4 className="mb-2 text-xl font-bold text-[#111827]">
                Pro Tip
              </h4>

              <p className="leading-relaxed text-[#6B7280]">
                Start preparing your application at least 3–4 months before
                the deadline. This gives you enough time to prepare SOPs,
                collect documents, secure recommendation letters, and improve
                your chances of admission and scholarships.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}