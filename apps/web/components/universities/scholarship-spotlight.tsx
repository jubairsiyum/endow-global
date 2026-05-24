"use client";

import { motion } from "framer-motion";
import { Award, Clock, Check, ArrowRight } from "lucide-react";
import { scholarships } from "@/lib/universities/data";
import { calculateDaysRemaining, getDayColor } from "@/lib/universities/utils";

export default function ScholarshipSpotlight() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="relative py-24 bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-x-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-yellow-100 opacity-20 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 space-y-4 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2">
            <Award className="h-4 w-4 text-[#C41E3A]" />
            <span className="text-sm font-medium text-[#C41E3A]">
              Financial Aid
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
            Exclusive Scholarship Opportunities
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Reduce your tuition burden with our partner universities' exclusive
            scholarships and financial aid programs
          </p>
        </motion.div>

        {/* Scholarships Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 lg:grid-cols-2"
        >
          {scholarships.map((scholarship, idx) => {
            const daysLeft = calculateDaysRemaining(scholarship.deadline);
            const isUrgent = daysLeft <= 7;

            return (
              <motion.div
                key={scholarship.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
                className={`group relative rounded-3xl overflow-hidden border p-8 shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_50px_rgba(196,30,58,0.12)] transition-all duration-300 ${
                  isUrgent
                    ? "bg-gradient-to-br from-red-50 to-red-100 border-red-200"
                    : "bg-white/80 backdrop-blur-sm border-white/40"
                }`}
              >
                {/* Glow effect for urgent */}
                {isUrgent && (
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-r from-red-500 to-pink-500 blur-2xl"></div>
                )}

                {/* Animated border glow */}
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl`}
                  style={{
                    background: `linear-gradient(90deg, transparent, ${
                      isUrgent ? "rgba(244, 63, 94, 0.3)" : "rgba(59, 130, 246, 0.3)"
                    }, transparent)`,
                    pointerEvents: "none",
                  }}
                ></div>

                <div className="relative space-y-6">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {scholarship.universityName}
                      </h3>
                      <p className="text-gray-600">{scholarship.description}</p>
                    </div>

                    {/* Scholarship Badge */}
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="ml-4 shrink-0 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3 text-center"
                    >
                      <p className="text-2xl font-bold text-white">
                        {scholarship.percentage}%
                      </p>
                      <p className="text-xs text-white/90">Scholarship</p>
                    </motion.div>
                  </div>

                  {/* Requirements */}
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-700">
                      Requirements
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                        <span className="text-gray-700">
                          {scholarship.requirements}
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                        <span className="text-gray-700">
                          IELTS: {scholarship.ieltsRequirement}+ required
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Deadline */}
                  <div
                    className={`rounded-2xl p-4 flex items-center justify-between ${
                      isUrgent
                        ? "bg-red-100 border-2 border-red-300"
                        : "bg-blue-100 border border-blue-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Clock
                        className={`h-5 w-5 ${
                          isUrgent ? "text-red-600" : "text-blue-600"
                        }`}
                      />
                      <div>
                        <p
                          className={`text-xs font-semibold ${
                            isUrgent
                              ? "text-red-700"
                              : "text-blue-700"
                          }`}
                        >
                          Application Deadline
                        </p>
                        <p
                          className={`text-sm font-bold ${
                            isUrgent
                              ? "text-red-900"
                              : "text-blue-900"
                          }`}
                        >
                          {daysLeft} days left
                        </p>
                      </div>
                    </div>
                    <p
                      className={`text-xs font-semibold ${
                        isUrgent
                          ? "text-red-700"
                          : "text-blue-700"
                      }`}
                    >
                      {new Date(scholarship.deadline).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Alert for urgent */}
                  {isUrgent && (
                    <div className="rounded-xl bg-red-50 border border-red-200 p-3">
                      <p className="text-xs text-red-700 font-semibold">
                        ⚡ Hurry! Application closing soon
                      </p>
                    </div>
                  )}

                  {/* Apply Button */}
                  <button className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-3 font-semibold text-white hover:shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2">
                    Apply for Scholarship
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
