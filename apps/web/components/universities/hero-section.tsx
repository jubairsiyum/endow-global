"use client";

import { motion, type Variants } from "framer-motion";
import {
  MapPin,
  Zap,
  TrendingUp,
  ArrowRight,
  GraduationCap,
} from "lucide-react";
import { useState } from "react";
import AIMatcher from "./ai-matcher";

export default function HeroSection() {
  const [showMatcher, setShowMatcher] = useState(false);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  return (
    <div className="relative w-full py-16 lg:py-20 overflow-x-hidden">
      {/* Animated background elements - positioned behind content */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/3 h-72 w-72 rounded-full bg-red-200 opacity-10 blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14 items-center">
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Badge */}
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1.5">
                <Zap className="h-3.5 w-3.5 text-[#C41E3A]" />
                <span className="text-xs font-medium text-[#C41E3A]">
                  AI-Powered University Matching
                </span>
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.div variants={itemVariants} className="space-y-3">
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
                Discover Your{" "}
                <span className="bg-gradient-to-r from-[#C41E3A] to-[#E11D48] bg-clip-text text-transparent">
                  Perfect
                </span>
                <br />
                Global University
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="max-w-xl text-base lg:text-lg text-gray-600 leading-relaxed"
            >
              Leverage AI-powered intelligence to find universities that match
              your academic profile, budget, and career aspirations. Access
              exclusive scholarships and complete your journey to global
              education.
            </motion.p>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-4 py-2"
            >
              <div className="space-y-1.5">
                <p className="text-2xl font-bold text-gray-900">
                  250+
                </p>
                <p className="text-sm text-gray-600">Partner Universities</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-2xl font-bold text-gray-900">
                  45
                </p>
                <p className="text-sm text-gray-600">Countries</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-2xl font-bold text-gray-900">
                  98%
                </p>
                <p className="text-sm text-gray-600">Visa Success</p>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => setShowMatcher(true)}
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-[#C41E3A] to-[#E11D48] px-6 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(196,30,58,0.22)] hover:shadow-[0_16px_32px_rgba(196,30,58,0.28)] transition-all duration-300 hover:scale-[1.02]"
              >
                <GraduationCap className="h-4 w-4" />
                Start AI Matching
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="inline-flex h-12 items-center gap-2 rounded-full border border-gray-900 px-6 text-sm font-semibold text-gray-900 hover:bg-gray-900 hover:text-white transition-colors">
                Explore Universities
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          </motion.div>

          {/* Right Content - AI Matcher Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative z-20"
          >
            <div className="rounded-2xl bg-white/85 backdrop-blur-md border border-white/60 p-5 shadow-xl lg:p-6">
              <AIMatcher onClose={() => setShowMatcher(false)} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
