'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight, Users, FileText, Building2, DollarSign, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KPI {
  label: string
  value: string
  sub: string
  icon: React.ElementType
  trend?: { value: string; direction: 'up' | 'down' | 'flat' }
  accent?: 'route' | 'success' | 'alert'
}

const kpis: KPI[] = [
  {
    label: 'Active Applications',
    value: '1,247',
    sub: '428 pending · 819 confirmed',
    icon: FileText,
    trend: { value: '+12%', direction: 'up' },
    accent: 'route',
  },
  {
    label: 'Total Branches',
    value: '24',
    sub: '18 active · 6 in setup',
    icon: Building2,
    trend: { value: '+2', direction: 'up' },
    accent: 'success',
  },
  {
    label: 'Partner Universities',
    value: '136',
    sub: '12 countries · 89 active',
    icon: Globe,
    trend: { value: '+8%', direction: 'up' },
    accent: 'success',
  },
  {
    label: 'Revenue (MTD)',
    value: '$384K',
    sub: '+18% vs last month',
    icon: DollarSign,
    trend: { value: '+18%', direction: 'up' },
    accent: 'route',
  },
]

const accentStyles = {
  route: { border: '#E8A33D', bg: 'rgba(232, 163, 61, 0.06)', text: '#E8A33D' },
  success: { border: '#4FD1A5', bg: 'rgba(79, 209, 165, 0.06)', text: '#4FD1A5' },
  alert: { border: '#F0625B', bg: 'rgba(240, 98, 91, 0.06)', text: '#F0625B' },
}

const EASE = [0.16, 1, 0.3, 1] as const

export function KPICardRow() {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi, i) => {
        const Icon = kpi.icon
        const accent = accentStyles[kpi.accent || 'route']

        return (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, ease: EASE }}
            className="group relative overflow-hidden rounded-xl border p-5 transition-all hover:-translate-y-0.5"
            style={{
              background: '#161B2E',
              borderColor: '#262C42',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
            }}
          >
            {/* Accent top line */}
            <div
              className="absolute left-0 right-0 top-0 h-[2px] opacity-0 transition-opacity group-hover:opacity-100"
              style={{ background: accent.border }}
            />

            <div className="relative z-10 flex items-start justify-between">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg"
                style={{ background: accent.bg }}
              >
                <Icon size={16} style={{ color: accent.text }} />
              </div>

              {kpi.trend && (
                <div
                  className="flex items-center gap-0.5 rounded-md px-2 py-0.5 text-[11px] font-medium"
                  style={{
                    background: 'rgba(79, 209, 165, 0.08)',
                    color: '#4FD1A5',
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  <ArrowUpRight size={11} />
                  {kpi.trend.value}
                </div>
              )}
            </div>

            <div className="relative z-10 mt-3">
              <h3
                className="text-[32px] font-bold leading-none tracking-tight"
                style={{
                  color: '#E8EAF2',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {kpi.value}
              </h3>
              <p className="mt-1 text-[12px] font-medium" style={{ color: '#8890A8' }}>
                {kpi.label}
              </p>
              <p className="mt-0.5 text-[11px]" style={{ color: 'rgba(136, 144, 168, 0.6)' }}>
                {kpi.sub}
              </p>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
