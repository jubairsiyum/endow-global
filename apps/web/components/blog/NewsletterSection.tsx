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
    <section className="relative overflow-hidden bg-white py-24 lg:py-32">
      {/* BACKGROUND ELEMENTS */}
      <div className="pointer-events-none absolute right-0 top-0 -mr-40 -mt-40 h-96 w-96 rounded-full bg-[#FEF2F2] blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 -mb-40 -ml-40 h-96 w-96 rounded-full bg-[#F8FAFC] blur-3xl" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* BACKGROUND GRADIENT */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          className="relative overflow-hidden rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
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
                className="mb-6 inline-block"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                  <Mail className="h-8 w-8 text-white" />
                </div>
              </motion.div>

              {/* HEADING */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="mb-4 text-4xl font-bold text-white lg:text-5xl"
              >
                Stay Updated
              </motion.h2>

              {/* DESCRIPTION */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="mx-auto mb-12 max-w-2xl text-xl leading-relaxed text-red-100"
              >
                Get the latest scholarship updates, visa news, and university insights delivered
                straight to your inbox.
              </motion.p>

              {/* FORM */}
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                onSubmit={handleSubmit}
                className="mx-auto max-w-lg"
              >
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 rounded-lg bg-white px-6 py-4 text-[#111827] placeholder-[#6B7280] outline-none transition-all focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-600"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="flex h-14 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-white px-8 font-bold text-[#C41E3A] transition-colors hover:bg-[#FEF2F2]"
                  >
                    {subscribed ? 'Subscribed' : 'Subscribe'}
                    {!subscribed && <ArrowRight className="h-5 w-5" />}
                  </motion.button>
                </div>

                {/* CONFIRMATION */}
                {subscribed && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 text-sm text-white/90"
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
                className="mt-12 border-t border-white/20 pt-12"
              >
                <div className="flex flex-col items-center justify-center gap-8 text-sm text-white/90 sm:flex-row">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-white" />
                    Weekly scholarship updates
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-white" />
                    Visa policy changes
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-white" />
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
