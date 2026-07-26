'use client'

import { type ReactNode, useCallback, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface TiltCardProps {
  children: ReactNode
  className?: string
  tiltDegree?: number
}

/**
 * Wraps children with a subtle 3D perspective tilt on hover.
 * Disables tilt when `prefers-reduced-motion` is set but keeps other hover styles.
 */
export function TiltCard({ children, className, tiltDegree = 6 }: TiltCardProps) {
  const prefersReducedMotion = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion || !ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      ref.current.style.transform = `
        perspective(600px)
        rotateY(${x * tiltDegree}deg)
        rotateX(${-y * tiltDegree}deg)
      `
    },
    [prefersReducedMotion, tiltDegree],
  )

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return
    ref.current.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg)'
  }, [])

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{ transformStyle: 'preserve-3d', transition: 'transform 0.15s ease-out' }}
      whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
    >
      {children}
    </motion.div>
  )
}
