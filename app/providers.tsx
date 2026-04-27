"use client";

import { AuthProvider } from "@/hooks/useAuth";
import { ModeProvider } from "@/hooks/useMode";
import { SiteShell } from "@/components/ui/site-shell";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ModeProvider>
        <SiteShell>{children}</SiteShell>
      </ModeProvider>
    </AuthProvider>
  );
}
