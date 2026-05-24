"use client";

import { motion } from "framer-motion";
import { MessageCircle, Phone, Calendar, Sparkles } from "lucide-react";

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
    <section className="relative py-32 overflow-x-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-black overflow-hidden">
        <div className="absolute inset-0 opacity-20 overflow-hidden">
          <div className="absolute top-1/2 left-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500 blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 right-1/4 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500 blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-12 text-center"
        >
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/50 bg-purple-500/10 px-4 py-2 backdrop-blur-xl">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">
                Limited Time Offer
              </span>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white">
              Ready to Transform Your
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Educational Future?
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-300">
              Get a free profile evaluation from our education experts. Receive
              personalized university recommendations and exclusive scholarship
              opportunities.
            </p>
          </motion.div>

          {/* CTA Buttons Grid */}
          <motion.div
            variants={containerVariants}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-3xl mx-auto pt-8"
          >
            {/* WhatsApp */}
            <motion.a
              href="#"
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="group rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-400/50 p-8 backdrop-blur-xl hover:border-green-400 transition-all"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                className="mx-auto mb-4 h-12 w-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white"
              >
                <MessageCircle className="h-6 w-6" />
              </motion.div>
              <h3 className="font-bold text-white mb-2">WhatsApp Consultation</h3>
              <p className="text-sm text-gray-300 mb-4">
                Chat with our counselors instantly
              </p>
              <p className="text-xs text-green-300 font-semibold">
                Available 24/7
              </p>
            </motion.a>

            {/* Phone */}
            <motion.a
              href="#"
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="group rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/50 p-8 backdrop-blur-xl hover:border-blue-400 transition-all"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                className="mx-auto mb-4 h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white"
              >
                <Phone className="h-6 w-6" />
              </motion.div>
              <h3 className="font-bold text-white mb-2">Phone Call</h3>
              <p className="text-sm text-gray-300 mb-4">
                Speak with an expert counselor
              </p>
              <p className="text-xs text-blue-300 font-semibold">
                +1 (800) 123-4567
              </p>
            </motion.a>

            {/* Calendar */}
            <motion.a
              href="#"
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="group rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/50 p-8 backdrop-blur-xl hover:border-purple-400 transition-all"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                className="mx-auto mb-4 h-12 w-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white"
              >
                <Calendar className="h-6 w-6" />
              </motion.div>
              <h3 className="font-bold text-white mb-2">Book Appointment</h3>
              <p className="text-sm text-gray-300 mb-4">
                Schedule your personalized session
              </p>
              <p className="text-xs text-purple-300 font-semibold">
                Pick your time
              </p>
            </motion.a>
          </motion.div>

          {/* Benefits */}
          <motion.div
            variants={itemVariants}
            className="max-w-2xl mx-auto space-y-4 pt-8"
          >
            <p className="text-gray-400 text-sm font-semibold">
              WHAT YOU'LL GET
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                "✓ Free Profile Assessment",
                "✓ AI University Matching",
                "✓ Scholarship Opportunities",
                "✓ Visa Success Prediction",
              ].map((benefit, idx) => (
                <motion.p
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-gray-300 font-medium"
                >
                  {benefit}
                </motion.p>
              ))}
            </div>
          </motion.div>

          {/* Guarantee */}
          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-yellow-400/50 bg-yellow-500/10 p-6 backdrop-blur-xl max-w-2xl mx-auto"
          >
            <p className="text-sm text-yellow-300">
              🎓 <span className="font-bold">100% Money-Back Guarantee</span> - If you're
              not satisfied with our recommendations, we'll refund your
              consultation fee.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
