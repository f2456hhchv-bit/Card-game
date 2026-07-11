/**
 * The Atlas Meta Evolution Engine (AF-190). Previous Atlas systems evolve
 * the civilisation; the Meta Evolution Engine evolves the game itself —
 * the real-world Afterlight PROJECT, across years of development, not
 * any in-fiction mechanic.
 *
 * NAMING SCOPE NOTE: "Evolution" now appears in a THIRD module title.
 * AF-139's locked "Evolution Engine" (`src/game/evolutionEngine/`)
 * governs in-fiction species/architecture/language/technology change.
 * AF-186's locked "Atlas Evolution Engine" (`atlasEvolution/`) governs
 * in-fiction personal/commander/institutional/civilisational change.
 * AF-190 governs neither — it is the ONLY one of the three that describes
 * the real development process (feature lifecycle, technical debt,
 * release quality), never the simulated universe. Lives entirely under
 * its own `atlasMetaEvolution/` directory, never redefining either prior
 * Evolution module. Also unrelated to `src/game/meta/`'s "Meta
 * Progression" (AF-026, player account level/mastery/collections) — a
 * shared English word, zero shared vocabulary or state.
 *
 * This module also overlaps heavily with AF-143's locked "Atlas
 * Development Framework" and AF-149's locked "Atlas Protocol" — both
 * already describe the real development process itself. Reused directly
 * wherever a section names a mechanic either already built:
 *
 * - "Update Life Cycle" (12 ordered stages, "every feature progresses
 *   through") mirrors the SHAPE of AF-149's real `FeatureLifecycleTracker`
 *   exactly — `register`/`advance` (no target parameter; advance always
 *   moves to the next stage internally, structurally incapable of
 *   skipping or regressing) plus `stageFor`/`historyFor` — the SECOND
 *   instance of this shape, typed to its own new 12-stage
 *   `UpdateLifecycleStage` union (distinct from AF-149's own 7-stage
 *   `ATLAS_PROTOCOL_STAGES`).
 * - The Update Life Cycle's own "Iteration" stage reuses AF-149's real
 *   `IterationCycleTracker` directly ("never ship the first version") —
 *   the same class, not a second one.
 * - "Player Evolution" ("monitor how players evolve... use insights")
 *   reuses AF-144's real `TelemetryCollector` directly — the THIRD
 *   instance of that class after AF-144's own System Bus wiring and
 *   AF-189's Civilisation Telemetry.
 * - "Community Evolution" ("observe... community becomes part of
 *   development") composes AF-159's real `CulturalTrendTracker` directly.
 * - "Expansion Governance" ("every expansion declares... integration
 *   occurs automatically") reuses AF-149's real `systemImpactReportFor`
 *   directly — "no isolated systems allowed" is exactly "integration
 *   occurs automatically."
 *
 * "The Atlas Regression Detector" combined with "Quality Evolution"
 * mirrors the SHAPE of AF-149's real `featureFlagAssessment` a second
 * time — an ANY-of-N rejection gate (any regression signal present
 * rejects, regardless of quality gains) paired with a positive-count
 * strength metric in the same call — via the new `updateQualityAssessment`,
 * typed to its own `RegressionSignal`/`QualityEvolutionCriterion` unions
 * rather than AF-149's own `RedFlag`/`GreenFlag`.
 *
 * "Design Evolution" ("every mechanic records... design history remains
 * permanent") is confirmed genuinely new in DOMAIN (no per-mechanic
 * historical ledger of intent/implementation/reception/complexity/
 * opportunity/risk exists anywhere), while mirroring the established
 * append-only-history SHAPE (AF-135's `EvolvingEntry`, AF-139's
 * `LanguageEvolutionLog`) via the new `DesignHistoryLedger`.
 *
 * "Technical Evolution" ("continuously identifies... recommend
 * improvements before problems grow") is confirmed genuinely new: no
 * technical-debt tracker exists anywhere in the codebase (AF-144's own
 * module doc comment explicitly confirmed this absence for its own
 * scope) — the new `TechnicalDebtLog` is a simple append-only record.
 *
 * "The Atlas Scorecard" (10 categories + Overall Atlas Rating, "anything
 * below standard returns for refinement") mirrors AF-143/149/170/173/
 * 179/180/182/184/188's real scoring-rubric shape exactly — the TENTH
 * such rubric in this codebase, typed to its own new
 * `AtlasScorecardCategory` union, reusing the same established 9.5 gate.
 *
 * "Meta Evolution Domains" (12) shares 6 of 12 exact-string members with
 * AF-149's real `SYSTEM_IMPACT_CATEGORIES` (11) — documented honestly
 * via AF-170's real `detectOverlap`, no record claimed (current record
 * 11/12). "The Ten-Year Test" restates the same underlying question as
 * AF-149's real `EXPANSION_QUESTIONS[0]` ("Can this feature naturally
 * evolve for ten years?") in different wording — a conceptual precedent
 * documented honestly rather than a forced exact-string claim; kept as
 * its own reference text, no new gate function, since the spec frames it
 * as a single design question rather than a checklist.
 *
 * "Content Evolution" and "Continuous Documentation" stay prose-only
 * reference lists — the former is a "deepen, don't inflate" philosophical
 * principle, the latter overlaps in spirit but not exact wording with
 * AF-143/149's real `DOCUMENTATION_OUTPUTS` lists, kept separate per
 * AF-143's own established precedent of not force-mapping differently-
 * worded documentation lists.
 */

