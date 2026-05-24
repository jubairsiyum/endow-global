"use client";

import { motion } from "framer-motion";
import { universities } from "@/lib/universities/data";
import Image from "next/image";

export default function UniversityMarquee() {
  const marqueeVariants = {
    animate: {
      x: [0, -1000],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop" as const,
          duration: 30,
          ease: "linear",
        },
      },
    },
  };

  return (
    <section className="relative py-16 overflow-hidden bg-gradient-to-r from-white via-gray-50 to-white border-y border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-8 text-center text-sm font-semibold text-gray-600">
          TRUSTED BY 5000+ STUDENTS ACROSS
        </p>

        {/* Marquee Container */}
        <div className="relative overflow-hidden">
          <motion.div
            variants={marqueeVariants}
            animate="animate"
            className="flex gap-12 min-w-max"
          >
            {[...universities, ...universities].map((uni, idx) => (
              <motion.div
                key={`${uni.id}-${idx}`}
                whileHover={{ scale: 1.1 }}
                className="group flex flex-col items-center gap-3 px-6 py-4 rounded-xl hover:bg-white/50 transition-colors cursor-pointer"
              >
                <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-white shadow-md group-hover:shadow-lg transition-shadow border border-gray-200">
                  <Image
                    src={uni.logo}
                    alt={uni.name}
                    width={64}
                    height={64}
                    className="h-full w-full object-contain p-2"
                  />
                </div>
                <div className="text-center hidden group-hover:block text-xs text-gray-700 max-w-xs">
                  <p className="font-semibold">{uni.name}</p>
                  <p className="text-gray-600">{uni.city}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Fade overlays */}
          <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white via-white to-transparent pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white via-white to-transparent pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
}
