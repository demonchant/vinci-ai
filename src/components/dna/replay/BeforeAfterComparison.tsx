"use client";

import { motion } from "framer-motion";
import { Columns } from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";
import type { ReplayFrame } from "@/types/replay";

const TRAIT_KEYS = [
  "knowledge",
  "research",
  "authentication",
  "diversification",
  "marketAwareness",
  "longTermVision",
];
const LABELS: Record<string, string> = {
  knowledge: "Knowledge",
  research: "Research",
  authentication: "Auth Awareness",
  diversification: "Diversification",
  marketAwareness: "Market",
  longTermVision: "Vision",
};

function SnapshotMeta({ frame, label }: { frame: ReplayFrame; label: string }) {
  return (
    <div className="rounded-xl bg-white/[0.03] p-3 text-center">
      <p className="text-[10px] uppercase tracking-wide text-gray-600">{label}</p>
      <p className="mt-1 font-display text-2xl">{frame.dnaScore}</p>
      <p className="text-[11px] text-gray-500">{frame.primaryType}</p>
      <p className="text-[10px] text-gray-600">{new Date(frame.createdAt).toLocaleDateString()}</p>
    </div>
  );
}

export function BeforeAfterComparison({
  frameA,
  frameB,
}: {
  frameA: ReplayFrame;
  frameB: ReplayFrame;
}) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="mb-4 flex items-center gap-2">
        <Icon icon={Columns} size="button" className="text-gray-500" decorative />
        <p className="text-xs font-medium text-gray-300">Before / After</p>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <SnapshotMeta frame={frameA} label="Before" />
        <SnapshotMeta frame={frameB} label="After" />
      </div>

      <div className="space-y-2">
        {TRAIT_KEYS.map((key) => {
          const before = Math.round(frameA.scores[key] ?? 50);
          const after = Math.round(frameB.scores[key] ?? 50);
          const delta = after - before;
          return (
            <div key={key}>
              <div className="mb-0.5 flex items-center justify-between text-[11px] text-gray-500">
                <span>{LABELS[key] ?? key}</span>
                <span
                  className={
                    delta > 0 ? "text-success" : delta < 0 ? "text-red-400" : "text-gray-600"
                  }
                >
                  {delta > 0 ? "+" : ""}
                  {delta}
                </span>
              </div>
              <div className="relative h-1.5 overflow-hidden rounded-full bg-white/5">
                <div
                  className="absolute h-full rounded-full bg-white/10"
                  style={{ width: `${before}%` }}
                />
                <motion.div
                  className="absolute h-full rounded-full bg-gradient-to-r from-primary to-accent"
                  initial={{ width: `${before}%` }}
                  animate={{ width: `${after}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
