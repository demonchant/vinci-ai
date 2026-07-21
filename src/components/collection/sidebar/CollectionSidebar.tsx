"use client";

import { useEffect, useState } from "react";
import { FolderOpen, Bookmark, Archive } from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";
import { COLLECTIBLE_CATEGORY_LABELS, type CollectibleCategory } from "@/types/common";
import type { CollectionFilters } from "@/types/collection";

interface SidebarProps {
  filters: CollectionFilters;
  onUpdate: <K extends keyof CollectionFilters>(key: K, value: CollectionFilters[K]) => void;
  onClear: () => void;
}

export function CollectionSidebar({ filters, onUpdate, onClear }: SidebarProps) {
  const [collections, setCollections] = useState<{ id: string; name: string; itemCount: number }[]>([]);
  const [tags, setTags] = useState<{ id: string; name: string; color: string; itemCount: number }[]>([]);

  useEffect(() => {
    fetch("/api/collection/collections")
      .then((r) => r.json())
      .then((d) => setCollections(d.collections ?? []));
    fetch("/api/collection/tags")
      .then((r) => r.json())
      .then((d) => setTags(d.tags ?? []));
  }, []);

  return (
    <aside className="w-64 shrink-0 space-y-6 overflow-y-auto border-r border-white/5 p-4 scrollbar-thin">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Filters</p>
        {Object.keys(filters).length > 0 && (
          <button onClick={onClear} className="text-xs text-accent hover:underline">
            Clear
          </button>
        )}
      </div>

      <FilterGroup label="Status">
        <FilterChip label="All" active={!filters.status} onClick={() => onUpdate("status", undefined)} />
        <FilterChip
          label="Owned"
          active={filters.status === "OWNED"}
          onClick={() => onUpdate("status", "OWNED")}
          icon={FolderOpen}
        />
        <FilterChip
          label="Wishlist"
          active={filters.status === "WISHLIST"}
          onClick={() => onUpdate("status", "WISHLIST")}
          icon={Bookmark}
        />
        <FilterChip
          label="Favorites"
          active={filters.status === "FAVORITE"}
          onClick={() => onUpdate("status", "FAVORITE")}
        />
        <FilterChip
          label="Sold"
          active={filters.status === "SOLD"}
          onClick={() => onUpdate("status", "SOLD")}
          icon={Archive}
        />
      </FilterGroup>

      <FilterGroup label="Category">
        {(Object.keys(COLLECTIBLE_CATEGORY_LABELS) as CollectibleCategory[]).map((cat) => (
          <FilterChip
            key={cat}
            label={COLLECTIBLE_CATEGORY_LABELS[cat]}
            active={filters.category === cat}
            onClick={() => onUpdate("category", filters.category === cat ? undefined : cat)}
          />
        ))}
      </FilterGroup>

      <FilterGroup label="Collections">
        {collections.length === 0 && <p className="text-xs text-gray-600">No collections yet.</p>}
        {collections.map((c) => (
          <FilterChip
            key={c.id}
            label={`${c.name} (${c.itemCount})`}
            active={filters.collectionId === c.id}
            onClick={() => onUpdate("collectionId", filters.collectionId === c.id ? undefined : c.id)}
          />
        ))}
      </FilterGroup>

      <FilterGroup label="Tags">
        {tags.length === 0 && <p className="text-xs text-gray-600">No tags yet.</p>}
        {tags.map((t) => {
          const active = filters.tagIds?.includes(t.id) ?? false;
          return (
            <button
              key={t.id}
              onClick={() =>
                onUpdate(
                  "tagIds",
                  active
                    ? filters.tagIds?.filter((id) => id !== t.id)
                    : [...(filters.tagIds ?? []), t.id]
                )
              }
              className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition ${
                active ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5"
              }`}
            >
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: t.color }} />
              {t.name} ({t.itemCount})
            </button>
          );
        })}
      </FilterGroup>

      <FilterGroup label="Authenticity">
        <FilterChip
          label="Authenticated"
          active={filters.isAuthenticated === true}
          onClick={() => onUpdate("isAuthenticated", filters.isAuthenticated === true ? undefined : true)}
        />
        <FilterChip
          label="Unverified"
          active={filters.isAuthenticated === false}
          onClick={() =>
            onUpdate("isAuthenticated", filters.isAuthenticated === false ? undefined : false)
          }
        />
      </FilterGroup>
    </aside>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-gray-600">{label}</p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
  icon,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  icon?: typeof FolderOpen;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition ${
        active ? "bg-primary/20 text-primary" : "text-gray-400 hover:bg-white/5"
      }`}
    >
      {icon && <Icon icon={icon} size={13} decorative />}
      {label}
    </button>
  );
}
