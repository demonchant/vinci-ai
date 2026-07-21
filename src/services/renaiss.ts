/**
 * services/renaiss.ts
 *
 * Placeholder integration layer for the future Renaiss platform APIs.
 * These methods are intentionally unimplemented (spec-requested placeholders
 * for a third-party API that does not exist yet) — every other service in
 * this codebase is fully implemented against real Supabase/Prisma/OpenAI.
 *
 * When Renaiss APIs become available, implement each method here and the
 * rest of the app (which should call THROUGH this file, never around it)
 * will pick up real data with no call-site changes.
 */

export interface RenaissCollectionItem {
  id: string;
  title: string;
  metadata: Record<string, unknown>;
}

export interface RenaissMarketSnapshot {
  category: string;
  trend: "up" | "down" | "flat";
  changePct: number;
}

export class RenaissNotImplementedError extends Error {
  constructor(method: string) {
    super(
      `Renaiss API method "${method}" is not yet available. This is a planned integration point, not a bug.`
    );
    this.name = "RenaissNotImplementedError";
  }
}

export async function getCollection(_userId: string): Promise<RenaissCollectionItem[]> {
  throw new RenaissNotImplementedError("getCollection");
}

export async function getMarket(_category?: string): Promise<RenaissMarketSnapshot[]> {
  throw new RenaissNotImplementedError("getMarket");
}

export async function getMetadata(_itemId: string): Promise<Record<string, unknown>> {
  throw new RenaissNotImplementedError("getMetadata");
}

export async function verifyOwnership(_userId: string, _itemId: string): Promise<boolean> {
  throw new RenaissNotImplementedError("verifyOwnership");
}

export async function getRWAAssets(_userId: string): Promise<RenaissCollectionItem[]> {
  throw new RenaissNotImplementedError("getRWAAssets");
}
