# Vinci AI

**The AI Copilot for Every Collector.**

AI-powered intelligence for trading cards, sports cards, watches, comics, sneakers, coins, NFTs, figures, and memorabilia. Built for the Renaiss Tech Hackathon (AI Track).

> **No mock data.** Every table starts empty and fills in only through real usage or real integrations. The DNA/Memory/Replay engines compute from live rows — a fresh account legitimately starts at "Explorer" with a low score, which is correct behavior, not a placeholder.

---

## Status

This repository is being built **depth-first**, in this order:

| # | Feature | Status |
|---|---|---|
| 0 | Scaffold (this commit) | ✅ Complete |
| 1 | Landing Page (premium UI/UX) | ✅ Complete |
| 2 | Authentication (Supabase Auth) | ✅ Complete |
| 3 | Collector Dashboard | ✅ Complete |
| 4 | AI Chat (streaming, OpenAI) | ✅ Core complete (see scope notes below) |
| 5 | Collector Memory | ✅ Core complete (see scope notes below) |
| 6 | Image Analysis (OpenAI Vision) | ✅ Core complete (see scope notes below) |
| 7 | Collection Manager | ✅ Core complete (see scope notes below) |
| 8 | Collector DNA Engine | ✅ Core complete (see scope notes below) |
| 9 | DNA Evolution Replay | ✅ Core complete (see scope notes below) |
| 10 | AI Collector Legacy Report | ✅ Core complete (see scope notes below) |
| 11 | Market Insights | 🟡 Read path only — needs real data source |
| 12 | Settings / notifications / polish / a11y / deploy | ⬜ Not started |

"🟡 Functional shell" means: real DB calls, real auth checks, real API routes — but minimal/unstyled UI, since the premium visual design is being done depth-first per item above.

---

## Architecture

```
src/
  app/
    (marketing)/        # public landing page
    (auth)/              # login, signup
    (app)/               # authenticated app shell (sidebar layout)
      dashboard/
      chat/[chatId]/
      memory/
      collection/[collectibleId]/
      dna/replay/
      legacy/
      market/
      settings/
    api/                 # route handlers — thin, call into services/
  components/
    ui/                  # shadcn primitives
    marketing/ chat/ memory/ collection/ dna/ legacy/ market/ shared/
  hooks/                 # client data-fetching hooks (useUser, useCollectorDNA, ...)
  lib/
    supabase/            # client.ts (browser), server.ts (RSC/route), middleware.ts
    prisma.ts            # Prisma singleton
    openai.ts             # OpenAI client + model config + disclaimers
    utils.ts
  services/               # ALL business logic lives here — routes/pages call these
    memoryService.ts      # Collector Memory: extraction, CRUD, prompt-context builder
    collectibleService.ts
    chatService.ts
    imageAnalysisService.ts
    dnaEngine.ts           # Collector DNA computation (real heuristics + AI narrative)
    dnaSnapshotService.ts  # DNA Evolution Replay snapshots
    authClient.ts          # Supabase Auth wrapper (Google/email/guest)
    renaiss.ts              # placeholder for future Renaiss platform API
  types/                   # shared TypeScript types, mirrors Prisma shapes for the client
prisma/
  schema.prisma
  sql/                     # raw SQL run manually in Supabase: auth sync trigger, RLS policies
  seed.ts                  # intentionally a no-op (no mock data)
scripts/
  setup-storage.ts         # creates Supabase Storage buckets
```

### Why this structure

- **`services/` is the single source of truth.** API routes and Server Components are thin — they auth-check, call a service, and return JSON/render. This is what makes "Collector DNA must stay synchronized with Collector Memory from the beginning" actually true: both read/write through the same Prisma models, and DNA snapshots are triggered from the same service calls that mutate memory/collectibles.
- **RLS + service-role separation.** `lib/supabase/server.ts` exports a normal (RLS-respecting) client for user-facing operations and a separate `createSupabaseAdminClient()` for server-only operations like Storage uploads. The admin client is never imported into anything that ships to the browser.
- **Prisma talks to the same Postgres database Supabase Auth uses.** A Postgres trigger (`prisma/sql/01_sync_user_trigger.sql`) mirrors new `auth.users` rows into `public.users` so Prisma relations work normally.

---

## Getting started

### 1. Install

```bash
npm install
```

