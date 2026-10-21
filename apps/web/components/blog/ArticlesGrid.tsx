'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, User, Calendar, Eye } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'

const categoryColors: Record<string, string> = {
  Scholarships: 'bg-[#FEF2F2] text-[#C41E3A]',
  'Visa Guide': 'bg-[#F8FAFC] text-[#111827]',
  'Study Abroad': 'bg-[#FEF2F2] text-[#C41E3A]',
  'University News': 'bg-[#F8FAFC] text-[#111827]',
  'Student Life': 'bg-[#FEF2F2] text-[#C41E3A]',
  'Success Stories': 'bg-[#F8FAFC] text-[#111827]',
  Career: 'bg-[#FEF2F2] text-[#C41E3A]',
  Resources: 'bg-[#FEF2F2] text-[#C41E3A]',
  'Company Updates': 'bg-[#F8FAFC] text-[#111827]',
}

function readTime(content: string | null | undefined): string {
  const words = (content || '').replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.round(words / 200))} min`
}

type ArticlesGridProps = {
  articles: any[]
}

export function ArticlesGrid({ articles }: ArticlesGridProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  if (articles.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#E5E7EB] py-20 text-center text-gray-400">
        No articles published yet.
      </div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.05 }}
      className="grid grid-cols-1 gap-8"
    >
      {articles.map((article) => (
        <motion.article
          key={article.id}
          variants={itemVariants}
          whileHover={{ y: -4 }}
          className="group overflow-hidden rounded-xl border border-[#E5E7EB] bg-white transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
        >
          <div className="flex flex-col md:flex-row h-full">
            {/* IMAGE */}
            <div className="relative h-56 sm:h-64 md:h-auto md:w-64 lg:w-72 shrink-0 overflow-hidden bg-[#F8FAFC]">
              {(() => {
                const safeCoverImage = article.coverImage?.trim().startsWith('http') || article.coverImage?.trim().startsWith('/') 
                  ? article.coverImage.trim() 
                  : null;
                  
                return safeCoverImage ? (
                  <Image
                    src={safeCoverImage}
                    alt={article.title || 'Article'}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-gray-200">
                    {article.title?.charAt(0)?.toUpperCase() || 'E'}
                  </div>
                )
              })()}
            </div>

            {/* CONTENT */}
            <div className="flex flex-1 min-w-0 flex-col justify-between p-6 sm:p-7">
              <div>
                {article.category && (
                  <div className="mb-3.5">
                    <span className={`inline-flex items-center rounded-full border border-[#E5E7EB] px-3.5 py-1 text-xs sm:text-sm font-semibold ${categoryColors[article.category] ?? 'bg-[#F8FAFC] text-[#111827]'}`}>
                      {article.category}
                    </span>
                  </div>
                )}

                <h3 className="mb-2.5 line-clamp-2 text-xl sm:text-2xl font-bold tracking-tight text-[#111827] transition-colors group-hover:text-[#C41E3A]">
                  {article.title}
                </h3>

                <p className="line-clamp-2 sm:line-clamp-3 text-sm sm:text-base leading-relaxed text-[#6B7280]">
                  {article.description || ''}
                </p>
              </div>

              <div className="mt-6 flex flex-col justify-between gap-4 border-t border-[#E5E7EB] pt-5 sm:flex-row sm:items-center">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-[#6B7280]">
                  {article.author && (
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <User className="h-4 w-4 shrink-0 text-slate-400" />
                      <span>{article.author}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <Calendar className="h-4 w-4 shrink-0 text-slate-400" />
                    <span>{formatRelativeTime(article.publishedAt || article.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <Clock className="h-4 w-4 shrink-0 text-slate-400" />
                    <span>{readTime(article.content)}</span>
                  </div>
                  {article.viewCount > 0 && (
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <Eye className="h-4 w-4 shrink-0 text-slate-400" />
                      <span>{article.viewCount >= 1000 ? `${(article.viewCount / 1000).toFixed(1)}k` : article.viewCount} views</span>
                    </div>
                  )}
                </div>

                <Link
                  href={`/blog/${article.slug}`}
                  className="inline-flex shrink-0 items-center gap-1.5 text-sm sm:text-base font-semibold text-[#C41E3A] whitespace-nowrap transition-all group-hover:gap-2.5"
                >
                  Read More <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                </Link>
              </div>
            </div>
          </div>
        </motion.article>
      ))}
    </motion.div>
  )
}
