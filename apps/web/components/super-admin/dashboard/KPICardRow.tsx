'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight, FileText, Building2, Globe, DollarSign, Users, GraduationCap } from 'lucide-react'

interface KPIMetrics {
  totalApplications: number
  totalBranches: number
  totalUniversities: number
  totalStudents: number
  totalCounselors: number
}

interface Props {
  metrics?: KPIMetrics | null
}

const NUM_FMT = new Intl.NumberFormat()

const accentStyles: Record<string, { border: string; bg: string; text: string }> = {
  route: { border: '#E8A33D', bg: 'rgba(232, 163, 61, 0.06)', text: '#E8A33D' },
  success: { border: '#4FD1A5', bg: 'rgba(79, 209, 165, 0.06)', text: '#4FD1A5' },
  alert: { border: '#F0625B', bg: 'rgba(240, 98, 91, 0.06)', text: '#F0625B' },
}

const EASE = [0.16, 1, 0.3, 1] as const

export function KPICardRow({ metrics }: Props) {
  const totalApplications = metrics?.totalApplications ?? 0
  const totalBranches = metrics?.totalBranches ?? 0
  const totalUniversities = metrics?.totalUniversities ?? 0
  const totalPlatformUsers = (metrics?.totalStudents ?? 0) + (metrics?.totalCounselors ?? 0)

  const kpis = [
    {
      label: 'Active Applications',
      value: NUM_FMT.format(totalApplications),
      sub: `${totalApplications > 0 ? 'Real-time student submissions' : 'No applications yet'}`,
      icon: FileText,
      accent: 'route' as const,
    },
    {
      label: 'Total Branches',
      value: NUM_FMT.format(totalBranches),
      sub: `${totalBranches > 0 ? 'Global offices operating' : 'No branches configured'}`,
      icon: Building2,
      accent: 'success' as const,
    },
    {
      label: 'Partner Universities',
      value: NUM_FMT.format(totalUniversities),
      sub: `${totalUniversities > 0 ? 'Across key study destinations' : 'No university partners yet'}`,
      icon: Globe,
      accent: 'success' as const,
    },
    {
      label: 'Platform Members',
      value: NUM_FMT.format(totalPlatformUsers),
      sub: `${metrics?.totalStudents ?? 0} students · ${metrics?.totalCounselors ?? 0} counselors`,
      icon: Users,
      accent: 'route' as const,
    },
    {
      label: 'Applications',
      value: NUM_FMT.format(totalApplications),
      sub: 'Total platform-wide',
      icon: FileText,
      accent: 'success',
    },
    {
      label: 'Branches',
      value: NUM_FMT.format(totalBranches),
      sub: 'Regional offices',
      icon: Building2,
      accent: 'route',
    },
    {
      label: 'Universities',
      value: NUM_FMT.format(totalUniversities),
      sub: 'Partner institutions',
      icon: GraduationCap,
      accent: 'success',
    },
    {
      label: 'Platform Members',
      value: NUM_FMT.format(totalPlatformUsers),
      sub: 'Students + counselors',
      icon: Users,
      accent: 'route',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi, i) => {
        const Icon = kpi.icon
        const accent = accentStyles[kpi.accent]

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
