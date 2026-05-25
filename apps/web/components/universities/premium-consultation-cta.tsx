"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  CheckCircle2,
  MessageCircle,
  Phone,
  Sparkles,
} from "lucide-react";

export default function PremiumConsultationCTA() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-red-50 via-white to-rose-100 py-20 lg:py-24">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-red-500/15 opacity-30 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-rose-400/10 opacity-20 blur-3xl" />
      </div>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-200/80 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-red-100 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.78),transparent_48%)]" />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[620px] w-[920px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/60 bg-white/20 blur-2xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-8 text-center"
        >
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-white/80 px-3 py-1.5 shadow-sm backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-[#C41E3A]" />
              <span className="text-xs font-medium text-[#C41E3A]">
                Limited Time Offer
              </span>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h2 className="text-4xl font-bold tracking-tight text-gray-950 lg:text-5xl">
              Ready to Transform Your
              <br />
              <span className="bg-gradient-to-r from-[#C41E3A] to-[#E11D48] bg-clip-text text-transparent">
                Educational Future?
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-gray-600 lg:text-lg">
              Get a free profile evaluation from our education experts. Receive
              personalized university recommendations and exclusive scholarship
              opportunities.
            </p>
          </motion.div>

          {/* CTA Buttons Grid */}
          <motion.div
            variants={containerVariants}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 max-w-3xl mx-auto pt-2"
          >
            {/* WhatsApp */}
            <motion.a
              href="#"
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="group rounded-2xl border border-white/40 bg-white/80 p-5 shadow-xl backdrop-blur-xl transition-all hover:border-red-200 hover:shadow-red-100 lg:p-6"
            >
              <motion.div
                whileHover={{ scale: 1.08, rotate: 6 }}
                className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-[#C41E3A] ring-1 ring-red-100"
              >
                <MessageCircle className="h-5 w-5" />
              </motion.div>
              <h3 className="mb-2 font-bold text-gray-950">WhatsApp Consultation</h3>
              <p className="mb-4 text-sm text-gray-600">
                Chat with our counselors instantly
              </p>
              <p className="text-xs font-semibold text-[#C41E3A]">
                Available 24/7
              </p>
            </motion.a>

            {/* Phone */}
            <motion.a
              href="#"
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="group rounded-2xl border border-white/40 bg-white/80 p-5 shadow-xl backdrop-blur-xl transition-all hover:border-red-200 hover:shadow-red-100 lg:p-6"
            >
              <motion.div
                whileHover={{ scale: 1.08, rotate: 6 }}
                className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-[#C41E3A] ring-1 ring-red-100"
              >
                <Phone className="h-5 w-5" />
              </motion.div>
              <h3 className="mb-2 font-bold text-gray-950">Phone Call</h3>
              <p className="mb-4 text-sm text-gray-600">
                Speak with an expert counselor
              </p>
              <p className="text-xs font-semibold text-[#C41E3A]">
                +1 (800) 123-4567
              </p>
            </motion.a>

            {/* Calendar */}
            <motion.a
              href="#"
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="group rounded-2xl border border-white/40 bg-white/80 p-5 shadow-xl backdrop-blur-xl transition-all hover:border-red-200 hover:shadow-red-100 lg:p-6"
            >
              <motion.div
                whileHover={{ scale: 1.08, rotate: 6 }}
                className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-[#C41E3A] ring-1 ring-red-100"
              >
                <Calendar className="h-5 w-5" />
              </motion.div>
              <h3 className="mb-2 font-bold text-gray-950">Book Appointment</h3>
              <p className="mb-4 text-sm text-gray-600">
                Schedule your personalized session
              </p>
              <p className="text-xs font-semibold text-[#C41E3A]">
                Pick your time
              </p>
            </motion.a>
          </motion.div>

          {/* Benefits */}
          <motion.div
            variants={itemVariants}
            className="mx-auto max-w-2xl space-y-3 pt-2"
          >
            <p className="text-sm font-semibold text-gray-500">
              WHAT YOU'LL GET
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Free Profile Assessment",
                "AI University Matching",
                "Scholarship Opportunities",
                "Visa Success Prediction",
              ].map((benefit, idx) => (
                <motion.p
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white/70 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm backdrop-blur-md"
                >
                  <CheckCircle2 className="h-4 w-4 text-[#C41E3A]" />
                  {benefit}
                </motion.p>
              ))}
            </div>
          </motion.div>

          {/* Guarantee */}
          <motion.div
            variants={itemVariants}
            className="mx-auto max-w-2xl rounded-2xl border border-red-100 bg-white/85 p-5 shadow-[0_8px_28px_rgba(15,23,42,0.06)] backdrop-blur-md"
          >
            <p className="text-sm leading-relaxed text-gray-600">
              <span className="font-bold">100% Money-Back Guarantee</span> - If you're
              not satisfied with our recommendations, we'll refund your
              consultation fee.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
