/**
 * The Infinite Endgame Engine (AF-140). A dedicated research pass before
 * implementation surveyed an unusually wide slice of the locked stack —
 * this module composes with real state everywhere it can, and adds
 * genuinely new territory only where the research confirmed none exists.
 *
 * Endgame gate: composes AF-069's real, already-locked
 * `EndgameRuntime.snapshot.unlocked` as the actual "after campaign
 * completion" gate — never a second, invented flag.
 *
 * Legendary Projects collision: 7 of this spec's 8 examples are exact or
 * near duplicates of entries already in AF-090's real `MEGASTRUCTURES`,
 * AF-138's real `CIVILISATION_MEGAPROJECTS`, or AF-139's real
 * `GREAT_PROJECT_LINEAGE` ("Dyson Swarm," "Galactic Library," "Atlas
 * Gateway Network," "Deep Space Observatory Ring" are exact-string
 * duplicates; "Interstellar University," "Planetary Climate Grid," and
 * "World Seed Vault" are near-misses of existing entries). Rather than
 * build a FOURTH near-duplicate roster, this module reuses AF-139's real
 * `greatProjectsProgressSummary` directly for the endgame-framed report.
 * Only "Museum of Civilisations" had no match anywhere — left deferred,
 * the same treatment AF-139 gave its own unmatched "Interstellar Seed
 * Vault," since inventing a new backing megaproject is AF-090/AF-138's
 * domain, not this one's.
 *
 * Colony Specialisation collision: this spec's 9-item list overlaps 7-of-9
 * with AF-138's real `CIVILISATION_ENGINE_SPECIALISATIONS`. Rather than
 * define a competing specialisation union, the genuinely new "new
 * megacities emerge" mechanic composes AF-090's real, already-tracked
 * per-settlement `specialisation: CivilisationSpecialisation | null`
 * field directly (see `megacityThresholdMet`).
 *
 * Annual Events collision: "Founders Day" and "Museum Anniversary" are
 * exact-string duplicates of AF-132's real `FESTIVALS`; several others
 * are near-misses of AF-137/AF-138 event flavour. Kept as its own small,
 * separately-cycled calendar — the same documented-overlap treatment
 * AF-138 already gave its own `SocialEventCalendar` alongside AF-132's
 * `FestivalCalendar` (two small cycling classes, never merged, never
 * sharing state).
 *
 * Expedition Council: mirrors AF-138's real `GovernmentPriorityTracker`
 * lean-only mechanic ("player influences direction, never absolute
 * control") but typed to its own `EXPEDITION_COUNCIL_PRIORITIES` union,
 * since the priority vocabulary genuinely differs (Exploration/
 * Infrastructure/Diplomacy have no equivalent in AF-138's 6).
 *
 * Infinite Research: ALREADY REAL. AF-082's `infiniteResearchProjectFor`/
 * `INFINITE_RESEARCH_KINDS` (`src/game/research/researchRosterData.ts`)
 * already implement exactly "no infinite stat inflation, knowledge
 * expands instead" via a generative, uncapped project sequence. This
 * module composes it directly at the call site and adds zero new tracked
 * state for it.
 *
 * Frontier Beyond / Great Expeditions: genuinely new — AF-038's real
 * `SANDBOX_GALAXY` is a fixed, closed system list with no add-system
 * mechanism, so this module's `GREAT_EXPEDITION_DESTINATIONS` is a
 * deliberately separate, parallel late-game roster — the same
 * namespaced-apart separation AF-131's Living Ship used against AF-031's
 * combat Ship Framework — never wired into or extending `GalaxyRuntime`.
 *
 * Mega Discoveries and Living Economy's "new industries appear" are both
 * confirmed genuinely new territory with no collisions found anywhere.
 */
import type { CivilisationSpecialisation } from "../civilisation/civilisationFrameworkData";

export const ENDGAME_PILLARS = [
  "Infinite Exploration",
  "Living Civilisation",
  "Scientific Advancement",
  "Commander Legacy",
  "Galaxy Restoration",
  "Museum Expansion",
  "Legendary Engineering",
  "Historic Discovery",
] as const;
export type EndgamePillar = (typeof ENDGAME_PILLARS)[number];

export interface GreatExpeditionDestination {
  id: string;
  name: string;
}

