"use client";

import { useState } from "react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { TraitExplanation } from "@/services/dnaExplainability";

const TRAIT_LABELS: Record<string, string> = {
  knowledge: "Knowledge",
  research: "Research",
  diversification: "Diversification",
  discipline: "Discipline",
  consistency: "Consistency",
  longTermVision: "Vision",
  riskManagement: "Risk Mgmt",
  authentication: "Auth",
  marketAwareness: "Market",
  collectionQuality: "Quality",
  portfolioBalance: "Balance",
};

export function DNAWheelInteractive({ traits }: { traits: TraitExplanation[] }) {
  const [hovered, setHovered] = useState<TraitExplanation | null>(null);

  const data = traits.map((t) => ({
    axis: TRAIT_LABELS[t.trait] ?? t.trait,
    score: t.score,
    previous: t.previousScore ?? t.score,
    raw: t,
  }));

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      <div className="h-80 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <defs>
              <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#6D5DFB" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#00D4FF" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <PolarGrid stroke="rgba(255,255,255,0.05)" />
            {/* ✅ FIX: Replaced `e: any` with a specific interface */}
            <PolarAngleAxis
              dataKey="axis"
              tick={{ fill: "#71717A", fontSize: 10 }}
              onClick={(e: { value?: string }) => {
                const found = data.find((d) => d.axis === e.value);
                if (found) setHovered(found.raw);
              }}
            />
            <Radar
              name="Previous"
              dataKey="previous"
              stroke="rgba(255,255,255,0.15)"
              fill="transparent"
              strokeDasharray="4 4"
              dot={false}
            />
            <Radar
              name="Current"
              dataKey="score"
              stroke="#6D5DFB"
              fill="url(#radarFill)"
              strokeWidth={2}
              dot={{ fill: "#6D5DFB", r: 3 }}
            />
            <Tooltip
              contentStyle={{
                background: "#111113",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="w-full lg:w-64">
        {hovered ? (
          <div className="glass rounded-2xl p-4 space-y-3">
            <p className="font-medium capitalize">
              {TRAIT_LABELS[hovered.trait] ?? hovered.trait}
            </p>
            <div className="flex items-end gap-2">
              <p className="font-display text-3xl text-gradient">{hovered.score}</p>
              {hovered.previousScore !== null && (
                <p
                  className={`mb-1 text-xs ${
                    hovered.trend === "up"
                      ? "text-success"
                      : hovered.trend === "down"
                        ? "text-red-400"
                        : "text-gray-500"
                  }`}
                >
                  {hovered.trend === "up" ? "+" : hovered.trend === "down" ? "-" : "~"}
                  {Math.abs(hovered.score - (hovered.previousScore ?? hovered.score))}
                </p>
              )}
            </div>
            <p className="text-xs text-gray-400">{hovered.explanation}</p>
            {hovered.topMemories.length > 0 && (
              <div>
                <p className="mb-1 text-[11px] text-gray-500">Memory influence</p>
                <ul className="space-y-0.5">
                  {hovered.topMemories.map((m) => (
                    <li key={m} className="text-[11px] text-gray-400">
                      · {m}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p className="text-[11px] text-gray-600">{hovered.evidenceCount} evidence signals</p>
          </div>
        ) : (
          <div className="glass rounded-2xl p-4">
            <p className="text-sm text-gray-500">
              Click any axis on the radar chart to see the evidence and reasoning behind that trait
              score.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}