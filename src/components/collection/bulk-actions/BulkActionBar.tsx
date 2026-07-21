"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Archive, Star, FolderOpen, X } from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";

export function BulkActionBar({
  count,
  onAction,
  onClear,
}: {
  count: number;
  onAction: (action: "set_status_archived" | "set_status_favorite" | "delete" | "move") => void;
  onClear: () => void;
}) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="glass-strong fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-2xl px-4 py-3 shadow-glass"
        >
          <span className="text-xs text-gray-300">{count} selected</span>
          <div className="h-4 w-px bg-white/10" />
          <ActionBtn icon={Star} label="Favorite" onClick={() => onAction("set_status_favorite")} />
          <ActionBtn icon={FolderOpen} label="Move" onClick={() => onAction("move")} />
          <ActionBtn icon={Archive} label="Archive" onClick={() => onAction("set_status_archived")} />
          <ActionBtn icon={Trash2} label="Delete" onClick={() => onAction("delete")} danger />
          <button
            onClick={onClear}
            aria-label="Clear selection"
            className="ml-1 text-gray-500 hover:text-gray-300"
          >
            <Icon icon={X} size="button" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ActionBtn({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: typeof Star;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs transition hover:bg-white/10 ${
        danger ? "text-red-400" : "text-gray-300"
      }`}
    >
      <Icon icon={icon} size="button" decorative />
      {label}
    </button>
  );
}
