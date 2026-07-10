/**
 * Commander Bond Network (AF-130). A permanent, additive relationship
 * layer connecting every Commander in the real roster into one living
 * bond graph — foundation Commanders (AF-030/AF-098) and every
 * individually-specified Commander (AF-105 through AF-129) alike.
 *
 * This module never touches AF-071's CommanderProfileDef or its
 * CommanderRelationshipDef shape. AF-071's own comment is explicit:
 * "Relationships influence dialogue, NOT gameplay balance — there is
 * no bonus field in this shape." That law is preserved exactly as
 * locked. Bond-level gameplay bonuses (bondGameplayBonusFor) live
 * entirely in this new, separate layer — a BondDef is not a
 * CommanderRelationshipDef and carries no dialogue text of its own;
 * the flavour already authored in each commander's real dialogueHint
 * is the dialogue layer, and the bond graph is the progression layer
 * on top of it.
 *
 * "Every pair of Commanders possesses one relationship type" (the
 * spec's own words) is honoured literally: seedBondGraph builds a
 * bond record for every unordered pair in the real roster. Pairs with
 * an authored AF-071 relationship start at level 3 (Trusted) under
 * the generic "Historic Connection" bond type — the specific flavour
 * of that connection is already captured in the real dialogueHint
 * prose and is not re-derived here. Every other pair defaults to the
 * roster's 21st bond type, "Unacquainted," at level 0 (Unknown) — not
 * every Commander has narratively met every other one, and the spec's
 * own self-review directive ("avoid repetitive dialogue... ensure no
 * Commander feels isolated") is best served by that being the honest
 * default rather than 1,378 invented flavour lines.
 */
import type { CommanderDef } from "./commanderData";
import type { CommanderProfileDef } from "./commanderFrameworkData";

export const BOND_LEVEL_NAMES = [
  "Unknown",
  "Acquaintance",
  "Professional",
  "Trusted",
  "Close Friend",
  "Family",
] as const;
export type BondLevelName = (typeof BOND_LEVEL_NAMES)[number];
export const MAX_BOND_LEVEL = BOND_LEVEL_NAMES.length - 1;

export const BOND_TYPES = [
  "Friendship",
  "Professional Respect",
  "Mentor",
  "Student",
  "Sibling-like",
  "Healthy Rivalry",
  "Former Expedition Partners",
  "Research Partners",
  "Engineering Partners",
  "Military Brothers/Sisters",
  "Explorer Network",
  "Medical Alliance",
  "Political Allies",
  "Protective Instinct",
  "Mutual Admiration",
  "Quiet Romance",
  "Shared Trauma",
  "Former Conflict",
  "Forgiveness",
  "Historic Connection",
  "Unacquainted",
] as const;
export type BondType = (typeof BOND_TYPES)[number];

export const CAMP_LOCATIONS = [
  "Engineering Bay",
  "Mess Hall",
  "Observation Deck",
  "Training Arena",
  "Museum",
  "Bridge",
  "Laboratory",
  "Hangar",
] as const;
export type CampLocation = (typeof CAMP_LOCATIONS)[number];

export const GROUP_EVENTS = [
  "Engineering Competition",
  "Cooking Night",
  "Museum Celebration",
  "Founders Day",
  "Commander Memorial",
  "Planetary Festival",
  "Research Symposium",
  "Training Tournament",
  "Stargazing Night",
  "Wildlife Rescue",
] as const;
export type GroupEvent = (typeof GROUP_EVENTS)[number];

export const BOND_GROWTH_SOURCES = [
  "Complete missions together",
  "Shared expeditions",
  "Dialogue choices",
  "Saving one another",
  "Museum discoveries",
  "Joint research",
  "Shared victories",
  "Camp interactions",
  "Special story events",
] as const;
export type BondGrowthSource = (typeof BOND_GROWTH_SOURCES)[number];

export const DYNAMIC_DIALOGUE_TRIGGERS = [
  "Recent missions",
  "Deaths",
  "Major discoveries",
  "Planet restored",
  "Commander recruited",
  "Legendary unlocks",
  "Museum completion",
  "Weather",
  "Time of day",
] as const;
export type DynamicDialogueTrigger = (typeof DYNAMIC_DIALOGUE_TRIGGERS)[number];

export const EMOTIONAL_MEMORY_KINDS = [
  "Losses",
  "Victories",
  "Failures",
  "Near deaths",
  "Player decisions",
] as const;
export type EmotionalMemoryKind = (typeof EMOTIONAL_MEMORY_KINDS)[number];

export const MUSEUM_RELATIONSHIP_WING_EXHIBITS = [
  "Photos",
  "Letters",
  "Shared journals",
  "Recovered recordings",
  "Commander interviews",
  "Historical timelines",
  "Friendship displays",
] as const;
export type MuseumRelationshipWingExhibit = (typeof MUSEUM_RELATIONSHIP_WING_EXHIBITS)[number];

