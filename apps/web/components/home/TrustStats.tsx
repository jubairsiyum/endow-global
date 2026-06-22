'use client'

import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { useCountUp } from '@/lib/hooks/useCountUp'
import { Users, GraduationCap, Globe2, Award } from 'lucide-react'

const stats = [
  { icon: Users, value: 2000, suffix: '+', label: 'Students Placed', desc: 'Successfully enrolled in South Korea & Australia', color: 'text-[#C41E3A]', bg: 'bg-rose-50' },
  { icon: GraduationCap, value: 50, suffix: '+', label: 'Partner Universities', desc: 'Top-ranked institutions in SK & AU', color: 'text-amber-500', bg: 'bg-amber-50' },
  { icon: Globe2, value: 2, suffix: '', label: 'Countries', desc: 'South Korea & Australia specialists', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { icon: Award, value: 98, suffix: '%', label: 'Success Rate', desc: 'Visa approval & admission', color: 'text-blue-500', bg: 'bg-blue-50' },
] as const

function StatItem({ icon: Icon, value, suffix, label, desc, color, bg }: {
  icon: React.ElementType; value: number; suffix: string; label: string; desc: string; color: string; bg: string
}) {
  const count = useCountUp(value, { duration: 1.4 })
  return (
    <div className="flex flex-col items-center px-4 py-6 text-center sm:px-6">
      <span className={`mb-3 flex h-12 w-12 items-center justify-center rounded-2xl ${bg}`}>
        <Icon size={22} className={color} />
      </span>
      <div className="text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl">
        {Math.round(count).toLocaleString()}<span className={color}>{suffix}</span>
      </div>
      <div className="mt-2 text-sm font-semibold text-gray-800">{label}</div>
      <div className="mt-0.5 text-xs text-gray-400">{desc}</div>
    </div>
  )
}

export default function TrustStats() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section ref={ref} className="border-y border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div key={stat.label} className={`${i < stats.length - 1 ? 'border-r border-gray-100' : ''} ${i < 2 ? 'border-b lg:border-b-0' : ''}`}>
              {isInView ? <StatItem {...stat} /> : (
                <div className="flex flex-col items-center px-4 py-6 text-center sm:px-6">
                  <span className={`mb-3 flex h-12 w-12 items-center justify-center rounded-2xl ${stat.bg}`}>
                    <stat.icon size={22} className={stat.color} />
                  </span>
                  <div className="text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl">0<span className={stat.color}>{stat.suffix}</span></div>
                  <div className="mt-2 text-sm font-semibold text-gray-800">{stat.label}</div>
                  <div className="mt-0.5 text-xs text-gray-400">{stat.desc}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
