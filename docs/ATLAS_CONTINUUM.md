# The Atlas Continuum (AF-176)

Built entirely under `src/game/atlasContinuum/`. Sits above AF-175's Infinity Engine: the Infinity Engine ensures civilisation always has another future, the Continuum ensures every past, present and future remain permanently connected.

## What's already real, reused directly

- **"The Continuum"** (Past→Memory→Learning→Present→Choice→Future→Legacy→Past Again, "history becomes a living cycle") is driven directly by AF-155's real generic `CyclicStageTracker<TStage>` over this module's own 8-stage `CONTINUUM_STAGES` union.
- **"Time Continuity"** and **"The Threads"** are the same question AF-151's real `KnowledgeGraph.addEdge` already answers.
- **"Generational Continuity"** and **"Player Continuity"** both reuse AF-175's real `GenerationalHandoffLedger` directly — the same ledger spans generations AND campaigns.
- **"Commander Continuity"** composes AF-160's real `MentorshipLedger` directly.
- **"Continuous Culture"** composes AF-159's real `CulturalTrendTracker` directly.
- **"Continuous Questions"** composes AF-159's real `MysteryLog` and AF-169's real `ensureNextHorizonOpen` directly — at least the fourth module to reuse this guarantee.

All confirmed by dedicated tests.

## Overlap record (verified with AF-170's own `detectOverlap`)

- **"Continuum Domains"** (12) ties (does not break) the codebase's 10/12 absolute overlap record against the real `INFINITY_DOMAINS`.
- **"Continuous Discovery"** and **"Continuous Civilisation"** read as near-total conceptual duplicates of AF-174/175's real lists but share zero exact-string members with either, confirmed via `detectOverlap`.

## What's genuinely new

- **`ThreadRegistry`** — curates which entity ids count as a permanently significant "thread."
- **`allThreadsConnected`** — composes AF-151's real `KnowledgeGraph.isIsolated` to verify no marked thread has drifted into isolation, formalising "nothing exists in isolation" as a real structural guarantee.

## Live

Fresh-run debug line: `continuum stage Past (next Past) · generation 3 baseline 5 · threads 1 connected=true · domain overlap[Continuum,Infinity] 10/12`. Browser-verified; the only console messages present are expected fresh-localStorage save-slice reset notices plus the same pre-existing, baseline-confirmed 404 noted since AF-154 (unrelated to this module).

## Review

Zero changes to AF-155's `CyclicStageTracker`, AF-151's `KnowledgeGraph`, AF-175's `GenerationalHandoffLedger`/`INFINITY_DOMAINS`/`SELF_GROWING_SYSTEM_EXAMPLES`, AF-174's `DISCOVERY_CASCADE_OUTCOMES`, AF-160's `MentorshipLedger`, AF-159's `CulturalTrendTracker`/`MysteryLog`, AF-169's `ensureNextHorizonOpen`, AF-170's `detectOverlap`, or any other locked module. 9 tests, suite at 1936. Score 9.5/10 — approved and locked.
