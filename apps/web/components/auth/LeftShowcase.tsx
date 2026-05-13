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
        w-[48%]
        flex-col
        justify-center
        px-6
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
        <h1 className="text-5xl font-black tracking-tight text-black">
          ENDOW
        </h1>

        <p className="mt-2 text-gray-500 tracking-wide">
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
        className="mt-10"
      >

        <h2
          className="
            text-7xl
            leading-[1]
            font-black
            tracking-tight
            text-black
          "
        >
          Your dream
        </h2>

        <h2
          className="
            text-7xl
            leading-[1]
            font-black
            tracking-tight
            text-red-700
            mt-2
          "
        >
          university
        </h2>

        <h2
          className="
            text-7xl
            leading-[1]
            font-black
            tracking-tight
            text-black
            mt-2
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
          mt-10
          max-w-xl
          text-xl
          leading-9
          text-gray-500
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
          mt-12
          flex
          items-center
          gap-8
        "
      >

        {/* Item */}
        <Feature
          icon={<Globe size={26} />}
          title="Global"
          subtitle="Opportunities"
        />

        <Feature
          icon={<MessageCircleMore size={26} />}
          title="Expert"
          subtitle="Counselors"
        />

        <Feature
          icon={<BadgeCheck size={26} />}
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