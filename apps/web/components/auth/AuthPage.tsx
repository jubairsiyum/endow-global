'use client'

import { useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import { CinematicBranding } from './CinematicBranding'
import { AuthPanel } from './AuthPanel'
import { FloatingObjects } from './FloatingObjects'

interface AuthPageProps {
  mode?: 'login' | 'signup'
}

function AuthPageContent({ mode = 'login' }: AuthPageProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleAuthSubmit = async (data: { email: string; password: string }) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log('Auth data:', data)
      // Handle authentication here
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex h-screen overflow-hidden">
        {/* Left Branding Section (Hidden on Mobile) */}
        <motion.div
          className="hidden lg:flex lg:w-1/2 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <CinematicBranding />
        </motion.div>

        {/* Right Auth Section */}
        <motion.div
          className="w-full lg:w-1/2 flex flex-col items-center justify-center relative bg-gradient-to-br from-white via-gray-50 to-white overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Floating background elements */}
          <FloatingObjects />

          {/* Auth Panel */}
          <div className="relative z-10 w-full px-6 sm:px-8">
            <AuthPanel onSubmit={handleAuthSubmit} isLoading={isLoading} />
          </div>

          {/* Curved Divider (Desktop Only) */}
          <svg
            className="hidden lg:block absolute left-0 top-0 h-full w-32 text-[#C41E3A]/5"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{ width: '100px', height: '100%' }}
          >
            <path d="M0,0 Q50,50 0,100 L0,0" fill="currentColor" />
          </svg>
        </motion.div>
      </div>
    </div>
  )
}

export function AuthPage({ mode = 'login' }: AuthPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 border-3 border-gray-200 border-t-[#C41E3A] rounded-full"
          />
        </div>
      }
    >
      <AuthPageContent mode={mode} />
    </Suspense>
  )
}
