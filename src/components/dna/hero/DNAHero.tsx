"use client";

import { motion } from "framer-motion";
import { Fingerprint, Crown, Activity } from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";
import type { CollectorDNA } from "@/types/dna";
import type { DNAStability } from "@/services/dnaAnalytics";

function DNAOrb({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 52;
  const dashoffset = circumference * (1 - score / 100);

  return (
    <div className="relative flex h-32 w-32 shrink-0 items-center justify-center">
      <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full -rotate-90">
        <defs>
          <linearGradient id="dnaGrad" x1="0%" y1="0%" x2="100%" y2="0%">
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
          stroke="url(#dnaGrad)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashoffset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="z-10 text-center">
        <motion.p
          className="font-display text-3xl text-gradient"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          {score}
        </motion.p>
        <p className="text-[10px] uppercase tracking-widest text-gray-500">score</p>
      </div>
    </div>
  );
}

export function DNAHero({
  dna,
  userName,
  stability,
  daysActive,
}: {
  dna: CollectorDNA;
  userName: string;
  stability: DNAStability;
  daysActive: number;
}) {
  const level = Math.floor(dna.dnaScore / 10) + 1;

  return (
    <div className="glass-strong overflow-hidden rounded-3xl p-6">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <DNAOrb score={dna.dnaScore} />

        <div className="flex-1 space-y-3 text-center sm:text-left">
          <div>
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <h1 className="font-display text-2xl">{userName}</h1>
              {dna.dnaScore >= 80 && <Icon icon={Crown} size="card" className="text-accent" />}
            </div>
            <p className="text-sm text-gray-400">
              Level {level} Collector · {dna.primaryType}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
            <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary">
              {dna.primaryType}
            </span>
            {dna.secondaryType && (
              <span className="rounded-full bg-secondary/20 px-3 py-1 text-xs font-medium text-secondary">
                {dna.secondaryType}
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { label: "DNA Score", value: dna.dnaScore, icon: Fingerprint },
              { label: "Stability", value: `${stability.score}%`, icon: Activity },
              { label: "Days Active", value: daysActive, icon: Crown },
            ].map(({ label, value, icon: Ic }) => (
              <div key={label} className="glass rounded-xl p-2.5">
                <Icon icon={Ic} size="button" className="mx-auto text-gray-500" decorative />
                <p className="mt-1 font-display text-xl">{value}</p>
                <p className="text-[10px] text-gray-500">{label}</p>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-500">{stability.explanation}</p>
        </div>
      </div>
    </div>
  );
}
