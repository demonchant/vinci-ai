"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Database, Fingerprint } from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";

export interface UpdateNotice {
  kind: "memory" | "dna";
  message: string;
}

export function UpdateToastStack({ notices }: { notices: UpdateNotice[] }) {
  return (
    <div className="pointer-events-none fixed bottom-20 right-6 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {notices.map((n, i) => (
          <motion.div
            key={`${n.kind}-${i}-${n.message}`}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="glass-strong flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs shadow-glass"
          >
            <Icon
              icon={n.kind === "memory" ? Database : Fingerprint}
              size="button"
              className={n.kind === "memory" ? "text-secondary" : "text-primary"}
            />
            <span className="text-gray-200">{n.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
