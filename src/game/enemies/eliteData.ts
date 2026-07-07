/**
 * Elite data shapes (AF-034). Elite Tiers reuse AF-029's exact 7-tier
 * restricted rarity view (RELIC_RARITIES) for reward floors — the second
 * module to draw from that restriction, not a third new ladder. Mutation
 * compatibility/stacking reuse AF-029's exclusionGroup pattern and AF-021's
 * StackingRule exactly — no new compatibility or stacking language.
 */
import { RELIC_RARITIES } from "../relics/relicData";
import type { Rarity } from "../loot/lootTuning";
import type { StackingRule } from "../combat/combatTuning";
import type { StatusOnHit } from "../weapons/weaponData";

export const ELITE_TIERS = ["veteran", "champion", "ancient", "prime", "legendary", "apex", "mythic"] as const;
export type EliteTier = (typeof ELITE_TIERS)[number];

export interface EliteTierDef {
  tier: EliteTier;
  hullMultiplier: number;
  damageMultiplier: number;
  speedMultiplier: number;
  /** How many mutations this tier rolls. */
  mutationSlots: number;
  /** Reward floor — AF-029's restricted rarity view, not a new ladder. */
  rarityFloor: Rarity;
  rewardMultiplier: number;
}

/** Ascending tier → ascending position in AF-029's restricted rarity view (index, not name, alignment). */
export const ELITE_TIER_DEFS: Readonly<Record<EliteTier, EliteTierDef>> = {
  veteran: { tier: "veteran", hullMultiplier: 2, damageMultiplier: 1.2, speedMultiplier: 1, mutationSlots: 1, rarityFloor: RELIC_RARITIES[0]!, rewardMultiplier: 2 },
  champion: { tier: "champion", hullMultiplier: 2.6, damageMultiplier: 1.35, speedMultiplier: 1.05, mutationSlots: 1, rarityFloor: RELIC_RARITIES[1]!, rewardMultiplier: 2.8 },
  ancient: { tier: "ancient", hullMultiplier: 3.4, damageMultiplier: 1.5, speedMultiplier: 1.1, mutationSlots: 2, rarityFloor: RELIC_RARITIES[2]!, rewardMultiplier: 3.6 },
  prime: { tier: "prime", hullMultiplier: 4.2, damageMultiplier: 1.7, speedMultiplier: 1.15, mutationSlots: 2, rarityFloor: RELIC_RARITIES[3]!, rewardMultiplier: 4.5 },
  legendary: { tier: "legendary", hullMultiplier: 5.2, damageMultiplier: 1.9, speedMultiplier: 1.2, mutationSlots: 2, rarityFloor: RELIC_RARITIES[4]!, rewardMultiplier: 5.6 },
  apex: { tier: "apex", hullMultiplier: 6.5, damageMultiplier: 2.2, speedMultiplier: 1.25, mutationSlots: 3, rarityFloor: RELIC_RARITIES[5]!, rewardMultiplier: 7 },
  mythic: { tier: "mythic", hullMultiplier: 8, damageMultiplier: 2.6, speedMultiplier: 1.3, mutationSlots: 3, rarityFloor: RELIC_RARITIES[6]!, rewardMultiplier: 9 },
};

export const MUTATION_KINDS = [
  "regeneration",
  "shielded",
  "explosive",
  "teleport",
  "reflectiveArmour",
  "rapidAssault",
  "gravityField",
  "summoner",
  "berserker",
  "cryogenic",
  "incendiary",
  "corrupted",
  "quantumShift",
  "temporalEcho",
  "adaptiveArmour",
] as const;
export type MutationKind = (typeof MUTATION_KINDS)[number];

