/**
 * Galactic Economy Framework data shapes (AF-089). EXTENDS AF-025's
 * locked crafting resource shelf, AF-039's locked faction register,
 * AF-040's locked market engine (merchant kinds, economic events,
 * pricing), AF-085's locked political instruments, and AF-086's locked
 * civilisation simulation (population/industrialOutput/resourceReserves/
 * infrastructure/technology/economicPower) — none of their unions,
 * shapes, or engines are modified. AF-089 is the industrial substance
 * behind AF-086's economic attributes: seventeen resource categories map
 * nine onto AF-025's real ResourceType shelf and register eight honest
 * new stockpile registers; the eight-stage Production Chain is a closed
 * ring (the AF-086 life-cycle pattern, applied to goods instead of
 * civilisations); the eight Trade Network routes map TOTALLY onto
 * AF-040's real merchant kinds plus one of its own economic events; and
 * nine Galaxy Events reuse AF-085/086's REAL event/instrument
 * vocabularies wherever one already fits, authoring new deltas only for
 * the genuinely new four.
 */
import type { ResourceType } from "../crafting/craftingData";
import type { MerchantKind, EconomicEventKind } from "./economyData";
import type { GalacticEventKind } from "../factions/livingEcosystemData";
import type { PoliticalInstrument } from "../factions/factionFrameworkData";
import type { ExtendedAttributeKey } from "../factions/livingEcosystemData";

/** The 13-part Economy Architecture (AF-089 §Economy Architecture) —
 * nothing remains undefined. */
export const ECONOMY_ARCHITECTURE_PARTS = [
  "uniqueId",
  "civilisation",
  "production",
  "consumption",
  "storage",
  "tradeValue",
  "demand",
  "supply",
  "infrastructure",
  "population",
  "technology",
  "logistics",
  "futureExpansionHooks",
] as const;
export type EconomyArchitecturePart = (typeof ECONOMY_ARCHITECTURE_PARTS)[number];

/** How a spec resource category is realised — nine onto AF-025's REAL
 * ResourceType shelf, eight as new stockpile registers this module
 * introduces (still fully live within the colony simulation, just
 * outside AF-025's crafting pool). */
export type ResourceCategoryRealisation = { kind: "craftingResource"; resourceType: ResourceType } | { kind: "newRegister" };

/** The spec's seventeen resource categories (AF-089 §Resource Categories). */
export const GALACTIC_RESOURCE_CATEGORIES = [
  "rawMinerals",
  "refinedMetals",
  "energy",
  "fuel",
  "scientificMaterials",
  "biologicalResources",
  "crystalResources",
  "ancientTechnology",
  "prototypeComponents",
  "civilianGoods",
  "luxuryGoods",
  "constructionMaterials",
  "medicalSupplies",
  "food",
  "water",
  "quantumMaterials",
  "voidMatter",
] as const;
export type GalacticResourceCategory = (typeof GALACTIC_RESOURCE_CATEGORIES)[number];

export const RESOURCE_CATEGORY_REALISATION: Readonly<Record<GalacticResourceCategory, ResourceCategoryRealisation>> = {
  rawMinerals: { kind: "craftingResource", resourceType: "commonMaterials" },
  refinedMetals: { kind: "craftingResource", resourceType: "rareAlloys" },
  energy: { kind: "craftingResource", resourceType: "energyCells" },
  fuel: { kind: "newRegister" },
  scientificMaterials: { kind: "craftingResource", resourceType: "researchSamples" },
  biologicalResources: { kind: "newRegister" },
  crystalResources: { kind: "craftingResource", resourceType: "crystalFragments" },
  ancientTechnology: { kind: "craftingResource", resourceType: "ancientComponents" },
  prototypeComponents: { kind: "craftingResource", resourceType: "mythicMaterials" },
  civilianGoods: { kind: "newRegister" },
  luxuryGoods: { kind: "newRegister" },
  constructionMaterials: { kind: "newRegister" },
  medicalSupplies: { kind: "newRegister" },
  food: { kind: "newRegister" },
  water: { kind: "newRegister" },
  quantumMaterials: { kind: "craftingResource", resourceType: "quantumCores" },
  voidMatter: { kind: "craftingResource", resourceType: "voidEssence" },
};

/** The eight-stage Production Chain (AF-089 §Production Chains) — a
 * CLOSED RING (the AF-086 life-cycle pattern, applied to goods): Recovery
 * wraps back to Extraction, so every resource's origin is always
 * traceable and nothing is manufactured from nothing. */
