"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Search } from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";

interface HistoryItem {
  id: string;
  imageUrl: string | null;
  identification: string;
  category: string | null;
  confidenceScore: number;
  createdAt: string;
}

export function AnalysisHistory() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/images/history")
      .then((r) => r.json())
      .then((data) => setItems(data.history ?? []))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = query
    ? items.filter((i) => i.identification.toLowerCase().includes(query.toLowerCase()))
    : items;

  return (
    <div>
      <div className="relative mb-3">
        <Icon
          icon={Search}
          size="button"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search history"
          className="w-full rounded-xl bg-white/5 border border-white/10 py-2 pl-9 pr-3 text-xs outline-none focus:border-primary"
        />
      </div>

      {isLoading && <p className="text-xs text-gray-500">Loading...</p>}
      {!isLoading && filtered.length === 0 && <p className="text-xs text-gray-500">No analyses yet.</p>}

      <div className="space-y-1.5">
        {filtered.map((item) => (
          <div key={item.id} className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-white/5">
            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-md bg-white/5">
              {item.imageUrl && (
                <Image
                  src={item.imageUrl}
                  alt={item.identification}
                  fill
                  className="object-cover"
                  unoptimized
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs text-gray-300">{item.identification}</p>
              <p className="text-[11px] text-gray-500">
                {item.confidenceScore}% · {new Date(item.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
