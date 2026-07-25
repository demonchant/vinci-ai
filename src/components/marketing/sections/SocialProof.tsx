"use client";

import { Reveal } from "../Reveal";
import { staggerContainer, fadeUp } from "@/lib/motion";
import { motion } from "framer-motion";

const TESTIMONIALS = [
  {
    quote:
      "I've used spreadsheets for ten years. Collector Memory is the first thing that actually felt like it knew my collection.",
    name: "Early collector persona",
    role: "Vintage trading cards",
  },
  {
    quote:
      "The DNA Evolution Replay is the kind of feature that makes people stop scrolling. It tells a story most apps don't bother to.",
    name: "AI product enthusiast persona",
    role: "Beta tester",
  },
  {
    quote:
      "Clear separation between what's AI-estimated and what's verified. That's the detail that builds trust fast.",
    name: "Hackathon judge persona",
    role: "Renaiss Tech Hackathon",
  },
];

export function SocialProof() {
  return (
    <section className="container py-32">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-accent">
          What people are saying
        </p>
        <h2 className="mt-3 font-display text-4xl md:text-5xl">Built with collectors in mind</h2>
        <p className="mt-4 text-sm text-gray-500">
          Demonstration content — illustrative personas, not real customer quotes.
        </p>
      </Reveal>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerContainer(0.1)}
        className="mt-16 grid gap-6 md:grid-cols-3"
      >
        {TESTIMONIALS.map((t) => (
          <motion.figure key={t.name} variants={fadeUp} className="glass rounded-2xl p-6">
            {/* ✅ FIX: Escaped quotes around the dynamic variable */}
            <blockquote className="text-sm leading-relaxed text-gray-300">&quot;{t.quote}&quot;</blockquote>
            <figcaption className="mt-4 text-xs text-gray-500">
              <span className="font-medium text-gray-300">{t.name}</span> · {t.role}
            </figcaption>
          </motion.figure>
        ))}
      </motion.div>
    </section>
  );
}