export const PRODUCTION_CHAIN_STAGES = ["extraction", "transport", "refining", "manufacturing", "distribution", "consumption", "recycling", "recovery"] as const;
export type ProductionChainStage = (typeof PRODUCTION_CHAIN_STAGES)[number];

export function nextProductionStage(stage: ProductionChainStage): ProductionChainStage {
  const index = PRODUCTION_CHAIN_STAGES.indexOf(stage);
  return PRODUCTION_CHAIN_STAGES[(index + 1) % PRODUCTION_CHAIN_STAGES.length]!;
}

/** How much stockpile a category gains when its chain position reaches
 * Distribution (goods finally reach the colony) — authored, bounded. */
export const PRODUCTION_STAGE_YIELD: Readonly<Record<ProductionChainStage, number>> = {
  extraction: 0,
  transport: 0,
  refining: 0,
  manufacturing: 0,
  distribution: 4,
  consumption: 0,
  recycling: 0,
  recovery: 1, // recycling recovers a fraction back into the loop — never invented from nothing
};

/** How many epochs a category's chain position holds before being FORCED
 * to advance — "every resource has logical origins," and the chain never
 * stalls, mirroring AF-086's LIFECYCLE_MAX_EPOCHS_IN_PHASE exactly. */
export const PRODUCTION_CHAIN_MAX_EPOCHS_PER_STAGE = 2;

/** Trade Network routes (AF-089 §Trade Network) — eight, mapped TOTALLY
 * onto AF-040's real merchant-kind shelf, with one reaching into AF-040's
 * own economic-event vocabulary instead (Emergency Supply — a response,
 * not a standing merchant). Trade adapts dynamically without a second
 * merchant system. */
export type TradeRouteRealisation = { kind: "merchantKind"; merchantKind: MerchantKind } | { kind: "economicEvent"; eventKind: EconomicEventKind };

export const TRADE_NETWORK_ROUTES = [
  "civilianTrade",
  "militaryLogistics",
  "scientificExchange",
  "factionTrade",
  "emergencySupply",
  "explorationSupport",
  "ancientRecovery",
  "blackMarket",
] as const;
export type TradeNetworkRoute = (typeof TRADE_NETWORK_ROUTES)[number];

export const TRADE_ROUTE_REALISATION: Readonly<Record<TradeNetworkRoute, TradeRouteRealisation>> = {
  civilianTrade: { kind: "merchantKind", merchantKind: "galaxyTrader" },
  militaryLogistics: { kind: "merchantKind", merchantKind: "factionQuartermaster" },
  scientificExchange: { kind: "merchantKind", merchantKind: "researchSpecialist" },
  factionTrade: { kind: "merchantKind", merchantKind: "factionQuartermaster" },
  emergencySupply: { kind: "economicEvent", eventKind: "emergencySupplyMissions" },
  explorationSupport: { kind: "merchantKind", merchantKind: "nomadMerchant" },
  ancientRecovery: { kind: "merchantKind", merchantKind: "ancientArchivist" },
  blackMarket: { kind: "merchantKind", merchantKind: "blackMarketDealer" },
};

/** Colony attributes (AF-089 §Colonies) — nine, six realised onto AF-086's
 * REAL simulated attributes, three (Employment, Defence, Growth) new
 * per-colony registers this module introduces. Colonies evolve
 * independently because AF-086's simulation already ticks independently. */
export type ColonyAttributeRealisation = { kind: "civilisationAttribute"; attribute: ExtendedAttributeKey } | { kind: "newColonyRegister" };

export const COLONY_ATTRIBUTES = ["population", "employment", "industry", "infrastructure", "research", "military", "trade", "defence", "growth"] as const;
export type ColonyAttribute = (typeof COLONY_ATTRIBUTES)[number];

export const COLONY_ATTRIBUTE_REALISATION: Readonly<Record<ColonyAttribute, ColonyAttributeRealisation>> = {
  population: { kind: "civilisationAttribute", attribute: "population" },
  employment: { kind: "newColonyRegister" },
  industry: { kind: "civilisationAttribute", attribute: "industrialOutput" },
  infrastructure: { kind: "civilisationAttribute", attribute: "infrastructure" },
  research: { kind: "civilisationAttribute", attribute: "technology" },
  military: { kind: "civilisationAttribute", attribute: "militaryStrength" },
  trade: { kind: "civilisationAttribute", attribute: "economicPower" },
  defence: { kind: "newColonyRegister" },
  growth: { kind: "newColonyRegister" },
};

/** Galactic Industries (AF-089 §Industries) — ten, each with a primary
 * output category; industries define local economies. */
