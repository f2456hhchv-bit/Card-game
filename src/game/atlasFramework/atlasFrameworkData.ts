/**
 * The Atlas Development Framework (AF-143). Unlike prior modules, this
 * one describes the DEVELOPMENT PROCESS itself, and a research pass
 * before implementation found something unusual: its "Design Score"
 * section ("only features scoring above 9.5/10 proceed") is not a novel
 * in-fiction mechanic to invent — it is, almost verbatim, this project's
 * own real standing process. `docs/FOUNDATION_LOCK.md:46` already
 * defines the real gate: ten categories (Gameplay Quality · Visual
 * Quality · Technical Quality · Performance · Accessibility ·
 * Replayability · Scalability · Documentation · Lore Consistency ·
 * Integration), overall ≥ 9.5/10, and AF-095's `qualityAssuranceData.ts`
 * already half-acknowledges this via its `developerReview` field
 * ("each module's own self-review score, gated at ≥9.5/10 before lock").
 *
 * This module does NOT mechanically re-derive that real ten-category
 * gate (different names/count than the spec's own nine) — it builds the
 * spec's own separate `DESIGN_SCORE_CATEGORIES` rubric as new, distinct,
 * in-universe tooling, while documenting the real precedent honestly
 * rather than silently claiming the two are the same thing.
 *
 * Confirmed already real, composed directly, zero new list:
 * - "Design Bible" — AF-097's real `CONTENT_TEMPLATE_FIELDS` (14 fields,
 *   including `purpose`/`gameplayRole`/`visualIdentity`/
 *   `accessibilityNotes`) and its real `contentTemplateCompletenessFor`/
 *   `isContentTemplateComplete` already implement exactly "every feature
 *   must define X before entering production" — reused directly rather
 *   than building a second design-bible checker.
 *
 * Confirmed genuinely new (no completeness checker of this shape exists
 * anywhere for individual Commanders or Worlds, confirmed by research):
 * - `commanderCompletenessFor`/`worldCompletenessFor` — decoupled pure
 *   functions taking plain signal values a caller extracts from real
 *   systems (AF-130's BondNetworkRuntime, AF-131's ship rooms, AF-134's
 *   museum, AF-135's chronicle, etc.), the same decoupled-composition
 *   discipline AF-137's `tierWeightsFor` established, so this module has
 *   no import-time dependency on any of them.
 * - Post-launch support tracking and the Knowledge Base — AF-070's
 *   `LiveOpsRegistry` and AF-142's `ModuleRegistry` both only gate at
 *   registration time; neither tracks any metric over time. Confirmed
 *   nothing else does either.
 *
 * Kept as pure reference data, deliberately not re-declaring existing
 * lists: the Accessibility Gate uses this spec's own 8-item wording,
 * decoupled from AF-095's differently-named `ACCESSIBILITY_VALIDATION_CHECKS`
 * (colourContrast/subtitleSupport/uiScaling/inputMethods/narrationSupport/
 * photosensitivity/motionReduction/controllerNavigation) and AF-093's
 * `accessibilityTags` — same count, different exact vocabulary, so kept
 * separate rather than force-mapped. The Developer Toolset heavily
 * overlaps in name with AF-142's real `DEVELOPER_TOOLKIT_SURFACES`
 * (Relationship simulator is an exact duplicate; Commander/Planet
 * Builder ≈ Rapid Commander creation/Planet generator) and AF-094's
 * `DEVELOPER_TOOLS_KINDS` (Balance Sandbox ≈ balanceEditor, Performance
 * Analyzer ≈ performanceViewer) — kept as its own documented list, no
 * new runtime, the same treatment AF-140/141/142 gave sections with no
 * computational analog. Content Validation/Art/Audio/Narrative
 * Pipelines/Performance Targets/Documentation/Automated QA are all kept
 * as pure reference checklists for the same reason — they describe
 * human-authorship process steps AF-094/095/097 already own conceptually,
 * and a fourth near-duplicate validator would violate "extend, don't
 * duplicate."
 */
export const ATLAS_STANDARDS_CATEGORIES = [
  "Design Standards",
  "Technical Standards",
  "Art Standards",
  "Audio Standards",
  "Narrative Standards",
  "Accessibility Standards",
  "Performance Standards",
  "Testing Standards",
  "Documentation Standards",
  "Expansion Standards",
] as const;

export const CONTENT_VALIDATION_CHECKS = [
  "Gameplay overlap",
  "Balance conflicts",
  "Commander compatibility",
  "Museum integration",
  "Legacy integration",
  "Story compatibility",
  "Living Galaxy support",
  "Performance impact",
  "Accessibility score",
  "Documentation completeness",
] as const;

export const ART_PIPELINE_STAGES = ["Concept", "Orthographic views", "Animation guide", "Material guide", "LOD specifications", "Accessibility review", "Memory budget", "Performance budget", "Museum representation"] as const;

export const AUDIO_PIPELINE_STAGES = ["Purpose", "Priority", "Variation count", "Accessibility profile", "Environmental mixing", "Music integration", "Subtitle support", "Voice integration"] as const;

