"use client";

import { useState } from "react";
import Image from "next/image";

import { authClient } from "@/lib/auth-client";

export default function SocialButtons() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);

      await authClient.signIn.social({
        provider: "google",
      });
    } catch (error) {
      console.error("[Auth] Google sign-in failed:", error);
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="mt-2">

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading}
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
          disabled:cursor-not-allowed
          disabled:opacity-70
        "
      >
        <Image
          src="https://www.google.com/favicon.ico"
          alt="Google"
          width={18}
          height={18}
        />

        {isGoogleLoading ? "Connecting to Google..." : "Continue with Google"}
      </button>

    </div>
  );
}