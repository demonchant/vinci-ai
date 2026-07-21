"use client";

import { useEffect, useState } from "react";
import type { CheckpointWithReasoning } from "@/types/checkpoint";
import { WhyChangedPanel } from "../why-changed/WhyChangedPanel";

export function CheckpointCard({ checkpointId }: { checkpointId: string }) {
  const [data, setData] = useState<CheckpointWithReasoning | null>(null);

  useEffect(() => {
    fetch(`/api/checkpoints/${checkpointId}`)
      .then((r) => r.json())
      .then((res) => setData(res.checkpoint ?? null));
  }, [checkpointId]);

  if (!data) {
    return <div className="h-24 animate-pulse rounded-lg bg-white/5" />;
  }

  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
      <p className="text-xs text-gray-400">{data.aiSummary || data.checkpointDescription}</p>

      <div className="mt-2 flex items-center gap-2 text-[11px] text-gray-500">
        <span>Confidence</span>
        <div className="h-1 flex-1 rounded-full bg-white/5">
          <div className="h-1 rounded-full bg-vinci-aurora" style={{ width: `${data.confidence}%` }} />
        </div>
        <span>{data.confidence}%</span>
      </div>

      <WhyChangedPanel checkpoint={data} />
    </div>
  );
}
