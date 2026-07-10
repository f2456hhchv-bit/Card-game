# The Atlas Consciousness Engine (AF-166)

Built entirely under `src/game/atlasConsciousness/`. Not artificial consciousness — a simulation framework giving intelligent entities continuity of self across years of gameplay.

## What's already real, reused directly

- **"Self Reflection"** is exactly AF-160's real Reflection Loop (`CyclicStageTracker` over `REFLECTION_LOOP_STAGES`) — reused directly, composed with AF-163's real `personalMeaning` `MeaningCurator` instance for what specifically gets reflected upon.
- **"Moral Reasoning"** is exactly AF-155's real `rankOptions` — reused directly, confirmed by a dedicated test, never a single good/evil meter.

## The module's structural resolutions

- **"Values"** (9 examples) is confirmed another entry in this codebase's recurring domain-vocabulary family — 7 of 9 members are exact-string matches with AF-162's real `PURPOSE_DOMAINS`. Kept as its own reference vocabulary since the real new mechanic is `ValuePriorityTracker`'s hard constraint ("values change gradually, never abruptly") — a capped per-update delta.
- **"Life Stages"** (5 stages) describes the same underlying quantity as AF-139's real locked `COMMANDER_MATURITY_STAGES` (4 stages) but that union can't be re-segmented without modifying a locked module. Kept as its own separate `LifeStage` union with an indexOf-rank function.
- **"Personal Growth"** (8 areas) shares exactly 3 exact members (Humility/Emotional maturity/Patience) with AF-160's real `COMMANDER_WISDOM_TRAITS`/`CommanderWisdomTracker`. That tracker is hand-typed to a closed 6-value union, so `PersonalGrowthTracker` mirrors its shape over this module's own 8-value union instead.

## What's genuinely new

- **`IdentityRegistry`** — a full evolving history per character, mirroring AF-161's real `CommanderBeliefTracker` full-history discipline.
- **`hasIdentityGap`** — the plain structural self-image-vs-reputation divergence check the spec asks for, never a numeric score.
- **`EmotionalContinuityTracker`** — "hope gradually returns after setbacks": immediate drop on setback, gradual-only recovery.

## Live

Fresh-run debug line: `conscious identity "Wildlife Commander" gap=false · reflection Experience (topic "none") · value Exploration=5 · growth "Decision quality"=40 (overall 5.0) · hope 70 · moral choice report-the-anomaly · life stage rank 1`. Browser-verified; the only console message present is the same pre-existing, baseline-confirmed 404 noted since AF-154 (unrelated to this module).

## Review

Zero changes to AF-160's `CommanderWisdomTracker`/Reflection Loop, AF-155's `rankOptions`, AF-161's `CommanderBeliefTracker`, AF-162's `PURPOSE_DOMAINS`, AF-139's `COMMANDER_MATURITY_STAGES`, AF-163's `MeaningCurator`, or any other locked module. 11 tests, suite at 1845. Score 9.5/10 — approved and locked.
