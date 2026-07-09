/**
 * Living Faction Ecosystem data shapes (AF-086). EXTENDS AF-039's locked
 * faction engine and AF-085's locked profile architecture — `FactionDef`,
 * `FACTION_ATTRIBUTE_KINDS`, `CONFLICT_STATES`, `FactionRuntime`, and
 * `FactionProfileDef` are untouched. AF-039 registered ten faction
 * attributes as its own recorded content debt ("influence,
 * militaryStrength, technology, economicPower, stability, exploration,
 * aggression, trust, corruption, expansion") without ever ticking them —
 * AF-086 is the FIRST module to give them real, continuously-simulated
 * numeric state. Four spec model parts (Population, Industrial Output,
 * Resource Reserves, Infrastructure) have no AF-039 home and become
 * NEW live registers; Territory reuses AF-038's GalaxyRegion via
 * `FactionDef.territory` unchanged; Historical Events is this module's
 * own permanent, append-only timeline. The eight-phase life cycle is a
 * closed ring (Transformation wraps back to Expansion) that always
 * advances — no civilisation remains unchanged forever, provably. The
 * nine inter-faction relationship kinds map TOTALLY onto AF-039's eight
 * conflict states; scientific priorities map onto AF-082's fifteen
 * roster disciplines and extend AF-085's identity-uniqueness law with a
 * sixth axis. The Galactic Council is honestly registered without a
 * voting system — the spec's own words ("future voting systems extend
 * naturally").
 */
import type { FactionAttributeKind, ConflictState, FactionEventKind, FactionId } from "./factionData";
import type { ResearchRosterDiscipline } from "../research/researchRosterData";

/** The 12-part Civilisation Model (AF-086 §Galactic Civilisation Model) —
 * nothing remains static. */
export const CIVILISATION_MODEL_PARTS = [
  "population",
  "scientificProgress",
  "militaryStrength",
  "industrialOutput",
  "tradeWealth",
  "politicalStability",
  "territory",
  "resourceReserves",
  "infrastructure",
  "diplomaticInfluence",
  "historicalEvents",
  "futureExpansionHooks",
] as const;
export type CivilisationModelPart = (typeof CIVILISATION_MODEL_PARTS)[number];

/** How each model part is realised: an existing AF-039 attribute, a NEW
 * live register this module introduces, or an existing content reference. */
export type ModelPartRealisation =
  | { kind: "factionAttribute"; attribute: FactionAttributeKind }
  | { kind: "newLiveRegister"; field: ExtendedAttributeKey }
  | { kind: "existingReference"; binding: string };

export const MODEL_PART_REALISATION: Readonly<Record<CivilisationModelPart, ModelPartRealisation>> = {
  population: { kind: "newLiveRegister", field: "population" },
  scientificProgress: { kind: "factionAttribute", attribute: "technology" },
  militaryStrength: { kind: "factionAttribute", attribute: "militaryStrength" },
  industrialOutput: { kind: "newLiveRegister", field: "industrialOutput" },
  tradeWealth: { kind: "factionAttribute", attribute: "economicPower" },
  politicalStability: { kind: "factionAttribute", attribute: "stability" },
  territory: { kind: "existingReference", binding: "AF-038 GalaxyRegion via FactionDef.territory" },
  resourceReserves: { kind: "newLiveRegister", field: "resourceReserves" },
  infrastructure: { kind: "newLiveRegister", field: "infrastructure" },
  diplomaticInfluence: { kind: "factionAttribute", attribute: "influence" },
  historicalEvents: { kind: "existingReference", binding: "this module's own GalacticHistoryRuntime" },
  futureExpansionHooks: { kind: "existingReference", binding: "CivilisationProfileDef.futureExpansionHooks" },
};

/** The four NEW numeric registers this module introduces — no AF-039 home existed. */
export const NEW_CIVILISATION_REGISTERS = ["population", "industrialOutput", "resourceReserves", "infrastructure"] as const;
export type NewCivilisationRegister = (typeof NEW_CIVILISATION_REGISTERS)[number];

/** Every simulated numeric key — AF-039's ten attributes plus the four new registers. */
export type ExtendedAttributeKey = FactionAttributeKind | NewCivilisationRegister;

export const ATTRIBUTE_MIN = 0;
export const ATTRIBUTE_MAX = 100;

/** The eight-phase Faction Life Cycle (AF-086 §Faction Life Cycle) — a
 * CLOSED RING; Transformation wraps back to Expansion. */
export const FACTION_LIFECYCLE_PHASES = ["expansion", "prosperity", "conflict", "recovery", "innovation", "politicalChange", "renewal", "transformation"] as const;
export type FactionLifecyclePhase = (typeof FACTION_LIFECYCLE_PHASES)[number];

