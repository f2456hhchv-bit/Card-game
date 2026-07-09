/**
 * Content Production Framework (AF-097). Marks the project's own stated
 * shift from designing systems to producing content with them. A third
 * "meta" module: delegates its Automated Validation checks directly to
 * AF-092/094/095's real functions/registries (never re-declaring them),
 * and reports the real, cited current roster counts against the spec's
 * Content Scale targets rather than fabricating progress. Zero changes
 * to any locked module.
 */
import { ARCHITECTURE_PRINCIPLES } from "../technical/technicalArchitectureData";
import { BALANCE_VALIDATION_METRICS, BALANCE_VALIDATION_REALISATION, LORE_VALIDATION_CHECKS, LORE_VALIDATION_REALISATION, PERFORMANCE_VALIDATION_LIVE, QA_ACCESSIBILITY_LIVE } from "../qa/qualityAssuranceData";
import { colourSignaturesAreDistinct } from "../visual/visualDirectionData";

/** Master Content Pipeline — 13-stage LINEAR pipeline (AF-097 §Master
 * Content Pipeline), the same linear-ladder shape as AF-095's QA
 * pipeline: stages only advance, no ring, always terminates. */
export const CONTENT_PIPELINE_STAGES = [
  "concept",
  "lore",
  "gameplayRole",
  "visualIdentity",
  "audioIdentity",
  "mechanicalDesign",
  "technicalImplementation",
  "accessibilityReview",
  "performanceValidation",
  "loreValidation",
  "integrationTesting",
  "finalApproval",
  "productionLock",
] as const;
export type ContentPipelineStage = (typeof CONTENT_PIPELINE_STAGES)[number];

export function nextContentPipelineStage(stage: ContentPipelineStage): ContentPipelineStage | null {
  const index = CONTENT_PIPELINE_STAGES.indexOf(stage);
  return index >= 0 && index < CONTENT_PIPELINE_STAGES.length - 1 ? CONTENT_PIPELINE_STAGES[index + 1]! : null;
}

export type ContentKindRealisation = { kind: "existing"; ref: string; note?: string } | { kind: "future"; note?: string };

/** Supported Content — 22 kinds (AF-097 §Supported Content). 17 already
 * have a real *Data.ts/*Runtime registry somewhere in the codebase; 5
 * are honest future gaps. */
export const SUPPORTED_CONTENT_KINDS = [
  "commanders",
  "ships",
  "weapons",
  "enemies",
  "bosses",
  "biomes",
  "planets",
  "starSystems",
  "equipment",
  "relics",
  "research",
  "missions",
  "dialogue",
  "civilisations",
  "factions",
  "species",
  "resources",
  "structures",
  "events",
  "achievements",
  "codexEntries",
  "museumEntries",
] as const;
export type SupportedContentKind = (typeof SUPPORTED_CONTENT_KINDS)[number];

export const SUPPORTED_CONTENT_REALISATION: Readonly<Record<SupportedContentKind, ContentKindRealisation>> = {
  commanders: { kind: "existing", ref: "commanderData/commanderFrameworkData/rosterData → LAUNCH_ROSTER" },
  ships: { kind: "existing", ref: "shipData/shipFrameworkData/shipRosterData → LAUNCH_FLEET" },
  weapons: { kind: "existing", ref: "weaponData/weaponFrameworkData/weaponRosterData → LAUNCH_ARSENAL" },
  enemies: { kind: "existing", ref: "11 enemy-family *Data.ts files + enemyData.ts" },
  bosses: { kind: "existing", ref: "bossData.ts SANDBOX_BOSSES", note: "one authored boss today — thin but real" },
  biomes: { kind: "existing", ref: "biomeData.ts + 10 standalone *Biome.ts files, aggregated at the main.ts call site", note: "no dedicated biome-roster aggregator module exists yet" },
  planets: { kind: "future", note: "no PlanetDef anywhere; only Star Systems exist" },
  starSystems: { kind: "existing", ref: "galaxyData.ts StarSystemDef, SANDBOX_GALAXY.systems" },
  equipment: { kind: "existing", ref: "equipmentData/equipmentFrameworkData/equipmentRosterData" },
  relics: { kind: "existing", ref: "relicData/relicFrameworkData/relicRosterData" },
  research: { kind: "existing", ref: "researchData.ts SANDBOX_RESEARCH_TREE" },
  missions: { kind: "existing", ref: "missionData.ts SANDBOX_MISSIONS" },
  dialogue: { kind: "future", note: "no DialogueDef or voice-line registry exists anywhere" },
  civilisations: { kind: "existing", ref: "civilisationFrameworkData.ts SEEDED_SETTLEMENTS" },
  factions: { kind: "existing", ref: "factionData.ts SANDBOX_FACTION_ROSTER" },
  species: { kind: "future", note: "registered vocabulary tag only; no biological-species register (codexEcosystemData.ts's own comment)" },
  resources: { kind: "future", note: "AF-089 has category-level vocabulary; no item-level resource roster" },
  structures: { kind: "existing", ref: "civilisationFrameworkData.ts MEGASTRUCTURES (9 entries, inside the civilisation module)" },
  events: { kind: "existing", ref: "worldEventData.ts SANDBOX_WORLD_EVENTS", note: "currently a single authored object, not yet an array" },
  achievements: { kind: "existing", ref: "achievementData.ts SANDBOX_ACHIEVEMENTS" },
  codexEntries: { kind: "existing", ref: "codexData.ts SANDBOX_CODEX_ENTRIES" },
  museumEntries: { kind: "future", note: "derived at call time by relicRosterData's museumEntryFor(); no independent authored dataset" },
};

