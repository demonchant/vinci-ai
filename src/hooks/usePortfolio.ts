"use client";

import { useState, useEffect, useCallback } from "react";
import type { PortfolioValuation, PortfolioRisk, DiversificationAnalysis } from "@/types/market";

export function usePortfolio() {
  const [valuation, setValuation] = useState<PortfolioValuation | null>(null);
  const [risk, setRisk] = useState<PortfolioRisk | null>(null);
  const [diversification, setDiversification] = useState<DiversificationAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/market/valuation");
      if (!res.ok) throw new Error("Failed to load portfolio valuation");
      const data = await res.json();
      setValuation(data.valuation);
      setRisk(data.risk);
      setDiversification(data.diversification);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { valuation, risk, diversification, isLoading, error, refresh };
}
