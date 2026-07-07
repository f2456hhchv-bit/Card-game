/**
 * Galaxy Event Framework data shapes (AF-041). Four of the ten Event
 * Categories are exactly the registered vocabulary AF-038 (Galaxy Events),
 * AF-039 (Faction Events), AF-040 (Economic Events) and AF-017/036
 * (Environmental Events) already own — this module re-surfaces their kinds
 * at the world-simulation layer rather than re-registering them. The
 * remaining six categories (Sector, Ancient, Scientific Discovery,
 * Emergency, Hidden, Legendary) are genuinely new vocabulary. `kind` is
 * typed as a plain string, matching the exact boundary AF-017's
 * EnvironmentalEventTriggered payload already uses — no discriminated
 * union was needed to cross ten heterogeneous kind vocabularies. World
 * State persists through AF-026's recordStat under `worldState:<key>`,
 * clamped by AF-038's exact GalaxyRuntime.clampedDelta — reused directly,
 * never reimplemented, for a third time.
 */
export const EVENT_CATEGORIES = [
  "galaxy",
  "sector",
  "faction",
  "ancient",
  "environmental",
  "economic",
  "scientificDiscovery",
  "emergency",
  "hidden",
  "legendary",
] as const;
export type EventCategory = (typeof EVENT_CATEGORIES)[number];

/** New vocabulary — Sector Events remain localised (AF-041 §Sector Events). */
export const SECTOR_EVENT_KINDS = [
  "resourceRush",
  "meteorActivity",
  "radiationStorm",
  "ancientSignal",
  "factionConflict",
  "researchOpportunity",
  "refugeeArrival",
  "tradeConvoy",
  "hiddenVault",
  "environmentalCollapse",
] as const;
export type SectorEventKind = (typeof SECTOR_EVENT_KINDS)[number];

/** New vocabulary — Ancient Events remain rare (AF-041 §Ancient Events). */
export const ANCIENT_EVENT_KINDS = [
  "vaultOpening",
  "beaconActivation",
  "aiAwakening",
  "ancientFleet",
  "planetaryDefence",
  "hiddenArchive",
  "prototypeRecovery",
  "energySurge",
  "lostCivilisation",
] as const;
export type AncientEventKind = (typeof ANCIENT_EVENT_KINDS)[number];

/** New vocabulary — the spec names these categories but gives no explicit example list; content authoring, sized like the others. */
export const SCIENTIFIC_DISCOVERY_KINDS = ["breakthroughPublished", "anomalyCatalogued", "artifactDeciphered"] as const;
export type ScientificDiscoveryKind = (typeof SCIENTIFIC_DISCOVERY_KINDS)[number];

export const EMERGENCY_EVENT_KINDS = ["civilianEvacuation", "pirateActivity", "distressFleet"] as const;
export type EmergencyEventKind = (typeof EMERGENCY_EVENT_KINDS)[number];

export const HIDDEN_EVENT_KINDS = ["unknownSignal", "undiscoveredRuin", "cloakedVessel"] as const;
export type HiddenEventKind = (typeof HIDDEN_EVENT_KINDS)[number];

export const LEGENDARY_EVENT_KINDS = ["firstContact", "prototypeDiscovery", "mythicRelicSurfaces"] as const;
export type LegendaryEventKind = (typeof LEGENDARY_EVENT_KINDS)[number];

/** World State — ten values the galaxy tracks, each a namespaced meta statistic. */
export const WORLD_STATE_KEYS = [
  "factionActivity",
  "sectorStability",
  "threatLevel",
  "resourceAvailability",
  "ancientActivity",
  "voidCorruption",
  "scientificProgress",
  "tradeNetworks",
  "civilianPopulation",
  "explorationProgress",
] as const;
export type WorldStateKey = (typeof WORLD_STATE_KEYS)[number];
export const WORLD_STATE_MIN = 0;
export const WORLD_STATE_MAX = 100;

/** Player Participation — every choice influences future events; Ignore/Observe never force a reaction. */
export const PLAYER_PARTICIPATION_KINDS = [
  "ignore",
  "investigate",
  "support",
  "prevent",
  "exploit",
  "document",
  "observe",
] as const;
export type PlayerParticipationKind = (typeof PLAYER_PARTICIPATION_KINDS)[number];

