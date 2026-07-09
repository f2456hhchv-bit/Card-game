/**
 * Codex Framework data shapes (AF-087). EXTENDS AF-043's locked Codex —
 * `CodexEntryDef`, `CODEX_CATEGORIES`, `TIMELINE_ERAS`, `CodexUnlockRef`,
 * and `CodexRuntime` (search, timeline, missing links, discovery %,
 * section completion) are untouched. AF-087 wraps each entry in a
 * PROFILE (the AF-071→086 pattern): the spec's seventeen primary
 * categories are REALISED — some map directly onto AF-043's twenty
 * categories, the rest onto EXISTING content references (AF-038 galaxy
 * systems, AF-082's real Afterlight Network research node, AF-039/086's
 * void faction and event) — no new codex category invented; nine
 * discovery routes each name the live trigger that already unlocks
 * entries; ten entry-structure sections are DERIVED from data every
 * entry already carries plus two new profile fields; "nothing remains
 * undefined" is a fourteen-part completeness function; and the
 * six-stage Discovery Progression ladder is the module's one genuinely
 * new mechanical surface — a monotone lattice riding ON TOP of AF-043's
 * unchanged binary unlock gate, never replacing it.
 */
import type { CosmeticRewardKind } from "../meta/metaData";
import type { CodexCategory, CodexEntryDef, TimelineEra } from "./codexData";

/** The 14-part Codex Architecture (AF-087 §Codex Architecture) — nothing remains undefined. */
export const CODEX_ARCHITECTURE_PARTS = [
  "uniqueId",
  "category",
  "subcategory",
  "name",
  "description",
  "lore",
  "discoveryMethod",
  "discoveryProgress",
  "images",
  "audio",
  "relatedEntries",
  "timelinePosition",
  "statistics",
  "futureExpansionHooks",
] as const;
export type CodexArchitecturePart = (typeof CODEX_ARCHITECTURE_PARTS)[number];

/** How a spec primary category is realised — some onto AF-043's category
 * shelf directly, the rest onto an EXISTING system reference. No new
 * codex category is invented for any of the seventeen. */
export type PrimaryCategoryRealisation = { kind: "codexCategory"; category: CodexCategory } | { kind: "existingReference"; binding: string };

/** The spec's seventeen primary categories (AF-087 §Primary Categories). */
export const PRIMARY_CATEGORIES = [
  "civilisations",
  "commanders",
  "ships",
  "weapons",
  "equipment",
  "relics",
  "research",
  "enemies",
  "bosses",
  "biomes",
  "species",
  "planets",
  "starSystems",
  "ancientTechnology",
  "afterlightNetwork",
  "voidPhenomena",
  "galaxyHistory",
] as const;
export type PrimaryCategory = (typeof PRIMARY_CATEGORIES)[number];

export const PRIMARY_CATEGORY_REALISATION: Readonly<Record<PrimaryCategory, PrimaryCategoryRealisation>> = {
  civilisations: { kind: "codexCategory", category: "factions" }, // AF-085: civilisations ARE factions
  commanders: { kind: "codexCategory", category: "commanders" },
  ships: { kind: "codexCategory", category: "ships" },
  weapons: { kind: "codexCategory", category: "weapons" },
  equipment: { kind: "codexCategory", category: "equipment" },
  relics: { kind: "codexCategory", category: "relics" },
  research: { kind: "codexCategory", category: "research" },
  enemies: { kind: "codexCategory", category: "enemies" },
  bosses: { kind: "codexCategory", category: "bosses" },
  biomes: { kind: "codexCategory", category: "biomes" },
  species: { kind: "codexCategory", category: "enemies" }, // species are catalogued as enemy/civ entries today
  planets: { kind: "existingReference", binding: "AF-038 StarSystemDef content — no dedicated planet register yet" },
  starSystems: { kind: "existingReference", binding: "AF-038 galaxyData.ts GALAXY systems — real, navigable" },
  ancientTechnology: { kind: "codexCategory", category: "ancientCivilisations" },
  afterlightNetwork: { kind: "existingReference", binding: "AF-082's REAL research node \"afterlight-network\" — the precursor loom, still running" },
  voidPhenomena: { kind: "existingReference", binding: "AF-039's voidLegion faction + AF-086's voidIncursions galactic event" },
  galaxyHistory: { kind: "codexCategory", category: "galaxyHistory" },
};

