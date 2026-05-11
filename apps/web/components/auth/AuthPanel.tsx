'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SocialButtons } from './SocialButtons'
import { FeatureCards } from './FeatureCards'

type AuthTab = 'login' | 'signup'

interface AuthPanelProps {
  onSubmit?: (data: { email: string; password: string }) => void
  isLoading?: boolean
}

export function AuthPanel({ onSubmit, isLoading = false }: AuthPanelProps) {
  const [tab, setTab] = useState<AuthTab>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email')
      return
    }

    onSubmit?.({ email, password })
  }

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <motion.div
      className="w-full max-w-md mx-auto p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {tab === 'login' ? 'Welcome back' : 'Join Endow Global'}
        </h2>
        <p className="text-gray-600">
          {tab === 'login'
            ? 'Sign in to continue your journey'
            : 'Start exploring world-class universities'}
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {(['login', 'signup'] as const).map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t)
              setError('')
            }}
            className={`flex-1 py-2 px-3 rounded-md font-medium transition-all ${
              tab === t
                ? 'bg-white text-[#C41E3A] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {t === 'login' ? 'Sign In' : 'Sign Up'}
          </button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            {/* Email Input */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError('')
                }}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent transition-all bg-white"
                disabled={isLoading}
              />
            </motion.div>

            {/* Password Input */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError('')
                }}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent transition-all bg-white"
                disabled={isLoading}
              />
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Forgot Password Link */}
            {tab === 'login' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex justify-end"
              >
                <button
                  type="button"
                  className="text-sm text-[#C41E3A] hover:underline"
                >
                  Forgot password?
                </button>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-gradient-to-r from-[#C41E3A] to-red-600 text-white font-semibold rounded-xl hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Loading...' : tab === 'login' ? 'Sign In' : 'Create Account'}
            </motion.button>
          </form>

          {/* Divider */}
          <motion.div
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-gray-600">Or continue with</span>
            <div className="flex-1 h-px bg-gray-200" />
          </motion.div>

          {/* Social Buttons */}
          <SocialButtons isLoading={isLoading} />

          {/* Footer Text */}
          <motion.p
            className="text-center text-sm text-gray-600 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => setTab(tab === 'login' ? 'signup' : 'login')}
              className="text-[#C41E3A] font-semibold hover:underline"
            >
              {tab === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </motion.p>
        </motion.div>
      </AnimatePresence>

      {/* Features (Compact) */}
      <FeatureCards variant="compact" />
    </motion.div>
  )
}
