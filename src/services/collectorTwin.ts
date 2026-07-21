import type { Collectible } from "@/types/collectible";
import type { CollectorMemoryFact } from "@/types/memory";
import type { CollectorDNA, CollectorArchetype } from "@/types/dna";
import type {
  CollectorTwinProfile,
  TwinPreference,
  TwinBehavior,
  TwinAnswer,
  TwinQuestion,
  TwinCollectibleAssessment,
  TwinEvolutionSnapshot,
} from "@/types/collectorTwin";
import { COLLECTIBLE_CATEGORY_LABELS, type CollectibleCategory } from "@/types/common";

export function buildCollectorTwin(
  collectibles: Collectible[],
  memories: CollectorMemoryFact[],
  dna: CollectorDNA
): CollectorTwinProfile {
  const owned = collectibles.filter((c) => c.status === "OWNED" || c.status === "PURCHASED");

  const favoriteCategories = inferFavoriteCategories(owned);
  const favoriteEras = inferFavoriteEras(owned);
  const favoriteBrands = inferFavoriteBrands(owned, memories);
  const favoriteArtists = inferFavoriteArtists(owned, memories);

  const buyingStyle = inferBuyingStyle(owned, memories);
  const riskDiscipline = inferRiskDiscipline(owned, dna);
  const researchDepth = inferResearchDepth(owned, memories, dna);
  const patience = inferPatience(owned);
  const decisionSpeed = inferDecisionSpeed(owned);
  const diversificationPreference = inferDiversification(owned, dna);
  const budgetDiscipline = inferBudgetDiscipline(owned, memories);

  const philosophy = inferPhilosophy(dna, memories, owned);
  const collectionStrategy = inferStrategy(owned, dna);

  const dataPoints = owned.length + memories.length;

  return {
    philosophy,
    buyingStyle,
    riskDiscipline,
    researchDepth,
    patience,
    decisionSpeed,
    diversificationPreference,
    budgetDiscipline,
    confidence: Math.min(0.95, dataPoints / 50),
    favoriteCategories,
    favoriteEras,
    favoriteBrands,
    favoriteArtists,
    collectionStrategy,
    archetype: dna.primaryType as CollectorArchetype,
    riskProfile: dna.riskProfile,
    dnaScore: dna.dnaScore,
    computedAt: new Date().toISOString(),
    dataPoints,
  };
}

function inferFavoriteCategories(owned: Collectible[]): TwinPreference[] {
  const counts = new Map<CollectibleCategory, number>();
  for (const c of owned) counts.set(c.category, (counts.get(c.category) || 0) + 1);

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([cat, count]) => ({
      label: COLLECTIBLE_CATEGORY_LABELS[cat],
      value: cat,
      confidence: Math.min(0.95, count / owned.length + 0.3),
      evidence: [`${count} items in collection`],
      lastObserved: new Date().toISOString(),
    }));
}

function inferFavoriteEras(owned: Collectible[]): TwinPreference[] {
  const eras = new Map<string, number>();
  for (const c of owned) {
    if (!c.year) continue;
    const decade = `${Math.floor(c.year / 10) * 10}s`;
    eras.set(decade, (eras.get(decade) || 0) + 1);
  }

  return [...eras.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([era, count]) => ({
      label: era,
      value: era,
      confidence: Math.min(0.9, count / owned.length + 0.2),
      evidence: [`${count} items from this era`],
      lastObserved: new Date().toISOString(),
    }));
}

function inferFavoriteBrands(owned: Collectible[], memories: CollectorMemoryFact[]): TwinPreference[] {
  const brands = new Map<string, number>();
  for (const c of owned) {
    if (c.brand) brands.set(c.brand, (brands.get(c.brand) || 0) + 1);
  }

  const memBrands = memories.find((m) => m.key === "favorite_brands");
  if (memBrands && Array.isArray(memBrands.value)) {
    for (const b of memBrands.value) brands.set(String(b), (brands.get(String(b)) || 0) + 2);
  }

  return [...brands.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([brand, count]) => ({
      label: brand,
      value: brand,
      confidence: Math.min(0.9, count / (owned.length + 1) + 0.2),
      evidence: [`Appears ${count} times across collection and memory`],
      lastObserved: new Date().toISOString(),
    }));
}