export interface MutationDef {
  kind: MutationKind;
  visualIndicator: string;
  gameplayEffect: string;
  counterplay: string;
  threatRating: number;
  /** AF-029's exclusionGroup pattern — mutations sharing a group never co-roll on one Elite. */
  exclusionGroup?: string;
  /** AF-021's StackingRule — how this mutation's effect stacks when multiple Elites apply it at once. */
  stackBehaviour: StackingRule;
  /** True for the mutations this module mechanically wires; false = schema-complete, awaiting a consumer. */
  mechanicallyLive: boolean;
}

export const MUTATION_DEFS: Readonly<Record<MutationKind, MutationDef>> = {
  regeneration: {
    kind: "regeneration",
    visualIndicator: "Pulsing green hull seams",
    gameplayEffect: "Regenerates a fraction of max hull per second.",
    counterplay: "Burst it down faster than it heals, or apply a DoT that outpaces regen.",
    threatRating: 3,
    stackBehaviour: "stackDuration",
    mechanicallyLive: true,
  },
  shielded: {
    kind: "shielded",
    visualIndicator: "Visible barrier shimmer",
    gameplayEffect: "Starts with a large bonus shield pool on top of the tier's hull scaling.",
    counterplay: "Shield-break status strips it fast; ignoring it wastes time on a bigger pool.",
    threatRating: 3,
    exclusionGroup: "defensive-mutation",
    stackBehaviour: "refresh",
    mechanicallyLive: true,
  },
  explosive: {
    kind: "explosive",
    visualIndicator: "Cracked, glowing hull plating",
    gameplayEffect: "Detonates in a damage radius on death.",
    counterplay: "Finish it from range, or be moving away when its hull hits zero.",
    threatRating: 4,
    stackBehaviour: "stackIntensity",
    mechanicallyLive: true,
  },
  teleport: {
    kind: "teleport",
    visualIndicator: "Brief spatial distortion flash",
    gameplayEffect: "Overrides movement with periodic short-range teleports toward the player.",
    counterplay: "Punish the moment right after it lands — it can't teleport again immediately.",
    threatRating: 3,
    exclusionGroup: "movement-mutation",
    stackBehaviour: "refresh",
    mechanicallyLive: true,
  },
  reflectiveArmour: {
    kind: "reflectiveArmour",
    visualIndicator: "Mirrored hull sheen",
    gameplayEffect: "Reflects a fraction of incoming damage back to the attacker.",
    counterplay: "Favour status effects and DoT over raw burst damage against it.",
    threatRating: 3,
    exclusionGroup: "defensive-mutation",
    stackBehaviour: "refresh",
    mechanicallyLive: false,
  },
  rapidAssault: {
    kind: "rapidAssault",
    visualIndicator: "Overcharged weapon glow",
    gameplayEffect: "Attacks fire on a much shorter interval.",
    counterplay: "Close distance or break line of sight — the threat is uptime, not per-hit damage.",
    threatRating: 4,
    stackBehaviour: "stackIntensity",
    mechanicallyLive: true,
  },
  gravityField: {
    kind: "gravityField",
    visualIndicator: "Visible distortion ring",
    gameplayEffect: "Pulls the player toward it while active.",
    counterplay: "Use boost i-frames to break free, or kill it before the pull matters.",
    threatRating: 4,
    exclusionGroup: "movement-mutation",
    stackBehaviour: "refresh",
    mechanicallyLive: false,
  },
  summoner: {
    kind: "summoner",
    visualIndicator: "Beacon pulse before each spawn",
    gameplayEffect: "Periodically summons reinforcements.",
    counterplay: "Kill it first to stop the reinforcement clock, or clear adds and ignore it.",
    threatRating: 4,
    stackBehaviour: "stackDuration",
    mechanicallyLive: false,
  },
  berserker: {
    kind: "berserker",
    visualIndicator: "Red damage-state flare below the threshold",
    gameplayEffect: "Gains a damage bonus once its own hull drops below a threshold.",
    counterplay: "Either burst it down before the threshold, or expect the damage spike and disengage.",
    threatRating: 4,
    exclusionGroup: "rage-mutation",
    stackBehaviour: "refresh",
    mechanicallyLive: true,
  },
  cryogenic: {
    kind: "cryogenic",
    visualIndicator: "Frost trail on every hit",
    gameplayEffect: "Its attacks apply Slow/Freeze.",
    counterplay: "Keep moving unpredictably; a frozen player is the actual danger, not the hit itself.",
    threatRating: 3,
    exclusionGroup: "status-mutation",
    stackBehaviour: "refresh",
    mechanicallyLive: true,
  },
  incendiary: {
    kind: "incendiary",
    visualIndicator: "Trailing embers on every hit",
    gameplayEffect: "Its attacks apply Burn.",
    counterplay: "Break the DoT window by disengaging; don't trade hits with it repeatedly.",
    threatRating: 3,
    exclusionGroup: "status-mutation",
    stackBehaviour: "stackIntensity",
    mechanicallyLive: true,
  },
  corrupted: {
    kind: "corrupted",
    visualIndicator: "Glitching void-purple outline",
    gameplayEffect: "Its attacks apply Corruption.",
    counterplay: "Cleanse or outlast the stacks; don't let corruption stacks climb unchecked.",
    threatRating: 3,
    exclusionGroup: "status-mutation",
    stackBehaviour: "stackIntensity",
    mechanicallyLive: true,
  },
  quantumShift: {
    kind: "quantumShift",
    visualIndicator: "Flickering double-image",
    gameplayEffect: "Has a chance to teleport away the instant it's hit.",
    counterplay: "Burst damage is wasted on it — apply DoTs instead, which persist through the shift.",
    threatRating: 4,
    exclusionGroup: "movement-mutation",
    stackBehaviour: "refresh",
    mechanicallyLive: false,
  },
  temporalEcho: {
    kind: "temporalEcho",
    visualIndicator: "Trailing translucent duplicate",
    gameplayEffect: "Leaves a weak decoy that shares a fraction of its attacks.",
    counterplay: "Ignore the decoy; it has no reward on its own — focus the real one.",
    threatRating: 2,
    stackBehaviour: "stackDuration",
    mechanicallyLive: false,
  },
  adaptiveArmour: {
    kind: "adaptiveArmour",
    visualIndicator: "Colour-shifting hull plates",
    gameplayEffect: "Gains resistance to whichever damage school hit it most recently.",
    counterplay: "Alternate damage schools/weapons rather than committing to one.",
    threatRating: 3,
    exclusionGroup: "defensive-mutation",
    stackBehaviour: "refresh",
    mechanicallyLive: false,
  },
};

