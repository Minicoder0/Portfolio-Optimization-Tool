import type { StockSuggestion } from "@/lib/types";

export async function searchStocks(
  query: string
): Promise<{ results: StockSuggestion[]; error?: string }> {
  if (!query.trim()) return { results: [] };

  const response = await fetch(
    `/api/stocks/search?query=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    return {
      results: [],
      error: body.error ?? "Stock search unavailable"
    };
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    return { results: [], error: data.error };
  }

  return { results: data };
}
