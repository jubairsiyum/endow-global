"use client";

import { motion } from "framer-motion";
import { useAuthMode } from "./AuthContext";

export default function AuthTabToggle() {
  const { mode, setMode } = useAuthMode();
  const isSignIn = mode === "signin";

  const handleSignInClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isSignIn) {
      setMode("signin");
    }
  };

  const handleSignUpClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isSignIn) {
      setMode("signup");
    }
  };

  return (
    <div className="flex justify-center w-full mb-8">
      <div
        className="
          relative
          flex
          items-center
          gap-0
          p-1
          h-[52px]
          w-fit
          rounded-full
          bg-white/10
          backdrop-blur-xl
          border
          border-white/20
          shadow-[0_10px_30px_rgba(0,0,0,0.12)]
          overflow-hidden
        "
      >
        {/* Sign In Button Container */}
        <button
          onClick={handleSignInClick}
          className="
            relative
            flex
            flex-1
            items-center
            justify-center
            h-full
            px-7
            py-3
            text-sm
            font-medium
            cursor-pointer
            bg-transparent
            border-none
            min-w-[100px]
          "
        >
          {/* Active Pill - Only renders when Sign In is active */}
          {isSignIn && (
            <motion.div
              layoutId="activePill"
              className="
                absolute
                inset-1
                rounded-full
                bg-gradient-to-r
                from-red-500
                to-rose-600
                shadow-[0_8px_24px_rgba(255,0,80,0.35)]
              "
            >
              {/* Subtle Glass Overlay */}
              <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-sm" />
            </motion.div>
          )}

          {/* Sign In Text - Always on top */}
          <span
            className={`
              relative
              z-10
              whitespace-nowrap
              transition-colors
              duration-300
              ${
                isSignIn
                  ? "text-white"
                  : "text-gray-500 hover:text-gray-900"
              }
            `}
          >
            Sign In
          </span>
        </button>

        {/* Sign Up Button Container */}
        <button
          onClick={handleSignUpClick}
          className="
            relative
            flex
            flex-1
            items-center
            justify-center
            h-full
            px-7
            py-3
            text-sm
            font-medium
            cursor-pointer
            bg-transparent
            border-none
            min-w-[100px]
          "
        >
          {/* Active Pill - Only renders when Sign Up is active */}
          {!isSignIn && (
            <motion.div
              layoutId="activePill"
              className="
                absolute
                inset-1
                rounded-full
                bg-gradient-to-r
                from-red-500
                to-rose-600
                shadow-[0_8px_24px_rgba(255,0,80,0.35)]
              "
            >
              {/* Subtle Glass Overlay */}
              <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-sm" />
            </motion.div>
          )}

          {/* Sign Up Text - Always on top */}
          <span
            className={`
              relative
              z-10
              whitespace-nowrap
              transition-colors
              duration-300
              ${
                !isSignIn
                  ? "text-white"
                  : "text-gray-500 hover:text-gray-900"
              }
            `}
          >
            Sign Up
          </span>
        </button>
      </div>
    </div>
  );
}
