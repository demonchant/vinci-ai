import Link from "next/link";
import { Database, Fingerprint, CircleCheck, Wallet } from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";

export function MemoryUpdateCard({
  changes,
}: {
  changes: { label: string; value: string }[];
}) {
  return (
    <div className="glass max-w-md rounded-xl p-4">
      <div className="flex items-center gap-2">
        <Icon icon={Database} size="card" className="text-secondary" />
        <p className="text-sm font-medium">Collector Memory Updated</p>
      </div>
      <ul className="mt-2 space-y-1">
        {changes.map((c) => (
          <li key={c.label} className="flex items-center gap-1.5 text-xs text-gray-400">
            <Icon icon={CircleCheck} size="button" className="text-success" />
            {c.label} learned: <span className="text-gray-200">{c.value}</span>
          </li>
        ))}
      </ul>
      <Link href="/memory" className="mt-3 inline-block text-xs text-accent hover:underline">
        Manage Memory →
      </Link>
    </div>
  );
}

export function DNAUpdateCard({
  scoreBefore,
  scoreAfter,
  changes,
}: {
  scoreBefore: number;
  scoreAfter: number;
  changes: { metric: string; delta: number }[];
}) {
  return (
    <div className="glass max-w-md rounded-xl p-4">
      <div className="flex items-center gap-2">
        <Icon icon={Fingerprint} size="card" className="text-primary" />
        <p className="text-sm font-medium">Collector DNA Updated</p>
      </div>
      <p className="mt-2 text-2xl font-display">
        {scoreBefore} <span className="text-gray-500">→</span> {scoreAfter}
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {changes.map((c) => (
          <span key={c.metric} className="rounded-full bg-primary/15 px-2 py-1 text-[11px] text-primary">
            {c.metric} {c.delta > 0 ? "+" : ""}
            {c.delta}
          </span>
        ))}
      </div>
      <Link href="/dna" className="mt-3 inline-block text-xs text-accent hover:underline">
        View DNA →
      </Link>
    </div>
  );
}

export function CollectibleCard({
  title,
  category,
  estimatedValue,
  confidence,
}: {
  title: string;
  category: string;
  estimatedValue: string | null;
  confidence: number;
}) {
  return (
    <div className="glass max-w-md rounded-xl p-4">
      <div className="flex items-center gap-2">
        <Icon icon={Wallet} size="card" className="text-accent" />
        <p className="text-sm font-medium">{title}</p>
      </div>
      <p className="mt-1 text-xs text-gray-500">{category}</p>
      {estimatedValue && (
        <p className="mt-2 text-sm text-gray-300">
          Estimated value: {estimatedValue}{" "}
          <span className="text-xs text-gray-500">(AI estimate)</span>
        </p>
      )}
      <div className="mt-2 h-1 rounded-full bg-white/5">
        <div className="h-1 rounded-full bg-vinci-aurora" style={{ width: `${confidence}%` }} />
      </div>
      <p className="mt-1 text-xs text-gray-500">{confidence}% confidence</p>
    </div>
  );
}