export const GALACTIC_INDUSTRIES = ["mining", "shipbuilding", "weapons", "engineering", "research", "agriculture", "energyProduction", "medicine", "construction", "exploration"] as const;
export type GalacticIndustry = (typeof GALACTIC_INDUSTRIES)[number];

export const INDUSTRY_PRIMARY_OUTPUT: Readonly<Record<GalacticIndustry, GalacticResourceCategory>> = {
  mining: "rawMinerals",
  shipbuilding: "refinedMetals",
  weapons: "refinedMetals",
  engineering: "constructionMaterials",
  research: "scientificMaterials",
  agriculture: "food",
  energyProduction: "energy",
  medicine: "medicalSupplies",
  construction: "constructionMaterials",
  exploration: "fuel",
};

/** Player Participation actions (AF-089 §Player Participation) — eight,
 * each BOUNDED — "player actions accelerate growth," the AF-086
 * "accelerate, never dictate" law applied to the economy. */
export const PLAYER_PARTICIPATION_ACTIONS = [
  "deliverResources",
  "fundColonies",
  "protectTrade",
  "recoverTechnology",
  "supplyResearch",
  "restoreInfrastructure",
  "openTradeRoutes",
  "investInDevelopment",
] as const;
export type PlayerParticipationAction = (typeof PLAYER_PARTICIPATION_ACTIONS)[number];

/** The hard cap on any single player-participation nudge in one epoch —
 * mirrors AF-086's PLAYER_IMPACT_MAX_DELTA exactly; no action can ever
 * fully dictate a colony's growth, however large the fed amount. */
export const PLAYER_PARTICIPATION_MAX_DELTA = 6;

/** Market price drivers (AF-089 §Market System) — eight, each naming the
 * live system that already produces the pressure. Markets remain
 * believable because every driver traces to something real. */
export interface PriceDriverDef {
  id: string;
  liveBinding: string;
}

export const MARKET_PRICE_DRIVERS: readonly PriceDriverDef[] = [
  { id: "supply", liveBinding: "this module's own colony stockpile levels" },
  { id: "demand", liveBinding: "this module's own colony consumption rate" },
  { id: "wars", liveBinding: "AF-086 CivilisationSimulationRuntime.activeWars" },
  { id: "research", liveBinding: "AF-024/081 unlocked research nodes" },
  { id: "naturalEvents", liveBinding: "this module's own Galaxy Economic Events" },
  { id: "factionPolitics", liveBinding: "AF-085 political instruments via AF-039's real relationship states" },
  { id: "playerInfluence", liveBinding: "feedPlayerParticipation, hard-capped exactly like AF-086" },
  { id: "galaxyEvents", liveBinding: "AF-086's GALACTIC_EVENTS, reused directly where applicable" },
];

/** How each Galaxy Economic Event is realised — six of nine reuse a REAL
 * AF-085/086 event or political instrument directly; four are genuinely
 * new and carry their own authored resource-category deltas (the
 * mission-modifier pattern, a seventh appearance). */
export type EconomyEventRealisation =
  | { kind: "civilisationEvent"; eventKind: GalacticEventKind }
  | { kind: "politicalInstrument"; instrument: PoliticalInstrument }
  | { kind: "authored"; deltas: Partial<Record<GalacticResourceCategory, number>> };

export const GALAXY_ECONOMIC_EVENTS = [
  "tradeBoom",
  "economicCollapse",
  "resourceDiscovery",
  "miningDisaster",
  "scientificRevolution",
  "supplyCrisis",
  "piracy",
  "tradeEmbargo",
  "industrialExpansion",
] as const;
export type GalaxyEconomicEvent = (typeof GALAXY_ECONOMIC_EVENTS)[number];

export interface GalaxyEconomicEventDef {
  kind: GalaxyEconomicEvent;
  weight: number;
  realisation: EconomyEventRealisation;
}

