import Link from "next/link";
import Image from "next/image";
import { BadgeCheck, ScanSearch } from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";
import { COLLECTIBLE_CATEGORY_LABELS } from "@/types/common";
import { formatCurrency } from "@/lib/utils";
import type { Collectible } from "@/types/collectible";

export function CollectibleCard({
  item,
  selected,
  onToggleSelect,
}: {
  item: Collectible;
  selected?: boolean;
  onToggleSelect?: () => void;
}) {
  return (
    <div className="glass group relative overflow-hidden rounded-2xl transition hover:bg-white/[0.04]">
      {onToggleSelect && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onToggleSelect();
          }}
          className={`absolute left-2 top-2 z-10 h-5 w-5 rounded-md border transition ${
            selected ? "border-primary bg-primary" : "border-white/30 bg-black/40"
          }`}
          aria-label="Select item"
        />
      )}
      <Link href={`/collection/${item.id}`}>
        <div className="relative aspect-square bg-white/5">
          {item.images[0] && (
            <Image
              src={item.images[0].publicUrl}
              alt={item.title}
              fill
              className="object-cover"
              unoptimized
            />
          )}
          {item.isAuthenticated && (
            <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-success/90">
              <Icon icon={BadgeCheck} size={14} className="text-white" decorative />
            </span>
          )}
        </div>
        <div className="p-3">
          <p className="truncate text-sm font-medium">{item.title}</p>
          <div className="mt-0.5 flex items-center justify-between text-xs text-gray-500">
            <span>{COLLECTIBLE_CATEGORY_LABELS[item.category]}</span>
            {item.estimatedValue !== null && <span>{formatCurrency(item.estimatedValue)}</span>}
          </div>
          {item.rarityScore !== null && (
            <div className="mt-1.5 flex items-center gap-1 text-[11px] text-gray-600">
              <Icon icon={ScanSearch} size={11} decorative />
              {item.rarityScore}% confidence
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
