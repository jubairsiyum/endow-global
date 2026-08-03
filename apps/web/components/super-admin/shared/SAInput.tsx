'use client'

import { cn } from '@/lib/utils'
import React from 'react'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
}

export const SAInput = React.forwardRef<HTMLInputElement, Props>(
  ({ className, icon, ...props }, ref) => {
    return (
      <div className="relative flex items-center">
        {icon && (
          <span
            className="pointer-events-none absolute left-3"
            style={{ color: '#8890A8' }}
          >
            {icon}
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full rounded-md border bg-transparent text-[13px] outline-none placeholder:text-[#8890A8]/60 focus:border-[#E8A33D]/50',
            icon ? 'pl-9 pr-3 py-1.5' : 'px-3 py-1.5',
            className
          )}
          style={{
            borderColor: '#262C42',
            color: '#E8EAF2',
          }}
          {...props}
        />
      </div>
    )
  }
)
SAInput.displayName = 'SAInput'