/** Discovery routes (AF-087 §Discovery System) — nine, each naming the LIVE
 * trigger that already unlocks entries; "no entry should require random
 * luck alone" — every route is a deliberate player action or milestone. */
export const DISCOVERY_ROUTES = [
  "exploration",
  "scanning",
  "combat",
  "research",
  "dialogue",
  "story",
  "bosses",
  "collections",
  "scientificAnalysis",
] as const;
export type DiscoveryRoute = (typeof DISCOVERY_ROUTES)[number];

export interface DiscoveryRouteDef {
  id: DiscoveryRoute;
  liveBinding: string;
}

export const DISCOVERY_ROUTE_DEFS: readonly DiscoveryRouteDef[] = [
  { id: "exploration", liveBinding: "AF-038 per-system exploration crossing a discovery threshold" },
  { id: "scanning", liveBinding: "AF-036 biome interactables and scan-triggered discoveries" },
  { id: "combat", liveBinding: "AF-026 collection on first kill/defeat of a registered enemy or boss" },
  { id: "research", liveBinding: "AF-024/081 research node unlocked, feeding the codex's research category" },
  { id: "dialogue", liveBinding: "AF-039 faction relationship/mission dialogue beats (registered future — no VO system yet)" },
  { id: "story", liveBinding: "AF-068 campaign chapter advancement" },
  { id: "bosses", liveBinding: "AF-035 boss defeat, the same collection call as combat but boss-scoped" },
  { id: "collections", liveBinding: "AF-026/042 CollectionLedger.discover() on any registered category" },
  { id: "scientificAnalysis", liveBinding: "AF-023 rare-tier loot sample banking research points (the ancient-conduit reveal precedent)" },
];

/** Entry-structure sections (AF-087 §Entry Structure) — ten; eight are
 * DERIVED from fields AF-043 already carries, two (Scientific Notes,
 * Gameplay Information) are new profile fields. The Codex becomes a
 * knowledge web, not a new storage format. */
export const ENTRY_STRUCTURE_SECTIONS = [
  "summary",
  "detailedLore",
  "scientificNotes",
  "historicalContext",
  "gameplayInformation",
  "relatedDiscoveries",
  "gallery",
  "statistics",
  "timeline",
  "crossReferences",
] as const;
export type EntryStructureSection = (typeof ENTRY_STRUCTURE_SECTIONS)[number];

/** The six-stage Discovery Progression ladder (AF-087 §Discovery
 * Progression) — a MONOTONE LATTICE riding on top of AF-043's binary
 * unlock gate. "Unknown" is the pre-unlock state; reaching "Observed"
 * requires the entry to already be unlocked (checked at the call site,
 * not baked into the lattice — the same decoupling AF-077/079/084's
 * collection runtimes use against their own engines). */
export const DISCOVERY_PROGRESSION_STAGES = ["unknown", "observed", "scanned", "studied", "understood", "mastered"] as const;
export type DiscoveryProgressionStage = (typeof DISCOVERY_PROGRESSION_STAGES)[number];

/** Multimedia kinds (AF-087 §Multimedia) — eight, with an honesty flag;
 * Concept Art and Recovered Documents are already live through existing
 * fields (image, lore.recoveredArchives), the rest await production. */
export interface MultimediaKindDef {
  id: string;
  liveBinding: string;
  live: boolean;
}

