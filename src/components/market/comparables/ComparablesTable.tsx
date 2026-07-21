"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import type { ComparableSale } from "@/types/market";

interface Props {
  comparables: ComparableSale[];
  title?: string;
}

export function ComparablesTable({ comparables, title }: Props) {
  if (comparables.length === 0) {
    return (
      <div className="glass rounded-xl p-5">
        <h3 className="text-sm font-medium text-gray-400">Comparable Sales</h3>
        <p className="mt-3 text-xs text-gray-500">No comparable sales data available.</p>
      </div>
    );
  }

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="glass rounded-xl p-5">
      <h3 className="text-sm font-medium text-gray-300">
        {title ? `Comparables: ${title}` : "Comparable Sales"}
      </h3>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/5 text-gray-500">
              <th className="pb-2 pr-4 font-medium">Title</th>
              <th className="pb-2 pr-4 font-medium">Date</th>
              <th className="pb-2 pr-4 font-medium">Price</th>
              <th className="pb-2 pr-4 font-medium">Condition</th>
              <th className="pb-2 font-medium">Match</th>
            </tr>
          </thead>
          <tbody>
            {comparables.map((comp) => (
              <tr key={comp.id} className="border-b border-white/[0.03]">
                <td className="py-2 pr-4 text-gray-300">{comp.title}</td>
                <td className="py-2 pr-4 text-gray-400">
                  {new Date(comp.date).toLocaleDateString()}
                </td>
                <td className="py-2 pr-4 font-medium text-gray-200">
                  ${comp.price.toLocaleString()}
                </td>
                <td className="py-2 pr-4 text-gray-400">{comp.condition ?? "—"}</td>
                <td className="py-2">
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-12 rounded-full bg-white/5">
                      <div
                        className="h-1.5 rounded-full bg-primary/60"
                        style={{ width: `${comp.similarityScore * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-gray-500">
                      {Math.round(comp.similarityScore * 100)}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-[10px] text-gray-600">
        Source: {comparables[0]?.source ?? "Unknown"} — Confidence varies by item.
      </p>
    </motion.div>
  );
}
