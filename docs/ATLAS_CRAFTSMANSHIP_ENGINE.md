# The Atlas Craftsmanship Engine (AF-192)

Built entirely under `src/game/atlasCraftsmanship/`. AF-191's direct sibling — the Creator Engine governs the act of creation, the Craftsmanship Engine governs the pursuit of excellence.

**NAMING NOTE (light-touch):** unrelated to `src/game/crafting/`'s item-recipe Crafting System and `src/game/masterIndex/`'s module dependency registry — shared English words only.

## What's already real, reused directly

- **"Master Craftsmen"** is exactly AF-166's real `ReputationTracker`.
- **"Quality Without Perfection"** is exactly AF-149's real `IterationCycleTracker`.
- **"The Maker's Mark"** composes AF-151's real `KnowledgeGraph.addEdge` directly.
- **"The Craft Guilds"** reuses AF-160's real `MentorshipLedger` directly.

All confirmed by dedicated tests.

## Overlap (documented honestly with AF-170's own `detectOverlap`)

- **"Craftsmanship Domains"** (12) shares 9 of 12 with AF-191's real `CREATIVE_DOMAINS` — no record claimed (current record is AF-191's own 12/12 against the same list).
- **"The Craft Cycle"** shares only 3 of 10 stages with AF-191's real `CREATION_CYCLE_STAGES` despite being sibling 10-stage process ladders — and is structurally different (ordered, non-cyclic vs. explicitly closed-loop).

## What's genuinely new

- **`craftCycleRank`** — an ordered, non-cyclic rank lookup (never `CyclicStageTracker`, since the spec never draws a wrap back to Inspiration).
- **`standardOfExcellenceAssessment`** — an ANY-of-N shape that gates ONGOING INVESTMENT rather than rejection or completion, distinct in direction from every other ANY-of-N gate in the codebase.

## Live

Fresh-run debug line: `craftsman  master craftsman Precision · ready to ship=true · maker's mark neighbours 2 · guild mentees 1 · craft cycle rank 6 · continue refining=true · domain overlap[Craft,Creative] 9/12 · cycle overlap[Craft,Creation] 3/10`. Browser-verified; the only console messages present are expected fresh-localStorage save-slice reset notices plus the same pre-existing, baseline-confirmed 404 noted since AF-154 (unrelated to this module).

## Review

Zero changes to AF-149's `IterationCycleTracker`, AF-151's `KnowledgeGraph`, AF-160's `MentorshipLedger`, AF-166's `ReputationTracker`, AF-170's `detectOverlap`, AF-171's `CREATIVE_DOMAINS`, AF-191's `CREATION_CYCLE_STAGES`, or any other locked module. 7 tests, suite at 2070. Score 9.5/10 — approved and locked.
