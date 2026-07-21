"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, ScanSearch, Watch, Gem } from "@/components/ui/icons";
import { SpotlightContainer } from "./SpotlightContainer";
import { MagneticButton } from "./MagneticButton";
import { DNAThread } from "./DNAThread";
import { staggerContainer, fadeUp } from "@/lib/motion";

const FLOATING_CARDS = [
  { icon: Sparkles, label: "1998 Holo Charizard", sublabel: "PSA 10 · AI matched", style: "left-[6%] top-[22%]", delay: 0 },
  { icon: Watch, label: "Submariner 5513", sublabel: "Authenticity: high", style: "right-[8%] top-[16%]", delay: 0.6 },
  { icon: Gem, label: "Rookie Patch Auto", sublabel: "Rarity: exceptional", style: "left-[12%] bottom-[14%]", delay: 1.2 },
  { icon: ScanSearch, label: "Analyzing image...", sublabel: "Confidence 94%", style: "right-[10%] bottom-[20%]", delay: 0.3 },
];

export function Hero() {
  const prefersReduced = useReducedMotion();

  return (
    <SpotlightContainer className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden pt-16">
      {/* Aurora background */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-vinci-glow" />
        <motion.div
          className="absolute left-1/2 top-[-10%] h-[700px] w-[1100px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
          style={{
            background:
              "conic-gradient(from 180deg, #6D5DFB, #7C3AED, #00D4FF, #6D5DFB)",
          }}
          animate={prefersReduced ? undefined : { rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Signature DNA thread, ambient behind hero copy */}
      <DNAThread
        variant="ambient"
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-[5] h-[320px] w-full -translate-y-1/2 opacity-50"
      />

      {/* Floating collectible cards — decorative UI mockups, not real inventory data */}
      {FLOATING_CARDS.map((card, i) => (
        <motion.div
          key={i}
          className={`absolute hidden glass rounded-2xl px-4 py-3 shadow-glass md:block ${card.style}`}
          initial={{ opacity: 0, y: 20 }}
          animate={
            prefersReduced
              ? { opacity: 1, y: 0 }
              : { opacity: 1, y: [0, -12, 0] }
          }
          transition={
            prefersReduced
              ? { duration: 0.6, delay: card.delay }
              : { duration: 6, repeat: Infinity, ease: "easeInOut", delay: card.delay }
          }
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
              <card.icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-medium text-white">{card.label}</p>
              <p className="text-[11px] text-gray-500">{card.sublabel}</p>
            </div>
          </div>
        </motion.div>
      ))}

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer(0.12, 0.1)}
        className="container relative z-10 flex flex-col items-center text-center"
      >
        <motion.p
          variants={fadeUp}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-gray-300"
        >
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          Built for the Renaiss Tech Hackathon — AI Track
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="max-w-4xl font-display text-5xl font-medium leading-[1.05] tracking-tight md:text-7xl"
        >
          Discover. Analyze. Remember.
          <br />
          <span className="text-gradient">Collect Smarter.</span>
        </motion.h1>

        <motion.p variants={fadeUp} className="mt-6 max-w-xl text-lg text-gray-300">
          Vinci AI is the AI Copilot for collectors. Analyze collectibles, build a living
          Collector DNA, and get personalized insights that grow with your collection.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <MagneticButton href="/signup" variant="primary">
            Start Collecting
          </MagneticButton>
          <MagneticButton href="#demo" variant="ghost">
            Watch Demo
          </MagneticButton>
        </motion.div>
      </motion.div>

      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-500"
      >
        Scroll to see how it thinks
      </motion.div>
    </SpotlightContainer>
  );
}
