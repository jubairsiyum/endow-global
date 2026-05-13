"use client";

import { usePathname } from "next/navigation";

export default function BackgroundDecor() {
  const pathname = usePathname();

  const isSignIn = pathname === "/sign-in";

  const bgImage = isSignIn
    ? "/images/signin-bg.png"
    : "/images/signup-bg.png";

  return (
    <div className="absolute inset-0 overflow-hidden">

      {/* Background Image */}
      <div
        className="
          absolute
          inset-0
          bg-center
          bg-no-repeat
        "
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: isSignIn
            ? "contrast(1.08) saturate(1.05) brightness(1.02)"
            : "contrast(1.02) saturate(1.02)",
        }}
      />

      {/* Dynamic Overlay */}
      <div
        className={`
          absolute
          inset-0
          ${
            isSignIn
              ? "bg-white/[0.02]"
              : "bg-white/[0.05]"
          }
        `}
      />

      {/* Left Cinematic Fade */}
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-r
          from-white/10
          via-white/5
          to-transparent
        "
      />

      {/* Right Form Overlay */}
      <div
        className="
          absolute
          top-0
          right-0
          h-full
          w-[45%]
          bg-white/10
          backdrop-blur-[2px]
        "
      />

      {/* Top Right Glow */}
      <div
        className="
          absolute
          top-[-120px]
          right-[-120px]
          w-[500px]
          h-[500px]
          rounded-full
          bg-red-200/15
          blur-3xl
        "
      />

      {/* Bottom Left Glow */}
      <div
        className="
          absolute
          bottom-[-180px]
          left-[-120px]
          w-[500px]
          h-[500px]
          rounded-full
          bg-red-100/15
          blur-3xl
        "
      />

      {/* Cinematic Top Light */}
      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_55%)]
        "
      />

      {/* Luxury Vignette */}
      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_center,transparent_65%,rgba(0,0,0,0.03)_100%)]
        "
      />

    </div>
  );
}