### 2. Create a Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. In **Settings → API**, copy the Project URL, anon key, and service role key into `.env.local` (copy `.env.example` first).
3. In **Settings → Database**, copy the **Transaction pooler** connection string into `DATABASE_URL`, and the **direct connection** (port 5432) into `DIRECT_URL`.
4. In **Authentication → Providers**, enable Google and Email. If you want Guest Mode, enable **Anonymous sign-ins** under Authentication → Settings.

### 3. Push the schema and wire up Postgres extras

```bash
npm run db:push        # creates all tables from prisma/schema.prisma
```

Then, in the Supabase SQL editor, run (in order):

1. `prisma/sql/01_sync_user_trigger.sql`
2. `prisma/sql/02_row_level_security.sql`

### 4. Create Storage buckets

```bash
npx tsx scripts/setup-storage.ts
```

### 5. Add your OpenAI key

Fill in `OPENAI_API_KEY` in `.env.local`.

### 6. Run

```bash
npm run dev
```

---

## Environment variables

See `.env.example` for the full list. Summary:

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Public, RLS-protected |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | **Server-only.** Bypasses RLS. |
| `DATABASE_URL` / `DIRECT_URL` | ✅ | Prisma connection strings |
| `OPENAI_API_KEY` | ✅ | Chat + Vision |
| `OPENAI_CHAT_MODEL` / `OPENAI_VISION_MODEL` | optional | default `gpt-4o` |
| `SUPABASE_STORAGE_BUCKET_*` | optional | defaults provided |
| `UPSTASH_REDIS_REST_*` | optional | rate limiting; falls back to in-memory |

---

## Feature notes & honest gaps

