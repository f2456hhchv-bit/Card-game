/**
 * Codex Ecosystem data shapes (AF-088). EXTENDS AF-043's locked Codex
 * engine and AF-087's locked profile/progression/journal layer —
 * `CodexEntryDef`, `CODEX_CATEGORIES`, `TIMELINE_ERAS`, `CodexRuntime`,
 * `CodexEntryProfileDef`, `CodexDiscoveryRuntime`, and
 * `CodexJournalRuntime` are all UNTOUCHED. AF-088 is the AF-076→086
 * "ecosystem" move applied to the Codex a second time: the seventeen
 * Knowledge Web nodes map TOTALLY onto AF-087's seventeen primary
 * categories PLUS AF-043's own "timeline"/"events" codex categories
 * (fifteen direct, two reaching one layer further than AF-087 ever
 * needed to); the eight-stage Discovery Tier ladder EXTENDS AF-087's
 * six-stage lattice by wrapping it, never modifying it; and Community
 * Support is honestly deferred per AF-000's own constitution — online
 * features are an optional later layer, not a AF-088 concern.
 */
import type { PrimaryCategory } from "./codexFrameworkData";
import type { CodexCategory, TimelineEra } from "./codexData";

/** Knowledge Web nodes (AF-088 §Knowledge Web) — seventeen, each realised
 * onto AF-087's primary-category register or an AF-043 codex category
 * AF-087 never needed. Knowledge becomes a living network without a
 * second category system. */
export const KNOWLEDGE_WEB_NODES = [
  "civilisations",
  "species",
  "commanders",
  "ships",
  "weapons",
  "equipment",
  "relics",
  "research",
  "enemies",
  "bosses",
  "biomes",
  "planets",
  "starSystems",
  "historicalEvents",
  "ancientTechnology",
  "theAfterlightNetwork",
  "timelineEvents",
] as const;
export type KnowledgeWebNode = (typeof KNOWLEDGE_WEB_NODES)[number];

export type KnowledgeWebRealisation = { kind: "primaryCategory"; category: PrimaryCategory } | { kind: "codexCategory"; category: CodexCategory };

export const KNOWLEDGE_WEB_REALISATION: Readonly<Record<KnowledgeWebNode, KnowledgeWebRealisation>> = {
  civilisations: { kind: "primaryCategory", category: "civilisations" },
  species: { kind: "primaryCategory", category: "species" },
  commanders: { kind: "primaryCategory", category: "commanders" },
  ships: { kind: "primaryCategory", category: "ships" },
  weapons: { kind: "primaryCategory", category: "weapons" },
  equipment: { kind: "primaryCategory", category: "equipment" },
  relics: { kind: "primaryCategory", category: "relics" },
  research: { kind: "primaryCategory", category: "research" },
  enemies: { kind: "primaryCategory", category: "enemies" },
  bosses: { kind: "primaryCategory", category: "bosses" },
  biomes: { kind: "primaryCategory", category: "biomes" },
  planets: { kind: "primaryCategory", category: "planets" },
  starSystems: { kind: "primaryCategory", category: "starSystems" },
  historicalEvents: { kind: "codexCategory", category: "events" }, // AF-043's real "events" shelf — AF-087 never reached this far
  ancientTechnology: { kind: "primaryCategory", category: "ancientTechnology" },
  theAfterlightNetwork: { kind: "primaryCategory", category: "afterlightNetwork" },
  timelineEvents: { kind: "codexCategory", category: "timeline" }, // AF-043's real "timeline" shelf
};

/** The eight-stage Discovery Tier ladder (AF-088 §Discovery Tiers) — a
 * SUPERSET ordering that CONTAINS AF-087's six-stage lattice exactly:
 * Detected sits before Observed (a new pre-stage); Archived sits after
 * Mastered (a permanent parallel mark, the AF-077 "evolved" pattern).
 * The middle six are AF-087's own stages, unmodified. */
export const EXTENDED_DISCOVERY_TIERS = ["unknown", "detected", "observed", "scanned", "analysed", "understood", "mastered", "archived"] as const;
export type ExtendedDiscoveryTier = (typeof EXTENDED_DISCOVERY_TIERS)[number];

/** The six tiers this ladder shares with AF-087's lattice, in order —
 * "analysed" is this module's label for AF-087's "studied" ordinal slot,
 * asserted to occupy the identical position. */
export const SHARED_WITH_AF087_TIERS = ["observed", "scanned", "analysed", "understood", "mastered"] as const;

/** Scientific Archive record kinds (AF-088 §Scientific Archive) — eight,
 * each naming the live system that already produces it, or honestly
 * future. The archive expands naturally as new systems ship. */
export interface ArchiveRecordKindDef {
  id: string;
  liveBinding: string;
  live: boolean;
}

