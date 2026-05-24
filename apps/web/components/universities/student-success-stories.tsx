"use client";

import { motion } from "framer-motion";
import { Star, Award } from "lucide-react";
import { studentStories } from "@/lib/universities/data";
import Image from "next/image";

export default function StudentSuccessStories() {
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
    <section className="relative py-16 lg:py-20 bg-white overflow-x-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 -left-32 h-72 w-72 rounded-full bg-green-100 opacity-10 blur-3xl"></div>
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
              Student Success
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Success Stories from Our Students
          </h2>
          <p className="mx-auto max-w-2xl text-base lg:text-lg text-gray-600">
            Real stories of transformation from students who achieved their
            dreams through our platform
          </p>
        </motion.div>

        {/* Stories Carousel */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {studentStories.map((story, idx) => (
            <motion.div
              key={story.id}
              variants={itemVariants}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-[0_8px_24px_rgba(0,0,0,0.07)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.1)] transition-all duration-300"
            >
              {/* Background glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br from-green-500 to-emerald-500 blur-3xl"></div>

              <div className="relative space-y-4 p-5 lg:p-6">
                {/* Student Avatar */}
                <div className="flex items-center gap-4">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden ring-2 ring-green-200">
                    <Image
                      src={story.image}
                      alt={story.name}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{story.name}</h3>
                    <p className="text-sm text-gray-600">{story.university}</p>
                  </div>
                  {story.visaApproval && (
                    <div className="rounded-full bg-green-100 px-2.5 py-1">
                      <p className="text-xs font-bold text-green-700">Visa</p>
                    </div>
                  )}
                </div>

                {/* Review Quote */}
                <blockquote className="text-sm leading-relaxed text-gray-700">
                  "{story.review}"
                </blockquote>

                {/* Rating */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: story.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Details */}
                <div className="space-y-2.5 border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Scholarship</span>
                    <span className="font-bold text-green-600">
                      {story.scholarship}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Country</span>
                    <span className="font-bold text-gray-900">
                      {story.country}
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <button className="w-full h-10 rounded-xl bg-green-100 px-4 text-sm font-semibold text-green-700 hover:bg-green-200 transition-colors">
                  Read Full Story
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="mb-4 text-base lg:text-lg text-gray-600">
            Ready to write your own success story?
          </p>
          <button className="inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 px-6 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
            Start Your Journey Today
          </button>
        </motion.div>
      </div>
    </section>
  );
}
