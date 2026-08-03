'use client'

import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium whitespace-nowrap',
  {
    variants: {
      variant: {
        route: '',
        success: '',
        alert: '',
        neutral: '',
        warning: '',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  }
)

const variantStyles: Record<string, { bg: string; text: string; border: string }> = {
  route: {
    bg: 'rgba(232, 163, 61, 0.08)',
    text: '#E8A33D',
    border: 'rgba(232, 163, 61, 0.15)',
  },
  success: {
    bg: 'rgba(79, 209, 165, 0.08)',
    text: '#4FD1A5',
    border: 'rgba(79, 209, 165, 0.15)',
  },
  alert: {
    bg: 'rgba(240, 98, 91, 0.08)',
    text: '#F0625B',
    border: 'rgba(240, 98, 91, 0.15)',
  },
  warning: {
    bg: 'rgba(232, 163, 61, 0.06)',
    text: '#E8A33D',
    border: 'rgba(232, 163, 61, 0.1)',
  },
  neutral: {
    bg: 'rgba(136, 144, 168, 0.06)',
    text: '#8890A8',
    border: 'rgba(136, 144, 168, 0.1)',
  },
}

interface Props extends VariantProps<typeof badgeVariants> {
  children: React.ReactNode
  dot?: boolean
  className?: string
}

export function SABadge({ children, variant = 'neutral', dot, className }: Props) {
  const style = variantStyles[variant || 'neutral']

  return (
    <span
      className={cn(badgeVariants({ variant }), className)}
      style={{
        background: style.bg,
        color: style.text,
        border: `1px solid ${style.border}`,
      }}
    >
      {dot && (
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: style.text }}
        />
      )}
      {children}
    </span>
  )
}
