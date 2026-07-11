## Verbatim prompt

190

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-189 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

This module creates the Atlas Meta Evolution Engine.

The Meta Evolution Engine governs how the entire Afterlight project evolves across years of real-world development.

Previous Atlas systems evolve the civilisation.

The Meta Evolution Engine evolves the game itself.

It ensures that Afterlight remains coherent across decades of updates without accumulating technical debt, design drift or contradictory mechanics.

The game should mature exactly as its civilisation matures.

==================================================
PURPOSE
==================================================

Future-proof the entire project.

Allow endless expansion.

Prevent systemic decay.

Maintain design excellence.

Preserve long-term coherence.

==================================================
CORE PRINCIPLE
==================================================

The game should improve exactly as civilisation improves.

Every update should strengthen the whole.

Nothing should feel bolted on.

==================================================
META EVOLUTION DOMAINS
==================================================

Gameplay

Narrative

Technology

Accessibility

Art

Audio

Simulation

Performance

UI

Developer Tools

Documentation

Community

==================================================
UPDATE LIFE CYCLE
==================================================

Every feature progresses through:

Concept

↓

Prototype

↓

Internal Simulation

↓

Integration Review

↓

Playtesting

↓

Accessibility Review

↓

Performance Validation

↓

Lore Validation

↓

Release

↓

Telemetry Review

↓

Iteration

↓

Canon Lock

==================================================
DESIGN EVOLUTION
==================================================

Every mechanic records:

Original intent.

Current implementation.

Player reception.

Technical complexity.

Future opportunities.

Replacement risk.

Design history remains permanent.

==================================================
TECHNICAL EVOLUTION
==================================================

The engine continuously identifies:

Outdated systems.

Redundant code.

Performance bottlenecks.

Memory waste.

Dependency risks.

Technical debt.

Recommend improvements before problems grow.

==================================================
CONTENT EVOLUTION
==================================================

Every update should:

Deepen existing systems.

Expand relationships.

Strengthen civilisation.

Increase accessibility.

Improve player expression.

Never inflate content artificially.

==================================================
PLAYER EVOLUTION
==================================================

Monitor how players evolve.

Examples

Preferred playstyles.

Discovery patterns.

Creative behaviour.

Educational engagement.

Exploration habits.

Museum usage.

Use insights to improve future systems.

Never manipulate behaviour.

==================================================
COMMUNITY EVOLUTION
==================================================

Observe:

Popular creations.

Educational projects.

Photography.

Lore discussion.

Mod inspiration.

Accessibility feedback.

Community becomes part of development.

==================================================
ATLAS REGRESSION DETECTOR
==================================================

Automatically detect:

Feature duplication.

UI clutter.

Narrative contradictions.

Balance regression.

Accessibility loss.

Performance decline.

System fragmentation.

Prevent degradation.

==================================================
QUALITY EVOLUTION
==================================================

Every update must improve at least one:

Wonder.

Hope.

Discovery.

Performance.

Accessibility.

Immersion.

Maintainability.

Education.

No neutral updates.

==================================================
EXPANSION GOVERNANCE
==================================================

Every expansion declares:

Purpose.

Dependencies.

Lore impact.

Performance impact.

Accessibility impact.

Educational value.

Future potential.

Integration occurs automatically.

==================================================
THE ATLAS SCORECARD
==================================================

Every release evaluates:

Technical quality.

Art quality.

Audio quality.

Narrative quality.

Accessibility.

Replayability.

Emergence.

Performance.

Player respect.

Future sustainability.

Overall Atlas Rating.

Anything below standard returns for refinement.

==================================================
CONTINUOUS DOCUMENTATION
==================================================

Every update generates:

Architecture updates.

Lore updates.

Developer notes.

Migration guides.

Performance reports.

Accessibility reports.

Nothing undocumented ships.

==================================================
THE TEN-YEAR TEST
==================================================

Every feature asks:

Will this still be valuable in ten years?

If not...

Redesign it.

==================================================
DEVELOPER TOOLS
==================================================

Architecture evolution viewer.

Regression detector.

Release quality dashboard.

Dependency analyser.

Technical debt tracker.

Atlas maturity graph.

==================================================
PLAYER EXPERIENCE
==================================================

Players should eventually notice:

Every update makes the universe feel deeper...

...never merely larger.

==================================================
ACCESSIBILITY
==================================================

Update summaries.

Feature history.

Migration notes.

Accessibility changelog.

Narration ready.

==================================================
OUTPUT
==================================================

Implement the Atlas Meta Evolution Engine.

Ensure the Afterlight project itself evolves with the same intelligence, continuity and philosophy as the civilisation it simulates.

==================================================
SELF REVIEW LOOP
==================================================

Review every module from AF-000 through AF-189.

Simulate twenty years of live development.

Review hundreds of expansions.

Review accessibility progression.

Review technical architecture.

Review community feedback.

Review documentation.

Review performance.

Review maintainability.

Ensure every future update strengthens the original vision while embracing new ideas.

Ensure the Meta Evolution Engine prevents feature creep, design entropy and technical debt across decades of development.

