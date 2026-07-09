/**
 * Research Framework data shapes (AF-081). EXTENDS AF-024's locked
 * research system — `ResearchNodeDef`, the category and node-type
 * shelves, and the `ResearchTree` engine (validation, gating, hidden
 * discoveries, reset-with-refund) are untouched. AF-081 wraps each
 * PROJECT in a PROFILE (the AF-071→079 pattern): fifteen primary and ten
 * secondary branches map TOTALLY onto AF-024's fifteen categories, with
 * a three-layer binding law (profile branch → category → the node's own
 * category, exact); every project proves twelve architecture parts;
 * RESEARCH TIME honours DR-005 (unlocks are instant, permanently — the
 * part is compliance, asserted as `completionTimeMs === 0`); and the
 * module's law — research NEVER simply increases statistics — lands as
 * an unrepresentable shape: `gameplayUnlock` is a kind and a description
 * with NO numeric field, mandatory on every profiled project.
 */
import type { ResearchCategory, ResearchNodeDef } from "./researchData";
import { SANDBOX_RESEARCH_TREE } from "./researchData";

/** Primary research branches (AF-081 §Primary Research Branches) — fifteen,
 * mapped totally onto AF-024's category shelf. */
export const PRIMARY_RESEARCH_BRANCHES = [
  "shipEngineering",
  "weaponEngineering",
  "commanderTraining",
  "energySystems",
  "materialsScience",
  "artificialIntelligence",
  "quantumPhysics",
  "voidStudies",
  "crystalResonance",
  "droneTechnology",
  "medicalScience",
  "industrialSystems",
  "civilianDevelopment",
  "ancientTechnology",
  "experimentalScience",
] as const;
export type PrimaryResearchBranch = (typeof PRIMARY_RESEARCH_BRANCHES)[number];

export const PRIMARY_BRANCH_TO_CATEGORY: Readonly<Record<PrimaryResearchBranch, ResearchCategory>> = {
  shipEngineering: "shipEngineering",
  weaponEngineering: "weaponTechnology",
  commanderTraining: "commanderDevelopment",
  energySystems: "energySystems",
  materialsScience: "shieldTechnology", // barrier lattices are materials science
  artificialIntelligence: "automation",
  quantumPhysics: "voidResearch", // quantum physics lives at the Zone's edge in this canon
  voidStudies: "voidResearch",
  crystalResonance: "crystalResonance",
  droneTechnology: "droneEngineering",
  medicalScience: "qualityOfLife",
  industrialSystems: "crafting",
  civilianDevelopment: "qualityOfLife",
  ancientTechnology: "ancientTechnology",
  experimentalScience: "orbitalTechnology", // experiments too dangerous for a hull run on platforms
};

/** Secondary research branches (AF-081 §Secondary Branches) — ten, likewise total. */
export const SECONDARY_RESEARCH_BRANCHES = [
  "efficiency",
  "exploration",
  "crafting",
  "scanning",
  "navigation",
  "mining",
  "logistics",
  "trade",
  "communications",
  "researchInfrastructure",
] as const;
export type SecondaryResearchBranch = (typeof SECONDARY_RESEARCH_BRANCHES)[number];

export const SECONDARY_BRANCH_TO_CATEGORY: Readonly<Record<SecondaryResearchBranch, ResearchCategory>> = {
  efficiency: "qualityOfLife",
  exploration: "exploration",
  crafting: "crafting",
  scanning: "exploration",
  navigation: "galaxyNavigation",
  mining: "crafting",
  logistics: "qualityOfLife",
  trade: "qualityOfLife",
  communications: "galaxyNavigation",
  researchInfrastructure: "qualityOfLife",
};

export type ResearchBranch = PrimaryResearchBranch | SecondaryResearchBranch;

/** Resolve any branch — primary or secondary — to its AF-024 category. */
export function categoryForBranch(branch: ResearchBranch): ResearchCategory {
  return (PRIMARY_BRANCH_TO_CATEGORY as Record<string, ResearchCategory>)[branch] ?? SECONDARY_BRANCH_TO_CATEGORY[branch as SecondaryResearchBranch];
}

/** The 12-part research architecture (AF-081 §Research Architecture). */
export const RESEARCH_ARCHITECTURE_PARTS = [
  "uniqueId",
  "researchBranch",
  "scientificDiscipline",
  "lore",
  "requirements",
  "researchCost",
  "researchTime",
  "scientificDependencies",
  "gameplayUnlock",
  "visualIdentity",
  "codexEntry",
  "futureExpansionHooks",
] as const;
export type ResearchArchitecturePart = (typeof RESEARCH_ARCHITECTURE_PARTS)[number];

