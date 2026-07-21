"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceDot } from "recharts";
import type { DNAEvolutionEntry } from "@/services/dnaEvolution";

export function DNAEvolutionChart({ entries }: { entries: DNAEvolutionEntry[] }) {
  if (entries.length < 2) {
    return (
      <p className="text-sm text-gray-500">
        DNA Evolution chart appears after two or more snapshots have been recorded.
      </p>
    );
  }

  const data = entries.map((e) => ({
    date: new Date(e.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    score: e.dnaScore,
    trigger: e.trigger,
    type: e.primaryType,
  }));

  const milestones = entries
    .filter((e, i) => i > 0 && (e.delta ?? 0) >= 5)
    .map((e) => ({
      date: new Date(e.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      score: e.dnaScore,
    }));

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="dnaEvGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6D5DFB" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#6D5DFB" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#71717A" }} />
          <YAxis domain={[0, 100]} hide />
          <Tooltip
            contentStyle={{
              background: "#111113",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              fontSize: 12,
            }}
            formatter={(value: number, _name: string, props: any) => [
              `${value} · ${props.payload?.type ?? ""}`,
              "DNA Score",
            ]}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#6D5DFB"
            fill="url(#dnaEvGrad)"
            strokeWidth={2}
            dot={false}
          />
          {milestones.map((m, i) => (
            <ReferenceDot key={i} x={m.date} y={m.score} r={4} fill="#00D4FF" stroke="none" />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
