"use client";

import { motion } from "framer-motion";

export default function BackgroundDecor() {
  return (
    <div className="absolute inset-0 overflow-hidden">

      {/* Base */}
      <div className="absolute inset-0 bg-[#f8f5f4]" />

      {/* Main Red Light */}
      <motion.div
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.5, 0.75, 0.5],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          top-[-280px]
          right-[-220px]
          w-[900px]
          h-[900px]
          rounded-full
          bg-[radial-gradient(circle,rgba(239,68,68,0.22)_0%,rgba(239,68,68,0.06)_45%,transparent_75%)]
          blur-3xl
        "
      />

      {/* Bottom Left Glow */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          x: [0, 30, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          bottom-[-320px]
          left-[-250px]
          w-[850px]
          h-[850px]
          rounded-full
          bg-[radial-gradient(circle,rgba(254,202,202,0.45)_0%,rgba(254,202,202,0.15)_45%,transparent_75%)]
          blur-3xl
        "
      />

      {/* Light Beam */}
      <motion.div
        animate={{
          opacity: [0.08, 0.18, 0.08],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
        }}
        className="
          absolute
          top-0
          left-[18%]
          w-[500px]
          h-full
          rotate-[12deg]
          bg-gradient-to-b
          from-white/80
          via-white/20
          to-transparent
          blur-3xl
        "
      />

      {/* Bottom Wave Glow */}
      <div
        className="
          absolute
          bottom-0
          left-0
          w-full
          h-[240px]
          bg-[radial-gradient(circle_at_bottom_left,rgba(254,202,202,0.65),transparent_55%)]
        "
      />

      {/* Floating Orb 1 */}
      <motion.div
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          top-[15%]
          right-[8%]
          w-44
          h-44
          rounded-full
          bg-white/20
          backdrop-blur-3xl
          border
          border-white/30
          shadow-[0_20px_80px_rgba(255,255,255,0.15)]
        "
      />

      {/* Floating Orb 2 */}
      <motion.div
        animate={{
          y: [0, 25, 0],
          x: [0, -10, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          bottom-[12%]
          left-[6%]
          w-32
          h-32
          rounded-full
          bg-white/10
          backdrop-blur-2xl
          border
          border-white/20
        "
      />

      {/* Blur White Overlay */}
      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.95),transparent_45%)]
        "
      />

      {/* Noise Texture */}
      <div
        className="
          absolute
          inset-0
          opacity-[0.02]
          mix-blend-overlay
          bg-[url('https://grainy-gradients.vercel.app/noise.svg')]
        "
      />

    </div>
  );
}