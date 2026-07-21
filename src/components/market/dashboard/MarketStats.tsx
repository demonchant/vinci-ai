"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Activity, Target, Bell, Eye, Layers } from "@/components/ui/icons";
import type { PortfolioValuation } from "@/types/market";
import { fadeUp, staggerContainer } from "@/lib/motion";

interface Props {
  valuation: PortfolioValuation;
}

export function MarketStats({ valuation }: Props) {
  const metrics = [
    {
      label: "Portfolio Value",
      value: `$${valuation.totalEstimatedValue.toLocaleString()}`,
      icon: Layers,
      accent: "text-primary",
    },
    {
      label: "Today",
      value: formatChange(valuation.todayChange),
      icon: valuation.todayChange >= 0 ? TrendingUp : TrendingDown,
      accent: valuation.todayChange >= 0 ? "text-emerald-400" : "text-red-400",
    },
    {
      label: "This Week",
      value: formatChange(valuation.weeklyChange),
      icon: Activity,
      accent: valuation.weeklyChange >= 0 ? "text-emerald-400" : "text-red-400",
    },
    {
      label: "This Month",
      value: formatChange(valuation.monthlyChange),
      icon: Activity,
      accent: valuation.monthlyChange >= 0 ? "text-emerald-400" : "text-red-400",
    },
    {
      label: "Lifetime Gain/Loss",
      value: `${valuation.totalGainLossPct >= 0 ? "+" : ""}${valuation.totalGainLossPct.toFixed(1)}%`,
      icon: Target,
      accent: valuation.totalGainLossPct >= 0 ? "text-emerald-400" : "text-red-400",
    },
    {
      label: "Confidence",
      value: `${Math.round(valuation.averageConfidence * 100)}%`,
      icon: Eye,
      accent: "text-cyan-400",
    },
    {
      label: "Market Coverage",
      value: `${Math.round(valuation.marketCoverage * 100)}%`,
      icon: Activity,
      accent: "text-violet-400",
    },
    {
      label: "Active Alerts",
      value: valuation.activeAlerts.toString(),
      icon: Bell,
      accent: valuation.activeAlerts > 0 ? "text-amber-400" : "text-gray-400",
    },
  ];

  return (
    <motion.div
      variants={staggerContainer(0.05)}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 gap-3 sm:grid-cols-4"
    >
      {metrics.map((m) => (
        <motion.div
          key={m.label}
          variants={fadeUp}
          className="glass rounded-xl p-4"
        >
          <div className="flex items-center gap-2">
            <m.icon className={`h-4 w-4 ${m.accent}`} strokeWidth={2} />
            <span className="text-xs font-medium text-gray-500">{m.label}</span>
          </div>
          <p className={`mt-2 text-lg font-semibold ${m.accent}`}>{m.value}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

function formatChange(value: number): string {
  const prefix = value >= 0 ? "+$" : "-$";
  return `${prefix}${Math.abs(value).toLocaleString()}`;
}
