'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { TrendingUp, Sparkles, Plane, DollarSign } from 'lucide-react'

function formatViews(n: number | null | undefined): string {
  if (!n) return 'New'
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K views`
  return `${n} views`
}

type SidebarProps = {
  trending: any[]
  scholarships: any[]
  visaUpdates: any[]
}

export function Sidebar({ trending, scholarships, visaUpdates }: SidebarProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  const trendingIcons = [Sparkles, Plane, DollarSign]

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="sticky top-32 space-y-8"
    >
      {/* TRENDING NOW */}
      {trending.length > 0 && (
        <motion.div variants={itemVariants} className="rounded-xl border border-[#E5E7EB] bg-white p-8 transition-shadow hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
          <div className="mb-6 flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-[#C41E3A]" />
            <h3 className="text-xl font-bold text-[#111827]">Trending Now</h3>
          </div>

          <div className="space-y-4">
            {trending.map((article, index) => {
              const Icon = trendingIcons[index % trendingIcons.length]
              return (
                <Link key={article.id} href={`/blog/${article.slug}`} className="block border-b border-[#E5E7EB] pb-4 last:border-0 last:pb-0">
                  <motion.div whileHover={{ x: 4 }} className="flex items-start gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#FEF2F2]">
                      <Icon className="h-4 w-4 text-[#C41E3A]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#111827] transition-colors hover:text-[#C41E3A]">{article.title}</p>
                      <p className="mt-1 text-xs text-[#6B7280]">{formatViews(article.viewCount)}</p>
                    </div>
                  </motion.div>
                </Link>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* LATEST SCHOLARSHIPS */}
      {scholarships.length > 0 && (
        <motion.div variants={itemVariants} className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-8 transition-shadow hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
          <h3 className="mb-6 text-lg font-bold text-[#111827]">Latest Scholarships</h3>

          <div className="space-y-4">
            {scholarships.map((s) => (
              <Link key={s.id} href={`/blog/${s.slug}`} className="block border-b border-[#E5E7EB] pb-4 last:border-0 last:pb-0">
                <motion.div whileHover={{ x: 4 }}>
                  <p className="text-sm font-semibold text-[#111827] transition-colors hover:text-[#C41E3A]">{s.title}</p>
                  {s.deadline && (
                    <p className="mt-1 text-xs text-[#6B7280]">Deadline: {new Date(s.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  )}
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* LATEST VISA UPDATES */}
      {visaUpdates.length > 0 && (
        <motion.div variants={itemVariants} className="rounded-xl border border-[#E5E7EB] bg-[#FEF2F2] p-8 transition-shadow hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
          <h3 className="mb-6 text-lg font-bold text-[#111827]">Visa Updates</h3>

          <div className="space-y-4">
            {visaUpdates.map((u) => (
              <Link key={u.id} href={`/blog/${u.slug}`} className="block border-b border-[#E5E7EB] pb-4 last:border-0 last:pb-0">
                <motion.div whileHover={{ x: 4 }}>
                  <p className="text-sm font-semibold text-[#111827] transition-colors hover:text-[#C41E3A]">{u.title}</p>
                  {u.publishedAt && (
                    <p className="mt-1 text-xs text-[#6B7280]">{new Date(u.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  )}
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
