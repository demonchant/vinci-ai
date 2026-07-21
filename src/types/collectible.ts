import type { CollectibleCategory, CollectibleStatus } from "./common";

export interface CollectibleImage {
  id: string;
  publicUrl: string;
  isPrimary: boolean;
  width: number | null;
  height: number | null;
}

export interface Collectible {
  id: string;
  userId: string;
  collectionId: string | null;
  title: string;
  category: CollectibleCategory;
  status: CollectibleStatus;
  brand: string | null;
  franchise: string | null;
  artist: string | null;
  year: number | null;
  condition: string | null;
  gradingCompany: string | null;
  grade: string | null;
  purchasePrice: number | null;
  estimatedValue: number | null;
  currency: string;
  rarityScore: number | null;
  isAuthenticated: boolean;
  notes: string | null;
  tags: string[];
  purchasedAt: string | null;
  soldAt: string | null;
  createdAt: string;
  updatedAt: string;
  images: CollectibleImage[];
}

export interface CreateCollectibleInput {
  title: string;
  category: CollectibleCategory;
  status?: CollectibleStatus;
  collectionId?: string;
  brand?: string;
  franchise?: string;
  artist?: string;
  year?: number;
  condition?: string;
  gradingCompany?: string;
  grade?: string;
  purchasePrice?: number;
  estimatedValue?: number;
  notes?: string;
  tags?: string[];
  imageUrls?: string[];
}

export interface SimilarCollectible {
  title: string;
  note: string;
}

export interface ImageAnalysisResult {
  id: string;
  imageUrl: string;
  identification: string;
  category: CollectibleCategory | null;
  estimatedRarity: string | null;
  condition: string | null;
  authenticity: string;
  historicalNote: string | null;
  valueRangeLow: number | null;
  valueRangeHigh: number | null;
  confidenceScore: number;
  interestingFact: string | null;
  similarItems: SimilarCollectible[];
  disclaimer: string;
  createdAt: string;
}
