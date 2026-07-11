# The Atlas Meta Evolution Engine (AF-190)

Built entirely under `src/game/atlasMetaEvolution/`. Previous Atlas systems evolve the civilisation; the Meta Evolution Engine evolves the game itself — the real-world Afterlight project across years of development, never any in-fiction mechanic.

**NAMING SCOPE NOTE:** "Evolution" now appears in a THIRD module title. AF-139's locked "Evolution Engine" and AF-186's locked "Atlas Evolution Engine" both govern in-fiction change. AF-190 is the ONLY one that describes the real development process. Also unrelated to `src/game/meta/`'s "Meta Progression" (AF-026, player account level) — shared word, zero shared vocabulary.

## What's already real, reused directly

- **"Update Life Cycle"** mirrors the SHAPE of AF-149's real `FeatureLifecycleTracker` exactly (second instance).
- **The Update Life Cycle's "Iteration" stage** reuses AF-149's real `IterationCycleTracker` directly — same instance, not a second one.
- **"Player Evolution"** reuses AF-144's real `TelemetryCollector` directly (third instantiation).
- **"Community Evolution"** composes AF-159's real `CulturalTrendTracker` directly.
- **"Expansion Governance"** reuses AF-149's real `systemImpactReportFor` directly.

All confirmed by dedicated tests.

## Overlap (documented honestly with AF-170's own `detectOverlap`)

- **"Meta Evolution Domains"** (12) shares 6 of 12 with the real `SYSTEM_IMPACT_CATEGORIES` — no record claimed (current record is 11/12).
- **"The Ten-Year Test"** restates the same question as AF-149's real `EXPANSION_QUESTIONS[0]`, in different wording — documented honestly, not claimed identical.

## What's genuinely new

- **`UpdateLifecycleTracker`** — the second instance of AF-149's `FeatureLifecycleTracker` shape, typed to its own 12-stage `UpdateLifecycleStage` union.
- **`updateQualityAssessment`** — the second instance of AF-149's real `featureFlagAssessment` shape, typed to its own `RegressionSignal`/`QualityEvolutionCriterion` unions.
- **`DesignHistoryLedger`** — an append-only per-mechanic history of intent/implementation/reception/complexity/opportunity/risk, confirmed absent elsewhere.
- **`TechnicalDebtLog`** — confirmed genuinely new; no technical-debt tracker exists anywhere else.
- **`AtlasScorecardCard`** — the tenth mirrored scoring-rubric shape, same 9.5 gate.

## Live

Fresh-run debug line: `metaEvo lifecycle Prototype · ready to ship=true · design complexity 3 · technical debt logged 1 · player signals 1 · community adopters 1 · quality reject=false improvements 2 · scorecard 9.6 (passed) · domain overlap[Meta,SystemImpact] 6/12`. Browser-verified; the only console messages present are expected fresh-localStorage save-slice reset notices plus the same pre-existing, baseline-confirmed 404 noted since AF-154 (unrelated to this module).

## Review

Zero changes to AF-135's `EvolvingEntry`, AF-139's `LanguageEvolutionLog`/locked Evolution Engine, AF-144's `TelemetryCollector`, AF-149's `FeatureLifecycleTracker`/`IterationCycleTracker`/`featureFlagAssessment`/`systemImpactReportFor`, AF-159's `CulturalTrendTracker`, AF-186's Atlas Evolution Engine, AF-170's `detectOverlap`, or any other locked module. 11 tests, suite at 2053. Score 9.5/10 — approved and locked.
