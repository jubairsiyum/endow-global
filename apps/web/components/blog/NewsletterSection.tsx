'use client'

import { motion } from 'framer-motion'
import { Mail, ArrowRight } from 'lucide-react'
import { ds } from '@/lib/design-system'
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
    <section className={`${ds.section.base} overflow-hidden ${ds.section.bg.white} ${ds.section.padding}`}>
      <div className="pointer-events-none absolute right-0 top-0 -mr-40 -mt-40 h-96 w-96 rounded-full bg-[var(--brand-light)] blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-0 left-0 -mb-40 -ml-40 h-96 w-96 rounded-full bg-[var(--bg-light)] blur-3xl" aria-hidden="true" />

      <div className={`${ds.container.narrow} relative z-10`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          className={`relative overflow-hidden ${ds.card.rounded} ${ds.shadow.newsletter}`}
        >
          <div className={`absolute inset-0 bg-[var(--brand)]`} />

          <div className="relative p-12 lg:p-20">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-6 inline-block"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                  <Mail className="h-8 w-8 text-white" aria-hidden="true" />
                </div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className={`${ds.headings.section} mb-4 text-white`}
              >
                Stay Updated
              </motion.h2>

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
                    aria-label="Email address for newsletter"
                    className={ds.input.base}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    aria-label="Subscribe to newsletter"
                    className="flex h-14 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-white px-8 font-bold text-[var(--brand)] transition-colors hover:bg-[var(--brand-light)]"
                  >
                    {subscribed ? 'Subscribed' : 'Subscribe'}
                    {!subscribed && <ArrowRight className="h-5 w-5" aria-hidden="true" />}
                  </motion.button>
                </div>
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

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="mt-12 border-t border-white/20 pt-12"
              >
                <div className="flex flex-col items-center justify-center gap-8 text-sm text-white/90 sm:flex-row">
                  <div className="flex items-center gap-2">
                    <div className={`${ds.accent.dot} bg-white`} aria-hidden="true" />
                    Weekly scholarship updates
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`${ds.accent.dot} bg-white`} aria-hidden="true" />
                    Visa policy changes
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`${ds.accent.dot} bg-white`} aria-hidden="true" />
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
