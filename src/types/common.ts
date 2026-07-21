export type CollectibleCategory =
  | "TRADING_CARD"
  | "SPORTS_CARD"
  | "COMIC"
  | "WATCH"
  | "SNEAKER"
  | "COIN"
  | "NFT"
  | "FIGURE"
  | "MEMORABILIA"
  | "OTHER";

export const COLLECTIBLE_CATEGORY_LABELS: Record<CollectibleCategory, string> = {
  TRADING_CARD: "Trading Card",
  SPORTS_CARD: "Sports Card",
  COMIC: "Comic",
  WATCH: "Watch",
  SNEAKER: "Sneaker",
  COIN: "Coin",
  NFT: "NFT",
  FIGURE: "Figure",
  MEMORABILIA: "Memorabilia",
  OTHER: "Other",
};

export type CollectibleStatus = "OWNED" | "WISHLIST" | "FAVORITE" | "SOLD" | "PURCHASED";

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ApiError {
  error: string;
  details?: unknown;
}

/** Standard shape for any AI-generated section that must disclose its nature. */
export interface AIGenerated<T> {
  data: T;
  disclaimer: string;
  generatedAt: string;
}
