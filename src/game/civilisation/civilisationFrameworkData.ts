/**
 * Civilisation Framework data shapes (AF-090). EXTENDS AF-038's locked
 * galaxy systems, AF-039/085/086's locked faction/civilisation
 * simulation, AF-089's locked colony economy, and AF-024/082's locked
 * research tree — none of their unions, shapes, or engines are
 * modified. AF-090 gives the player's rebuilding effort a VISIBLE,
 * NAMED face: settlements sited at REAL AF-038 systems, developing
 * through a seven-stage LINEAR ladder (a monotone lattice — the
 * AF-077/079/084/087 pattern — never a closed ring, because Legendary
 * Status is a ceiling, not a phase to cycle past). Historical Timeline
 * reuses AF-086's `CivilisationSimulationRuntime.history` directly — a
 * fifth append-only ledger was never needed. Four of the eight Player
 * Investment actions delegate to AF-089's own real, bounded economy
 * methods; the other four are this module's own, capped identically.
 */
import type { FactionId } from "../factions/factionData";
import type { GalaxyRegion } from "../galaxy/galaxyData";
import type { GalacticIndustry } from "../economy/galacticEconomyData";
import type { PoliticalInstrument } from "../factions/factionFrameworkData";
import type { PrimaryCategory } from "../codex/codexFrameworkData";

/** The 13-part Civilisation Architecture (AF-090 §Civilisation Architecture)
 * — nothing remains undefined. */
export const CIVILISATION_ARCHITECTURE_PARTS = [
  "uniqueId",
  "name",
  "location",
  "faction",
  "population",
  "infrastructure",
  "technologyLevel",
  "economicOutput",
  "scientificOutput",
  "militaryPresence",
  "constructionProgress",
  "historicalTimeline",
  "futureExpansionHooks",
] as const;
export type CivilisationArchitecturePart = (typeof CIVILISATION_ARCHITECTURE_PARTS)[number];

/** Settlement types (AF-090 §Settlement Types) — ten, each realised onto
 * an EXISTING AF-089 infrastructure kind, an AF-089 industry, or an
 * AF-087 primary category. No new content register invented for the
 * realisation itself — only the settlement wrapper is new. */
export type SettlementTypeRealisation =
  | { kind: "infrastructure"; infraId: string }
  | { kind: "industry"; industry: GalacticIndustry }
  | { kind: "primaryCategory"; category: PrimaryCategory };

export const SETTLEMENT_TYPES = [
  "researchOutposts",
  "miningColonies",
  "tradeStations",
  "industrialCities",
  "orbitalHabitats",
  "agriculturalWorlds",
  "militaryBases",
  "shipyards",
  "scientificAcademies",
  "ancientRestorationSites",
] as const;
export type SettlementType = (typeof SETTLEMENT_TYPES)[number];

export const SETTLEMENT_TYPE_REALISATION: Readonly<Record<SettlementType, SettlementTypeRealisation>> = {
  researchOutposts: { kind: "infrastructure", infraId: "researchCentres" },
  miningColonies: { kind: "infrastructure", infraId: "miningFacilities" },
  tradeStations: { kind: "infrastructure", infraId: "tradeHubs" },
  industrialCities: { kind: "industry", industry: "construction" },
  orbitalHabitats: { kind: "infrastructure", infraId: "stations" },
  agriculturalWorlds: { kind: "industry", industry: "agriculture" },
  militaryBases: { kind: "industry", industry: "weapons" },
  shipyards: { kind: "infrastructure", infraId: "shipyards" },
  scientificAcademies: { kind: "infrastructure", infraId: "researchCentres" },
  ancientRestorationSites: { kind: "primaryCategory", category: "ancientTechnology" },
};

/** Population statistics (AF-090 §Population System) — ten; three
 * realise onto AF-086/089's real simulated registers, seven are new
 * per-settlement stats this module introduces. Population evolves
 * naturally because most of its drivers already tick elsewhere. */
export type PopulationStatRealisation = { kind: "civilisationAttribute" } | { kind: "colonyRegister" } | { kind: "newSettlementRegister" };

