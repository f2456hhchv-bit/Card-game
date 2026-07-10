# The Atlas Planning Engine (AF-157)

Built entirely under `src/game/atlasPlanning/`. Where AF-156 determines the best immediate choice, AF-157 coordinates sequences of those choices across hours, days, years and generations.

## What's already real, reused directly

- **"Collaborative Planning"** ("multiple organisations contribute... shared plans produce stronger outcomes") is confirmed the THIRD instance of the identical mechanic in this codebase, after AF-155's own "Collaborative Intelligence" (`CollaborativeProblemLog`) and AF-156's "Group Decisions" (same class, formal-body granularity). Reused directly again — a plan's contributors are just another `CollaborativeProblemLog.propose` participant list.
- **"Plan Negotiation"** ("competing priorities resolve through 7 factors") is the same weigh-factors-pick-best-know-the-rejected-alternatives mechanic as AF-156's real `explainDecision` (itself composing AF-155's real `rankOptions`). Reused directly — no third scoring formula.

## The module's structural resolutions

- **"Planning Horizons"** (Immediate/Short-Term/Medium-Term/Long-Term/Generational, each with concrete seconds→decades durations) looks like two existing ladders but is confirmed a genuinely different axis from both, verified by a dedicated test: AF-156's real `LONG_TERM_PLANNING_HORIZONS` ranks by decision SCOPE, and AF-153's real `SIMULATION_TIERS` ranks SPATIAL simulation scope — neither is a concrete time unit. "Immediate" is the shared name across all three, but each names a different quantity.
- The six planning-domain sections (Commander/Colony/Scientific/Exploration/Economic/Environmental) each list concrete PLAN categories — a different axis from AF-155's evaluation-criteria "reasoning factors" and AF-156's decision-slot `*_DECISION_KINDS` — kept as six new `*_PLAN_KINDS` reference-vocabulary unions.

## What's genuinely new

- **`PlanRegistry.dependenciesSatisfied`** — gives "Plan Components: Dependencies" real teeth, mirroring AF-150's real dependency-graph philosophy at the plan granularity: a dependency only resolves once the referenced plan is both registered AND marked complete.
- **`PlanAdaptationLog`** — "plans adapt instead of failing," an append-only record of a plan mutating in response to one of 6 named triggers.
- **`PlanMemoryArchive`** — "completed plans become... civilisation learns," recording which of 6 named outputs a completed plan produced.
- **`ContingencySet`/`hasContingencyCoverage`** — a fixed set of 6 fallback slots checked structurally rather than scored numerically — "no critical project relies upon one path."

## Live

Fresh-run debug line: `planning plan reforest-verdance horizon Long-Term · contingency coverage=true · dependencies satisfied=true · adaptations 1 · memory 0 · negotiation winner reforest-verdance`. Browser-verified; the only console message present is the same pre-existing, baseline-confirmed 404 noted since AF-154 (unrelated to this module).

## Review

Zero changes to AF-155's `CollaborativeProblemLog`, AF-156's `explainDecision`/`LONG_TERM_PLANNING_HORIZONS`, AF-153's `SIMULATION_TIERS`, AF-150's dependency-graph algorithm, or any other locked module. 8 tests, suite at 1757. Score 9.5/10 — approved and locked.
