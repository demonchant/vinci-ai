"use client";

import { Sparkles, Check, X } from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";

interface Suggestion {
  id: string;
  suggestedLabel: string;
  suggestedValue: unknown;
  reason: string;
}

export function SuggestionsPanel({
  suggestions,
  demo,
  onResolve,
}: {
  suggestions: Suggestion[];
  demo: boolean;
  onResolve: (id: string, action: "accept" | "ignore" | "never_ask") => void;
}) {
  if (suggestions.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        No suggestions right now — Vinci AI proposes new memories here as patterns emerge from your
        activity.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {suggestions.map((s) => (
        <div key={s.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
          <div className="flex items-start gap-2">
            <Icon icon={Sparkles} size="card" className="mt-0.5 text-accent" />
            <div className="flex-1">
              <p className="text-sm">
                Should I remember <span className="font-medium text-white">{s.suggestedLabel}</span> as{" "}
                <span className="font-medium text-white">{String(s.suggestedValue)}</span>?
              </p>
              <p className="mt-1 text-xs text-gray-500">{s.reason}</p>
              {!demo && (
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => onResolve(s.id, "accept")}
                    className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white"
                  >
                    <Icon icon={Check} size={13} /> Accept
                  </button>
                  <button
                    onClick={() => onResolve(s.id, "ignore")}
                    className="rounded-lg bg-white/5 px-3 py-1.5 text-xs text-gray-300 hover:bg-white/10"
                  >
                    Ignore
                  </button>
                  <button
                    onClick={() => onResolve(s.id, "never_ask")}
                    className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs text-gray-500 hover:text-gray-300"
                  >
                    <Icon icon={X} size={13} /> Never ask again
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
