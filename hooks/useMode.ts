"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { MODE_STORAGE_KEY } from "@/lib/constants";
import type { AppMode } from "@/lib/types";
import React from "react";

interface ModeContextValue {
  mode: AppMode;
  setMode: (next: AppMode) => void;
}

const ModeContext = createContext<ModeContextValue | undefined>(undefined);

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<AppMode>("beginner");

  useEffect(() => {
    const stored = localStorage.getItem(MODE_STORAGE_KEY);
    if (stored === "beginner" || stored === "advanced") {
      setModeState(stored);
    }
  }, []);

  const setMode = useCallback((next: AppMode) => {
    setModeState(next);
    localStorage.setItem(MODE_STORAGE_KEY, next);
  }, []);

  return React.createElement(
    ModeContext.Provider,
    { value: { mode, setMode } },
    children
  );
}

export function useMode(): ModeContextValue {
  const ctx = useContext(ModeContext);
  if (!ctx) {
    throw new Error("useMode must be used within ModeProvider");
  }
  return ctx;
}