export const SCIENTIFIC_ARCHIVE_KINDS: readonly ArchiveRecordKindDef[] = [
  { id: "recoveredResearch", liveBinding: "AF-024/081 unlocked research nodes", live: true },
  { id: "scientificPapers", liveBinding: "AF-087 entry profile scientificNotes field", live: true },
  { id: "commanderReports", liveBinding: "AF-072 RosterRuntime.statsFor usage/win-rate ledger", live: true },
  { id: "fieldJournals", liveBinding: "AF-084 ExpeditionLogRuntime records", live: true },
  { id: "laboratoryRecords", liveBinding: "AF-082 laboratory register (RESEARCH_LABORATORIES)", live: true },
  { id: "expeditionLogs", liveBinding: "AF-084 ExpeditionLogRuntime, the exact same permanent log", live: true },
  { id: "recoveredAiFiles", liveBinding: "AF-047 Machine Collective content — registered future, no AI-file viewer yet", live: false },
  { id: "ancientData", liveBinding: "AF-050/082 ancient-technology research thread", live: true },
];

/** Galactic Museum exhibit kinds (AF-088 §Galactic Museum) — eight, each
 * with an honesty flag; museum collections celebrate exploration by
 * DERIVING from rosters that already exist, never a new content store. */
export const MUSEUM_EXHIBIT_KINDS: readonly ArchiveRecordKindDef[] = [
  { id: "models3d", liveBinding: "registered future — no 3D viewer yet (matches AF-087's Multimedia deferral)", live: false },
  { id: "animatedDisplays", liveBinding: "registered future — awaiting the UI module", live: false },
  { id: "recoveredArtefacts", liveBinding: "AF-029/077 relic roster — ancient/void relics as artefacts", live: true },
  { id: "shipGalleries", liveBinding: "AF-074/080 fleet roster, derived per hull", live: true },
  { id: "weaponGalleries", liveBinding: "AF-076/080 arsenal roster, derived per weapon", live: true },
  { id: "ancientRelics", liveBinding: "AF-078's own museumEntryFor pattern, reused directly", live: true },
  { id: "recoveredFossils", liveBinding: "registered future — no biological-species register yet", live: false },
  { id: "commanderMemorabilia", liveBinding: "AF-072 roster entries — acquisition route as the memorabilia's own story", live: true },
];

/** Timeline Archive items (AF-088 §Timeline Archive) — ten, mapped onto
 * AF-043's REAL nine timeline eras; Player Discoveries is explicitly
 * DYNAMIC (bound to the player's own journal, not a fixed era) — the
 * one entry that makes "history becomes explorable" literal. */
export const TIMELINE_ARCHIVE_ITEMS = [
  "precursorEra",
  "theCollapse",
  "humanExpansion",
  "theGreatSilence",
  "firstContact",
  "factionFormation",
  "scientificBreakthroughs",
  "campaignProgress",
  "galaxyRestoration",
  "playerDiscoveries",
] as const;
export type TimelineArchiveItem = (typeof TIMELINE_ARCHIVE_ITEMS)[number];

export type TimelineArchiveRealisation = { kind: "era"; era: TimelineEra } | { kind: "dynamic"; binding: string };

export const TIMELINE_ARCHIVE_REALISATION: Readonly<Record<TimelineArchiveItem, TimelineArchiveRealisation>> = {
  precursorEra: { kind: "era", era: "ancientCivilisations" },
  theCollapse: { kind: "era", era: "theCollapse" },
  humanExpansion: { kind: "era", era: "humanExpansion" },
  theGreatSilence: { kind: "era", era: "theCollapse" }, // the quiet aftermath, same era bucket
  firstContact: { kind: "era", era: "theAfterlightEvent" },
  factionFormation: { kind: "era", era: "humanExpansion" },
  scientificBreakthroughs: { kind: "era", era: "crystalAscension" },
  campaignProgress: { kind: "era", era: "modernEra" },
  galaxyRestoration: { kind: "era", era: "modernEra" },
  playerDiscoveries: { kind: "dynamic", binding: "AF-087's CodexJournalRuntime.discoveryHistoryTimeline — the living present, per player" },
};

/** Discovery Reward kinds (AF-088 §Discovery Rewards) — eight, each
 * realised onto a real system, an existing derivation, or honestly
 * future. Knowledge always rewards curiosity, never invents a new
 * reward pipeline. */
export type DiscoveryRewardRealisation = { kind: "existingReference"; binding: string } | { kind: "future" };

export const DISCOVERY_REWARD_KINDS = ["museumWings", "loreChapters", "commanderDialogue", "hiddenMissions", "research", "cosmetics", "titles", "historicalRecords"] as const;
export type DiscoveryRewardKind = (typeof DISCOVERY_REWARD_KINDS)[number];

