"use client";

import { motion } from "framer-motion";

export default function BackgroundDecor() {
  return (
    <div className="absolute inset-0 overflow-hidden">

      {/* Main Background */}
      <div
        className="
          absolute
          inset-0
          bg-[#f7f4f3]
        "
      />

      {/* Cinematic Red Light */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.55, 0.75, 0.55],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          top-[-250px]
          right-[-200px]
          w-[900px]
          h-[900px]
          rounded-full
          bg-[radial-gradient(circle,rgba(220,38,38,0.22)_0%,rgba(220,38,38,0.08)_35%,transparent_70%)]
          blur-3xl
        "
      />

      {/* Bottom Glow */}
      <motion.div
        animate={{
          scale: [1, 1.12, 1],
          x: [0, 40, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          bottom-[-350px]
          left-[-250px]
          w-[850px]
          h-[850px]
          rounded-full
          bg-[radial-gradient(circle,rgba(239,68,68,0.12)_0%,rgba(239,68,68,0.04)_40%,transparent_75%)]
          blur-3xl
        "
      />

      {/* Ambient White Light */}
      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.95),transparent_45%)]
        "
      />

      {/* Luxury Vignette */}
      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.05)_100%)]
        "
      />

      {/* Floating Glass Light */}
      <motion.div
        animate={{
          y: [0, -30, 0],
          rotate: [0, 6, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          top-[12%]
          right-[18%]
          w-[260px]
          h-[260px]
          rounded-full
          border
          border-white/30
          bg-white/10
          backdrop-blur-3xl
          shadow-[0_20px_80px_rgba(255,255,255,0.12)]
        "
      />

      {/* Small Floating Orb */}
      <motion.div
        animate={{
          y: [0, 25, 0],
          x: [0, -15, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          bottom-[12%]
          left-[10%]
          w-32
          h-32
          rounded-full
          border
          border-red-100/30
          bg-white/10
          backdrop-blur-2xl
        "
      />

      {/* Cinematic Light Beam */}
      <motion.div
        animate={{
          opacity: [0.08, 0.16, 0.08],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          top-0
          left-[20%]
          w-[500px]
          h-full
          rotate-[12deg]
          bg-gradient-to-b
          from-white/60
          via-white/10
          to-transparent
          blur-3xl
        "
      />

      {/* Noise Texture */}
      <div
        className="
          absolute
          inset-0
          opacity-[0.025]
          mix-blend-overlay
          bg-[url('https://grainy-gradients.vercel.app/noise.svg')]
        "
      />

      {/* Smooth Gradient Overlay */}
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-br
          from-transparent
          via-transparent
          to-red-50/40
        "
      />

    </div>
  );
}