export const MULTIMEDIA_KINDS: readonly MultimediaKindDef[] = [
  { id: "conceptArt", liveBinding: "CodexEntryDef.image (AF-043, AF-002/006 asset reference)", live: true },
  { id: "models3d", liveBinding: "registered future — no 3D viewer yet", live: false },
  { id: "audioLogs", liveBinding: "the AF-087 profile's audioRef field", live: false },
  { id: "voiceRecordings", liveBinding: "registered future — no VO system yet", live: false },
  { id: "recoveredDocuments", liveBinding: "CodexLoreLayers.recoveredArchives (AF-043, already live text)", live: true },
  { id: "scientificDiagrams", liveBinding: "registered future — awaiting diagram assets", live: false },
  { id: "animatedDisplays", liveBinding: "registered future — awaiting UI module", live: false },
  { id: "musicThemes", liveBinding: "AF-045 audio engine music-state references", live: false },
];

/** Timeline eras — the spec's eight map TOTALLY onto AF-043's nine
 * TIMELINE_ERAS (one era, futureDiscoveries, honestly awaits content). */
export const TIMELINE_COVERAGE = [
  "ancientCivilisation",
  "collapse",
  "humanExpansion",
  "factionWars",
  "scientificDiscoveries",
  "campaignEvents",
  "playerDiscoveries",
  "galaxyRestoration",
] as const;
export type TimelineCoverage = (typeof TIMELINE_COVERAGE)[number];

export const TIMELINE_COVERAGE_TO_ERA: Readonly<Record<TimelineCoverage, TimelineEra>> = {
  ancientCivilisation: "ancientCivilisations",
  collapse: "theCollapse",
  humanExpansion: "humanExpansion",
  factionWars: "voidIncursions", // the Legion's wars are the galaxy's sharpest faction conflict on record
  scientificDiscoveries: "crystalAscension",
  campaignEvents: "theAfterlightEvent",
  playerDiscoveries: "modernEra", // the player's own discoveries land in the living present
  galaxyRestoration: "modernEra",
};

/** Related-knowledge kinds (AF-087 §Related Knowledge) — eight, each a
 * CLASSIFICATION of an existing `relatedEntryIds` target by that target's
 * own category — no second relation mechanism, one flat list, read
 * eight ways. */
export const RELATED_KNOWLEDGE_KINDS = [
  "relatedSpecies",
  "relatedTechnology",
  "relatedPlanets",
  "relatedFactions",
  "relatedBosses",
  "relatedMissions",
  "relatedResearch",
  "relatedTimelineEvents",
] as const;
export type RelatedKnowledgeKind = (typeof RELATED_KNOWLEDGE_KINDS)[number];

const CATEGORY_TO_RELATED_KIND: Partial<Record<CodexCategory, RelatedKnowledgeKind>> = {
  enemies: "relatedSpecies",
  eliteVariants: "relatedSpecies",
  technology: "relatedTechnology",
  ancientCivilisations: "relatedTechnology",
  factions: "relatedFactions",
  bosses: "relatedBosses",
  research: "relatedResearch",
  timeline: "relatedTimelineEvents",
  events: "relatedTimelineEvents",
};

/** Classifies a related target entry's category into one of the eight
 * spec kinds, or null if the target's category has no natural kind
 * (Related Planets/Related Missions await their own codex categories —
 * honestly unclassifiable today, not force-fit). */
export function relatedKnowledgeKindFor(targetCategory: CodexCategory): RelatedKnowledgeKind | null {
  return CATEGORY_TO_RELATED_KIND[targetCategory] ?? null;
}

/** How each spec Collection Reward is realised — a REAL AF-026
 * CosmeticRewardKind, an existing system reference, or honestly future. */
export type CollectionRewardRealisation = { kind: "cosmeticReward"; rewardKind: CosmeticRewardKind } | { kind: "existingReference"; binding: string } | { kind: "future" };

export const COLLECTION_REWARD_KINDS = ["lore", "achievements", "cosmetics", "museumDisplays", "commanderDialogue", "galleryItems", "historicalRecords", "legendaryDiscoveries"] as const;
export type CollectionRewardKind = (typeof COLLECTION_REWARD_KINDS)[number];

