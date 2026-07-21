"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Sparkles } from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";
import type { CheckpointWithReasoning } from "@/types/checkpoint";

function confidenceLabel(score: number) {
  if (score >= 95) return "Very High";
  if (score >= 80) return "High";
  if (score >= 60) return "Moderate";
  return "Low";
}

export function WhyChangedPanel({ checkpoint }: { checkpoint: CheckpointWithReasoning }) {
  const [open, setOpen] = useState(false);
  const reasoning = checkpoint.reasoning;

  return (
    <div className="mt-3 border-t border-white/5 pt-3">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center justify-between text-xs font-medium text-gray-300"
      >
        <span className="flex items-center gap-1.5">
          <Icon icon={Sparkles} size="button" className="text-accent" />
          Why I Changed
        </span>
        <Icon
          icon={ChevronDown}
          size="button"
          className={open ? "rotate-180 transition" : "transition"}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-4 text-xs">
              <section>
                <p className="font-medium text-gray-300">What changed</p>
                <div className="mt-1.5 space-y-1.5">
                  {checkpoint.dnaAfter.dnaScore !== checkpoint.dnaBefore.dnaScore && (
                    <div className="flex items-center justify-between rounded-md bg-white/5 px-2.5 py-1.5">
                      <span className="text-gray-500">Collector DNA Score</span>
                      <span className="text-gray-200">
                        {checkpoint.dnaBefore.dnaScore} → {checkpoint.dnaAfter.dnaScore}
                      </span>
                    </div>
                  )}
                  {checkpoint.memoryAfter
                    .filter((m) => {
                      const prev = checkpoint.memoryBefore.find((b) => b.key === m.key);
                      return JSON.stringify(prev?.value) !== JSON.stringify(m.value);
                    })
                    .map((m) => (
                      <div
                        key={m.key}
                        className="flex items-center justify-between rounded-md bg-white/5 px-2.5 py-1.5"
                      >
                        <span className="text-gray-500">{m.label}</span>
                        <span className="text-gray-200">{String(m.value)}</span>
                      </div>
                    ))}
                </div>
              </section>

              {reasoning && (
                <section>
                  <p className="font-medium text-gray-300">AI Reasoning</p>
                  <p className="mt-1.5 leading-relaxed text-gray-400">{reasoning.reason}</p>
                </section>
              )}

              {reasoning && reasoning.evidence.length > 0 && (
                <section>
                  <p className="font-medium text-gray-300">Evidence</p>
                  <ul className="mt-1.5 space-y-1">
                    {reasoning.evidence.map((e, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-gray-400">
                        <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-gray-500" />
                        <span>
                          {e.text} <span className="text-gray-600">— {e.source}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {reasoning && reasoning.dnaImpact.length > 0 && (
                <section>
                  <p className="font-medium text-gray-300">DNA Impact</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {reasoning.dnaImpact.map((d) => (
                      <span
                        key={d.metric}
                        className="rounded-full bg-primary/15 px-2 py-1 text-[11px] text-primary"
                      >
                        {d.metric} {d.after > d.before ? "+" : ""}
                        {d.after - d.before}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              <section>
                <p className="font-medium text-gray-300">Confidence</p>
                <p className="mt-1 text-gray-400">
                  {checkpoint.confidence}% — {confidenceLabel(checkpoint.confidence)}. Confidence
                  reflects how many independent signals (memory facts, DNA shifts, sources) agreed.
                </p>
              </section>

              <section>
                <p className="font-medium text-gray-300">Sources</p>
                <ul className="mt-1 space-y-0.5 text-gray-500">
                  {checkpoint.sources.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
