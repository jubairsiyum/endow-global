'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { HTMLMotionProps, Variants } from 'framer-motion'
import type { ReactNode } from 'react'

function buildFadeUpVariants(_reducedMotion: boolean): Variants {
  return {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
    },
  }
}

type DivMotionProps = Omit<
  HTMLMotionProps<'div'>,
  'variants' | 'initial' | 'whileInView' | 'viewport' | 'transition'
>

export function FadeUp({
  children,
  amount = 0.15,
  className,
  ...rest
}: DivMotionProps & { children: ReactNode; amount?: number }) {
  const prefersReducedMotion = useReducedMotion()
  const variants = buildFadeUpVariants(!!prefersReducedMotion)

  return (
    <motion.div
      variants={prefersReducedMotion ? undefined : variants}
      initial={prefersReducedMotion ? undefined : 'hidden'}
      whileInView={prefersReducedMotion ? undefined : 'visible'}
      viewport={prefersReducedMotion ? undefined : { once: true, amount, margin: '0px 0px -50px 0px' }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

export function FadeUpStagger({
  children,
  amount = 0.15,
  staggerChildren = 0.08,
  className,
  ...rest
}: DivMotionProps & {
  children: ReactNode
  amount?: number
  staggerChildren?: number
}) {
  const prefersReducedMotion = useReducedMotion()

  const variants: Variants = prefersReducedMotion
    ? {}
    : {
        hidden: {},
        visible: {
          transition: {
            staggerChildren,
            delayChildren: 0,
          },
        },
      }

  return (
    <motion.div
      variants={prefersReducedMotion ? undefined : variants}
      initial={prefersReducedMotion ? undefined : 'hidden'}
      whileInView={prefersReducedMotion ? undefined : 'visible'}
      viewport={prefersReducedMotion ? undefined : { once: true, amount, margin: '0px 0px -50px 0px' }}
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
    <motion.div
      variants={prefersReducedMotion ? undefined : variants}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
