"use client";

import { motion } from "framer-motion";
import { Wallet, BadgeCheck, ScanSearch, Layers, ShieldCheck } from "@/components/ui/icons";
import { SectionIcon } from "@/components/ui/icon-components";
import { formatCurrency } from "@/lib/utils";
import type { PortfolioStats } from "@/types/collection";

export function CollectionDashboard({ stats }: { stats: PortfolioStats }) {
  const items = [
    { label: "Total Items", value: stats.totalItems, icon: Layers },
    { label: "Portfolio Value", value: formatCurrency(stats.totalValue), icon: Wallet },
    { label: "Authentication Rate", value: `${stats.authenticationRatePct}%`, icon: BadgeCheck },
    { label: "Avg. AI Confidence", value: `${stats.averageConfidence}%`, icon: ScanSearch },
    { label: "Portfolio Health", value: `${stats.portfolioHealthScore}/100`, icon: ShieldCheck },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="glass rounded-2xl p-4"
        >
          <SectionIcon icon={item.icon} />
          <p className="mt-2 font-display text-2xl">{item.value}</p>
          <p className="text-xs text-gray-500">{item.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