export const POPULATION_STATS = ["population", "growth", "employment", "education", "health", "security", "scientificWorkforce", "industrialWorkforce", "militaryPersonnel", "civilianHappiness"] as const;
export type PopulationStat = (typeof POPULATION_STATS)[number];

export const POPULATION_STAT_REALISATION: Readonly<Record<PopulationStat, PopulationStatRealisation>> = {
  population: { kind: "civilisationAttribute" }, // AF-086's real population attribute
  growth: { kind: "colonyRegister" }, // AF-089's real colony.growth
  employment: { kind: "colonyRegister" }, // AF-089's real colony.employment
  education: { kind: "newSettlementRegister" },
  health: { kind: "newSettlementRegister" },
  security: { kind: "newSettlementRegister" },
  scientificWorkforce: { kind: "newSettlementRegister" },
  industrialWorkforce: { kind: "newSettlementRegister" },
  militaryPersonnel: { kind: "newSettlementRegister" },
  civilianHappiness: { kind: "newSettlementRegister" },
};

/** Settlement-scoped infrastructure upgrades (AF-090 §Infrastructure) —
 * ten; four reuse AF-089's real InfrastructureKindDef ids directly
 * (asserted by equality against the real shelf), six are genuinely new
 * — AF-089 tracks colony-wide (per-faction) infrastructure; this module
 * tracks it per NAMED settlement, a finer scope, never a duplicate one. */
export type SettlementInfrastructureRealisation = { kind: "sharedWithAf089"; infraId: string } | { kind: "newSettlementUpgrade" };

export const SETTLEMENT_INFRASTRUCTURE_UPGRADES = [
  "powerNetworks",
  "communicationArrays",
  "transportation",
  "orbitalElevators",
  "spaceports",
  "hospitals",
  "researchCentres",
  "manufacturing",
  "defenceSystems",
  "housing",
] as const;
export type SettlementInfrastructureUpgrade = (typeof SETTLEMENT_INFRASTRUCTURE_UPGRADES)[number];

export const SETTLEMENT_INFRASTRUCTURE_REALISATION: Readonly<Record<SettlementInfrastructureUpgrade, SettlementInfrastructureRealisation>> = {
  powerNetworks: { kind: "sharedWithAf089", infraId: "energyNetworks" },
  communicationArrays: { kind: "sharedWithAf089", infraId: "communicationArrays" },
  transportation: { kind: "newSettlementUpgrade" },
  orbitalElevators: { kind: "sharedWithAf089", infraId: "orbitalElevators" },
  spaceports: { kind: "newSettlementUpgrade" },
  hospitals: { kind: "newSettlementUpgrade" },
  researchCentres: { kind: "sharedWithAf089", infraId: "researchCentres" },
  manufacturing: { kind: "newSettlementUpgrade" },
  defenceSystems: { kind: "newSettlementUpgrade" },
  housing: { kind: "newSettlementUpgrade" },
};

/** Galaxy Restoration contribution routes (AF-090 §Galaxy Restoration) —
 * eight, each realised onto an EXISTING mechanism (AF-089's own bounded
 * actions, AF-038's exploration stat, or AF-085's political instruments).
 * "Every contribution is visible" because it always lands on a real,
 * already-observable system. */
export type RestorationRouteRealisation =
  | { kind: "economyAction"; action: string }
  | { kind: "existingReference"; binding: string }
  | { kind: "politicalInstrument"; instrument: PoliticalInstrument };

export const GALAXY_RESTORATION_ROUTES = ["resources", "research", "construction", "exploration", "technologyRecovery", "defence", "trade", "scientificCooperation"] as const;
export type GalaxyRestorationRoute = (typeof GALAXY_RESTORATION_ROUTES)[number];