export const META_EVOLUTION_DOMAINS = ["Gameplay", "Narrative", "Technology", "Accessibility", "Art", "Audio", "Simulation", "Performance", "UI", "Developer Tools", "Documentation", "Community"] as const;
export type MetaEvolutionDomain = (typeof META_EVOLUTION_DOMAINS)[number];

// ── Update Life Cycle: mirrors AF-149's real FeatureLifecycleTracker shape (2nd instance). ──
export const UPDATE_LIFECYCLE_STAGES = ["Concept", "Prototype", "Internal Simulation", "Integration Review", "Playtesting", "Accessibility Review", "Performance Validation", "Lore Validation", "Release", "Telemetry Review", "Iteration", "Canon Lock"] as const;
export type UpdateLifecycleStage = (typeof UPDATE_LIFECYCLE_STAGES)[number];

/** Mirrors AF-095/097/149's real `next*Stage` closed-union function pattern. */
export function nextUpdateLifecycleStage(stage: UpdateLifecycleStage): UpdateLifecycleStage | null {
  const index = UPDATE_LIFECYCLE_STAGES.indexOf(stage);
  return index >= 0 && index < UPDATE_LIFECYCLE_STAGES.length - 1 ? UPDATE_LIFECYCLE_STAGES[index + 1]! : null;
}

export const TECHNICAL_EVOLUTION_CONCERNS = ["Outdated systems", "Redundant code", "Performance bottlenecks", "Memory waste", "Dependency risks", "Technical debt"] as const;
export type TechnicalEvolutionConcern = (typeof TECHNICAL_EVOLUTION_CONCERNS)[number];

export const CONTENT_EVOLUTION_PRINCIPLES = ["Deepen existing systems", "Expand relationships", "Strengthen civilisation", "Increase accessibility", "Improve player expression"] as const;

export const PLAYER_EVOLUTION_SIGNALS = ["Preferred playstyles", "Discovery patterns", "Creative behaviour", "Educational engagement", "Exploration habits", "Museum usage"] as const;

export const COMMUNITY_EVOLUTION_SIGNALS = ["Popular creations", "Educational projects", "Photography", "Lore discussion", "Mod inspiration", "Accessibility feedback"] as const;

// ── Atlas Regression Detector + Quality Evolution: mirrors AF-149's real featureFlagAssessment shape (2nd instance). ──
export const REGRESSION_SIGNALS = ["Feature duplication", "UI clutter", "Narrative contradictions", "Balance regression", "Accessibility loss", "Performance decline", "System fragmentation"] as const;
export type RegressionSignal = (typeof REGRESSION_SIGNALS)[number];

export const QUALITY_EVOLUTION_CRITERIA = ["Wonder", "Hope", "Discovery", "Performance", "Accessibility", "Immersion", "Maintainability", "Education"] as const;
export type QualityEvolutionCriterion = (typeof QUALITY_EVOLUTION_CRITERIA)[number];

export const EXPANSION_GOVERNANCE_FIELDS = ["Purpose", "Dependencies", "Lore impact", "Performance impact", "Accessibility impact", "Educational value", "Future potential"] as const;

// ── The Atlas Scorecard: the TENTH mirrored scoring-rubric shape in this codebase. ──
export const ATLAS_SCORECARD_CATEGORIES = ["Technical quality", "Art quality", "Audio quality", "Narrative quality", "Accessibility", "Replayability", "Emergence", "Performance", "Player respect", "Future sustainability"] as const;
export type AtlasScorecardCategory = (typeof ATLAS_SCORECARD_CATEGORIES)[number];

export const ATLAS_SCORECARD_GATE_THRESHOLD = 9.5;

export const CONTINUOUS_DOCUMENTATION_OUTPUTS = ["Architecture updates", "Lore updates", "Developer notes", "Migration guides", "Performance reports", "Accessibility reports"] as const;

/** Conceptual precedent: AF-149's real `EXPANSION_QUESTIONS[0]` already
 * asks "Can this feature naturally evolve for ten years?" — different
 * exact wording, same underlying question, documented honestly rather
 * than claimed identical (see module doc comment). */
export const TEN_YEAR_TEST_QUESTION = "Will this still be valuable in ten years?";

export const META_EVOLUTION_DEVELOPER_TOOLS = ["Architecture evolution viewer", "Regression detector", "Release quality dashboard", "Dependency analyser", "Technical debt tracker", "Atlas maturity graph"] as const;