/** Scientific disciplines (AF-081 §Research Architecture) — ten registered. */
export const SCIENTIFIC_DISCIPLINES = [
  "appliedPhysics",
  "energeticEngineering",
  "xenoarchaeology",
  "quantumMechanics",
  "materialsChemistry",
  "biologicalScience",
  "computationalScience",
  "voidPhenomenology",
  "harmonicResonance",
  "fieldCartography",
] as const;
export type ScientificDiscipline = (typeof SCIENTIFIC_DISCIPLINES)[number];

/** Gameplay unlock kinds (AF-081 §Research Progression) — eight registered;
 * progression remains horizontal. */
export const RESEARCH_UNLOCK_KINDS = [
  "newWeapons",
  "newShips",
  "newEquipment",
  "newModules",
  "newMissions",
  "newEvents",
  "newTechnologies",
  "newBiomes",
] as const;
export type ResearchUnlockKind = (typeof RESEARCH_UNLOCK_KINDS)[number];

/** Major discovery kinds (AF-081 §Scientific Discoveries) — seven registered. */
export const MAJOR_DISCOVERY_KINDS = ["ancientTechnologies", "prototypeSystems", "experimentalEquipment", "factionCooperation", "civilianUpgrades", "galaxyProjects", "legendaryMissions"] as const;

/** Research laboratories (AF-081 §Research Laboratories) — eight, each with
 * an authored specialisation ("each laboratory specialises differently"). */
export interface ResearchLaboratoryDef {
  id: string;
  name: string;
  specialisation: string;
}

export const RESEARCH_LABORATORIES: readonly ResearchLaboratoryDef[] = [
  { id: "engineering-labs", name: "Engineering Labs", specialisation: "Weapons, hulls, and anything that must survive being fired or fired upon." },
  { id: "biological-labs", name: "Biological Labs", specialisation: "The Ecospheres' living machinery, studied without becoming part of it." },
  { id: "quantum-labs", name: "Quantum Labs", specialisation: "Field dynamics, warp charting, and mathematics that argues back." },
  { id: "void-research", name: "Void Research", specialisation: "Containment-first study of what the Legion left running." },
  { id: "crystal-studies", name: "Crystal Studies", specialisation: "Lattice harmonics — tuning the shard-song instead of silencing it." },
  { id: "prototype-division", name: "Prototype Division", specialisation: "Overdrive states and instabilities, documented by surviving them." },
  { id: "ancient-archive", name: "Ancient Archive", specialisation: "Precursor records read slowly, translated twice, trusted once." },
  { id: "civilian-research", name: "Civilian Research", specialisation: "Surveying, logistics, refit doctrine — the science of coming home." },
];

/** Research resources (AF-081 §Research Resources) — seven registered;
 * research points are LIVE (AF-024's real economy), the rest are registered
 * awaiting their producing systems (the biomeId pattern). */
export interface ResearchResourceDef {
  id: string;
  identity: string;
  live: boolean;
}

export const RESEARCH_RESOURCES: readonly ResearchResourceDef[] = [
  { id: "researchPoints", identity: "The universal currency of understanding — AF-024's real point economy.", live: true },
  { id: "scientificData", identity: "Raw telemetry that becomes knowledge only when someone asks it a question.", live: false },
  { id: "ancientRecords", identity: "Precursor writings; the Archive pays in translation time.", live: false },
  { id: "experimentalSamples", identity: "Materials that behave — briefly — and must be studied before they stop.", live: false },
  { id: "prototypeComponents", identity: "Parts of things that were never mass-produced, for good reasons.", live: false },
  { id: "factionKnowledge", identity: "What civilisations will teach, once trust is earned.", live: false },
  { id: "legendaryDiscoveries", identity: "Findings so singular the discovery IS the resource.", live: false },
];

/** Discovery routes (AF-081 §Discovery System) — seven, each with an
 * authored identity; knowledge becomes gameplay. */
export interface DiscoveryRouteDef {
  id: string;
  identity: string;
}

