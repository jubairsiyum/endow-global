'use client'

import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { Users, GraduationCap, Globe2, Award } from 'lucide-react'
import { useCountUp } from '@/lib/hooks/useCountUp'

const stats = [
  { icon: Users, value: 2500, suffix: '+', label: 'Students Placed', color: 'text-[#C41E3A]' },
  { icon: GraduationCap, value: 150, suffix: '+', label: 'Partner Universities', color: 'text-amber-500' },
  { icon: Globe2, value: 12, suffix: '+', label: 'Countries', color: 'text-emerald-500' },
  { icon: Award, value: 98, suffix: '%', label: 'Visa Success Rate', color: 'text-blue-500' },
] as const

function StatItem({
  icon: Icon,
  value,
  suffix,
  label,
  color,
}: {
  icon: React.ElementType
  value: number
  suffix: string
  label: string
  color: string
}) {
  const count = useCountUp(value, { duration: 1.2 })

  return (
    <div className="flex flex-col items-center gap-2 px-4 py-3 text-center sm:px-6">
      <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gray-50 ${color}`}>
        <Icon size={22} />
      </span>
      <div className="text-2xl font-black tracking-tight text-gray-950 sm:text-3xl">
        {Math.round(count)}
        {suffix}
      </div>
      <div className="text-xs font-medium uppercase tracking-widest text-gray-400 sm:text-sm">
        {label}
      </div>
    </div>
  )
}

export default function StatsBar() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section ref={ref} className="border-y border-gray-100 bg-white py-8 sm:py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-0">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`${stat !== stats[stats.length - 1] ? 'sm:border-r sm:border-gray-100' : ''}`}
            >
              {isInView ? (
                <StatItem {...stat} />
              ) : (
                <div className="flex flex-col items-center gap-2 px-4 py-3 text-center sm:px-6">
                  <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gray-50 ${stat.color}`}>
                    <stat.icon size={22} />
                  </span>
                  <div className="text-2xl font-black tracking-tight text-gray-950 sm:text-3xl">
                    0{stat.suffix}
                  </div>
                  <div className="text-xs font-medium uppercase tracking-widest text-gray-400 sm:text-sm">
                    {stat.label}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
