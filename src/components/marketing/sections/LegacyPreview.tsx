"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "../Reveal";
import { cn } from "@/lib/utils";

const SECTIONS = [
  {
    id: "summary",
    label: "Executive Summary",
    content:
      "You began your journey as an Explorer driven by curiosity. Through consistent research and disciplined purchasing, you've evolved into an Investor-Historian with exceptional portfolio balance.",
  },
  {
    id: "achievements",
    label: "Achievements",
    content: "🏆 Vintage Specialist · 🏆 Research Master · 🏆 Authentication Expert · 🏆 50 AI Analyses",
  },
  {
    id: "stats",
    label: "Collection Stats",
    content: "62 collectibles · 7 categories · 89% authenticated · $14,200 estimated value",
  },
  {
    id: "letter",
    label: "AI Letter",
    content:
      "Dear Collector — every conversation, every uploaded image, and every researched purchase helped shape your Collector DNA. The next chapter is just beginning. — Vinci AI",
  },
  {
    id: "forecast",
    label: "Forecast",
    content:
      "AI Forecast (speculative): likely to expand into vintage comics next quarter, based on recent search patterns.",
  },
];

export function LegacyPreview() {
  const [active, setActive] = useState(0);

  return (
    <section className="container py-32">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-accent">The finale</p>
        <h2 className="mt-3 font-display text-4xl md:text-5xl">Collector Legacy Report</h2>
        <p className="mt-4 text-gray-400">
          Your journey through the world of collectibles, written by your AI copilot.
        </p>
      </Reveal>

      <Reveal className="mx-auto mt-16 max-w-3xl">
        <div className="glass-strong overflow-hidden rounded-3xl">
          <div className="flex flex-wrap gap-1 border-b border-white/5 p-2">
            {SECTIONS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setActive(i)}
                className={cn(
                  "rounded-xl px-3 py-2 text-xs font-medium transition",
                  active === i ? "bg-primary text-white" : "text-gray-500 hover:bg-white/5"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
          <div className="min-h-[220px] p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={SECTIONS[active]!.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="font-display text-xl text-gray-100">{SECTIONS[active]!.label}</p>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-gray-400">
                  {SECTIONS[active]!.content}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
