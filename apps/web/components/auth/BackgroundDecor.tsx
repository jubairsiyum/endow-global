"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

export default function BackgroundDecor() {
  const pathname = usePathname();

  const isSignIn = pathname === "/login";

  const bgImage = isSignIn
    ? "/images/signin-bg.png"
    : "/images/signup-bg.png";

  return (
    <div className="absolute inset-0 overflow-hidden">
      <Image
        src={bgImage}
        alt={isSignIn ? "Sign in background" : "Sign up background"}
        fill
        priority
        quality={95}
        sizes="100vw"
        className="object-cover opacity-65"
        style={{
          filter: isSignIn
            ? "contrast(1.04) saturate(0.92) brightness(1.08)"
            : "contrast(1.02) saturate(0.9) brightness(1.06)",
        }}
      />

      <div
        className="
          absolute
          inset-0
          bg-[linear-gradient(115deg,rgba(255,250,245,0.94)_0%,rgba(255,247,241,0.86)_42%,rgba(255,255,255,0.72)_100%)]
          pointer-events-none
        "
      />

      <div
        className="
          absolute
          inset-0
          opacity-[0.08]
          bg-[linear-gradient(to_right,#7f1d1d_1px,transparent_1px),linear-gradient(to_bottom,#7f1d1d_1px,transparent_1px)]
          bg-[size:64px_64px]
          pointer-events-none
        "
      />

      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_18%_20%,rgba(185,28,28,0.12),transparent_30%),radial-gradient(circle_at_80%_72%,rgba(251,191,36,0.15),transparent_28%)]
        "
      />

      <div
        className="
          absolute
          top-0
          right-0
          h-full
          hidden
          w-[48%]
          bg-white/45
          backdrop-blur-[3px]
          lg:block
        "
      />

      <div
        className="
          absolute
          top-[-120px]
          right-[-120px]
          w-[500px]
          h-[500px]
          rounded-full
          bg-red-200/35
          blur-3xl
        "
      />

      <div
        className="
          absolute
          bottom-[-180px]
          left-[-120px]
          w-[500px]
          h-[500px]
          rounded-full
          bg-amber-100/45
          blur-3xl
        "
      />

      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.42),transparent_58%)]
        "
      />

      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_center,transparent_62%,rgba(65,28,20,0.08)_100%)]
        "
      />

    </div>
  );
}
