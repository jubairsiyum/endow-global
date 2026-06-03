"use client";

import BackgroundDecor from "./BackgroundDecor";
import LeftShowcase from "./LeftShowcase";
import UnifiedAuthForm from "./UnifiedAuthForm";
import { AuthProvider } from "./AuthContext";
import { usePathname } from "next/navigation";

export default function AuthLayout({
  initialMode = "signin",
}: {
  initialMode?: "signin" | "signup";
} = {}) {
  const pathname = usePathname();
  const currentMode = pathname?.includes("/sign-up") ? "signup" : initialMode;

  return (
    <AuthProvider initialMode={currentMode}>
      <main
        className="
          relative
          min-h-screen
          w-full
          overflow-x-hidden
          bg-[#f7f2ec]
          flex
          items-center
          justify-center
          px-4
          py-6
          sm:px-6
          lg:px-8
        "
      >

        {/* Background - Full Viewport Coverage */}
        <BackgroundDecor />

        {/* Blur Glow - Top Right */}
        <div
          className="
            absolute
            top-[-220px]
            right-[-140px]
            h-[520px]
            w-[520px]
            rounded-full
            bg-red-200/45
            blur-3xl
            pointer-events-none
          "
        />

        {/* Blur Glow - Bottom Left */}
        <div
          className="
            absolute
            bottom-[-260px]
            left-[-180px]
            h-[500px]
            w-[500px]
            rounded-full
            bg-amber-200/35
            blur-3xl
            pointer-events-none
          "
        />

        <div
          className="
            relative
            z-10
            w-full
            max-w-7xl
            min-h-[calc(100vh-3rem)]
            flex
            flex-col
            lg:flex-row
            items-center
            justify-center
            gap-8
            lg:gap-12
          "
        >

          <LeftShowcase />

          <div
            className="
              w-full
              lg:w-[45%]
              relative
              flex
              items-center
              justify-center
            "
          >

            <div
              className="
                relative
                overflow-hidden
                rounded-[2rem]
                border
                border-white/70
                bg-white/88
                backdrop-blur-2xl
                shadow-[0_28px_90px_rgba(62,35,24,0.16)]
                p-5
                sm:p-7
                lg:p-8
                w-full
                max-w-[460px]
              "
            >

              <div
                className="
                  absolute
                  inset-0
                  bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.92),transparent_38%),linear-gradient(135deg,rgba(255,255,255,0.48),transparent)]
                  pointer-events-none
                "
              />

              <div
                className="
                  absolute
                  inset-x-8
                  top-0
                  h-px
                  bg-gradient-to-r
                  from-transparent
                  via-red-300/80
                  to-transparent
                  pointer-events-none
                "
              />

              <div className="relative z-10">
                <UnifiedAuthForm />
              </div>

            </div>

          </div>

        </div>

      </main>
    </AuthProvider>
  );
}
