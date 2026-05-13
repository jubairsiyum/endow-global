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

      {/* Top Switch */}
      <div
        className="
          mt-8
          grid
          grid-cols-2
          rounded-2xl
          bg-white
          border
          border-gray-200
          p-1
          shadow-sm
        "
      >

        {/* Sign In */}
        <Link href="/sign-in">
          <button
            className={`
              h-14
              rounded-xl
              font-semibold
              transition-all
              w-full
              ${
                pathname === "/sign-in"
                  ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-50"
              }
            `}
          >
            Sign In
          </button>
        </Link>

        {/* Sign Up */}
        <Link href="/sign-up">
          <button
            className={`
              h-14
              rounded-xl
              font-semibold
              transition-all
              w-full
              ${
                pathname === "/sign-up"
                  ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-50"
              }
            `}
          >
            Sign Up
          </button>
        </Link>

      </div>

      {/* Form */}
      <div className="mt-8 space-y-4">

        {/* Name + Email */}
        <div className="grid grid-cols-2 gap-4">

          {/* Full Name */}
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
                border-gray-200
                bg-white
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

          {/* Email */}
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
                border-gray-200
                bg-white
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

          {/* Password */}
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
                border-gray-200
                bg-white
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

          {/* Confirm */}
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
                border-gray-200
                bg-white
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

      {/* Submit */}
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
          shadow-lg
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