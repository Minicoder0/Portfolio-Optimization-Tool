import type { AppMode } from "@/lib/types";

export const MODE_STORAGE_KEY = "portfolioiq-mode";

export const MODE_LABELS: Record<AppMode, string> = {
  beginner: "Beginner",
  advanced: "Advanced"
};

export const DATE_PRESETS = [
  { label: "1Y", description: "Quick recent trend", years: 1 },
  { label: "3Y", description: "Recommended balanced view", years: 3 },
  { label: "5Y", description: "Longer market context", years: 5 }
] as const;

export const MAX_STOCKS = 10;
export const MIN_STOCKS = 2;
