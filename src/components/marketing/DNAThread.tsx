"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Vinci AI's signature visual: a flowing double-helix line rendered in the
 * brand gradient. Used once, large and ambient, behind the hero — then
 * reused at small scale as the connective spine in "How Vinci AI Thinks"
 * so the same motif literally threads the page together.
 */
export function DNAThread({
  className,
  variant = "ambient",
}: {
  className?: string;
  variant?: "ambient" | "spine";
}) {
  const prefersReduced = useReducedMotion();
  const isSpine = variant === "spine";

  const strandA = isSpine
    ? "M2 0 C 2 40, 38 40, 38 80 C 38 120, 2 120, 2 160 C 2 200, 38 200, 38 240"
    : "M0,140 C 150,40 250,240 400,120 C 550,0 650,260 800,120 C 950,0 1050,240 1200,120";
  const strandB = isSpine
    ? "M38 0 C 38 40, 2 40, 2 80 C 2 120, 38 120, 38 160 C 38 200, 2 200, 2 240"
    : "M0,180 C 150,280 250,80 400,200 C 550,320 650,60 800,200 C 950,320 1050,80 1200,200";

  const viewBox = isSpine ? "0 0 40 240" : "0 0 1200 320";

  return (
    <svg
      viewBox={viewBox}
      className={className}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`dnaGradA-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6D5DFB" />
          <stop offset="50%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#00D4FF" />
        </linearGradient>
        <linearGradient id={`dnaGradB-${variant}`} x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00D4FF" />
          <stop offset="100%" stopColor="#6D5DFB" />
        </linearGradient>
      </defs>

      <motion.path
        d={strandA}
        fill="none"
        stroke={`url(#dnaGradA-${variant})`}
        strokeWidth={isSpine ? 2 : 1.5}
        strokeLinecap="round"
        opacity={0.6}
        initial={prefersReduced ? { pathLength: 1 } : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.4, ease: "easeInOut" }}
      />
      <motion.path
        d={strandB}
        fill="none"
        stroke={`url(#dnaGradB-${variant})`}
        strokeWidth={isSpine ? 2 : 1.5}
        strokeLinecap="round"
        opacity={0.45}
        initial={prefersReduced ? { pathLength: 1 } : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.4, ease: "easeInOut", delay: 0.2 }}
      />
    </svg>
  );
}
