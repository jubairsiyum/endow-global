'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import React from 'react'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-[13px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E1220] disabled:pointer-events-none disabled:opacity-40',
  {
    variants: {
      variant: {
        primary: '',
        secondary: '',
        ghost: '',
        danger: '',
      },
      size: {
        sm: 'h-7 px-2.5 text-[11px]',
        md: 'h-8 px-3',
        lg: 'h-10 px-4 text-[14px]',
        icon: 'h-8 w-8',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

type StyleDef = {
  bg: string
  text: string
  border?: string
  hoverBg: string
  hoverText?: string
  hoverBorder?: string
  ringColor: string
  duration: string
}

const styles: Record<string, StyleDef> = {
  primary: {
    bg: '#E8A33D',
    text: '#0E1220',
    hoverBg: '#c48b2e',
    ringColor: '#E8A33D',
    duration: '120ms',
  },
  secondary: {
    bg: '#161B2E',
    text: '#E8EAF2',
    border: '1px solid #262C42',
    hoverBg: '#1e2440',
    hoverBorder: '#363D5C',
    ringColor: '#262C42',
    duration: '120ms',
  },
  ghost: {
    bg: 'transparent',
    text: '#8890A8',
    hoverBg: 'rgba(255,255,255,0.04)',
    hoverText: '#E8EAF2',
    ringColor: '#262C42',
    duration: '120ms',
  },
  danger: {
    bg: 'rgba(240, 98, 91, 0.1)',
    text: '#F0625B',
    border: '1px solid rgba(240, 98, 91, 0.15)',
    hoverBg: 'rgba(240, 98, 91, 0.18)',
    ringColor: '#F0625B',
    duration: '120ms',
  },
}

interface Props
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const SAButton = React.forwardRef<HTMLButtonElement, Props>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const s = styles[variant || 'primary']

    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        style={{
          background: s.bg,
          color: s.text,
          border: s.border || 'none',
          transitionDuration: s.duration,
          ['--sa-ring' as string]: s.ringColor,
        }}
        onMouseEnter={(e) => {
          const t = e.currentTarget
          t.style.background = s.hoverBg
          if (s.hoverBorder) t.style.borderColor = s.hoverBorder
          if (s.hoverText) t.style.color = s.hoverText
        }}
        onMouseLeave={(e) => {
          const t = e.currentTarget
          t.style.background = s.bg
          if (s.border) {
            // Reset to original border
            t.style.borderColor = s.border!.replace(/^[^ ]+ /, '') || ''
            t.style.border = s.border
          }
          t.style.color = s.text
        }}
        {...props}
      />
    )
  }
)
SAButton.displayName = 'SAButton'
