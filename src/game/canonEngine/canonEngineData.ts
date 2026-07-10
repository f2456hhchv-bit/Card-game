/**
 * The Atlas Canon Engine (AF-148). A research pass before implementation
 * found this module composes far more directly with real AF-133/134/135
 * classes than any prior "governance" module (AF-145/146/147) did — this
 * one is a genuine consistency/validation engine over lore that already
 * has real storage to extend, not just design philosophy to restate.
 *
 * Confirmed already real, reused directly, zero new code for the base
 * mechanic:
 * - "Discovery Model" ("ancient discoveries never overwrite canon...
 *   expand context") — AF-135's real `EvolvingEntry` already fully
 *   implements expand-never-overwrite (confirmed: no mutate/delete
 *   method exists anywhere on the class). Reused directly for
 *   "Historical Understanding" below, and for "Academic Evolution"
 *   (historians revise via new evidence — the same mechanic).
 * - "Multiple Perspectives" — AF-135's real `AuthorVoice` union
 *   (Scientists/Military historians/Children/Explorers/Engineers/
 *   Commanders/Citizens, 7 values) is near-identical vocabulary to this
 *   spec's own 7-role list. Reused directly rather than adding a third
 *   overlapping union (a second real union, `PerspectiveKind`, already
 *   exists in `chronicleData.ts` with different membership — this
 *   module picks `AuthorVoice` since it's the closer match, and never
 *   touches `PerspectiveKind`).
 * - "Planet Continuity" — AF-135's real `PlanetaryChronicle` (one
 *   `EvolvingEntry` per planet) is reused directly via
 *   `recordPlanetContinuityFact` below, rather than a parallel store.
 *
 * Confirmed genuinely new (no existing shape covers these):
 * - "Canon Pyramid" (6 levels) governs IN-FICTION narrative-layer
 *   authority (how trustworthy a record TYPE is). AF-147's real
 *   `CANON_TIERS`/`CanonAuthorityResolver` (just built this session)
 *   governs REAL-WORLD MEDIA SOURCE authority (which book/game wins) —
 *   a different axis entirely, confirmed by AF-147's `CanonStatement`
 *   being keyed to `sourceId`, never a narrative layer. This module
 *   defines its own separate `CanonPyramidLevel` union and mirrors
 *   AF-147's `canonTierRank` indexOf PATTERN (never importing its type).
 * - "Knowledge States" (Objective Reality / Historical Understanding /
 *   Public Knowledge, "these may differ") — confirmed absent; AF-144's
 *   `WorldStateStore` is the closest conceptual precedent (Current/
 *   Historical/Projected slots) but is generic infrastructure with no
 *   narrative-specific three-form model.
 * - "Historical Consistency"'s full event shape (date/participants/
 *   planet/galaxy/commanders/witnesses/evidence/museum+chronicle
 *   references/relationship impact/future callbacks) is genuinely
 *   richer than AF-133's real `OfficialHistoricalRecord` (which has no
 *   witnesses/evidence fields).
 * - "Commander Continuity"'s full biographical shape (birth/education/
 *   career/reputation/private-memory-text/retirement/legacy) is
 *   materially richer than AF-135's real `commanderHistoryFor` (a thin
 *   numeric aggregate: memory count, gift count, one strongest bond —
 *   confirmed no biographical prose fields exist there).
 * - "Artifact Authenticity" (provenance/ownership chain/restoration
 *   history/authenticity confidence) — confirmed genuinely absent;
 *   AF-134's `GiftLedger`/`RestorationLab` track donation metadata and
 *   restoration progress, never provenance or authenticity confidence.
 * - "Timeline Protection" as a semantic non-invalidation checker —
 *   confirmed genuinely new. AF-070's `LiveOpsRegistry` and AF-142's
 *   `ModuleRegistry` both only guard against id COLLISIONS, never check
 *   whether new content is semantically consistent with prior history.
 *
 * "Lore Validation" (9 checks) overlaps with AF-095's real
 * `LORE_VALIDATION_CHECKS` (7 checks) — only 2-3 of AF-095's checks have
 * any real backing (`missionContinuity`, `civilisationHistory`,
 * `codexInconsistencies`); most of both lists remain genuinely
 * unimplemented. `loreValidationReport` below composes plain boolean
 * signals (the decoupled-composition discipline AF-137's
 * `tierWeightsFor` established) rather than re-declaring AF-095's data.
 *
 * "Canon Tools" (Timeline Validator/Canon Conflict Detector/etc.) are
 * kept as pure reference data — this module's own `KnowledgeStateTracker.
 * hasDiverged`/`expansionRespectsTimeline` collectively ARE the real
 * "Canon Conflict Detector"/"Timeline Validator," so no separate,
 * redundant interactive tool is built.
 */
