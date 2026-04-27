"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search, Download, Save, AlertCircle } from "lucide-react";
import { searchStocks } from "@/lib/fmp";
import { optimizePortfolio } from "@/lib/portfolio";
import { DATE_PRESETS, MAX_STOCKS, MIN_STOCKS } from "@/lib/constants";
import { getRiskLevelFromVolatility, startDateFromYears, yesterdayIsoDate } from "@/lib/utils";
import { useMode } from "@/hooks/useMode";
import { useAuth } from "@/hooks/useAuth";
import type { OptimizationResponse, StockSuggestion } from "@/lib/types";
import { PortfolioPieChart } from "@/components/charts/portfolio-pie-chart";
import { PortfolioBarChart } from "@/components/charts/portfolio-bar-chart";
import { EfficientFrontierChart } from "@/components/charts/efficient-frontier-chart";
import { PerformanceSummary } from "@/components/results/performance-summary";
import { savePortfolio } from "@/lib/firestore/portfolios";

export function OptimizerWorkspace() {
  const { mode } = useMode();
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<StockSuggestion[]>([]);
  const [selectedTickers, setSelectedTickers] = useState<string[]>([]);
  const [startDate, setStartDate] = useState(startDateFromYears(3));
  const [endDate, setEndDate] = useState(yesterdayIsoDate());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OptimizationResponse | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState(10000);
  const [portfolioName, setPortfolioName] = useState("");
  const [sortMetric, setSortMetric] = useState<"weight" | "return" | "risk">("weight");
  const [activePreset, setActivePreset] = useState("3Y");
  const [searchError, setSearchError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const canOptimize = selectedTickers.length >= MIN_STOCKS && startDate <= endDate;

  const diversificationVerdict = useMemo(() => {
    if (!result) return "";
    if (result.diversificationScore >= 70) return "Well Diversified";
    if (result.diversificationScore >= 45) return "Moderate";
    return "Concentrated";
  }, [result]);

  const sortedStockStats = useMemo(() => {
    if (!result) return [];
    const list = [...result.stockStats];
    if (sortMetric === "return") list.sort((a, b) => b.expectedReturn - a.expectedReturn);
    else if (sortMetric === "risk") list.sort((a, b) => b.volatility - a.volatility);
    else list.sort((a, b) => (result.weights[b.ticker] ?? 0) - (result.weights[a.ticker] ?? 0));
    return list;
  }, [result, sortMetric]);

  const performSearch = useCallback(async (text: string) => {
    if (!text.trim()) { setSuggestions([]); setSearchError(null); return; }
    setSearching(true);
    setSearchError(null);
    const { results, error: err } = await searchStocks(text);
    setSuggestions(results.slice(0, 8));
    if (err) setSearchError(err);
    setSearching(false);
  }, []);

  const loadSuggestions = (text: string) => {
    setQuery(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!text.trim()) { setSuggestions([]); setSearchError(null); return; }
    debounceRef.current = setTimeout(() => performSearch(text), 300);
  };

  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, []);

  const addTicker = (symbol: string) => {
    setError(null);
    const normalized = symbol.trim().toUpperCase();
    if (selectedTickers.includes(normalized)) { setError(`${normalized} is already in your list.`); return; }
    if (selectedTickers.length >= MAX_STOCKS) { setError("You've reached the maximum of 10 stocks."); return; }
    setSelectedTickers((prev) => [...prev, normalized]);
    setQuery("");
    setSuggestions([]);
  };

  const runOptimization = async () => {
    setError(null);
    setLoading(true);
    try {
      const optimized = await optimizePortfolio({ tickers: selectedTickers, startDate, endDate });
      optimized.stockStats = optimized.stockStats.map((stock) => ({
        ...stock,
        riskLevel: getRiskLevelFromVolatility(stock.volatility)
      }));
      setResult(optimized);
      setPortfolioName(`${selectedTickers.join(" · ")} — ${new Date().toLocaleDateString()}`);
    } catch (runError) {
      setError(runError instanceof Error ? runError.message : "Optimization failed.");
    } finally {
      setLoading(false);
    }
  };

  const onSave = async () => {
    if (!user || !result) return;
    setSaving(true);
    setSaveStatus("idle");
    try {
      await savePortfolio(user.uid, {
        name: portfolioName || "My Portfolio",
        tickers: selectedTickers,
        dateRange: { startDate, endDate, preset: "custom" },
        weights: result.weights,
        metrics: result.metrics,
        stockStats: result.stockStats,
        modeAtSave: mode,
        investmentAmount
      });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch {
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  };

  const downloadCsv = () => {
    if (!result) return;
    const rows = [
      ["Ticker", "Expected Return", "Volatility", "Weight", "Individual Sharpe"],
      ...sortedStockStats.map((stock) => {
        const weight = result.weights[stock.ticker] ?? 0;
        const sharpe = stock.volatility > 0 ? stock.expectedReturn / stock.volatility : 0;
        return [stock.ticker, stock.expectedReturn.toString(), stock.volatility.toString(), weight.toString(), sharpe.toString()];
      })
    ];
    const csv = rows.map((line) => line.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "portfolioiq-raw-data.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="space-y-6">
      {/* Step 1 */}
      <div className="v2-card-static space-y-4 p-6">
        <div>
          <p className="step-label">Step 1</p>
          <h2 className="mt-1 font-display text-xl font-semibold text-white">Select Your Stocks</h2>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            className="input !pl-10"
            value={query}
            onChange={(event) => loadSuggestions(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && query.trim()) {
                event.preventDefault();
                addTicker(query);
              }
            }}
            placeholder="Search stocks (e.g. AAPL, MSFT) — press Enter to add directly"
          />
          {searching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
            </div>
          )}
        </div>
        {searchError && (
          <div className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-sm text-amber-400">
            <AlertCircle size={14} /> {searchError}
          </div>
        )}
        {suggestions.length > 0 && (
          <ul className="rounded-card border border-white/[0.06] bg-surface-container overflow-hidden">
            {suggestions.map((item) => (
              <li key={`${item.symbol}-${item.name}`}>
                <button
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-surface-high transition-colors"
                  onClick={() => addTicker(item.symbol)}
                >
                  <span className="font-medium text-white">{item.name}</span>{" "}
                  <span className="text-gray-500">({item.symbol})</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex flex-wrap gap-2">
          {selectedTickers.map((ticker) => (
            <span key={ticker} className="chip">
              {ticker}
              <button className="text-gray-500 hover:text-red-400 transition-colors" onClick={() => setSelectedTickers((prev) => prev.filter((t) => t !== ticker))}>
                ×
              </button>
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-500">{MIN_STOCKS}–{MAX_STOCKS} stocks recommended</p>
      </div>

      {/* Step 2 */}
      <div className="v2-card-static space-y-4 p-6">
        <div>
          <p className="step-label">Step 2</p>
          <h2 className="mt-1 font-display text-xl font-semibold text-white">Choose Time Period</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {DATE_PRESETS.map((preset) => (
            <button
              key={preset.label}
              className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                activePreset === preset.label
                  ? "bg-emerald-500 text-white"
                  : "bg-surface-highest text-gray-400 hover:text-white"
              }`}
              style={{ border: activePreset === preset.label ? "none" : "1px solid rgba(255,255,255,0.06)" }}
              onClick={() => {
                setActivePreset(preset.label);
                setStartDate(startDateFromYears(preset.years));
                setEndDate(yesterdayIsoDate());
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1.5 text-sm text-gray-400">
            <span>From</span>
            <input type="date" className="input" value={startDate} onChange={(e) => { setStartDate(e.target.value); setActivePreset(""); }} />
          </label>
          <label className="space-y-1.5 text-sm text-gray-400">
            <span>To</span>
            <input type="date" className="input" value={endDate} max={yesterdayIsoDate()} onChange={(e) => { setEndDate(e.target.value); setActivePreset(""); }} />
          </label>
        </div>
      </div>

      {/* Optimize button */}
      <button className="btn-primary w-full py-3.5 text-base font-display font-semibold" disabled={!canOptimize || loading} onClick={runOptimization}>
        {loading
          ? mode === "beginner"
            ? "Downloading price history and building your portfolio..."
            : "Computing covariance matrix and maximizing Sharpe..."
          : "Optimize Portfolio"}
      </button>

      {error && (
        <div className="rounded-card border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {result && (
        <>
          {mode === "beginner" && (
            <div className="v2-card-static p-4 text-sm text-gray-400 leading-relaxed">
              This optimizer combines your selected stocks and computes a mix that aims for better return per unit of risk. Switch to <span className="text-emerald-400">Advanced</span> mode to inspect the raw frontier and matrix outputs.
            </div>
          )}

          <PerformanceSummary metrics={result.metrics} investmentAmount={investmentAmount} mode={mode} />

          <div className="grid gap-5 xl:grid-cols-2">
            <PortfolioPieChart weights={result.weights} />
            <PortfolioBarChart stockStats={result.stockStats} />
          </div>

          {mode === "advanced" && (
            <EfficientFrontierChart
              randomPortfolios={result.randomPortfolios}
              frontier={result.frontier}
              portfolioPoint={{ risk: result.metrics.volatility, return: result.metrics.expectedReturn }}
            />
          )}

          {/* Weight summary table */}
          <div className="v2-card-static space-y-4 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-display text-lg font-semibold text-white">Weight Summary</h3>
              <div className="flex gap-2">
                {(["weight", "return", "risk"] as const).map((metric) => (
                  <button
                    key={metric}
                    className={`rounded-full px-3 py-1 text-xs transition-colors ${
                      sortMetric === metric ? "bg-emerald-500/15 text-emerald-400" : "text-gray-500 hover:text-gray-300"
                    }`}
                    onClick={() => setSortMetric(metric)}
                  >
                    {metric.charAt(0).toUpperCase() + metric.slice(1)} ↓
                  </button>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-400">
              <span>Investment</span>
              <input
                className="input max-w-[160px] !py-2 font-mono"
                type="number"
                min={100}
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(Number(e.target.value))}
              />
            </label>
            <div className="overflow-x-auto">
              <table className="v2-table">
                <thead>
                  <tr>
                    <th>Ticker</th>
                    <th>Weight</th>
                    <th>Expected Return</th>
                    <th>Volatility</th>
                    <th>Allocation ($)</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedStockStats.map((stock) => {
                    const weight = result.weights[stock.ticker] ?? 0;
                    return (
                      <tr key={stock.ticker}>
                        <td className="font-sans font-medium text-white">{stock.ticker}</td>
                        <td>{(weight * 100).toFixed(2)}%</td>
                        <td className="text-emerald-400">{(stock.expectedReturn * 100).toFixed(2)}%</td>
                        <td className="text-amber-400">{(stock.volatility * 100).toFixed(2)}%</td>
                        <td>${(weight * investmentAmount).toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-500">
              Diversification: <span className="font-mono text-gray-300">{result.diversificationScore.toFixed(0)}/100</span> ({diversificationVerdict})
            </p>
          </div>

          {/* Advanced raw data */}
          {mode === "advanced" && (
            <div className="v2-card-static space-y-4 p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold text-white">Raw Statistical Data</h3>
                <button className="btn-secondary flex items-center gap-2 !px-3 !py-1.5 text-sm text-indigo-400" onClick={downloadCsv}>
                  <Download size={14} /> Download CSV
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="v2-table">
                  <thead>
                    <tr>
                      <th>Ticker</th>
                      <th>Expected Return</th>
                      <th>Volatility</th>
                      <th>Weight</th>
                      <th>Individual Sharpe</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedStockStats.map((stock) => {
                      const weight = result.weights[stock.ticker] ?? 0;
                      const sharpe = stock.volatility > 0 ? stock.expectedReturn / stock.volatility : 0;
                      return (
                        <tr key={`raw-${stock.ticker}`}>
                          <td className="font-sans font-medium text-white">{stock.ticker}</td>
                          <td>{(stock.expectedReturn * 100).toFixed(2)}%</td>
                          <td>{(stock.volatility * 100).toFixed(2)}%</td>
                          <td>{(weight * 100).toFixed(2)}%</td>
                          <td>{sharpe.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {mode === "beginner" && (
            <div className="v2-card-static p-5 text-sm text-gray-400 leading-relaxed">
              <h3 className="font-display font-semibold text-white">Why this mix?</h3>
              <p className="mt-2">
                The optimizer favors stocks that improve return while lowering total portfolio swings through diversification. Higher-weight stocks contribute more to the final risk-adjusted score.
              </p>
            </div>
          )}

          {/* Save */}
          <div className="v2-card-static space-y-4 p-6">
            <h3 className="font-display text-lg font-semibold text-white">Save Portfolio</h3>
            <input
              className="input"
              maxLength={50}
              value={portfolioName}
              onChange={(e) => setPortfolioName(e.target.value)}
              placeholder="Portfolio name"
            />
            <div className="flex items-center gap-3">
              <button
                className="btn-primary flex items-center gap-2"
                onClick={onSave}
                disabled={!user || saving}
              >
                <Save size={16} />
                {saving ? "Saving..." : "Save Portfolio"}
              </button>
              <button className="btn-secondary flex items-center gap-2 text-sm" onClick={downloadCsv}>
                <Download size={16} /> Download CSV
              </button>
              {saveStatus === "saved" && (
                <span className="text-sm font-medium text-emerald-400">Saved to history!</span>
              )}
              {saveStatus === "error" && (
                <span className="text-sm font-medium text-red-400">Save failed — try again</span>
              )}
            </div>
            {!user && <p className="text-sm text-gray-500">Login to save this portfolio to your history.</p>}
          </div>
        </>
      )}
    </section>
  );
}
