import Link from "next/link";
import Image from "next/image";
import { DNAThread } from "@/components/marketing/DNAThread";
import { formatCurrency } from "@/lib/utils";
import type { Collectible } from "@/types/collectible";

export function TimelineView({ items }: { items: Collectible[] }) {
  const sorted = [...items].sort(
    (a, b) =>
      new Date(b.purchasedAt ?? b.createdAt).getTime() -
      new Date(a.purchasedAt ?? a.createdAt).getTime()
  );

  return (
    <div className="relative space-y-4 pl-8">
      <DNAThread
        variant="spine"
        className="pointer-events-none absolute left-3 top-2 bottom-2 w-5 opacity-30"
      />
      {sorted.map((item) => (
        <Link
          key={item.id}
          href={`/collection/${item.id}`}
          className="relative flex items-center gap-3 rounded-xl bg-white/[0.02] p-3 hover:bg-white/5"
        >
          <span className="absolute -left-8 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-primary ring-4 ring-background" />
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white/5">
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
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{item.title}</p>
            <p className="text-xs text-gray-500">
              {new Date(item.purchasedAt ?? item.createdAt).toLocaleDateString()}
            </p>
          </div>
          {item.estimatedValue !== null && (
            <span className="text-sm text-gray-300">{formatCurrency(item.estimatedValue)}</span>
          )}
        </Link>
      ))}
    </div>
  );
}
