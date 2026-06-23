'use client'

import React, { CSSProperties, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface BorderBeamProps {
  lightWidth?: number
  duration?: number
  lightColor?: string
  borderWidth?: number
  className?: string
  [key: string]: unknown
}

export function BorderBeam({
  lightWidth = 200,
  duration = 10,
  lightColor = '#C41E3A',
  className,
  ...props
}: BorderBeamProps) {
  const pathRef = useRef<HTMLDivElement>(null)

  const updatePath = () => {
    if (pathRef.current) {
      const div = pathRef.current
      div.style.setProperty(
        '--path',
        `path("M 0 0 H ${div.offsetWidth} V ${div.offsetHeight} H 0 V 0")`
      )
    }
  }

  useEffect(() => {
    updatePath()
    window.addEventListener('resize', updatePath)
    return () => window.removeEventListener('resize', updatePath)
  }, [])

  return (
    <div
      ref={pathRef}
      className={cn('pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit]', className)}
      {...props}
    >
      <motion.div
        className='absolute aspect-square rounded-full'
        style={
          {
            '--light-color': lightColor,
            '--light-width': `${lightWidth}px`,
            width: 'var(--light-width)',
            offsetPath: 'var(--path)',
            background: `radial-gradient(circle, ${lightColor}66, ${lightColor}22, transparent 70%)`,
          } as CSSProperties
        }
        animate={{
          offsetDistance: ['0%', '100%'],
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  )
}