export const DISCOVERY_ROUTES: readonly DiscoveryRouteDef[] = [
  { id: "exploration", identity: "Every system visited is a page turned." },
  { id: "bosses", identity: "Guardians keep secrets; defeating one is a citation." },
  { id: "missions", identity: "Fieldwork with objectives — science under fire." },
  { id: "codexCompletion", identity: "The codex read back becomes the codex understood." },
  { id: "collections", identity: "A complete shelf teaches what a single find cannot." },
  { id: "ancientArchives", identity: "The precursors wrote everything down. Finding it is the research." },
  { id: "scientificExpeditions", identity: "Voyages whose cargo manifest reads 'questions'." },
];

/** Synergy surfaces (AF-081 §Research Synergy) — eight registered. */
export const RESEARCH_SYNERGY_SURFACES = ["ships", "weapons", "commanders", "equipment", "relics", "campaign", "galaxyState", "worldEvents"] as const;

/** Visual presentation features (AF-081 §Visual Presentation) — six registered. */
export const RESEARCH_PRESENTATION_FEATURES = ["interactiveTechnologyTrees", "scientificTimeline", "dependencyMaps", "discoveryHistory", "researchStatistics", "futureBranchPreview"] as const;

/** Forbidden balance outcomes (AF-081 §Balance Principles) — registered BY NAME. */
export const RESEARCH_FORBIDDEN_OUTCOMES = ["mandatoryGrinding", "numericalInflation"] as const;

/** Accessibility surfaces (AF-081 §Accessibility) — eight registered. */
export const RESEARCH_ACCESSIBILITY_SURFACES = ["search", "filters", "dependencyHighlights", "recommendedProjects", "largeUI", "controllerNavigation", "touchNavigation", "colourBlindSupport"] as const;

/** THE LAW: a gameplay unlock is a KIND and a DESCRIPTION — no numeric field
 * exists, so "research that simply increases statistics" is unrepresentable
 * at the profile layer. */
export interface ResearchGameplayUnlock {
  kind: ResearchUnlockKind;
  description: string;
}

/** The AF-081 profile — wraps an AF-024 ResearchNodeDef by id; the def and
 * the engine are never modified. */
export interface ResearchProjectProfileDef {
  nodeId: string;
  branch: ResearchBranch;
  discipline: ScientificDiscipline;
  laboratoryId: string;
  lore: string;
  gameplayUnlock: ResearchGameplayUnlock;
  visualIdentity: string;
  codexEntryId: string;
  futureExpansionHooks: readonly string[];
}

/** AF-081's tree addition — the first crystalResonance project, and a project
 * with NO numeric effect at all: its entire meaning is the gameplay unlock. */
export const LATTICE_ATTUNEMENT: ResearchNodeDef = {
  id: "lattice-attunement",
  name: "Lattice Attunement",
  category: "crystalResonance",
  tier: 1,
  cost: 5,
  completionTimeMs: 0, // DR-005: unlocks are instant, permanently
  prerequisites: [],
  nodeType: "newMechanic",
  hidden: false,
  effect: null, // the breakthrough is gameplay, not a number — literally
};

/** The framework tree — AF-024's fourteen head the array unchanged. */
export const FRAMEWORK_RESEARCH_TREE: readonly ResearchNodeDef[] = [...SANDBOX_RESEARCH_TREE, LATTICE_ATTUNEMENT];

