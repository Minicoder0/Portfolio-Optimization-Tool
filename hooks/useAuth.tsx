"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      setLoading(false);

      if (nextUser) {
        document.cookie = "session=active; path=/; SameSite=Lax";
        await setDoc(
          doc(db, "users", nextUser.uid),
          {
            name: nextUser.displayName ?? "",
            email: nextUser.email ?? "",
            updatedAt: serverTimestamp(),
            createdAt: serverTimestamp()
          },
          { merge: true }
        );
      } else {
        document.cookie = "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    });

    return () => unsub();
  }, []);

  const logout = async () => {
    if (!auth) return;
    document.cookie = "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    await signOut(auth);
    window.location.href = "/";
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      logout
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
