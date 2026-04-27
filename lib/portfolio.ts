import type { OptimizationResponse } from "@/lib/types";

export async function optimizePortfolio(input: {
  tickers: string[];
  startDate: string;
  endDate: string;
}): Promise<OptimizationResponse> {
  const response = await fetch("/api/optimize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.detail ?? "Optimization failed");
  }

  return response.json();
}
