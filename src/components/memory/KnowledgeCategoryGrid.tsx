"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Pin, Pencil, Trash2, BadgeCheck, Lock, Unlock } from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";
import { MemoryEditDialog } from "./MemoryEditDialog";
import type { CollectorMemoryFact } from "@/types/memory";
import type { CategoryGroup } from "@/services/memoryAnalyticsService";

interface Props {
  groups: CategoryGroup[];
  demo: boolean;
  onMutate: (memoryId: string, action: string, value?: string) => void;
}

export function KnowledgeCategoryGrid({ groups, demo, onMutate }: Props) {
  const [openCategory, setOpenCategory] = useState<string | null>(groups[0]?.category ?? null);
  const [editingFact, setEditingFact] = useState<CollectorMemoryFact | null>(null);

  return (
    <div className="space-y-3">
      {groups.map((group) => {
        const isOpen = openCategory === group.category;
        return (
          <div key={group.category} className="glass rounded-2xl">
            <button
              onClick={() => setOpenCategory(isOpen ? null : group.category)}
              className="flex w-full items-center justify-between px-5 py-4"
            >
              <span className="text-sm font-medium">{group.category}</span>
              <span className="flex items-center gap-2 text-xs text-gray-500">
                {group.facts.length} {group.facts.length === 1 ? "memory" : "memories"}
                <Icon
                  icon={ChevronDown}
                  size="button"
                  className={isOpen ? "rotate-180 transition" : "transition"}
                />
              </span>
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2 px-5 pb-5">
                    {group.facts.map((fact) => (
                      <div key={fact.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="text-sm font-medium">{fact.label}</p>
                              {fact.isVerified && (
                                <Icon icon={BadgeCheck} size={14} className="text-success" />
                              )}
                              {fact.isLocked && <Icon icon={Lock} size={14} className="text-gray-500" />}
                            </div>
                            <p className="text-sm text-gray-300">
                              {Array.isArray(fact.value) ? fact.value.join(", ") : String(fact.value)}
                            </p>
                            <p className="mt-1 text-[11px] text-gray-500">
                              Learned {new Date(fact.learnedAt).toLocaleDateString()} · confidence{" "}
                              {fact.confidence}% · via {fact.source.toLowerCase()}
                            </p>
                          </div>
                          {!demo && (
                            <div className="flex shrink-0 gap-1">
                              <IconAction icon={Pencil} onClick={() => setEditingFact(fact)} label="Edit" />
                              <IconAction
                                icon={Pin}
                                active={fact.isPinned}
                                onClick={() => onMutate(fact.id, fact.isPinned ? "unpin" : "pin")}
                                label="Pin"
                              />
                              <IconAction
                                icon={fact.isLocked ? Unlock : Lock}
                                onClick={() => onMutate(fact.id, fact.isLocked ? "unlock" : "lock")}
                                label="Lock"
                              />
                              <IconAction
                                icon={Trash2}
                                onClick={() => onMutate(fact.id, "archive")}
                                label="Forget"
                                danger
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      <MemoryEditDialog
        fact={editingFact}
        open={Boolean(editingFact)}
        onOpenChange={(open) => !open && setEditingFact(null)}
        onSave={(value) => editingFact && onMutate(editingFact.id, "correct", value)}
      />
    </div>
  );
}

function IconAction({
  icon,
  onClick,
  label,
  active,
  danger,
}: {
  icon: typeof Pin;
  onClick: () => void;
  label: string;
  active?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`rounded-lg p-1.5 transition hover:bg-white/5 ${
        active
          ? "text-accent"
          : danger
            ? "text-gray-500 hover:text-red-400"
            : "text-gray-500 hover:text-gray-300"
      }`}
    >
      <Icon icon={icon} size="button" decorative />
    </button>
  );
}
