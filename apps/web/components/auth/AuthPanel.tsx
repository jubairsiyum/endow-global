'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import SocialButtons from './SocialButtons'

type AuthTab = 'login' | 'signup'

interface AuthPanelProps {
  onSubmit?: (data: { email: string; password: string }) => void
  isLoading?: boolean
}

export default function AuthPanel({ onSubmit, isLoading = false }: AuthPanelProps) {
  const [tab, setTab] = useState<AuthTab>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)

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
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  }

  const inputVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      className="w-full max-w-md mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Glassmorphism Card Container */}
      <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
        {/* Subtle gradient border glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 p-8 sm:p-10">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-2">
              {tab === 'login' ? 'Welcome back' : 'Join us'}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base font-light">
              {tab === 'login'
                ? 'Sign in to continue your journey'
                : 'Start exploring world-class universities'}
            </p>
          </motion.div>

          {/* Premium Tab Switcher */}
          <motion.div
            className="relative mb-8 inline-flex gap-1 bg-gray-100/80 p-1 rounded-full w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            {(['login', 'signup'] as const).map((t, idx) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t)
                  setError('')
                }}
                className={`flex-1 py-2.5 px-4 rounded-full font-medium text-sm transition-all duration-300 relative z-10 ${
                  tab === t ? 'text-[#C41E3A]' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
            {/* Animated active pill background */}
            <motion.div
              className="absolute inset-y-1 bg-white rounded-full shadow-sm"
              animate={{
                x: tab === 'login' ? 0 : 'calc(100% + 4px)',
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{ width: 'calc(50% - 2px)' }}
              layoutId="activeTab"
            />
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
              <form onSubmit={handleSubmit} className="space-y-5 mb-6">
                {/* Email Input */}
                <motion.div
                  variants={inputVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.2 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                    Email address
                  </label>
                  <motion.div
                    className={`relative group transition-all duration-300 ${
                      emailFocused ? 'scale-105' : 'scale-100'
                    }`}
                  >
                    <input
                      type="email"
                      value={email}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        setError('')
                      }}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#C41E3A]/50 focus:border-[#C41E3A] transition-all duration-300 placeholder:text-gray-400 text-gray-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading}
                    />
                    {/* Focus glow effect */}
                    {emailFocused && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-[#C41E3A]/10 to-transparent rounded-2xl pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                  </motion.div>
                </motion.div>

                {/* Password Input */}
                <motion.div
                  variants={inputVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.25 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                    Password
                  </label>
                  <motion.div
                    className={`relative group transition-all duration-300 ${
                      passwordFocused ? 'scale-105' : 'scale-100'
                    }`}
                  >
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        setError('')
                      }}
                      placeholder="••••••••"
                      className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#C41E3A]/50 focus:border-[#C41E3A] transition-all duration-300 placeholder:text-gray-400 text-gray-900 font-medium pr-12 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading}
                    />
                    {/* Password visibility toggle */}
                    <motion.button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors z-10"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {showPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </motion.button>
                    {/* Focus glow effect */}
                    {passwordFocused && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-[#C41E3A]/10 to-transparent rounded-2xl pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                  </motion.div>
                </motion.div>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="p-3 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl text-sm text-red-600 font-medium"
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
                    <motion.button
                      type="button"
                      className="text-sm text-[#C41E3A] font-semibold hover:text-red-700 transition-colors relative group"
                      whileHover={{ x: 2 }}
                    >
                      Forgot password?
                      <motion.div
                        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#C41E3A] to-red-600 rounded-full"
                        animate={{ width: 0 }}
                        whileHover={{ width: '100%' }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.button>
                  </motion.div>
                )}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  whileHover={{ y: -2, boxShadow: '0 20px 40px rgba(196, 30, 58, 0.2)' }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 bg-gradient-to-r from-[#C41E3A] to-red-600 text-white font-semibold rounded-2xl hover:shadow-xl transition-shadow duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="relative z-10 block">
                    {isLoading ? 'Loading...' : tab === 'login' ? 'Sign In' : 'Create Account'}
                  </span>
                </motion.button>
              </form>

              {/* Divider */}
              <motion.div
                className="flex items-center gap-3 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <motion.div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Or</span>
                <motion.div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              </motion.div>

              {/* Social Buttons */}
              <SocialButtons isLoading={isLoading} />

              {/* Footer Navigation Text */}
              <motion.div
                className="text-center text-sm text-gray-600 mt-7"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <motion.button
                  type="button"
                  onClick={() => {
                    setTab(tab === 'login' ? 'signup' : 'login')
                    setError('')
                  }}
                  className="text-[#C41E3A] font-bold hover:text-red-700 transition-colors relative group inline"
                  whileHover={{ scale: 1.05 }}
                >
                  {tab === 'login' ? 'Sign up' : 'Sign in'}
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#C41E3A] to-red-600 rounded-full"
                    animate={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
