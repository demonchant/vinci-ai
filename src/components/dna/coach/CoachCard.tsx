import type { CoachCard as CoachCardType } from "@/services/dnaCoach";

const SECTIONS = [
  { key: "strengths" as const, label: "Strengths", color: "text-success", dot: "bg-success" },
  {
    key: "weaknesses" as const,
    label: "Areas to Improve",
    color: "text-yellow-400",
    dot: "bg-yellow-400",
  },
  { key: "opportunities" as const, label: "Opportunities", color: "text-accent", dot: "bg-accent" },
  {
    key: "recommendations" as const,
    label: "Recommendations",
    color: "text-primary",
    dot: "bg-primary",
  },
];

export function CoachCard({ coach }: { coach: CoachCardType }) {
  return (
    <div className="space-y-4">
      {SECTIONS.map(({ key, label, color, dot }) => (
        <div key={key}>
          <p className={`mb-1.5 text-xs font-medium ${color}`}>{label}</p>
          <ul className="space-y-1.5">
            {coach[key].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
      <p className="text-[11px] text-gray-600">
        Generated {new Date(coach.generatedAt).toLocaleDateString()}
      </p>
    </div>
  );
}
