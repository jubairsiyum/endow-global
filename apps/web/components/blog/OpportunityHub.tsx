'use client'

import { motion } from 'framer-motion'
import { Zap, Trophy, Users, Globe, Briefcase } from 'lucide-react'

const opportunities = [
  {
    icon: Trophy,
    title: 'Scholarships',
    count: '200+',
    description: 'Full and partial scholarships available',
    color: 'bg-[#C41E3A]',
  },
  {
    icon: Briefcase,
    title: 'Internships',
    count: '150+',
    description: 'Paid internship opportunities',
    color: 'bg-[#C41E3A]',
  },
  {
    icon: Users,
    title: 'Competitions',
    count: '50+',
    description: 'Student competitions with prizes',
    color: 'bg-[#C41E3A]',
  },
  {
    icon: Globe,
    title: 'Exchange Programs',
    count: '100+',
    description: 'Study abroad exchange opportunities',
    color: 'bg-[#C41E3A]',
  },
]

export function OpportunityHub() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section className="relative bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-[#111827] lg:text-5xl">Opportunity Hub</h2>
          <p className="mx-auto max-w-2xl text-xl text-[#6B7280]">
            Explore thousands of opportunities for your growth
          </p>
        </motion.div>

        {/* OPPORTUNITIES GRID */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
        >
          {opportunities.map((opp, index) => {
            const Icon = opp.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -8 }}
                className="group cursor-pointer overflow-hidden rounded-xl"
              >
                {/* GRADIENT BACKGROUND */}
                <div
                  className={`relative rounded-xl p-8 ${opp.color} h-full overflow-hidden text-white shadow-[0_10px_30px_rgba(196,30,58,0.14)]`}
                >
                  {/* BACKGROUND ELEMENT */}
                  <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-white/10 transition-transform duration-500 group-hover:scale-125" />

                  {/* CONTENT */}
                  <div className="relative z-10">
                    <div className="mb-4 transition-transform duration-300 group-hover:scale-105">
                      <Icon className="h-10 w-10" />
                    </div>

                    <h3 className="mb-2 text-2xl font-bold">{opp.title}</h3>
                    <p className="mb-6 text-sm text-white/80">{opp.description}</p>

                    <div className="text-4xl font-bold transition-transform group-hover:translate-x-1">
                      {opp.count}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* FEATURED OPPORTUNITIES */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          className="space-y-6"
        >
          <h3 className="mb-8 text-2xl font-bold text-[#111827]">Latest Opportunities</h3>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {[
              {
                type: 'Scholarship',
                title: 'Korean Government Scholarship 2024',
                description: 'Full tuition + monthly stipend for deserving students',
                deadline: 'Dec 15, 2024',
              },
              {
                type: 'Internship',
                title: 'Tech Company Summer Internship',
                description: 'Paid internship at leading Korean tech companies',
                deadline: 'Jun 30, 2024',
              },
              {
                type: 'Competition',
                title: 'Student Business Plan Competition',
                description: 'Win cash prizes and mentorship from industry leaders',
                deadline: 'Aug 15, 2024',
              },
              {
                type: 'Exchange',
                title: 'European University Exchange',
                description: 'Study for a semester at partner universities in Europe',
                deadline: 'Jul 01, 2024',
              },
            ].map((opp, idx) => (
              <motion.div
                key={idx}
                whileHover={{ x: 4 }}
                className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-8 transition-all hover:border-red-200 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
              >
                <div className="mb-3 flex items-start justify-between">
                  <span className="rounded-full border border-[#E5E7EB] bg-[#FEF2F2] px-3 py-1 text-xs font-semibold text-[#C41E3A]">
                    {opp.type}
                  </span>
                  <span className="text-xs text-[#6B7280]">Deadline: {opp.deadline}</span>
                </div>
                <h4 className="mb-2 font-bold text-[#111827]">{opp.title}</h4>
                <p className="text-sm text-[#6B7280]">{opp.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