export function nextLifecyclePhase(phase: FactionLifecyclePhase): FactionLifecyclePhase {
  const index = FACTION_LIFECYCLE_PHASES.indexOf(phase);
  return FACTION_LIFECYCLE_PHASES[(index + 1) % FACTION_LIFECYCLE_PHASES.length]!;
}

/** Authored per-phase attribute bias — small, bounded, applied once per
 * epoch. Every phase touches at least one register, so no phase is a
 * no-op tick ("nothing remains static"). */
export const LIFECYCLE_PHASE_BIAS: Readonly<Record<FactionLifecyclePhase, Partial<Record<ExtendedAttributeKey, number>>>> = {
  expansion: { population: 3, expansion: 4 },
  prosperity: { economicPower: 3, industrialOutput: 2, stability: 1 },
  conflict: { militaryStrength: 3, aggression: 4, stability: -3, population: -1 },
  recovery: { stability: 4, resourceReserves: 2, population: 1 },
  innovation: { technology: 4, infrastructure: 2 },
  politicalChange: { influence: 3, corruption: -2, trust: 2 },
  renewal: { infrastructure: 3, resourceReserves: 2, stability: 1 },
  transformation: { expansion: 2, technology: 1, influence: 1 },
};

/** How many epochs a faction spends in a phase before it is FORCED to
 * advance — the guarantee that no civilisation remains unchanged forever. */
export const LIFECYCLE_MAX_EPOCHS_IN_PHASE = 4;

/** Diplomatic AI factors (AF-086 §Diplomatic AI) — eight, weighted into one score. */
export const DIPLOMATIC_AI_FACTORS = [
  "resourceNeeds",
  "militaryThreats",
  "scientificOpportunity",
  "territorialExpansion",
  "historicRelationships",
  "playerReputation",
  "ancientDiscoveries",
  "galaxyEvents",
] as const;
export type DiplomaticAiFactor = (typeof DIPLOMATIC_AI_FACTORS)[number];

/** Inter-faction relationship kinds (AF-086 §Inter-Faction Relationships) —
 * nine, mapped TOTALLY onto AF-039's eight conflict states. */
export const INTER_FACTION_RELATIONSHIP_KINDS = [
  "militaryAlliances",
  "scientificPartnerships",
  "commercialAgreements",
  "explorationTreaties",
  "technologyExchange",
  "politicalRivalries",
  "coldWars",
  "openConflict",
  "neutralCooperation",
] as const;
export type InterFactionRelationshipKind = (typeof INTER_FACTION_RELATIONSHIP_KINDS)[number];

export const RELATIONSHIP_KIND_TO_CONFLICT_STATE: Readonly<Record<InterFactionRelationshipKind, ConflictState>> = {
  militaryAlliances: "alliance",
  scientificPartnerships: "scientificCooperation",
  commercialAgreements: "tradeAgreement",
  explorationTreaties: "scientificCooperation",
  technologyExchange: "scientificCooperation",
  politicalRivalries: "coldWar",
  coldWars: "coldWar",
  openConflict: "openWar",
  neutralCooperation: "ceasefire",
};

/** Galactic Events (AF-086 §Galactic Events) — ten registered; every one
 * carries an authored attribute-delta effect (the mission-modifier
 * pattern) plus, where a natural correspondence exists, a binding to an
 * EXISTING AF-039 faction event — no new bus vocabulary invented. */
export const GALACTIC_EVENT_KINDS = [
  "tradeBooms",
  "economicCollapse",
  "scientificRenaissance",
  "borderConflicts",
  "civilWars",
  "pirateUprisings",
  "refugeeCrises",
  "ancientDiscoveries",
  "voidIncursions",
  "environmentalCatastrophes",
] as const;
export type GalacticEventKind = (typeof GALACTIC_EVENT_KINDS)[number];

export interface GalacticEventDef {
  kind: GalacticEventKind;
  weight: number;
  attributeDeltas: Partial<Record<ExtendedAttributeKey, number>>;
  /** An existing AF-039 faction event this galactic event corresponds to, or null. */
  boundFactionEvent: FactionEventKind | null;
  historicalKind: HistoricalRecordKind;
}

