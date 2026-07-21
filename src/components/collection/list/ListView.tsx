import Link from "next/link";
import Image from "next/image";
import { BadgeCheck } from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";
import { COLLECTIBLE_CATEGORY_LABELS } from "@/types/common";
import { formatCurrency } from "@/lib/utils";
import type { Collectible } from "@/types/collectible";

export function ListView({
  items,
  selected,
  onToggleSelect,
}: {
  items: Collectible[];
  selected: string[];
  onToggleSelect?: (id: string) => void;
}) {
  return (
    <div className="divide-y divide-white/5 rounded-2xl border border-white/5">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02]">
          {onToggleSelect && (
            <input
              type="checkbox"
              checked={selected.includes(item.id)}
              onChange={() => onToggleSelect(item.id)}
              className="h-4 w-4 accent-primary"
              aria-label={`Select ${item.title}`}
            />
          )}
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-white/5">
            {item.images[0] && (
              <Image
                src={item.images[0].publicUrl}
                alt={item.title}
                fill
                className="object-cover"
                unoptimized
              />
            )}
          </div>
          <Link href={`/collection/${item.id}`} className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{item.title}</p>
            <p className="text-xs text-gray-500">{COLLECTIBLE_CATEGORY_LABELS[item.category]}</p>
          </Link>
          {item.isAuthenticated && <Icon icon={BadgeCheck} size="button" className="text-success" />}
          <span className="w-20 shrink-0 text-right text-sm text-gray-300">
            {item.estimatedValue !== null ? formatCurrency(item.estimatedValue) : "—"}
          </span>
        </div>
      ))}
    </div>
  );
}
