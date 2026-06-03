'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Sparkles, DollarSign, Plane } from 'lucide-react'
import Image from 'next/image'

const trendingArticles = [
  { id: 1, title: 'GKS Scholarship 2024', views: '12.5K', icon: Sparkles },
  { id: 2, title: 'Korean D-10 Visa Guide', views: '9.8K', icon: Plane },
  { id: 3, title: 'Student Budget in Seoul', views: '8.2K', icon: DollarSign }
]

const latestScholarships = [
  { name: 'Global Korea Scholarship', deadline: 'June 30' },
  { name: 'KAIST Fellowship', deadline: 'July 15' },
  { name: 'Seoul National University Grant', deadline: 'August 01' }
]

const latestVisaUpdates = [
  { title: 'D-10 Visa Extensions Now Easier', date: 'May 28' },
  { title: 'New Point System for Work Permits', date: 'May 25' },
  { title: 'Summer Break Extension Guidelines', date: 'May 20' }
]

export function Sidebar() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-100px' }}
      className="space-y-8 sticky top-32"
    >
      {/* TRENDING NOW */}
      <motion.div
        variants={itemVariants}
        className="rounded-xl bg-white border border-[#E5E7EB] p-8 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-shadow"
      >
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-[#C41E3A]" />
          <h3 className="text-xl font-bold text-[#111827]">Trending Now</h3>
        </div>

        <div className="space-y-4">
          {trendingArticles.map((article, index) => {
            const Icon = article.icon
            return (
              <motion.div
                key={article.id}
                whileHover={{ x: 4 }}
                className="pb-4 border-b border-[#E5E7EB] last:border-0 last:pb-0"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#FEF2F2] flex items-center justify-center">
                    <Icon className="w-4 h-4 text-[#C41E3A]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#111827] hover:text-[#C41E3A] transition-colors cursor-pointer">
                      {article.title}
                    </p>
                    <p className="text-xs text-[#6B7280] mt-1">{article.views} views</p>
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
        className="rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] p-8 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-shadow"
      >
        <h3 className="text-lg font-bold text-[#111827] mb-6">Latest Scholarships</h3>

        <div className="space-y-4">
          {latestScholarships.map((scholarship, index) => (
            <motion.div
              key={index}
              whileHover={{ x: 4 }}
              className="pb-4 border-b border-[#E5E7EB] last:border-0 last:pb-0"
            >
              <p className="text-sm font-semibold text-[#111827]">{scholarship.name}</p>
              <p className="text-xs text-[#6B7280] mt-1">Deadline: {scholarship.deadline}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* LATEST VISA UPDATES */}
      <motion.div
        variants={itemVariants}
        className="rounded-xl bg-[#FEF2F2] border border-[#E5E7EB] p-8 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-shadow"
      >
        <h3 className="text-lg font-bold text-[#111827] mb-6">Visa Updates</h3>

        <div className="space-y-4">
          {latestVisaUpdates.map((update, index) => (
            <motion.div
              key={index}
              whileHover={{ x: 4 }}
              className="pb-4 border-b border-[#E5E7EB] last:border-0 last:pb-0"
            >
              <p className="text-sm font-semibold text-[#111827]">{update.title}</p>
              <p className="text-xs text-[#6B7280] mt-1">{update.date}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
