import { ShieldCheck } from "@/components/ui/icons";
import { SectionIcon } from "@/components/ui/icon-components";
import type { MemoryHealth } from "@/services/memoryAnalyticsService";

function HealthBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-400">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="mt-1 h-1.5 rounded-full bg-white/5">
        <div className="h-1.5 rounded-full bg-vinci-aurora" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function MemoryHealthPanel({ health }: { health: MemoryHealth }) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <SectionIcon icon={ShieldCheck} />
        <p className="text-xs text-gray-500">Memory Health</p>
      </div>

      <div className="mt-4 space-y-3">
        <HealthBar label="Completeness" value={health.completeness} />
        <HealthBar label="Consistency" value={health.consistency} />
        <HealthBar label="Coverage" value={health.coverage} />
        <HealthBar label="Freshness" value={health.freshness} />
      </div>

      {health.duplicates.length > 0 && (
        <p className="mt-3 text-xs text-yellow-400">
          {health.duplicates.length} possible duplicate{health.duplicates.length > 1 ? "s" : ""}{" "}
          detected.
        </p>
      )}

      {health.recommendations.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {health.recommendations.map((r, i) => (
            <li key={i} className="flex items-start gap-1.5 text-xs text-gray-400">
              <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-gray-500" />
              {r}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
