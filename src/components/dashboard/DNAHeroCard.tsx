"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { BentoCard, CardEyebrow } from "./BentoCard";
import { ARCHETYPE_LABELS, type CollectorDNA } from "@/types/dna";
import { Fingerprint } from "@/components/ui/icons";
import { SectionIcon } from "@/components/ui/icon-components";

export function DNAHeroCard({ dna }: { dna: CollectorDNA }) {
  return (
    <BentoCard span="lg:col-span-2 row-span-2" glow>
      <div className="flex items-center gap-2">
        <SectionIcon icon={Fingerprint} />
        <CardEyebrow>Collector DNA</CardEyebrow>
      </div>

      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        <div>
          <motion.p
            key={dna.dnaScore}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-6xl text-gradient"
          >
            {dna.dnaScore}
          </motion.p>
          <p className="text-xs text-gray-500">/ 100</p>

          <div className="mt-4 flex gap-2">
            <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary">
              {ARCHETYPE_LABELS[dna.primaryType]}
            </span>
            {/* ✅ Safe null check for secondaryType */}
            <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-gray-300">
              {dna.secondaryType ? ARCHETYPE_LABELS[dna.secondaryType] : "None"}
            </span>
          </div>

          <div className="mt-6 space-y-2.5">
            {/* ✅ .slice() now works perfectly because traits is an array */}
            {dna.traits.slice(0, 3).map((t) => (
              <div key={t.name}>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{t.name}</span>
                  <span>{t.score}%</span>
                </div>
                <div className="mt-1 h-1 rounded-full bg-white/5">
                  <div className="h-1 rounded-full bg-vinci-aurora" style={{ width: `${t.score}%` }} />
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/dna"
            className="mt-6 inline-block rounded-xl bg-primary px-4 py-2 text-xs font-medium text-white shadow-glow hover:bg-primary/90"
          >
            View DNA
          </Link>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={dna.wheel}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="axis" tick={{ fill: "#71717A", fontSize: 9 }} />
              <Radar
                dataKey="score"
                stroke="#6D5DFB"
                fill="#6D5DFB"
                fillOpacity={0.35}
                strokeWidth={2}
                isAnimationActive
                animationDuration={1000}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </BentoCard>
  );
}