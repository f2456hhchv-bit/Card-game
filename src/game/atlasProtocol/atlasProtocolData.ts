/**
 * The Atlas Protocol (AF-149). Explicitly distinguished from AF-145's
 * Atlas Core by its own text: AF-145 is philosophy, this is execution
 * — a real feature-development WORKFLOW, not another design charter.
 * That makes it overlap with a different part of the codebase than
 * AF-145/146/147/148 did: the project's existing pipeline-stage lists,
 * each following the identical `next*Stage` closed-union pattern.
 *
 * "The Seven Stages" is the FIFTH distinct pipeline-stage list in this
 * codebase, after: the real `docs/CONSTITUTION.md`'s 11-stage
 * "DEVELOPMENT PIPELINE" (Concept→...→Lock); AF-097's real
 * `CONTENT_PIPELINE_STAGES` (`contentProductionData.ts`, concept/lore/
 * gameplayRole/...); AF-095's real `CONTENT_PIPELINE_STAGES`
 * (`qualityAssuranceData.ts` — same identifier, different file/module,
 * no collision: designDocument/implementation/testing/...); and AF-095's
 * real `RELEASE_PIPELINE_STAGES` (internal/automatedQA/.../launch/
 * postReleaseMonitoring). `ATLAS_PROTOCOL_STAGES` is its own sixth,
 * separate list, following the same real `next*Stage` function pattern
 * AF-095/097 already established (`nextQaPipelineStage`,
 * `nextContentPipelineStage`) rather than inventing a new shape.
 *
 * "The Atlas Score" (10 categories, gated at 9.5/10, "return to Stage
 * I") is the same mechanic as AF-143's real `DesignScoreCard`/
 * `DESIGN_SCORE_CATEGORIES` (9 categories, same 9.5 threshold) — kept
 * as its own separate `AtlasScoreCategory` union and `AtlasScoreCard`
 * class (AF-143's class is hand-typed to its own closed union, not a
 * reusable generic — the same missed-generalisation note AF-145 already
 * recorded when it built its own `AtlasPrincipleReinforcementLedger`
 * rather than reusing AF-146's `Pillar`-typed ledger).
 *
 * "System Impact Map" (11 categories) is the FIFTH parallel "which
 * systems does this touch" list, after AF-142's real
 * `SYSTEM_COMPATIBILITY_TARGETS` (12), AF-144's real
 * `AOS_RESPONSIBILITIES` (17), AF-145's real `ATLAS_SYSTEM_HIERARCHY`
 * (10), and this module's own earlier "Integration" stage target list
 * (8) — kept as its own separate list rather than merged into any of
 * the other four.
 *
 * "Final Validation" (4 questions, all must be "Yes") is the SEVENTH
 * occurrence of the same all-must-pass checklist-gate mechanic in this
 * codebase, after the real Constitution's two gates, AF-146's
 * Expansion Test, AF-145's Design Validation, AF-147's Franchise Test,
 * and AF-148's `expansionRespectsTimeline`.
 *
 * "Documentation" (8 outputs) and "Post-Launch Review" (8 categories)
 * both overlap in count and partial vocabulary with AF-143's real
 * `DOCUMENTATION_OUTPUTS` (8) and `POST_LAUNCH_TRACKING_CATEGORIES` (7)
 * — kept as their own separate lists with different exact wording.
 */
export const ATLAS_PROTOCOL_STAGES = ["Discovery", "Integration", "Simulation", "Validation", "Emergence", "Preservation", "Expansion"] as const;
export type AtlasProtocolStage = (typeof ATLAS_PROTOCOL_STAGES)[number];

/** Mirrors AF-095/097's real `next*PipelineStage` function pattern. */
export function nextAtlasProtocolStage(stage: AtlasProtocolStage): AtlasProtocolStage | null {
  const index = ATLAS_PROTOCOL_STAGES.indexOf(stage);
  return index >= 0 && index < ATLAS_PROTOCOL_STAGES.length - 1 ? ATLAS_PROTOCOL_STAGES[index + 1]! : null;
}

export const DISCOVERY_QUESTIONS = ["Why should this feature exist?", "What player fantasy does it fulfil?", "What gap does it solve?"] as const;

export const INTEGRATION_TARGETS = ["Commanders", "Galaxy", "Museum", "Chronicle", "Legacy", "Living Ship", "Civilisation", "Operating System"] as const;

export const SIMULATION_HORIZON_HOURS = [100, 500, 1000, 10000] as const;

export const VALIDATION_CRITERIA = ["Accessibility", "Performance", "Replayability", "Narrative", "Balance", "Visual identity", "Audio identity", "Technical sustainability"] as const;

export const EMERGENCE_QUESTIONS = ["Does it generate stories?", "Unexpected moments?", "Player creativity?", "Long-term memories?"] as const;

