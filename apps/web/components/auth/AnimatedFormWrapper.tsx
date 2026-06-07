'use client'

import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export default function AnimatedFormWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isSignIn = pathname === '/sign-in'

  // Create a stable key based on the route
  const routeKey = isSignIn ? 'sign-in' : 'sign-up'

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={routeKey}
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          y: -10,
        }}
        transition={{
          duration: 0.4,
          ease: 'easeInOut',
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
