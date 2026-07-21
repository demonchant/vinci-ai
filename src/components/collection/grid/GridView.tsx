import { CollectibleCard } from "../cards/CollectibleCard";
import type { Collectible } from "@/types/collectible";

export function GridView({
  items,
  selected,
  onToggleSelect,
}: {
  items: Collectible[];
  selected: string[];
  onToggleSelect?: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <CollectibleCard
          key={item.id}
          item={item}
          selected={selected.includes(item.id)}
          onToggleSelect={onToggleSelect ? () => onToggleSelect(item.id) : undefined}
        />
      ))}
    </div>
  );
}
