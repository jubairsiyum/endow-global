'use client'

import { motion } from 'framer-motion'
import { Trophy, Users, Globe, Briefcase, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { trpc } from '@/lib/trpc-client'

const defaultStats = [
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

const statIcons: Record<string, typeof Trophy> = {
  Scholarships: Trophy,
  Internships: Briefcase,
  Competitions: Users,
  'Exchange Programs': Globe,
}

const defaultOpportunities = [
  {
    type: 'Scholarship',
    title: 'Global Korea Scholarship (GKS) Degree Program',
    description: 'Full tuition + monthly stipend for deserving international students',
    deadline: 'Dec 15, 2026',
    href: '/scholarships',
  },
  {
    type: 'Internship',
    title: 'Seoul Global Tech Company Summer Internship',
    description: 'Paid corporate internship at leading Korean tech companies',
    deadline: 'Jun 30, 2027',
    href: '/blog',
  },
  {
    type: 'Competition',
    title: 'International Student Business Plan Challenge',
    description: 'Win seed grant prizes and mentorship from Korean industry leaders',
    deadline: 'Aug 15, 2027',
    href: '/blog',
  },
  {
    type: 'Exchange',
    title: 'Partner University Semester Exchange',
    description: 'Study for a credit-bearing semester at renowned universities with tuition waiver',
    deadline: 'Jul 01, 2027',
    href: '/universities',
  },
]

export function OpportunityHub() {
  const { data } = trpc.resource.published.opportunityHub.useQuery()

  const stats = (data?.stats && data.stats.length > 0)
    ? data.stats.map((s, idx) => ({
        icon: statIcons[s.title] || defaultStats[idx % defaultStats.length].icon,
        title: s.title,
        count: s.count,
        description: s.description,
        color: defaultStats[idx % defaultStats.length].color,
      }))
    : defaultStats

  const latestOpportunities = (data?.latestOpportunities && data.latestOpportunities.length > 0)
    ? data.latestOpportunities
    : defaultOpportunities

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
          viewport={{ once: true, amount: 0.2 }}
          className="mb-16 text-center"
        >
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#C41E3A] shadow-sm">
            Opportunities
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
            Opportunity Hub
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-500">
            Explore scholarships, internships, and student exchange opportunities
          </p>
        </motion.div>

        {/* OPPORTUNITIES GRID */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((opp, index) => {
            const Icon = opp.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.03, y: -6 }}
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

        {/* FEATURED / LATEST OPPORTUNITIES */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-[#111827]">Latest Opportunities</h3>
            <Link
              href="/scholarships"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#C41E3A] hover:underline"
            >
              View All Scholarships
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {latestOpportunities.map((opp, idx) => (
              <Link key={idx} href={opp.href || '/scholarships'} className="block">
                <motion.div
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="group flex flex-col justify-between h-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-8 transition-all hover:border-red-200 hover:bg-white hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
                >
                  <div>
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <span className="rounded-full border border-rose-100 bg-[#FEF2F2] px-3 py-1 text-xs font-semibold text-[#C41E3A]">
                        {opp.type}
                      </span>
                      <span className="text-xs font-medium text-[#6B7280]">Deadline: {opp.deadline}</span>
                    </div>
                    <h4 className="mb-2 font-bold text-[#111827] group-hover:text-[#C41E3A] transition-colors">
                      {opp.title}
                    </h4>
                    <p className="text-sm leading-relaxed text-[#6B7280]">{opp.description}</p>
                  </div>

                  <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-[#C41E3A] group-hover:translate-x-1 transition-transform">
                    Explore Opportunity <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
