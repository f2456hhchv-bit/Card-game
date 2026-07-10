/**
 * The Living Galaxy (AF-132). An additive layer over the real, already
 * locked simulation stack — never a redesign of it.
 *
 * The research behind this module (grepping every existing per-system/
 * per-faction simulation runtime) found that population, economy,
 * infrastructure, research, food/water/energy, industry, political
 * stability, exploration, and security/military are ALL already
 * tracked, somewhere in the stack: AF-086's CivilisationSimulationRuntime
 * (14 faction-level attributes including `stability`), AF-090's
 * CivilisationFrameworkRuntime (settlement populationStats, development
 * stage growth), and AF-089's GalacticEconomyRuntime (17 resource
 * stockpile categories, trade routes). AF-041's WorldEventRuntime
 * already generates dynamic galaxy/sector/faction/environmental/
 * economic/scientific/emergency/hidden/legendary events with player
 * participation and chaining. AF-086's GalacticHistoryRuntime and the
 * Codex's interactive timeline already permanently record history.
 * None of that is redefined here.
 *
 * What genuinely does not exist anywhere yet — and is what this module
 * adds — is: pollution, a numeric wildlife index, a cycling weather
 * condition, a distinct healthcare index, and crime, per star system;
 * a Dynamic News feed; a non-exhausting Random Discoveries pool; a
 * Festival calendar; a Deep Space phenomena generator; and a stateful
 * Player Reputation ledger (only a static reputationLevel() threshold
 * lookup existed before). A parallel, append-only LivingGalaxyChronicle
 * complements (never replaces) the locked GalacticHistoryRuntime.
 */
import type { StarSystemDef } from "../galaxy/galaxyData";

export const WEATHER_CONDITIONS = [
  "Storms",
  "Blizzards",
  "Acid rain",
  "Solar winds",
  "Meteor showers",
  "Auroras",
  "Radiation",
  "Fog",
  "Sandstorms",
  "Volcanic ash",
  "Clear skies",
] as const;
export type WeatherCondition = (typeof WEATHER_CONDITIONS)[number];

export const DYNAMIC_SEASONS = ["Spring", "Summer", "Autumn", "Winter"] as const;
export type DynamicSeason = (typeof DYNAMIC_SEASONS)[number];

export const NEWS_CATEGORIES = [
  "New colony founded",
  "Rare species discovered",
  "Research breakthrough",
  "Mining accident",
  "Political election",
  "Meteor impact",
  "Festival",
  "Sports championship",
  "Commander anniversary",
  "Museum discovery",
  "First contact",
] as const;
export type NewsCategory = (typeof NEWS_CATEGORIES)[number];

export const DISCOVERY_KINDS = [
  "Derelict ships",
  "Lost expeditions",
  "Ancient satellites",
  "Unknown ruins",
  "Secret laboratories",
  "Prototype factories",
  "Abandoned stations",
  "Survivors",
  "New species",
  "Hidden trade routes",
] as const;
export type DiscoveryKind = (typeof DISCOVERY_KINDS)[number];

export const FESTIVALS = [
  "Founders Day",
  "Planetary Independence",
  "Harvest Festivals",
  "Scientific Expositions",
  "Commander Appreciation Week",
  "Museum Anniversary",
  "Memorial Day",
  "Wildlife Week",
] as const;
export type Festival = (typeof FESTIVALS)[number];

export const CRIME_CATEGORIES = [
  "Piracy",
  "Smuggling",
  "Corporate espionage",
  "Illegal mining",
  "Wildlife trafficking",
  "Corruption",
] as const;
export type CrimeCategory = (typeof CRIME_CATEGORIES)[number];

export const DEEP_SPACE_PHENOMENA = [
  "Anomalies",
  "Ruins",
  "Species",
  "Signals",
  "Derelicts",
  "Events",
] as const;
export type DeepSpacePhenomenon = (typeof DEEP_SPACE_PHENOMENA)[number];

export const TRADE_SHIP_TYPES = [
  "Freighters",
  "Mining fleets",
  "Medical transports",
  "Military patrols",
  "Construction fleets",
  "Scientific expeditions",
  "Civilian tourism",
  "Emergency services",
  "Pirates",
] as const;
export type TradeShipType = (typeof TRADE_SHIP_TYPES)[number];

export const POLITICAL_ORGANISATION_TYPES = [
  "Independent governments",
  "Local councils",
  "Scientific unions",
  "Trade federations",
  "Explorer guilds",
  "Engineering consortiums",
  "Medical organisations",
] as const;
export type PoliticalOrganisationType = (typeof POLITICAL_ORGANISATION_TYPES)[number];

export const REPUTATION_CATEGORIES = [
  "Saved worlds",
  "Destroyed facilities",
  "Diplomatic decisions",
  "Scientific discoveries",
  "Economic support",
  "Rescue missions",
  "Commander relationships",
  "Museum progress",
] as const;
export type ReputationCategory = (typeof REPUTATION_CATEGORIES)[number];

export const POPULATION_LIFE_EVENTS = [
  "Work",
  "Travel",
  "Sleep",
  "Eat",
  "Celebrate",
  "Mourn",
  "Learn",
  "Retire",
  "Children grow",
  "Families change",
  "Businesses open",
  "Businesses close",
] as const;
export type PopulationLifeEvent = (typeof POPULATION_LIFE_EVENTS)[number];

export const WILDLIFE_LIFECYCLE_EVENTS = [
  "Migration",
  "Breeding",
  "Predators",
  "Prey",
  "Extinction recovery",
  "Population balancing",
  "Evolution",
  "Environmental adaptation",
] as const;
export type WildlifeLifecycleEvent = (typeof WILDLIFE_LIFECYCLE_EVENTS)[number];

export const RESEARCH_PROGRESS_EVENTS = [
  "Scientists continue discoveries",
  "Universities publish papers",
  "New technologies emerge",
  "Museums update",
  "Historical debates occur",
  "Expeditions reveal new knowledge",
] as const;
export type ResearchProgressEvent = (typeof RESEARCH_PROGRESS_EVENTS)[number];

/** Deterministic 0-100 clamp — every environmental index uses this. */
export function clampIndex(value: number): number {
  return Math.max(0, Math.min(100, value));
}

export interface EnvironmentalSystemState {
  systemId: string;
  pollution: number;
  wildlifeIndex: number;
  healthcareIndex: number;
  crimeLevel: number;
  weatherCondition: WeatherCondition;
  season: DynamicSeason;
}

/** Seeds every real galaxy star system at a believable moderate midpoint —
 * nothing starts broken, nothing starts perfect. */
export function seedEnvironmentalStates(systems: readonly StarSystemDef[]): readonly EnvironmentalSystemState[] {
  return systems.map((system, i) => ({
    systemId: system.id,
    pollution: 20,
    wildlifeIndex: 60,
    healthcareIndex: 55,
    crimeLevel: 15,
    weatherCondition: WEATHER_CONDITIONS[i % WEATHER_CONDITIONS.length]!,
    season: DYNAMIC_SEASONS[i % DYNAMIC_SEASONS.length]!,
  }));
}

export interface SimpleRng {
  next(): number;
}

export function pickFrom<T>(pool: readonly T[], rng: SimpleRng): T {
  return pool[Math.floor(rng.next() * pool.length) % pool.length]!;
}
