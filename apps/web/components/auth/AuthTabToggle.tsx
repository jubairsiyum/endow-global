"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AuthTabToggle() {
  const pathname = usePathname();
  const router = useRouter();
  const isSignIn = pathname === "/sign-in";

  const handleSignInClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isSignIn) {
      router.push("/sign-in");
    }
  };

  const handleSignUpClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isSignIn) {
      router.push("/sign-up");
    }
  };

  return (
    <div className="flex justify-center w-full mb-8">
      <motion.div
        className="
          relative
          flex
          items-center
          gap-0
          p-[4px]
          h-[52px]
          w-fit
          rounded-full
          bg-white/10
          backdrop-blur-xl
          border
          border-white/20
          shadow-[0_10px_30px_rgba(0,0,0,0.12)]
        "
        initial={false}
      >
        {/* Animated Active Background */}
        <motion.div
          className="
            absolute
            inset-y-[4px]
            w-[calc(50%-2px)]
            rounded-full
            bg-gradient-to-r
            from-red-500
            to-rose-600
            shadow-[0_8px_24px_rgba(255,0,80,0.35)]
          "
          animate={{
            x: isSignIn ? 0 : "calc(100% + 4px)",
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 28,
          }}
        >
          {/* Subtle Glass Overlay */}
          <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-sm" />
        </motion.div>

        {/* Sign In Button */}
        <button
          onClick={handleSignInClick}
          className={`
            relative
            z-10
            flex
            items-center
            justify-center
            h-full
            px-8
            py-3
            text-sm
            font-medium
            transition-colors
            duration-300
            min-w-[96px]
            cursor-pointer
            bg-transparent
            border-none
          `}
        >
          <span
            className={`
              ${
                isSignIn
                  ? "text-white"
                  : "text-gray-500 hover:text-gray-900"
              }
              transition-colors
              duration-300
            `}
          >
            Sign In
          </span>
        </button>

        {/* Sign Up Button */}
        <button
          onClick={handleSignUpClick}
          className={`
            relative
            z-10
            flex
            items-center
            justify-center
            h-full
            px-8
            py-3
            text-sm
            font-medium
            transition-colors
            duration-300
            min-w-[96px]
            cursor-pointer
            bg-transparent
            border-none
          `}
        >
          <span
            className={`
              ${
                !isSignIn
                  ? "text-white"
                  : "text-gray-500 hover:text-gray-900"
              }
              transition-colors
              duration-300
            `}
          >
            Sign Up
          </span>
        </button>
      </motion.div>
    </div>
  );
}
