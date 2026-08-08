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
    bg: 'rgba(217, 119, 6, 0.1)',
    text: '#b45309',
    border: 'rgba(217, 119, 6, 0.15)',
  },
  success: {
    bg: 'rgba(5, 150, 105, 0.1)',
    text: '#059669',
    border: 'rgba(5, 150, 105, 0.15)',
  },
  alert: {
    bg: 'rgba(220, 38, 38, 0.08)',
    text: '#dc2626',
    border: 'rgba(220, 38, 38, 0.15)',
  },
  warning: {
    bg: 'rgba(217, 119, 6, 0.08)',
    text: '#b45309',
    border: 'rgba(217, 119, 6, 0.1)',
  },
  neutral: {
    bg: 'rgba(75, 85, 99, 0.08)',
    text: '#4b5563',
    border: 'rgba(75, 85, 99, 0.1)',
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
