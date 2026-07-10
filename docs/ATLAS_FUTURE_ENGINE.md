# The Atlas Future Engine (AF-158)

Built entirely under `src/game/atlasFuture/`. Transforms AF-157's planning into vision — where planning coordinates action, forecasting projects state.

## What's already real, reused directly

- **Numeric point-forecasts** (Population growth, Trade demand, breakthroughs, ...) compose AF-144's real `PredictionEngine.forecast` directly. "Population growth" is a verbatim shared member between this module's own `COLONY_FORECASTING_KINDS` and AF-144's real `PREDICTION_KINDS`, confirming this is the same time-series trend-forecasting mechanic AF-144 already provides — the same direct reuse AF-152's real World Model already made for its own "Predictive Reasoning."

## The module's structural resolutions

- **"Future Horizons"** (Immediate/Operational/Strategic/Civilisational/Historic) is confirmed the FOURTH time/scope ladder in this codebase sharing "Immediate" as a tier name, after AF-153's real `SIMULATION_TIERS` (spatial scope), AF-156's real `LONG_TERM_PLANNING_HORIZONS` (decision scope), and AF-157's real `PLANNING_TIME_HORIZONS` (planning-action duration). This one measures FORECAST horizon — a genuinely different question, verified by a dedicated test.
- **"Opportunity Analysis"** mirrors the SHAPE of AF-155's real `DiscoverySuggestionLog` (append-only, surface-by-kind) but never its TYPE, since that class is hand-typed to a closed union rather than a reusable generic. `OpportunityAnalysisKind` shares zero members with AF-155's real `DiscoverySuggestionKind` — confirmed the FIFTH "kind of notable moment" list in this codebase.
- **"Future Memory"** similarly mirrors the SHAPE of AF-157's real `PlanMemoryArchive` — "Educational material" is the one verbatim shared member with AF-157's real `PLAN_MEMORY_OUTCOMES`, but the other four differ enough to keep as its own separate union.

## What's genuinely new

- **"Future States"** (5 kinds: Most Likely/Optimistic/Conservative/High-Risk/Unknown Future, each with its own continuously-updating confidence) models FIVE parallel branching scenarios per entity — a fundamentally different shape from AF-144's real `PredictionEngine`, which produces exactly one point-forecast with one confidence value. `mostLikelyFutureState` picks the branch with the highest currently-stored confidence, never a random pick.
- **`RiskLog`** — "risk creates preparation, not punishment," tracking the latest clamped severity per entity+kind.
- **`OpportunityLog`** / **`FutureMemoryArchive`** — mirrored classes over this module's own unions (see above).

## Live

Fresh-run debug line: `future forecast 52 (confidence 100%) · likely state Most Likely Future · risk 0.40 · opportunities 1 · future memory 0`. Browser-verified; the only console message present is the same pre-existing, baseline-confirmed 404 noted since AF-154 (unrelated to this module).

## Review

Zero changes to AF-144's `PredictionEngine`, AF-155's `DiscoverySuggestionLog`, AF-153's `SIMULATION_TIERS`, AF-156's `LONG_TERM_PLANNING_HORIZONS`, AF-157's `PlanMemoryArchive`/`PLANNING_TIME_HORIZONS`, or any other locked module. 9 tests, suite at 1766. Score 9.5/10 — approved and locked.
