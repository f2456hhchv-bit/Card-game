# The Atlas Simulation Director (AF-153)

Built entirely under `src/game/simulationDirector/`. The executive orchestration layer above every prior simulation system. Several of its own named sections turned out to already be exactly what real AF-136/144 classes do.

## What's already real, reused directly

- **"System Synchronisation"** and **"Event Prioritisation"** ("prevent conflicting updates... protect player agency") are exactly AF-144's real `DecisionRouter`. Reused directly via the existing `aosDecisionRouter` instance — zero new arbitration class.
- **"Simulation Budget"** and **"Load Balancing"** (CPU/hardware/battery/frame-rate scaling, "gracefully degrade") are exactly AF-144's real `PerformanceBudgetTracker`. Reused directly via the existing `aosPerformanceBudget` instance for the domain-level concern.

## What's genuinely new

- **`SimulationTierEngine`** — mirrors AF-144's real `PriorityEngine` frame-divisor mechanism, but over this module's own separate 5-tier `SimulationTier` union (Immediate → Local Region → Planetary → Sector → Galactic), since `PriorityEngine` is hand-typed to its own closed 3-tier union.
- **`computeAttentionScore`/`AttentionTracker`** — a real, decoupled 8-factor attention formula and per-entity score storage.
- **`allocateSimulationBudget`** — a genuinely different granularity from AF-144's domain-based `PerformanceBudgetTracker`: proportional CPU-time shares per individual *entity*, based on real Attention Scores.
- **`EmotionalPacingTracker`** — a materially wider 8-category tracker than AF-136's real `StoryDirector` (3 categories: combat/exploration/downtime) — kept separate rather than widening that locked class. `imbalancedCategory` flags when the same beat has dominated a whole window.
- **`narrativeGuardrailsRespected`** — the eighth all-must-pass checklist gate in this codebase, with a genuinely different scope from AF-148's `expansionRespectsTimeline` (protects ongoing simulation updates, not new expansions).
- **`EmergenceOpportunityLog`** — append-only record of surfaced coincidences. The actual discovery mechanism composes AF-151's real `KnowledgeGraph.suggestConnections` at the call site (a "Commander reunion" is a shared-neighbour suggestion) — never reimplementing that algorithm.

## Live

Fresh-run debug line: `simDir tier Immediate · attention 65 (budget 100%) · pacing imbalance none · guardrails respected · emergence 1 · throttle [none]`. Browser-verified, zero page errors.

## Review

Zero changes to AF-144's `DecisionRouter`/`PerformanceBudgetTracker`/`PriorityEngine`, AF-136's `StoryDirector`, AF-148's `expansionRespectsTimeline`, AF-151's `KnowledgeGraph`, or any other locked module. 10 tests, suite at 1714. Score 9.5/10 — approved and locked.
