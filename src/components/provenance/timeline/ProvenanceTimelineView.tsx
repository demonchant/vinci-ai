"use client";

import { motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { EVENT_ICON } from "../eventIcons";
import { DNAThread } from "@/components/marketing/DNAThread";
import type { ProvenanceEvent } from "@/types/provenance";

export function ProvenanceTimelineView({ events }: { events: ProvenanceEvent[] }) {
  if (events.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        This collectible's timeline will fill in as Vinci AI learns more about it.
      </p>
    );
  }

  return (
    <div className="relative space-y-5 pl-8">
      <DNAThread
        variant="spine"
        className="pointer-events-none absolute left-3 top-2 bottom-2 w-5 opacity-40"
      />
      {events.map((event, i) => {
        const EventIcon = EVENT_ICON[event.eventType];
        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className="relative"
          >
            <span className="absolute -left-8 top-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-surface ring-2 ring-primary/40">
              <Icon icon={EventIcon} size={13} className="text-primary" decorative />
            </span>
            <div className="rounded-xl bg-white/[0.02] p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{event.eventTitle}</p>
                <span className="text-[11px] text-gray-500">
                  {new Date(event.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-400">{event.eventDescription}</p>
              {event.confidence !== null && (
                <p className="mt-1 text-[11px] text-gray-500">Confidence: {event.confidence}%</p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
