'use client'

import { motion } from 'framer-motion'
import { useAuthMode } from './AuthContext'

export default function AuthTabToggle() {
  const { mode, setMode } = useAuthMode()
  const isSignIn = mode === 'signin'

  const handleSignInClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!isSignIn) {
      setMode('signin')
    }
  }

  const handleSignUpClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isSignIn) {
      setMode('signup')
    }
  }

  return (
    <div className="mb-7 flex w-full justify-center">
      <div className="relative flex h-12 w-full items-center gap-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100/90 p-1 shadow-inner backdrop-blur-xl">
        <button
          onClick={handleSignInClick}
          className="relative flex h-full flex-1 cursor-pointer items-center justify-center border-none bg-transparent px-5 py-3 text-sm font-bold"
        >
          {isSignIn && (
            <motion.div
              layoutId="activePill"
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="absolute inset-1 rounded-[0.85rem] bg-gradient-to-r from-slate-950 to-red-900 shadow-[0_12px_26px_rgba(127,29,29,0.24)]"
            >
              <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-sm" />
            </motion.div>
          )}

          <span
            className={`relative z-10 whitespace-nowrap transition-colors duration-300 ${
              isSignIn ? 'text-white' : 'text-slate-500 hover:text-slate-950'
            } `}
          >
            Sign In
          </span>
        </button>

        {/* Sign Up Button Container */}
        <button
          onClick={handleSignUpClick}
          className="relative flex h-full flex-1 cursor-pointer items-center justify-center border-none bg-transparent px-5 py-3 text-sm font-bold"
        >
          {!isSignIn && (
            <motion.div
              layoutId="activePill"
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="absolute inset-1 rounded-[0.85rem] bg-gradient-to-r from-slate-950 to-red-900 shadow-[0_12px_26px_rgba(127,29,29,0.24)]"
            >
              <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-sm" />
            </motion.div>
          )}

          <span
            className={`relative z-10 whitespace-nowrap transition-colors duration-300 ${
              !isSignIn ? 'text-white' : 'text-slate-500 hover:text-slate-950'
            } `}
          >
            Sign Up
          </span>
        </button>
      </div>
    </div>
  )
}
