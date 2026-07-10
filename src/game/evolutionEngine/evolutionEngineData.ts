/**
 * The Evolution Engine (AF-139). Additive over an unusually wide slice
 * of the locked stack — a dedicated research pass before implementation
 * surveyed equipment/commander/companion/settlement/wildlife/research/
 * meta-progression/megaproject systems so this module composes with
 * real state instead of re-tracking or duplicating any of it.
 *
 * Confirmed genuinely absent everywhere (safe for this module to add):
 * an equipment craftsmanship axis distinct from AF-007's `RARITY_LADDER`;
 * any visual architecture ladder or "older architecture preserved" log;
 * species/creature-level adaptation (AF-132's `EnvironmentalRuntime`
 * only tracks one aggregate `wildlifeIndex` per system); companion
 * growth/breeding/traits (AF-131's `CompanionHabitatRuntime` is a pure
 * dedup registry); a sequential Rookie→Legend player-identity ladder
 * (AF-133/AF-136's `reputationTitleFor` returns flavour titles keyed by
 * legacy category, not a rank sequence); a cross-tree "technology era"
 * aggregate (AF-024's `ResearchTree` nodes carry a per-category `tier`
 * int, no galaxy-wide era concept); and any transport-tier ladder
 * (AF-038's galaxy only has a binary `requiresFastTravelUnlock` flag).
 *
 * Great Projects naming-collision note (found by the research pass,
 * same category of call as AF-137/AF-138's precedent — generic
 * vocabulary overlap between unrelated systems, not a uniquely-canonical
 * identity, so no Project Owner decision was required): several of this
 * spec's 7 example Great Projects are near-duplicates of AF-090's real
 * `MEGASTRUCTURES` or AF-138's real `CIVILISATION_MEGAPROJECTS` —
 * "Dyson Swarm" ≈ `dyson-array-lucent`; "Galactic University" ≈
 * `megaproject-interstellar-university`; "Deep Space Observatory Ring" ≈
 * `megaproject-deep-space-telescope`; "Atlas Gateway Network" ≈
 * `quantum-gate-axiom`. Rather than build a THIRD near-duplicate
 * megaproject roster, this module composes: `GREAT_PROJECT_LINEAGE`
 * documents which real project each spec example maps onto, and
 * `greatProjectsProgressSummary` (in the runtime file) reports a single
 * unified progress lens across both real, existing rosters. Only
 * "Interstellar Seed Vault" had no real match — left undercover/deferred
 * rather than inventing a new backing megaproject, since defining new
 * megaproject entries is AF-090/AF-138's domain, not this one's.
 */
import type { SettlementDevelopmentStage } from "../civilisation/civilisationFrameworkData";

export const EVOLUTION_PILLARS = [
  "Biological",
  "Technological",
  "Architectural",
  "Cultural",
  "Scientific",
  "Economic",
  "Political",
  "Educational",
  "Environmental",
  "Exploratory",
  "Historical",
] as const;
export type EvolutionPillar = (typeof EVOLUTION_PILLARS)[number];

/** New craftsmanship axis, deliberately never reusing or extending
 * AF-007's locked `RARITY_LADDER` (rarity is drop-luck; this is
 * hand-earned refinement of a specific equipment family over time). */
export const EQUIPMENT_EVOLUTION_STAGES = ["Prototype", "Standard", "Improved", "Advanced", "Mastercrafted", "Historic Masterpiece"] as const;
export type EquipmentEvolutionStage = (typeof EQUIPMENT_EVOLUTION_STAGES)[number];

export const ARCHITECTURAL_EVOLUTION_STAGES = ["Emergency Shelters", "Homes", "Districts", "Modern Cities", "Planetary Capitals", "Iconic Skylines"] as const;
export type ArchitecturalEvolutionStage = (typeof ARCHITECTURAL_EVOLUTION_STAGES)[number];

/** A pure mapping over AF-090's real, locked 7-stage
 * `SettlementDevelopmentStage` ladder onto this spec's 6-stage visual
 * ladder — never a competing, independently-tracked stage. */
