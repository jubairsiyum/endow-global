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
    <section className="relative py-16 lg:py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-x-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-yellow-100 opacity-10 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 space-y-3 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1.5">
            <Award className="h-3.5 w-3.5 text-[#C41E3A]" />
            <span className="text-xs font-medium text-[#C41E3A]">
              Financial Aid
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Exclusive Scholarship Opportunities
          </h2>
          <p className="mx-auto max-w-2xl text-base lg:text-lg text-gray-600">
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
              whileHover={{ scale: 1.01, transition: { duration: 0.3 } }}
              className={`group relative rounded-2xl overflow-hidden border p-5 shadow-[0_8px_24px_rgba(0,0,0,0.07)] hover:shadow-[0_16px_36px_rgba(196,30,58,0.1)] transition-all duration-300 lg:p-6 ${
                  isUrgent
                    ? "bg-gradient-to-br from-red-50 to-red-100 border-red-200"
                    : "bg-white/80 backdrop-blur-sm border-white/40"
                }`}
              >
                {/* Glow effect for urgent */}
                {isUrgent && (
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-r from-red-500 to-pink-500 blur-3xl"></div>
                )}

                {/* Animated border glow */}
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`}
                  style={{
                    background: `linear-gradient(90deg, transparent, ${
                      isUrgent ? "rgba(244, 63, 94, 0.3)" : "rgba(59, 130, 246, 0.3)"
                    }, transparent)`,
                    pointerEvents: "none",
                  }}
                ></div>

                <div className="relative space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <h3 className="text-xl font-bold text-gray-900">
                        {scholarship.universityName}
                      </h3>
                      <p className="text-gray-600">{scholarship.description}</p>
                    </div>

                    {/* Scholarship Badge */}
                    <motion.div
                      whileHover={{ scale: 1.04 }}
                      className="ml-4 shrink-0 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2 text-center"
                    >
                      <p className="text-xl font-bold text-white">
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
                        <Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                        <span className="text-gray-700">
                          {scholarship.requirements}
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                        <span className="text-gray-700">
                          IELTS: {scholarship.ieltsRequirement}+ required
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Deadline */}
                  <div
                    className={`rounded-xl p-3 flex items-center justify-between ${
                      isUrgent
                        ? "bg-red-100 border-2 border-red-300"
                        : "bg-blue-100 border border-blue-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Clock
                        className={`h-4 w-4 ${
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
                        Hurry! Application closing soon
                      </p>
                    </div>
                  )}

                  {/* Apply Button */}
                  <button className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 text-sm font-semibold text-white hover:shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2">
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
