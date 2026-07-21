import Link from "next/link";
import Image from "next/image";
import { COLLECTIBLE_CATEGORY_LABELS } from "@/types/common";
import { formatCurrency } from "@/lib/utils";
import type { Collectible } from "@/types/collectible";

export function GalleryView({ items }: { items: Collectible[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {items.map((item) => (
        <Link
          key={item.id}
          href={`/collection/${item.id}`}
          className="glass-strong group block overflow-hidden rounded-3xl"
        >
          <div className="relative aspect-[4/3] bg-white/5">
            {item.images[0] && (
              <Image
                src={item.images[0].publicUrl}
                alt={item.title}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                unoptimized
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <p className="font-display text-lg text-white">{item.title}</p>
              <p className="text-xs text-gray-300">
                {COLLECTIBLE_CATEGORY_LABELS[item.category]}
                {item.year ? ` · ${item.year}` : ""}
              </p>
            </div>
          </div>
          {item.estimatedValue !== null && (
            <div className="p-4 text-sm text-gray-300">{formatCurrency(item.estimatedValue)}</div>
          )}
        </Link>
      ))}
    </div>
  );
}
