"use client";

import { useEffect, useMemo, useState } from "react";
import { Trash2, Edit3, BarChart3 } from "lucide-react";
import { listPortfolios, removePortfolio, renamePortfolio } from "@/lib/firestore/portfolios";
import { useAuth } from "@/hooks/useAuth";
import type { SavedPortfolio } from "@/lib/types";

type FilterOption = "all" | "strong" | "moderate" | "weak";
type Verdict = "strong" | "moderate" | "weak";

function scoreBucket(sharpe: number): Verdict {
  if (sharpe > 1.0) return "strong";
  if (sharpe >= 0.6) return "moderate";
  return "weak";
}

function verdictBadge(sharpe: number) {
  const bucket = scoreBucket(sharpe);
  const classes = {
    strong: "badge badge-strong",
    moderate: "badge badge-moderate",
    weak: "badge badge-weak"
  };
  const labels = { strong: "Strong", moderate: "Moderate", weak: "Weak" };
  return <span className={classes[bucket]}>{labels[bucket]}</span>;
}

function verdictBorder(sharpe: number) {
  const bucket = scoreBucket(sharpe);
  if (bucket === "strong") return "border-l-emerald-500";
  if (bucket === "moderate") return "border-l-amber-500";
  return "border-l-red-500";
}

export function HistoryWorkspace() {
  const { user } = useAuth();
  const [items, setItems] = useState<SavedPortfolio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterOption>("all");
  const [sort, setSort] = useState<"date-desc" | "date-asc" | "sharpe-desc" | "return-desc">("date-desc");
  const [compareMode, setCompareMode] = useState(false);
  const [selectedCompare, setSelectedCompare] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    listPortfolios(user.uid)
      .then((records) => setItems(records))
      .catch(() => setError("Unable to load history right now."))
      .finally(() => setLoading(false));
  }, [user]);

  const visibleItems = useMemo(() => {
    let filtered = items;
    if (filter !== "all") filtered = items.filter((item) => scoreBucket(item.metrics.sharpe) === filter);
    const sorted = [...filtered];
    if (sort === "date-desc") sorted.sort((a, b) => (b.createdAt ? new Date(b.createdAt).getTime() : 0) - (a.createdAt ? new Date(a.createdAt).getTime() : 0));
    if (sort === "date-asc") sorted.sort((a, b) => (a.createdAt ? new Date(a.createdAt).getTime() : 0) - (b.createdAt ? new Date(b.createdAt).getTime() : 0));
    if (sort === "sharpe-desc") sorted.sort((a, b) => b.metrics.sharpe - a.metrics.sharpe);
    if (sort === "return-desc") sorted.sort((a, b) => b.metrics.expectedReturn - a.metrics.expectedReturn);
    return sorted;
  }, [items, filter, sort]);

  const onDelete = async (portfolioId?: string) => {
    if (!user || !portfolioId) return;
    await removePortfolio(user.uid, portfolioId);
    setItems((prev) => prev.filter((item) => item.id !== portfolioId));
  };

  const onRename = async (portfolioId?: string, currentName?: string) => {
    if (!user || !portfolioId || !currentName) return;
    const next = prompt("Rename portfolio", currentName);
    if (!next) return;
    await renamePortfolio(user.uid, portfolioId, next);
    setItems((prev) => prev.map((item) => (item.id === portfolioId ? { ...item, name: next } : item)));
  };

  if (!user) {
    return <p className="text-gray-400">Please login to view your portfolio history.</p>;
  }

  const filters: { value: FilterOption; label: string }[] = [
    { value: "all", label: "All" },
    { value: "strong", label: "Strong" },
    { value: "moderate", label: "Moderate" },
    { value: "weak", label: "Weak" }
  ];

  return (
    <section className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          className="input max-w-[180px] !py-2 text-sm"
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
        >
          <option value="date-desc">Sort by: Date ↓</option>
          <option value="date-asc">Sort by: Date ↑</option>
          <option value="sharpe-desc">Sort by: Sharpe ↓</option>
          <option value="return-desc">Sort by: Return ↓</option>
        </select>

        <div className="flex gap-1">
          {filters.map((f) => (
            <button
              key={f.value}
              className={`rounded-full px-3 py-1 text-xs transition-colors ${
                filter === f.value ? "bg-emerald-500 text-white" : "text-gray-500 hover:text-gray-300"
              }`}
              style={{ border: filter === f.value ? "none" : "1px solid rgba(255,255,255,0.06)" }}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <button
          className={`btn-secondary !px-3 !py-1.5 text-xs ${compareMode ? "!border-emerald-500 text-emerald-400" : ""}`}
          onClick={() => { setCompareMode((prev) => !prev); setSelectedCompare([]); }}
        >
          {compareMode ? "Exit Compare" : "Compare"}
        </button>
      </div>

      {loading && <p className="text-gray-500">Loading history...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {/* Empty state */}
      {!loading && visibleItems.length === 0 && (
        <div className="v2-card-static flex flex-col items-center gap-3 p-10 text-center">
          <BarChart3 className="h-10 w-10 text-gray-600" />
          <p className="font-display text-lg font-semibold text-gray-300">No portfolios saved yet</p>
          <p className="text-sm text-gray-500">Run your first optimization to see results here</p>
        </div>
      )}

      {/* Portfolio cards */}
      <div className="space-y-3">
        {visibleItems.map((item) => {
          const isChecked = selectedCompare.includes(item.id ?? "");
          return (
            <article
              key={item.id}
              className={`v2-card-static flex flex-col gap-4 border-l-[3px] p-5 md:flex-row md:items-center md:justify-between ${verdictBorder(item.metrics.sharpe)}`}
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  {compareMode && (
                    <input
                      type="checkbox"
                      checked={isChecked}
                      className="accent-emerald-500"
                      onChange={(e) => {
                        const id = item.id ?? "";
                        if (!id) return;
                        if (e.target.checked) setSelectedCompare((prev) => (prev.length >= 2 ? prev : [...prev, id]));
                        else setSelectedCompare((prev) => prev.filter((entry) => entry !== id));
                      }}
                    />
                  )}
                  <h3 className="font-display font-semibold text-white">{item.name}</h3>
                </div>
                <p className="text-xs text-gray-500">
                  {item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {item.tickers.map((t) => (
                    <span key={t} className="chip !py-0 !text-xs">{t}</span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 font-mono text-sm tabular-nums">
                <span className="text-emerald-400">{(item.metrics.expectedReturn * 100).toFixed(2)}%</span>
                <span className="text-gray-500">|</span>
                <span className="text-gray-400">{(item.metrics.volatility * 100).toFixed(2)}%</span>
                <span className="text-gray-500">|</span>
                <span className="text-emerald-400">{item.metrics.sharpe.toFixed(2)}</span>
              </div>

              <div className="flex items-center gap-2">
                {verdictBadge(item.metrics.sharpe)}
                <button className="btn-ghost text-emerald-400" onClick={() => onRename(item.id, item.name)}>
                  <Edit3 size={14} />
                </button>
                <button className="btn-ghost text-red-400" onClick={() => onDelete(item.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Compare result */}
      {compareMode && selectedCompare.length === 2 && (
        <div className="v2-card-static p-5">
          <h3 className="font-display text-lg font-semibold text-white">Comparison</h3>
          {(() => {
            const [first, second] = selectedCompare.map((id) => items.find((item) => item.id === id)).filter(Boolean) as SavedPortfolio[];
            if (!first || !second) return null;
            const winner = first.metrics.sharpe >= second.metrics.sharpe ? first.name : second.name;
            return (
              <p className="mt-2 text-gray-400">
                <span className="font-medium text-emerald-400">{winner}</span> has the stronger risk-adjusted profile (higher Sharpe ratio).
              </p>
            );
          })()}
        </div>
      )}
    </section>
  );
}