export const ARCHITECTURAL_STAGE_BY_SETTLEMENT_STAGE: Record<SettlementDevelopmentStage, ArchitecturalEvolutionStage> = {
  founding: "Emergency Shelters",
  expansion: "Homes",
  industrialisation: "Districts",
  scientificGrowth: "Modern Cities",
  prosperity: "Planetary Capitals",
  specialisation: "Planetary Capitals",
  legendaryStatus: "Iconic Skylines",
};

export function architecturalStageFor(settlementStage: SettlementDevelopmentStage): ArchitecturalEvolutionStage {
  return ARCHITECTURAL_STAGE_BY_SETTLEMENT_STAGE[settlementStage];
}

export const PLAYER_EVOLUTION_RANKS = ["Rookie", "Explorer", "Commander", "Leader", "Founder", "Legend"] as const;
export type PlayerEvolutionRank = (typeof PLAYER_EVOLUTION_RANKS)[number];

/** Derived purely from AF-026's real `MetaProgression.snapshot.accountLevel`
 * — a genuinely new sequential ladder, since AF-133/136's
 * `reputationTitleFor` is flavour text keyed by legacy category, not rank. */
export function playerEvolutionRankFor(accountLevel: number): PlayerEvolutionRank {
  if (accountLevel < 5) return "Rookie";
  if (accountLevel < 15) return "Explorer";
  if (accountLevel < 30) return "Commander";
  if (accountLevel < 50) return "Leader";
  if (accountLevel < 75) return "Founder";
  return "Legend";
}

export const TRANSPORT_EVOLUTION_TIERS = ["Walking Paths", "Roads", "Maglev", "Orbital Elevators", "Hyperspace Corridors", "Quantum Gateways"] as const;
export type TransportEvolutionTier = (typeof TRANSPORT_EVOLUTION_TIERS)[number];

/** Composes with AF-024's real research-driven `GALAXY_FAST_TRAVEL`
 * unlock flag: the top two tiers are structurally gated behind it, so
 * "travel becomes visibly easier over time" stays tied to real research
 * progress rather than pure epoch counting. */
export function transportTierFor(epoch: number, fastTravelUnlocked: boolean): TransportEvolutionTier {
  const capped = fastTravelUnlocked ? TRANSPORT_EVOLUTION_TIERS.length - 1 : TRANSPORT_EVOLUTION_TIERS.length - 3;
  const index = Math.min(capped, Math.floor(epoch / 4));
  return TRANSPORT_EVOLUTION_TIERS[Math.max(0, index)]!;
}

export const SPECIES_ADAPTATION_TRIGGER_KINDS = [
  "Climate",
  "Player restoration",
  "Predators",
  "Food availability",
  "Pollution",
  "Terraforming",
  "Migration",
  "Environmental disasters",
] as const;
export type SpeciesAdaptationTrigger = (typeof SPECIES_ADAPTATION_TRIGGER_KINDS)[number];

export const COMPANION_GROWTH_STAGES = ["Hatchling", "Young", "Mature", "Legend"] as const;
export type CompanionGrowthStage = (typeof COMPANION_GROWTH_STAGES)[number];

export function companionGrowthStageFor(growth: number): CompanionGrowthStage {
  if (growth < 25) return "Hatchling";
  if (growth < 60) return "Young";
  if (growth < 100) return "Mature";
  return "Legend";
}

export const COMMANDER_MATURITY_STAGES = ["Rookie Officer", "Seasoned Leader", "Trusted Mentor", "Living Legend"] as const;
export type CommanderMaturityStage = (typeof COMMANDER_MATURITY_STAGES)[number];

/** Composes AF-071's real `CommanderProgressionRuntime` (talents unlocked,
 * mission beat) and AF-130's real `BondNetworkRuntime` (average bond
 * level) into one 0-100 maturity score — plain numbers in, per the
 * decoupled-composition pattern established by AF-137's `tierWeightsFor`. */
export function commanderMaturityScore(talentsUnlocked: number, missionBeatIndex: number, bondAverageLevel: number): number {
  const score = talentsUnlocked * 8 + missionBeatIndex * 10 + bondAverageLevel * 6;
  return Math.min(100, score);
}

export function commanderMaturityStageFor(score: number): CommanderMaturityStage {
  if (score < 25) return "Rookie Officer";
  if (score < 55) return "Seasoned Leader";
  if (score < 85) return "Trusted Mentor";
  return "Living Legend";
}

