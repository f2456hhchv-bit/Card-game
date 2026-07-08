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
    // AF-058: the Human Frontier region — additive galaxy content, the same
    // roster-addition class as AF-046/050/052's faction profiles.
    {
      id: "humanFrontier",
      name: "Human Frontier",
      lore: "The fragile remains of humanity after the Collapse — rebuilding in public, so the dark can see it hasn't won.",
    },
    // AF-060: the Machine Expanse region — the Collective's industrial heart.
    {
      id: "machineExpanse",
      name: "Machine Expanse",
      lore: "Entire planets converted into autonomous factories that kept manufacturing after everyone who could read the invoices died.",
    },
    // AF-061: the Void Expanse region — where reality has begun to collapse.
    {
      id: "voidExpanse",
      name: "Void Expanse",
      lore: "Not empty space — emptied space. The region where physics stopped being a law and became a suggestion.",
    },
    // AF-062: the Ancient Core region — the precursors' preserved stellar civilisation.
    {
      id: "ancientCore",
      name: "Ancient Core",
      lore: "The civilisation that built the Afterlight Network did not fall here. It finished here — and whatever it finished, the Custodians still guard.",
    },
    // AF-063: the Solar Wastes region — star systems dying in public.
    {
      id: "solarWastes",
      name: "Solar Wastes",
      lore: "Dying suns and the salvage wars beneath them. The stars gave these systems everything, and now they are taking it back.",
    },
    // AF-064: the Frozen Reach region — the galaxy's cryogenic edge.
    {
      id: "frozenReach",
      name: "Frozen Reach",
      lore: "Where light barely reaches, entire systems chose suspension over escape. The quietest region of space is not empty — it is waiting.",
    },
    // AF-065: the Broken Systems region — the galaxy's largest starship graveyard.
    {
      id: "brokenSystems",
      name: "Broken Systems",
      lore: "Millions of vessels from thousands of years of conflict, drifting where they fell. Nothing here was ever salvaged. Nobody agrees on why.",
    },
    // AF-066: the Dark Nebula region — the clouds that hide living worlds.
    {
      id: "darkNebula",
      name: "Dark Nebula",
      lore: "The nebula does not block the starlight. Something inside it drinks the starlight — and whatever grew in the dark grew very, very large.",
    },
    // AF-067: the Singularity Zone region — the last region on AF-038's
    // shelf to receive a definition; the galaxy map is complete.
    {
      id: "singularityZone",
      name: "Singularity Zone",
      lore: "Where black holes, collapsed stars and quantum anomalies merged into one impossible region. Physics is a negotiation here, and it is still being negotiated.",
    },
  ],
  systems: [
    {
      id: "sys-lucent-gate",
      name: "Lucent Gate",
      region: "crystalDominion",
      biomeId: "crystal-fields-alpha",
      missionIds: ["crystal-fields-incursion"],
      connectedSystemIds: ["sys-hollow-drift", "sys-meridian-rest", "sys-prismheart"], // AF-058/059: the frontier and the Expanse join the route map
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
      connectedSystemIds: ["sys-lucent-gate", "sys-ember-reach", "sys-forge-primus"], // AF-060: the Expanse joins through contested space
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
    // AF-058: Meridian Rest — the Human Frontier's first reachable system,
    // carrying the first biome authored on AF-036's engine. Its biomeId gives
    // AF-038's own field its first consumer.
    {
      id: "sys-meridian-rest",
      name: "Meridian Rest",
      region: "humanFrontier",
      biomeId: "meridian-rest-frontier",
      missionIds: ["crystal-fields-incursion"],
      connectedSystemIds: ["sys-lucent-gate", "sys-winterline", "sys-gravewake"], // AF-064/065: the frozen edge and the graveyard lie past the frontier
      pointsOfInterest: [
        { id: "meridian-rest-shipyard", kind: "tradeOutposts", discoveryCategory: "lore", discoveryId: "LORE_MERIDIAN_REST_SHIPYARD" },
      ],
      dominantFaction: "Human Alliance",
      threatLevel: 1,
      requiresFastTravelUnlock: false,
    },
    // AF-059: Prismheart — the Crystal Expanse, the Ascendancy's birthplace,
    // deeper into Dominion space than the Lucent Gate approach.
    {
      id: "sys-prismheart",
      name: "Prismheart",
      region: "crystalDominion",
      biomeId: "crystal-expanse",
      missionIds: ["crystal-fields-incursion"],
      connectedSystemIds: ["sys-lucent-gate", "sys-verdance"], // AF-066: the living world grows past the Ascendancy's birthplace
      pointsOfInterest: [
        { id: "prismheart-temple", kind: "crystalTemples", discoveryCategory: "lore", discoveryId: "LORE_PRISMHEART_TEMPLE" },
      ],
      dominantFaction: "Crystal Dominion",
      threatLevel: 3,
      requiresFastTravelUnlock: false,
    },
    // AF-060: Forge Primus — the Machine Expanse, reached through Hollow
    // Drift's contested space; the deepest authored biome.
    {
      id: "sys-forge-primus",
      name: "Forge Primus",
      region: "machineExpanse",
      biomeId: "machine-expanse",
      missionIds: ["crystal-fields-incursion"],
      connectedSystemIds: ["sys-hollow-drift", "sys-hollow-crown", "sys-cinderfall"], // AF-061/063: the Void and the Wastes lie past the Forge
      pointsOfInterest: [
        { id: "forge-primus-foundry", kind: "machineFoundries", discoveryCategory: "lore", discoveryId: "LORE_FORGE_PRIMUS_FOUNDRY" },
      ],
      dominantFaction: "Machine Collective",
      threatLevel: 4,
      requiresFastTravelUnlock: false,
    },
    // AF-061: Hollow Crown — the Void Expanse, past even Forge Primus; the
    // deepest reachable system and the deepest authored biome.
    {
      id: "sys-hollow-crown",
      name: "Hollow Crown",
      region: "voidExpanse",
      biomeId: "void-expanse",
      missionIds: ["crystal-fields-incursion"],
      connectedSystemIds: ["sys-forge-primus", "sys-first-light"], // AF-062: the precursors' home lies beyond the collapse
      pointsOfInterest: [
        { id: "hollow-crown-monolith", kind: "unknownSignals", discoveryCategory: "lore", discoveryId: "LORE_HOLLOW_CROWN_MONOLITH" },
      ],
      dominantFaction: "Void Swarm",
      threatLevel: 5,
      requiresFastTravelUnlock: false,
    },
    // AF-062: First Light — the Ancient Core, past even the Void; the journey
    // to the precursors' home crosses everything they left behind.
    {
      id: "sys-first-light",
      name: "First Light",
      region: "ancientCore",
      biomeId: "ancient-core",
      missionIds: ["crystal-fields-incursion"],
      connectedSystemIds: ["sys-hollow-crown", "sys-axiom"], // AF-067: the Zone begins where the precursors' light ends
      pointsOfInterest: [
        { id: "first-light-council", kind: "ancientVaults", discoveryCategory: "lore", discoveryId: "LORE_FIRST_LIGHT_COUNCIL" },
      ],
      dominantFaction: "Ancient Custodians",
      threatLevel: 6,
      requiresFastTravelUnlock: false,
    },
    // AF-063: Cinderfall — the Solar Wastes, a dying system off Forge Primus;
    // the Collective's burning shipyards and the Outlaws' salvage wars.
    {
      id: "sys-cinderfall",
      name: "Cinderfall",
      region: "solarWastes",
      biomeId: "solar-wastes",
      missionIds: ["crystal-fields-incursion"],
      connectedSystemIds: ["sys-forge-primus"],
      pointsOfInterest: [
        { id: "cinderfall-colony", kind: "miningColonies", discoveryCategory: "lore", discoveryId: "LORE_CINDERFALL_COLONY" },
      ],
      dominantFaction: "Machine Collective",
      threatLevel: 4,
      requiresFastTravelUnlock: false,
    },
    // AF-064: Winterline — the Frozen Reach, past the Human Frontier on the
    // galaxy's dark edge; the colonies that chose suspension over escape.
    {
      id: "sys-winterline",
      name: "Winterline",
      region: "frozenReach",
      biomeId: "frozen-reach",
      missionIds: ["crystal-fields-incursion"],
      connectedSystemIds: ["sys-meridian-rest"],
      pointsOfInterest: [
        { id: "winterline-fleet", kind: "abandonedFleets", discoveryCategory: "lore", discoveryId: "LORE_WINTERLINE_FLEET" },
      ],
      dominantFaction: "The Eclipsed",
      threatLevel: 3,
      requiresFastTravelUnlock: false,
    },
    // AF-065: Gravewake — the Derelict Expanse, the fleet graveyard off the
    // Human Frontier; the Alliance's lost fleets drifted home almost far enough.
    {
      id: "sys-gravewake",
      name: "Gravewake",
      region: "brokenSystems",
      biomeId: "derelict-expanse",
      missionIds: ["crystal-fields-incursion"],
      connectedSystemIds: ["sys-meridian-rest"],
      pointsOfInterest: [
        { id: "gravewake-carrier", kind: "abandonedFleets", discoveryCategory: "lore", discoveryId: "LORE_GRAVEWAKE_CARRIER" },
      ],
      dominantFaction: "The Eclipsed",
      threatLevel: 2,
      requiresFastTravelUnlock: false,
    },
    // AF-066: Verdance — the Living Ecospheres, hidden in the Dark Nebula
    // past Prismheart; the Hive's home and a planet that is one organism.
    {
      id: "sys-verdance",
      name: "Verdance",
      region: "darkNebula",
      biomeId: "living-ecospheres",
      missionIds: ["crystal-fields-incursion"],
      connectedSystemIds: ["sys-prismheart"],
      pointsOfInterest: [
        { id: "verdance-bio-lab", kind: "researchStations", discoveryCategory: "lore", discoveryId: "LORE_VERDANCE_BIO_LAB" },
      ],
      dominantFaction: "Xenomorph Hive",
      threatLevel: 4,
      requiresFastTravelUnlock: false,
    },
    // AF-067: Axiom — the Singularity Zone, past even First Light; the
    // deepest system in the galaxy, where the precursors' story ends.
    {
      id: "sys-axiom",
      name: "Axiom",
      region: "singularityZone",
      biomeId: "singularity-zone",
      missionIds: ["crystal-fields-incursion"],
      connectedSystemIds: ["sys-first-light"],
      pointsOfInterest: [
        { id: "axiom-engine", kind: "prototypeFacilities", discoveryCategory: "lore", discoveryId: "LORE_AXIOM_ENGINE" },
      ],
      dominantFaction: "Void Swarm",
      threatLevel: 7,
      requiresFastTravelUnlock: false,
    },
  ],
  events: [
    { kind: "crystalExpansion", weight: 4 },
    { kind: "tradeOpportunities", weight: 3 },
    { kind: "distressChains", weight: 2 },
    { kind: "ancientReactivations", weight: 1 },
  ],
};