export const GALACTIC_EVENTS: readonly GalacticEventDef[] = [
  { kind: "tradeBooms", weight: 4, attributeDeltas: { economicPower: 6, industrialOutput: 3 }, boundFactionEvent: "tradeFestival", historicalKind: "colonisation" },
  { kind: "economicCollapse", weight: 2, attributeDeltas: { economicPower: -8, stability: -4, resourceReserves: -3 }, boundFactionEvent: null, historicalKind: "civilisationDecline" },
  { kind: "scientificRenaissance", weight: 3, attributeDeltas: { technology: 8, infrastructure: 2 }, boundFactionEvent: "scientificBreakthrough", historicalKind: "scientificBreakthroughs" },
  { kind: "borderConflicts", weight: 3, attributeDeltas: { militaryStrength: 4, stability: -3, aggression: 3 }, boundFactionEvent: null, historicalKind: "wars" },
  { kind: "civilWars", weight: 2, attributeDeltas: { stability: -10, population: -3, corruption: 4 }, boundFactionEvent: "civilUnrest", historicalKind: "wars" },
  { kind: "pirateUprisings", weight: 2, attributeDeltas: { stability: -4, resourceReserves: -3, militaryStrength: 2 }, boundFactionEvent: null, historicalKind: "civilisationDecline" },
  { kind: "refugeeCrises", weight: 2, attributeDeltas: { population: 2, stability: -3, infrastructure: -2 }, boundFactionEvent: "emergencyBroadcast", historicalKind: "legendaryEvents" },
  { kind: "ancientDiscoveries", weight: 1, attributeDeltas: { technology: 5, influence: 4 }, boundFactionEvent: "ancientAwakening", historicalKind: "discoveries" },
  { kind: "voidIncursions", weight: 1, attributeDeltas: { militaryStrength: -3, stability: -5, corruption: 2 }, boundFactionEvent: null, historicalKind: "wars" },
  { kind: "environmentalCatastrophes", weight: 1, attributeDeltas: { resourceReserves: -6, infrastructure: -4, population: -2 }, boundFactionEvent: null, historicalKind: "civilisationDecline" },
];

/** Warfare conflict kinds (AF-086 §Warfare System) — eight registered. */
export const WARFARE_CONFLICT_KINDS = ["borderSkirmishes", "fleetBattles", "sectorInvasions", "resourceWars", "civilWars", "proxyConflicts", "voidDefence", "ancientTerritory"] as const;
export type WarfareConflictKind = (typeof WARFARE_CONFLICT_KINDS)[number];

/** The bounded fraction player influence may ever contribute to a war's
 * resolution roll — "players may influence outcomes, not fully control
 * them" as a hard numeric cap. */
export const PLAYER_WAR_INFLUENCE_CAP = 0.2;

/** Economic outputs (AF-086 §Economic Simulation) — eight, each naming the
 * live system or register it feeds. */
export interface LiveBindingDef {
  id: string;
  liveBinding: string;
}

export const ECONOMIC_OUTPUTS: readonly LiveBindingDef[] = [
  { id: "technology", liveBinding: "the technology attribute (AF-039), ticked by Innovation-phase bias" },
  { id: "ships", liveBinding: "AF-074 fleet register — FactionDef.uniqueUnits content references" },
  { id: "weapons", liveBinding: "AF-076 arsenal register — FactionDef.uniqueUnits content references" },
  { id: "tradeGoods", liveBinding: "the tradeWealth register (economicPower) ticked by Prosperity-phase bias" },
  { id: "research", liveBinding: "the scientificProgress register (technology), biased toward the faction's scientific priority" },
  { id: "infrastructure", liveBinding: "the NEW infrastructure register, ticked by Innovation/Renewal-phase bias" },
  { id: "militaryProduction", liveBinding: "the militaryStrength attribute, ticked by Conflict-phase bias" },
  { id: "civilianGrowth", liveBinding: "the NEW population register, ticked by Expansion/Recovery-phase bias" },
];

/** Scientific focuses (AF-086 §Scientific Progression) — eight, mapped onto
 * AF-082's fifteen research-roster disciplines; civilisations research
 * independently of the player's own AF-024 tree. */
export const SCIENTIFIC_FOCUSES = ["engineering", "energy", "medicine", "ai", "quantumScience", "planetaryDevelopment", "ancientTechnology", "experimentalSystems"] as const;
export type ScientificFocus = (typeof SCIENTIFIC_FOCUSES)[number];

export const FOCUS_TO_ROSTER_DISCIPLINE: Readonly<Record<ScientificFocus, ResearchRosterDiscipline>> = {
  engineering: "shipEngineering",
  energy: "energySystems",
  medicine: "biologicalEngineering",
  ai: "artificialIntelligence",
  quantumScience: "quantumScience",
  planetaryDevelopment: "planetaryEngineering",
  ancientTechnology: "ancientTechnology",
  experimentalSystems: "experimentalPhysics",
};

/** Faction specialisation parts (AF-086 §Faction Specialisation) — seven;
 * six are ALREADY unique per AF-085's law (technologies/ships via
 * FactionDef, architecture/economy via FactionProfileDef); AF-086 adds
 * the seventh — Scientific Priorities — as its own uniqueness axis. */
export const FACTION_SPECIALISATION_PARTS = ["uniqueTechnologies", "uniqueShips", "uniqueEquipment", "uniqueArchitecture", "uniqueMilitary", "uniqueEconomy", "uniqueScientificPriorities"] as const;

