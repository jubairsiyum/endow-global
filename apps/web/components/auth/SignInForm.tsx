import SocialButtons from "./SocialButtons";

import {
  Mail,
  LockKeyhole,
} from "lucide-react";

export default function SignInForm() {
  return (
    <div>

      {/* Heading */}
      <div>
        <h2 className="text-4xl font-bold tracking-tight text-black">
          Welcome{" "}
          <span className="text-red-700">
            back
          </span>
        </h2>

        <p className="mt-3 text-gray-500 text-base">
          Sign in to continue to your account
        </p>
      </div>

      {/* Form */}
      <div className="mt-8 space-y-5">

        {/* Email */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Email address
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
              px-5
              transition-all
              focus-within:border-red-700
              focus-within:ring-4
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
              "
            />
          </div>
        </div>

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
              px-5
              transition-all
              focus-within:border-red-700
              focus-within:ring-4
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
              "
            />
          </div>
        </div>

      </div>

      {/* Options */}
      <div className="flex items-center justify-between mt-5">

        <label className="flex items-center gap-2 text-gray-600 text-sm">
          <input type="checkbox" />
          Remember me
        </label>

        <button className="text-red-700 text-sm font-medium hover:underline">
          Forgot password?
        </button>

      </div>

      {/* Submit */}
      <button
        className="
          mt-6
          w-full
          h-14
          rounded-2xl
          bg-gradient-to-r
          from-red-700
          to-red-900
          text-white
          text-lg
          font-semibold
          shadow-lg
          hover:scale-[1.01]
          transition-all
        "
      >
        Sign In
      </button>

      {/* Divider */}
      <div className="flex items-center gap-4 mt-6">

        <div className="h-[1px] flex-1 bg-gray-200" />

        <span className="text-gray-400 text-sm">
          or
        </span>

        <div className="h-[1px] flex-1 bg-gray-200" />

      </div>

      {/* Social */}
      <SocialButtons />

      {/* Bottom */}
      <p className="text-center text-gray-500 text-sm mt-6">
        Don&apos;t have an account?{" "}

        <span className="text-red-700 font-semibold cursor-pointer hover:underline">
          Sign up
        </span>
      </p>

    </div>
  );
}