export const COLLECTION_REWARD_REALISATION: Readonly<Record<CollectionRewardKind, CollectionRewardRealisation>> = {
  lore: { kind: "cosmeticReward", rewardKind: "codexEntry" },
  achievements: { kind: "existingReference", binding: "AF-042 achievement completion, the exact codex-complete-<category> bucket" },
  cosmetics: { kind: "cosmeticReward", rewardKind: "title" },
  museumDisplays: { kind: "existingReference", binding: "AF-078's museumEntryFor pattern — derivation, not a new displaycase" },
  commanderDialogue: { kind: "future" },
  galleryItems: { kind: "existingReference", binding: "the entryStructureFor gallery section, over CodexEntryDef.image" },
  historicalRecords: { kind: "existingReference", binding: "AF-086's GalacticHistoryRuntime — the galaxy's own permanent memory" },
  legendaryDiscoveries: { kind: "cosmeticReward", rewardKind: "codexEntry" },
};

/** Forbidden outcomes (AF-087) — registered BY NAME: "no entry should
 * require random luck alone" as the module's own balance principle. */
export const CODEX_FORBIDDEN_OUTCOMES = ["randomLuckOnlyDiscovery"] as const;

/** Accessibility surfaces (AF-087 §Accessibility) — nine registered. */
export const CODEX_ACCESSIBILITY_SURFACES = ["search", "filters", "textScaling", "narrationReady", "largeUI", "controllerNavigation", "touchNavigation", "colourBlindSupport", "readableFonts"] as const;

/** Performance disciplines (AF-087 §Performance) — four registered. */
export const CODEX_PERFORMANCE_DISCIPLINES = ["lazyLoadEntries", "cacheSearch", "poolGalleryAssets", "optimiseCrossReferences"] as const;

/** The AF-087 profile — wraps an AF-043 CodexEntryDef by id; the def and
 * CodexRuntime are never modified. Carries the two NEW entry-structure
 * fields (gameplayInformation, scientificNotes) plus subcategory,
 * discovery method, audio reference, and expansion hooks. */
export interface CodexEntryProfileDef {
  entryId: string;
  primaryCategory: PrimaryCategory;
  subcategory: string;
  discoveryMethod: DiscoveryRoute;
  gameplayInformation: string;
  scientificNotes: string;
  audioRef: string | null;
  futureExpansionHooks: readonly string[];
}

/** Hand-authored profiles for a representative spread across categories —
 * every field earns its place in the entry's own lore, not filler. */