/** Historical record kinds (AF-086 §Historical Timeline) — eight registered;
 * the galaxy builds permanent history. */
export const HISTORICAL_RECORD_KINDS = ["wars", "treaties", "discoveries", "politicalLeaders", "scientificBreakthroughs", "colonisation", "civilisationDecline", "legendaryEvents"] as const;
export type HistoricalRecordKind = (typeof HISTORICAL_RECORD_KINDS)[number];

/** Player impact surfaces (AF-086 §Player Impact) — eight, each BOUNDED —
 * "player actions accelerate history, never completely dictate it." */
export const PLAYER_IMPACT_SURFACES = ["politics", "trade", "science", "military", "exploration", "colonisation", "galaxyStability", "civilianSurvival"] as const;
export type PlayerImpactSurface = (typeof PLAYER_IMPACT_SURFACES)[number];

/** The hard cap on any single player-impact nudge applied to an attribute
 * in one epoch — no surface can ever exceed this, however large the fed
 * amount, proving the "accelerate, never dictate" law numerically. */
export const PLAYER_IMPACT_MAX_DELTA = 5;

export const IMPACT_SURFACE_TO_ATTRIBUTE: Readonly<Record<PlayerImpactSurface, ExtendedAttributeKey>> = {
  politics: "influence",
  trade: "economicPower",
  science: "technology",
  military: "militaryStrength",
  exploration: "expansion",
  colonisation: "population",
  galaxyStability: "stability",
  civilianSurvival: "population",
};

/** Galactic Council session kinds (AF-086 §Galactic Council) — seven,
 * HONESTLY registered without a voting system — the spec's own words:
 * "future voting systems extend naturally." */
export const GALACTIC_COUNCIL_SESSION_KINDS = ["scientificSummits", "emergencySessions", "diplomaticNegotiations", "jointOperations", "civilianRelief", "researchCooperation", "galaxyDefence"] as const;

/** Forbidden outcomes (AF-086 §Balance Principles) — registered BY NAME. */
export const LIVING_ECOSYSTEM_FORBIDDEN_OUTCOMES = ["deterministicOutcomes", "permanentDomination"] as const;

/** Accessibility surfaces (AF-086 §Accessibility) — eight registered. */
export const LIVING_ECOSYSTEM_ACCESSIBILITY_SURFACES = ["galaxyTimeline", "factionMap", "relationshipGraph", "politicalHistory", "largeUI", "controllerNavigation", "touchNavigation", "colourBlindSupport"] as const;

/** Performance disciplines (AF-086 §Performance) — four registered. */
export const LIVING_ECOSYSTEM_PERFORMANCE_DISCIPLINES = ["cacheCivilisationSimulation", "updateDistantFactionsAsynchronously", "poolDiplomaticCalculations", "optimiseHistoricalTracking"] as const;

/** The AF-086 profile — extends AF-085's FactionProfileDef with the one
 * identity axis it didn't carry: scientific priority. Wraps by faction id;
 * AF-085's profile is never modified. */
export interface CivilisationProfileDef {
  factionId: FactionId;
  scientificFocus: ScientificFocus;
  futureExpansionHooks: readonly string[];
}

export const CIVILISATION_PROFILES: readonly CivilisationProfileDef[] = [
  { factionId: "crystalDominion", scientificFocus: "quantumScience", futureExpansionHooks: ["ecosystem-dominion-resonance-doctrine"] },
  { factionId: "machineCollective", scientificFocus: "ai", futureExpansionHooks: ["ecosystem-collective-self-replication-limits"] },
  { factionId: "humanAlliance", scientificFocus: "medicine", futureExpansionHooks: ["ecosystem-alliance-reconstruction-charter"] },
  { factionId: "mercenaryGuild", scientificFocus: "engineering", futureExpansionHooks: ["ecosystem-guild-contract-arbitration"] },
  { factionId: "ancientCustodians", scientificFocus: "ancientTechnology", futureExpansionHooks: ["ecosystem-custodians-directive-drift"] },
  { factionId: "nomadFleet", scientificFocus: "planetaryDevelopment", futureExpansionHooks: ["ecosystem-nomads-great-mooring-survey"] },
];

/** Baseline attribute values every simulated civilisation starts from —
 * mid-scale, so growth and decline are both immediately possible. */
export function baselineAttributes(): Record<ExtendedAttributeKey, number> {
  return {
    influence: 50,
    militaryStrength: 50,
    technology: 50,
    economicPower: 50,
    stability: 60,
    exploration: 40,
    aggression: 30,
    trust: 50,
    corruption: 20,
    expansion: 40,
    population: 60,
    industrialOutput: 50,
    resourceReserves: 60,
    infrastructure: 50,
  };
}

export function clampAttribute(value: number): number {
  return Math.min(ATTRIBUTE_MAX, Math.max(ATTRIBUTE_MIN, value));
}
