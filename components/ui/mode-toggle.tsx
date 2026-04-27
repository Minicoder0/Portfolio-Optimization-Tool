"use client";

import { useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { MODE_LABELS } from "@/lib/constants";
import { useMode } from "@/hooks/useMode";
import { useAuth } from "@/hooks/useAuth";

export function ModeToggle() {
  const { mode, setMode } = useMode();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    setDoc(doc(db, "users", user.uid), { modePreference: mode }, { merge: true }).catch(
      () => undefined
    );
  }, [mode, user]);

  return (
    <div className="pill-toggle">
      {(["beginner", "advanced"] as const).map((value) => (
        <button
          key={value}
          onClick={() => setMode(value)}
          className={mode === value ? "active" : ""}
        >
          {MODE_LABELS[value]}
        </button>
      ))}
    </div>
  );
}
