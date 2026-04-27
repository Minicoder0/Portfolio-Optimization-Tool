import type { RiskLevel } from "@/lib/types";

export function formatPercent(value: number, digits = 2): string {
  return `${(value * 100).toFixed(digits)}%`;
}

export function getRiskLevelFromVolatility(volatility: number): RiskLevel {
  const pct = volatility * 100;
  if (pct < 15) return "Low";
  if (pct < 25) return "Medium";
  if (pct < 35) return "High";
  return "Very High";
}

export function startDateFromYears(years: number): string {
  const current = new Date();
  const start = new Date(current);
  start.setFullYear(current.getFullYear() - years);
  return start.toISOString().slice(0, 10);
}

export function yesterdayIsoDate(): string {
  const current = new Date();
  current.setDate(current.getDate() - 1);
  return current.toISOString().slice(0, 10);
}
