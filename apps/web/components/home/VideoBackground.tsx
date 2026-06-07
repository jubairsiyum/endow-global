"use client";

import { motion, useReducedMotion } from "framer-motion";

const heroVideos = [
  {
    label: "Campus study",
    src: "https://videos.pexels.com/video-files/7969378/7969378-uhd_1440_2732_25fps.mp4",
  },
  {
    label: "Students walking",
    src: "https://videos.pexels.com/video-files/7969427/7969427-uhd_1440_2732_25fps.mp4",
  },
  {
    label: "Outdoor collaboration",
    src: "https://videos.pexels.com/video-files/6145420/6145420-uhd_1440_2732_25fps.mp4",
  },
] as const;

export default function VideoBackground() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: prefersReducedMotion ? 0 : 1,
        ease: "easeOut",
      }}
    >
      <video
        aria-label="Students exploring study options on campus"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="h-full w-full object-cover"
      >
        {heroVideos.map((video) => (
          <source key={video.src} src={video.src} type="video/mp4" />
        ))}
      </video>
      <div className="bg-white/88 absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(196,30,58,0.12),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.74)_0%,rgba(255,255,255,0.94)_82%)]" />
    </motion.div>
  );
}