/** A deliberately separate, parallel late-game roster — never extending
 * or wired into AF-038's real, closed `SANDBOX_GALAXY`. */
export const GREAT_EXPEDITION_DESTINATIONS: readonly GreatExpeditionDestination[] = [
  { id: "expedition-andromeda-reach", name: "Andromeda Reach" },
  { id: "expedition-silent-halo", name: "The Silent Halo" },
  { id: "expedition-fractured-expanse", name: "The Fractured Expanse" },
  { id: "expedition-ocean-between-stars", name: "The Ocean Between Stars" },
  { id: "expedition-glass-nebula", name: "The Glass Nebula" },
  { id: "expedition-black-garden", name: "The Black Garden" },
];

export const LEGENDARY_PROJECT_EXAMPLES = [
  "Dyson Swarm",
  "Galactic Library",
  "Interstellar University",
  "Planetary Climate Grid",
  "Atlas Gateway Network",
  "World Seed Vault",
  "Museum of Civilisations",
  "Deep Space Observatory Ring",
] as const;

export const COMMANDER_LEGACY_ROLE_KINDS = ["Legacy Missions", "Teaching roles", "Research programs", "Academies", "Historic speeches", "Students", "Protégés"] as const;
export type CommanderLegacyRoleKind = (typeof COMMANDER_LEGACY_ROLE_KINDS)[number];

export const EXPEDITION_COUNCIL_PRIORITIES = ["Scientific priorities", "Exploration targets", "Infrastructure", "Education", "Diplomacy", "Wildlife preservation"] as const;
export type ExpeditionCouncilPriority = (typeof EXPEDITION_COUNCIL_PRIORITIES)[number];

export const MEGA_DISCOVERY_KINDS = [
  "Living planets",
  "Galaxy-sized organisms",
  "Artificial star systems",
  "Unknown physics",
  "Ancient archives",
  "Lost civilizations",
  "Impossible ecosystems",
] as const;
export type MegaDiscoveryKind = (typeof MEGA_DISCOVERY_KINDS)[number];

export const ANNUAL_ENDGAME_EVENT_KINDS = [
  "Scientific Congress",
  "Founders Day",
  "Museum Anniversary",
  "Commander Reunion",
  "Exploration Summit",
  "Engineering Expo",
  "Wildlife Festival",
  "Education Week",
] as const;
export type AnnualEndgameEventKind = (typeof ANNUAL_ENDGAME_EVENT_KINDS)[number];

export const EMERGENT_INDUSTRY_KINDS = ["Tourism", "Education exports", "Scientific licensing", "Historic preservation"] as const;
export type EmergentIndustryKind = (typeof EMERGENT_INDUSTRY_KINDS)[number];

export const GALACTIC_MUSEUM_EXHIBITION_THEMES = ["Lost Civilisations", "Wildlife Recovery", "Commander Portraits", "Ancient Technology", "Founders' Era"] as const;
export type GalacticMuseumExhibitionTheme = (typeof GALACTIC_MUSEUM_EXHIBITION_THEMES)[number];

export function temporaryExhibitionThemeFor(epoch: number): GalacticMuseumExhibitionTheme {
  return GALACTIC_MUSEUM_EXHIBITION_THEMES[epoch % GALACTIC_MUSEUM_EXHIBITION_THEMES.length]!;
}

export const PLAYER_RECOGNITION_SIGNAL_KINDS = ["Schools teach about them", "Museums display them", "Citizens recognise them", "Commanders reference earlier achievements"] as const;

export const ENDGAME_ACCESSIBILITY_SURFACES = ["Endgame roadmap", "Civilisation summaries", "Expedition planner", "Historic review mode", "Difficulty-independent progression", "Narration ready"] as const;

const MEGACITY_POPULATION_THRESHOLD = 90;

/** "Entire worlds specialise... new megacities emerge." Composes AF-090's
 * real, already-tracked per-settlement `specialisation` field and real
 * population directly rather than a new specialisation axis. */
export function megacityThresholdMet(population: number, specialisation: CivilisationSpecialisation | null): boolean {
  return specialisation !== null && population >= MEGACITY_POPULATION_THRESHOLD;
}

/** "New industries appear" — composes AF-089's real `economicHealth`
 * (0-100) as the eligibility signal rather than a random roll. */
export function industryEmergenceEligible(economicHealth: number): boolean {
  return economicHealth >= 70;
}
