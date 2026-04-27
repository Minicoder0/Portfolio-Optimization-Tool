import { NextRequest, NextResponse } from "next/server";

interface FmpResult {
  symbol: string;
  name: string;
  currency?: string;
  exchange?: string;
  exchangeFullName?: string;
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query")?.trim();
  if (!query) return NextResponse.json([]);

  const apiKey = process.env.FMP_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "FMP_API_KEY not configured" },
      { status: 503 }
    );
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const [symbolRes, nameRes] = await Promise.allSettled([
      fetch(
        `https://financialmodelingprep.com/stable/search-symbol?query=${encodeURIComponent(query)}&apikey=${apiKey}`,
        { signal: controller.signal }
      ),
      fetch(
        `https://financialmodelingprep.com/stable/search-name?query=${encodeURIComponent(query)}&apikey=${apiKey}`,
        { signal: controller.signal }
      )
    ]);

    clearTimeout(timeout);

    const results: FmpResult[] = [];

    for (const res of [symbolRes, nameRes]) {
      if (res.status === "fulfilled" && res.value.ok) {
        const data = await res.value.json();
        if (Array.isArray(data)) results.push(...data);
      }
    }

    const usExchanges = new Set([
      "NASDAQ", "NYSE", "AMEX", "NYSEArca", "CBOE", "BATS"
    ]);

    const seen = new Set<string>();
    const unique = results
      .filter((item) => {
        if (!item.symbol || !item.name || seen.has(item.symbol)) return false;
        if (!item.exchange || !usExchanges.has(item.exchange)) return false;
        if (item.symbol.includes(".")) return false;
        seen.add(item.symbol);
        return true;
      })
      .slice(0, 10)
      .map((item) => ({
        symbol: item.symbol,
        name: item.name,
        exchangeShortName: item.exchange,
        type: undefined
      }));

    return NextResponse.json(unique);
  } catch {
    return NextResponse.json(
      { error: "Could not reach stock data provider" },
      { status: 503 }
    );
  }
}