export const TECHNOLOGY_ERAS = ["Salvage Age", "Rebuilding Age", "Refinement Age", "Advanced Age", "Golden Age"] as const;
export type TechnologyEra = (typeof TECHNOLOGY_ERAS)[number];

/** Composes AF-024's real `ResearchTree.unlockedNodes` (count + average
 * `tier`) into one galaxy-wide era label — "no advancement appears
 * instantly, research builds gradually." */
export function technologyEraFor(unlockedCount: number, averageTier: number): TechnologyEra {
  const score = unlockedCount * 2 + averageTier * 5;
  if (score < 10) return "Salvage Age";
  if (score < 25) return "Rebuilding Age";
  if (score < 45) return "Refinement Age";
  if (score < 70) return "Advanced Age";
  return "Golden Age";
}

export const TECHNOLOGY_EVOLUTION_EXAMPLES = [
  "Weapons become lighter",
  "Ships become faster",
  "Medicine improves",
  "AI becomes safer",
  "Power becomes cleaner",
  "Construction becomes smarter",
  "Communication expands",
] as const;

export const CULTURAL_EVOLUTION_EXAMPLES = ["New music", "New holidays", "Cuisine", "Fashion", "Architecture", "Literature", "Children's stories"] as const;

export const LANGUAGE_EVOLUTION_EXAMPLES = [
  "New sayings appear",
  "Historic figures become idioms",
  "Commander quotes become famous",
  "Planet-specific dialects emerge",
  "Books preserve earlier language",
] as const;

export const RESEARCH_EVOLUTION_EXAMPLES = [
  "Older theories become outdated",
  "Books update",
  "Museum exhibits expand",
  "Universities teach new discoveries",
  "The galaxy becomes smarter",
] as const;

export const AI_EVOLUTION_EXAMPLES = ["Navigation learns", "Companions become more intelligent", "Cities optimise themselves", "No abrupt jumps, only gradual refinement"] as const;

export const PLANETARY_EVOLUTION_EXAMPLES = ["Forests expand", "Rivers clean", "Wildlife returns", "Cities flourish", "Weather stabilises", "Tourism grows", "Planets develop character"] as const;

export const COLONY_EVOLUTION_EXAMPLES = [
  "Unique architecture",
  "Regional traditions",
  "Educational institutions",
  "Public artwork",
  "Historical monuments",
  "Scientific identity",
  "Economic strengths",
] as const;

export const HISTORICAL_EVOLUTION_STAGES = ["Heroes become legends", "Legends become history", "History becomes education", "Education inspires future generations"] as const;

export const EVOLUTION_ACCESSIBILITY_SURFACES = ["Evolution viewer", "Before/after comparisons", "Timeline playback", "Simplified progression summaries", "Narration ready"] as const;

export interface GreatProjectLineageEntry {
  flavourName: string;
  realSource: "AF-090 megastructure" | "AF-138 megaproject" | "deferred — no real backing project";
  realId: string | null;
}

/** Documents which real AF-090/AF-138 project each of this spec's 7
 * Great Project examples maps onto, per the module doc comment's naming
 * note — never a third, independently-tracked roster. */
export const GREAT_PROJECT_LINEAGE: readonly GreatProjectLineageEntry[] = [
  { flavourName: "Dyson Swarm", realSource: "AF-090 megastructure", realId: "dyson-array-lucent" },
  { flavourName: "Galactic University", realSource: "AF-138 megaproject", realId: "megaproject-interstellar-university" },
  { flavourName: "Living World Archives", realSource: "AF-138 megaproject", realId: "megaproject-world-tree" },
  { flavourName: "Interstellar Seed Vault", realSource: "deferred — no real backing project", realId: null },
  { flavourName: "Planetary Climate Network", realSource: "AF-138 megaproject", realId: "megaproject-biodome-network" },
  { flavourName: "Deep Space Observatory Ring", realSource: "AF-138 megaproject", realId: "megaproject-deep-space-telescope" },
  { flavourName: "Atlas Gateway Network", realSource: "AF-090 megastructure", realId: "quantum-gate-axiom" },
];
