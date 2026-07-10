/**
 * The Civilisation Engine (AF-138). Additive over AF-090's real,
 * locked `CivilisationFrameworkRuntime`/`SettlementState`/
 * `PopulationStat`/`MegastructureDef` — a dedicated research pass
 * before implementation confirmed the exact shapes below and what is
 * genuinely missing.
 *
 * Already tracked in AF-090 (never re-tracked here; composed instead):
 * Education/Health/Security ↔ real, live-mutated `PopulationStat`
 * fields; Public Happiness ↔ `civilianHappiness`; Industry ↔
 * `industrialWorkforce`. `PopulationStat` also *declares* `population`
 * and `employment` — but AF-090's own `baselinePopulationStats()`
 * never initialises or mutates either (only 7 of the 10 declared
 * stats are live), so reading them per-settlement would be
 * `undefined` at runtime despite the type claiming `number`. Real
 * population instead comes from AF-086's `CivilisationSimulationRuntime`
 * (`stateFor(factionId)?.attributes.population`, per-faction, real and
 * live); Employment has no numeric home anywhere, so this module
 * proxies it from the real, live workforce stats
 * (`industrialWorkforce`/`scientificWorkforce`/`militaryPersonnel`
 * averaged) rather than inventing an unbacked new register. Industry
 * also has AF-086's `industrialOutput` as a second partial proxy;
 * Infrastructure has no direct 1:1 PopulationStat and is proxied from
 * `builtUpgrades.size` instead.
 *
 * Confirmed genuinely absent everywhere (this module's own new
 * per-settlement register): Food, Water, Energy, Housing, Research,
 * Culture, Ecology, Tourism, Innovation, Historical Preservation.
 *
 * AF-090's `SettlementDevelopmentStage` (7 values: founding/expansion/
 * industrialisation/scientificGrowth/prosperity/specialisation/
 * legendaryStatus) and `CivilisationSpecialisation` (10 values,
 * science/industry/trade/military/exploration/engineering/
 * agriculture/ancientResearch/energy/diplomacy) are both closed,
 * locked unions with different names/counts/theming than this
 * spec's 6 Civilisation Stages and 9 Economic Specialisations — so
 * this module defines its own new, separate classifications rather
 * than adding cases to those locked unions.
 *
 * Naming note: two of this spec's eight Megaproject examples
 * ("Orbital Ring," "Planetary Shield") share generic names with two
 * of AF-090's real, already-built megastructures ("Frontier Orbital
 * Ring," "Forge Primus Planetary Shield"). These are structurally
 * unrelated: AF-090's are per-region galaxy megastructures tied to a
 * specific system; this module's are late-game per-colony
 * collaborative projects with their own distinct ids
 * (`megaproject-*`, never colliding with AF-090's real
 * megastructure ids). Kept as a documented, low-stakes vocabulary
 * overlap rather than an identity collision — unlike the AF-126
 * character rename, nothing here is a uniquely-canonical named
 * individual, so no Project Owner decision was required.
 */
import type { PopulationStat } from "../civilisation/civilisationFrameworkData";

export const CIVILISATION_STAGES = ["Survival", "Settlement", "Colony", "City", "Capital World", "Beacon World"] as const;
export type CivilisationStage = (typeof CIVILISATION_STAGES)[number];

export const NEW_CIVILISATION_ATTRIBUTES = [
  "Food",
  "Water",
  "Energy",
  "Housing",
  "Research",
  "Culture",
  "Ecology",
  "Tourism",
  "Innovation",
  "Historical Preservation",
] as const;
export type NewCivilisationAttribute = (typeof NEW_CIVILISATION_ATTRIBUTES)[number];

/** The spec's own 18-attribute list, for the Accessibility "Civilisation
 * dashboard" summary — some realise onto real AF-090 PopulationStat
 * fields, the rest onto this module's own new attributes. */
export const CIVILISATION_ATTRIBUTES = [
  "Population",
  "Education",
  "Health",
  "Employment",
  "Food",
  "Water",
  "Energy",
  "Housing",
  "Research",
  "Industry",
  "Security",
  "Culture",
  "Ecology",
  "Infrastructure",
  "Tourism",
  "Public Happiness",
  "Innovation",
  "Historical Preservation",
] as const;
export type CivilisationAttribute = (typeof CIVILISATION_ATTRIBUTES)[number];

/** Maps the overlapping attributes onto their real, live-mutated AF-090
 * PopulationStat field. Deliberately excludes "Population" and
 * "Employment" — `PopulationStat` declares both, but AF-090 never
 * mutates either per-settlement (see module doc comment); those two
 * are composed from other real sources in `civilisationAttributeSummaryFor`. */
