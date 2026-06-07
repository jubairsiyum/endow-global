"use client";

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
    <div className="mb-7 flex w-full justify-center">
      <div
        className="
          relative
          flex
          items-center
          gap-0
          p-1
          h-12
          w-full
          rounded-2xl
          bg-slate-100/90
          backdrop-blur-xl
          border
          border-slate-200/80
          shadow-inner
          overflow-hidden
        "
      >
        <div
          className="
            absolute
            top-1
            bottom-1
            left-1
            w-[calc(50%-4px)]
            rounded-[0.85rem]
            bg-gradient-to-r
            from-slate-950
            to-red-900
            shadow-[0_12px_26px_rgba(127,29,29,0.24)]
            will-change-transform
          "
          style={{
            transform: isSignIn ? "translateX(0)" : "translateX(100%)",
            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-sm" />
        </div>

        <button
          onClick={handleSignInClick}
          className="
            relative
            flex
            flex-1
            items-center
            justify-center
            h-full
            px-5
            py-3
            text-sm
            font-bold
            cursor-pointer
            bg-transparent
            border-none
          "
        >
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
                  : "text-slate-500 hover:text-slate-950"
              }
            `}
          >
            Sign In
          </span>
        </button>

        <button
          onClick={handleSignUpClick}
          className="
            relative
            flex
            flex-1
            items-center
            justify-center
            h-full
            px-5
            py-3
            text-sm
            font-bold
            cursor-pointer
            bg-transparent
            border-none
          "
        >
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
                  : "text-slate-500 hover:text-slate-950"
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
