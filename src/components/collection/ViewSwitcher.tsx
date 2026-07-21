import { Grid2X2, List, Layers, Image as ImageIcon, Clock } from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";
import type { CollectionViewMode } from "@/types/collection";

const VIEWS: { mode: CollectionViewMode; icon: typeof Grid2X2; label: string }[] = [
  { mode: "grid", icon: Grid2X2, label: "Grid" },
  { mode: "list", icon: List, label: "List" },
  { mode: "table", icon: Layers, label: "Table" },
  { mode: "gallery", icon: ImageIcon, label: "Gallery" },
  { mode: "timeline", icon: Clock, label: "Timeline" },
];

export function ViewSwitcher({
  value,
  onChange,
}: {
  value: CollectionViewMode;
  onChange: (mode: CollectionViewMode) => void;
}) {
  return (
    <div className="flex gap-0.5 rounded-lg bg-white/5 p-1">
      {VIEWS.map((v) => (
        <button
          key={v.mode}
          onClick={() => onChange(v.mode)}
          aria-label={v.label}
          aria-pressed={value === v.mode}
          className={`rounded-md p-1.5 transition ${
            value === v.mode ? "bg-primary text-white" : "text-gray-500 hover:text-gray-300"
          }`}
        >
          <Icon icon={v.icon} size="button" decorative />
        </button>
      ))}
    </div>
  );
}
