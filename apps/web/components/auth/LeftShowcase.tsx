"use client";

import { motion } from "framer-motion";

import {
  Globe,
  MessageCircleMore,
  BadgeCheck,
} from "lucide-react";

import FloatingPaperPlane from "./FloatingPaperPlane";

export default function LeftShowcase() {
  return (
    <div
      className="
        hidden
        lg:flex
        relative
        w-[52%]
        flex-col
        justify-center
        px-4
      "
    >

      {/* Plane */}
      <FloatingPaperPlane />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-3xl font-black tracking-tight text-black">
          ENDOW
        </h1>

        <p className="mt-1 text-xs text-gray-600 tracking-wide font-medium">
          GLOBAL EDUCATION
        </p>
      </motion.div>

      {/* Main Heading */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1,
          delay: 0.2,
        }}
        className="mt-5"
      >

        <h2
          className="
            text-4xl
            leading-snug
            font-black
            tracking-tight
            text-black
          "
        >
          Your dream
        </h2>

        <h2
          className="
            text-4xl
            leading-snug
            font-black
            tracking-tight
            text-red-700
            mt-0
          "
        >
          university
        </h2>

        <h2
          className="
            text-4xl
            leading-snug
            font-black
            tracking-tight
            text-black
            mt-0
          "
        >
          starts here.
        </h2>

      </motion.div>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 1,
          delay: 0.4,
        }}
        className="
          mt-4
          max-w-sm
          text-base
          leading-relaxed
          text-gray-700
        "
      >
        Get expert guidance, discover global
        courses, and achieve your study
        abroad goals.
      </motion.p>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1,
          delay: 0.6,
        }}
        className="
          mt-6
          flex
          items-center
          gap-5
        "
      >

        {/* Item */}
        <Feature
          icon={<Globe size={18} />}
          title="Global"
          subtitle="Opportunities"
        />

        <Feature
          icon={<MessageCircleMore size={18} />}
          title="Expert"
          subtitle="Counselors"
        />

        <Feature
          icon={<BadgeCheck size={18} />}
          title="End-to-End"
          subtitle="Support"
        />

      </motion.div>

    </div>
  );
}

function Feature({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <motion.div
      whileHover={{
        y: -6,
      }}
      className="flex flex-col items-center"
    >

      <div
        className="
          w-16
          h-16
          rounded-2xl
          bg-white/60
          backdrop-blur-xl
          border
          border-white/40
          shadow-[0_10px_30px_rgba(0,0,0,0.08)]
          flex
          items-center
          justify-center
          text-red-600
        "
      >
        {icon}
      </div>

      <p className="mt-4 font-semibold text-gray-800">
        {title}
      </p>

      <p className="text-gray-500 text-sm">
        {subtitle}
      </p>

    </motion.div>
  );
}