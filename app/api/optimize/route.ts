import { NextRequest, NextResponse } from "next/server";
import { optimizeFromPrices } from "@/lib/optimizer";

const FMP_API_KEY = process.env.FMP_API_KEY ?? "";
const FMP_BASE = "https://financialmodelingprep.com/stable";

interface FmpPrice {
  date: string;
  close: number;
}

async function fetchTickerPrices(
  ticker: string,
  from: string,
  to: string
): Promise<{ date: string; close: number }[]> {
  const url = `${FMP_BASE}/historical-price-eod/full?symbol=${encodeURIComponent(
    ticker
  )}&from=${from}&to=${to}&apikey=${FMP_API_KEY}`;

  const res = await fetch(url, { next: { revalidate: 0 } });
  if (!res.ok) throw new Error(`FMP returned ${res.status} for ${ticker}`);

  const data: FmpPrice[] = await res.json();
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error(`No price data for ${ticker}`);
  }

  return data
    .filter((d) => d.date && d.close != null)
    .sort((a, b) => a.date.localeCompare(b.date));
}

function mergePriceSeries(
  allSeries: { ticker: string; prices: { date: string; close: number }[] }[]
): { tickers: string[]; matrix: number[][] } {
  const dateSet = new Set<string>();
  for (const s of allSeries) {
    for (const p of s.prices) dateSet.add(p.date);
  }
  const dates = [...dateSet].sort();

  const priceMaps = allSeries.map((s) => {
    const map = new Map<string, number>();
    for (const p of s.prices) map.set(p.date, p.close);
    return map;
  });

  const matrix: number[][] = [];
  for (const date of dates) {
    const row: number[] = [];
    let allPresent = true;
    for (const map of priceMaps) {
      const val = map.get(date);
      if (val == null) {
        allPresent = false;
        break;
      }
      row.push(val);
    }
    if (allPresent) matrix.push(row);
  }

  return { tickers: allSeries.map((s) => s.ticker), matrix };
}

export async function POST(request: NextRequest) {
  if (!FMP_API_KEY) {
    return NextResponse.json(
      { detail: "FMP_API_KEY not configured on the server." },
      { status: 503 }
    );
  }

  let body: { tickers?: string[]; startDate?: string; endDate?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { detail: "Invalid request body." },
      { status: 400 }
    );
  }

  const tickers = [
    ...new Set(
      (body.tickers ?? []).map((t: string) => t.trim().toUpperCase()).filter(Boolean)
    ),
  ];

  if (tickers.length < 2 || tickers.length > 10) {
    return NextResponse.json(
      { detail: "Provide between 2 and 10 unique tickers." },
      { status: 400 }
    );
  }

  const startDate = body.startDate;
  const endDate = body.endDate;
  if (!startDate || !endDate) {
    return NextResponse.json(
      { detail: "startDate and endDate are required." },
      { status: 400 }
    );
  }

  const failed: string[] = [];
  const seriesList: { ticker: string; prices: { date: string; close: number }[] }[] = [];

  await Promise.all(
    tickers.map(async (ticker) => {
      try {
        const prices = await fetchTickerPrices(ticker, startDate, endDate);
        if (prices.length > 0) {
          seriesList.push({ ticker, prices });
        } else {
          failed.push(ticker);
        }
      } catch {
        failed.push(ticker);
      }
    })
  );

  if (seriesList.length < 2) {
    const msg = failed.length > 0
      ? `Could not fetch data for: ${failed.join(", ")}. Check ticker symbols and try again.`
      : "Market data temporarily unavailable.";
    return NextResponse.json({ detail: msg }, { status: 400 });
  }

  const { tickers: orderedTickers, matrix } = mergePriceSeries(seriesList);

  if (matrix.length < 31) {
    return NextResponse.json(
      { detail: "Not enough price history for this date range." },
      { status: 400 }
    );
  }

  try {
    const result = optimizeFromPrices(matrix, orderedTickers);
    return NextResponse.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Optimization failed.";
    return NextResponse.json({ detail: msg }, { status: 400 });
  }
}