export const ENCOUNTER_TYPES = [
  "singleElite",
  "elitePatrol",
  "eliteAmbush",
  "eliteSquad",
  "eliteEscort",
  "eliteHunt",
  "eliteEvent",
  "eliteReinforcements",
  "mixedEliteGroup",
] as const;
export type EncounterType = (typeof ENCOUNTER_TYPES)[number];

export const SPECIAL_ELITE_EVENTS = [
  "namedChampions",
  "ancientGuardians",
  "prototypeUnits",
  "corruptedCommanders",
  "lostExplorers",
  "experimentalMachines",
  "galaxyHunters",
  "voidIncursions",
] as const;
export type SpecialEliteEvent = (typeof SPECIAL_ELITE_EVENTS)[number];

/** Elite-only numeric effects that don't fit AF-033's EnemyDef shape — layered alongside it, not merged into it. */
export interface MutationEffects {
  regenPerSecond: number;
  explosionOnDeath: { damage: number; radius: number } | null;
  /** Applies on any successful attack (melee or ranged) — melee has no statusOnHit field of its own to override. */
  attackStatusOnHit: StatusOnHit | null;
}

export const EMPTY_MUTATION_EFFECTS: MutationEffects = {
  regenPerSecond: 0,
  explosionOnDeath: null,
  attackStatusOnHit: null,
};
