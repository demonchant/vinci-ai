"use client";

import { useState } from "react";
import { AchievementCard } from "./AchievementCard";
import type { AchievementBadge } from "@/types/dna"; // ✅ Import shared type instead of defining locally

type Filter = "all" | "unlocked" | "locked";

export function AchievementWall({ achievements }: { achievements: AchievementBadge[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = achievements.filter((a) => {
    if (filter === "unlocked") return a.isUnlocked;
    if (filter === "locked") return !a.isUnlocked;
    return true;
  });

  const unlockedXP = achievements.filter((a) => a.isUnlocked).reduce((s, a) => s + a.xp, 0);
  const totalXP = achievements.reduce((s, a) => s + a.xp, 0);

  return (
    <div className="space-y-4">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs text-gray-500">
          {achievements.filter((a) => a.isUnlocked).length} / {achievements.length} unlocked ·{" "}
          {unlockedXP} / {totalXP} XP
        </p>
        <div className="flex gap-1 rounded-lg bg-white/5 p-1">
          {(["all", "unlocked", "locked"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-md px-2.5 py-1 text-xs capitalize transition ${
                filter === f ? "bg-primary text-white" : "text-gray-400"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {/* ✅ FIX: Destructure 'key' to prevent React prop collision, and provide fallback for 'tier' */}
        {filtered.map(({ key, ...achievement }, i) => (
          <AchievementCard
            key={key}
            {...achievement}
            // ✅ Fallback to "bronze" if tier is missing/undefined
            index={i}
          />
        ))}
      </div>
    </div>
  );
}