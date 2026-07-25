"use client";

import { useEffect, useState, useCallback } from "react";
import type { CollectorDNA, Achievement } from "@/types/dna"; // ✅ Added Achievement import
import type { DNAStability, DNAContributor } from "@/services/dnaAnalytics";
import type { CoachCard } from "@/services/dnaCoach";
import type { TraitExplanation } from "@/services/dnaExplainability";

export function useDNA() {
  const [dna, setDNA] = useState<CollectorDNA | null>(null);
  const [stability, setStability] = useState<DNAStability | null>(null);
  const [contributors, setContributors] = useState<DNAContributor[]>([]);
  const [coach, setCoach] = useState<CoachCard | null>(null);
  const [traits, setTraits] = useState<TraitExplanation[]>([]);
  // ✅ FIX APPLIED: Replaced any[] with Achievement[]
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [demo, setDemo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    const [dnaRes, contribRes, coachRes, traitsRes, achievRes] = await Promise.all([
      fetch("/api/dna").then((r) => r.json()),
      fetch("/api/dna/contributors").then((r) => r.json()),
      fetch("/api/dna/coach").then((r) => r.json()),
      fetch("/api/dna/traits").then((r) => r.json()),
      fetch("/api/dna/achievements").then((r) => r.json()),
    ]);

    setDNA(dnaRes.dna ?? null);
    setDemo(Boolean(dnaRes.demo));
    setStability(contribRes.stability ?? null);
    setContributors(contribRes.contributors ?? []);
    setCoach(coachRes.coach ?? null);
    setTraits(traitsRes.traits ?? []);
    setAchievements(achievRes.achievements ?? []);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { dna, stability, contributors, coach, traits, achievements, demo, isLoading, refresh };
}