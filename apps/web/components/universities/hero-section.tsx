"use client";

import { motion, type Variants } from "framer-motion";
import { Zap, ArrowRight, GraduationCap } from "lucide-react";
import { useState } from "react";
import AIMatcher from "./ai-matcher";

export default function HeroSection() {
  const [showMatcher, setShowMatcher] = useState(false);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.15 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  return (
    <div className="relative w-full overflow-x-hidden py-16 lg:py-20">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-red-500/10 opacity-20 blur-3xl" />
      </div>

      <div className="relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-3 py-1.5 shadow-sm">
                <Zap className="h-3.5 w-3.5 text-[#C41E3A]" />
                <span className="text-xs font-semibold text-[#C41E3A]">
                  AI-Powered University Matching
                </span>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-3">
              <h1 className="text-5xl font-bold tracking-tight text-[#111827] lg:text-6xl">
                Discover Your{" "}
                <span className="text-[#C41E3A]">Perfect</span>
                <br />
                Global University
              </h1>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="max-w-xl text-base leading-relaxed text-gray-600"
            >
              Leverage AI-powered intelligence to find universities that match
              your academic profile, budget, and career aspirations. Access
              exclusive scholarships and complete your journey to global
              education.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="grid max-w-lg grid-cols-3 gap-4 py-1"
            >
              {[
                ["250+", "Partner Universities"],
                ["45", "Countries"],
                ["98%", "Visa Success"],
              ].map(([value, label]) => (
                <div key={label} className="space-y-1">
                  <p className="text-2xl font-bold text-[#111827]">{value}</p>
                  <p className="text-sm text-gray-600">{label}</p>
                </div>
              ))}
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-3 pt-1"
            >
              <button
                onClick={() => setShowMatcher(true)}
                className="group inline-flex h-11 items-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-rose-500 px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(196,30,58,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-red-200"
              >
                <GraduationCap className="h-4 w-4" />
                Start AI Matching
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button className="inline-flex h-11 items-center gap-2 rounded-full border border-gray-900 px-5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-900 hover:text-white">
                Explore Universities
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.25 }}
            className="relative z-20"
          >
            <div className="rounded-3xl border border-gray-200 bg-white/90 p-5 shadow-[0_10px_40px_rgba(0,0,0,0.06)] backdrop-blur-md lg:p-6">
              <AIMatcher onClose={() => setShowMatcher(false)} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
