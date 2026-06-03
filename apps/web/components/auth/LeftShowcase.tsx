"use client";

import { motion } from "framer-motion";

import {
  Globe,
  MessageCircleMore,
  BadgeCheck,
  Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";

import FloatingPaperPlane from "./FloatingPaperPlane";

export default function LeftShowcase() {
  return (
    <div
      className="
        hidden
        lg:flex
        relative
        w-[55%]
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
        className="inline-flex w-fit items-center gap-3 rounded-full border border-white/60 bg-white/55 px-4 py-2 shadow-[0_14px_40px_rgba(127,29,29,0.08)] backdrop-blur-xl"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-700 text-sm font-black text-white shadow-[0_10px_26px_rgba(185,28,28,0.26)]">
          EG
        </div>

        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-950">
            ENDOW
          </h1>

          <p className="text-[10px] font-bold tracking-[0.26em] text-slate-500">
            GLOBAL EDUCATION
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1,
          delay: 0.2,
        }}
        className="mt-8"
      >
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-100 bg-white/65 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-red-800 shadow-sm backdrop-blur">
          <Sparkles size={14} />
          Study abroad command center
        </div>

        <h2
          className="
            max-w-xl
            text-5xl
            leading-[1.02]
            font-black
            tracking-[-0.055em]
            text-slate-950
          "
        >
          Plan your global education with a team that knows the path.
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
          mt-5
          max-w-lg
          text-lg
          leading-8
          text-slate-700
        "
      >
        Sign in to manage applications, documents, counselor sessions, and
        university shortlists from one polished workspace.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1,
          delay: 0.6,
        }}
        className="
          mt-8
          grid
          max-w-xl
          grid-cols-3
          gap-3
        "
      >
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

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay: 0.75,
        }}
        className="mt-8 flex w-fit items-center gap-3 rounded-3xl border border-white/65 bg-white/55 p-3 pr-5 shadow-[0_18px_48px_rgba(62,35,24,0.10)] backdrop-blur-xl"
      >
        <div className="flex -space-x-3">
          {["UK", "AU", "CA"].map((label) => (
            <div
              key={label}
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-slate-950 text-[10px] font-black text-white"
            >
              {label}
            </div>
          ))}
        </div>
        <p className="max-w-[230px] text-sm font-semibold leading-5 text-slate-700">
          Trusted guidance for applications across leading study destinations.
        </p>
      </motion.div>

    </div>
  );
}

function Feature({
  icon,
  title,
  subtitle,
}: {
  icon: ReactNode;
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
          w-14
          h-14
          rounded-[1.25rem]
          bg-white/72
          backdrop-blur-xl
          border
          border-white/70
          shadow-[0_14px_34px_rgba(62,35,24,0.10)]
          flex
          items-center
          justify-center
          text-red-700
        "
      >
        {icon}
      </div>

      <p className="mt-3 text-sm font-bold text-slate-900">
        {title}
      </p>

      <p className="text-center text-xs font-medium text-slate-500">
        {subtitle}
      </p>

    </motion.div>
  );
}
