"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { Bell, TrendingUp, TrendingDown, Zap, Eye } from "@/components/ui/icons";
import type { MarketAlert, AlertType } from "@/types/market";

interface Props {
  alerts: MarketAlert[];
  onMarkRead?: (alertId: string) => void;
}

const alertIcons: Record<AlertType, typeof Bell> = {
  price_increase: TrendingUp,
  price_drop: TrendingDown,
  authentication_news: Zap,
  wishlist_opportunity: Eye,
  category_trend: TrendingUp,
  portfolio_threshold: Bell,
  confidence_change: Zap,
};

const severityStyles = {
  low: "border-gray-700/50",
  medium: "border-amber-500/20",
  high: "border-red-500/20",
};

export function AlertsPanel({ alerts, onMarkRead }: Props) {
  const unread = alerts.filter((a) => a.status === "unread");

  if (alerts.length === 0) {
    return (
      <div className="glass rounded-xl p-5">
        <h3 className="text-sm font-medium text-gray-400">Alerts</h3>
        <p className="mt-3 text-xs text-gray-500">No alerts.</p>
      </div>
    );
  }

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="glass rounded-xl p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-amber-400" strokeWidth={2} />
          <h3 className="text-sm font-medium text-gray-300">Alerts</h3>
        </div>
        {unread.length > 0 && (
          <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-medium text-primary">
            {unread.length} new
          </span>
        )}
      </div>

      <div className="mt-4 space-y-2">
        {alerts.slice(0, 6).map((alert) => {
          const Icon = alertIcons[alert.type];
          return (
            <div
              key={alert.id}
              className={`rounded-lg border bg-white/[0.02] p-3 ${severityStyles[alert.severity]} ${
                alert.status === "unread" ? "ring-1 ring-primary/10" : ""
              }`}
            >
              <div className="flex items-start gap-2">
                <Icon className="mt-0.5 h-3.5 w-3.5 text-gray-400" strokeWidth={2} />
                <div className="min-w-0 flex-1">
                  <p className={`text-xs font-medium ${alert.status === "unread" ? "text-gray-200" : "text-gray-400"}`}>
                    {alert.title}
                  </p>
                  <p className="mt-0.5 text-[11px] text-gray-500">{alert.description}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="text-[10px] text-gray-600">
                      {formatRelativeTime(alert.createdAt)}
                    </span>
                    {alert.status === "unread" && onMarkRead && (
                      <button
                        onClick={() => onMarkRead(alert.id)}
                        className="text-[10px] text-primary hover:text-primary/80"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

function formatRelativeTime(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}