export const PRESERVATION_TARGETS = ["Museum", "Chronicle", "Legacy", "Civilisation", "Future generations"] as const;

export const EXPANSION_QUESTIONS = ["Can this feature naturally evolve for ten years?", "Can future developers build upon it?"] as const;

/** The FIFTH parallel "which systems does this touch" list (see module
 * doc comment) — kept separate from AF-142/144/145's real lists and
 * this module's own `INTEGRATION_TARGETS`. */
export const SYSTEM_IMPACT_CATEGORIES = ["Gameplay", "Narrative", "Technical", "Accessibility", "Economy", "Civilisation", "History", "Performance", "Audio", "Art", "Future expansions"] as const;
export type SystemImpactCategory = (typeof SYSTEM_IMPACT_CATEGORIES)[number];

export interface SystemImpactReport {
  affected: readonly SystemImpactCategory[];
  isolated: boolean;
}

/** "No isolated systems allowed." A decoupled composer over plain
 * boolean signals — never imports the 11 systems it reports on. */
export function systemImpactReportFor(signals: Readonly<Partial<Record<SystemImpactCategory, boolean>>>): SystemImpactReport {
  const affected = SYSTEM_IMPACT_CATEGORIES.filter((category) => signals[category]);
  return { affected, isolated: affected.length === 0 };
}

export const ATLAS_QUESTIONS = ["Why does it exist?", "Why does Afterlight need it?", "What emotion does it create?", "What stories emerge?", "How does civilisation change?", "How is history enriched?", "Will players remember it?", "Could it become timeless?"] as const;

export const RED_FLAGS = ["Busywork", "Artificial grind", "Fear of missing out", "Meaningless rarity", "Power inflation", "Content padding", "Shock value", "Needless complexity", "Redundant mechanics", "Disconnected systems"] as const;
export type RedFlag = (typeof RED_FLAGS)[number];

export const GREEN_FLAGS = ["Discovery", "Creativity", "Cooperation", "Exploration", "Mastery", "Education", "Wonder", "Community", "Legacy", "Beauty"] as const;
export type GreenFlag = (typeof GREEN_FLAGS)[number];

export interface FeatureFlagAssessment {
  shouldReject: boolean;
  redFlagCount: number;
  greenFlagStrength: number;
}

/** "Immediately reject features that rely primarily upon [red flags]."
 * Any red flag present is an immediate rejection, regardless of how
 * many green flags accompany it. */
export function featureFlagAssessment(redFlagsPresent: ReadonlySet<RedFlag>, greenFlagsPresent: ReadonlySet<GreenFlag>): FeatureFlagAssessment {
  return { shouldReject: redFlagsPresent.size > 0, redFlagCount: redFlagsPresent.size, greenFlagStrength: greenFlagsPresent.size };
}

export const ITERATION_LOOP_STEPS = ["Prototype", "Observe", "Measure", "Simplify", "Strengthen", "Observe again"] as const;

export const DOCUMENTATION_OUTPUTS = ["Design document", "Technical specification", "Art guide", "Audio guide", "Accessibility guide", "Testing plan", "Expansion notes", "Historical impact summary"] as const;

export const POST_LAUNCH_REVIEW_CATEGORIES = ["Player enjoyment", "Accessibility", "Performance", "Narrative reception", "Replayability", "Emergent stories", "Community creativity", "Technical stability"] as const;

/** The SIXTH abstract-scoring rubric in this codebase's governance
 * modules (see module doc comment) — kept as its own separate union,
 * distinct from AF-143's real `DESIGN_SCORE_CATEGORIES`. */
export const ATLAS_SCORE_CATEGORIES = ["Originality", "Meaning", "Elegance", "Replayability", "Technical Quality", "Accessibility", "Narrative Depth", "System Integration", "Emotional Impact", "Future Expandability"] as const;
export type AtlasScoreCategory = (typeof ATLAS_SCORE_CATEGORIES)[number];

export const ATLAS_SCORE_GATE_THRESHOLD = 9.5;

export const DEVELOPER_OATH_COMMITMENTS = ["Respect the player", "Respect history", "Respect accessibility", "Respect curiosity", "Respect future developers", "Leave the universe better than you found it"] as const;

/** The SEVENTH all-must-pass checklist gate in this codebase (see
 * module doc comment). */
export const FINAL_VALIDATION_QUESTIONS = ["Does this strengthen the Living Galaxy?", "Does this strengthen civilisation?", "Does this strengthen humanity?", "Does this strengthen hope?"] as const;
export type FinalValidationQuestion = (typeof FINAL_VALIDATION_QUESTIONS)[number];

export function finalValidationPassed(answers: ReadonlySet<FinalValidationQuestion>): boolean {
  return FINAL_VALIDATION_QUESTIONS.every((question) => answers.has(question));
}