export const RESEARCH_PROJECT_PROFILES: readonly ResearchProjectProfileDef[] = [
  {
    nodeId: "focused-lattice",
    branch: "weaponEngineering",
    discipline: "appliedPhysics",
    laboratoryId: "engineering-labs",
    lore: "The first rediscovery: pre-Collapse focusing arrays, reverse-engineered from a museum piece.",
    gameplayUnlock: { kind: "newTechnologies", description: "Focused emitter doctrine — the foundation every weapon line builds on." },
    visualIdentity: "A brass-ringed lens assembly over draft schematics.",
    codexEntryId: "codex-weapon-coil-ripper",
    futureExpansionHooks: ["research-focused-lattice-mk2"],
  },
  {
    nodeId: "coherent-beams",
    branch: "weaponEngineering",
    discipline: "appliedPhysics",
    laboratoryId: "engineering-labs",
    lore: "Coherence was never lost — the tolerances were. The labs ground them back one interferometer at a time.",
    gameplayUnlock: { kind: "newTechnologies", description: "Coherent beam doctrine — sustained-fire weapon lines become viable." },
    visualIdentity: "A beam split across a table of mirrors, one path glowing.",
    codexEntryId: "codex-weapon-coil-ripper",
    futureExpansionHooks: ["research-beam-recycling"],
  },
  {
    nodeId: "harmonic-overload",
    branch: "weaponEngineering",
    discipline: "harmonicResonance",
    laboratoryId: "prototype-division",
    lore: "The Division's proudest surviving notebook: how to overdrive an emitter and keep the emitter.",
    gameplayUnlock: { kind: "newTechnologies", description: "Overload firing states — weapons gain deliberate overdrive mechanics." },
    visualIdentity: "An emitter housing glowing past its rating, gauges pinned.",
    codexEntryId: "codex-paragon-protocol",
    futureExpansionHooks: ["research-stable-overload"],
  },
  {
    nodeId: "field-dynamics",
    branch: "energySystems",
    discipline: "quantumMechanics",
    laboratoryId: "quantum-labs",
    lore: "Fields can be shaped. The mathematics argued; the collectors won.",
    gameplayUnlock: { kind: "newTechnologies", description: "Shaped-field collection — magnetics become an engineering surface." },
    visualIdentity: "Iron filings drawing a field that is not quite symmetrical.",
    codexEntryId: "codex-resource-crystal-fragments",
    futureExpansionHooks: ["research-field-projection"],
  },
  {
    nodeId: "resonant-collectors",
    branch: "energySystems",
    discipline: "energeticEngineering",
    laboratoryId: "quantum-labs",
    lore: "Tune the collector to the debris and the debris volunteers.",
    gameplayUnlock: { kind: "newTechnologies", description: "Resonant collection arrays — recovery at ranges that used to be losses." },
    visualIdentity: "A collector vane ringing like a struck glass.",
    codexEntryId: "codex-resource-crystal-fragments",
    futureExpansionHooks: ["research-harmonic-collection"],
  },
  {
    nodeId: "survey-protocols",
    branch: "exploration",
    discipline: "fieldCartography",
    laboratoryId: "civilian-research",
    lore: "The frontier was mapped once. The protocols are how it gets mapped again, carefully.",
    gameplayUnlock: { kind: "newMissions", description: "Survey doctrine — exploration objectives gain structure and reward." },
    visualIdentity: "A gridded chart with more annotations than territory.",
    codexEntryId: "codex-galaxy-history",
    futureExpansionHooks: ["research-deep-survey"],
  },
  {
    nodeId: "deep-scanning",
    branch: "scanning",
    discipline: "computationalScience",
    laboratoryId: "civilian-research",
    lore: "Look long enough at static and the static confesses.",
    gameplayUnlock: { kind: "newTechnologies", description: "Deep-scan layers — hidden features of known space become findable." },
    visualIdentity: "A waterfall display with one impossible line in it.",
    codexEntryId: "codex-galaxy-history",
    futureExpansionHooks: ["research-predictive-scanning"],
  },
  {
    nodeId: "unified-theory",
    branch: "ancientTechnology",
    discipline: "xenoarchaeology",
    laboratoryId: "quantum-labs",
    lore: "Two disciplines, one equation, and the uncomfortable discovery that the precursors wrote it first.",
    gameplayUnlock: { kind: "newTechnologies", description: "Cross-discipline synthesis — projects may draw on multiple branches at once." },
    visualIdentity: "Two schematic styles converging on one page.",
    codexEntryId: "codex-ancient-custodians",
    futureExpansionHooks: ["research-unified-applications"],
  },
  {
    nodeId: "rapid-refit",
    branch: "efficiency",
    discipline: "materialsChemistry",
    laboratoryId: "civilian-research",
    lore: "DR-005, in doctrine form: knowledge, once won, applies instantly and forever.",
    gameplayUnlock: { kind: "newEquipment", description: "Refit doctrine — loadout changes stop costing expedition time." },
    visualIdentity: "A hangar bay drawn as a pit-stop diagram.",
    codexEntryId: "codex-human-alliance",
    futureExpansionHooks: ["research-field-refit"],
  },
  {
    nodeId: "expanded-archives",
    branch: "researchInfrastructure",
    discipline: "computationalScience",
    laboratoryId: "ancient-archive",
    lore: "Shelving is a science. Ask anyone who has lost a breakthrough to a filing error.",
    gameplayUnlock: { kind: "newTechnologies", description: "Archive infrastructure — the codex and research cross-reference each other." },
    visualIdentity: "Stacks receding past the lamplight.",
    codexEntryId: "codex-human-alliance",
    futureExpansionHooks: ["research-living-index"],
  },
  {
    nodeId: "barrier-theory",
    branch: "materialsScience",
    discipline: "materialsChemistry",
    laboratoryId: "engineering-labs",
    lore: "A barrier is a material that has not been manufactured yet.",
    gameplayUnlock: { kind: "newModules", description: "Barrier lattice doctrine — shield module lines gain their theoretical basis." },
    visualIdentity: "A lattice diagram annotated in two hands, decades apart.",
    codexEntryId: "codex-equipment-hull-plating",
    futureExpansionHooks: ["research-adaptive-barriers"],
  },
  {
    nodeId: "ancient-conduit",
    branch: "ancientTechnology",
    discipline: "xenoarchaeology",
    laboratoryId: "ancient-archive",
    lore: "The conduit was not lost. It was filed under a word humanity had not rediscovered yet.",
    gameplayUnlock: { kind: "newTechnologies", description: "Precursor conduit integration — ancient systems accept human power." },
    visualIdentity: "White stone channelling light that arrives before the switch.",
    codexEntryId: "codex-ancient-security-doctrine",
    futureExpansionHooks: ["research-conduit-network"],
  },
  {
    nodeId: "warp-charting",
    branch: "navigation",
    discipline: "fieldCartography",
    laboratoryId: "quantum-labs",
    lore: "The lanes were always there. Charting them is the difference between travel and arrival.",
    gameplayUnlock: { kind: "newTechnologies", description: "Fast travel — charted lanes across the galaxy map (AF-038's real gate)." },
    visualIdentity: "A star chart with one confident line through it.",
    codexEntryId: "codex-research-warp-charting",
    futureExpansionHooks: ["research-lane-beacons"],
  },
  {
    nodeId: "lattice-attunement",
    branch: "crystalResonance",
    discipline: "harmonicResonance",
    laboratoryId: "crystal-studies",
    lore: "The Expanse sings whether or not anyone listens. Attunement is learning to answer.",
    gameplayUnlock: { kind: "newTechnologies", description: "Crystal attunement mechanics — resonance interactions open as a build surface." },
    visualIdentity: "A tuning fork of grown crystal, mid-note.",
    codexEntryId: "codex-technology-crystal-resonance",
    futureExpansionHooks: ["research-resonant-instruments"],
  },
];

