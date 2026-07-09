/**
 * Research Roster (AF-082). The AF-076/078/080 roster move applied to
 * science: AF-024's ResearchNodeDef, the ResearchTree engine, and
 * AF-081's ResearchProjectProfileDef are UNCHANGED — the ecosystem is
 * data. Fifteen roster disciplines map TOTALLY onto AF-081's ten;
 * nine specialised laboratories map TOTALLY onto AF-081's eight-lab
 * register with a per-project equality law; eight research tiers where
 * TIER AFFECTS OPPORTUNITY, NEVER NUMBERS (entries are identity-only,
 * key-inspected); four new projects extend the tree additively and
 * EVERY one is pure gameplay (effect null or an unlock flag — the
 * numeric-effect count of the tree is asserted UNCHANGED by this
 * module); infinite research rides AF-069's real geometric cost engine;
 * and the scientific archive is DERIVATION over data every project
 * already carries.
 */
import type { ResearchNodeDef } from "./researchData";
import {
  FRAMEWORK_RESEARCH_TREE,
  RESEARCH_PROJECT_PROFILES,
  type ResearchProjectProfileDef,
  type ScientificDiscipline,
} from "./researchFrameworkData";
import { researchNodeCostFor } from "../endgame/endgameData";

/** Roster disciplines (AF-082 §Research Disciplines) — fifteen, mapped
 * totally onto AF-081's ten scientific disciplines. */
export const RESEARCH_ROSTER_DISCIPLINES = [
  "shipEngineering",
  "weaponEngineering",
  "materialsScience",
  "energySystems",
  "artificialIntelligence",
  "quantumScience",
  "voidStudies",
  "crystalResonance",
  "biologicalEngineering",
  "droneTechnology",
  "planetaryEngineering",
  "civilianInfrastructure",
  "ancientTechnology",
  "prototypeScience",
  "experimentalPhysics",
] as const;
export type ResearchRosterDiscipline = (typeof RESEARCH_ROSTER_DISCIPLINES)[number];

export const ROSTER_DISCIPLINE_TO_AF081: Readonly<Record<ResearchRosterDiscipline, ScientificDiscipline>> = {
  shipEngineering: "energeticEngineering",
  weaponEngineering: "appliedPhysics",
  materialsScience: "materialsChemistry",
  energySystems: "energeticEngineering",
  artificialIntelligence: "computationalScience",
  quantumScience: "quantumMechanics",
  voidStudies: "voidPhenomenology",
  crystalResonance: "harmonicResonance",
  biologicalEngineering: "biologicalScience",
  droneTechnology: "computationalScience",
  planetaryEngineering: "fieldCartography",
  civilianInfrastructure: "fieldCartography",
  ancientTechnology: "xenoarchaeology",
  prototypeScience: "appliedPhysics",
  experimentalPhysics: "quantumMechanics",
};

/** Research tiers (AF-082 §Research Tiers) — eight registered; tier affects
 * opportunity, never numbers (a roster entry carries no stat field). */
export const RESEARCH_TIERS = ["foundation", "applied", "advanced", "experimental", "prototype", "ancient", "legendary", "transcendent"] as const;
export type ResearchTier = (typeof RESEARCH_TIERS)[number];

/** Scientific philosophy surfaces (AF-082 §Scientific Philosophy) — eight. */
export const SCIENTIFIC_PHILOSOPHY_SURFACES = [
  "newMechanics",
  "alternativeBuilds",
  "engineeringPossibilities",
  "commanderInteractions",
  "shipSystems",
  "weaponBehaviours",
  "worldChanges",
  "explorationOpportunities",
] as const;
export type ScientificPhilosophySurface = (typeof SCIENTIFIC_PHILOSOPHY_SURFACES)[number];

/** Discovery network sources (AF-082 §Discovery Network) — nine; knowledge
 * comes from playing the game. */
export const DISCOVERY_NETWORK_SOURCES = ["campaign", "exploration", "codex", "collections", "bosses", "biomes", "ancientArchives", "factionReputation", "scientificExpeditions"] as const;
export type DiscoveryNetworkSource = (typeof DISCOVERY_NETWORK_SOURCES)[number];

/** Specialised laboratories (AF-082 §Research Labs) — nine, each realised by
 * an EXISTING AF-081 laboratory (no second lab register). */
export const ROSTER_LABORATORIES = [
  "engineeringInstitute",
  "quantumLaboratory",
  "voidObservatory",
  "crystalResonanceCentre",
  "prototypeDivision",
  "biologicalInstitute",
  "artificialIntelligenceCentre",
  "ancientArchive",
  "civilianDevelopmentBureau",
] as const;
export type RosterLaboratory = (typeof ROSTER_LABORATORIES)[number];

