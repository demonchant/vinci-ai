"use client";

import { motion } from "framer-motion";
import { Reveal } from "../Reveal";
import { FEATURE_SECTIONS } from "./featureData";
import { fadeUp } from "@/lib/motion";

export function FeatureSections() {
  return (
    <section id="features" className="container py-32">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-accent">What it does</p>
        <h2 className="mt-3 font-display text-4xl md:text-5xl">
          Seven systems. One collector copilot.
        </h2>
      </Reveal>

      <div className="mt-20 space-y-24">
        {FEATURE_SECTIONS.map((feature, i) => (
          <Reveal key={feature.id} className="grid items-center gap-10 lg:grid-cols-2">
            <div className={i % 2 === 1 ? "lg:order-2" : ""}>
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <feature.icon className="h-5 w-5" />
              </div>
              <p className="text-xs font-medium uppercase tracking-widest text-gray-500">
                {feature.eyebrow}
              </p>
              <h3 className="mt-2 font-display text-2xl md:text-3xl">{feature.title}</h3>
              <p className="mt-4 max-w-md text-gray-400">{feature.description}</p>
            </div>

            <motion.div
              variants={fadeUp}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className={`glass aspect-[4/3] rounded-2xl p-8 ${i % 2 === 1 ? "lg:order-1" : ""}`}
            >
              <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                <feature.icon className="h-10 w-10 text-primary opacity-60" />
                <p className="text-sm text-gray-500">{feature.eyebrow} preview</p>
              </div>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
