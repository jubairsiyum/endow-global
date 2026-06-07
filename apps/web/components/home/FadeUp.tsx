'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { HTMLMotionProps, Variants } from 'framer-motion'
import type { ReactNode } from 'react'

function buildFadeUpVariants(reducedMotion: boolean): Variants {
  return {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }
}

type DivMotionProps = Omit<
  HTMLMotionProps<'div'>,
  'variants' | 'initial' | 'whileInView' | 'viewport' | 'transition'
>

export function FadeUp({
  children,
  amount = 0.2,
  className,
  ...rest
}: DivMotionProps & { children: ReactNode; amount?: number }) {
  const prefersReducedMotion = useReducedMotion()
  const variants = buildFadeUpVariants(!!prefersReducedMotion)

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

export function FadeUpStagger({
  children,
  amount = 0.2,
  staggerChildren = 0.1,
  className,
  ...rest
}: DivMotionProps & {
  children: ReactNode
  amount?: number
  staggerChildren?: number
}) {
  const prefersReducedMotion = useReducedMotion()
  const variants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : staggerChildren,
        delayChildren: 0,
      },
    },
  }

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

export function FadeUpItem({
  children,
  className,
  ...rest
}: DivMotionProps & { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion()
  const variants = buildFadeUpVariants(!!prefersReducedMotion)

  return (
    <motion.div variants={variants} className={className} {...rest}>
      {children}
    </motion.div>
  )
}
