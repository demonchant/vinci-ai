import type { MarketAlert, AlertType } from "@/types/market";

export async function createAlert(
  _userId: string,
  alert: Omit<MarketAlert, "id" | "createdAt" | "readAt">
): Promise<MarketAlert> {
  return {
    ...alert,
    id: `alert-${Date.now()}`,
    createdAt: new Date().toISOString(),
    readAt: null,
  };
}

export function shouldTriggerAlert(
  type: AlertType,
  threshold: number | undefined,
  currentValue: number
): boolean {
  if (threshold === undefined) return false;

  switch (type) {
    case "price_increase":
      return currentValue >= threshold;
    case "price_drop":
      return currentValue <= -threshold;
    case "portfolio_threshold":
      return Math.abs(currentValue) >= threshold;
    case "confidence_change":
      return Math.abs(currentValue) >= (threshold / 100);
    default:
      return false;
  }
}