/** Content Template — 14 fields every asset must carry (AF-097 §Content
 * Template). A generic, reusable completeness checker — not 22 hand-
 * authored per-kind profiles, since the template SHAPE is the deliverable
 * here, the same way AF-091/093 proved their own profile shapes. */
export const CONTENT_TEMPLATE_FIELDS = [
  "uniqueId",
  "name",
  "classification",
  "purpose",
  "gameplayRole",
  "lore",
  "visualIdentity",
  "audioIdentity",
  "technicalRequirements",
  "accessibilityNotes",
  "performanceBudget",
  "futureExpansionHooks",
  "relationships",
  "statistics",
] as const;
export type ContentTemplateField = (typeof CONTENT_TEMPLATE_FIELDS)[number];

/** True only if every field is present and non-empty (strings must have
 * length > 0; arrays/objects must have at least one entry/key). */
export function contentTemplateCompletenessFor(candidate: Partial<Record<ContentTemplateField, unknown>>): Readonly<Record<ContentTemplateField, boolean>> {
  const result = {} as Record<ContentTemplateField, boolean>;
  for (const field of CONTENT_TEMPLATE_FIELDS) {
    const value = candidate[field];
    if (typeof value === "string") result[field] = value.length > 0;
    else if (Array.isArray(value)) result[field] = value.length > 0;
    else if (value !== null && typeof value === "object") result[field] = Object.keys(value).length > 0;
    else result[field] = false;
  }
  return result;
}

export function isContentTemplateComplete(candidate: Partial<Record<ContentTemplateField, unknown>>): boolean {
  return Object.values(contentTemplateCompletenessFor(candidate)).every(Boolean);
}

export type ContentDependencyRealisation = { kind: "existing"; ref: string } | { kind: "future" };

/** Content Dependencies — 11 compatibility targets (AF-097 §Content
 * Dependencies). Most are honestly future — no single validator checks a
 * new content item against all of these yet; 3 already have a real,
 * automatic structural check a new entry passes through. */
export const CONTENT_DEPENDENCY_TARGETS = ["afModules", "gameplaySystems", "lore", "timeline", "economy", "research", "buildDiversity", "factionIdentity", "campaign", "codex", "museum"] as const;
export const CONTENT_DEPENDENCY_REALISATION: Readonly<Record<(typeof CONTENT_DEPENDENCY_TARGETS)[number], ContentDependencyRealisation>> = {
  afModules: { kind: "existing", ref: "docs/modules/STATUS.md's registry — every module's own alignment review checks compatibility with AF-000 through the previous module" },
  gameplaySystems: { kind: "future" },
  lore: { kind: "future" },
  timeline: { kind: "future" },
  economy: { kind: "future" },
  research: { kind: "future" },
  buildDiversity: { kind: "future" },
  factionIdentity: { kind: "future" },
  campaign: { kind: "future" },
  codex: { kind: "existing", ref: "AF-087 codexArchitectureFor — a new entry's 14-part profile is proven complete automatically" },
  museum: { kind: "existing", ref: "AF-088 museumWingFor — derives automatically from whatever the collection roster currently contains" },
};

/** Implementation Order — 15-step recommended production sequence
 * (AF-097 §Implementation Order), LINEAR. */
export const RECOMMENDED_IMPLEMENTATION_ORDER = [
  "commanders",
  "ships",
  "weapons",
  "equipment",
  "relics",
  "enemies",
  "bosses",
  "biomes",
  "planets",
  "civilisations",
  "campaignMissions",
  "lore",
  "codex",
  "museum",
  "expansions",
] as const;
export type ImplementationOrderStep = (typeof RECOMMENDED_IMPLEMENTATION_ORDER)[number];

