"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
} from "recharts";
import { COLLECTIBLE_CATEGORY_LABELS } from "@/types/common";
import type { PortfolioStats } from "@/types/collection";

const COLORS = ["#6D5DFB", "#7C3AED", "#00D4FF", "#22C55E", "#F59E0B", "#EC4899", "#71717A"];

export function PortfolioAnalyticsCharts({ stats }: { stats: PortfolioStats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="glass rounded-2xl p-4">
        <p className="mb-2 text-xs font-medium text-gray-500">Category Distribution</p>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats.categoryDistribution}
                dataKey="count"
                nameKey="category"
                innerRadius={35}
                outerRadius={60}
              >
                {stats.categoryDistribution.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [
                  value,
                  COLLECTIBLE_CATEGORY_LABELS[name as keyof typeof COLLECTIBLE_CATEGORY_LABELS] ?? name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass rounded-2xl p-4">
        <p className="mb-2 text-xs font-medium text-gray-500">Growth</p>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.growth}>
              <defs>
                <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6D5DFB" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#6D5DFB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="period" hide />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#6D5DFB"
                fill="url(#growthGrad)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass rounded-2xl p-4">
        <p className="mb-2 text-xs font-medium text-gray-500">Value Distribution</p>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.valueDistribution}>
              <XAxis dataKey="bucket" tick={{ fontSize: 9, fill: "#71717A" }} />
              <Tooltip />
              <Bar dataKey="count" fill="#00D4FF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
