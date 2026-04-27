"use client";

import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#10b981", "#6366f1", "#f59e0b", "#06b6d4", "#8b5cf6", "#ec4899", "#14b8a6"];

export function PortfolioPieChart({ weights }: { weights: Record<string, number> }) {
  const data = Object.entries(weights).map(([ticker, weight]) => ({
    name: ticker,
    value: Number((weight * 100).toFixed(2))
  }));

  if (data.length === 0) return null;

  return (
    <div className="v2-card-static h-[360px] p-5">
      <h3 className="mb-3 font-display text-lg font-semibold text-white">Portfolio Allocation</h3>
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="48%"
            outerRadius={95}
            label={(entry) => `${entry.name} ${entry.value}%`}
            dataKey="value"
            stroke="rgba(0,0,0,0.3)"
            strokeWidth={2}
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "#1f1f1f",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "12px",
              color: "#e5e7eb"
            }}
          />
          <Legend wrapperStyle={{ color: "#9ca3af", fontSize: "12px" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