export const ROSTER_LAB_TO_AF081_LAB: Readonly<Record<RosterLaboratory, string>> = {
  engineeringInstitute: "engineering-labs",
  quantumLaboratory: "quantum-labs",
  voidObservatory: "void-research",
  crystalResonanceCentre: "crystal-studies",
  prototypeDivision: "prototype-division",
  biologicalInstitute: "biological-labs",
  artificialIntelligenceCentre: "engineering-labs", // automation is engineering today — an AI wing, not a new lab
  ancientArchive: "ancient-archive",
  civilianDevelopmentBureau: "civilian-research",
};

/** Galactic science surfaces (AF-082 §Galactic Science) — seven registered. */
export const GALACTIC_SCIENCE_SURFACES = ["civilisations", "trade", "exploration", "infrastructure", "researchSpeed", "technologyAvailability", "galaxyRestoration"] as const;

/** Experimental research traits (AF-082 §Experimental Research) — six registered. */
export const EXPERIMENTAL_RESEARCH_TRAITS = ["riskVsReward", "prototypeTechnology", "unstableSystems", "uniqueMechanics", "advancedBuilds", "unexpectedOutcomes"] as const;

/** Ancient research unlocks (AF-082 §Ancient Research) — seven registered. */
export const ANCIENT_RESEARCH_UNLOCKS = ["precursorTechnology", "civilisationHistory", "afterlightNetwork", "quantumEngineering", "planetarySystems", "legendaryEquipment", "hiddenCampaigns"] as const;

/** Infinite research kinds (AF-082 §Infinite Research) — seven registered. */
export const INFINITE_RESEARCH_KINDS = ["efficiency", "exploration", "engineering", "civilianDevelopment", "legendaryProjects", "galaxyRestoration", "scientificExcellence"] as const;
export type InfiniteResearchKind = (typeof INFINITE_RESEARCH_KINDS)[number];

/** Collection kinds (AF-082 §Research Collection) — eight registered. */
export const RESEARCH_ROSTER_COLLECTION_KINDS = ["completedProjects", "laboratories", "discoveries", "prototypeResearch", "ancientResearch", "legendaryProjects", "statistics", "historicalTimeline"] as const;

/** Scientific archive features (AF-082 §Scientific Archive) — seven; DERIVED below. */
export const SCIENTIFIC_ARCHIVE_FEATURES = ["researchTimeline", "technologyViewer", "dependencyGraph", "scientificHistory", "discoveryMap", "civilisationTimeline", "futureResearchPreview"] as const;
export type ScientificArchiveFeature = (typeof SCIENTIFIC_ARCHIVE_FEATURES)[number];

/** Forbidden balance outcomes (AF-082 §Balance Principles) — registered BY NAME. */
export const ROSTER_RESEARCH_FORBIDDEN_OUTCOMES = ["mandatoryGrinding", "universallyOptimalBranch"] as const;

// ─── The roster projects — data on AF-024/081's unchanged shapes ────────────

/** Drone Doctrine — the FIRST droneEngineering project; pure gameplay. */
export const DRONE_DOCTRINE: ResearchNodeDef = {
  id: "drone-doctrine",
  name: "Drone Doctrine",
  category: "droneEngineering",
  tier: 1,
  cost: 6,
  completionTimeMs: 0,
  prerequisites: [],
  nodeType: "newMechanic",
  hidden: false,
  effect: { kind: "unlockFlag", flag: "DRONE_DOCTRINE" },
};

/** Gene Tempering — the FIRST commanderDevelopment project; pure gameplay. */
export const GENE_TEMPERING: ResearchNodeDef = {
  id: "gene-tempering",
  name: "Gene Tempering",
  category: "commanderDevelopment",
  tier: 2,
  cost: 8,
  completionTimeMs: 0,
  prerequisites: ["survey-protocols"],
  nodeType: "featureUnlock",
  hidden: false,
  effect: { kind: "unlockFlag", flag: "CREW_CONDITIONING" },
};

/** Void Containment — the FIRST voidResearch project; experimental science. */
export const VOID_CONTAINMENT: ResearchNodeDef = {
  id: "void-containment",
  name: "Void Containment",
  category: "voidResearch",
  tier: 3,
  cost: 14,
  completionTimeMs: 0,
  prerequisites: ["unified-theory"],
  nodeType: "newMechanic",
  hidden: false,
  effect: { kind: "unlockFlag", flag: "VOID_CONTAINMENT" },
};

