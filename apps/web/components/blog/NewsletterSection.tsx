'use client'

import { motion } from 'framer-motion'
import { Mail, ArrowRight } from 'lucide-react'
import type { FormEvent } from 'react'
import { useState } from 'react'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubscribed(true)
    setTimeout(() => {
      setEmail('')
      setSubscribed(false)
    }, 3000)
  }

  return (
    <section className="relative py-24 lg:py-32 bg-white overflow-hidden">
      {/* BACKGROUND ELEMENTS */}
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 rounded-full bg-[#FEF2F2] blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 rounded-full bg-[#F8FAFC] blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* BACKGROUND GRADIENT */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          className="relative rounded-xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
        >
          <div className="absolute inset-0 bg-[#C41E3A]" />

          {/* CONTENT */}
          <div className="relative p-12 lg:p-20">
            <div className="text-center">
              {/* ICON */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block mb-6"
              >
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                  <Mail className="w-8 h-8 text-white" />
                </div>
              </motion.div>

              {/* HEADING */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl lg:text-5xl font-bold text-white mb-4"
              >
                Stay Updated
              </motion.h2>

              {/* DESCRIPTION */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-xl text-red-100 mb-12 max-w-2xl mx-auto leading-relaxed"
              >
                Get the latest scholarship updates, visa news, and university insights delivered straight to your inbox.
              </motion.p>

              {/* FORM */}
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                onSubmit={handleSubmit}
                className="max-w-lg mx-auto"
              >
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 px-6 py-4 rounded-lg bg-white text-[#111827] placeholder-[#6B7280] outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-600 focus:ring-white transition-all"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="h-14 px-8 rounded-lg bg-white text-[#C41E3A] font-bold hover:bg-[#FEF2F2] transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    {subscribed ? 'Subscribed' : 'Subscribe'}
                    {!subscribed && <ArrowRight className="w-5 h-5" />}
                  </motion.button>
                </div>

                {/* CONFIRMATION */}
                {subscribed && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-white/90 text-sm mt-4"
                  >
                    Thanks! Check your email for confirmation.
                  </motion.p>
                )}
              </motion.form>

              {/* BENEFITS */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="mt-12 pt-12 border-t border-white/20"
              >
                <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-white/90 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-white" />
                    Weekly scholarship updates
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-white" />
                    Visa policy changes
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-white" />
                    Student tips & tricks
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