export const NARRATIVE_PIPELINE_ELEMENTS = ["Theme", "Conflict", "Resolution", "Character growth", "Historical impact", "Chronicle integration", "Museum integration", "Future references"] as const;

export const PERFORMANCE_TARGET_KINDS = ["CPU usage", "GPU usage", "Memory", "Streaming", "Network", "Save size", "Loading time", "Battery impact"] as const;

/** The spec's own 8-item wording — deliberately decoupled from AF-095's
 * `ACCESSIBILITY_VALIDATION_CHECKS` and AF-093's `accessibilityTags`
 * (see module doc comment). */
export const ACCESSIBILITY_GATE_CHECKS = ["Subtitle support", "Remappable controls", "Colour-safe visuals", "Difficulty compatibility", "Narration compatibility", "Reduced motion support", "High-contrast support", "Input flexibility"] as const;
export type AccessibilityGateCheck = (typeof ACCESSIBILITY_GATE_CHECKS)[number];

export function accessibilityGatePassed(satisfiedChecks: ReadonlySet<AccessibilityGateCheck>): boolean {
  return ACCESSIBILITY_GATE_CHECKS.every((check) => satisfiedChecks.has(check));
}

export const DOCUMENTATION_OUTPUTS = ["Developer documentation", "Technical diagrams", "Gameplay diagrams", "API references", "Art references", "Narrative references", "QA checklist", "Expansion notes"] as const;

export const AUTOMATED_QA_CHECKS = ["Regression tests", "Save compatibility", "Commander interactions", "Dialogue validation", "Chronicle generation", "Museum updates", "Relationship simulations", "Performance benchmarks"] as const;

/** The spec's own 9-category rubric — a genuinely new, separate
 * structure from the real 10-category gate `docs/FOUNDATION_LOCK.md`
 * already defines (see module doc comment); never claimed to be the
 * same thing. */
export const DESIGN_SCORE_CATEGORIES = ["Originality", "Depth", "Replayability", "Clarity", "Performance", "Accessibility", "Narrative value", "Player delight", "Maintainability"] as const;
export type DesignScoreCategory = (typeof DESIGN_SCORE_CATEGORIES)[number];

export const DESIGN_SCORE_GATE_THRESHOLD = 9.5;

/** Heavily overlaps in name with AF-142's real `DEVELOPER_TOOLKIT_SURFACES`
 * and AF-094's real `DEVELOPER_TOOLS_KINDS` — kept as its own documented
 * list, no new runtime (see module doc comment). */
export const DEVELOPER_TOOLSET_SURFACES = ["Commander Builder", "Planet Builder", "Settlement Builder", "Dialogue Validator", "Lore Validator", "Relationship Simulator", "Balance Sandbox", "Performance Analyzer", "Accessibility Preview"] as const;

export const POST_LAUNCH_TRACKING_CATEGORIES = ["Player behaviour", "Performance", "Accessibility feedback", "Bug frequency", "Narrative reception", "Balance metrics", "Future improvements"] as const;
export type PostLaunchTrackingCategory = (typeof POST_LAUNCH_TRACKING_CATEGORIES)[number];

export const KNOWLEDGE_BASE_CATEGORIES = ["Engineering patterns", "UI standards", "Animation libraries", "Dialogue templates", "Audio libraries", "Optimisation guides"] as const;
export type KnowledgeBaseCategory = (typeof KNOWLEDGE_BASE_CATEGORIES)[number];

/** "Every future Commander must include..." — the spec's own 9-item
 * checklist. Genuinely new: confirmed no completeness checker of this
 * shape exists anywhere for individual Commanders. */
export const COMMANDER_VALIDATION_CHECKLIST = ["Unique fantasy", "No gameplay duplication", "Bond Network integration", "Living Ship interactions", "Museum contribution", "Chronicle biography", "Personal quests", "Mastery track", "Accessibility review"] as const;
export type CommanderValidationCheck = (typeof COMMANDER_VALIDATION_CHECKLIST)[number];

export interface CommanderCompletenessSignals {
  hasUniqueFantasy: boolean;
  gameplayDuplicatesExisting: boolean;
  bondLinkCount: number;
  shipRoomAssigned: boolean;
  museumContributionCount: number;
  hasChronicleBiography: boolean;
  personalQuestCount: number;
  masteryTrackProgress: number;
  accessibilityReviewed: boolean;
}

/** "Every new planet must include..." — the spec's own 10-item
 * checklist. Genuinely new: confirmed no completeness checker of this
 * shape exists anywhere for individual worlds. */
export const WORLD_VALIDATION_CHECKLIST = ["Unique ecology", "Distinct architecture", "Weather profile", "Wildlife", "History", "Economy", "Culture", "Music", "Exploration identity", "Museum compatibility"] as const;
export type WorldValidationCheck = (typeof WORLD_VALIDATION_CHECKLIST)[number];

export interface WorldCompletenessSignals {
  hasUniqueEcology: boolean;
  hasDistinctArchitecture: boolean;
  hasWeatherProfile: boolean;
  hasWildlife: boolean;
  hasHistory: boolean;
  hasEconomy: boolean;
  hasCulture: boolean;
  hasMusic: boolean;
  hasExplorationIdentity: boolean;
  museumCompatible: boolean;
}
