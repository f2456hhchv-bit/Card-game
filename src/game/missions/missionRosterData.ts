/**
 * Mission Roster (AF-084). The AF-076→082 roster move applied to
 * expeditions: AF-037's MissionDef/engine and AF-083's MissionProfileDef
 * are UNCHANGED — the ecosystem is data. Seventeen mission families map
 * TOTALLY onto AF-083's seventeen framework categories (a three-layer
 * binding per expedition); eight mission tiers where TIER CHANGES
 * COMPLEXITY AND REWARD QUALITY, NOT ENEMY STRENGTH (proven: a
 * lower-tier expedition outranks a higher-tier one in raw difficulty);
 * the ten-surface objective network rides AF-037's objective-type shelf;
 * the nine spec dynamic events map onto AF-037's ten (already bound to
 * the real environmental vocabulary); CHAIN MISSIONS land as ordered
 * lists of REAL expedition ids with a pure progression function; and the
 * Galaxy Operations Centre is DERIVATION over the permanent expedition
 * log.
 */
import type { MissionEventKind, ObjectiveType } from "./missionData";
import type { FrameworkMissionCategory } from "./missionFrameworkData";

/** Mission families (AF-084 §Mission Families) — seventeen, mapped totally
 * onto AF-083's framework categories. */
export const MISSION_FAMILIES = [
  "exploration",
  "combat",
  "rescue",
  "escort",
  "research",
  "survey",
  "sabotage",
  "defence",
  "recovery",
  "construction",
  "diplomacy",
  "civilianSupport",
  "ancientDiscovery",
  "prototypeRecovery",
  "legendaryExpedition",
  "worldEvent",
  "factionCampaign",
] as const;
export type MissionFamily = (typeof MISSION_FAMILIES)[number];

export const FAMILY_TO_FRAMEWORK_CATEGORY: Readonly<Record<MissionFamily, FrameworkMissionCategory>> = {
  exploration: "exploration",
  combat: "combat",
  rescue: "rescue",
  escort: "escort",
  research: "research",
  survey: "survey",
  sabotage: "sabotage",
  defence: "defense",
  recovery: "recovery",
  construction: "construction",
  diplomacy: "investigation", // diplomatic work is investigation today — talks are fact-finding
  civilianSupport: "rescue",
  ancientDiscovery: "ancient",
  prototypeRecovery: "prototype",
  legendaryExpedition: "legendary",
  worldEvent: "worldEvent",
  factionCampaign: "worldEvent", // faction campaigns surface through world-event expeditions today
};

/** Mission tiers (AF-084 §Mission Tiers) — eight registered; tier changes
 * complexity and reward quality, not simply enemy strength. */
export const MISSION_TIERS = ["common", "special", "elite", "legendary", "ancient", "prototype", "mythic", "galaxyEvent"] as const;
export type MissionTier = (typeof MISSION_TIERS)[number];

/** The objective network (AF-084 §Objective Network) — ten combination
 * surfaces, each riding AF-037's objective-type shelf. */
export const OBJECTIVE_NETWORK_SURFACES = [
  "combat",
  "exploration",
  "puzzleSolving",
  "scientificAnalysis",
  "construction",
  "resourceGathering",
  "survival",
  "extraction",
  "bossEncounters",
  "diplomaticDecisions",
] as const;
export type ObjectiveNetworkSurface = (typeof OBJECTIVE_NETWORK_SURFACES)[number];

export const NETWORK_SURFACE_TO_OBJECTIVE_TYPE: Readonly<Record<ObjectiveNetworkSurface, ObjectiveType>> = {
  combat: "destroy",
  exploration: "explore",
  puzzleSolving: "activate",
  scientificAnalysis: "scan",
  construction: "repair",
  resourceGathering: "collect",
  survival: "survive",
  extraction: "escape",
  bossEncounters: "destroy",
  diplomaticDecisions: "hybrid",
};

/** World reactivity surfaces (AF-084 §World Reactivity) — eight, each naming
 * the LIVE system mission outcomes already feed. The galaxy remembers. */
export interface ReactivitySurfaceDef {
  id: string;
  liveBinding: string;
}

export const WORLD_REACTIVITY_SURFACES: readonly ReactivitySurfaceDef[] = [
  { id: "factionReputation", liveBinding: "AF-039 reputation deltas on faction-mission outcomes" },
  { id: "tradeRoutes", liveBinding: "AF-041 market events and merchant availability" },
  { id: "civilianGrowth", liveBinding: "AF-038 per-system exploration and stability meta stats" },
  { id: "research", liveBinding: "AF-024 points banked from expedition samples" },
  { id: "galaxyStability", liveBinding: "AF-038 stability stat keyed per system" },
  { id: "resourceAvailability", liveBinding: "AF-023 loot economy fed by expedition rewards" },
  { id: "futureMissions", liveBinding: "AF-037 unlock flags + AF-039 queued faction missions" },
  { id: "storyProgression", liveBinding: "AF-068 campaign counters fed on victory" },
];

