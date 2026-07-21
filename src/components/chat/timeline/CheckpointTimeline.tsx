"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useCheckpoints } from "@/hooks/useCheckpoints";
import { Database, Fingerprint } from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";
import { CheckpointCard } from "../checkpoint/CheckpointCard";

export function CheckpointTimeline({ chatId }: { chatId: string }) {
  const { checkpoints, isLoading } = useCheckpoints(chatId);
  const [openId, setOpenId] = useState<string | null>(null);

  if (isLoading) {
    return <p className="text-xs text-gray-500">Loading timeline...</p>;
  }

  if (checkpoints.length === 0) {
    return (
      <p className="text-xs text-gray-500">
        No checkpoints yet. Vinci AI creates one automatically whenever this conversation changes
        your Collector Memory or Collector DNA.
      </p>
    );
  }

  return (
    <div className="relative space-y-4 pl-6">
      <div
        aria-hidden="true"
        className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-primary via-secondary to-accent opacity-40"
      />
      {checkpoints.map((cp, i) => (
        <motion.div
          key={cp.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.04 }}
          className="relative"
        >
          <span className="absolute -left-6 top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary shadow-glow ring-4 ring-background" />
          <button
            onClick={() => setOpenId(openId === cp.id ? null : cp.id)}
            className="w-full rounded-lg bg-white/5 px-3 py-2.5 text-left hover:bg-white/10"
          >
            <div className="flex items-center gap-1.5 text-xs text-gray-300">
              <Icon
                icon={cp.checkpointTitle.startsWith("Collector DNA") ? Fingerprint : Database}
                size="button"
              />
              <span className="truncate">{cp.checkpointTitle}</span>
            </div>
            <p className="mt-0.5 text-[11px] text-gray-500">
              {new Date(cp.createdAt).toLocaleString()}
            </p>
          </button>

          {openId === cp.id && (
            <div className="mt-2">
              <CheckpointCard checkpointId={cp.id} />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
