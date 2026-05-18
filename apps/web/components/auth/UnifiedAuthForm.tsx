"use client";

import { motion, AnimatePresence } from "framer-motion";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import { useAuthMode } from "./AuthContext";

export default function UnifiedAuthForm() {
  const { mode } = useAuthMode();
  const isSignIn = mode === "signin";

  // Direction logic for smooth animations
  const direction = isSignIn ? -1 : 1; // -1 for SignIn (slides right), 1 for SignUp (slides left)

  const formVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <AnimatePresence initial={false} mode="wait" custom={direction}>
        {isSignIn ? (
          <motion.div
            key="signin"
            variants={formVariants}
            custom={direction}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: {
                type: "spring",
                stiffness: 300,
                damping: 30,
              },
              opacity: {
                duration: 0.3,
              },
              scale: {
                duration: 0.3,
              },
            }}
            className="w-full"
          >
            <SignInForm />
          </motion.div>
        ) : (
          <motion.div
            key="signup"
            variants={formVariants}
            custom={direction}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: {
                type: "spring",
                stiffness: 300,
                damping: 30,
              },
              opacity: {
                duration: 0.3,
              },
              scale: {
                duration: 0.3,
              },
            }}
            className="w-full"
          >
            <SignUpForm />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