/** "Every project should feel meaningful" as a function — all 12 parts must hold. */
export function researchArchitectureFor(
  def: ResearchNodeDef,
  profile: ResearchProjectProfileDef,
  knownIds: ReadonlySet<string>,
): Record<ResearchArchitecturePart, boolean> {
  return {
    uniqueId: def.id.length > 0,
    researchBranch: profile.branch.length > 0,
    scientificDiscipline: (SCIENTIFIC_DISCIPLINES as readonly string[]).includes(profile.discipline),
    lore: profile.lore.length > 0,
    requirements: def.cost > 0 || def.prerequisites.length > 0,
    researchCost: def.cost > 0,
    researchTime: def.completionTimeMs === 0, // DR-005: instant, permanently — compliance IS the part
    scientificDependencies: def.prerequisites.every((p) => knownIds.has(p)),
    gameplayUnlock: profile.gameplayUnlock.description.length > 0,
    visualIdentity: profile.visualIdentity.length > 0,
    codexEntry: profile.codexEntryId.length > 0,
    futureExpansionHooks: profile.futureExpansionHooks.length > 0,
  };
}

/** §Visual Presentation / §Debug: the dependency map is DERIVED from the tree. */
export function dependencyMapFor(defs: readonly ResearchNodeDef[]): Readonly<Record<string, readonly string[]>> {
  const map: Record<string, readonly string[]> = {};
  for (const def of defs) map[def.id] = def.prerequisites;
  return map;
}

/** §Debug: Research Efficiency — fraction of earned points converted to unlocks. */
export function researchEfficiencyFor(snapshot: { points: number; totalPointsEarned: number }): number {
  if (snapshot.totalPointsEarned <= 0) return 0;
  return (snapshot.totalPointsEarned - snapshot.points) / snapshot.totalPointsEarned;
}

/** §Debug: Scientific Progress — fraction of the tree unlocked. */
export function scientificProgressFor(unlockedCount: number, totalProjects: number): number {
  if (totalProjects <= 0) return 0;
  return unlockedCount / totalProjects;
}
