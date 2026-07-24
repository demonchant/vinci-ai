"use client";

import Link from "next/link";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { BentoCard, CardEyebrow } from "./BentoCard";
import { History } from "@/components/ui/icons";
import { SectionIcon } from "@/components/ui/icon-components";
import { ARCHETYPE_LABELS, type CollectorArchetype } from "@/types/dna";

export function DNAEvolutionCard({
  snapshots,
  projected,
}: {
  snapshots: { dnaScore: number; primaryType: CollectorArchetype }[];
  projected: CollectorArchetype;
}) {
  const data = snapshots.map((s, i) => ({ i, score: s.dnaScore }));
  const past = snapshots[0];
  const current = snapshots[snapshots.length - 1];

  return (
    <BentoCard span="lg:col-span-1">
      <div className="flex items-center gap-2">
        <SectionIcon icon={History} />
        <CardEyebrow>DNA Evolution</CardEyebrow>
      </div>

      <div className="mt-3 h-16 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="dnaEvoGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6D5DFB" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#6D5DFB" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="score"
              stroke="#6D5DFB"
              strokeWidth={2}
              fill="url(#dnaEvoGradient)"
              isAnimationActive
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 grid grid-cols-3 text-center text-xs">
        <div>
          <p className="text-gray-500">Past</p>
          <p className="text-gray-300">{past ? ARCHETYPE_LABELS[past.primaryType] : "—"}</p>
        </div>
        <div>
          <p className="text-gray-500">Current</p>
          <p className="text-gray-200">{current ? ARCHETYPE_LABELS[current.primaryType] : "—"}</p>
        </div>
        <div>
          <p className="text-gray-500">Projected</p>
          <p className="text-accent">{ARCHETYPE_LABELS[projected]}</p>
        </div>
      </div>

      <Link href="/dna/replay" className="mt-4 inline-block text-xs text-accent hover:underline">
        Open Replay →
      </Link>
    </BentoCard>
  );
}