"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, CheckCircle2 } from "@/components/ui/icons";
import { Reveal } from "../Reveal";

const FRAMES = [
  { month: "Jan", score: 41, type: "Explorer", note: "Just getting started — broad, exploratory purchases." },
  { month: "Feb", score: 58, type: "Investor", note: "Average purchase price rose; began holding longer." },
  { month: "Mar", score: 71, type: "Investor + Historian", note: "Five vintage analyses unlocked Vintage Specialist." },
  { month: "Apr", score: 79, type: "Investor + Curator", note: "Authentication rate crossed 85%." },
  { month: "Today", score: 92, type: "Investor-Historian", note: "Diversification improved 21% over 3 months." },
] as const;

export function ReplayPreview() {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const frame = FRAMES[index];

  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      setIndex((i) => {
        if (i >= FRAMES.length - 1) {
          setIsPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, 1800);
    return () => clearInterval(id);
  }, [isPlaying]);

  return (
    <section className="container py-32">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-accent">Replay</p>
        <h2 className="mt-3 font-display text-4xl md:text-5xl">Watch your DNA evolve</h2>
        <p className="mt-4 text-gray-400">
          Demonstration timeline below — drag it, or hit play.
        </p>
      </Reveal>

      <Reveal className="mx-auto mt-16 max-w-2xl glass-strong rounded-3xl p-8">
        <div className="flex items-baseline justify-between">
          <AnimatePresence mode="wait">
            <motion.p
              key={frame.score}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="font-display text-6xl text-gradient"
            >
              {frame.score}
            </motion.p>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.span
              key={frame.type}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-full bg-primary/20 px-3 py-1.5 text-xs font-medium text-primary"
            >
              {frame.type}
            </motion.span>
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={frame.note}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-3 flex items-center gap-2 text-sm text-gray-400"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
            {frame.note}
          </motion.p>
        </AnimatePresence>

        <div className="mt-8 flex items-center gap-4">
          <button
            onClick={() => setIsPlaying((p) => !p)}
            aria-label={isPlaying ? "Pause replay" : "Play replay"}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-glow"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <input
            type="range"
            min={0}
            max={FRAMES.length - 1}
            value={index}
            onChange={(e) => {
              setIsPlaying(false);
              setIndex(Number(e.target.value));
            }}
            aria-label="Scrub Collector DNA timeline"
            className="flex-1 accent-primary"
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-gray-500">
          {FRAMES.map((f) => (
            <span key={f.month}>{f.month}</span>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
