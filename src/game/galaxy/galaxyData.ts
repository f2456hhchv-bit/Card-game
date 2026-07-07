/**
 * Galaxy data shapes (AF-038). Regions reuse AF-010's canon factions
 * directly (Crystal Dominion is the same name; Human Frontier/Machine
 * Expanse/Void Expanse are the same factions AF-030's Commander archetypes
 * already reference) — no second lore layer. Discovery reuses AF-026's
 * already-registered CollectionCategory values. Fast Travel gates on
 * AF-024's galaxyNavigation/galaxyUnlock research vocabulary, registered
 * since AF-024 with no producer until now. Star systems reference AF-036
 * biomes and AF-037 missions as content, not new systems.
 */
import type { CollectionCategory } from "../meta/metaData";

export const GALAXY_REGIONS = [
  "humanFrontier",
  "crystalDominion",
  "machineExpanse",
  "solarWastes",
  "frozenReach",
  "voidExpanse",
  "ancientCore",
  "brokenSystems",
  "darkNebula",
  "singularityZone",
] as const;
export type GalaxyRegion = (typeof GALAXY_REGIONS)[number];

export const POINT_OF_INTEREST_KINDS = [
  "ancientVaults",
  "researchStations",
  "miningColonies",
  "abandonedFleets",
  "distressBeacons",
  "prototypeFacilities",
  "crystalTemples",
  "machineFoundries",
  "tradeOutposts",
  "unknownSignals",
] as const;
export type PointOfInterestKind = (typeof POINT_OF_INTEREST_KINDS)[number];

export const GALAXY_EVENT_KINDS = [
  "solarStorms",
  "voidBreaches",
  "machineUprisings",
  "crystalExpansion",
  "tradeOpportunities",
  "distressChains",
  "factionWars",
  "ancientReactivations",
  "cometPassages",
] as const;
export type GalaxyEventKind = (typeof GALAXY_EVENT_KINDS)[number];

export const LONG_TERM_GOAL_KINDS = [
  "completeExploration",
  "fullRestoration",
  "ancientRecovery",
  "galaxyStability",
  "factionResolution",
  "hiddenDiscoveries",
  "legendaryCollections",
] as const;
export type LongTermGoalKind = (typeof LONG_TERM_GOAL_KINDS)[number];

export interface GalaxyRegionDef {
  id: GalaxyRegion;
  name: string;
  lore: string;
}

export interface PointOfInterestDef {
  id: string;
  kind: PointOfInterestKind;
  /** Reuses an already-registered CollectionCategory — no new discovery vocabulary. */
  discoveryCategory: CollectionCategory;
  discoveryId: string;
}

export interface GalaxyEventDef {
  kind: GalaxyEventKind;
  weight: number;
}

export interface StarSystemDef {
  id: string;
  name: string;
  region: GalaxyRegion;
  /** AF-036 biome reference — content, not a new environment system. */
  biomeId: string;
  /** AF-037 mission template references — content, not a new mission system. */
  missionIds: readonly string[];
  /** Adjacent systems reachable without Fast Travel. */
  connectedSystemIds: readonly string[];
  pointsOfInterest: readonly PointOfInterestDef[];
  dominantFaction: string;
  threatLevel: number;
  /** Only reachable directly (bypassing route adjacency) once Fast Travel is unlocked. */
  requiresFastTravelUnlock: boolean;
}

export interface GalaxyDef {
  regions: readonly GalaxyRegionDef[];
  systems: readonly StarSystemDef[];
  events: readonly GalaxyEventDef[];
}

/** Sandbox galaxy — three systems, one region, proving the route/discovery/faction/event engine. */
export const SANDBOX_GALAXY: GalaxyDef = {
  regions: [
    {
      id: "crystalDominion",
      name: "Crystal Dominion",
      lore: "Silicate empires that grew instead of building — the Dominion doesn't construct its fleets, it cultivates them.",
    },
  ],
  systems: [
    {
      id: "sys-lucent-gate",
      name: "Lucent Gate",
      region: "crystalDominion",
      biomeId: "crystal-fields-alpha",
      missionIds: ["crystal-fields-incursion"],
      connectedSystemIds: ["sys-hollow-drift"],
      pointsOfInterest: [
        { id: "lucent-gate-vault", kind: "ancientVaults", discoveryCategory: "lore", discoveryId: "LORE_LUCENT_GATE_VAULT" },
      ],
      dominantFaction: "Crystal Dominion",
      threatLevel: 2,
      requiresFastTravelUnlock: false,
    },
    {
      id: "sys-hollow-drift",
      name: "Hollow Drift",
      region: "crystalDominion",
      biomeId: "crystal-fields-alpha",
      missionIds: ["crystal-fields-incursion"],
      connectedSystemIds: ["sys-lucent-gate", "sys-ember-reach"],
      pointsOfInterest: [
        { id: "hollow-drift-beacon", kind: "distressBeacons", discoveryCategory: "lore", discoveryId: "LORE_HOLLOW_DRIFT_BEACON" },
      ],
      dominantFaction: "Crystal Dominion",
      threatLevel: 3,
      requiresFastTravelUnlock: false,
    },
    {
      id: "sys-ember-reach",
      name: "Ember Reach",
      region: "crystalDominion",
      biomeId: "crystal-fields-alpha",
      missionIds: ["crystal-fields-incursion"],
      connectedSystemIds: ["sys-hollow-drift"],
      pointsOfInterest: [
        { id: "ember-reach-foundry", kind: "machineFoundries", discoveryCategory: "biomes", discoveryId: "BIOME_EMBER_REACH_FOUNDRY" },
      ],
      dominantFaction: "Machine Collective",
      threatLevel: 4,
      requiresFastTravelUnlock: true,
    },
  ],
  events: [
    { kind: "crystalExpansion", weight: 4 },
    { kind: "tradeOpportunities", weight: 3 },
    { kind: "distressChains", weight: 2 },
    { kind: "ancientReactivations", weight: 1 },
  ],
};
