# The Atlas Genesis Engine (AF-177)

Built entirely under `src/game/atlasGenesis/`. Sits alongside AF-176's Continuum: the Continuum preserves continuity, the Genesis Engine ensures the universe continually creates authentic beginnings.

## What's already real, reused directly

- **"Scientific Origins"**'s "Original hypothesis"/"First experiment" reuse AF-172's real `HypothesisTracker` directly.
- **"Institution Foundations"**'s "Institutional memory" is exactly AF-165's real `InstitutionalMemoryTracker` — "Founders" is already the first category in the real `INSTITUTIONAL_MEMORY_CATEGORIES` union.
- **"The Spark Network"** composes AF-151's real `KnowledgeGraph.addEdge` directly, using the already-real `"Inspired"` edge kind.
- **"Beginning → Legacy"** is driven directly by AF-155's real generic `CyclicStageTracker<TStage>` over a new 5-stage union.
- **"Commander Origins"** composes AF-166's real `IdentityRegistry` directly via `Identity.lifeMilestones`.
- **"The Founders"** composes AF-167's real `EarnedTitleTracker.earn` directly.

All confirmed by dedicated tests.

## Overlap record (verified with AF-170's own `detectOverlap`)

- **"Genesis Domains"** (12) ties (does not break) the codebase's 10/12 absolute overlap record against the real `HORIZON_CATEGORIES`.

## What's genuinely new

- **`GenesisRegistry`** — records the seven "First Moment" fields (founder/reason/location/epoch/inspiration/doubters/believers) per entity. Write-once: a second `recordOrigin` call for an already-recorded id is a no-op, guaranteeing a founding story is never silently rewritten once it becomes permanent history.

## Live

Fresh-run debug line: `genesis origin founder commander-reyes-longlight · hypothesis grounded=false · institution memories 1 · spark neighbours 1 · lifecycle Origin · founder titles 1 · domain overlap[Genesis,Horizon] 10/12`. Browser-verified; the only console messages present are expected fresh-localStorage save-slice reset notices plus the same pre-existing, baseline-confirmed 404 noted since AF-154 (unrelated to this module).

## Review

Zero changes to AF-172's `HypothesisTracker`, AF-165's `InstitutionalMemoryTracker`/`INSTITUTIONAL_MEMORY_CATEGORIES`, AF-151's `KnowledgeGraph`, AF-155's `CyclicStageTracker`, AF-166's `IdentityRegistry`, AF-167's `EarnedTitleTracker`, AF-174's `HORIZON_CATEGORIES`, AF-170's `detectOverlap`, or any other locked module. 9 tests, suite at 1945. Score 9.5/10 — approved and locked.
