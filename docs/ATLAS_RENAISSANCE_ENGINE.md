# The Atlas Renaissance Engine (AF-178)

Built entirely under `src/game/atlasRenaissance/`. Sits alongside AF-177's Genesis Engine: Genesis creates beginnings, the Renaissance Engine creates ages.

## What's already real, reused directly

- **"Architectural Renaissance"** ("beauty becomes civic identity") is exactly AF-168's real `BeautyIndexTracker`.
- **"Cultural Renaissance"** composes AF-159's real `CulturalTrendTracker` directly.
- **"The Renaissance Network"** is exactly AF-151's real `KnowledgeGraph.addEdge` using the already-real `"Inspired"` edge kind — the same reuse AF-177's "Spark Network" made.
- **"The End of an Age"** ("achievements become the foundations of the next era") reuses AF-175's real `GenerationalHandoffLedger` directly.

All confirmed by dedicated tests.

## New overlap record (verified with AF-170's own `detectOverlap`)

- **"Renaissance Domains"** (12) is a NEW ABSOLUTE overlap record: 11 of its 12 members are exact-string matches with the real `CREATIVE_DOMAINS`, surpassing the previous 10-member record.

## What's genuinely new

- **`RenaissanceTracker`** — models "a renaissance cannot be forced... it emerges when [factors] all align together" and "multiple triggers compound together" as a compounding-diversity gate: a golden age begins only once enough DISTINCT trigger kinds accumulate, never from repeating the same trigger. "Renaissances conclude naturally, not through collapse, through maturity" is modelled as an explicit `concludeAge` call, never an automatic decay.

## Live

Fresh-run debug line: `renaissance golden age=true distinct triggers 3 · beauty Architecture=85 · cultural adopters 1 · network neighbours 1 · domain overlap[Renaissance,Creative] 11/12`. Browser-verified; the only console messages present are expected fresh-localStorage save-slice reset notices plus the same pre-existing, baseline-confirmed 404 noted since AF-154 (unrelated to this module).

## Review

Zero changes to AF-168's `BeautyIndexTracker`, AF-159's `CulturalTrendTracker`, AF-151's `KnowledgeGraph`, AF-175's `GenerationalHandoffLedger`, AF-171's `CREATIVE_DOMAINS`, AF-170's `detectOverlap`, or any other locked module. 6 tests, suite at 1951. Score 9.5/10 — approved and locked.