function inferFavoriteArtists(owned: Collectible[], memories: CollectorMemoryFact[]): TwinPreference[] {
  const artists = new Map<string, number>();
  for (const c of owned) {
    if (c.artist) artists.set(c.artist, (artists.get(c.artist) || 0) + 1);
  }
  const memArtists = memories.find((m) => m.key === "favorite_artists");
  if (memArtists && Array.isArray(memArtists.value)) {
    for (const a of memArtists.value) artists.set(String(a), (artists.get(String(a)) || 0) + 2);
  }

  return [...artists.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([artist, count]) => ({
      label: artist,
      value: artist,
      confidence: Math.min(0.85, count / (owned.length + 1) + 0.15),
      evidence: [`Referenced ${count} times`],
      lastObserved: new Date().toISOString(),
    }));
}

function inferBuyingStyle(owned: Collectible[], memories: CollectorMemoryFact[]): TwinBehavior {
  const highValue = owned.filter((c) => (c.estimatedValue ?? 0) > 1000).length;
  const ratio = owned.length > 0 ? highValue / owned.length : 0;

  const style = ratio > 0.5 ? "Premium buyer — favors high-value, high-quality pieces"
    : ratio > 0.2 ? "Selective buyer — mixes accessible and premium pieces"
    : "Volume collector — builds breadth across categories";

  const memStyle = memories.find((m) => m.key === "buying_habits");

  return {
    trait: "Buying Style",
    score: Math.round(ratio * 100),
    description: memStyle ? `${style}. Self-described: "${memStyle.value}"` : style,
    evidence: [`${highValue} of ${owned.length} items valued over $1,000`],
    observedSince: owned[0]?.createdAt ?? new Date().toISOString(),
  };
}

function inferRiskDiscipline(owned: Collectible[], dna: CollectorDNA): TwinBehavior {
  const unauthHighValue = owned.filter((c) => !c.isAuthenticated && (c.estimatedValue ?? 0) > 500).length;
  const riskScore = dna.wheel?.find((w) => w.axis === "Risk")?.score ?? 50;

  return {
    trait: "Risk Discipline",
    score: riskScore,
    description: riskScore > 70 ? "Cautious — verifies before committing"
      : riskScore > 40 ? "Balanced — accepts calculated risks"
      : "Bold — comfortable with higher uncertainty",
    evidence: [
      `DNA Risk score: ${riskScore}`,
      `${unauthHighValue} unauthenticated high-value items`,
    ],
    observedSince: dna.computedAt,
  };
}

function inferResearchDepth(owned: Collectible[], memories: CollectorMemoryFact[], dna: CollectorDNA): TwinBehavior {
  const researchScore = dna.wheel?.find((w) => w.axis === "Research")?.score ?? 50;
  const withNotes = owned.filter((c) => c.notes && c.notes.length > 20).length;

  return {
    trait: "Research Depth",
    score: researchScore,
    description: researchScore > 70 ? "Deep researcher — thoroughly investigates before acting"
      : researchScore > 40 ? "Moderate researcher — gathers key information"
      : "Action-oriented — prefers experience over extended research",
    evidence: [
      `DNA Research score: ${researchScore}`,
      `${withNotes} items with detailed notes`,
      `${memories.length} memory facts accumulated`,
    ],
    observedSince: dna.computedAt,
  };
}

function inferPatience(owned: Collectible[]): TwinBehavior {
  const withDates = owned.filter((c) => c.purchasedAt);
  if (withDates.length < 2) {
    return { trait: "Patience", score: 50, description: "Not enough data to assess.", evidence: [], observedSince: new Date().toISOString() };
  }
  const sorted = withDates.sort((a, b) => new Date(a.purchasedAt!).getTime() - new Date(b.purchasedAt!).getTime());
  const span = new Date(sorted[sorted.length - 1]!.purchasedAt!).getTime() - new Date(sorted[0]!.purchasedAt!).getTime();
  const avgGap = span / (sorted.length - 1) / (1000 * 60 * 60 * 24);
  const score = Math.min(100, Math.round(avgGap * 2));

  return {
    trait: "Patience",
    score,
    description: avgGap > 60 ? "Very patient — waits for the right opportunity"
      : avgGap > 20 ? "Moderate patience — steady acquisition pace"
      : "Eager — acquires frequently when opportunities arise",
    evidence: [`Average ${Math.round(avgGap)} days between acquisitions`],
    observedSince: sorted[0]!.purchasedAt!,
  };
}