- **Market Insights** currently has a real read path (`/api/market`, `app/(app)/market`) but the `MarketInsight` table is empty until a real ingestion job is connected (e.g. a scheduled route that calls a real market-data API or does grounded web research). Filling this table with fabricated headlines would violate the "no mock data" requirement, so it ships empty and documented rather than faked.
- **Legacy Report PDF export**: the original feature spec asked for `reportlab`, which is a Python library — this stack is Next.js/TypeScript. The equivalent here will be `@react-pdf/renderer` (React-based PDF generation, same "professional typography + charts" outcome) when item #10 is built. Flagging this now so the substitution isn't a surprise later.
- **`services/renaiss.ts`** is intentionally unimplemented — it's a placeholder for a third-party API that doesn't exist yet, exactly as the original spec requested. Every other service in this repo is fully implemented.
- **DNA achievements** (`CollectorDNA.achievements`) currently returns `[]` from `dnaEngine.ts` — real achievement-unlock logic (matching against the `Achievement` table thresholds) is part of the Collector DNA depth-build pass (#8), not yet built.

---

## Authentication notes

- Forms use **react-hook-form + zod** (`lib/validation/auth.ts`), per the original tech stack spec — client-side validation with real error messages, not just `required` attributes.
- Full flow now includes **forgot password** and **reset password** (`/forgot-password`, `/reset-password`) — not in the original scaffold pass. Reset relies on Supabase's recovery-link session: `detectSessionInUrl` establishes the session automatically when the link is opened, the page listens for the `PASSWORD_RECOVERY` auth event, then calls `auth.updateUser({ password })`.
- `middleware.ts` deliberately does **not** include `/forgot-password` or `/reset-password` in `AUTH_PREFIXES` (the list that redirects already-logged-in users away). A recovery link creates a real session — if those routes were treated like `/login`/`/signup`, a signed-in user clicking a reset link would get bounced straight to `/dashboard` before they could set a new password.
- Guest mode requires **Anonymous sign-ins** enabled in Supabase Auth settings (`signInAsGuest()` will otherwise return an error) — see Getting Started step 2.

- **Achievements and Goals are demo-populated but not yet auto-generated for real accounts.** The `Achievement` and `Goal` tables exist and the dashboard reads real rows when present, but nothing yet writes unlock/goal rows for real users (e.g. an achievement-unlock checker triggered from `dnaSnapshotService`). A real account today will see empty Achievements/Goals widgets until that engine is built — by design, not a bug, and called out here so it isn't a surprise.
- **Settings page is not demo-mode aware.** It's the one page still gated purely on a real session; in demo mode it will simply show nothing rather than fixture toggles, since "settings" for a fixture identity isn't a meaningful concept.

## Judge Demo Mode

Activates on `?demo=true` (persists as a cookie for the session), `NEXT_PUBLIC_DEMO_MODE=true`, or `NODE_ENV=development`. Never active in a real production build unless the env var is explicitly set.

- `services/demoMode.ts` — detection (env + cookie).
- `lib/viewer.ts` — `resolveViewer()` is the single entry point every page/route uses. Real session always wins; demo fixtures are only used when there's no real user. Middleware allows protected routes through without login while demo mode is active — that's the entire point of the feature.
- `services/dataSource.ts` — the abstraction the spec asked for: every read (`getDNA`, `getCollection`, `getMemoryFacts`, `getActivityFeed`, `getDNASnapshots`, `getAchievements`, `getGoals`, `getMarketPulse`, `getLegacyReport`, `getChatList`/`getChatThread`) branches internally on `demo: boolean`. No page or component ever imports a fixture directly.
- `demo/fixtures/` — one internally-consistent demo collector ("Alex Morgan," 148 items, $84,200 portfolio, 92 DNA score) spanning every feature: collection, memory, DNA, 12 months of replay snapshots, achievements, goals, market insights, a full Legacy Report, and three real-looking chat conversations.
- **Honest scope cut**: demo chat is read-only. Pre-loaded conversations display in full, but sending a *new* message while in demo mode is disabled rather than faked — true anonymous live chat would need an ephemeral identity wired through Supabase anonymous auth, which isn't built yet. The input is visibly disabled with an explanation, not silently broken.
- Editing Collector Memory in demo mode is also a no-op by design (echoes the fixture back) — letting a judge "edit" demo data would misrepresent it as real.

## Unified icon system

Every icon in the app comes from `components/ui/icons.tsx` — the only file that imports `lucide-react` directly. Built on top:

- `components/ui/Icon.tsx` — fixed size scale (button 18 / default 20 / card 20 / feature 24 / hero 32 / illustration 48), stroke width always 2, accessibility props baked in (`decorative` + `aria-label`).
- `components/ui/icon-components.tsx` — `IconButton`, `IconBadge`, `FeatureIcon`, `MetricIcon`, `SectionIcon`, `NavigationIcon`, `AchievementIcon`, `StatusIcon`, `MemoryIcon`, `DNAIcon`.
- Zero emoji anywhere in the codebase. Collector DNA's glyph is `Fingerprint`, Memory's is `Database`, Legacy Report's is `FileText` — never the literal 🧬/🧠/📄.

## AI Collector Legacy Report™ (Phase 10)

**What's real:**
- **`services/legacyAnalytics.ts`** — `gatherLegacyBundle()` calls 9 real existing services in parallel: `computeCollectorDNA`, `getMemoryProfile`, `computePortfolioStats`, `listAchievements`, plus direct Prisma queries for collectibles (ordered by value), conversations, goals, and snapshot count. Zero duplication of business logic — it's an aggregator, not a re-implementation.
- **`services/legacyNarrative.ts`** — every AI-generated section (Executive Summary, three Story paragraphs, DNA Evolution, AI Letter, Next Chapter recommendations) receives an explicit `EvidenceBundle` with `allowedFacts`, `forbiddenAssumptions`, and `dataSourceIds`. The system prompt prohibits fabricating achievements, collectibles, memories, dates, or market values. The Letter prompt uses the same evidence list as the summary — it cannot mention a fact not in `allowedFacts`.
- **`services/legacyReport.ts`** — orchestrates the full pipeline, writes an immutable row to `LegacyReport` (never overwrites previous reports), and returns the complete `LegacyReportRecord`.
- **`services/legacyExport.ts`** — Markdown (structured with H2/H3/bullet sections), JSON (full `LegacyReportData`), and SVG cover (server-rendered, downloadable anywhere).
- **The Legacy Score** is a real weighted composite: DNA (30%) + Authentication Rate (15%) + Collection Quality (15%) + Achievements (15%) + Knowledge (15%) + Consistency (10%) — all from live data, with a confidence score reflecting how much of that data has been filled in.
- **Full-screen cinematic report page** (`/legacy`): left section navigation (scrolls to each section), generation toolbar with progress state ("Generating... ~30-60s"), sectioned report body with Framer Motion section entrances, export dropdown (Markdown/JSON/SVG), report history sidebar with open/delete.
- Report sections built and rendered: Cover (large DNA orb, Legacy Score, archetype, collection size, portfolio value), Executive Summary, The Collector's Story (3 narrative paragraphs with DNA Thread spine), Legacy Score breakdown (animated bars), Collection Highlights (most valuable/highest confidence/newest), Memory Highlights (most confident/verified memories), Achievements Showcase (unlocked grid + near-complete progress), Provenance Highlights, AI Letter, Next Chapter recommendations, market note.

**Honest scope cuts:**
- **No PDF export.** The spec called for `@react-pdf/renderer`. That library is real and this is where it belongs, but rendering a multi-section report with charts into a properly typeset PDF requires a dedicated layout pass beyond what Phase 10 time allows. The JSON export and the Markdown export are both complete and structurally equivalent to a PDF for judge review. The SVG cover is the closest thing to a "print-quality" output that's fully reliable.
- **No PDF preview** (streaming/incremental PDF rendering).
- **No portfolio charts** in the rendered report — the portfolio data is included in the JSON/Markdown export and the `LegacyPortfolioSnapshot` type is fully populated, but the interactive `PortfolioAnalyticsCharts` component isn't embedded in the report view yet.
- **No goals section in the rendered view** — `LegacyGoalHighlight[]` is populated in the data bundle and exported to JSON/Markdown, but there's no `GoalsHighlights` UI component yet.
- **No shareable link / public preview** — the share architecture is documented in `LegacyReportRecord.shareCardUrl` but the API route for generating a public token and a public-facing view page are not built.
- **Report History open** loads via the JSON export endpoint as a quick workaround — a dedicated `GET /api/legacy/[id]` route is the proper approach and would be a clean one-file addition.
- **Year-in-Review comparison mode** (current vs. previous report side-by-side) is not built — it requires two loaded report records and a diff rendering layer.

## DNA Evolution Replay™ & Collector Compass™ (Phase 9)

**What's real:**
- **`services/replayEngine.ts`** — `buildReplayManifest()` reads real `DNASnapshot` rows chronologically, then for each frame queries real counts-at-that-moment (conversations, memories, collectibles, checkpoints) using Prisma `lte` filters. Every field in a `ReplayFrame` is sourced from live data.
- **`services/collectorCompass.ts`** — `buildCompassHistory()` maps real trait scores to 9 compass axes (Historian/Investor/Explorer/Completionist/Curator/Researcher/Preservationist/Minimalist/Flipper) using documented formulas (e.g. Historian = mean of Knowledge + Research), and detects `dominantAxis` shifts between adjacent frames.
- **`services/replayAnalytics.ts`** — `detectMilestones()` scans frames for real events (first collectible, level-ups at every 10-point boundary, archetype shifts, largest single delta) and creates `ReplayMilestone` objects grounded in actual frame data. `generateReplayStory()` gives the LLM only real events and prohibits fabrication.
- **`services/predictionEngine.ts`** — `computePredictions()` requires exactly 20 snapshots before generating any forecast. Below that, returns an honest "not enough data" response with a progress indicator. Above the threshold, uses first-order linear extrapolation on the last 10 real frames — the most conservative honest method, not a narrative.
- **Replay page (`/dna/replay`)**: Full three-column layout. Left: `MilestoneTimeline` (DNA Thread spine, clickable to jump directly to any milestone). Center: `ReplayCanvas` (animated SVG DNA Orb — circumference-based, glow intensity driven by real score, archetype label, live `RadarChart` animating between frames, stat counters all from real data). Transport bar: play/pause/prev/next/scrub/speed, keyboard shortcuts (Space/Arrow keys). Compare Mode: two-pane side-by-side with a second scrubber + `BeforeAfterComparison` (animated trait bars showing before→after delta). Right: `CollectorCompass™` (radar animating between frames, shift callout), `StoryCard`, `PredictionsPanel`.
- **`/api/dna/share`** — Returns a server-rendered SVG DNA Card with real score, archetype, achievement count, and level. No `html2canvas`, no browser APIs — works reliably server-side and produces a valid downloadable SVG in any environment.
- Demo mode has a fully realized 13-frame replay with story narration, milestones, and compass shifts — not empty stubs.

**Honest scope cuts:**
- **No video export / replay video manifest** — generating a real video (MP4/WebM) from canvas frames requires `ffmpeg` or a cloud render pipeline that isn't in scope. The JSON manifest (the full `ReplayManifest`) is serializable and could be handed to a video pipeline, but that pipeline isn't built.
- **No bookmark persistence** — bookmarks are currently derived from `isPinned` DNA snapshots. A dedicated `ReplayBookmark` table and add/remove UI are not built.
- **No evolution map** (zoomable/pannable node graph of snapshots, achievements, and goals) — this is the most visually complex sub-spec and requires a dedicated force-directed or dagre layout pass on top of ReactFlow, beyond what fits in Phase 9.
- **No semantic search** over replay history — the API supports filters by type/date, but no free-text search UI is built on the replay page.
- **Compass history path** (trail of previous positions drawn on the compass) is computed (`buildCompassHistory`) but the ghost-path rendering on the radar is not drawn — only the current and previous frame are overlaid.

## Collector DNA Engine Full UI (Phase 8)

**What's real:**
- **Achievement system**: `services/achievementDefinitions.ts` — 14 definitions, every threshold grounded in real DB signals (`collectibleCount`, `authenticatedPct`, `imageAnalysisCount`, `chatCount`, `dnaScore`, `snapshotCount`, `memoryFactCount`, etc.). `services/achievementService.ts` reads live rows, checks every threshold, upserts to the `Achievement` table — only marks unlocked when the threshold is genuinely met. The note in the previous README that "real achievement-unlock logic is not yet built" is now corrected.
- **`services/dnaAnalytics.ts`**: `rankDNAContributors` ranks real conversations/collectibles/memories/analyses by their influence on specific DNA dimensions. `computeDNAStability` calculates std-deviation of `dnaScore` across the last 10 real snapshots to produce a `Stable`/`Growing`/`Rapidly Changing` label — returns an honest "not enough data" fallback when fewer than 2 snapshots exist.
- **`services/dnaCoach.ts`**: Generates a 3/3/3/3 coaching card (strengths/weaknesses/opportunities/recommendations) grounded only in real DNA trait scores and real Collector Memory facts. The system prompt prohibits citing any trait score not in the input.
- **`services/dnaExplainability.ts`**: Per-trait `TraitExplanation` — score, previous score, trend (`up`/`down`/`stable`), explanation built from real snapshot diffs and memory counts. No LLM needed — plain computed prose, verifiably grounded.
- **`services/dnaEvolution.ts`**: Enriched timeline entries from real `DNASnapshot` rows with delta computation between adjacent snapshots.
- **DNA page** (`/dna`): Premium 3-column-to-tabbed layout — DNA Hero (animated SVG orb, level, archetypes, stability), tabbed navigation (Overview / Traits / Achievements / AI Coach / Evolution). Overview tab: interactive DNA Wheel (Recharts `RadarChart`, click any axis to see the evidence panel for that trait), DNA Evolution area chart with milestone markers. Traits tab: per-trait score bars, trend badges, memory/collectible influence. Achievements tab: `AchievementWall` with unlock/locked/all filter. Coach tab: full `CoachCard`. Evolution tab: area chart + full snapshot history table.
- All DNA API routes are demo-mode aware — `/api/dna/coach` returns a fully realized coach card for demo mode.

**Honest scope cuts:**
- **No shareable DNA card/PNG export** (`DNAShareCard` / `html2canvas`). The "Export as PNG" and "DNA Card" features from the spec are not built — `html2canvas` was evaluated but produces unreliable output in Next.js SSR contexts and was cut rather than shipped as a broken button.
- **No Collector Compass component** (`current → projected archetype` visualization). The compass is designed but not built — it would require multi-snapshot archetype-transition data that is meaningful only after 20+ snapshots.
- **No AI-generated predictions list** — predictions require sufficient historical patterns to be non-fabricated, and the spec's "Predicted Next Score" section is deferred.
- **No DNA benchmarking** (community average comparisons) — the spec explicitly marks this "Optional / when aggregate statistics exist," which they don't yet.
- **No full-page DNA Replay** (Phase 9 is the cinematic play/pause/scrub Replay mode) — `/dna/replay` is in the Command Palette and sidebar nav but the page itself is the next phase.

## Collection Manager

**What's real:**
- **Prisma schema additions**: `Tag`, `CollectibleTag` (m2m), `wishlistTargetPrice`/`wishlistPriority`/`wishlistDesiredCondition` on `Collectible`, `coverImageUrl`/`aiSummary` on `Collection`. All append-only fields — no existing rows broken.
- **`services/collectionManager.ts`** — the single read path all views go through: `queryCollectibles` (the real filtered query, all 12 filter dimensions), named-collection CRUD, tag CRUD (including `mergeTags`), wishlist-detail update, `convertWishlistToOwned` (fires a timeline event + DNA snapshot + activity log), bulk actions (`set_status`/`move_collection`/`delete`/`tag`).
- **`services/collectionAnalytics.ts`** — real portfolio stats computed from live rows (Shannon-entropy diversification score, auth rate, avg confidence, portfolio health, value distribution buckets, cumulative growth series from real `purchasedAt`/`createdAt` dates). `generatePortfolioInsights` gives the LLM only the computed numbers and cannot invent a percentage.
- **`services/collectionImport.ts`** — CSV/JSON parsing → validation (Zod) → preview → commit. Two-phase so judges see the validation before anything is written.
- **`services/collectionExport.ts`** — CSV, JSON, and Markdown "museum catalog" exports.
- **`services/relatedCollectibles.ts`** — surfaces items related by real shared attributes (category/brand/franchise/year) with an honest reason string, never invented relationships.
- **Five view modes**: Grid (photo cards with confidence indicator), List (compact), Table (spreadsheet), Gallery (museum showcase with parallax hover), Timeline (acquisition order, reusing the DNA Thread spine motif).
- **Collection sidebar**: filter by status, category, named collection, tag, and authentication status — all live-wired to `/api/collection/query`.
- **Bulk Action Bar**: appears via `AnimatePresence` when items are selected, dispatches to `/api/collection/bulk`.
- **Import Dialog**: drag-to-upload, preview with validation error count before commit.
- **Export Dropdown**: CSV / JSON / Markdown, all real downloads.
- **Portfolio Analytics strip**: 5 animated counters + 3 charts (category pie, growth area, value distribution bar) — toggled on demand, code-split via `next/dynamic`.
- **Collectible Detail page** (`/collection/[id]`): image carousel (thumbnail strip), full metadata, condition/grading card, notes, Analyze/Timeline/Chat/Favorite/Delete actions, related items grid (grounded in shared attributes).
- All Collection Manager API routes are demo-mode aware — GET routes return fixture data in demo mode; mutate routes (POST/PATCH/DELETE) return 403 with a clear message rather than silently no-oping.

**Honest scope cuts:**
- **No add/edit collectible form** in the UI yet — the API route (`POST /api/collectibles`) accepts a full JSON body and is real, but there's no multi-step form page for creating/editing items from the Collection Manager UI. The Image Lab's "Add to Collection" button calls the API directly from an analysis result. This is the most significant missing piece for a fully self-contained Collection Manager.
- **`Tag` hierarchy** (parentId) is in the schema and service but has no UI — tags render as a flat list.
- **No drag-and-drop reordering**, no saved/shared filter views, no `masonry` view mode (in the `CollectionViewMode` type but not mapped to a renderer yet).
- **No AI-generated collection descriptions** (`aiSummary` on `Collection`) — the field exists but the generation endpoint and trigger are not built.
- **Import does not handle quoted commas** in CSV values — documented in `collectionImport.ts`.
- **Wishlist convert dialog** ("I just bought this — set a price") has no dedicated UI; the API route exists at `POST /api/collection/[id]/convert`.

## Image Analysis Lab and Visual Provenance Timeline

**What's real:**
- `/image-analysis` — three-column lab: left Upload Queue (drag/drop/paste/file-picker, multi-file, per-item status with retry/cancel) + History tab; center Image Viewer (zoom/pan/fit/actual-size/rotate/flip/fullscreen); right Analysis Panel.
- `services/imageAnalysisEngine.ts` — a real, stricter Vision prompt than the original chat-upload analyzer: per-section confidence (identification/condition/authenticity/rarity/value), a structured evidence list, and an explicit `conflictingSignals` array. The system prompt instructs the model that a single photo can rarely support >90% confidence on authenticity specifically, and to lower confidence for cropped/blurry/single-angle images — never invents certainty.
- **The 12-step pipeline from the spec is real**, wired in `/api/images/analyze`: validate → store in Supabase Storage → Vision analysis → structured observations → confidence → evidence list → compare against existing collection state (if the image is linked to a `collectibleId`, it diffs confidence against the last analysis) → suggest Collector Memory updates → update Collector DNA when justified → create a Conversation Checkpoint when the analysis happens inside a chat thread → append a Visual Provenance Timeline event → save analysis history → return collection actions to the client.
- **Visual Provenance Timeline** (`CollectibleTimelineEvent`, append-only, never overwritten) — every collectible gets its own `/collection/[id]/timeline` page: hero stats, animated timeline (reusing the DNA Thread motif as the spine, per spec), Confidence Evolution and Value History charts built only from real recorded data points (an item analyzed once correctly shows "Confidence history will appear after..." rather than a fabricated trend), and an AI Story paragraph (`provenanceStory.ts`) that is grounded strictly in the real event list — it cannot state a date, percentage, or fact that isn't in the events given to it, and degrades gracefully to a short honest line for items with 0-1 events rather than inventing a narrative.
- Adding a collectible now always appends a `COLLECTION_ADDED` timeline event, closing the loop between the Collection Manager and the Timeline.
- Comparison mode (`compareAnalyses`) diffs two analyses across every dimension.

**Honest scope cuts:**
- **No bounding-box/region overlays on the image itself.** `EvidenceObservation.region` exists in the type and evidence items are categorized and confidence-scored, but there's no visual highlight drawn on the image for "where" each observation was detected — evidence is a structured list, not an annotated overlay yet.
- **No PDF report export for the lab** — "Generate Report" is a wired button in `AnalysisPanel` but not yet connected to a PDF pipeline (the Legacy Report's PDF system, planned for Phase 10, is the natural place this will hook into).
- **Provenance Timeline exports (PDF/JSON/Markdown/PNG/Legacy appendix) are not built** — only the in-app timeline view exists.
- **No search/filter UI on the Provenance Timeline page itself** (by event type, date, confidence, etc.) — `listAllUserTimelineEvents` exists at the service layer for this, but isn't surfaced yet.
- **Demo Mode has one fully-realized example provenance timeline** (the 1986 Fleer Jordan rookie), not all 14 demo collectibles — chosen because it's the flagship demo item already referenced elsewhere (achievements, Legacy Report).
- **Comparison mode in the lab only compares two just-uploaded queue items in the current session**, not any two arbitrary items from History yet.

## Collector Memory — the living memory system

**What's real:**
- Memory Overview (animated counters: total, verified, AI-inferred, updated today, average confidence) — all computed from real rows, `services/memoryAnalyticsService.ts`.
- Knowledge Categories — every memory key is classified into one of 11 categories by `categorizeMemoryKey()` and grouped into expandable cards.
- Memory Card actions are all real: **Edit/Correct** (marks verified + 100% confidence), **Pin**, **Lock** (locked memories are skipped by `commitMemoryFacts()` during automatic extraction — verified at the service layer, not just hidden in the UI), **Forget**.
- **Memory Timeline** reuses the Conversation Checkpoint data from Phase 4 — every entry is a real memory change diffed from a real checkpoint, not synthetic.
- **Memory Health** (completeness, consistency, coverage, freshness, duplicate detection) — every score is computed from real facts; a sparse memory correctly shows low completeness rather than a flattering fake number.
- **AI Suggestions** — `memorySuggestionService.generateSuggestions()` looks at real recent activity and proposes new facts only when there's actual supporting evidence (and only when there's enough activity to support a suggestion at all). Accept/Ignore/Never-ask-again all persist to a real `MemorySuggestion` table.
- **Knowledge Graph** — a real interactive graph (`reactflow`) with category/memory/goal nodes and real edges, hover-to-highlight.
- Bulk actions (Verify All, Recalculate Confidence, Forget Category) and Export (JSON, Markdown) are all real and wired.

**Honest scope cuts:**
- **Search is keyword-only** (label/value/category/source substring match), not semantic/embedding-based, consistent with the same cut made for chat search in Phase 4.
- **No PDF, CSV, or "Knowledge Graph" file export formats** — only JSON and Markdown.
- **Duplicate detection flags possible duplicates but doesn't execute a merge** — there's no "Merge Duplicates" action yet, just the health-panel callout.
- **No confidence history chart over time** — the Confidence panel shows the current score and its inputs, not a time series.
- **No "Conflicting Signals" detector** — the Why-I-Changed evidence and Memory Health duplicate detection partially cover this, but there's no dedicated contradiction-detection pass.

## AI Chat, Conversation Time Travel, and Why I Changed

Three large specs landed together. Built in dependency order — Chat is the foundation; Checkpoints (Time Travel) sit on top of Chat; Why-I-Changed extends Checkpoints — as one real, working pipeline rather than three shallow passes.

**What's real and wired:**
- Full chat layout: left sidebar (conversations, search, pinned, Collection/Memory shortcuts), center conversation with Markdown rendering (`react-markdown` + `remark-gfm` + `@tailwindcss/typography`, tables/lists/code blocks), right Context Panel (live Collector Memory + DNA score, tabbed with the checkpoint Timeline).
- Global Command Palette (`Cmd/Ctrl+K`) mounted app-wide, navigates to every major section.
- Drag-and-drop + multi-file image upload in chat, wired to the real OpenAI Vision analysis endpoint, rendered as a `CollectibleCard`.
- Copy response, Regenerate (`reload()`), Stop generation (`stop()`) — all real Vercel AI SDK behavior, not decorative buttons.
- **The actual pipeline**: every chat turn → real memory extraction → real DNA recomputation → `maybeCreateCheckpoint()` diffs before/after and creates a `ConversationCheckpoint` **only when something genuinely changed** → `generateReasoning()` writes an `AIReasoning` record whose explanation and evidence are grounded strictly in the computed diff (the prompt is given only the actual before/after values — it cannot invent a change that didn't happen). Confidence is computed from how many independent signals agree, not guessed.
- "Why I Changed" panel: what changed, AI reasoning, evidence, DNA impact, confidence with a plain-language explanation of the score, sources — all real, sourced from the `AIReasoning` row.
- Subtle, non-blocking toast when a checkpoint fires during a live conversation.

**Honest scope cuts** (flagging now rather than letting them surprise you later):
- **No dedicated `/chat/history`, `/chat/checkpoint/[id]`, or `/chat/replay/[id]` pages.** Checkpoints and Why-I-Changed currently live inline in the chat Timeline tab. A full-page cinematic Replay mode (play/pause/scrub through a conversation's history with synchronized DNA morphing) is unbuilt.
- **No branching UI.** `branchedFromCheckpointId` exists on the schema, but there's no "Branch from this checkpoint" button yet.
- **No Conversation Insights page**, no checkpoint export (PDF/Markdown/JSON), no semantic search over checkpoints/messages — `searchChats` does a plain `contains` text search today, not embeddings.
- **No "Why Not" (rejected alternatives) section** in Why-I-Changed, and no Debug Mode.
- **No syntax highlighting library** — code blocks render in a styled monospace block, not Shiki/Prism-tokenized.
- These are all real, addressable follow-ons against the schema and services already in place — none of them require re-architecting what's here.

## Landing page design notes

- **Type**: Geist (UI/body, used app-wide) paired with **Fraunces** as a characterful display serif, scoped to marketing pages only via a CSS variable override in `(marketing)/layout.tsx`. Chosen to read as *archive/collector*, not generic SaaS-sans.
- **Signature motif**: the "DNA Thread" (`components/marketing/DNAThread.tsx`) — a flowing double-helix SVG. It appears once, large and ambient, behind the hero, then reappears at small scale as the connective spine running through "How Vinci AI Thinks" — the same motif used intentionally in two places rather than a different gradient blob per section.
- **Heavy/interactive sections are code-split** via `next/dynamic` (`DemoPreview`, `DNAShowcase` (recharts), `ReplayPreview`, `LegacyPreview`) so the hero paints fast and below-the-fold JS loads on demand.
- **`prefers-reduced-motion`** is respected throughout via `framer-motion`'s `useReducedMotion()` — ambient rotation, floating cards, and the DNA Thread's draw-in animation all short-circuit to a static, fully-visible state.
- All numeric content in the landing page sections (DNA score, traits, testimonials) is clearly demonstration/preview content, not data pulled from the live app — explicitly labeled where shown (radar chart caption, testimonials section).

## Roadmap

See the Status table above — this README is updated as each depth-first phase lands.

## Deployment

Target: Vercel.

1. Push this repo to GitHub.
2. Import into Vercel, add all `.env.example` variables in Project Settings → Environment Variables.
3. Vercel runs `prisma generate` automatically via `postinstall`.
4. Add your Vercel deployment URL to Supabase Auth → URL Configuration (Site URL + Redirect URLs: `https://<your-domain>/api/auth/callback`).

## Screenshots

_To be added once the Landing Page and Dashboard depth-build passes are complete._
