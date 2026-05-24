"use client";

import { motion } from "framer-motion";
import {
  Bookmark,
  BookmarkCheck,
  ArrowRight,
  Zap,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { universities } from "@/lib/universities/data";
import { formatCurrency } from "@/lib/universities/utils";
import Image from "next/image";

export default function FeaturedUniversities() {
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const toggleSave = (id: string) => {
    const newSaved = new Set(saved);
    if (newSaved.has(id)) {
      newSaved.delete(id);
    } else {
      newSaved.add(id);
    }
    setSaved(newSaved);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
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
    <section className="relative py-24 bg-white overflow-x-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-red-200 opacity-8 blur-3xl"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 space-y-4 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2">
            <Zap className="h-4 w-4 text-[#C41E3A]" />
            <span className="text-sm font-medium text-[#C41E3A]">
              Featured Partners
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
            Premium University Opportunities
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Handpicked universities with exclusive scholarships and visa
            guarantees for our students
          </p>
        </motion.div>

        {/* University Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {universities.slice(0, 6).map((uni) => (
            <motion.div
              key={uni.id}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group relative rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm border border-white/40 shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_50px_rgba(196,30,58,0.12)] transition-all duration-300 hover:border-red-100/50"
            >
              {/* Background Image */}
              <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-red-50 to-red-100">
                <div className="absolute inset-0 bg-red-500/5 group-hover:bg-red-500/10 transition-colors"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-20 w-20 rounded-2xl bg-white/90 flex items-center justify-center shadow-lg">
                    <Image
                      src={uni.logo}
                      alt={uni.name}
                      width={60}
                      height={60}
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* Ranking Badge */}
                <div className="absolute top-4 left-4 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-sm font-bold text-gray-900 shadow-lg">
                  #{uni.ranking}
                </div>

                {/* Scholarship Badge */}
                <div className="absolute top-4 right-4 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 px-3 py-1 text-sm font-bold text-white shadow-lg">
                  {uni.scholarship}% Scholarship
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4 p-6">
                {/* Header */}
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-900">
                    {uni.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {uni.city}, {uni.country}
                  </p>
                </div>

                {/* Key Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-red-50 p-3">
                    <p className="text-xs text-gray-600">Tuition/Year</p>
                    <p className="font-bold text-[#C41E3A]">
                      {formatCurrency(uni.tuition.min)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-green-50 p-3">
                    <p className="text-xs text-gray-600">Visa Success</p>
                    <p className="font-bold text-green-600">
                      {uni.visaSuccessRate}%
                    </p>
                  </div>
                </div>

                {/* More Stats */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2 text-gray-700">
                    <TrendingUp className="h-4 w-4 text-[#C41E3A]" />
                    <span>{uni.employmentRate}% Employment</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <span>
                      {uni.daysToIntake} days to Intake
                    </span>
                  </div>
                </div>

                {/* Programs Preview */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-700">
                    Popular Programs
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {uni.programs.slice(0, 2).map((prog, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-red-100 px-2 py-1 text-xs text-[#C41E3A]"
                      >
                        {prog}
                      </span>
                    ))}
                    {uni.programs.length > 2 && (
                      <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
                        +{uni.programs.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                {/* AI Match Score */}
                <div className="rounded-2xl bg-gradient-to-r from-red-50 to-red-100 p-3 border border-red-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600">AI Match Score</p>
                      <p className="text-sm font-bold text-gray-900">
                        92% Match For You
                      </p>
                    </div>
                    <div className="relative h-10 w-10">
                      <svg
                        className="h-10 w-10 transform -rotate-90"
                        viewBox="0 0 36 36"
                      >
                        <circle
                          cx="18"
                          cy="18"
                          r="15.915"
                          fill="none"
                          className="stroke-gray-200"
                          strokeWidth="3"
                        ></circle>
                        <circle
                          cx="18"
                          cy="18"
                          r="15.915"
                          fill="none"
                          className="stroke-green-500"
                          strokeWidth="3"
                          strokeDasharray="94.77 102.4"
                          strokeLinecap="round"
                        ></circle>
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-green-600">
                        92%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => toggleSave(uni.id)}
                    className="flex-1 rounded-xl border border-gray-300 py-2 font-semibold text-gray-900 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    {saved.has(uni.id) ? (
                      <>
                        <BookmarkCheck className="h-4 w-4" />
                        Saved
                      </>
                    ) : (
                      <>
                        <Bookmark className="h-4 w-4" />
                        Save
                      </>
                    )}
                  </button>
                  <button className="flex-1 rounded-xl bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                    Apply Now
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <button className="inline-flex items-center gap-2 rounded-full border-2 border-gray-900 px-8 py-4 font-semibold text-gray-900 hover:bg-gray-900 hover:text-white transition-colors">
            View All Universities
            <ArrowRight className="h-5 w-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
