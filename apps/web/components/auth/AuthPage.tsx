"use client";

import { useState, Suspense } from "react";
import { motion } from "framer-motion";

import CinematicBranding from "./CinematicBranding";
import AuthPanel from "./AuthPanel";

interface AuthPageProps {
  mode?: "login" | "signup";
}

function AuthPageContent() {
  const [isLoading, setIsLoading] =
    useState(false);

  /*
  ==================================================
  REAL AUTH HANDLER (USE LATER)
  ==================================================

  const handleAuthSubmit = async (
    data: {
      email: string;
      password: string;
    }
  ) => {
    setIsLoading(true);

    try {
      await signIn("credentials", {
        email: data.email,
        password: data.password,
      });

      router.push("/admin");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  ==================================================
  TEMP LOGIN
  ==================================================
  */

  const handleAuthSubmit = async (
    data: {
      email: string;
      password: string;
    }
  ) => {
    setIsLoading(true);

    try {
      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );

      console.log(
        "Login Data:",
        data
      );

      window.location.href =
        "/admin";
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-screen overflow-hidden bg-[#f6f7fb]">
      
      {/* LIGHT PREMIUM BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.10),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(15,23,42,0.05),transparent_28%)]" />

      {/* LIGHT GRID */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:70px_70px]" />

      {/* MAIN */}
      <div className="relative z-10 flex h-screen overflow-hidden">
        
        {/* LEFT SIDE */}
        <div className="hidden lg:flex lg:w-[54%]">
          <CinematicBranding />
        </div>

        {/* CENTER DIVIDER */}
        <div className="hidden lg:block w-px bg-black/5" />

        {/* RIGHT SIDE */}
        <div className="relative flex h-screen w-full items-center justify-center overflow-hidden px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 lg:w-[46%] lg:px-8 lg:py-5">
          
          {/* WHITE PREMIUM AREA */}
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]" />

          {/* RED GLOW */}
          <div className="absolute right-[8%] top-[10%] h-[320px] w-[320px] rounded-full bg-red-500/10 blur-3xl" />

          {/* SOFT SHADOW GLOW */}
          <div className="absolute bottom-[8%] left-[5%] h-[240px] w-[240px] rounded-full bg-slate-300/20 blur-3xl" />

          {/* PANEL */}
          <motion.div
            initial={{
              opacity: 0,
              y: 40,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
            }}
            className="relative z-20 flex w-full items-center justify-center"
          >
            <div className="w-full max-w-[360px] scale-70 origin-center sm:scale-74 md:scale-[0.80] lg:scale-[0.85] xl:scale-90 2xl:scale-100">
              
              <AuthPanel
                onSubmit={
                  handleAuthSubmit
                }
                isLoading={isLoading}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage({
  mode = "login",
}: AuthPageProps) {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-[#f6f7fb]">
          
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
            className="h-10 w-10 rounded-full border-2 border-black/10 border-t-red-500"
          />
        </div>
      }
    >
      <AuthPageContent />
    </Suspense>
  );
}