export const RESTORATION_ROUTE_REALISATION: Readonly<Record<GalaxyRestorationRoute, RestorationRouteRealisation>> = {
  resources: { kind: "economyAction", action: "deliverResources" },
  research: { kind: "economyAction", action: "supplyResearch" },
  construction: { kind: "existingReference", binding: "this module's own investInSettlement" },
  exploration: { kind: "existingReference", binding: "AF-038 GalaxyRuntime per-system exploration stat" },
  technologyRecovery: { kind: "economyAction", action: "recoverTechnology" },
  defence: { kind: "economyAction", action: "protectTrade" },
  trade: { kind: "economyAction", action: "openTradeRoutes" },
  scientificCooperation: { kind: "politicalInstrument", instrument: "jointResearch" },
};

/** The seven-stage Colony Development ladder (AF-090 §Colony Development)
 * — a LINEAR MONOTONE LATTICE, never a ring: Legendary Status is a
 * ceiling, not a phase to cycle past. "Growth remains organic" — the
 * ladder only ever advances, the AF-077/079/084/087 discipline. */
export const SETTLEMENT_DEVELOPMENT_STAGES = ["founding", "expansion", "industrialisation", "scientificGrowth", "prosperity", "specialisation", "legendaryStatus"] as const;
export type SettlementDevelopmentStage = (typeof SETTLEMENT_DEVELOPMENT_STAGES)[number];

/** Construction-progress threshold a settlement must cross to advance
 * FROM this stage to the next — authored, ascending. */
export const DEVELOPMENT_STAGE_THRESHOLD: Readonly<Record<SettlementDevelopmentStage, number>> = {
  founding: 20,
  expansion: 40,
  industrialisation: 60,
  scientificGrowth: 75,
  prosperity: 88,
  specialisation: 96,
  legendaryStatus: Infinity, // the ceiling — nothing lies beyond it
};

/** Player Investment actions (AF-090 §Player Investment) — eight; four
 * DELEGATE to AF-089's own real, bounded economy methods (never a
 * second implementation of the same cap), four are this module's own,
 * capped identically. */
export type InvestmentActionRealisation = { kind: "delegatesToAf089"; method: string } | { kind: "newSettlementAction" };

export const PLAYER_INVESTMENT_ACTIONS = ["fundProjects", "assignResources", "deliverTechnology", "recruitScientists", "restoreAncientSystems", "upgradeInfrastructure", "protectConstruction", "influencePriorities"] as const;
export type PlayerInvestmentAction = (typeof PLAYER_INVESTMENT_ACTIONS)[number];

export const INVESTMENT_ACTION_REALISATION: Readonly<Record<PlayerInvestmentAction, InvestmentActionRealisation>> = {
  fundProjects: { kind: "delegatesToAf089", method: "fundColonies" },
  assignResources: { kind: "delegatesToAf089", method: "deliverResources" },
  deliverTechnology: { kind: "delegatesToAf089", method: "recoverTechnology" },
  recruitScientists: { kind: "newSettlementAction" },
  restoreAncientSystems: { kind: "newSettlementAction" },
  upgradeInfrastructure: { kind: "delegatesToAf089", method: "restoreInfrastructure" },
  protectConstruction: { kind: "newSettlementAction" },
  influencePriorities: { kind: "newSettlementAction" },
};

/** The bounded cap on every Player Investment action in one call — the
 * AF-086/089 "accelerate, never dictate" law, a third appearance. */
export const INVESTMENT_MAX_DELTA = 6;

/** Civilisation Specialisations (AF-090 §Civilisation Specialisation) —
 * ten, chosen once a settlement reaches the Specialisation stage. Each
 * carries a NON-NUMERIC-ONLY effect: a named population stat it favours
 * plus a description — "specialisation changes gameplay," not just a
 * bigger number. */
export const CIVILISATION_SPECIALISATIONS = ["science", "industry", "trade", "military", "exploration", "engineering", "agriculture", "ancientResearch", "energy", "diplomacy"] as const;
export type CivilisationSpecialisation = (typeof CIVILISATION_SPECIALISATIONS)[number];

export const SPECIALISATION_FAVOURED_STAT: Readonly<Record<CivilisationSpecialisation, PopulationStat>> = {
  science: "scientificWorkforce",
  industry: "industrialWorkforce",
  trade: "employment",
  military: "militaryPersonnel",
  exploration: "growth",
  engineering: "industrialWorkforce",
  agriculture: "health",
  ancientResearch: "scientificWorkforce",
  energy: "industrialWorkforce",
  diplomacy: "civilianHappiness",
};