export interface BondDef {
  commanderA: string;
  commanderB: string;
  bondType: BondType;
  level: number;
}

export interface DualUltimateDef {
  id: string;
  name: string;
  commanderA: string;
  commanderB: string;
}

/**
 * The spec's six named pairs. "Orion + Mira" does not resolve to
 * Lucien Orion (surname Orion) — he is already paired with Valen Ash
 * in this same list. It resolves to Dorian Fen, canonically
 * implemented under AF-126 as an owner-authorised rename of the
 * verbatim spec's "Orion Vale" (renamed to avoid colliding with the
 * already-locked CMD-007). Fen's own AF-126 relationships list Mira
 * Syn as his Close Friend, confirming this resolution independently.
 */
export const DUAL_ULTIMATES: readonly DualUltimateDef[] = [
  { id: "dual-planetary-forge", name: "Planetary Forge", commanderA: "thorne-starforged", commanderB: "ryker-engineer" },
  { id: "dual-hope-never-falls", name: "Hope Never Falls", commanderA: "prime-founder", commanderB: "reyes-warden" },
  { id: "dual-stormbreaker-run", name: "Stormbreaker Run", commanderA: "orion-starlancer", commanderB: "ash-tempest" },
  { id: "dual-infinite-knowledge", name: "Infinite Knowledge", commanderA: "voss-pathfinder", commanderB: "myrr-oracle" },
  { id: "dual-living-eden", name: "Living Eden", commanderA: "fen-beastmaster", commanderB: "syn-bioforge" },
  { id: "dual-beyond-time", name: "Beyond Time", commanderA: "noctis-voidwalker", commanderB: "vex-chronomancer" },
];

export interface PersonalQuestSet {
  commanderId: string;
  personalQuestIds: readonly [string, string, string];
  friendshipQuestId: string;
  legacyQuestId: string;
  finalResolutionQuestId: string;
}

export function personalQuestSetsFor(roster: readonly CommanderDef[]): readonly PersonalQuestSet[] {
  return roster.map((commander) => ({
    commanderId: commander.id,
    personalQuestIds: [
      `${commander.id}:bond-personal-quest-1`,
      `${commander.id}:bond-personal-quest-2`,
      `${commander.id}:bond-personal-quest-3`,
    ],
    friendshipQuestId: `${commander.id}:bond-friendship-quest`,
    legacyQuestId: `${commander.id}:bond-legacy-quest`,
    finalResolutionQuestId: `${commander.id}:bond-final-resolution-quest`,
  }));
}

/** Canonical, order-independent pair key. */
export function bondKey(commanderA: string, commanderB: string): string {
  return commanderA < commanderB ? `${commanderA}|${commanderB}` : `${commanderB}|${commanderA}`;
}

/**
 * Builds one BondDef for every unordered pair in the real roster.
 * Pairs with an authored AF-071 relationship (either direction) seed
 * at level 3 (Trusted) under "Historic Connection"; every other pair
 * defaults to "Unacquainted" at level 0 (Unknown).
 */
export function seedBondGraph(roster: readonly CommanderDef[], profiles: readonly CommanderProfileDef[]): readonly BondDef[] {
  const authoredPairs = new Set<string>();
  for (const profile of profiles) {
    for (const relationship of profile.relationships) {
      authoredPairs.add(bondKey(profile.commanderId, relationship.targetId));
    }
  }

  const bonds: BondDef[] = [];
  for (let i = 0; i < roster.length; i++) {
    for (let j = i + 1; j < roster.length; j++) {
      const commanderA = roster[i]!.id;
      const commanderB = roster[j]!.id;
      const isAuthored = authoredPairs.has(bondKey(commanderA, commanderB));
      bonds.push({
        commanderA,
        commanderB,
        bondType: isAuthored ? "Historic Connection" : "Unacquainted",
        level: isAuthored ? 3 : 0,
      });
    }
  }
  return bonds;
}

/**
 * Bond-level gameplay bonuses — additive to this module only, never
 * touching AF-030/AF-071's ability-resolution shapes. Scales linearly
 * with level so Level 5 (Family) always yields the strongest bonus.
 */
export interface BondGameplayBonus {
  passiveBonusMultiplier: number;
  cooldownReductionBonus: number;
}

export function bondGameplayBonusFor(level: number): BondGameplayBonus {
  const clamped = Math.max(0, Math.min(MAX_BOND_LEVEL, level));
  return {
    passiveBonusMultiplier: clamped * 0.02,
    cooldownReductionBonus: clamped * 0.01,
  };
}