export const CIVILISATION_ATTRIBUTE_TO_POPULATION_STAT: Partial<Record<CivilisationAttribute, PopulationStat>> = {
  Education: "education",
  Health: "health",
  Security: "security",
  "Public Happiness": "civilianHappiness",
  Industry: "industrialWorkforce",
};

export const CIVILISATION_ENGINE_SPECIALISATIONS = [
  "Engineering",
  "Medicine",
  "Research",
  "Agriculture",
  "Tourism",
  "Manufacturing",
  "Wildlife conservation",
  "Education",
  "Trade",
] as const;
export type CivilisationEngineSpecialisation = (typeof CIVILISATION_ENGINE_SPECIALISATIONS)[number];

export const GOVERNMENT_PRIORITIES = ["Science", "Industry", "Ecology", "Trade", "Culture", "Security"] as const;
export type GovernmentPriority = (typeof GOVERNMENT_PRIORITIES)[number];

export interface CivilisationMegaprojectDef {
  id: string;
  name: string;
  threshold: number;
}

/** Eight real megaprojects, distinct ids from AF-090's real
 * `MEGASTRUCTURES` roster (see module doc comment for the naming note). */
export const CIVILISATION_MEGAPROJECTS: readonly CivilisationMegaprojectDef[] = [
  { id: "megaproject-orbital-ring", name: "Orbital Ring", threshold: 100 },
  { id: "megaproject-planetary-shield", name: "Planetary Shield", threshold: 100 },
  { id: "megaproject-galactic-library", name: "Galactic Library", threshold: 100 },
  { id: "megaproject-interstellar-university", name: "Interstellar University", threshold: 100 },
  { id: "megaproject-deep-space-telescope", name: "Deep Space Telescope", threshold: 100 },
  { id: "megaproject-biodome-network", name: "Biodome Network", threshold: 100 },
  { id: "megaproject-world-tree", name: "World Tree", threshold: 100 },
  { id: "megaproject-quantum-relay", name: "Quantum Relay", threshold: 100 },
];

export const CIVILISATION_LANDMARK_KINDS = [
  "Statues",
  "Gardens",
  "Libraries",
  "Cathedrals of Science",
  "Commander memorials",
  "Public observatories",
  "Living museums",
  "Children's parks",
] as const;
export type CivilisationLandmarkKind = (typeof CIVILISATION_LANDMARK_KINDS)[number];

export const IMMIGRATION_MOTIVATION_KINDS = ["Education", "Work", "Safety", "Research", "Adventure", "Family", "Trade"] as const;
export type ImmigrationMotivationKind = (typeof IMMIGRATION_MOTIVATION_KINDS)[number];

export const SOCIAL_EVENT_KINDS = [
  "Graduations",
  "Weddings",
  "Art festivals",
  "Scientific expos",
  "Concerts",
  "Book fairs",
  "Commander appearances",
  "Founders celebrations",
] as const;
export type SocialEventKind = (typeof SOCIAL_EVENT_KINDS)[number];

export const CAREER_PATH_KINDS = ["Scientists", "Engineers", "Explorers", "Doctors", "Artists", "Teachers", "Commanders"] as const;
export type CareerPathKind = (typeof CAREER_PATH_KINDS)[number];

export const GENERATIONAL_CHANGE_KINDS = [
  "Children become adults",
  "Students become professors",
  "Apprentices become master engineers",
  "Young explorers become Commanders",
] as const;
export type GenerationalChangeKind = (typeof GENERATIONAL_CHANGE_KINDS)[number];

export const GALACTIC_IDENTITY_KINDS = [
  "Shared values",
  "Shared holidays",
  "Shared scientific standards",
  "Shared educational systems",
  "Shared cultural celebrations",
] as const;
export type GalacticIdentityKind = (typeof GALACTIC_IDENTITY_KINDS)[number];

export const PUBLIC_OPINION_REACTION_KINDS = [
  "Leadership",
  "Disasters",
  "Museum",
  "Scientific discoveries",
  "Commander actions",
  "Festivals",
  "Economic prosperity",
  "Wildlife",
  "Player reputation",
] as const;
export type PublicOpinionReactionKind = (typeof PUBLIC_OPINION_REACTION_KINDS)[number];

/** Six broad stages derived from population and the new-attribute
 * average — a genuinely new classification, never touching AF-090's
 * own 7-stage SettlementDevelopmentStage ladder. */
export function civilisationStageFor(population: number, newAttributeAverage: number): CivilisationStage {
  const score = population * 0.6 + newAttributeAverage * 0.4;
  if (score < 20) return "Survival";
  if (score < 40) return "Settlement";
  if (score < 60) return "Colony";
  if (score < 80) return "City";
  if (score < 95) return "Capital World";
  return "Beacon World";
}