export const CANON_PYRAMID_LEVELS = ["Core Timeline", "Campaign Events", "Historical Records", "Museum Interpretation", "Academic Debate", "Legends & Folklore"] as const;
export type CanonPyramidLevel = (typeof CANON_PYRAMID_LEVELS)[number];

/** Mirrors AF-147's real `canonTierRank` indexOf pattern — never
 * imports AF-147's `CanonTier` type, since this governs a different
 * axis (in-fiction narrative-layer authority, not real-world source
 * authority). Index 0 is the highest authority. */
export function canonPyramidRank(level: CanonPyramidLevel): number {
  return CANON_PYRAMID_LEVELS.indexOf(level);
}

export interface CanonEventRecord {
  id: string;
  date: number;
  participants: readonly string[];
  planetId: string | null;
  galaxyRegion: string | null;
  commanderIds: readonly string[];
  witnesses: readonly string[];
  evidence: readonly string[];
  museumReferences: readonly string[];
  chronicleReferences: readonly string[];
  relationshipImpact: string | null;
  futureCallbacks: readonly string[];
}

export const LORE_VALIDATION_CHECK_KINDS = ["Timeline conflicts", "Character consistency", "Planet history", "Commander relationships", "Scientific plausibility", "Historical references", "Museum integration", "Chronicle compatibility", "Expansion dependencies"] as const;
export type LoreValidationCheckKind = (typeof LORE_VALIDATION_CHECK_KINDS)[number];

export interface LoreValidationSignals {
  timelineConflictFree: boolean;
  characterConsistent: boolean;
  planetHistoryRespected: boolean;
  commanderRelationshipsRespected: boolean;
  scientificallyPlausible: boolean;
  historicalReferencesValid: boolean;
  museumIntegrated: boolean;
  chronicleCompatible: boolean;
  expansionDependenciesResolved: boolean;
}

export interface LoreValidationReport {
  checks: Readonly<Record<LoreValidationCheckKind, boolean>>;
  passed: boolean;
}

/** "Every future story automatically checks..." — a decoupled composer
 * over plain boolean signals, never importing AF-070/090/095/097/142
 * directly. */
export function loreValidationReport(signals: LoreValidationSignals): LoreValidationReport {
  const checks: Record<LoreValidationCheckKind, boolean> = {
    "Timeline conflicts": signals.timelineConflictFree,
    "Character consistency": signals.characterConsistent,
    "Planet history": signals.planetHistoryRespected,
    "Commander relationships": signals.commanderRelationshipsRespected,
    "Scientific plausibility": signals.scientificallyPlausible,
    "Historical references": signals.historicalReferencesValid,
    "Museum integration": signals.museumIntegrated,
    "Chronicle compatibility": signals.chronicleCompatible,
    "Expansion dependencies": signals.expansionDependenciesResolved,
  };
  return { checks, passed: Object.values(checks).every(Boolean) };
}

export const PLANET_CONTINUITY_FIELDS = ["Discovery", "Settlement", "Wars", "Ecological changes", "Governments", "Scientific advances", "Population growth", "Architecture", "Major disasters", "Historic landmarks"] as const;
export type PlanetContinuityField = (typeof PLANET_CONTINUITY_FIELDS)[number];

export interface ArtifactAuthenticityRecord {
  artifactId: string;
  provenance: string;
  ownershipChain: readonly string[];
  restorationHistory: readonly string[];
  scientificAnalysis: string;
  museumLocation: string | null;
  authenticityConfidence: number;
  publicInterpretation: string;
}

export interface ExpansionTimelineProposal {
  erasesHistory: boolean;
  invalidatesAchievements: boolean;
  removesCommanderGrowth: boolean;
  breaksRelationships: boolean;
  undoesProgress: boolean;
}

/** "No future expansion may... expansion always builds forward." A
 * real semantic non-invalidation gate — confirmed genuinely new;
 * AF-070/142's registries only guard against id COLLISIONS, never
 * check whether new content is consistent with prior history. */
export function expansionRespectsTimeline(proposal: ExpansionTimelineProposal): boolean {
  return !proposal.erasesHistory && !proposal.invalidatesAchievements && !proposal.removesCommanderGrowth && !proposal.breaksRelationships && !proposal.undoesProgress;
}

export const FUTURE_DISCOVERY_KINDS = ["Unknown expeditions", "Lost colonies", "Forgotten inventions", "Ancient friendships", "Unfinished megaprojects"] as const;

export const CANON_TOOLS = ["Timeline Validator", "Relationship Validator", "Lore Graph", "Chronology Explorer", "Canon Conflict Detector", "Dialogue Consistency Checker", "Historical Dependency Viewer"] as const;

export const CANON_ACCESSIBILITY_SURFACES = ["Timeline search", "Relationship browser", "Lore summaries", "Chronological mode", "Narration ready"] as const;