export const GALAXY_ECONOMIC_EVENT_DEFS: readonly GalaxyEconomicEventDef[] = [
  { kind: "tradeBoom", weight: 4, realisation: { kind: "civilisationEvent", eventKind: "tradeBooms" } },
  { kind: "economicCollapse", weight: 2, realisation: { kind: "civilisationEvent", eventKind: "economicCollapse" } },
  { kind: "resourceDiscovery", weight: 3, realisation: { kind: "authored", deltas: { rawMinerals: 8, crystalResources: 4 } } },
  { kind: "miningDisaster", weight: 2, realisation: { kind: "authored", deltas: { rawMinerals: -6, refinedMetals: -3 } } },
  { kind: "scientificRevolution", weight: 2, realisation: { kind: "civilisationEvent", eventKind: "scientificRenaissance" } },
  { kind: "supplyCrisis", weight: 2, realisation: { kind: "authored", deltas: { food: -5, water: -5, energy: -3 } } },
  { kind: "piracy", weight: 3, realisation: { kind: "civilisationEvent", eventKind: "pirateUprisings" } },
  { kind: "tradeEmbargo", weight: 1, realisation: { kind: "politicalInstrument", instrument: "embargoes" } },
  { kind: "industrialExpansion", weight: 2, realisation: { kind: "authored", deltas: { refinedMetals: 5, constructionMaterials: 5 } } },
];

/** Infrastructure kinds (AF-089 §Infrastructure) — eight, with a live/future
 * honesty flag; infrastructure permanently changes the galaxy once built. */
export interface InfrastructureKindDef {
  id: string;
  liveBinding: string;
  live: boolean;
}

export const INFRASTRUCTURE_KINDS: readonly InfrastructureKindDef[] = [
  { id: "stations", liveBinding: "this module's own colony infrastructure set", live: true },
  { id: "shipyards", liveBinding: "AF-074/080 fleet roster — ships are built somewhere", live: true },
  { id: "researchCentres", liveBinding: "AF-082 RESEARCH_LABORATORIES register", live: true },
  { id: "tradeHubs", liveBinding: "AF-040 merchant register, colony-hosted", live: true },
  { id: "miningFacilities", liveBinding: "this module's own colony industry assignment", live: true },
  { id: "orbitalElevators", liveBinding: "registered future — no orbital-logistics system yet", live: false },
  { id: "energyNetworks", liveBinding: "this module's own energy stockpile + production chain", live: true },
  { id: "communicationArrays", liveBinding: "registered future — no comms/relay system yet", live: false },
];

/** The bounded cost (in restoreInfrastructure/investInDevelopment player
 * participation) to construct one infrastructure kind — a threshold,
 * never a currency spend (AF-040's documented spend-path limitation). */
export const INFRASTRUCTURE_BUILD_THRESHOLD = 20;

/** Economy reward kinds (AF-089 §Rewards) — eight, realised onto real
 * systems or honestly future; prosperity creates opportunity, never a
 * new acquisition pipeline. */
export type EconomyRewardRealisation = { kind: "existingReference"; binding: string } | { kind: "future" };

export const ECONOMY_REWARD_KINDS = ["blueprints", "ships", "weapons", "modules", "research", "commanderOpportunities", "rareResources", "legendaryProjects"] as const;
export type EconomyRewardKind = (typeof ECONOMY_REWARD_KINDS)[number];

export const ECONOMY_REWARD_REALISATION: Readonly<Record<EconomyRewardKind, EconomyRewardRealisation>> = {
  blueprints: { kind: "existingReference", binding: "AF-040 MerchantOfferReward.blueprint" },
  ships: { kind: "existingReference", binding: "AF-040 MerchantOfferReward.ship (registered future consumer)" },
  weapons: { kind: "existingReference", binding: "AF-040 MerchantOfferReward.weapon (registered future consumer)" },
  modules: { kind: "existingReference", binding: "AF-040 MerchantOfferReward.equipment (registered future consumer)" },
  research: { kind: "existingReference", binding: "AF-040 MerchantOfferReward.researchPoints — live" },
  commanderOpportunities: { kind: "existingReference", binding: "AF-072 RECRUITMENT_TABLE" },
  rareResources: { kind: "existingReference", binding: "AF-040 MerchantOfferReward.resource — live" },
  legendaryProjects: { kind: "existingReference", binding: "AF-082 infiniteResearchProjectFor" },
};

/** Forbidden outcomes (AF-089 §Balance Principles) — registered BY NAME. */
export const ECONOMY_FORBIDDEN_OUTCOMES = ["repetitiveGrinding", "inflationDrivenProgression"] as const;

/** Accessibility surfaces (AF-089 §Accessibility) — eight registered. */
export const ECONOMY_ACCESSIBILITY_SURFACES = ["tradeOverview", "marketTrends", "resourceSearch", "comparisonMode", "largeUI", "controllerNavigation", "touchNavigation", "colourBlindSupport"] as const;

/** Performance disciplines (AF-089 §Performance) — four registered. */
export const ECONOMY_PERFORMANCE_DISCIPLINES = ["cacheMarketCalculations", "updateDistantEconomiesAsynchronously", "optimiseLogisticsSimulation", "poolEconomicEvents"] as const;
