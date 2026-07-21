import Link from "next/link";
import { BentoCard } from "./BentoCard";
import { Upload, MessageSquare, Fingerprint, ScanSearch } from "@/components/ui/icons";
import { FeatureIcon } from "@/components/ui/icon-components";

const ONBOARDING_STEPS = [
  { href: "/collection", icon: Upload, title: "Upload your first collectible", note: "Start building your collection." },
  { href: "/chat", icon: MessageSquare, title: "Start an AI chat", note: "Ask Vinci AI anything about collecting." },
  { href: "/chat", icon: ScanSearch, title: "Analyze your first image", note: "Get instant identification and condition notes." },
  { href: "/dna", icon: Fingerprint, title: "Build your Collector DNA", note: "Your profile grows as you use Vinci AI." },
];

export function DashboardEmptyState() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {ONBOARDING_STEPS.map((step) => (
        <Link key={step.title} href={step.href}>
          <BentoCard className="h-full">
            <FeatureIcon icon={step.icon} />
            <p className="mt-4 font-medium">{step.title}</p>
            <p className="mt-1 text-sm text-gray-500">{step.note}</p>
          </BentoCard>
        </Link>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="h-40 animate-pulse rounded-2xl bg-white/5" />
      ))}
    </div>
  );
}
