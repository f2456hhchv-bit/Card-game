# The Atlas Possibility Space (AF-173)

Built entirely under `src/game/atlasPossibilitySpace/` (a distinct directory from AF-159's already-locked `src/game/atlasPossibility/`, which occupies the closest-sounding name — no collision, no shared files). Sits directly above AF-172's Imagination Engine: imagination invents ideas, the Possibility Space evaluates which of those imagined futures are realistically achievable, without ever committing the universe to one outcome.

## What's already real, reused directly

- **"Possibility Network"** ("required discoveries/people/resources, potential risks/benefits, historical context, future opportunities") is exactly AF-159's real `Possibility` interface / `PossibilityRegistry`, reused directly.
- **"Multiple Futures"** ("Likely/Optimistic/Conservative/Unexpected/Unknown future... no branch becomes inevitable") is mechanically identical to AF-158's real `FUTURE_STATE_KINDS` / `FutureStateForecast` / `mostLikelyFutureState` — wording differs, the five-parallel-never-committed-branch shape does not.
- **"Scientific Possibility"**'s evidence gate ("only evidence-supported possibilities progress") is exactly AF-172's real `HypothesisTracker`, reused directly.
- **"Failed Possibilities"** ("failure becomes knowledge") is exactly AF-159's real `InnovationMemoryArchive`, reused directly.

All confirmed by dedicated tests.

## Overlap record (verified with AF-170's own `detectOverlap`)

- **"Possibility Categories"** (12) ties (does not break) the codebase's 8/12 absolute overlap record: 8 of its 12 members are exact-string matches with the real `DISCOVERY_CATEGORIES`. Kept as its own reference vocabulary — it tags a sandboxed, not-yet-committed possibility's domain, distinct from AF-159's "which discipline discovered this."

## What's genuinely new

- **`SandboxScenarioRegistry`** — a proposal registry with an explicit proposed/committed state, modelling "no real-world consequences occur until decisions are made." The commitment-gate counterpart to AF-172's evidence-gate `HypothesisTracker`.
- **`InnovationFilterScoreCard`** — the FOURTH mirrored scoring-rubric shape in this codebase (after AF-143/149/170's real rubrics), typed to its own `InnovationFilterCriterion` union, sharing the same 9.5 gate threshold.

## Live

Fresh-run debug line: `possibility network possibilities 2 · future Most Likely Future · scientific grounded=false · sandbox committed=false · failed outcomes 2 · filter score 9.6 (passed) · domain overlap[Possibility,Discovery] 8/12`. Browser-verified; the only console messages present are expected fresh-localStorage save-slice reset notices plus the same pre-existing, baseline-confirmed 404 noted since AF-154 (unrelated to this module).

## Review

Zero changes to AF-159's `Possibility`/`PossibilityRegistry`/`InnovationMemoryArchive`/`DISCOVERY_CATEGORIES`, AF-158's `FUTURE_STATE_KINDS`/`FutureStateForecast`/`mostLikelyFutureState`, AF-172's `HypothesisTracker`, AF-170's `detectOverlap`, AF-143/149's scoring-rubric classes, or any other locked module. 8 tests, suite at 1913. Score 9.5/10 — approved and locked.
