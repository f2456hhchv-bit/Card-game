/**
 * Relic data shapes (AF-029). Relics reuse AF-007's rarity ladder
 * (restricted to 7 tiers) and AF-028's bonus/trigger vocabulary — no
 * second rarity system, no second trigger language. Every definition
 * must carry a non-numeric clause (AF-029 §3, validated in code).
 */
import type { BonusKind, PassiveTrigger } from "../equipment/equipmentData";
import type { Rarity } from "../loot/lootTuning";

/** The 7 tiers AF-029 draws from AF-007's 9-tier ladder (no Damaged/Improved). */
export const RELIC_RARITIES: readonly Rarity[] = [
  "common",
  "rare",
  "epic",
  "legendary",
  "ancient",
  "mythic",
  "singularity",
];

export const RELIC_CATEGORIES = [
  "offensive",
  "defensive",
  "utility",
  "movement",
  "drone",
  "orbital",
  "elemental",
  "void",
  "crystal",
  "ancient",
  "prototype",
  "mythic",
  "singularity",
] as const;

export type RelicCategory = (typeof RELIC_CATEGORIES)[number];

export type StackingRule = "unique" | "stackable" | "mutuallyExclusive" | "evolving";

export interface RelicEffectClause {
  kind: BonusKind;
  value: number;
}

/** A behaviour clause — the non-numeric requirement (AF-029 §3). */
export interface RelicBehaviourClause {
  trigger: PassiveTrigger | "onStatusApplied" | "onBossMechanic"; // latter two registered future
  description: string;
  /** For onLowHealth — health fraction threshold. */
  threshold?: number;
}

export interface RelicDef {
  id: string;
  name: string;
  category: RelicCategory;
  rarity: Rarity;
  tier: number;
  /** Numeric effects — may be negative (trade-offs, AF-029 §5). */
  effects: readonly RelicEffectClause[];
  /** At least one required — enforced by validateRelicDef. */
  behaviours: readonly RelicBehaviourClause[];
  stacking: StackingRule;
  maxStacks: number | null;
  /** Exclusion-group id for mutuallyExclusive relics. */
  exclusionGroup: string | null;
  /** Ids of relics this one detects a synergy with (symmetric, AF-029 §4). */
  synergyWith: readonly string[];
  /** If present + conditions met, evolves into this relic id (AF-029 §6). */
  evolvesInto: string | null;
  evolutionRequires: readonly string[];
  lore: string;
}

export function validateRelicDef(def: RelicDef): string[] {
  const errors: string[] = [];
  if (def.behaviours.length === 0) {
    errors.push(`"${def.id}" has no non-numeric clause (AF-029 §3 law)`);
  }
  if (def.stacking === "mutuallyExclusive" && !def.exclusionGroup) {
    errors.push(`"${def.id}" is mutuallyExclusive but has no exclusionGroup`);
  }
  if (def.stacking === "evolving" && !def.evolvesInto) {
    errors.push(`"${def.id}" is evolving but has no evolvesInto target`);
  }
  return errors;
}

/** Sandbox content — proves the schema, synergy, trade-off, and evolution engine. */
export const SANDBOX_RELICS: readonly RelicDef[] = [
  {
    id: "ember-core",
    name: "Ember Core",
    category: "elemental",
    rarity: "rare",
    tier: 1,
    effects: [{ kind: "damage", value: 0.12 }],
    behaviours: [{ trigger: "onCriticalHit", description: "Critical hits ignite the target." }],
    stacking: "stackable",
    maxStacks: 3,
    exclusionGroup: null,
    synergyWith: ["frost-shard"],
    evolvesInto: "cinder-heart",
    evolutionRequires: ["frost-shard"],
    lore: "Warm to the touch, centuries after the forge that made it went cold.",
  },
  {
    id: "frost-shard",
    name: "Frost Shard",
    category: "elemental",
    rarity: "rare",
    tier: 1,
    effects: [{ kind: "statusChance", value: 0.15 }],
    behaviours: [{ trigger: "onDamageTaken", description: "Attackers are chilled on contact." }],
    stacking: "stackable",
    maxStacks: 3,
    exclusionGroup: null,
    synergyWith: ["ember-core"],
    evolvesInto: null,
    evolutionRequires: [],
    lore: "It never melts, even in the heart of a dying star.",
  },
  {
    id: "cinder-heart",
    name: "Cinder Heart",
    category: "elemental",
    rarity: "legendary",
    tier: 2,
    effects: [{ kind: "damage", value: 0.3 }, { kind: "statusChance", value: 0.25 }],
    behaviours: [{ trigger: "onCriticalHit", description: "Critical hits detonate into a burst of fire and frost." }],
    stacking: "unique",
    maxStacks: 1,
    exclusionGroup: null,
    synergyWith: [],
    evolvesInto: null,
    evolutionRequires: [],
    lore: "Neither element yields to the other. Both burn regardless.",
  },
  {
    id: "gambler-die",
    name: "Gambler's Die",
    category: "prototype",
    rarity: "epic",
    tier: 1,
    // Trade-off: big damage, real cost — both apply through the same aggregation.
    effects: [{ kind: "criticalDamage", value: 0.5 }, { kind: "shieldCapacity", value: -20 }],
    behaviours: [{ trigger: "onLowHealth", description: "Below 25% health, critical chance doubles.", threshold: 0.25 }],
    stacking: "unique",
    maxStacks: 1,
    exclusionGroup: "risk-relics",
    synergyWith: [],
    evolvesInto: null,
    evolutionRequires: [],
    lore: "It always lands on the number you didn't want.",
  },
  {
    id: "static-node",
    name: "Static Node",
    category: "prototype",
    rarity: "common",
    tier: 1,
    effects: [{ kind: "statusChance", value: 0.05 }],
    behaviours: [{ trigger: "onCriticalHit", description: "Critical hits arc to a nearby target." }],
    stacking: "stackable",
    maxStacks: 5,
    exclusionGroup: null,
    synergyWith: ["conduit-loop"],
    evolvesInto: null,
    evolutionRequires: [],
    lore: "It hums when another of its kind draws near.",
  },
  {
    id: "conduit-loop",
    name: "Conduit Loop",
    category: "prototype",
    rarity: "common",
    tier: 1,
    effects: [{ kind: "cooldownReduction", value: 0.05 }],
    behaviours: [{ trigger: "onKill", description: "Kills briefly recharge nearby active modules." }],
    stacking: "stackable",
    maxStacks: 5,
    exclusionGroup: null,
    synergyWith: ["static-node"],
    evolvesInto: null,
    evolutionRequires: [],
    lore: "Two halves of a circuit no one remembers building.",
  },
  {
    id: "warden-token",
    name: "Warden's Token",
    category: "defensive",
    rarity: "epic",
    tier: 1,
    effects: [{ kind: "shieldCapacity", value: 25 }, { kind: "movementSpeed", value: -0.05 }],
    behaviours: [{ trigger: "onShieldBreak", description: "Shatters into a protective field on shield break." }],
    stacking: "mutuallyExclusive",
    maxStacks: 1,
    exclusionGroup: "risk-relics",
    synergyWith: [],
    evolvesInto: null,
    evolutionRequires: [],
    lore: "Carried by the last defender of a Sector that no longer exists.",
  },
];
