'use client'

import { useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import CinematicBranding from './CinematicBranding'
import AuthPanel from './AuthPanel'
import FloatingObjects from './FloatingObjects'

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
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">
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
          className="w-full lg:w-1/2 flex flex-col items-center justify-center relative overflow-hidden px-4 sm:px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Premium floating background effects */}
          <FloatingObjects />

          {/* Auth Panel */}
          <motion.div
            className="relative z-20 w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <AuthPanel onSubmit={handleAuthSubmit} isLoading={isLoading} />
          </motion.div>

          {/* Premium curved divider SVG (Desktop Only) */}
          <svg
            className="hidden lg:block absolute left-0 top-0 h-full text-white/5"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{ width: '120px', height: '100%' }}
          >
            <defs>
              <linearGradient id="dividerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(196, 30, 58, 0.05)" />
                <stop offset="100%" stopColor="rgba(255, 255, 255, 0.1)" />
              </linearGradient>
            </defs>
            <path d="M0,0 Q50,50 0,100 L0,0" fill="url(#dividerGradient)" />
          </svg>

          {/* Additional decorative elements for premium feel */}
          <motion.div
            className="absolute top-20 left-20 w-1 h-1 bg-[#C41E3A]/20 rounded-full"
            animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-40 right-40 w-1 h-1 bg-[#C41E3A]/10 rounded-full"
            animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          />
        </motion.div>
      </div>
    </div>
  )
}

export default function AuthPage({ mode = 'login' }: AuthPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-gray-100">
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
