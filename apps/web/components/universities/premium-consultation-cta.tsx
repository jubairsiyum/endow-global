'use client'

import { motion } from 'framer-motion'
import { Calendar, CheckCircle2, MessageCircle, Phone } from 'lucide-react'

export default function PremiumConsultationCTA() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-red-50/60 to-white pt-6 pb-14 lg:pt-8 lg:pb-16">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-red-500/10 opacity-20 blur-3xl" />
      </div>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-200/80 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-red-100 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.78),transparent_48%)]" />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[480px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70 bg-white/20 blur-2xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-7 text-center"
        >
          {/* Main Heading */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h2 className="text-[clamp(2.6rem,4.2vw,4.8rem)] font-bold tracking-normal leading-[1.05]">
              <span className="text-[#071225]">
                Ready to Transform Your
              </span>
              <br />
              <span className="text-[#C41E3A]">
                Educational Future?
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-base leading-7 text-slate-600">
              Get a free profile evaluation from our education experts. Receive 
              personalized university recommendations and exclusive scholarship 
              opportunities.
            </p>
          </motion.div>

          {/* CTA Buttons Grid */}
          <motion.div
            variants={containerVariants}
            className="mx-auto max-w-3xl pt-1 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {/* WhatsApp */}
            <motion.a
              href="#"
              variants={itemVariants}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="group rounded-3xl border border-gray-200 bg-white p-5 shadow-[0_10px_40px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-1 hover:border-red-100 hover:shadow-red-100"
            >
              <motion.div
                whileHover={{ scale: 1.08, rotate: 6 }}
                className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-[#C41E3A] ring-1 ring-red-100"
              >
                <MessageCircle className="h-5 w-5" />
              </motion.div>
              <h3 className="mb-2 font-bold text-gray-950">WhatsApp Consultation</h3>
              <p className="mb-4 text-sm text-gray-600">Chat with our counselors instantly</p>
              <p className="text-xs font-semibold text-[#C41E3A]">Available 24/7</p>
            </motion.a>

            {/* Phone */}
            <motion.a
              href="#"
              variants={itemVariants}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="group rounded-3xl border border-gray-200 bg-white p-5 shadow-[0_10px_40px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-1 hover:border-red-100 hover:shadow-red-100"
            >
              <motion.div
                whileHover={{ scale: 1.08, rotate: 6 }}
                className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-[#C41E3A] ring-1 ring-red-100"
              >
                <Phone className="h-5 w-5" />
              </motion.div>
              <h3 className="mb-2 font-bold text-gray-950">Phone Call</h3>
              <p className="mb-4 text-sm text-gray-600">Speak with an expert counselor</p>
              <p className="text-xs font-semibold text-[#C41E3A]">+1 (800) 123-4567</p>
            </motion.a>

            {/* Calendar */}
            <motion.a
              href="#"
              variants={itemVariants}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="group rounded-3xl border border-gray-200 bg-white p-5 shadow-[0_10px_40px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-1 hover:border-red-100 hover:shadow-red-100"
            >
              <motion.div
                whileHover={{ scale: 1.08, rotate: 6 }}
                className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-[#C41E3A] ring-1 ring-red-100"
              >
                <Calendar className="h-5 w-5" />
              </motion.div>
              <h3 className="mb-2 font-bold text-gray-950">Book Appointment</h3>
              <p className="mb-4 text-sm text-gray-600">Schedule your personalized session</p>
              <p className="text-xs font-semibold text-[#C41E3A]">Pick your time</p>
            </motion.a>
          </motion.div>

          {/* Benefits */}
          <motion.div variants={itemVariants} className="mx-auto max-w-2xl space-y-3 pt-2">
            <p className="text-sm font-semibold text-gray-500">WHAT YOU'LL GET</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                'Free Profile Assessment',
                'AI University Matching',
                'Scholarship Opportunities',
                'Visa Success Prediction',
              ].map((benefit, idx) => (
                <motion.p
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm"
                >
                  <CheckCircle2 className="h-4 w-4 text-[#C41E3A]" />
                  {benefit}
                </motion.p>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}