"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import { useAuthMode } from "./AuthContext";

const formVariants = {
  enter: { x: 10, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -10, opacity: 0 },
};

const formTransition = {
  duration: 0.28,
  ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
};

const heightTransition = {
  duration: 0.32,
  ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
};

const FALLBACK_SIGNIN = 560;
const FALLBACK_SIGNUP = 740;

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function UnifiedAuthForm() {
  const { mode } = useAuthMode();
  const isSignIn = mode === "signin";

  const signinSizerRef = useRef<HTMLDivElement>(null);
  const signupSizerRef = useRef<HTMLDivElement>(null);
  const [signinHeight, setSigninHeight] = useState(FALLBACK_SIGNIN);
  const [signupHeight, setSignupHeight] = useState(FALLBACK_SIGNUP);

  useIsomorphicLayoutEffect(() => {
    const measure = () => {
      if (signinSizerRef.current) {
        setSigninHeight(signinSizerRef.current.offsetHeight);
      }
      if (signupSizerRef.current) {
        setSignupHeight(signupSizerRef.current.offsetHeight);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const targetHeight = isSignIn ? signinHeight : signupHeight;

  return (
    <motion.div
      className="relative w-full"
      animate={{ height: targetHeight }}
      initial={false}
      transition={heightTransition}
    >
      <div
        ref={signinSizerRef}
        aria-hidden
        className="pointer-events-none invisible absolute inset-x-0 top-0"
      >
        <SignInForm />
      </div>
      <div
        ref={signupSizerRef}
        aria-hidden
        className="pointer-events-none invisible absolute inset-x-0 top-0"
      >
        <SignUpForm />
      </div>

      <AnimatePresence initial={false} mode="popLayout">
        {isSignIn ? (
          <motion.div
            key="signin"
            variants={formVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={formTransition}
            className="absolute inset-0 w-full"
          >
            <SignInForm />
          </motion.div>
        ) : (
          <motion.div
            key="signup"
            variants={formVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={formTransition}
            className="absolute inset-0 w-full"
          >
            <SignUpForm />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
