"use client";

import { motion } from "framer-motion";
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  return (
    <div className="relative w-full py-20 lg:py-28 overflow-x-hidden">
      {/* Animated background elements - positioned behind content */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/3 h-96 w-96 rounded-full bg-red-200 opacity-8 blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2">
                <Zap className="h-4 w-4 text-[#C41E3A]" />
                <span className="text-sm font-medium text-[#C41E3A]">
                  AI-Powered University Matching
                </span>
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900">
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
              className="max-w-xl text-lg text-gray-600 leading-relaxed"
            >
              Leverage AI-powered intelligence to find universities that match
              your academic profile, budget, and career aspirations. Access
              exclusive scholarships and complete your journey to global
              education.
            </motion.p>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-4 py-4"
            >
              <div className="space-y-2">
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  250+
                </p>
                <p className="text-sm text-gray-600">Partner Universities</p>
              </div>
              <div className="space-y-2">
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  45
                </p>
                <p className="text-sm text-gray-600">Countries</p>
              </div>
              <div className="space-y-2">
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  98%
                </p>
                <p className="text-sm text-gray-600">Visa Success</p>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex gap-4 pt-4">
              <button
                onClick={() => setShowMatcher(true)}
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#C41E3A] to-[#E11D48] px-8 py-4 font-semibold text-white shadow-[0_10px_30px_rgba(196,30,58,0.25)] hover:shadow-[0_20px_40px_rgba(196,30,58,0.35)] transition-all duration-300 hover:scale-105"
              >
                <GraduationCap className="h-5 w-5" />
                Start AI Matching
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="inline-flex items-center gap-2 rounded-full border-2 border-gray-900 px-8 py-4 font-semibold text-gray-900 hover:bg-gray-900 hover:text-white transition-colors">
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
            <div className="rounded-3xl bg-white/80 backdrop-blur-xl border border-white/50 p-8 shadow-2xl">
              <AIMatcher onClose={() => setShowMatcher(false)} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
