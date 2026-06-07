'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Sparkles, DollarSign, Plane } from 'lucide-react'
import Image from 'next/image'

const trendingArticles = [
  { id: 1, title: 'GKS Scholarship 2024', views: '12.5K', icon: Sparkles },
  { id: 2, title: 'Korean D-10 Visa Guide', views: '9.8K', icon: Plane },
  { id: 3, title: 'Student Budget in Seoul', views: '8.2K', icon: DollarSign },
]

const latestScholarships = [
  { name: 'Global Korea Scholarship', deadline: 'June 30' },
  { name: 'KAIST Fellowship', deadline: 'July 15' },
  { name: 'Seoul National University Grant', deadline: 'August 01' },
]

const latestVisaUpdates = [
  { title: 'D-10 Visa Extensions Now Easier', date: 'May 28' },
  { title: 'New Point System for Work Permits', date: 'May 25' },
  { title: 'Summer Break Extension Guidelines', date: 'May 20' },
]

export function Sidebar() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-100px' }}
      className="sticky top-32 space-y-8"
    >
      {/* TRENDING NOW */}
      <motion.div
        variants={itemVariants}
        className="rounded-xl border border-[#E5E7EB] bg-white p-8 transition-shadow hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
      >
        <div className="mb-6 flex items-center gap-3">
          <TrendingUp className="h-6 w-6 text-[#C41E3A]" />
          <h3 className="text-xl font-bold text-[#111827]">Trending Now</h3>
        </div>

        <div className="space-y-4">
          {trendingArticles.map((article, index) => {
            const Icon = article.icon
            return (
              <motion.div
                key={article.id}
                whileHover={{ x: 4 }}
                className="border-b border-[#E5E7EB] pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#FEF2F2]">
                    <Icon className="h-4 w-4 text-[#C41E3A]" />
                  </div>
                  <div className="flex-1">
                    <p className="cursor-pointer text-sm font-semibold text-[#111827] transition-colors hover:text-[#C41E3A]">
                      {article.title}
                    </p>
                    <p className="mt-1 text-xs text-[#6B7280]">{article.views} views</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* LATEST SCHOLARSHIPS */}
      <motion.div
        variants={itemVariants}
        className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-8 transition-shadow hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
      >
        <h3 className="mb-6 text-lg font-bold text-[#111827]">Latest Scholarships</h3>

        <div className="space-y-4">
          {latestScholarships.map((scholarship, index) => (
            <motion.div
              key={index}
              whileHover={{ x: 4 }}
              className="border-b border-[#E5E7EB] pb-4 last:border-0 last:pb-0"
            >
              <p className="text-sm font-semibold text-[#111827]">{scholarship.name}</p>
              <p className="mt-1 text-xs text-[#6B7280]">Deadline: {scholarship.deadline}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* LATEST VISA UPDATES */}
      <motion.div
        variants={itemVariants}
        className="rounded-xl border border-[#E5E7EB] bg-[#FEF2F2] p-8 transition-shadow hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
      >
        <h3 className="mb-6 text-lg font-bold text-[#111827]">Visa Updates</h3>

        <div className="space-y-4">
          {latestVisaUpdates.map((update, index) => (
            <motion.div
              key={index}
              whileHover={{ x: 4 }}
              className="border-b border-[#E5E7EB] pb-4 last:border-0 last:pb-0"
            >
              <p className="text-sm font-semibold text-[#111827]">{update.title}</p>
              <p className="mt-1 text-xs text-[#6B7280]">{update.date}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
