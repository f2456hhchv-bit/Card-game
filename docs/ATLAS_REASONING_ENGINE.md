# The Atlas Reasoning Engine (AF-197)

Built entirely under `src/game/atlasReasoning/` (data file only — no Runtime.ts, the first such module this session; see below). Overlaps almost entirely with AF-155's own already-locked "Atlas Intelligence Engine" and AF-156's own already-locked "Atlas Decision Engine."

## What's already real, reused directly

- **"Uncertainty"** is exactly AF-155's real `suggestUncertaintyResponse`.
- **"Collaborative Reasoning"** reuses AF-155's real `CollaborativeProblemLog` (9th+ instance).
- **"Reasoning Record"** reuses AF-156's real `explainDecision` together with AF-156's real `DecisionLog.record`.
- **Commander/Scientific/Engineering/Historical Reasoning's mechanism** is exactly AF-155's real `rankOptions`.

All confirmed by dedicated tests.

## Overlap (documented honestly with AF-170's own `detectOverlap`)

- **"Reasoning Domains"** (12): 7/12 vs AF-196's real `VERIFICATION_DOMAINS`, 6/12 vs AF-195's real `COHERENCE_DOMAINS` — no record claimed.
- **Domain-specific reasoning-criteria lists**: share ZERO exact members with AF-155's own conceptually-identical factor lists (e.g. Commander Reasoning Criteria vs `COMMANDER_REASONING_FACTORS`), mirroring AF-156's own established precedent.
- **"The Reasoning Cycle"**: only 2/9 vs AF-155's `INTELLIGENCE_LAYERS`, 2/9 vs AF-156's `DECISION_PYRAMID_LEVELS`, and 0/9 vs AF-155's own `LEARNING_LOOP_STAGES`.

## What's genuinely new

- **`reasoningCycleRank`** — an ordered, non-cyclic rank lookup for the 9-stage Reasoning Cycle. This is the module's only new code — no new stateful class exists, so there is no `AtlasReasoningRuntime.ts` file.

## Live

Fresh-run debug line: `reasoning  collaborators 2 · best hypothesis hypothesis-dormant-relay · uncertainty response none · reasoning record entries 1 · cycle rank 4 · domain overlap[Reasoning,Verification] 7/12`. Browser-verified; the only console messages present are expected fresh-localStorage save-slice reset notices plus the same pre-existing, baseline-confirmed 404 noted since AF-154 (unrelated to this module).

## Review

Zero changes to AF-155's `rankOptions`/`suggestUncertaintyResponse`/`CollaborativeProblemLog`, AF-156's `explainDecision`/`DecisionLog`, AF-170's `detectOverlap`, AF-195's `COHERENCE_DOMAINS`, AF-196's `VERIFICATION_DOMAINS`, or any other locked module. 8 tests, suite at 2114. Score 9.5/10 — approved and locked.
