import { BentoCard, CardEyebrow } from "./BentoCard";
import { formatCurrency } from "@/lib/utils";
import { COLLECTIBLE_CATEGORY_LABELS, type CollectibleCategory } from "@/types/common";
import { Wallet } from "@/components/ui/icons";
import { SectionIcon } from "@/components/ui/icon-components";

export function CollectionValueCard({
  totalValue,
  categoryCounts,
  topItemTitle,
}: {
  totalValue: number;
  categoryCounts: Record<string, number>;
  topItemTitle: string | null;
}) {
  const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0];

  return (
    <BentoCard span="lg:col-span-1">
      <div className="flex items-center gap-2">
        <SectionIcon icon={Wallet} />
        <CardEyebrow>Collection Value</CardEyebrow>
      </div>
      <p className="mt-2 font-display text-3xl">{formatCurrency(totalValue)}</p>
      <div className="mt-4 space-y-1 text-xs text-gray-500">
        {topCategory && (
          <p>
            Top category:{" "}
            <span className="text-gray-300">
              {COLLECTIBLE_CATEGORY_LABELS[topCategory[0] as CollectibleCategory] ?? topCategory[0]}
            </span>
          </p>
        )}
        {topItemTitle && (
          <p>
            Highest value: <span className="text-gray-300">{topItemTitle}</span>
          </p>
        )}
      </div>
    </BentoCard>
  );
}
