"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useAuth } from "@/hooks/useAuth";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/history", label: "History" },
  { href: "/glossary", label: "Glossary" }
] as const satisfies ReadonlyArray<{ href: Route; label: string }>;

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] backdrop-blur-xl bg-surface/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-lg font-display font-bold text-white">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            PortfolioIQ
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm transition-colors ${
                  pathname === item.href
                    ? "text-white font-medium"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            <ModeToggle />
            {user ? (
              <button className="btn-secondary text-sm !px-3 !py-1.5" onClick={logout}>
                Logout
              </button>
            ) : (
              <Link href="/login" className="btn-primary text-sm !px-4 !py-1.5">
                Get Started
              </Link>
            )}
            {/* Mobile hamburger */}
            <button
              className="text-gray-400 md:hidden"
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <nav className="border-t border-white/[0.06] px-4 py-3 md:hidden">
            <div className="flex flex-col gap-3">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`text-sm ${
                    pathname === item.href ? "text-white font-medium" : "text-gray-400"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>

      {/* Main content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="mt-16 border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-6xl items-center justify-center px-4 py-6 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            PortfolioIQ
          </span>
        </div>
      </footer>
    </div>
  );
}
