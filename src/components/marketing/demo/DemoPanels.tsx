import { Pin, Sparkles, CheckCircle2 } from "@/components/ui/icons";

const WINDOW_CHROME = (
  <div className="mb-4 flex items-center gap-1.5" aria-hidden="true">
    <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
    <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
    <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
  </div>
);

export function ChatDemoPanel() {
  return (
    <div className="glass-strong rounded-2xl p-6">
      {WINDOW_CHROME}
      <div className="space-y-3 text-sm">
        <div className="ml-auto max-w-[80%] rounded-2xl bg-primary px-4 py-2.5 text-white">
          Is this 1998 holo Charizard worth grading?
        </div>
        <div className="max-w-[85%] rounded-2xl bg-white/5 px-4 py-2.5 text-gray-200">
          Since you mostly collect PSA 10 vintage Pokémon under $300, grading this one fits your
          strategy — raw, it shows light edge wear that could land it at PSA 8–9.
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Sparkles className="h-3 w-3 text-accent" /> Personalized using your Collector Memory
        </div>
      </div>
    </div>
  );
}

export function ImageDemoPanel() {
  return (
    <div className="glass-strong rounded-2xl p-6">
      {WINDOW_CHROME}
      <div className="flex gap-4">
        <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-xl bg-white/5 text-xs text-gray-500">
          uploaded photo
        </div>
        <div className="flex-1 space-y-2 text-sm">
          <p className="font-medium">1998 Pokémon Base Set — Charizard (Holo)</p>
          <p className="text-xs text-gray-500">Condition: Near Mint · Confidence: 94%</p>
          <div className="h-1.5 w-full rounded-full bg-white/5">
            <div className="h-1.5 w-[94%] rounded-full bg-vinci-aurora" />
          </div>
          <p className="text-xs text-gray-500">
            Estimated value: $310–$420 ·{" "}
            <span className="text-gray-400">AI estimate, not an appraisal</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export function MemoryDemoPanel() {
  const facts = [
    { label: "Favorite Category", value: "Vintage Pokémon", pinned: true },
    { label: "Budget", value: "$300 / item", pinned: false },
    { label: "Preferred Grading", value: "PSA 10", pinned: true },
  ];
  return (
    <div className="glass-strong rounded-2xl p-6">
      {WINDOW_CHROME}
      <div className="space-y-2">
        {facts.map((f) => (
          <div key={f.label} className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-2.5">
            <div>
              <p className="text-xs text-gray-500">{f.label}</p>
              <p className="text-sm font-medium">{f.value}</p>
            </div>
            <Pin className={`h-4 w-4 ${f.pinned ? "text-accent" : "text-gray-600"}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DNADemoPanel() {
  return (
    <div className="glass-strong rounded-2xl p-6">
      {WINDOW_CHROME}
      <div className="flex items-center gap-6">
        <div>
          <p className="text-xs text-gray-500">Collector DNA</p>
          <p className="text-4xl font-semibold text-gradient">87</p>
        </div>
        <div className="flex flex-1 flex-wrap gap-2">
          <span className="rounded-full bg-primary/20 px-3 py-1 text-xs text-primary">Investor</span>
          <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-gray-300">Historian</span>
        </div>
      </div>
      <p className="mt-4 text-xs text-gray-500">
        Quality-focused, research-driven — your collection skews vintage and authenticated.
      </p>
    </div>
  );
}

export function ReplayDemoPanel() {
  return (
    <div className="glass-strong rounded-2xl p-6">
      {WINDOW_CHROME}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Jan</span>
        <span>Apr</span>
        <span>Today</span>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-white/5">
        <div className="h-1.5 w-[78%] rounded-full bg-vinci-aurora" />
      </div>
      <div className="mt-4 flex items-center gap-2 text-sm">
        <CheckCircle2 className="h-4 w-4 text-success" />
        Explorer → Investor-Historian, driven by 5 authenticated vintage additions
      </div>
    </div>
  );
}

export function LegacyDemoPanel() {
  return (
    <div className="glass-strong rounded-2xl p-6">
      {WINDOW_CHROME}
      <p className="font-display text-lg">Collector Legacy Report</p>
      {/* ✅ FIX: Escaped quotes */}
      <p className="mt-2 text-sm text-gray-400">
        &quot;You began as an Explorer driven by curiosity. Today you collect with the discipline of an
        Investor and the depth of a Historian.&quot;
      </p>
      <div className="mt-4 flex gap-2 text-xs text-gray-500">
        <span className="rounded-full bg-white/5 px-3 py-1">DNA Score 87</span>
        <span className="rounded-full bg-white/5 px-3 py-1">12 Achievements</span>
      </div>
    </div>
  );
}