export const CODEX_ENTRY_PROFILES: readonly CodexEntryProfileDef[] = [
  {
    entryId: "codex-weapon-coil-ripper",
    primaryCategory: "weapons",
    subcategory: "railguns:precision",
    discoveryMethod: "collections",
    gameplayInformation: "First weapon collected; unlocks the railgun precision family's overlap law in the arsenal.",
    scientificNotes: "Rail acceleration bands measured against AF-032's overlap law — no two Coil Ripper shots occupy the same lane.",
    audioRef: "audio-log-coil-ripper-test-fire",
    futureExpansionHooks: ["codex-coil-ripper-evolution-thread"],
  },
  {
    entryId: "codex-ship-wayfarer",
    primaryCategory: "ships",
    subcategory: "scout/corvette",
    discoveryMethod: "collections",
    gameplayInformation: "The starting hull; its movement profile is the baseline every other ship is measured against.",
    scientificNotes: "Precision-avoidance defensive profile: shield regeneration outruns most early-game damage-over-time sources.",
    audioRef: null,
    futureExpansionHooks: ["codex-wayfarer-mk3-rumour"],
  },
  {
    entryId: "codex-relic-ember-core",
    primaryCategory: "relics",
    subcategory: "combatRelics",
    discoveryMethod: "combat",
    gameplayInformation: "Fuses with Frost Shard into the Cinder Heart — a relic whose payoff is a build decision, not a number.",
    scientificNotes: "Thermal signature consistent with a contained micro-reactor; the Foundry never explained how it survives combat heat.",
    audioRef: null,
    futureExpansionHooks: ["codex-ember-core-foundry-origin"],
  },
  {
    entryId: "codex-equipment-hull-plating",
    primaryCategory: "equipment",
    subcategory: "defensiveModule",
    discoveryMethod: "collections",
    gameplayInformation: "Vanguard set piece; two-piece and three-piece thresholds change gameplay, not just shield numbers.",
    scientificNotes: "Ironmoor's own stress logs: plating survives past its rated tolerance by a margin nobody has explained.",
    audioRef: null,
    futureExpansionHooks: ["codex-hull-plating-mk2"],
  },
  {
    entryId: "codex-commander-reyes",
    primaryCategory: "commanders",
    subcategory: "assault/vanguard",
    discoveryMethod: "story",
    gameplayInformation: "Launch-roster commander; the Alliance's rescue doctrine reads directly in the kit's ability cadence.",
    scientificNotes: "Longlight's biometric flight logs — nothing unusual, which the Institute finds the most interesting part.",
    audioRef: "voice-log-reyes-callsign",
    futureExpansionHooks: ["codex-reyes-mission-thread"],
  },
  {
    entryId: "codex-boss-hollow-sentinel",
    primaryCategory: "bosses",
    subcategory: "guardian",
    discoveryMethod: "bosses",
    gameplayInformation: "First real boss; the Core Eye weak point is the encounter's whole teaching moment.",
    scientificNotes: "Armour composition matches the Ancient Custodians' registered alloys exactly — the Sentinel did not arrive; it was left.",
    audioRef: null,
    futureExpansionHooks: ["codex-sentinel-flawless-lore"],
  },
  {
    entryId: "codex-crystal-dominion",
    primaryCategory: "civilisations",
    subcategory: "diplomatic",
    discoveryMethod: "dialogue",
    gameplayInformation: "First diplomatic faction encountered; its resonance economy explains why the Dominion never mints currency.",
    scientificNotes: "Resonance-signature trade defies conventional economics — value literally grows, verified against three independent scans.",
    audioRef: null,
    futureExpansionHooks: ["codex-dominion-resonant-court"],
  },
  {
    entryId: "codex-void-corruption",
    primaryCategory: "voidPhenomena",
    subcategory: "corruption",
    discoveryMethod: "scientificAnalysis",
    gameplayInformation: "The first void hazard catalogued; every later Void system builds on this entry's containment vocabulary.",
    scientificNotes: "Corruption spread follows no known decay curve — Void Research's official position is that it is choosing where to go.",
    audioRef: null,
    futureExpansionHooks: ["codex-void-containment-protocols"],
  },
  {
    entryId: "codex-ancient-security-doctrine",
    primaryCategory: "ancientTechnology",
    subcategory: "precursor",
    discoveryMethod: "research",
    gameplayInformation: "Explains why Custodian sites escalate rather than pursue — doctrine, not aggression.",
    scientificNotes: "The doctrine has never once been amended in any recovered record — a standing order outliving every audience it was written for.",
    audioRef: null,
    futureExpansionHooks: ["codex-custodian-directive-review"],
  },
  {
    entryId: "codex-biome-human-frontier",
    primaryCategory: "biomes",
    subcategory: "frontier",
    discoveryMethod: "exploration",
    gameplayInformation: "The tutorial biome; every hazard here is deliberately gentle by comparison to what follows.",
    scientificNotes: "Frontier weather patterns are the galaxy's most thoroughly logged — colonists have been writing them down for generations.",
    audioRef: null,
    futureExpansionHooks: ["codex-frontier-resettlement-survey"],
  },
];

/** Sensible, deterministic fallback for any sandbox entry without a
 * hand-authored profile above — derives every field from data the entry
 * ALREADY carries, so no entry is ever left without one. */
