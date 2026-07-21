"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Pencil,
  Trash2,
  ScanSearch,
  Clock,
  MessageSquare,
  Star,
  History,
  ShieldCheck,
  Wallet,
  Layers,
} from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";
import { COLLECTIBLE_CATEGORY_LABELS } from "@/types/common";
import { formatCurrency } from "@/lib/utils";
import type { Collectible } from "@/types/collectible";
import type { RelatedCollectibleSuggestion } from "@/types/collection";

export default function CollectibleDetailPage() {
  const { collectibleId } = useParams<{ collectibleId: string }>();
  const router = useRouter();
  const [item, setItem] = useState<Collectible | null>(null);
  const [related, setRelated] = useState<RelatedCollectibleSuggestion[]>([]);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetch(`/api/collectibles/${collectibleId}`)
      .then((r) => r.json())
      .then((d) => {
        setItem(d.item ?? null);
      });
    fetch(`/api/collection/${collectibleId}/related`)
      .then((r) => r.json())
      .then((d) => setRelated(d.related ?? []));
  }, [collectibleId]);

  async function handleDelete() {
    if (!window.confirm("Delete this collectible?")) return;
    await fetch(`/api/collectibles/${collectibleId}`, { method: "DELETE" });
    router.push("/collection");
  }

  async function handleFavorite() {
    await fetch(`/api/collectibles/${collectibleId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "FAVORITE" }),
    });
    if (item) setItem({ ...item, status: "FAVORITE" });
  }

  if (!item) {
    return (
      <div className="container py-10">
        <div className="h-64 animate-pulse rounded-2xl bg-white/5" />
      </div>
    );
  }

  const currentImage = item.images[activeImage];

  return (
    <div className="container py-10">
      {/* Breadcrumb */}
      <nav className="mb-6 text-xs text-gray-500" aria-label="Breadcrumb">
        <Link href="/collection" className="hover:text-gray-300">Collection</Link>
        <span className="mx-1.5">/</span>
        <span className="text-gray-300">{item.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        {/* Left — image viewer */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-white/5">
            {currentImage ? (
              <Image
                src={currentImage.publicUrl}
                alt={item.title}
                fill
                className="object-contain"
                unoptimized
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-gray-600">
                No image
              </div>
            )}
            {item.isAuthenticated && (
              <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-success/90 px-2.5 py-1 text-xs font-medium text-white">
                <Icon icon={BadgeCheck} size="button" decorative /> Authenticated
              </span>
            )}
          </div>

          {/* Thumbnail strip */}
          {item.images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {item.images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(i)}
                  className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                    i === activeImage ? "border-primary" : "border-white/10"
                  }`}
                >
                  <Image src={img.publicUrl} alt="" fill className="object-cover" unoptimized />
                </button>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href={`/image-analysis`}
              className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-glow"
            >
              <Icon icon={ScanSearch} size="button" decorative />
              Analyze with AI
            </Link>
            <Link
              href={`/collection/${collectibleId}/timeline`}
              className="flex items-center gap-1.5 rounded-xl bg-white/5 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10"
            >
              <Icon icon={Clock} size="button" decorative />
              Timeline
            </Link>
            <Link
              href={`/chat`}
              className="flex items-center gap-1.5 rounded-xl bg-white/5 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10"
            >
              <Icon icon={MessageSquare} size="button" decorative />
              Ask AI
            </Link>
            <button
              onClick={handleFavorite}
              className="flex items-center gap-1.5 rounded-xl bg-white/5 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10"
            >
              <Icon icon={Star} size="button" className={item.status === "FAVORITE" ? "text-yellow-400" : ""} decorative />
              Favorite
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-sm text-red-400 hover:bg-white/5"
            >
              <Icon icon={Trash2} size="button" decorative />
            </button>
          </div>
        </div>

        {/* Right — metadata */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between gap-3">
              <h1 className="font-display text-2xl">{item.title}</h1>
              <button className="text-gray-500 hover:text-gray-300">
                <Icon icon={Pencil} size="button" aria-label="Edit" decorative={false} />
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              {COLLECTIBLE_CATEGORY_LABELS[item.category]}
              {item.year ? ` · ${item.year}` : ""}
              {item.brand ? ` · ${item.brand}` : ""}
            </p>
          </div>

          {/* Valuation */}
          <div className="glass rounded-2xl p-5">
            <div className="grid grid-cols-2 gap-4">
              <Stat icon={Wallet} label="Estimated Value" value={item.estimatedValue !== null ? formatCurrency(item.estimatedValue) : "—"} />
              <Stat icon={Wallet} label="Purchase Price" value={item.purchasePrice !== null ? formatCurrency(item.purchasePrice) : "—"} />
              <Stat icon={ShieldCheck} label="Authentication" value={item.isAuthenticated ? "Verified" : "Not verified"} />
              <Stat icon={Layers} label="Status" value={item.status} />
            </div>
          </div>

          {/* Condition & grading */}
          {(item.condition || item.gradingCompany) && (
            <div className="glass rounded-2xl p-5">
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500">Condition & Grading</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {item.condition && (
                  <div>
                    <p className="text-xs text-gray-500">Condition</p>
                    <p>{item.condition}</p>
                  </div>
                )}
                {item.gradingCompany && (
                  <div>
                    <p className="text-xs text-gray-500">Grade</p>
                    <p>{item.gradingCompany} {item.grade ?? ""}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {item.notes && (
            <div className="glass rounded-2xl p-5">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">Notes</p>
              <p className="text-sm text-gray-300">{item.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Related collectibles */}
      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-4 text-sm font-medium text-gray-400">Also in your collection</h2>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
            {related.slice(0, 6).map(({ collectible, reason }) => (
              <Link key={collectible.id} href={`/collection/${collectible.id}`} title={reason}>
                <motion.div
                  whileHover={{ y: -3 }}
                  className="glass overflow-hidden rounded-xl"
                >
                  <div className="relative aspect-square bg-white/5">
                    {collectible.images[0] && (
                      <Image
                        src={collectible.images[0].publicUrl}
                        alt={collectible.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    )}
                  </div>
                  <p className="truncate px-2 py-1.5 text-[11px] text-gray-400">{collectible.title}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ icon, label, value }: { icon: typeof Wallet; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5">
        <Icon icon={icon} size="button" className="text-gray-500" decorative />
        <p className="text-xs text-gray-500">{label}</p>
      </div>
      <p className="mt-0.5 text-sm font-medium">{value}</p>
    </div>
  );
}
