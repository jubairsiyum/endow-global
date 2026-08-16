'use client'

import { cn } from '@/lib/utils'
import type { StatusConfig } from '@/lib/dashboard'

interface Props {
  label: string
  config: StatusConfig
  className?: string
}

export function StatusPill({ label, config, className }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide',
        config.color,
        config.bg,
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', config.dot)} aria-hidden />
      {label}
    </span>
  )
}
