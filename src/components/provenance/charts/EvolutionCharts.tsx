"use client";

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { extractConfidenceSeries, extractValueSeries } from "@/services/provenanceTimeline";
import type { ProvenanceEvent } from "@/types/provenance";

export function ConfidenceEvolutionChart({ events }: { events: ProvenanceEvent[] }) {
  const series = extractConfidenceSeries(events);

  if (series.length < 2) {
    return (
      <p className="text-xs text-gray-500">
        Confidence history will appear after this item has been analyzed more than once.
      </p>
    );
  }

  return (
    <div className="h-32 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={series}>
          <XAxis dataKey="date" hide />
          <YAxis domain={[0, 100]} hide />
          <Tooltip
            contentStyle={{
              background: "#111113",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
            }}
            labelFormatter={(d) => new Date(d).toLocaleDateString()}
          />
          <Line type="monotone" dataKey="confidence" stroke="#6D5DFB" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ValueHistoryChart({ events }: { events: ProvenanceEvent[] }) {
  const series = extractValueSeries(events);

  if (series.length === 0) {
    return <p className="text-xs text-gray-500">Historical market data unavailable.</p>;
  }

  return (
    <div className="h-32 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={series}>
          <XAxis dataKey="date" hide />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              background: "#111113",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
            }}
            labelFormatter={(d) => new Date(d).toLocaleDateString()}
          />
          <Line type="monotone" dataKey="max" stroke="#00D4FF" strokeWidth={2} dot={{ r: 3 }} />
          <Line
            type="monotone"
            dataKey="min"
            stroke="#00D4FF"
            strokeWidth={1}
            strokeDasharray="4 4"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