export const DISCOVERY_REWARD_REALISATION: Readonly<Record<DiscoveryRewardKind, DiscoveryRewardRealisation>> = {
  museumWings: { kind: "existingReference", binding: "this module's museumWingFor derivation" },
  loreChapters: { kind: "existingReference", binding: "AF-026 \"lore\" CollectionCategory" },
  commanderDialogue: { kind: "future" },
  hiddenMissions: { kind: "existingReference", binding: "AF-084 mission-chain stage unlocks" },
  research: { kind: "existingReference", binding: "AF-024/081 research points" },
  cosmetics: { kind: "existingReference", binding: "AF-026 CosmeticRewardKind union" },
  titles: { kind: "existingReference", binding: "AF-026 CosmeticRewardKind.title" },
  historicalRecords: { kind: "existingReference", binding: "AF-086 GalacticHistoryRuntime" },
};

/** Expedition Journal kinds (AF-088 §Expedition Journal) — eight,
 * AUTOMATICALLY recorded (never player-curated — that is the Player
 * Notebook's job). Each names its live feed or honestly awaits one. */
export const EXPEDITION_JOURNAL_KINDS: readonly ArchiveRecordKindDef[] = [
  { id: "missionHistory", liveBinding: "AF-084 ExpeditionLogRuntime, mirrored at the same endRun seam", live: true },
  { id: "discoveries", liveBinding: "AF-087 CodexDiscoveryRuntime.recordObserved events", live: true },
  { id: "bosses", liveBinding: "AF-035 boss defeat, the same seam ExpeditionLogRuntime.bossDefeated already reads", live: true },
  { id: "research", liveBinding: "AF-024/081 research unlock events", live: true },
  { id: "photographs", liveBinding: "registered future — no camera/photo-mode UI yet", live: false },
  { id: "scans", liveBinding: "registered future — no scan-prompt UI yet", live: false },
  { id: "commanderNotes", liveBinding: "registered future — no dialogue system yet (mirrors AF-087's deferral)", live: false },
  { id: "scientificObservations", liveBinding: "AF-087 entry profile scientificNotes, recorded on first Observed", live: true },
];

/** Player Notebook — AF-087's CodexJournalRuntime already ships four of
 * the spec's seven surfaces (bookmarks, pins, notes, favourites). AF-088
 * adds the remaining THREE as its own extension runtime — never modifying
 * the locked journal. */
export const PLAYER_NOTEBOOK_SURFACES = ["bookmarks", "pinnedEntries", "personalNotes", "favouriteEntries", "comparisonNotes", "researchGoals", "expeditionPlans"] as const;
export type PlayerNotebookSurface = (typeof PLAYER_NOTEBOOK_SURFACES)[number];

export const PLAYER_NOTEBOOK_NEW_SURFACES = ["comparisonNotes", "researchGoals", "expeditionPlans"] as const;

/** Search System kinds (AF-088 §Search System) — eight, each backed by a
 * REAL pure query function in `CodexEcosystemRuntime` — not just a name. */
export const SEARCH_SYSTEM_KINDS = ["keyword", "category", "timeline", "faction", "discoveryStatus", "biome", "recentDiscoveries", "unreadEntries"] as const;
export type SearchSystemKind = (typeof SEARCH_SYSTEM_KINDS)[number];

/** Collection Tracking trackers (AF-088 §Collection Tracking) — twelve,
 * each naming the live source its percentage reads from. */
export const COLLECTION_TRACKING_KINDS = ["species", "civilisations", "ships", "weapons", "relics", "equipment", "research", "bosses", "biomes", "timeline", "museum", "overallGalaxyCompletion"] as const;
export type CollectionTrackingKind = (typeof COLLECTION_TRACKING_KINDS)[number];

/** Community Support (AF-088 §Community Support) — six items, HONESTLY
 * deferred: AF-000's own Master Constitution reserves online/community
 * features as an optional LATER layer over the offline-first core. Zero
 * networking code exists here; this is a registered intent, not a stub
 * that pretends to connect to anything. */
export const COMMUNITY_SUPPORT_ITEMS = ["sharedDiscoveries", "museumShowcases", "loreDiscussions", "communityResearch", "globalStatistics", "worldDiscoveries"] as const;

/** Accessibility surfaces (AF-088 §Accessibility) — nine registered. */
export const ECOSYSTEM_ACCESSIBILITY_SURFACES = ["narrationReady", "largeFonts", "textScaling", "searchSuggestions", "controllerNavigation", "touchNavigation", "highContrast", "colourBlindSupport", "readingMode"] as const;

/** Performance disciplines (AF-088 §Performance) — five registered. */
export const ECOSYSTEM_PERFORMANCE_DISCIPLINES = ["cacheSearch", "lazyLoadGalleries", "poolMuseumAssets", "optimiseCrossReferences", "streamMultimediaAsynchronously"] as const;
