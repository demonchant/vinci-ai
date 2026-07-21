import { TrendingUp, AlertCircle, Info } from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";
import type { PredictionResult } from "@/types/replay";

export function PredictionsPanel({ predictions }: { predictions: PredictionResult }) {
  if (!predictions.available) {
    return (
      <div className="glass rounded-2xl p-4">
        <div className="mb-2 flex items-center gap-2">
          <Icon icon={AlertCircle} size="button" className="text-gray-500" decorative />
          <p className="text-xs font-medium text-gray-400">Evolution Forecasts</p>
        </div>
        <p className="text-xs text-gray-500">{predictions.reason}</p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-primary/40"
            style={{
              width: `${Math.min(100, Math.round((predictions.snapshotsPresent / predictions.snapshotsRequired) * 100))}%`,
            }}
          />
        </div>
        <p className="mt-1 text-[11px] text-gray-600">
          {predictions.snapshotsPresent} / {predictions.snapshotsRequired} snapshots
        </p>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl space-y-3 p-4">
      <div className="flex items-center gap-2">
        <Icon icon={TrendingUp} size="button" className="text-accent" decorative />
        <p className="text-xs font-medium text-gray-300">30-Day Forecasts</p>
        <span className="ml-auto rounded-full bg-accent/20 px-2 py-0.5 text-[11px] text-accent">
          Forecast
        </span>
      </div>

      <div className="space-y-2">
        {predictions.traitForecasts.slice(0, 5).map((t) => (
          <div key={t.trait} className="flex items-center justify-between text-xs">
            <span className="capitalize text-gray-400">{t.trait}</span>
            <span
              className={
                t.predictedChange > 0
                  ? "text-success"
                  : t.predictedChange < 0
                    ? "text-red-400"
                    : "text-gray-500"
              }
            >
              {t.predictedChange > 0 ? "+" : ""}
              {t.predictedChange} ({t.confidence}% conf.)
            </span>
          </div>
        ))}
      </div>

      {predictions.archetypeShiftProbability.length > 0 && (
        <div>
          <p className="mb-1.5 text-[11px] text-gray-500">Likely Archetype</p>
          {predictions.archetypeShiftProbability.slice(0, 2).map((a) => (
            <div key={a.type} className="flex items-center justify-between text-xs">
              <span className="text-gray-400">{a.type}</span>
              <span className="text-gray-300">{a.probability}%</span>
            </div>
          ))}
        </div>
      )}

      <p className="flex items-start gap-1 text-[11px] text-gray-600">
        <Icon icon={Info} size={11} className="mt-0.5 shrink-0" decorative />
        {predictions.disclaimer}
      </p>
    </div>
  );
}