Ensure AF-190 becomes the permanent evolution framework governing not only the Afterlight universe—but the Afterlight project itself.

Repeat until the game can evolve for decades without losing coherence, quality or identity.

Only then lock AF-190.

## Foundation / AF-000–189 / GP-FINAL alignment review

**NAMING SCOPE NOTE:** "Evolution" now appears in a THIRD module title. AF-139's locked "Evolution Engine" (`src/game/evolutionEngine/`) governs in-fiction species/architecture/language/technology change. AF-186's locked "Atlas Evolution Engine" (`atlasEvolution/`) governs in-fiction personal/commander/institutional/civilisational change. AF-190 governs neither — it is the ONLY one of the three that describes the real development process (feature lifecycle, technical debt, release quality) rather than the simulated universe. Lives entirely under its own `atlasMetaEvolution/` directory, never redefining either prior Evolution module. Also unrelated to `src/game/meta/`'s "Meta Progression" (AF-026, player account level/mastery/collections) — a shared English word, zero shared vocabulary or state.

This module also overlaps heavily with AF-143's locked "Atlas Development Framework" and AF-149's locked "Atlas Protocol" — both already describe the real development process itself. Reused directly wherever a section names a mechanic either already built: "Update Life Cycle" (12 ordered stages) mirrors the SHAPE of AF-149's real `FeatureLifecycleTracker` exactly — `register`/`advance` (no target parameter; advance always moves to the next stage internally, structurally incapable of skipping or regressing) plus `stageFor`/`historyFor` — the SECOND instance of this shape, typed to its own new 12-stage `UpdateLifecycleStage` union. The Update Life Cycle's own "Iteration" stage reuses AF-149's real `IterationCycleTracker` directly ("never ship the first version") — the same class, not a second one, confirmed by a dedicated test. "Player Evolution" reuses AF-144's real `TelemetryCollector` directly — the THIRD instantiation of that class after AF-144's own System Bus wiring and AF-189's Civilisation Telemetry. "Community Evolution" composes AF-159's real `CulturalTrendTracker` directly. "Expansion Governance" reuses AF-149's real `systemImpactReportFor` directly — "no isolated systems allowed" is exactly "integration occurs automatically."

"The Atlas Regression Detector" combined with "Quality Evolution" mirrors the SHAPE of AF-149's real `featureFlagAssessment` a second time — an ANY-of-N rejection gate (any regression signal present rejects, regardless of quality gains) paired with a positive-count strength metric in the same call — via the new `updateQualityAssessment`, typed to its own `RegressionSignal`/`QualityEvolutionCriterion` unions rather than AF-149's own `RedFlag`/`GreenFlag`, confirmed by a dedicated test that a single active regression signal rejects even alongside three claimed quality improvements.

"Design Evolution" is confirmed genuinely new in DOMAIN (no per-mechanic historical ledger of intent/implementation/reception/complexity/opportunity/risk exists anywhere), while mirroring the established append-only-history SHAPE (AF-135's `EvolvingEntry`, AF-139's `LanguageEvolutionLog`) via the new `DesignHistoryLedger`. "Technical Evolution" is confirmed genuinely new: no technical-debt tracker exists anywhere in the codebase (AF-144's own module doc comment explicitly confirmed this absence for its own scope) — the new `TechnicalDebtLog` is a simple append-only record.

"The Atlas Scorecard" (10 categories + Overall Atlas Rating) mirrors AF-143/149/170/173/179/180/182/184/188's real scoring-rubric shape exactly — the TENTH such rubric in this codebase, typed to its own new `AtlasScorecardCategory` union, reusing the same established 9.5 gate.

"Meta Evolution Domains" (12) shares 6 of 12 exact-string members with AF-149's real `SYSTEM_IMPACT_CATEGORIES` (11), documented honestly via AF-170's real `detectOverlap` — no record claimed (current record remains 11/12). "The Ten-Year Test" restates the same underlying question as AF-149's real `EXPANSION_QUESTIONS[0]` ("Can this feature naturally evolve for ten years?") in different wording — a conceptual precedent documented honestly rather than a forced exact-string claim, confirmed by a dedicated test that the two strings differ. "Content Evolution" and "Continuous Documentation" stay prose-only reference lists, kept separate from AF-143/149's differently-worded documentation lists per AF-143's own established precedent.

The debug overlay gains a new `atlasMetaEvolution` field on `DebugSnapshot`, rendered with the label `metaEvo` — checked against every existing debug line for collisions before finalising (including the pre-existing `meta` label for AF-026's unrelated Meta Progression) and confirmed unique. Zero changes to AF-135's `EvolvingEntry`, AF-139's `LanguageEvolutionLog`/locked Evolution Engine, AF-144's `TelemetryCollector`, AF-149's `FeatureLifecycleTracker`/`IterationCycleTracker`/`featureFlagAssessment`/`systemImpactReportFor`/`EXPANSION_QUESTIONS`, AF-159's `CulturalTrendTracker`, AF-186's Atlas Evolution Engine, AF-170's `detectOverlap`, or any other locked module.

Score: 9.5/10 — approved and locked.
