"use client"

import Image from "next/image"
import { authClient } from "@/lib/auth-client"

export default function SocialButtons() {
  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    })
  }

  return (
    <div className="mt-2">

      <button
        onClick={handleGoogleSignIn}
        className="
          w-full
          h-11
          rounded-xl
          border
          border-white/60
          bg-white/70
          backdrop-blur-xl
          shadow-sm
          flex
          items-center
          justify-center
          gap-2
          text-sm
          font-semibold
          text-gray-800
          hover:shadow-md
          transition-all
        "
      >
        <Image
          src="https://www.google.com/favicon.ico"
          alt="Google"
          width={18}
          height={18}
        />

        Continue with Google
      </button>

    </div>
  )
}
