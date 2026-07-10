# The Atlas Protocol (AF-149)

Built entirely under `src/game/atlasProtocol/`. Explicitly distinguished from AF-145's Atlas Core by its own text — AF-145 is philosophy, this is *execution*, a real feature-development workflow. That difference in kind changed what it overlaps with: not the abstract-value/checklist-gate modules (AF-145/146/147), but the project's existing pipeline-stage lists.

## What overlaps, and stays separate

- **"The Seven Stages"** is the *fifth* distinct pipeline-stage list in this codebase, after the real `docs/CONSTITUTION.md`'s 11-stage "DEVELOPMENT PIPELINE," AF-097's real `CONTENT_PIPELINE_STAGES`, AF-095's own (differently-scoped, same-named) `CONTENT_PIPELINE_STAGES`, and AF-095's `RELEASE_PIPELINE_STAGES`. `ATLAS_PROTOCOL_STAGES` follows the same real `next*Stage` function pattern those already established (`nextQaPipelineStage`, `nextContentPipelineStage`) rather than inventing a new shape.
- **"The Atlas Score"** (10 categories, gated at 9.5/10) is the same mechanic as AF-143's real `DesignScoreCard`/`DESIGN_SCORE_CATEGORIES` (9 categories, same threshold). `AtlasScoreCard` mirrors that class's exact shape but is typed to its own separate `AtlasScoreCategory` union, since AF-143's class is hand-typed to its own closed union rather than a reusable generic.
- **"System Impact Map"** (11 categories) is the *fifth* parallel "which systems does this touch" list, after AF-142's real `SYSTEM_COMPATIBILITY_TARGETS`, AF-144's real `AOS_RESPONSIBILITIES`, AF-145's real `ATLAS_SYSTEM_HIERARCHY`, and even this module's own earlier "Integration" stage target list — kept as its own separate list.
- **"Final Validation"** (4 questions, all-must-pass) is the *seventh* occurrence of the same checklist-gate mechanic in this codebase.

## What's new

- **`FeatureLifecycleTracker`** — tracks a feature's real progress through the Seven Stages; `advance` only moves forward one stage at a time, never skips, never regresses.
- **`AtlasScoreCard`** — real, clamped 0-10 scoring, requiring every category before the gate can pass.
- **`IterationCycleTracker`** — "never ship the first version" as a real structural rule: a feature is only marked ready after at least two genuine cycles.
- **`systemImpactReportFor`/`featureFlagAssessment`/`finalValidationPassed`** — decoupled composers over plain signals, never importing the systems/flags they report on.

## Live

Fresh-run debug line: `protocol stage Integration · impact [Gameplay, Civilisation, History] · flags reject=false green=3 · atlas score 9.7 (passed) · cycles 2 ready=true · final validation passed`. Browser-verified, zero page errors.

## Review

Zero changes to AF-094/095/097's real pipelines, AF-143's `DesignScoreCard`, AF-142/144/145's system lists, or any other locked module. 9 tests, suite at 1681. Score 9.5/10 — approved and locked.
