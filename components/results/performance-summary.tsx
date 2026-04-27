"use client";

import { Info } from "lucide-react";
import type { AppMode, OptimizationMetrics } from "@/lib/types";
import { formatPercent } from "@/lib/utils";

function verdictForSharpe(sharpe: number) {
  if (sharpe >= 1.5) return "Excellent";
  if (sharpe >= 1.0) return "Good";
  if (sharpe >= 0.6) return "Acceptable";
  return "Weak";
}

function metricColor(type: "return" | "risk" | "sharpe", value: number) {
  if (type === "return") return value >= 0 ? "text-emerald-400" : "text-red-400";
  if (type === "risk") return value > 0.25 ? "text-red-400" : value > 0.15 ? "text-amber-400" : "text-emerald-400";
  return value >= 1.0 ? "text-emerald-400" : value >= 0.6 ? "text-amber-400" : "text-red-400";
}

export function PerformanceSummary({
  metrics,
  investmentAmount,
  mode
}: {
  metrics: OptimizationMetrics;
  investmentAmount: number;
  mode: AppMode;
}) {
  const cards = [
    {
      label: "Expected Return",
      value: formatPercent(metrics.expectedReturn),
      sub: `≈ $${(investmentAmount * metrics.expectedReturn).toFixed(0)} / year`,
      color: metricColor("return", metrics.expectedReturn),
      tip: "The average annual return you can expect based on historical data."
    },
    {
      label: mode === "beginner" ? "Risk Level" : "Volatility σ",
      value: formatPercent(metrics.volatility),
      sub: `±$${(investmentAmount * metrics.volatility).toFixed(0)} typical swing`,
      color: metricColor("risk", metrics.volatility),
      tip: "How much your portfolio value could swing in a typical year."
    },
    {
      label: mode === "beginner" ? "Efficiency Score" : "Sharpe Ratio",
      value: metrics.sharpe.toFixed(2),
      sub: verdictForSharpe(metrics.sharpe),
      color: metricColor("sharpe", metrics.sharpe),
      tip: "Measures return per unit of risk. Higher is better."
    }
  ];

  return (
    <section className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <article key={card.label} className="v2-card-static p-5 border-t-2 border-emerald-500/30">
          <div className="flex items-center gap-1.5">
            <p className="text-sm text-gray-500">{card.label}</p>
            {mode === "beginner" && (
              <span className="group relative cursor-help">
                <Info size={13} className="text-gray-600" />
                <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-surface-high px-3 py-1.5 text-xs text-gray-300 opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                  {card.tip}
                </span>
              </span>
            )}
          </div>
          <p className={`metric-value mt-1 ${card.color}`}>{card.value}</p>
          <p className="mt-1 text-xs text-gray-500">{card.sub}</p>
        </article>
      ))}
    </section>
  );
}
