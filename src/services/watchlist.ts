import type {
  Watchlist,
  WatchlistItem,
  MarketAlert,
  AlertStatus,
  // ✅ FIX: Removed unused 'AlertType' and 'AlertConfig'
} from "@/types/market";
// ✅ FIX: Removed unused 'CollectibleCategory' import entirely

const demoWatchlists: Watchlist[] = [
  {
    id: "wl-1",
    name: "Grail Cards",
    description: "High-value trading cards I'm tracking",
    itemCount: 3,
    items: [
      {
        id: "wli-1",
        watchlistId: "wl-1",
        title: "1st Edition Charizard PSA 9",
        category: "TRADING_CARD",
        targetPrice: 15000,
        desiredCondition: "Near Mint",
        notes: "Watching for auction opportunities",
        priority: "high",
        currentPrice: 18500,
        priceHistory: generateDemoPriceHistory(18500),
        aiWatchScore: 72,
        opportunityScore: 45,
        addedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        lastChecked: new Date().toISOString(),
      },
      {
        id: "wli-2",
        watchlistId: "wl-1",
        title: "Black Lotus (Revised)",
        category: "TRADING_CARD",
        targetPrice: 5000,
        desiredCondition: "Excellent",
        notes: null,
        priority: "medium",
        currentPrice: 6200,
        priceHistory: generateDemoPriceHistory(6200),
        aiWatchScore: 58,
        opportunityScore: 35,
        addedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        lastChecked: new Date().toISOString(),
      },
      {
        id: "wli-3",
        watchlistId: "wl-1",
        title: "Pikachu Illustrator",
        category: "TRADING_CARD",
        targetPrice: null,
        desiredCondition: null,
        notes: "Research only — extremely rare",
        priority: "low",
        currentPrice: null,
        priceHistory: [],
        aiWatchScore: 30,
        opportunityScore: 10,
        addedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        lastChecked: null,
      },
    ],
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "wl-2",
    name: "Vintage Watches",
    description: "Timepieces under consideration",
    itemCount: 2,
    items: [
      {
        id: "wli-4",
        watchlistId: "wl-2",
        title: "Omega Speedmaster Pre-Moon",
        category: "WATCH",
        targetPrice: 8000,
        desiredCondition: "Good",
        notes: "Prefer with original bracelet",
        priority: "high",
        currentPrice: 9500,
        priceHistory: generateDemoPriceHistory(9500),
        aiWatchScore: 65,
        opportunityScore: 52,
        addedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        lastChecked: new Date().toISOString(),
      },
      {
        id: "wli-5",
        watchlistId: "wl-2",
        title: "Seiko 6139 Pogue",
        category: "WATCH",
        targetPrice: 1500,
        desiredCondition: "Very Good",
        notes: null,
        priority: "medium",
        currentPrice: 1800,
        priceHistory: generateDemoPriceHistory(1800),
        aiWatchScore: 70,
        opportunityScore: 60,
        addedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        lastChecked: new Date().toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const demoAlerts: MarketAlert[] = [
  {
    id: "alert-1",
    type: "price_increase",
    title: "Vintage Pokémon cards up 14% this quarter",
    description: "Your Trading Card holdings are benefiting from sustained demand for vintage holos.",
    status: "unread",
    severity: "medium",
    category: "TRADING_CARD",
    collectibleId: null,
    data: { changePct: 14 },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    readAt: null,
  },
  {
    id: "alert-2",
    type: "price_drop",
    title: "Basketball rookie cards softening",
    description: "Sports Card category showing -3% decline after a strong run.",
    status: "unread",
    severity: "low",
    category: "SPORTS_CARD",
    collectibleId: null,
    data: { changePct: -3 },
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    readAt: null,
  },
  {
    id: "alert-3",
    type: "wishlist_opportunity",
    title: "Omega Speedmaster listed below target",
    description: "A Pre-Moon Speedmaster was listed at $7,800 — below your $8,000 target.",
    status: "unread",
    severity: "high",
    category: "WATCH",
    collectibleId: null,
    data: { listedPrice: 7800, targetPrice: 8000 },
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    readAt: null,
  },
  {
    id: "alert-4",
    type: "category_trend",
    title: "Comics gaining early momentum",
    description: "Silver Age comics search volume growing — early signal before price movement.",
    status: "read",
    severity: "low",
    category: "COMIC",
    collectibleId: null,
    data: { changePct: 6 },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    readAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export async function getWatchlists(userId: string, demo: boolean): Promise<Watchlist[]> {
  // ✅ FIX: Added void statement to mark parameter as intentionally unused
  void userId;
  if (demo) return demoWatchlists;
  return [];
}

export async function getWatchlist(userId: string, watchlistId: string, demo: boolean): Promise<Watchlist | null> {
  // ✅ FIX: Added void statement to mark parameter as intentionally unused
  void userId;
  if (demo) return demoWatchlists.find((w) => w.id === watchlistId) ?? null;
  return null;
}

export async function getAlerts(userId: string, demo: boolean): Promise<MarketAlert[]> {
  // ✅ FIX: Added void statement to mark parameter as intentionally unused
  void userId;
  if (demo) return demoAlerts;
  return [];
}

export async function getUnreadAlertCount(userId: string, demo: boolean): Promise<number> {
  // ✅ FIX: Added void statement to mark parameter as intentionally unused
  void userId;
  if (demo) return demoAlerts.filter((a) => a.status === "unread").length;
  return 0;
}

export async function updateAlertStatus(
  userId: string,
  alertId: string,
  status: AlertStatus,
  demo: boolean
): Promise<MarketAlert | null> {
  // ✅ FIX: Added void statement to mark parameter as intentionally unused
  void userId;
  if (demo) {
    const alert = demoAlerts.find((a) => a.id === alertId);
    if (!alert) return null;
    return { ...alert, status, readAt: status === "read" ? new Date().toISOString() : alert.readAt };
  }
  return null;
}

function generateDemoPriceHistory(currentPrice: number): WatchlistItem["priceHistory"] {
  const points = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000);
    const fluctuation = 1 + (Math.sin(i * 0.7) * 0.05);
    points.push({
      date: date.toISOString(),
      value: Math.round(currentPrice * fluctuation * (0.9 + i * 0.02)),
      source: "Demonstration data",
      confidence: 0.6,
    });
  }
  return points;
}