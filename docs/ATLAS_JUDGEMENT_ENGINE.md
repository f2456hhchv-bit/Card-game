# The Atlas Judgement Engine (AF-198)

Built entirely under `src/game/atlasJudgement/` (data file only — no Runtime.ts, like AF-197). AF-197's direct sibling — the Reasoning Engine determines how intelligent entities think, the Judgement Engine determines how they ultimately decide.

## What's already real, reused directly

- **Balancing evidence with humanity** is exactly AF-156's real `ethicalAlignmentScore`/`ETHICAL_VALUES`.
- **Scientific/Engineering/Historical Judgement's mechanism** is exactly AF-155's real `rankOptions`.
- **"Judgement Record"** reuses AF-156's real `explainDecision` together with `DecisionLog.record`.
- **"Collective Judgement"** reuses AF-156's real `GROUP_DECISION_BODIES` composed with AF-155's real `CollaborativeProblemLog` (10th+ instance).

All confirmed by dedicated tests.

## Overlap (documented honestly with AF-170's own `detectOverlap`)

- **"Judgement Domains"** (12): 11/12 vs AF-197's real `REASONING_DOMAINS` (ties but does not break AF-191's own 12/12 record).
- **"The Judgement Cycle"**: 3/9 vs AF-197's real `REASONING_CYCLE_STAGES`, 2/9 vs AF-156's real `DECISION_PYRAMID_LEVELS`.
- **"Judgement Record"**: 4/6 fields exactly vs AF-197's real `REASONING_RECORD_FIELDS`.

## What's genuinely new

- **`judgementCycleRank`** — an ordered, non-cyclic rank lookup for the 9-stage Judgement Cycle. The module's only new code — no new stateful class, so no `AtlasJudgementRuntime.ts` file.

## Live

Fresh-run debug line: `judgement  ethical alignment score 18 · collective panel size 2 · judgement record entries 1 · cycle rank 4 · domain overlap[Judgement,Reasoning] 11/12`. Browser-verified; the only console messages present are expected fresh-localStorage save-slice reset notices plus the same pre-existing, baseline-confirmed 404 noted since AF-154 (unrelated to this module).

## Review

Zero changes to AF-155's `rankOptions`/`CollaborativeProblemLog`, AF-156's `ethicalAlignmentScore`/`explainDecision`/`DecisionLog`/`GROUP_DECISION_BODIES`, AF-170's `detectOverlap`, AF-197's `REASONING_DOMAINS`/`REASONING_CYCLE_STAGES`/`REASONING_RECORD_FIELDS`, or any other locked module. 9 tests, suite at 2123. Score 9.5/10 — approved and locked.
