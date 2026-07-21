"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { LineChart as LineChartIcon } from "@/components/ui/icons";
import type { MarketDataPoint } from "@/types/market";

interface Props {
  history: MarketDataPoint[];
  title?: string;
  height?: number;
}

export function PriceChart({ history, title, height = 160 }: Props) {
  if (history.length < 2) {
    return (
      <div className="glass rounded-xl p-5">
        <h3 className="text-sm font-medium text-gray-400">{title ?? "Price History"}</h3>
        <p className="mt-3 text-xs text-gray-500">Insufficient price history data.</p>
      </div>
    );
  }

  const values = history.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const width = 100;
  const points = history.map((p, i) => {
    const x = (i / (history.length - 1)) * width;
    const y = height - ((p.value - min) / range) * (height - 20) - 10;
    return `${x},${y}`;
  });

  const polyline = points.join(" ");
  const areaPoints = `0,${height} ${polyline} ${width},${height}`;

  const firstValue = values[0] ?? 0;
  const lastValue = values[values.length - 1] ?? 0;
  const change = lastValue - firstValue;
  const changePct = firstValue > 0 ? (change / firstValue) * 100 : 0;
  const isPositive = change >= 0;

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="glass rounded-xl p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LineChartIcon className="h-4 w-4 text-gray-400" strokeWidth={2} />
          <h3 className="text-sm font-medium text-gray-300">{title ?? "Price History"}</h3>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-200">${lastValue.toLocaleString()}</p>
          <p className={`text-[10px] font-medium ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
            {isPositive ? "+" : ""}{changePct.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="mt-3">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full"
          style={{ height }}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity="0.3" />
              <stop offset="100%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points={areaPoints} fill="url(#chartGradient)" />
          <polyline
            points={polyline}
            fill="none"
            stroke={isPositive ? "#22c55e" : "#ef4444"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="mt-2 flex justify-between text-[10px] text-gray-600">
        <span>{new Date(history[0]!.date).toLocaleDateString()}</span>
        <span>High: ${max.toLocaleString()} / Low: ${min.toLocaleString()}</span>
        <span>{new Date(history[history.length - 1]!.date).toLocaleDateString()}</span>
      </div>
    </motion.div>
  );
}
