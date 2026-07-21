"use client";

import { Upload, ScanSearch, Brain, Sparkles, Lightbulb, ScrollText } from "@/components/ui/icons";
import { Reveal } from "../Reveal";
import { staggerContainer, fadeUp, viewportOnce } from "@/lib/motion";
import { motion } from "framer-motion";
import { DNAThread } from "../DNAThread";

const STEPS = [
  { icon: Upload, title: "Upload a collectible", note: "A photo of a card, watch, comic, anything." },
  { icon: ScanSearch, title: "AI analysis", note: "Identification, rarity, condition, authenticity." },
  { icon: Brain, title: "Collector Memory updates", note: "New facts about your preferences are learned." },
  { icon: Sparkles, title: "Collector DNA evolves", note: "Your archetype and scores shift in response." },
  { icon: Lightbulb, title: "AI recommendations", note: "Personalized suggestions for what's next." },
  { icon: ScrollText, title: "Legacy Report", note: "Your whole journey, written up over time." },
];

export function HowVinciThinks() {
  return (
    <section className="container py-32">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-accent">The loop</p>
        <h2 className="mt-3 font-display text-4xl md:text-5xl">How Vinci AI thinks</h2>
        <p className="mt-4 text-gray-400">
          Every feature feeds the next. Nothing you do is forgotten.
        </p>
      </Reveal>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer(0.12)}
        className="relative mx-auto mt-20 max-w-3xl"
      >
        {/* connective spine — the same signature motif from the hero, reused intentionally */}
        <DNAThread
          variant="spine"
          className="pointer-events-none absolute left-5 top-2 bottom-2 w-4 opacity-50"
        />

        <div className="space-y-10">
          {STEPS.map((step, i) => (
            <motion.div key={step.title} variants={fadeUp} className="relative flex gap-6">
              <div className="z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-surface text-primary shadow-glow">
                <step.icon className="h-6 w-6" />
              </div>
              <div className="pt-2">
                <p className="text-xs text-gray-500">Step {i + 1}</p>
                <h3 className="text-lg font-medium">{step.title}</h3>
                <p className="mt-1 text-sm text-gray-400">{step.note}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
