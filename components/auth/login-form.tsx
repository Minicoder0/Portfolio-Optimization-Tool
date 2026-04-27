"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const setSessionAndRedirect = () => {
    document.cookie = "session=active; path=/; SameSite=Lax";
    window.location.href = "/dashboard";
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (!auth) {
      setError("Firebase auth is not available. Check your environment configuration.");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSessionAndRedirect();
    } catch {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    setError(null);
    if (!auth) {
      setError("Firebase auth is not available. Check your environment configuration.");
      return;
    }
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      setSessionAndRedirect();
    } catch {
      setError("Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onReset = async () => {
    if (!auth) {
      setError("Firebase auth is not available. Check your environment configuration.");
      return;
    }
    if (!email) {
      setError("Enter your email first, then click Forgot Password.");
      return;
    }
    await sendPasswordResetEmail(auth, email);
    setError("Password reset email sent.");
  };

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4">
      <form
        className="v2-card-static w-full max-w-[420px] space-y-5 p-10"
        onSubmit={onSubmit}
        style={{ transform: "none" }}
      >
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-sm text-gray-400">Sign in to your PortfolioIQ account</p>
        </div>

        <div className="space-y-3">
          <input
            className="input"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <div className="relative">
            <input
              className="input pr-10"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <div className="text-right">
            <button type="button" className="text-xs text-emerald-400 hover:text-emerald-300" onClick={onReset}>
              Forgot password?
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button className="btn-primary w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-white/[0.06]" />
          <span className="text-xs text-gray-500">or</span>
          <div className="h-px flex-1 bg-white/[0.06]" />
        </div>

        <button type="button" className="btn-secondary w-full flex items-center justify-center gap-2" onClick={onGoogle}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Continue with Google
        </button>

        <p className="text-center text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-emerald-400 hover:text-emerald-300">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