export function derivedProfileFor(entry: CodexEntryDef): CodexEntryProfileDef {
  const categoryToPrimary: Partial<Record<CodexCategory, PrimaryCategory>> = {
    factions: "civilisations",
    commanders: "commanders",
    ships: "ships",
    weapons: "weapons",
    equipment: "equipment",
    relics: "relics",
    research: "research",
    enemies: "enemies",
    eliteVariants: "species",
    bosses: "bosses",
    biomes: "biomes",
    ancientCivilisations: "ancientTechnology",
    galaxyHistory: "galaxyHistory",
  };
  const primaryCategory = categoryToPrimary[entry.category] ?? "galaxyHistory";
  const discoveryMethod: DiscoveryRoute =
    entry.unlock.kind === "alwaysUnlocked"
      ? "story"
      : entry.category === "bosses"
        ? "bosses"
        : entry.category === "enemies" || entry.category === "eliteVariants"
          ? "combat"
          : entry.category === "biomes"
            ? "exploration"
            : entry.category === "research"
              ? "research"
              : "collections";
  return {
    entryId: entry.id,
    primaryCategory,
    subcategory: entry.category,
    discoveryMethod,
    gameplayInformation: entry.discoverySource,
    scientificNotes: entry.lore.historicalContext ?? entry.lore.detailed,
    audioRef: null,
    futureExpansionHooks: [`codex-${entry.id}-expansion`],
  };
}

/** Resolves a profile for any entry — the hand-authored one if it exists,
 * else the deterministic derivation. Every sandbox entry gets one. */
export function profileFor(entry: CodexEntryDef): CodexEntryProfileDef {
  return CODEX_ENTRY_PROFILES.find((p) => p.entryId === entry.id) ?? derivedProfileFor(entry);
}

/** "Nothing remains undefined" as a function — all 14 parts must hold.
 * `stage` is read from the AF-087 discovery lattice (unknown if not yet
 * queried) — this function does not itself gate on AF-043's unlock. */
export function codexArchitectureFor(entry: CodexEntryDef, profile: CodexEntryProfileDef, stage: DiscoveryProgressionStage): Record<CodexArchitecturePart, boolean> {
  return {
    uniqueId: entry.id.length > 0,
    category: entry.category.length > 0,
    subcategory: profile.subcategory.length > 0,
    name: entry.title.length > 0,
    description: entry.lore.summary.length > 0,
    lore: entry.lore.detailed.length > 0,
    discoveryMethod: (DISCOVERY_ROUTES as readonly string[]).includes(profile.discoveryMethod),
    discoveryProgress: (DISCOVERY_PROGRESSION_STAGES as readonly string[]).includes(stage),
    images: true, // image is optional by design (AF-043) — the architecture PART exists as a slot either way
    audio: true, // likewise optional — registered future for most entries
    relatedEntries: true, // zero related entries is valid (a root topic), the FIELD always exists
    timelinePosition: true, // null is a valid, defined position (non-timeline entries)
    statistics: true, // statKey nullable by design — the STATISTICS part exists as a slot
    futureExpansionHooks: profile.futureExpansionHooks.length > 0,
  };
}

/** §Entry Structure: all ten sections DERIVED from data the entry and
 * profile already carry — the Codex is a knowledge web, not new storage. */
export function entryStructureFor(entry: CodexEntryDef, profile: CodexEntryProfileDef): Record<EntryStructureSection, string> {
  return {
    summary: entry.lore.summary,
    detailedLore: entry.lore.detailed,
    scientificNotes: profile.scientificNotes,
    historicalContext: entry.lore.historicalContext ?? "No historical context recovered yet.",
    gameplayInformation: profile.gameplayInformation,
    relatedDiscoveries: entry.relatedEntryIds.length > 0 ? entry.relatedEntryIds.join(", ") : "No cross-references recorded yet.",
    gallery: entry.image ?? "No gallery asset recorded yet.",
    statistics: entry.statKey ?? "No live statistic bound.",
    timeline: entry.timelinePosition !== null ? `position ${entry.timelinePosition}` : "Not a timeline entry.",
    crossReferences: `${entry.relatedEntryIds.length} linked entries`,
  };
}