/** The spec's nine dynamic events (AF-084 §Dynamic Events) — mapped totally
 * onto AF-037's ten event kinds; events emerge naturally. */
export const DYNAMIC_EVENT_KINDS = [
  "pirateAmbushes",
  "voidIncursions",
  "solarStorms",
  "ancientReactivations",
  "civilianEmergencies",
  "prototypeDiscoveries",
  "fleetBattles",
  "environmentalCollapse",
  "scientificBreakthroughs",
] as const;
export type DynamicEventKind = (typeof DYNAMIC_EVENT_KINDS)[number];

export const DYNAMIC_EVENT_TO_MISSION_EVENT: Readonly<Record<DynamicEventKind, MissionEventKind>> = {
  pirateAmbushes: "factionAmbush",
  voidIncursions: "voidRift",
  solarStorms: "solarStorm",
  ancientReactivations: "ancientSignal",
  civilianEmergencies: "distressCalls",
  prototypeDiscoveries: "prototypeDiscovery",
  fleetBattles: "factionAmbush",
  environmentalCollapse: "meteorShower",
  scientificBreakthroughs: "lostExplorer",
};

/** Legendary expedition features (AF-084 §Legendary Expeditions) — seven registered. */
export const LEGENDARY_EXPEDITION_FEATURES = ["uniqueBosses", "exclusiveLore", "hiddenObjectives", "rareRelics", "prototypeTechnology", "ancientDiscoveries", "galaxyImpact"] as const;

/** Chain-mission kinds (AF-084 §Chain Missions) — seven registered. */
export const MISSION_CHAIN_KINDS = ["multiStageExpeditions", "commanderStories", "factionCampaigns", "researchProjects", "explorationChains", "galaxyRestoration", "ancientMysteries"] as const;
export type MissionChainKind = (typeof MISSION_CHAIN_KINDS)[number];

/** A chain is an ORDERED list of real expedition ids — long-term narrative as data. */
export interface MissionChainDef {
  id: string;
  kind: MissionChainKind;
  name: string;
  narrative: string;
  stageMissionIds: readonly string[];
}

/** The Vault Signal — the first mission chain: the Void signature in the
 * Crystal Fields leads to the dig window at First Light. */
export const VAULT_SIGNAL_CHAIN: MissionChainDef = {
  id: "chain-vault-signal",
  kind: "ancientMysteries",
  name: "The Vault Signal",
  narrative: "The Void signature you tracked into the Crystal Fields was not wandering. It was following a signal — and the signal comes from First Light.",
  stageMissionIds: ["crystal-fields-incursion", "first-light-excavation"],
};

export const MISSION_CHAINS: readonly MissionChainDef[] = [VAULT_SIGNAL_CHAIN];

/** Pure chain progression — the next stage after a completed expedition, or null. */
export function nextChainStageAfter(chain: MissionChainDef, completedMissionId: string): string | null {
  const index = chain.stageMissionIds.indexOf(completedMissionId);
  if (index === -1 || index === chain.stageMissionIds.length - 1) return null;
  return chain.stageMissionIds[index + 1]!;
}

/** Generator inputs (AF-084 §Mission Generator) — ten, extending AF-083's
 * nine with the two directors; every expedition feels handcrafted. */
export const ROSTER_GENERATOR_INPUTS: readonly ReactivitySurfaceDef[] = [
  { id: "playerHistory", liveBinding: "AF-026 meta statistics" },
  { id: "campaignProgress", liveBinding: "AF-068 campaign chapter state" },
  { id: "biome", liveBinding: "AF-036 biome defs via the galaxy map (AF-058)" },
  { id: "factionPresence", liveBinding: "AF-039 reputation + AF-083 profile presence" },
  { id: "research", liveBinding: "AF-024 unlocked nodes" },
  { id: "galaxyState", liveBinding: "AF-038 current system and region" },
  { id: "weather", liveBinding: "AF-036 weather cycles" },
  { id: "enemyDirector", liveBinding: "AF-017 threat curve and spawn tables" },
  { id: "bossDirector", liveBinding: "AF-035 boss seam via MissionDef.bossId" },
  { id: "explorationProgress", liveBinding: "AF-038 per-system exploration stat" },
];

/** Collection kinds (AF-084 §Mission Collection) — eight registered. */
export const MISSION_COLLECTION_KINDS = ["completedMissions", "legendaryExpeditions", "perfectCompletions", "optionalObjectives", "hiddenDiscoveries", "bossVictories", "historicalTimeline", "statistics"] as const;

