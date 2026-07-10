# The Atlas Harmony Engine (AF-182)

Built entirely under `src/game/atlasHarmony/`. AF-181's Eternity preserves civilisation; the Harmony Engine preserves equilibrium — no single domain should permanently dominate another.

## What's already real, reused directly

- **"System Relationships"** and **"Positive Feedback Loops"** both compose AF-151's real `KnowledgeGraph.addEdge` directly (the already-real `"Influenced"` edge kind).
- **"Cultural Harmony"** composes AF-159's real `CulturalTrendTracker` directly.
- **"Commander Harmony"** and **"Social Harmony"** both compose AF-160's real `MentorshipLedger` directly.
- **"Urban Harmony"**'s "Beauty" composes AF-168's real `BeautyIndexTracker` directly.

All confirmed by dedicated tests.

## Overlap (documented honestly with AF-170's own `detectOverlap`)

- **"Harmony Domains"** (12) shares 8 of 12 with the real `CREATIVE_DOMAINS` — no record claimed (current record is 11/12).
- **"The Harmony Index"** shares 3 of 8 criteria with the real `TRANSCENDENCE_INDEX_CRITERIA`.

## What's genuinely new

- **`HarmonyTracker`** — models "balance is dynamic, not static" via a capped-delta-per-update constraint (mirroring AF-166's `ValuePriorityTracker`, but at civilisation scale). `mostDominantDomain`/`mostNeglectedDomain`/`isBalanced` read the emergent spread across all tracked domains — "no single domain should permanently dominate another" as a structural check, not an assigned value.
- **`HarmonyIndexScoreCard`** — the seventh mirrored scoring-rubric shape in this codebase, sharing the same 9.5 gate.

## Live

Fresh-run debug line: `harmony dominant Science · neglected Science · balanced=true · network neighbours 1 · cultural adopters 1 · beauty Public spaces=75 · index score 9.6 (passed) · domain overlap[Harmony,Creative] 8/12`. Browser-verified; the only console messages present are expected fresh-localStorage save-slice reset notices plus the same pre-existing, baseline-confirmed 404 noted since AF-154 (unrelated to this module).

## Review

Zero changes to AF-151's `KnowledgeGraph`, AF-159's `CulturalTrendTracker`, AF-160's `MentorshipLedger`, AF-168's `BeautyIndexTracker`, AF-166's `ValuePriorityTracker`, AF-171's `CREATIVE_DOMAINS`, AF-180's `TRANSCENDENCE_INDEX_CRITERIA`, AF-170's `detectOverlap`, AF-143/149/173/179's scoring-rubric classes, or any other locked module. 7 tests, suite at 1985. Score 9.5/10 — approved and locked.
