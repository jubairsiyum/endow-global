"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

type AuthMode = "signin" | "signup";

interface AuthContextType {
  mode: AuthMode;
  setMode: (mode: AuthMode) => void;
  toggleMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  initialMode = "signin",
}: {
  children: React.ReactNode;
  initialMode?: AuthMode;
}) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const router = useRouter();

  const handleSetMode = useCallback((newMode: AuthMode) => {
    setMode(newMode);
    // Sync URL with mode change using shallow client routing
    const newPath = newMode === "signin" ? "/sign-in" : "/sign-up";
    router.replace(newPath);
  }, [router]);

  const toggleMode = useCallback(() => {
    const newMode = mode === "signin" ? "signup" : "signin";
    handleSetMode(newMode);
  }, [mode, handleSetMode]);

  return (
    <AuthContext.Provider value={{ mode, setMode: handleSetMode, toggleMode }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthMode() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthMode must be used within AuthProvider");
  }
  return context;
}
