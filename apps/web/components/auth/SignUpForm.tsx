"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import SocialButtons from "./SocialButtons";

import {
  User,
  Mail,
  LockKeyhole,
} from "lucide-react";
  import { ArrowRight } from "lucide-react";

export default function SignUpForm() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col justify-center h-full">

      {/* Top Switch */}
      <div
        className="
          mb-6
          relative
          flex
          items-center
          justify-center
          border-b
          border-white/60
        "
      >

        {/* Navigation Wrapper */}
        <div className="relative flex items-center">

          {/* Animated Underline */}
          <div
            className={`
              absolute
              bottom-0
              left-0
              h-[2px]
              w-[96px]
              rounded-full
              bg-red-600
              transition-transform
              duration-300
              ease-in-out
              ${
                pathname === "/sign-in"
                  ? "translate-x-0"
                  : "translate-x-[96px]"
              }
            `}
          />

          {/* Sign In */}
          <Link
            href="/sign-in"
            className="
              h-11
              w-[96px]
              flex
              items-center
              justify-center
              text-xs
              font-semibold
              transition-colors
              duration-300
            "
          >
            <span
              className={
                pathname === "/sign-in"
                  ? "text-red-600"
                  : "text-gray-500 hover:text-gray-800"
              }
            >
              Sign In
            </span>
          </Link>

          {/* Sign Up */}
          <Link
            href="/sign-up"
            className="
              h-11
              w-[96px]
              flex
              items-center
              justify-center
              text-xs
              font-semibold
              transition-colors
              duration-300
            "
          >
            <span
              className={
                pathname === "/sign-up"
                  ? "text-red-600"
                  : "text-gray-500 hover:text-gray-800"
              }
            >
              Sign Up
            </span>
          </Link>

        </div>

      </div>

      {/* Heading */}
      <div className="text-center">

        <h2 className="text-2xl font-bold tracking-tight text-black">
          Create your{" "}
          <span className="text-red-700">
            account
          </span>
        </h2>

        <p className="mt-1 text-gray-700 text-xs">
          Join Endow Global Education today
        </p>

      </div>

      {/* Form */}
      <div className="mt-5 space-y-2">

        {/* Name + Email */}
        <div className="grid grid-cols-2 gap-2">

          <div>
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Name
            </label>

            <div
              className="
                mt-1
                flex
                items-center
                h-11
                rounded-xl
                border
                border-white/60
                bg-white/70
                backdrop-blur-xl
                shadow-sm
                px-3
                transition-all
                focus-within:border-red-700
                focus-within:ring-2
                focus-within:ring-red-100
              "
            >
              <User
                className="text-gray-400"
                size={18}
              />

              <input
                type="text"
                placeholder="Full name"
                className="
                  w-full
                  h-full
                  px-3
                  outline-none
                  bg-transparent
                  text-sm
                  text-gray-800
                  placeholder:text-gray-400
                "
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Email
            </label>

            <div
              className="
                mt-1
                flex
                items-center
                h-11
                rounded-xl
                border
                border-white/60
                bg-white/70
                backdrop-blur-xl
                shadow-sm
                px-3
                transition-all
                focus-within:border-red-700
                focus-within:ring-2
                focus-within:ring-red-100
              "
            >
              <Mail
                className="text-gray-400"
                size={18}
              />

              <input
                type="email"
                placeholder="Email address"
                className="
                  w-full
                  h-full
                  px-3
                  outline-none
                  bg-transparent
                  text-sm
                  text-gray-800
                  placeholder:text-gray-400
                "
              />
            </div>
          </div>

        </div>

        {/* Password + Confirm */}
        <div className="grid grid-cols-2 gap-2">

          <div>
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Password
            </label>

            <div
              className="
                mt-1
                flex
                items-center
                h-11
                rounded-xl
                border
                border-white/60
                bg-white/70
                backdrop-blur-xl
                shadow-sm
                px-3
                transition-all
                focus-within:border-red-700
                focus-within:ring-2
                focus-within:ring-red-100
              "
            >
              <LockKeyhole
                className="text-gray-400"
                size={18}
              />

              <input
                type="password"
                placeholder="Password"
                className="
                  w-full
                  h-full
                  px-3
                  outline-none
                  bg-transparent
                  text-sm
                  text-gray-800
                  placeholder:text-gray-400
                "
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Confirm
            </label>

            <div
              className="
                mt-1
                flex
                items-center
                h-11
                rounded-xl
                border
                border-white/60
                bg-white/70
                backdrop-blur-xl
                shadow-sm
                px-3
                transition-all
                focus-within:border-red-700
                focus-within:ring-2
                focus-within:ring-red-100
              "
            >
              <LockKeyhole
                className="text-gray-400"
                size={18}
              />

              <input
                type="password"
                placeholder="Confirm password"
                className="
                  w-full
                  h-full
                  px-3
                  outline-none
                  bg-transparent
                  text-sm
                  text-gray-800
                  placeholder:text-gray-400
                "
              />
            </div>
          </div>

        </div>

      </div>

      {/* Terms */}
      <div className="flex items-center gap-2 mt-3 text-gray-700 text-xs">

        <input type="checkbox" className="w-3 h-3 rounded" />

        <p>
          I agree to the{" "}

          <span className="text-red-700 font-semibold">
            Terms & Conditions
          </span>

        </p>

      </div>

      {/* Button */}
      <button
        className="
          mt-3
          w-full
          h-11
          rounded-xl
          bg-gradient-to-r
          from-red-600
          to-red-800
          text-white
          text-sm
          font-semibold
          shadow-[0_8px_24px_rgba(220,38,38,0.2)]
          hover:scale-[1.01]
          transition-all
        "
      >
        Sign Up
      </button>

      {/* Divider */}
      <div className="flex items-center gap-4 mt-5">

        <div className="h-[1px] flex-1 bg-gray-200" />

        <span className="text-gray-400 text-sm">
          or
        </span>

        <div className="h-[1px] flex-1 bg-gray-200" />

      </div>

      {/* Social */}
      <SocialButtons />

    </div>
  );
}