function inferDecisionSpeed(owned: Collectible[]): TwinBehavior {
  const patience = inferPatience(owned);
  const speed = 100 - patience.score;
  return {
    trait: "Decision Speed",
    score: speed,
    description: speed > 70 ? "Fast decision maker — acts quickly on opportunities"
      : speed > 40 ? "Deliberate — takes time but doesn't over-analyze"
      : "Methodical — prefers careful analysis before commitment",
    evidence: patience.evidence,
    observedSince: patience.observedSince,
  };
}

function inferDiversification(owned: Collectible[], dna: CollectorDNA): TwinBehavior {
  const categories = new Set(owned.map((c) => c.category)).size;
  const divScore = dna.diversificationScore ?? Math.min(100, categories * 15);

  return {
    trait: "Diversification Preference",
    score: divScore,
    description: divScore > 70 ? "Broad collector — actively seeks variety"
      : divScore > 40 ? "Focused with some breadth — concentrates with occasional exploration"
      : "Specialist — deep focus on select categories",
    evidence: [`${categories} categories in collection`, `Diversification score: ${divScore}`],
    observedSince: dna.computedAt,
  };
}

function inferBudgetDiscipline(owned: Collectible[], memories: CollectorMemoryFact[]): TwinBehavior {
  const prices = owned.filter((c) => c.purchasePrice).map((c) => c.purchasePrice!);
  if (prices.length === 0) {
    return { trait: "Budget Discipline", score: 50, description: "Not enough purchase data.", evidence: [], observedSince: new Date().toISOString() };
  }

  const avg = prices.reduce((s, p) => s + p, 0) / prices.length;
  const budgetMem = memories.find((m) => m.key === "budget");
  const budgetDisciplineScore = dna.wheel?.find((w) => w.axis === "Budget Discipline")?.score ?? 50;

  return {
    trait: "Budget Discipline",
    score: budgetDisciplineScore,
    description: budgetDisciplineScore > 70 ? "Disciplined — stays within defined ranges"
      : budgetDisciplineScore > 40 ? "Flexible — generally mindful but makes exceptions"
      : "Opportunistic — budget follows passion, not limits",
    evidence: [
      `Average purchase: $${Math.round(avg).toLocaleString()}`,
      ...(budgetMem ? [`Self-reported budget: ${budgetMem.value}`] : []),
    ],
    observedSince: owned[0]?.createdAt ?? new Date().toISOString(),
  };
}

function inferPhilosophy(dna: CollectorDNA, memories: CollectorMemoryFact[], owned: Collectible[]): TwinPreference {
  const archetype = dna.primaryType;
  const philosophies: Record<string, string> = {
    INVESTOR: "Views collecting as strategic wealth-building through carefully selected assets.",
    HISTORIAN: "Collects to preserve and understand cultural and historical significance.",
    COMPLETIONIST: "Driven by the satisfaction of completing sets and achieving milestones.",
    CURATOR: "Assembles a cohesive, curated collection that tells a unified story.",
    FLIPPER: "Focused on market timing and maximizing returns through active trading.",
    EXPLORER: "Drawn to discovering new categories and expanding horizons.",
    TREND_HUNTER: "Anticipates emerging trends and positions early.",
    MINIMALIST: "Values quality over quantity — every piece must earn its place.",
    LUXURY_COLLECTOR: "Pursues the finest examples regardless of category.",
    COMMUNITY_COLLECTOR: "Collecting is a social activity — community drives decisions.",
    PRESERVATIONIST: "Dedicated to protecting and preserving collectible heritage.",
    COMPETITIVE_COLLECTOR: "Motivated by the thrill of acquisition and competitive positioning.",
  };

  return {
    label: "Collector Philosophy",
    value: philosophies[archetype] ?? "Evolving collector with a developing identity.",
    confidence: Math.min(0.9, (owned.length + memories.length) / 30),
    evidence: [`Primary archetype: ${archetype}`, `DNA score: ${dna.dnaScore}`],
    lastObserved: dna.computedAt,
  };
}

function inferStrategy(owned: Collectible[], dna: CollectorDNA): TwinPreference {
  const authenticated = owned.filter((c) => c.isAuthenticated).length;
  const authRate = owned.length > 0 ? authenticated / owned.length : 0;
  const graded = owned.filter((c) => c.grade).length;

  const strategies: string[] = [];
  if (authRate > 0.7) strategies.push("authentication-first");
  if (graded > owned.length * 0.5) strategies.push("grade-conscious");
  if (dna.diversificationScore > 60) strategies.push("diversified");
  else strategies.push("concentrated");

  return {
    label: "Collection Strategy",
    value: strategies.join(", "),
    confidence: Math.min(0.85, owned.length / 20),
    evidence: [`${authenticated}/${owned.length} authenticated`, `${graded} graded items`],
    lastObserved: new Date().toISOString(),
  };
}

