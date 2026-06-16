import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type ShineBorderProps = {
  children: ReactNode
  className?: string
  borderWidth?: number
  duration?: number
}

export const ShineBorder = ({
  children,
  className,
  borderWidth = 2,
  duration = 4,
}: ShineBorderProps) => {
  return (
    <div
      className={cn('shine-border-wrapper relative rounded-2xl', className)}
      style={{
        '--shine-duration': `${duration}s`,
        '--shine-border': `${borderWidth}px`,
      } as React.CSSProperties}
    >
      <div className="shine-border-gradient" />
      <div className="relative rounded-2xl bg-white">
        {children}
      </div>
    </div>
  )
}