export function nextImplementationOrderStep(step: ImplementationOrderStep): ImplementationOrderStep | null {
  const index = RECOMMENDED_IMPLEMENTATION_ORDER.indexOf(step);
  return index >= 0 && index < RECOMMENDED_IMPLEMENTATION_ORDER.length - 1 ? RECOMMENDED_IMPLEMENTATION_ORDER[index + 1]! : null;
}

/** Content Scale — 8 targets (AF-097 §Content Scale) against the real,
 * cited current roster counts. Counts are literal, manually verified
 * snapshots (each cited against the real test that asserts it) rather
 * than a live cross-module import, to avoid coupling this framework to
 * every roster file it describes — the same choice AF-094's
 * saveVersionSummary made for SaveSlice versions. */
export const CONTENT_SCALE_TARGETS: Readonly<Record<string, number>> = {
  commanders: 100,
  ships: 300,
  weapons: 1000,
  equipmentModules: 5000,
  relics: 2000,
  bosses: 250,
  enemyTypes: 500,
  biomes: 100,
};

/** Verified against: tests/commanderRoster.test.ts (14), shipRoster.test.ts
 * (10), weaponRoster.test.ts (10), equipmentRoster.test.ts (10),
 * relicRoster.test.ts (9), bossData.ts SANDBOX_BOSSES (1), the 11
 * enemy-family *Data.ts files summed (61), biomeData.ts + 10 standalone
 * biome files (11). */
export const CONTENT_SCALE_CURRENT: Readonly<Record<string, number>> = {
  commanders: 14,
  ships: 10,
  weapons: 10,
  equipmentModules: 10,
  relics: 9,
  bosses: 1,
  enemyTypes: 61,
  biomes: 11,
};

export function contentScaleProgressFor(kind: keyof typeof CONTENT_SCALE_TARGETS): number {
  return CONTENT_SCALE_CURRENT[kind]! / CONTENT_SCALE_TARGETS[kind]!;
}

export function contentScaleSummary(): string {
  const parts = Object.keys(CONTENT_SCALE_TARGETS).map((kind) => `${kind} ${CONTENT_SCALE_CURRENT[kind]}/${CONTENT_SCALE_TARGETS[kind]}`);
  return parts.join(" · ");
}

/** Automated Validation — 8 checks (AF-097 §Automated Validation),
 * delegated directly to AF-092/094/095's real functions/registries
 * rather than re-declared — the same law AF-090 applied to AF-089. */
export const AUTOMATED_VALIDATION_CHECKS = ["loreConsistency", "factionConsistency", "visualConsistency", "gameplayUniqueness", "performance", "accessibility", "replayability", "technicalCompatibility"] as const;

function anyRealisationExisting<K extends string>(keys: readonly K[], realisation: Readonly<Record<K, { kind: string }>>): boolean {
  return keys.some((key) => realisation[key].kind === "existing");
}

export function automatedValidationLive(): Readonly<Record<(typeof AUTOMATED_VALIDATION_CHECKS)[number], boolean>> {
  return {
    loreConsistency: anyRealisationExisting(LORE_VALIDATION_CHECKS, LORE_VALIDATION_REALISATION),
    factionConsistency: LORE_VALIDATION_REALISATION.factionInconsistencies.kind === "existing",
    visualConsistency: colourSignaturesAreDistinct(),
    gameplayUniqueness: anyRealisationExisting(BALANCE_VALIDATION_METRICS, BALANCE_VALIDATION_REALISATION),
    performance: PERFORMANCE_VALIDATION_LIVE.frameTime,
    accessibility: Object.values(QA_ACCESSIBILITY_LIVE).some(Boolean),
    replayability: false, // no replayability metric exists anywhere in the codebase
    technicalCompatibility: Object.values(ARCHITECTURE_PRINCIPLES).every(Boolean),
  };
}

/** Quality Target — 7 traits (AF-097 §Quality Target), vocabulary only —
 * aspirational content-quality language, not a checkable system. */
export const QUALITY_TARGET_TRAITS = ["purposeful", "unique", "mechanicallyInteresting", "visuallyMemorable", "loreRich", "technicallyEfficient", "futureExpandable"] as const;

export function supportedContentCoverageSummary(): string {
  let existing = 0;
  for (const kind of SUPPORTED_CONTENT_KINDS) if (SUPPORTED_CONTENT_REALISATION[kind].kind === "existing") existing += 1;
  return `${existing}/${SUPPORTED_CONTENT_KINDS.length} supported content kinds have a real registry`;
}
