"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";
import type { StockStat } from "@/lib/types";

export function PortfolioBarChart({ stockStats }: { stockStats: StockStat[] }) {
  const data = stockStats.map((stock) => ({
    name: stock.ticker,
    expectedReturn: Number((stock.expectedReturn * 100).toFixed(2)),
    volatility: Number((stock.volatility * 100).toFixed(2))
  }));

  if (data.length === 0) return null;

  return (
    <div className="v2-card-static h-[360px] p-5">
      <h3 className="mb-3 font-display text-lg font-semibold text-white">Risk vs Return</h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 12 }} />
          <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              background: "#1f1f1f",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "12px",
              color: "#e5e7eb"
            }}
          />
          <Legend wrapperStyle={{ color: "#9ca3af", fontSize: "12px" }} />
          <Bar dataKey="expectedReturn" fill="#10b981" name="Expected Return %" radius={[4, 4, 0, 0]} />
          <Bar dataKey="volatility" fill="#3b3b3b" name="Volatility %" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
