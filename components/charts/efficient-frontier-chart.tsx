"use client";

import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ZAxis
} from "recharts";
import type { FrontierPoint } from "@/lib/types";

interface EfficientFrontierProps {
  randomPortfolios: FrontierPoint[];
  frontier: FrontierPoint[];
  portfolioPoint: FrontierPoint;
}

function pctLabel(v: number) {
  return `${(v * 100).toFixed(1)}%`;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: FrontierPoint }> }) {
  if (!active || !payload?.[0]) return null;
  const pt = payload[0].payload;
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#1a211d] px-4 py-3 text-sm shadow-xl">
      <p className="text-gray-400">
        Risk: <span className="font-mono text-white">{(pt.risk * 100).toFixed(2)}%</span>
      </p>
      <p className="text-gray-400">
        Return: <span className="font-mono text-emerald-400">{(pt.return * 100).toFixed(2)}%</span>
      </p>
      {pt.sharpe != null && (
        <p className="text-gray-400">
          Sharpe: <span className="font-mono text-amber-400">{pt.sharpe.toFixed(2)}</span>
        </p>
      )}
    </div>
  );
}

export function EfficientFrontierChart({
  randomPortfolios,
  frontier,
  portfolioPoint
}: EfficientFrontierProps) {
  return (
    <div className="v2-card-static p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-white">Efficient Frontier</h3>
        <p className="text-xs text-gray-500">500 random portfolios vs. optimal curve</p>
      </div>
      <div className="h-[450px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 20, bottom: 40, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="risk"
              name="Risk"
              type="number"
              tickFormatter={pctLabel}
              tick={{ fill: "#6b7280", fontSize: 11 }}
              label={{
                value: "Volatility (Risk)",
                position: "bottom",
                offset: 20,
                fill: "#9ca3af",
                fontSize: 12
              }}
            />
            <YAxis
              dataKey="return"
              name="Return"
              type="number"
              tickFormatter={pctLabel}
              tick={{ fill: "#6b7280", fontSize: 11 }}
              label={{
                value: "Expected Return",
                angle: -90,
                position: "insideLeft",
                offset: -5,
                fill: "#9ca3af",
                fontSize: 12
              }}
            />
            <ZAxis range={[20, 20]} />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "rgba(255,255,255,0.1)", strokeDasharray: "4 4" }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ color: "#9ca3af", fontSize: "11px", paddingBottom: "8px" }}
            />
            <Scatter
              name="Random Portfolios"
              data={randomPortfolios}
              fill="rgba(99,102,241,0.15)"
              stroke="rgba(99,102,241,0.25)"
              strokeWidth={0.5}
            />
            <Scatter
              name="Efficient Frontier"
              data={frontier}
              fill="#10b981"
              stroke="#10b981"
              strokeWidth={1}
              r={4}
              shape="circle"
            />
            <Scatter
              name="Your Portfolio"
              data={[portfolioPoint]}
              fill="#f59e0b"
              stroke="#ffffff"
              strokeWidth={2}
              r={7}
              shape="diamond"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
