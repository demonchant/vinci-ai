"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { Reveal } from "../Reveal";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motion";

const WHEEL_DATA = [
  { axis: "Knowledge", score: 82 },
  { axis: "Patience", score: 91 },
  { axis: "Diversification", score: 68 },
  { axis: "Authentication", score: 88 },
  { axis: "Research", score: 95 },
  { axis: "Market Awareness", score: 74 },
];

const TRAITS = [
  { name: "Research Driven", score: 96 },
  { name: "Long-Term Thinking", score: 91 },
  { name: "Quality Focused", score: 88 },
  { name: "Risk Appetite", score: 28 },
];

export function DNAShowcase() {
  return (
    <section className="container py-32">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-accent">The centerpiece</p>
        <h2 className="mt-3 font-display text-4xl md:text-5xl">Collector DNA</h2>
        <p className="mt-4 text-gray-400">
          Spotify Wrapped meets a GitHub profile — but for what you collect, updated in real time.
        </p>
      </Reveal>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer(0.1)}
        className="mx-auto mt-16 grid max-w-4xl gap-6 lg:grid-cols-2"
      >
        <motion.div variants={fadeUp} className="glass-strong rounded-3xl p-8">
          <p className="text-xs text-gray-500">Collector DNA Score</p>
          <p className="mt-2 font-display text-7xl text-gradient">92</p>
          <p className="mt-1 text-xs text-gray-500">/ 100</p>
          <p className="mt-4 text-sm text-gray-300">
            "Your collection shows strong long-term investment discipline and a preference for
            historically significant collectibles."
          </p>
          <div className="mt-6 flex gap-2">
            <span className="rounded-full bg-primary/20 px-3 py-1.5 text-xs font-medium text-primary">
              Investor
            </span>
            <span className="rounded-full bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-300">
              Historian
            </span>
          </div>

          <div className="mt-8 space-y-3">
            {TRAITS.map((trait) => (
              <div key={trait.name}>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{trait.name}</span>
                  <span>{trait.score}%</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-white/5">
                  <motion.div
                    className="h-1.5 rounded-full bg-vinci-aurora"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${trait.score}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="glass-strong rounded-3xl p-8">
          <p className="mb-2 text-xs text-gray-500">DNA Wheel</p>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={WHEEL_DATA}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis
                  dataKey="axis"
                  tick={{ fill: "#A1A1AA", fontSize: 11 }}
                />
                <Radar
                  dataKey="score"
                  stroke="#6D5DFB"
                  fill="#6D5DFB"
                  fillOpacity={0.35}
                  strokeWidth={2}
                  isAnimationActive
                  animationDuration={1200}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-xs text-gray-500">
            Demonstration data — your real DNA Wheel is computed from your own activity.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
