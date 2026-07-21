import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink } from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";
import type { LegacyCollectionHighlight } from "@/types/legacy";

export function CollectionHighlights({ highlights }: { highlights: LegacyCollectionHighlight[] }) {
  if (highlights.length === 0) {
    return <p className="text-sm text-gray-500">No collection data yet.</p>;
  }
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {highlights.map((h, i) => (
        <motion.div
          key={h.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
          className="glass rounded-2xl p-4"
        >
          <p className="text-[11px] uppercase tracking-wide text-gray-500">{h.label}</p>
          <p className="mt-1 truncate font-medium text-gray-100">{h.collectibleTitle}</p>
          <p className="text-xs text-accent">{h.value}</p>
          {h.collectibleId && (
            <Link
              href={`/collection/${h.collectibleId}`}
              className="mt-2 flex items-center gap-1 text-[11px] text-gray-500 hover:text-gray-300"
            >
              <Icon icon={ExternalLink} size={11} decorative />
              View item
            </Link>
          )}
        </motion.div>
      ))}
    </div>
  );
}
