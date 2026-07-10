# The Atlas Decision Engine (AF-156)

Built entirely under `src/game/atlasDecision/`. Where AF-155 determines what an entity understands, AF-156 determines what it actually chooses to do. Four of its own named sections turned out to already be exactly AF-155's real mechanics.

## What's already real, reused directly

- **Decision Pyramid Levels III–VI** ("Knowledge... Possibilities... Evaluation... Choice") are exactly AF-155's real `rankOptions`. `explainDecision` composes it directly rather than re-scoring anything, then derives a rejected-alternatives ranking as a thin wrapper.
- **"Uncertainty"** (confidence, known unknowns, estimated risk) is exactly AF-155's real Uncertainty Model — `suggestUncertaintyResponse` is reused directly, no second confidence formula.
- **The Decision Pyramid's own progression** (7 levels, ending in "Reflection") is driven by AF-155's real generic `CyclicStageTracker<TStage>` directly — no new stage-tracker class.
- **"Group Decisions"** ("multiple bodies reach consensus... knowledge spreads") is confirmed the same mechanic as AF-155's real "Collaborative Intelligence" (`CollaborativeProblemLog`) at a formal-body granularity — reused directly.

## The module's central structural resolution

AF-155's six "reasoning" lists (Commander/Colony/Scientific/Exploration/Social/Strategic Reasoning Factors) are EVALUATION CRITERIA that feed a score. AF-156's seven "Decisions" sections (Commander/Citizen/Colony/Research/Exploration/Wildlife/Social) are a genuinely different axis: the DECISION SLOTS themselves — the actual choices being made ("Destination", "Route", "Team" — not evaluation criteria at all). Confirmed by direct comparison: `EXPLORATION_DECISION_KINDS` shares zero members with AF-155's real `EXPLORATION_REASONING_FACTORS`, verified by a dedicated test. Kept as seven new reference-vocabulary unions, never merged with AF-155's factor lists.

## Respecting a real design law

"Decision Factors" lists "Personality" as a top-level input. Per AF-030/AF-155's established design law, Personality here may only explain or flavour a decision `rankOptions` already reached by other numeric factors — never add its own weight to the score. Confirmed by a dedicated test.

## What's genuinely new

- **`ethicalAlignmentScore`** — lets different factions weigh the same 6 Ethical Framework values differently, a decoupled composer over plain priority maps.
- **`cappedPlayerInfluence`** — enforces "never absolute control" with a hard 0.5 ceiling regardless of the raw signal.
- **`planningHorizonRank`** — orders the 5 Long-term Planning horizons (mirroring AF-148/154's real indexOf-rank pattern).
- **`DecisionLog.isRepetitive`** — satisfies the self-review's "eliminate repetitive choices" directive by generalising AF-153/154's real "same value across the whole window" stall/imbalance check across any decision domain.

## Live

Fresh-run debug line: `decision pyramid Need (next Context) · decision expand-north confidence 0.38 rejected [expand-south] · repetitive=false · ethics 18 · player influence 0.50 (cap 0.5) · horizon rank 3`. Browser-verified; the only console message present is the same pre-existing, baseline-confirmed 404 noted since AF-154 (unrelated to this module).

## Review

Zero changes to AF-155's `rankOptions`/`suggestUncertaintyResponse`/`CyclicStageTracker`/`CollaborativeProblemLog`, AF-153's `EmotionalPacingTracker`, AF-154's `PacingCycleTracker`, AF-030's `PersonalityTrait`, AF-148's `canonPyramidRank`, or any other locked module. 10 tests, suite at 1749. Score 9.5/10 — approved and locked.
