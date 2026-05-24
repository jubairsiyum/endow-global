"use client";

import Link from "next/link";

import SocialButtons from "./SocialButtons";
import AuthTabToggle from "./AuthTabToggle";

import {
  Mail,
  LockKeyhole,
} from "lucide-react";

interface SignInFormProps {
  authError?: string;
}

function getAuthErrorMessage(authError?: string) {
  if (!authError) {
    return null;
  }

  if (authError === 'please_restart_the_process') {
    return 'We could not recover the OAuth state from your previous Google sign-in. Start a new sign-in attempt to continue.';
  }

  return 'Sign-in could not be completed. Please try again.';
}

export default function SignInForm({ authError }: SignInFormProps) {
  const errorMessage = getAuthErrorMessage(authError);

  return (
    <div>

      {errorMessage && (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs leading-5 text-red-900">
          <div className="font-semibold text-red-950">
            Sign-in needs to be restarted
          </div>

          <p className="mt-1">{errorMessage}</p>

          <Link
            href="/sign-in"
            className="mt-3 inline-flex items-center rounded-full bg-red-700 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-red-800"
          >
            Restart sign-in
          </Link>
        </div>
      )}

      {/* Premium Segmented Glass Toggle */}
      <AuthTabToggle />

      {/* Heading */}
      <div className="text-center">

        <h2 className="text-2xl font-bold tracking-tight text-black">
          Welcome back
        </h2>

        <p className="mt-1 text-gray-700 text-xs">
          Sign in to continue
        </p>

      </div>

      {/* Form */}
      <div className="mt-5 space-y-2">

        {/* Email */}
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
              size={20}
            />

            <input
              type="email"
              placeholder="Enter your email"
              className="
                w-full
                h-full
                px-4
                outline-none
                bg-transparent
                text-gray-800
                placeholder:text-gray-400
              "
            />
          </div>
        </div>

        {/* Password */}
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
              size={20}
            />

            <input
              type="password"
              placeholder="Enter your password"
              className="
                w-full
                h-full
                px-4
                outline-none
                bg-transparent
                text-gray-800
                placeholder:text-gray-400
              "
            />
          </div>
        </div>

      </div>

      {/* Options */}
      <div className="flex items-center justify-between mt-3">

        <label className="flex items-center gap-2 text-gray-700 text-xs">
          <input type="checkbox" className="w-3 h-3 rounded" />
          Remember
        </label>

        <button className="text-red-700 text-xs font-semibold hover:underline">
          Forgot Password?
        </button>

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
        Sign In
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 mt-3">

        <div className="h-px flex-1 bg-gray-300" />

        <span className="text-gray-500 text-xs font-medium">
          or
        </span>

        <div className="h-px flex-1 bg-gray-300" />

      </div>

      {/* Social */}
      <SocialButtons />

    </div>
  );
}