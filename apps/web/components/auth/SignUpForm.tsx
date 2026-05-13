"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import SocialButtons from "./SocialButtons";

import {
  User,
  Mail,
  LockKeyhole,
} from "lucide-react";

export default function SignUpForm() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col justify-center h-full">

      {/* Top Switch */}
      <div
        className="
          mb-10
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
              h-14
              w-[96px]
              flex
              items-center
              justify-center
              text-base
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
              h-14
              w-[96px]
              flex
              items-center
              justify-center
              text-base
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

        <h2 className="text-4xl font-bold tracking-tight text-black">
          Create your{" "}
          <span className="text-red-700">
            account
          </span>
        </h2>

        <p className="mt-3 text-gray-500 text-lg">
          Join Endow Global Education
        </p>

      </div>

      {/* Form */}
      <div className="mt-8 space-y-4">

        {/* Name + Email */}
        <div className="grid grid-cols-2 gap-4">

          <div>
            <label className="text-sm font-medium text-gray-700">
              Full Name
            </label>

            <div
              className="
                mt-2
                flex
                items-center
                h-14
                rounded-2xl
                border
                border-white/60
                bg-white/70
                backdrop-blur-xl
                shadow-sm
                px-4
                transition-all
                focus-within:border-red-700
                focus-within:ring-4
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
                "
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Email Address
            </label>

            <div
              className="
                mt-2
                flex
                items-center
                h-14
                rounded-2xl
                border
                border-white/60
                bg-white/70
                backdrop-blur-xl
                shadow-sm
                px-4
                transition-all
                focus-within:border-red-700
                focus-within:ring-4
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
                "
              />
            </div>
          </div>

        </div>

        {/* Password + Confirm */}
        <div className="grid grid-cols-2 gap-4">

          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>

            <div
              className="
                mt-2
                flex
                items-center
                h-14
                rounded-2xl
                border
                border-white/60
                bg-white/70
                backdrop-blur-xl
                shadow-sm
                px-4
                transition-all
                focus-within:border-red-700
                focus-within:ring-4
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
                "
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Confirm Password
            </label>

            <div
              className="
                mt-2
                flex
                items-center
                h-14
                rounded-2xl
                border
                border-white/60
                bg-white/70
                backdrop-blur-xl
                shadow-sm
                px-4
                transition-all
                focus-within:border-red-700
                focus-within:ring-4
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
                "
              />
            </div>
          </div>

        </div>

      </div>

      {/* Terms */}
      <div className="flex items-center gap-2 mt-5 text-gray-500 text-sm">

        <input type="checkbox" />

        <p>
          I agree to the{" "}

          <span className="text-red-700 font-medium">
            Terms & Conditions
          </span>

        </p>

      </div>

      {/* Button */}
      <button
        className="
          mt-5
          w-full
          h-14
          rounded-2xl
          bg-gradient-to-r
          from-red-600
          to-red-800
          text-white
          text-lg
          font-semibold
          shadow-[0_10px_30px_rgba(220,38,38,0.25)]
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