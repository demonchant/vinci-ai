"use client";

import { motion } from "framer-motion";
import { DNAThread } from "@/components/marketing/DNAThread";
import { formatCurrency } from "@/lib/utils";
import type { LegacyCoverData } from "@/types/legacy";

function LegacyOrb({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 64;
  return (
    <div className="relative flex h-44 w-44 items-center justify-center">
      <div
        className="absolute inset-0 rounded-full"
        style={{ boxShadow: `0 0 ${score * 0.8}px ${score * 0.2}px rgba(109,93,251,0.3)` }}
      />
      <svg viewBox="0 0 144 144" className="absolute inset-0 h-full w-full -rotate-90">
        <defs>
          <linearGradient id="legacyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6D5DFB" />
            <stop offset="100%" stopColor="#00D4FF" />
          </linearGradient>
        </defs>
        <circle cx="72" cy="72" r="64" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
        <motion.circle
          cx="72" cy="72" r="64" fill="none" stroke="url(#legacyGrad)" strokeWidth="8"
          strokeLinecap="round" strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - score / 100) }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="z-10 text-center">
        <motion.p
          className="font-display text-5xl text-gradient"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          {score}
        </motion.p>
        <p className="text-[10px] uppercase tracking-widest text-gray-500">legacy score</p>
      </div>
    </div>
  );
}

export function LegacyCover({ cover, legacyScore }: { cover: LegacyCoverData; legacyScore: number }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A0A0F] to-[#111118]">
      <DNAThread variant="spine" className="pointer-events-none absolute left-6 top-0 bottom-0 w-8 opacity-20" />
      <div className="h-1 w-full bg-gradient-to-r from-primary via-secondary to-accent" />

      <div className="flex flex-col items-center gap-8 px-12 py-16 text-center">
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xs font-medium uppercase tracking-[0.3em] text-gray-500"
        >
          AI Collector Legacy Report™
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h1 className="font-display text-5xl">{cover.collectorName}</h1>
          <p className="mt-2 text-sm text-gray-400">
            Collector since {new Date(cover.collectorSince).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
        </motion.div>

        <LegacyOrb score={legacyScore} />

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-2">
          <p className="font-display text-2xl text-gradient">{cover.primaryArchetype}</p>
          <p className="text-sm text-gray-400">Level {Math.floor(cover.dnaScore / 10) + 1} Collector</p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="grid grid-cols-3 gap-8">
          <div><p className="font-display text-3xl">{cover.dnaScore}</p><p className="text-xs text-gray-500">Collector DNA</p></div>
          <div><p className="font-display text-3xl">{cover.collectionSize}</p><p className="text-xs text-gray-500">Collectibles</p></div>
          <div>
            <p className="font-display text-3xl">{cover.portfolioValue ? formatCurrency(cover.portfolioValue) : "—"}</p>
            <p className="text-xs text-gray-500">Portfolio Value</p>
          </div>
        </motion.div>

        <p className="text-[11px] text-gray-600">
          Generated {new Date(cover.generatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>
      </div>
    </div>
  );
}