/** World Evolution surfaces (AF-090 §World Evolution) — eight registered;
 * `worldEvolutionSummaryFor` derives a visible description per stage. */
export const WORLD_EVOLUTION_SURFACES = ["stations", "cities", "planetSurfaces", "tradeRoutes", "civilianTraffic", "defences", "research", "architecture"] as const;

/** Megastructures (AF-090 §Megastructures) — nine, each sited at a REAL
 * AF-038 GalaxyRegion, each with its own authored (large) threshold.
 * Afterlight Relays are gated on AF-024/082's REAL "afterlight-network"
 * research node — megastructures redefine sectors, not sandboxes. */
export interface MegastructureDef {
  id: string;
  name: string;
  region: GalaxyRegion;
  threshold: number;
  requiresResearchNodeId: string | null;
}

export const MEGASTRUCTURES: readonly MegastructureDef[] = [
  { id: "dyson-array-lucent", name: "Lucent Dyson Array", region: "crystalDominion", threshold: 400, requiresResearchNodeId: null },
  { id: "orbital-ring-frontier", name: "Frontier Orbital Ring", region: "humanFrontier", threshold: 350, requiresResearchNodeId: null },
  { id: "quantum-gate-axiom", name: "Axiom Quantum Gate", region: "singularityZone", threshold: 500, requiresResearchNodeId: "warp-charting" },
  { id: "planetary-shield-forge", name: "Forge Primus Planetary Shield", region: "machineExpanse", threshold: 380, requiresResearchNodeId: null },
  { id: "ancient-archive-first-light", name: "First Light Ancient Archive", region: "ancientCore", threshold: 420, requiresResearchNodeId: "ancient-conduit" },
  { id: "solar-harvester-cinderfall", name: "Cinderfall Solar Harvester", region: "solarWastes", threshold: 340, requiresResearchNodeId: null },
  { id: "research-megalab-verdance", name: "Verdance Research Megalab", region: "darkNebula", threshold: 360, requiresResearchNodeId: null },
  { id: "interstellar-highway-winterline", name: "Winterline Interstellar Highway", region: "frozenReach", threshold: 300, requiresResearchNodeId: null },
  { id: "afterlight-relay-prime", name: "Afterlight Relay Prime", region: "ancientCore", threshold: 600, requiresResearchNodeId: "afterlight-network" },
];

/** Galactic Projects (AF-090 §Galactic Projects) — seven, each realised
 * onto an existing system; the largest projects require long-term
 * effort, not a third construction-progress engine. */
export const GALACTIC_PROJECTS: readonly { id: string; binding: string }[] = [
  { id: "interstellarGateways", binding: "AF-024/082 warp-charting research node — fast travel is the gateway" },
  { id: "civilianFleets", binding: "AF-074/080 fleet roster" },
  { id: "planetaryRestoration", binding: "this module's own settlement development ladder" },
  { id: "ancientReactivation", binding: "AF-082 afterlight-network research node" },
  { id: "researchNetworks", binding: "AF-082 RESEARCH_LABORATORIES register" },
  { id: "fleetConstruction", binding: "AF-074/080 fleet roster, shipyards settlement type" },
  { id: "galaxyDefenceGrid", binding: "AF-089 colony defence register, aggregated across colonies" },
];

/** Civilisation reward kinds (AF-090 §Rewards) — eight, realised onto real
 * systems or honestly future. */
export type CivilisationRewardRealisation = { kind: "existingReference"; binding: string } | { kind: "future" };

export const CIVILISATION_REWARD_KINDS = ["newMissions", "commanders", "ships", "research", "blueprints", "tradeBonuses", "rareResources", "legendaryTechnologies"] as const;
export type CivilisationRewardKind = (typeof CIVILISATION_REWARD_KINDS)[number];