/** Operations Centre features (AF-084 §Galaxy Operations Centre) — eight; DERIVED from the log. */
export const OPERATIONS_CENTRE_FEATURES = ["missionArchive", "replaySystem", "statistics", "missionSearch", "expeditionTimeline", "commanderRecords", "rewardHistory", "galaxyActivity"] as const;
export type OperationsCentreFeature = (typeof OPERATIONS_CENTRE_FEATURES)[number];

/** Forbidden outcomes (AF-084 §Balance Principles) — registered BY NAME. */
export const ROSTER_MISSION_FORBIDDEN_OUTCOMES = ["repetitiveGrinding", "artificialPadding"] as const;

/** Accessibility surfaces (AF-084 §Accessibility) — eight registered. */
export const ROSTER_MISSION_ACCESSIBILITY_SURFACES = ["missionSearch", "objectiveFilters", "difficultyPreview", "estimatedDuration", "largeUI", "controllerNavigation", "touchNavigation", "colourBlindSupport"] as const;

/** A roster entry binds identity ONLY — family and tier. No stat field
 * exists (the AF-072→082 discipline). */
export interface MissionRosterEntry {
  missionId: string;
  family: MissionFamily;
  tier: MissionTier;
}

export const MISSION_ROSTER_ENTRIES: readonly MissionRosterEntry[] = [
  { missionId: "crystal-fields-incursion", family: "worldEvent", tier: "special" },
  { missionId: "winterline-rescue", family: "civilianSupport", tier: "common" },
  { missionId: "first-light-excavation", family: "ancientDiscovery", tier: "ancient" },
  // GP-003 §Star Systems: Forge Primus's own real roster entry.
  { missionId: "forge-primus-uprising", family: "sabotage", tier: "elite" },
];

/** One permanent expedition record (AF-084 §Mission Collection / §Mission History). */
export interface ExpeditionRecord {
  missionId: string;
  tier: MissionTier;
  result: "victory" | "defeat";
  perfect: boolean;
  optionalsDone: number;
  bossDefeated: boolean;
  playTimeMs: number;
  sequence: number;
}

export interface ExpeditionLogSnapshot {
  completedCount: number;
  defeatCount: number;
  perfectCount: number;
  optionalObjectivesTotal: number;
  bossVictories: number;
  timelineLength: number;
}

/**
 * The expedition log — permanent, append-only history (the AF-026 pattern).
 * Every expedition becomes part of the player's personal history: records
 * are never edited, never removed, and defeats are remembered as honestly
 * as victories ("failure should generate stories").
 */
export class ExpeditionLogRuntime {
  private readonly records: ExpeditionRecord[] = [];

  recordExpedition(entry: Omit<ExpeditionRecord, "sequence">): ExpeditionRecord {
    const record: ExpeditionRecord = { ...entry, sequence: this.records.length + 1 };
    this.records.push(record);
    return record;
  }

  get timeline(): readonly ExpeditionRecord[] {
    return this.records;
  }

  get snapshot(): ExpeditionLogSnapshot {
    let completed = 0;
    let defeats = 0;
    let perfect = 0;
    let optionals = 0;
    let bosses = 0;
    for (const record of this.records) {
      if (record.result === "victory") completed += 1;
      else defeats += 1;
      if (record.perfect) perfect += 1;
      optionals += record.optionalsDone;
      if (record.bossDefeated) bosses += 1;
    }
    return {
      completedCount: completed,
      defeatCount: defeats,
      perfectCount: perfect,
      optionalObjectivesTotal: optionals,
      bossVictories: bosses,
      timelineLength: this.records.length,
    };
  }
}

/** §Galaxy Operations Centre: all eight features DERIVED from the log — the
 * centre is a viewer over permanent history, not a system. */
export function operationsCentreFor(log: ExpeditionLogRuntime): Record<OperationsCentreFeature, string> {
  const snapshot = log.snapshot;
  const latest = log.timeline[log.timeline.length - 1] ?? null;
  return {
    missionArchive: `${snapshot.timelineLength} expeditions on record`,
    replaySystem: latest ? `latest: ${latest.missionId} seed-replayable (deterministic per AF-037)` : "no expedition yet — every run is seed-replayable",
    statistics: `${snapshot.completedCount} victories · ${snapshot.defeatCount} defeats · ${snapshot.perfectCount} perfect`,
    missionSearch: `indexed by ${MISSION_FAMILIES.length} families and ${MISSION_TIERS.length} tiers`,
    expeditionTimeline: `sequence 1..${snapshot.timelineLength}, append-only`,
    commanderRecords: "per-commander uses and win rates via AF-072's roster ledger",
    rewardHistory: `${snapshot.optionalObjectivesTotal} optional objectives banked`,
    galaxyActivity: `${snapshot.bossVictories} guardians defeated across the map`,
  };
}