/** The Afterlight Network — ancient science; gated behind the hidden conduit. */
export const AFTERLIGHT_NETWORK: ResearchNodeDef = {
  id: "afterlight-network",
  name: "The Afterlight Network",
  category: "ancientTechnology",
  tier: 3,
  cost: 20,
  completionTimeMs: 0,
  prerequisites: ["ancient-conduit"],
  nodeType: "ancientDiscovery",
  hidden: false,
  effect: { kind: "unlockFlag", flag: "AFTERLIGHT_NETWORK" },
};

/** The full roster tree — AF-081's fourteen head the array unchanged. */
export const ROSTER_RESEARCH_TREE: readonly ResearchNodeDef[] = [
  ...FRAMEWORK_RESEARCH_TREE,
  DRONE_DOCTRINE,
  GENE_TEMPERING,
  VOID_CONTAINMENT,
  AFTERLIGHT_NETWORK,
];

/** AF-081 profiles for the roster additions — the locked fourteen head the array unchanged. */
export const ROSTER_RESEARCH_PROFILES: readonly ResearchProjectProfileDef[] = [
  ...RESEARCH_PROJECT_PROFILES,
  {
    nodeId: "drone-doctrine",
    branch: "droneTechnology",
    discipline: "computationalScience",
    laboratoryId: "engineering-labs",
    lore: "The Forge's tools defended themselves. Doctrine is teaching them to defend anyone else.",
    gameplayUnlock: { kind: "newTechnologies", description: "Drone doctrine — autonomous systems open as a commanded build surface." },
    visualIdentity: "A wireframe drone mid-assembly, annotations in swarm-notation.",
    codexEntryId: "codex-machine-collective",
    futureExpansionHooks: ["research-swarm-coordination"],
  },
  {
    nodeId: "gene-tempering",
    branch: "commanderTraining",
    discipline: "biologicalScience",
    laboratoryId: "biological-labs",
    lore: "The Ecospheres proved biology is an engineering material. The Institute proved it politely.",
    gameplayUnlock: { kind: "newTechnologies", description: "Crew conditioning — commander development gains a biological track." },
    visualIdentity: "A helix diagram wearing a flight harness.",
    codexEntryId: "codex-commander-reyes",
    futureExpansionHooks: ["research-adaptive-conditioning"],
  },
  {
    nodeId: "void-containment",
    branch: "voidStudies",
    discipline: "voidPhenomenology",
    laboratoryId: "void-research",
    lore: "You cannot study what you cannot hold. The Observatory learned to hold it briefly.",
    gameplayUnlock: { kind: "newTechnologies", description: "Void containment — corrupted systems can be studied, and used, on purpose." },
    visualIdentity: "A containment ring around a darkness that photographs wrong.",
    codexEntryId: "codex-void-corruption",
    futureExpansionHooks: ["research-controlled-corruption"],
  },
  {
    nodeId: "afterlight-network",
    branch: "ancientTechnology",
    discipline: "xenoarchaeology",
    laboratoryId: "ancient-archive",
    lore: "The conduit was one strand. The Network is the loom — and it is still running.",
    gameplayUnlock: { kind: "newMissions", description: "The Afterlight Network — hidden campaign threads across precursor space open." },
    visualIdentity: "A galaxy map with gold threads where nothing was charted.",
    codexEntryId: "codex-ancient-custodians",
    futureExpansionHooks: ["research-network-awakening"],
  },
];

/** A roster entry binds identity ONLY — discipline, tier, laboratory, network
 * source, philosophy surface. No stat field exists (the AF-072→080 discipline). */
export interface ResearchRosterEntry {
  nodeId: string;
  discipline: ResearchRosterDiscipline;
  tier: ResearchTier;
  laboratory: RosterLaboratory;
  networkSource: DiscoveryNetworkSource;
  philosophySurface: ScientificPhilosophySurface;
}