export const CIVILISATION_REWARD_REALISATION: Readonly<Record<CivilisationRewardKind, CivilisationRewardRealisation>> = {
  newMissions: { kind: "existingReference", binding: "AF-084 MISSION_CHAINS stage unlocks" },
  commanders: { kind: "existingReference", binding: "AF-072 RECRUITMENT_TABLE" },
  ships: { kind: "existingReference", binding: "AF-074/080 fleet roster" },
  research: { kind: "existingReference", binding: "AF-024/081 research points" },
  blueprints: { kind: "existingReference", binding: "AF-040 MerchantOfferReward.blueprint" },
  tradeBonuses: { kind: "existingReference", binding: "AF-089 marketPriceMultiplierFor" },
  rareResources: { kind: "existingReference", binding: "AF-040 MerchantOfferReward.resource" },
  legendaryTechnologies: { kind: "existingReference", binding: "AF-082 infiniteResearchProjectFor" },
};

/** Forbidden outcomes (AF-090 §Balance Principles) — registered BY NAME. */
export const CIVILISATION_FORBIDDEN_OUTCOMES = ["repetitiveGrinding", "mandatoryMicromanagement"] as const;

/** Accessibility surfaces (AF-090 §Accessibility) — eight registered. */
export const CIVILISATION_ACCESSIBILITY_SURFACES = ["developmentOverview", "constructionTimeline", "populationViewer", "largeUI", "controllerNavigation", "touchNavigation", "colourBlindSupport", "narrationReady"] as const;

/** Performance disciplines (AF-090 §Performance) — four registered. */
export const CIVILISATION_PERFORMANCE_DISCIPLINES = ["cacheCivilisationState", "optimiseConstructionSimulation", "updateDistantColoniesAsynchronously", "reuseInfrastructureAssets"] as const;

/** The AF-090 profile — one per seeded settlement; the 13-part
 * architecture's static fields (the dynamic ones — population,
 * infrastructure, construction — live on `SettlementState`). */
export interface SettlementProfileDef {
  settlementId: string;
  name: string;
  locationSystemId: string;
  factionId: FactionId;
  settlementType: SettlementType;
  futureExpansionHooks: readonly string[];
}

/** The seeded roster — six settlements, one per AF-085/086/089-profiled
 * civilisation, each at a REAL AF-038 system matching that faction's own
 * AF-039 territory exactly, each settlement type distinct — the EIGHTH
 * identity-uniqueness axis (AF-085's five + AF-086's sixth + AF-089's
 * seventh + this one). */
export const SEEDED_SETTLEMENTS: readonly SettlementProfileDef[] = [
  { settlementId: "settlement-lucent-gate", name: "Lucent Gate Resonance Mines", locationSystemId: "sys-lucent-gate", factionId: "crystalDominion", settlementType: "miningColonies", futureExpansionHooks: ["settlement-lucent-gate-expansion"] },
  { settlementId: "settlement-forge-primus", name: "Forge Primus Foundries", locationSystemId: "sys-forge-primus", factionId: "machineCollective", settlementType: "industrialCities", futureExpansionHooks: ["settlement-forge-primus-expansion"] },
  { settlementId: "settlement-meridian-rest", name: "Meridian Rest Shipyards", locationSystemId: "sys-meridian-rest", factionId: "humanAlliance", settlementType: "shipyards", futureExpansionHooks: ["settlement-meridian-rest-expansion"] },
  { settlementId: "settlement-gravewake", name: "Gravewake Garrison", locationSystemId: "sys-gravewake", factionId: "mercenaryGuild", settlementType: "militaryBases", futureExpansionHooks: ["settlement-gravewake-expansion"] },
  { settlementId: "settlement-first-light", name: "First Light Restoration Site", locationSystemId: "sys-first-light", factionId: "ancientCustodians", settlementType: "ancientRestorationSites", futureExpansionHooks: ["settlement-first-light-expansion"] },
  { settlementId: "settlement-verdance", name: "Verdance Habitat Ring", locationSystemId: "sys-verdance", factionId: "nomadFleet", settlementType: "orbitalHabitats", futureExpansionHooks: ["settlement-verdance-expansion"] },
];
