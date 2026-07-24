"use client";
import { motion } from "framer-motion";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import type { CompassPosition } from "@/types/replay";

export function CollectorCompass({
  current,
  previous,
  recentShift,
}: {
  current: CompassPosition | null;
  previous: CompassPosition | null;
  recentShift: { from: string; to: string; reason: string } | null;
}) {
  if (!current) {
    return (
      <p className="text-sm text-gray-500">
        Compass data appears after the first DNA snapshot.
      </p>
    );
  }

  // ✅ FIX APPLIED HERE: Merge datasets into one array for Recharts
  const chartData = Object.entries(current.axes).map(([axis, value]) => ({
    axis,
    current: value,
    previous: previous?.axes[axis as keyof typeof previous.axes] ?? 0,
  }));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">Dominant Axis</p>
          <motion.p
            key={current.dominantAxis}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-display text-lg text-gradient"
          >
            {current.dominantAxis}
          </motion.p>
        </div>
        {recentShift && (
          <div className="text-right">
            <p className="text-[11px] text-gray-500">Recent Shift</p>
            <p className="text-xs text-accent">
              {recentShift.from} → {recentShift.to}
            </p>
          </div>
        )}
      </div>

      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData}>
            <defs>
              <linearGradient id="compassFill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#00D4FF" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#6D5DFB" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <PolarGrid stroke="rgba(255,255,255,0.05)" />
            <PolarAngleAxis dataKey="axis" tick={{ fill: "#71717A", fontSize: 9 }} />
            
            {/* ✅ FIX APPLIED HERE: Use dataKey instead of passing a data prop */}
            <Radar
              name="Previous"
              dataKey="previous"
              stroke="rgba(255,255,255,0.2)"
              fill="transparent"
              strokeDasharray="3 3"
              dot={false}
            />
            
            <Radar
              name="Current"
              dataKey="current"
              stroke="#00D4FF"
              fill="url(#compassFill)"
              strokeWidth={2}
              dot={false}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      {recentShift && <p className="text-[11px] text-gray-500">{recentShift.reason}</p>}
    </div>
  );
}