/** Additional World State nudge on top of the event's own ambient delta — content tuning. */
export const PLAYER_PARTICIPATION_WORLD_STATE_DELTA: Readonly<Record<PlayerParticipationKind, number>> = {
  ignore: 0,
  observe: 0,
  investigate: 4,
  document: 4,
  support: 10,
  prevent: -10,
  exploit: 6,
};

/** Event Chains remain modular — a plain content reference, never a second mission/research engine. */
export const EVENT_CHAIN_OUTCOME_KINDS = [
  "missionChain",
  "bossEncounter",
  "factionCampaign",
  "researchOpportunity",
  "newBiome",
  "galaxyDiscovery",
  "hiddenCivilisation",
  "legendaryReward",
] as const;
export type EventChainOutcomeKind = (typeof EVENT_CHAIN_OUTCOME_KINDS)[number];

export interface EventChainRef {
  kind: EventChainOutcomeKind;
  /** References an id in whatever system that outcome kind names (a mission id, a research node id, a lore id, …). */
  contentId: string;
}

export interface WorldEventDef {
  id: string;
  category: EventCategory;
  /** Drawn from AF-038/039/040's own kind vocabulary for galaxy/faction/economic;
   * from this module's *_EVENT_KINDS for sector/ancient/scientificDiscovery/
   * emergency/hidden/legendary; a plain descriptive string for environmental
   * (matching the bus's own string-only EnvironmentalEventTriggered payload). */
  kind: string;
  weight: number;
  /** Which World State value this event nudges when it fires — the galaxy
   * evolves whether or not the player responds. */
  worldStateKey: WorldStateKey;
  worldStateDelta: number;
  chainsInto: EventChainRef | null;
}

export interface GalaxyWorldEventDef {
  events: readonly WorldEventDef[];
}

/** Sandbox world events — ten entries spanning all ten categories, proving
 * the generation/World-State/chain engine. */
export const SANDBOX_WORLD_EVENTS: GalaxyWorldEventDef = {
  events: [
    { id: "we-machine-uprising", category: "galaxy", kind: "machineUprisings", weight: 2, worldStateKey: "threatLevel", worldStateDelta: 15, chainsInto: null },
    { id: "we-resource-rush", category: "sector", kind: "resourceRush", weight: 4, worldStateKey: "resourceAvailability", worldStateDelta: 10, chainsInto: null },
    { id: "we-faction-conflict", category: "faction", kind: "civilUnrest", weight: 2, worldStateKey: "factionActivity", worldStateDelta: -8, chainsInto: { kind: "factionCampaign", contentId: "human-alliance-recovery" } },
    { id: "we-vault-opening", category: "ancient", kind: "vaultOpening", weight: 1, worldStateKey: "ancientActivity", worldStateDelta: 20, chainsInto: { kind: "galaxyDiscovery", contentId: "LORE_LUCENT_GATE_VAULT" } },
    { id: "we-solar-flare", category: "environmental", kind: "SolarFlare", weight: 2, worldStateKey: "sectorStability", worldStateDelta: -6, chainsInto: null },
    { id: "we-trade-boom", category: "economic", kind: "tradeFestivals", weight: 3, worldStateKey: "tradeNetworks", worldStateDelta: 10, chainsInto: null },
    { id: "we-breakthrough", category: "scientificDiscovery", kind: "breakthroughPublished", weight: 2, worldStateKey: "scientificProgress", worldStateDelta: 10, chainsInto: { kind: "researchOpportunity", contentId: "warp-charting" } },
    { id: "we-civilian-evacuation", category: "emergency", kind: "civilianEvacuation", weight: 1, worldStateKey: "civilianPopulation", worldStateDelta: -10, chainsInto: null },
    { id: "we-unknown-signal", category: "hidden", kind: "unknownSignal", weight: 1, worldStateKey: "explorationProgress", worldStateDelta: 5, chainsInto: null },
    { id: "we-first-contact", category: "legendary", kind: "firstContact", weight: 0.3, worldStateKey: "factionActivity", worldStateDelta: 25, chainsInto: { kind: "legendaryReward", contentId: "bp-prototype-lance" } },
  ],
};
