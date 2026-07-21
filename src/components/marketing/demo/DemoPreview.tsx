"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DEMO_TABS, type DemoTabId } from "./demoData";
import {
  ChatDemoPanel,
  ImageDemoPanel,
  MemoryDemoPanel,
  DNADemoPanel,
  ReplayDemoPanel,
  LegacyDemoPanel,
} from "./DemoPanels";
import { cn } from "@/lib/utils";

const PANELS: Record<DemoTabId, React.ComponentType> = {
  chat: ChatDemoPanel,
  image: ImageDemoPanel,
  memory: MemoryDemoPanel,
  dna: DNADemoPanel,
  replay: ReplayDemoPanel,
  legacy: LegacyDemoPanel,
};

export function DemoPreview() {
  const [active, setActive] = useState<DemoTabId>("chat");
  const ActivePanel = PANELS[active];

  return (
    <div id="demo" className="container">
      <div
        role="tablist"
        aria-label="Vinci AI feature preview"
        className="mx-auto mb-6 flex max-w-3xl flex-wrap justify-center gap-2"
      >
        {DEMO_TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active === tab.id}
            onClick={() => setActive(tab.id)}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition",
              active === tab.id
                ? "bg-primary text-white shadow-glow"
                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
            )}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mx-auto max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            role="tabpanel"
          >
            <ActivePanel />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
