'use client'

import Link from 'next/link'
import { TrendingUp, Sparkles, Plane, DollarSign, Clock, Award, ShieldAlert } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'

function formatViews(n: number | null | undefined): string {
  if (!n) return 'New'
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K views`
  return `${n} views`
}

type SidebarProps = {
  trending: any[]
  scholarships: any[]
  visaUpdates: any[]
  isLoading?: boolean
}

export function SidebarSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Trending Skeleton */}
      <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="h-6 w-6 rounded bg-slate-200" />
          <div className="h-5 w-32 rounded bg-slate-200" />
        </div>
        <div className="space-y-3.5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-start gap-2.5 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
              <div className="h-7 w-7 shrink-0 rounded-lg bg-slate-100" />
              <div className="flex-1 space-y-1.5">
                <div className="h-4 w-5/6 rounded bg-slate-200" />
                <div className="h-3 w-1/3 rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scholarships Skeleton */}
      <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-5 sm:p-6 shadow-sm">
        <div className="mb-4 h-5 w-40 rounded bg-slate-200" />
        <div className="space-y-3.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-1.5 border-b border-slate-200/50 pb-3 last:border-0 last:pb-0">
              <div className="h-4 w-4/5 rounded bg-slate-200" />
              <div className="h-3 w-1/2 rounded bg-slate-100" />
            </div>
          ))}
        </div>
      </div>

      {/* Visa Skeleton */}
      <div className="rounded-xl border border-[#E5E7EB] bg-[#FEF2F2] p-5 sm:p-6 shadow-sm">
        <div className="mb-4 h-5 w-36 rounded bg-red-100" />
        <div className="space-y-3.5">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-1.5 border-b border-red-100 pb-3 last:border-0 last:pb-0">
              <div className="h-4 w-3/4 rounded bg-red-100" />
              <div className="h-3 w-1/3 rounded bg-red-50" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function Sidebar({ trending, scholarships, visaUpdates, isLoading = false }: SidebarProps) {
  const trendingIcons = [Sparkles, Plane, DollarSign]

  if (isLoading && trending.length === 0 && scholarships.length === 0 && visaUpdates.length === 0) {
    return (
      <div className="sticky top-28">
        <SidebarSkeleton />
      </div>
    )
  }

  return (
    <div className="sticky top-28 space-y-8">
      {/* TRENDING NOW */}
      {trending.length > 0 && (
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-sm transition-shadow hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FEF2F2] text-[#C41E3A]">
                <TrendingUp className="h-3.5 w-3.5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#111827]">Trending Now</h3>
            </div>
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100" title="Live dynamic updates" />
          </div>

          <div className="space-y-3.5">
            {trending.map((article, index) => {
              const Icon = trendingIcons[index % trendingIcons.length]
              const relTime = formatRelativeTime(article.publishedAt || article.createdAt)
              return (
                <Link
                  key={article.id}
                  href={`/blog/${article.slug}`}
                  className="group block border-b border-[#F1F5F9] pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#FEF2F2] text-[#C41E3A] transition-colors group-hover:bg-[#C41E3A] group-hover:text-white">
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-xs sm:text-sm font-semibold leading-snug text-[#111827] transition-colors group-hover:text-[#C41E3A]">
                        {article.title}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-[#6B7280]">
                        <span className="font-semibold text-[#C41E3A] whitespace-nowrap">{formatViews(article.viewCount)}</span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1 whitespace-nowrap">
                          <Clock className="h-3 w-3 shrink-0" />
                          {relTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* LATEST SCHOLARSHIPS */}
      {scholarships.length > 0 && (
        <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-5 sm:p-6 shadow-sm transition-shadow hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Award className="h-3.5 w-3.5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#111827]">Latest Scholarships</h3>
          </div>

          <div className="space-y-3.5">
            {scholarships.map((s) => (
              <Link
                key={s.id}
                href={`/blog/${s.slug}`}
                className="group block border-b border-slate-200/60 pb-3 last:border-0 last:pb-0"
              >
                <div>
                  <p className="line-clamp-2 text-xs sm:text-sm font-semibold leading-snug text-[#111827] transition-colors group-hover:text-[#C41E3A]">
                    {s.title}
                  </p>
                  <div className="mt-1 text-[11px] text-[#6B7280]">
                    {s.deadline ? (
                      <span className="font-medium text-amber-700 whitespace-nowrap">
                        Deadline: {new Date(s.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    ) : (
                      <span className="whitespace-nowrap">{formatRelativeTime(s.publishedAt || s.createdAt)}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* LATEST VISA UPDATES */}
      {visaUpdates.length > 0 && (
        <div className="rounded-xl border border-[#E5E7EB] bg-[#FEF2F2] p-5 sm:p-6 shadow-sm transition-shadow hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-100 text-[#C41E3A]">
              <ShieldAlert className="h-3.5 w-3.5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#111827]">Visa Updates</h3>
          </div>

          <div className="space-y-3.5">
            {visaUpdates.map((u) => (
              <Link
                key={u.id}
                href={`/blog/${u.slug}`}
                className="group block border-b border-red-200/60 pb-3 last:border-0 last:pb-0"
              >
                <div>
                  <p className="line-clamp-2 text-xs sm:text-sm font-semibold leading-snug text-[#111827] transition-colors group-hover:text-[#C41E3A]">
                    {u.title}
                  </p>
                  <p className="mt-1 text-[11px] text-[#6B7280] whitespace-nowrap">
                    Updated {formatRelativeTime(u.publishedAt || u.createdAt)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
