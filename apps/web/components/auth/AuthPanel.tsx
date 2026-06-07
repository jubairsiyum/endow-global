'use client'

import { useState } from 'react'

import { motion, AnimatePresence } from 'framer-motion'

import { Eye, EyeOff, Mail, Lock, Shield } from 'lucide-react'

interface AuthPanelProps {
  onSubmit?: (data: { email: string; password: string }) => void

  isLoading?: boolean
}

export default function AuthPanel({ onSubmit, isLoading = false }: AuthPanelProps) {
  const [email, setEmail] = useState('')

  const [password, setPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)

  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    setError('')

    if (!email || !password) {
      setError('Please fill in all fields')

      return
    }

    onSubmit?.({
      email,
      password,
    })
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 40,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.7,
      }}
      className="relative overflow-hidden rounded-[42px] border border-white/10 bg-[linear-gradient(180deg,rgba(4,8,20,0.98)_0%,rgba(2,6,18,0.96)_100%)] shadow-[0_45px_120px_rgba(0,0,0,0.72)] backdrop-blur-2xl"
    >
      {/* TOP EDGE LIGHT */}
      <div className="absolute left-10 right-10 top-0 h-[2px] rounded-full bg-gradient-to-r from-cyan-300/55 via-white/75 to-[#ff445c]/60 opacity-60" />

      {/* LEFT BLUE EDGE */}
      <div className="absolute bottom-8 left-[-16px] h-[180px] w-[34px] rounded-full bg-cyan-400/80 blur-2xl" />

      {/* RIGHT RED GLOW */}
      <div className="absolute right-[-60px] top-[-60px] h-[240px] w-[240px] rounded-full bg-[#ff2445]/35 blur-3xl" />

      {/* BOTTOM BLUE LIGHT */}
      <div className="absolute bottom-[-100px] left-[8%] h-[200px] w-[200px] rounded-full bg-blue-500/20 blur-3xl" />

      {/* INNER SHINE */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_28%)]" />

      {/* INNER BORDER */}
      <div className="absolute inset-[1px] rounded-[42px] border border-white/[0.04]" />

      {/* CONTENT */}
      <div className="relative z-10 px-7 py-7">
        {/* PREMIUM LOGO */}
        <motion.div
          initial={{
            scale: 0.85,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          transition={{
            duration: 0.7,
          }}
          className="relative mx-auto flex h-[95px] w-[95px] items-center justify-center"
        >
          {/* GLOW */}
          <motion.div
            animate={{
              scale: [1, 1.12, 1],
              opacity: [0.45, 0.8, 0.45],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 rounded-[36px] bg-[#9F050F]/45 blur-3xl"
          />

          {/* MAIN ICON BOX */}
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[36px] bg-gradient-to-br from-[#ff2445] via-[#9F050F] to-[#70030b] shadow-[0_30px_90px_rgba(159,5,15,0.65)]">
            {/* TOP SHINE */}
            <div className="absolute left-0 top-0 h-1/2 w-full bg-white/15 blur-2xl" />

            {/* MOVING LIGHT */}
            <motion.div
              animate={{
                x: ['-160%', '220%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute inset-y-0 w-[40%] rotate-[18deg] bg-white/25 blur-xl"
            />

            {/* SHIELD */}
            <motion.div
              animate={{
                y: [0, -2, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative z-10"
            >
              <Shield
                size={46}
                strokeWidth={3}
                className="text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.95)]"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* HEADER */}
        <div className="mt-6 text-center">
          <h2 className="text-[36px] font-bold tracking-[-1.5px] text-white">Admin Portal</h2>

          <p className="mt-3 text-[14px] leading-7 text-white/55">
            Welcome back! Please sign in to continue.
          </p>
        </div>

        {/* FORM */}
        <AnimatePresence mode="wait">
          <motion.form
            onSubmit={handleSubmit}
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.4,
            }}
            className="mt-5 space-y-3.5"
          >
            {/* EMAIL */}
            <div>
              <label className="mb-2.5 block text-[13px] font-medium text-white/75">
                Email Address
              </label>

              <div className="group flex h-[56px] items-center rounded-[18px] border border-white/10 bg-white/[0.03] px-5 transition-all duration-300 focus-within:border-[#9F050F]/60 focus-within:bg-white/[0.05] hover:border-[#9F050F]/40">
                <Mail size={17} className="text-white/30" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)

                    setError('')
                  }}
                  placeholder="admin@endowglobal.com"
                  className="h-full w-full bg-transparent px-3 text-[14px] text-white outline-none placeholder:text-white/20"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="mb-2.5 block text-[13px] font-medium text-white/75">Password</label>

              <div className="group flex h-[56px] items-center rounded-[18px] border border-white/10 bg-white/[0.03] px-5 transition-all duration-300 focus-within:border-[#9F050F]/60 focus-within:bg-white/[0.05] hover:border-[#9F050F]/40">
                <Lock size={17} className="text-white/30" />

                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)

                    setError('')
                  }}
                  placeholder="Enter your password"
                  className="h-full w-full bg-transparent px-3 text-[14px] text-white outline-none placeholder:text-white/20"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-white/30 transition hover:text-white/70"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* ERROR */}
            <AnimatePresence>
              {error && (
                <motion.div
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
                  }}
                  className="rounded-2xl border border-[#9F050F]/30 bg-[#9F050F]/10 px-4 py-3 text-sm text-red-300"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* OPTIONS */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2.5 text-[13px] text-white/55">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/20 bg-transparent accent-[#9F050F]"
                />
                Remember me
              </label>

              <button type="button" className="text-[13px] font-medium text-[#ff5c68]">
                Forgot Password?
              </button>
            </div>

            {/* BUTTON */}
            <motion.button
              whileHover={{
                y: -1,
              }}
              whileTap={{
                scale: 0.985,
              }}
              disabled={isLoading}
              type="submit"
              className="relative mt-2 flex h-[58px] w-full items-center justify-center overflow-hidden rounded-[18px] bg-gradient-to-r from-[#7f040d] via-[#9F050F] to-[#d10d1b] text-[15px] font-semibold text-white shadow-[0_30px_70px_rgba(159,5,15,0.45)]"
            >
              <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.2),transparent)] opacity-40" />

              <span className="relative z-10">{isLoading ? 'Signing In...' : 'Sign In'}</span>
            </motion.button>

            {/* FOOTER */}
          </motion.form>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