export const RESEARCH_ROSTER_ENTRIES: readonly ResearchRosterEntry[] = [
  { nodeId: "focused-lattice", discipline: "weaponEngineering", tier: "foundation", laboratory: "engineeringInstitute", networkSource: "campaign", philosophySurface: "weaponBehaviours" },
  { nodeId: "coherent-beams", discipline: "weaponEngineering", tier: "applied", laboratory: "engineeringInstitute", networkSource: "bosses", philosophySurface: "weaponBehaviours" },
  { nodeId: "harmonic-overload", discipline: "prototypeScience", tier: "prototype", laboratory: "prototypeDivision", networkSource: "bosses", philosophySurface: "weaponBehaviours" },
  { nodeId: "field-dynamics", discipline: "energySystems", tier: "foundation", laboratory: "quantumLaboratory", networkSource: "scientificExpeditions", philosophySurface: "engineeringPossibilities" },
  { nodeId: "resonant-collectors", discipline: "energySystems", tier: "applied", laboratory: "quantumLaboratory", networkSource: "scientificExpeditions", philosophySurface: "engineeringPossibilities" },
  { nodeId: "survey-protocols", discipline: "planetaryEngineering", tier: "foundation", laboratory: "civilianDevelopmentBureau", networkSource: "exploration", philosophySurface: "explorationOpportunities" },
  { nodeId: "deep-scanning", discipline: "planetaryEngineering", tier: "applied", laboratory: "civilianDevelopmentBureau", networkSource: "exploration", philosophySurface: "explorationOpportunities" },
  { nodeId: "unified-theory", discipline: "experimentalPhysics", tier: "advanced", laboratory: "quantumLaboratory", networkSource: "campaign", philosophySurface: "newMechanics" },
  { nodeId: "rapid-refit", discipline: "civilianInfrastructure", tier: "foundation", laboratory: "civilianDevelopmentBureau", networkSource: "collections", philosophySurface: "alternativeBuilds" },
  { nodeId: "expanded-archives", discipline: "civilianInfrastructure", tier: "applied", laboratory: "ancientArchive", networkSource: "codex", philosophySurface: "explorationOpportunities" },
  { nodeId: "barrier-theory", discipline: "materialsScience", tier: "foundation", laboratory: "engineeringInstitute", networkSource: "collections", philosophySurface: "shipSystems" },
  { nodeId: "ancient-conduit", discipline: "ancientTechnology", tier: "ancient", laboratory: "ancientArchive", networkSource: "ancientArchives", philosophySurface: "newMechanics" },
  { nodeId: "warp-charting", discipline: "quantumScience", tier: "advanced", laboratory: "quantumLaboratory", networkSource: "exploration", philosophySurface: "explorationOpportunities" },
  { nodeId: "lattice-attunement", discipline: "crystalResonance", tier: "foundation", laboratory: "crystalResonanceCentre", networkSource: "biomes", philosophySurface: "newMechanics" },
  { nodeId: "drone-doctrine", discipline: "droneTechnology", tier: "foundation", laboratory: "artificialIntelligenceCentre", networkSource: "collections", philosophySurface: "alternativeBuilds" },
  { nodeId: "gene-tempering", discipline: "biologicalEngineering", tier: "applied", laboratory: "biologicalInstitute", networkSource: "biomes", philosophySurface: "commanderInteractions" },
  { nodeId: "void-containment", discipline: "voidStudies", tier: "experimental", laboratory: "voidObservatory", networkSource: "bosses", philosophySurface: "newMechanics" },
  { nodeId: "afterlight-network", discipline: "ancientTechnology", tier: "ancient", laboratory: "ancientArchive", networkSource: "ancientArchives", philosophySurface: "worldChanges" },
];

/** §Scientific Archive: all seven features DERIVED from data every project
 * already carries — the archive is a viewer, not a system. */
export function scientificArchiveFor(
  def: ResearchNodeDef,
  profile: ResearchProjectProfileDef,
  entry: ResearchRosterEntry,
): Record<ScientificArchiveFeature, string> {
  return {
    researchTimeline: `${entry.tier} tier · cost ${def.cost}`,
    technologyViewer: profile.visualIdentity,
    dependencyGraph: def.prerequisites.length > 0 ? `requires: ${def.prerequisites.join(", ")}` : "a root of the tree",
    scientificHistory: profile.lore,
    discoveryMap: `${entry.networkSource} → ${entry.laboratory}`,
    civilisationTimeline: profile.codexEntryId,
    futureResearchPreview: profile.futureExpansionHooks.join(", "),
  };
}

/** §Infinite Research — deterministic post-campaign projects riding AF-069's
 * REAL geometric research-cost engine; meaningful because every project names
 * its kind and the ladder never flattens. */
export function infiniteResearchProjectFor(n: number): { id: string; kind: InfiniteResearchKind; cost: number; description: string } {
  const kind = INFINITE_RESEARCH_KINDS[n % INFINITE_RESEARCH_KINDS.length]!;
  return {
    id: `infinite-research-${n}`,
    kind,
    cost: researchNodeCostFor(n),
    description: `Post-campaign ${kind} programme ${Math.floor(n / INFINITE_RESEARCH_KINDS.length) + 1}`,
  };
}
