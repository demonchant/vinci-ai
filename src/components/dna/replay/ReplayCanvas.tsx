"use client";

import { motion, AnimatePresence } from "framer-motion";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import type { ReplayFrame } from "@/types/replay";

const TRAIT_LABELS: Record<string, string> = {
  knowledge: "Knowledge",
  research: "Research",
  diversification: "Divers.",
  discipline: "Discipline",
  consistency: "Consist.",
  longTermVision: "Vision",
  authentication: "Auth",
  marketAwareness: "Market",
};

function ReplayOrb({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 52;
  return (
    <div className="relative flex h-40 w-40 items-center justify-center">
      <div
        className="absolute inset-0 rounded-full"
        style={{
          boxShadow: `0 0 ${score * 0.6}px ${score * 0.15}px rgba(109,93,251,${0.2 + score / 500})`,
          transition: "box-shadow 0.5s ease",
        }}
      />
      <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full -rotate-90">
        <defs>
          <linearGradient id="replayGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6D5DFB" />
            <stop offset="100%" stopColor="#00D4FF" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
        <motion.circle
          cx="60"
          cy="60"
          r="52"
          fill="none"
          stroke="url(#replayGrad)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: circumference * (1 - score / 100) }}
          transition={{ duration: 0.5 }}
        />
      </svg>
      <div className="z-10 text-center">
        <motion.p
          key={score}
          className="font-display text-4xl text-gradient"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {score}
        </motion.p>
        <p className="text-[10px] uppercase tracking-widest text-gray-500">score</p>
      </div>
    </div>
  );
}

export function ReplayCanvas({ frame }: { frame: ReplayFrame | null }) {
  if (!frame) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-gray-600">
        No frames to display.
      </div>
    );
  }

  const radarData = Object.entries(frame.scores)
    .filter(([k]) => k !== "dnaScore" && k !== "primaryType")
    .map(([key, value]) => ({
      axis: TRAIT_LABELS[key] ?? key,
      score: Math.round(value),
    }));

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={frame.primaryType}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className="text-center"
        >
          <p className="text-xs uppercase tracking-widest text-gray-500">Primary Archetype</p>
          <p className="mt-1 font-display text-xl text-gradient">{frame.primaryType}</p>
        </motion.div>
      </AnimatePresence>

      <ReplayOrb score={frame.dnaScore} />

      <div className="text-center">
        <p className="text-sm text-gray-300">
          {new Date(frame.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <p className="text-xs text-gray-500">{frame.trigger}</p>
        {frame.delta !== null && frame.delta !== 0 && (
          <motion.p
            key={`delta-${frame.index}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-1 text-xs font-medium ${frame.delta > 0 ? "text-success" : "text-red-400"}`}
          >
            {frame.delta > 0 ? "+" : ""}
            {frame.delta} points
          </motion.p>
        )}
      </div>

      {radarData.length > 0 && (
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <defs>
                <linearGradient id="replayRadarFill" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#6D5DFB" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#00D4FF" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <PolarGrid stroke="rgba(255,255,255,0.05)" />
              <PolarAngleAxis dataKey="axis" tick={{ fill: "#71717A", fontSize: 9 }} />
              <Radar
                name="Score"
                dataKey="score"
                stroke="#6D5DFB"
                fill="url(#replayRadarFill)"
                strokeWidth={2}
                dot={false}
                animationDuration={400}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid w-full grid-cols-4 gap-2">
        {[
          { label: "Conversations", value: frame.conversationCount },
          { label: "Memories", value: frame.memoryCount },
          { label: "Collection", value: frame.collectionSize },
          { label: "Checkpoints", value: frame.checkpointCount },
        ].map(({ label, value }) => (
          <div key={label} className="glass rounded-xl py-2 text-center">
            <motion.p
              key={`${label}-${value}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-display text-lg"
            >
              {value}
            </motion.p>
            <p className="text-[10px] text-gray-600">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
