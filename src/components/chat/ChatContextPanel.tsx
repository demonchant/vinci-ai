"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, Fingerprint, Activity, ChevronLeft, ChevronRight } from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";
import { SectionIcon } from "@/components/ui/icon-components";
import { CheckpointTimeline } from "./timeline/CheckpointTimeline";

interface ContextData {
  memory: { label: string; value: unknown }[];
  dnaScore: number;
  primaryType: string;
}

export function ChatContextPanel({ chatId }: { chatId: string }) {
  const [collapsed, setCollapsed] = useState(false);
  const [tab, setTab] = useState<"context" | "timeline">("context");
  const [data, setData] = useState<ContextData | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/memory").then((r) => r.json()),
      fetch("/api/dna").then((r) => r.json()),
    ]).then(([memRes, dnaRes]) => {
      setData({
        memory: (memRes.facts ?? []).slice(0, 5).map((f: any) => ({ label: f.label, value: f.value })),
        dnaScore: dnaRes.dna?.dnaScore ?? 0,
        primaryType: dnaRes.dna?.primaryType ?? "EXPLORER",
      });
    });
  }, []);

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        aria-label="Expand context panel"
        className="hidden w-10 shrink-0 items-center justify-center border-l border-white/5 text-gray-500 hover:bg-white/5 lg:flex"
      >
        <Icon icon={ChevronLeft} size="button" />
      </button>
    );
  }

  return (
    <aside className="hidden w-80 shrink-0 flex-col border-l border-white/5 p-4 lg:flex">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-1 rounded-lg bg-white/5 p-1">
          <button
            onClick={() => setTab("context")}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
              tab === "context" ? "bg-primary text-white" : "text-gray-400"
            }`}
          >
            Context
          </button>
          <button
            onClick={() => setTab("timeline")}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
              tab === "timeline" ? "bg-primary text-white" : "text-gray-400"
            }`}
          >
            Timeline
          </button>
        </div>
        <button
          onClick={() => setCollapsed(true)}
          aria-label="Collapse context panel"
          className="text-gray-500 hover:text-gray-300"
        >
          <Icon icon={ChevronRight} size="button" />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {tab === "context" ? (
          <motion.div
            key="context"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 space-y-5 overflow-y-auto scrollbar-thin"
          >
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-2">
                <SectionIcon icon={Fingerprint} />
                <p className="text-xs text-gray-500">Collector DNA</p>
              </div>
              <p className="mt-1 font-display text-3xl text-gradient">{data?.dnaScore ?? "—"}</p>
              <p className="text-xs text-gray-500">{data?.primaryType}</p>
            </div>

            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-2">
                <SectionIcon icon={Database} />
                <p className="text-xs text-gray-500">Collector Memory</p>
              </div>
              <ul className="mt-2 space-y-1.5">
                {(data?.memory ?? []).map((f) => (
                  <li key={f.label} className="flex justify-between text-xs">
                    <span className="text-gray-500">{f.label}</span>
                    <span className="text-gray-300">{String(f.value)}</span>
                  </li>
                ))}
                {(data?.memory ?? []).length === 0 && (
                  <li className="text-xs text-gray-600">Nothing learned yet.</li>
                )}
              </ul>
            </div>

            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-2">
                <SectionIcon icon={Activity} />
                <p className="text-xs text-gray-500">This conversation</p>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Updates to memory and DNA from this chat appear in the Timeline tab.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="timeline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 overflow-y-auto scrollbar-thin"
          >
            <CheckpointTimeline chatId={chatId} />
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}
