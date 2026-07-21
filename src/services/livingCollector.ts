import type {
  EvolutionEvent,
  EvolutionEventType,
  LivingCollectorState,
} from "@/types/heatmap";

const EVOLUTION_SEQUENCE: EvolutionEventType[] = [
  "memory_updated",
  "dna_recalculated",
  "replay_snapshot",
  "achievement_unlocked",
  "twin_updated",
  "dashboard_refreshed",
  "legacy_updated",
  "animation_complete",
];

const STEP_LABELS: Record<EvolutionEventType, string> = {
  memory_updated: "Memory Updated",
  dna_recalculated: "DNA Recalculated",
  replay_snapshot: "Replay Snapshot Created",
  achievement_unlocked: "Achievement Check",
  twin_updated: "Twin Updated",
  dashboard_refreshed: "Dashboard Refreshed",
  legacy_updated: "Legacy Updated",
  animation_complete: "Evolution Complete",
};

export function createInitialLivingState(): LivingCollectorState {
  return {
    isEvolving: false,
    currentStep: null,
    events: [],
    lastEvolution: null,
    evolutionCount: 0,
  };
}

export function startEvolution(state: LivingCollectorState): LivingCollectorState {
  return {
    ...state,
    isEvolving: true,
    currentStep: EVOLUTION_SEQUENCE[0]!,
    events: [],
  };
}

export function advanceEvolution(
  state: LivingCollectorState,
  completedStep: EvolutionEventType,
  data?: Record<string, unknown>
): LivingCollectorState {
  if (!state.isEvolving) return state;

  const event: EvolutionEvent = {
    id: `ev-${Date.now()}-${completedStep}`,
    type: completedStep,
    label: STEP_LABELS[completedStep],
    timestamp: new Date().toISOString(),
    data,
  };

  const currentIndex = EVOLUTION_SEQUENCE.indexOf(completedStep);
  const nextIndex = currentIndex + 1;
  const isComplete = nextIndex >= EVOLUTION_SEQUENCE.length;

  return {
    isEvolving: !isComplete,
    currentStep: isComplete ? null : EVOLUTION_SEQUENCE[nextIndex]!,
    events: [...state.events, event],
    lastEvolution: isComplete ? new Date().toISOString() : state.lastEvolution,
    evolutionCount: isComplete ? state.evolutionCount + 1 : state.evolutionCount,
  };
}

export function getEvolutionProgress(state: LivingCollectorState): {
  step: number;
  total: number;
  percent: number;
  label: string;
} {
  if (!state.isEvolving || !state.currentStep) {
    return { step: 0, total: EVOLUTION_SEQUENCE.length, percent: 0, label: "Idle" };
  }

  const stepIndex = EVOLUTION_SEQUENCE.indexOf(state.currentStep);
  return {
    step: stepIndex + 1,
    total: EVOLUTION_SEQUENCE.length,
    percent: Math.round(((stepIndex) / EVOLUTION_SEQUENCE.length) * 100),
    label: STEP_LABELS[state.currentStep],
  };
}

export function runFullEvolution(
  trigger: string,
  stepResults?: Partial<Record<EvolutionEventType, Record<string, unknown>>>
): LivingCollectorState {
  let state = createInitialLivingState();
  state = startEvolution(state);

  for (const step of EVOLUTION_SEQUENCE) {
    state = advanceEvolution(state, step, stepResults?.[step] ?? { trigger });
  }

  return state;
}

export function getEvolutionSequence(): { type: EvolutionEventType; label: string }[] {
  return EVOLUTION_SEQUENCE.map((type) => ({ type, label: STEP_LABELS[type] }));
}

export function shouldTriggerEvolution(eventType: string): boolean {
  const triggers = [
    "collectible_added",
    "collectible_updated",
    "memory_created",
    "memory_updated",
    "conversation_completed",
    "image_analyzed",
    "authentication_verified",
  ];
  return triggers.includes(eventType);
}
