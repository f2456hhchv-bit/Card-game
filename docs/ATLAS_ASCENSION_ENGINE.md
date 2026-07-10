# The Atlas Ascension Engine (AF-179)

Built entirely under `src/game/atlasAscension/`. Measures how humanity matures, never how powerful it becomes.

**Naming note:** the word "Ascension" already appears in the locked AF-069/AF-070 endgame system (a per-run New-Game-Plus prestige counter). This module is an unrelated civilisation-wide maturity ladder, lives in its own directory, and never touches AF-069/AF-070's state.

## What's already real, reused directly

- **"Commander Ascension"**'s "Mentorship" composes AF-160's real `MentorshipLedger` directly.
- **"Cultural Ascension"**'s "Beauty"/"Public spaces" composes AF-168's real `BeautyIndexTracker`; "Knowledge sharing" composes AF-159's real `CulturalTrendTracker`.
- **"Ascension Network"** composes AF-151's real `KnowledgeGraph.addEdge` directly, using the already-real `"Influenced"` edge kind.
- **"Ascension Tiers"/"Scientific Ascension"/"Player Ascension"** (all ordered, non-cyclic) mirror the codebase's established `xRank(stage): number` pattern rather than `CyclicStageTracker`.
- **"The Ascension Test"** mirrors AF-170's real all-must-pass checklist pattern exactly.

All confirmed by dedicated tests.

## Overlap (documented honestly — no record claimed)

- **"Ascension Pillars"** (12) shares 5 of 12 exact-string members with the real `SOUL_DIMENSIONS`, verified via `detectOverlap`.

## What's genuinely new

- **`AscensionIndexScoreCard`** — the FIFTH mirrored scoring-rubric shape in this codebase, sharing the same 9.5 gate. Its governing law "Military dominance is never a primary measure" is enforced structurally: `ASCENSION_INDEX_CRITERIA` has no military/power/strength member, confirmed by a dedicated test.

## Live

Fresh-run debug line: `ascension tier rank 7 · mentees 1 · beauty Public spaces=80 · cultural adopters 1 · network neighbours 1 · index score 9.6 (passed) · domain overlap[Ascension,Soul] 5/12`. Browser-verified; the only console messages present are expected fresh-localStorage save-slice reset notices plus the same pre-existing, baseline-confirmed 404 noted since AF-154 (unrelated to this module).

## Review

Zero changes to AF-160's `MentorshipLedger`, AF-168's `BeautyIndexTracker`/`SOUL_DIMENSIONS`, AF-159's `CulturalTrendTracker`, AF-151's `KnowledgeGraph`, AF-170's `detectOverlap`/checklist pattern, AF-143/149/173's scoring-rubric classes, AF-069/070's endgame ascension system, or any other locked module. 8 tests, suite at 1959. Score 9.5/10 — approved and locked.
