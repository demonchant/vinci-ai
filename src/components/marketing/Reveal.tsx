"use client";

import { motion, useReducedMotion } from "framer-motion";
import { fadeUp, reducedMotionVariants, viewportOnce } from "@/lib/motion";
import type { Variants } from "framer-motion";

export function Reveal({
  children,
  variants = fadeUp,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  variants?: Variants;
  className?: string;
  delay?: number;
}) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={prefersReduced ? reducedMotionVariants : variants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
