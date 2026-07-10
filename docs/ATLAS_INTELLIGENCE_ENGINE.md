# The Atlas Intelligence Engine (AF-155)

Built entirely under `src/game/atlasIntelligence/`. The reasoning layer above AF-153/154 — where those manage the simulation and the player's experience of it, AF-155 lets individual entities reason, using knowledge already real elsewhere in the codebase.

## What's already real, reused directly

- **"Potential Commander collaborations"** (a Discovery Suggestion kind) is exactly AF-151's real `KnowledgeGraph.suggestConnections` 2-hop shared-neighbour ranking. Reused directly at the call site rather than a second suggestion algorithm.
- The Uncertainty Model's "confidence" spirit echoes AF-144's real `PredictionEngine.forecast` (confidence inversely related to variance) — but the domain genuinely differs (ranking margin between competing options, not a time-series' own variance), so `rankOptions`' confidence formula is its own, never a call into `PredictionEngine`.

## What respects a real design law

- **Commander Reasoning** ("each Commander reasons according to personality") is deliberately built so AF-030's real `PersonalityTrait` never weights or biases the numeric decision score. `commanderProductionData.ts`'s own header comment establishes personality as "dialogue-only by shape... a stat-bearing personality is structurally unrepresentable, not just discouraged by convention." Personality may only select flavour/explanation text for a decision already reached by `rankOptions`' plain numeric factors — confirmed by a dedicated test.

## What's genuinely new

- **`CyclicStageTracker<TStage>`** — a generic cyclic-stage tracker driving BOTH "Intelligence Layers" (Observation→Understanding→Prediction→Planning→Execution→Reflection) and the "Learning Loop" (Observe→Interpret→Plan→Act→Review→Improve). The two lists read as near-synonyms but are confirmed NOT identical — Layers include "Prediction" (no Loop analogue), the Loop includes "Improve" (no Layer analogue) — kept as two separate typed stage lists rather than merged, both driven by one generic class rather than two duplicate ones.
- **`rankOptions`** — the one shared decision-scoring mechanic behind all six "reasoning" sections (Commander/Colony/Scientific/Exploration/Social/Strategic). Each names its own factor vocabulary but describes the identical mechanic — sum named factor scores, pick the best, know the confidence — so one decoupled composer serves all six rather than six near-identical classes.
- **`suggestUncertaintyResponse`** — a deterministic confidence-band mapping to Research/Exploration/Discussion/Investigation, never a random pick.
- **`knowledgeRichnessScore`** — composes plain memory-source counts (recent/historic events, personal/shared memories, museum records, chronicle entries) without importing AF-133/134/135's real classes directly.
- **`CollaborativeProblemLog`** — append-only multi-participant problem-solving log; confirmed genuinely absent elsewhere.
- **`DiscoverySuggestionLog`** — mirrors AF-153's real `EmergenceOpportunityLog` append-only shape, but over AF-155's own `DiscoverySuggestionKind` union — confirmed the fourth "kind of notable moment" list in this codebase, after AF-136/153/154's real lists.

## Live

Fresh-run debug line: `intel layer Observation (next Understanding) · loop Observe (next Interpret) · decision investigate-signal confidence 0.91 (confident) · knowledge richness 8 · collaborations 1 · suggestions 1`. Browser-verified; the only console message present is the same pre-existing, baseline-confirmed 404 noted since AF-154 (unrelated to this module).

## Review

Zero changes to AF-144's `PredictionEngine`/`DecisionRouter`, AF-151's `KnowledgeGraph`, AF-030's `PersonalityTrait`/`PersonalityDialogueHint`, AF-133's `NpcMemoryLog`, AF-134's museum classes, AF-135's `PlanetaryChronicle`, AF-154's `PacingCycleTracker`, or any other locked module. 11 tests, suite at 1739. Score 9.5/10 — approved and locked.
