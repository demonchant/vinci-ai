import { ScanSearch, ShieldCheck, AlertCircle, BadgeCheck } from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";
import { groupEvidenceByCategory } from "@/services/imageEvidence";
import type { EvidenceObservation } from "@/types/imageAnalysis";

const CATEGORY_META = {
  identification: { icon: ScanSearch, label: "Identification", color: "text-accent" },
  condition: { icon: BadgeCheck, label: "Condition", color: "text-primary" },
  authenticity: { icon: ShieldCheck, label: "Authenticity", color: "text-success" },
  concern: { icon: AlertCircle, label: "Concerns", color: "text-yellow-400" },
} as const;

export function EvidencePanel({ evidence }: { evidence: EvidenceObservation[] }) {
  const groups = groupEvidenceByCategory(evidence);

  if (evidence.length === 0) {
    return <p className="text-xs text-gray-500">No specific evidence points were detected.</p>;
  }

  return (
    <div className="space-y-4">
      {(Object.keys(groups) as (keyof typeof groups)[]).map((key) => {
        const items = groups[key];
        if (items.length === 0) return null;
        const meta = CATEGORY_META[key];
        return (
          <div key={key}>
            <div className="flex items-center gap-1.5">
              <Icon icon={meta.icon} size="button" className={meta.color} />
              <p className="text-xs font-medium text-gray-300">{meta.label}</p>
            </div>
            <ul className="mt-1.5 space-y-1.5">
              {items.map((item, i) => (
                <li key={i} className="flex items-start justify-between gap-2 text-xs text-gray-400">
                  <span className="flex items-start gap-1.5">
                    <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-gray-600" />
                    {item.text}
                  </span>
                  <span className="shrink-0 text-gray-600">{item.confidence}%</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