export function assessCollectibleFit(
  collectible: Collectible,
  twin: CollectorTwinProfile
): TwinCollectibleAssessment {
  const catMatch = twin.favoriteCategories.find((c) => c.value === collectible.category);
  const twinInterest = catMatch ? catMatch.confidence * 100 : 20;

  const eraMatch = collectible.year
    ? twin.favoriteEras.find((e) => e.value === `${Math.floor(collectible.year! / 10) * 10}s`)
    : null;
  const historicalFit = eraMatch ? eraMatch.confidence * 80 : 30;

  const brandMatch = collectible.brand
    ? twin.favoriteBrands.find((b) => b.value === collectible.brand)
    : null;

  const confidence = twin.confidence;
  const marketAlignment = 50;
  const dnaImpact = catMatch ? 10 : -5;

  const evidence: string[] = [];
  if (catMatch) evidence.push(`Category "${catMatch.label}" is a favorite.`);
  if (eraMatch) evidence.push(`Era "${eraMatch.label}" aligns with preferences.`);
  if (brandMatch) evidence.push(`Brand "${brandMatch.label}" is a known favorite.`);
  if (!catMatch && !eraMatch && !brandMatch) evidence.push("No strong alignment with observed preferences.");

  const explanation = catMatch
    ? `This ${COLLECTIBLE_CATEGORY_LABELS[collectible.category]} aligns well with your collecting patterns.`
    : `This ${COLLECTIBLE_CATEGORY_LABELS[collectible.category]} would represent an expansion of your current focus.`;

  return {
    collectibleId: collectible.id,
    twinInterest: Math.round(twinInterest),
    historicalFit: Math.round(historicalFit),
    confidence,
    marketAlignment,
    dnaImpact,
    explanation,
    evidence,
  };
}

export function answerTwinQuestion(
  question: TwinQuestion,
  twin: CollectorTwinProfile,
  memories: CollectorMemoryFact[]
): TwinAnswer {
  const q = question.question.toLowerCase();

  let alignment: TwinAnswer["alignment"] = "partially_aligned";
  let alignmentScore = 50;
  let reasoning = "";
  const historicalBehavior: string[] = [];
  const dnaFactors: string[] = [];
  const memoryFactors: string[] = [];

  if (q.includes("buy") || q.includes("purchase") || q.includes("acquire")) {
    alignmentScore = twin.buyingStyle.score;
    alignment = alignmentScore > 60 ? "aligned" : alignmentScore > 30 ? "partially_aligned" : "misaligned";
    reasoning = `Based on your ${twin.buyingStyle.description.toLowerCase()}, this ${alignment === "aligned" ? "fits" : "may not fit"} your typical pattern.`;
    historicalBehavior.push(twin.buyingStyle.description);
    dnaFactors.push(`Risk profile: ${twin.riskProfile}`);
  } else if (q.includes("sell") || q.includes("let go") || q.includes("part with")) {
    reasoning = `Your ${twin.philosophy.value.toLowerCase()} As a ${twin.archetype}, selling decisions depend on strategic alignment.`;
    dnaFactors.push(`Archetype: ${twin.archetype}`);
  } else if (q.includes("collection") || q.includes("match") || q.includes("fit")) {
    const cats = twin.favoriteCategories.map((c) => c.label).join(", ");
    reasoning = `Your collection focuses on: ${cats}. Fit depends on alignment with these categories and your ${twin.collectionStrategy.value} strategy.`;
    dnaFactors.push(`Diversification: ${twin.diversificationPreference.score}`);
  } else {
    reasoning = `As a ${twin.archetype} with ${twin.philosophy.value.toLowerCase()}, your typical approach would be guided by ${twin.researchDepth.description.toLowerCase()}.`;
  }

  for (const mem of memories.slice(0, 3)) {
    memoryFactors.push(`${mem.label}: ${Array.isArray(mem.value) ? mem.value.join(", ") : mem.value}`);
  }

  return {
    answer: reasoning,
    alignment,
    alignmentScore,
    reasoning,
    historicalBehavior,
    dnaFactors,
    memoryFactors,
    goalFactors: [],
    marketFactors: [],
    confidence: twin.confidence,
    disclaimer: "This assessment is based on observed behavior patterns and may not reflect all aspects of your collecting preferences.",
  };
}
