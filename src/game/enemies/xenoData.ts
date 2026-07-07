/**
 * Bio-Engineered Xenomorph faction content (AF-051). The sixth enemy
 * faction, built like AF-046 → AF-050: every unit is a plain AF-033
 * `EnemyDef`, using the dormant `swarm` family (registered since AF-033,
 * never used until now) exclusively — no cross-faction fingerprint
 * collision is even possible. Where every prior doctrine has some kind of
 * decrease — Outlaw scatter times out, Machine services degrade, Crystal
 * strength recomputes down with a dying count, Void corruption decays,
 * Ancient alert de-escalates and its ceiling shrinks — the Hive's Biomass
 * only ever grows: "the Hive never wastes biomass, every death strengthens
 * future generations" is literal, so even a Hive member's own death feeds
 * the pool. Evolution Stage is a permanent ratchet over that pool. The one
 * thing that CAN be lost tactically is the Hive Node's network link
 * (reusing AF-047's discrete on/off flag technique) — losing it cuts off
 * shared Biomass/Healing/Target Information/Aggression to the current
 * encounter without ever touching the permanent Biomass value itself.
 */
import type { EnemyDef } from "./enemyData";
import type { HazardZoneDef } from "../bosses/BossArena";

/** Core Units — fourteen registered; six carry full sandbox defs today. */
export const XENO_UNIT_KINDS = [
  "hiveDrone",
  "hunter",
  "stalker",
  "spitter",
  "broodCarrier",
  "parasite",
  "hiveGuard",
  "crusher",
  "biomassCollector",
  "nestBuilder",
  "evolutionNode",
  "hiveQueenGuard",
  "geneticOverseer",
  "livingTitan",
] as const;
export type XenoUnitKind = (typeof XENO_UNIT_KINDS)[number];

export const XENO_COMBAT_STYLES = [
  "swarming",
  "ambush",
  "flanking",
  "overwhelmingNumbers",
  "evolution",
  "biologicalSynergy",
  "rapidReinforcement",
  "closeRangePressure",
] as const;
export type XenoCombatStyle = (typeof XENO_COMBAT_STYLES)[number];

export const XENO_SPECIAL_MECHANICS = [
  "nestConstruction",
  "eggClusters",
  "parasiticInfection",
  "biomassHarvesting",
  "rapidEvolution",
  "organicRegeneration",
  "burrowing",
  "wallTraversal",
  "acidBlood",
  "adaptiveMutation",
] as const;
export type XenoSpecialMechanic = (typeof XENO_SPECIAL_MECHANICS)[number];

/** The five-stage evolution ratchet (AF-051 §Evolution System) — grows forever, never scatters, degrades, weakens, corrupts, or de-escalates. */
export const EVOLUTION_STAGES = ["baseline", "adapting", "evolved", "apexEvolved", "transcendent"] as const;
export type EvolutionStage = (typeof EVOLUTION_STAGES)[number];

/** What the Hive Network shares — six registered; three mechanically live, gated on the node's link. */
export const HIVE_NETWORK_TRAITS = [
  "biomass",
  "healing",
  "targetInformation",
  "mutationProgress",
  "aggression",
  "reinforcementCalls",
] as const;
export type HiveNetworkTrait = (typeof HIVE_NETWORK_TRAITS)[number];

export const BIOLOGICAL_TERRAIN_KINDS = [
  "organicWalls",
  "livingNests",
  "acidPools",
  "growthChambers",
  "biomassFields",
  "sporeClouds",
  "regenerationZones",
] as const;
export type BiologicalTerrainKind = (typeof BIOLOGICAL_TERRAIN_KINDS)[number];

export const XENO_MINI_BOSS_KINDS = ["broodMother", "hiveTyrant", "evolutionCore", "biomassLeviathan", "ancientQueen", "alphaPredator"] as const;
export type XenoMiniBossKind = (typeof XENO_MINI_BOSS_KINDS)[number];

export const XENO_ELITE_GAINS = [
  "rareMutations",
  "uniqueEvolution",
  "adaptiveArmour",
  "acidEnhancements",
  "legendaryBiomass",
  "uniqueVisualForms",
  "exceptionalRewards",
] as const;
export type XenoEliteGain = (typeof XENO_ELITE_GAINS)[number];

/** Visual Language (AF-051 §Visual Language) — binds to real art at the AF-002/006 asset pass. */
export const XENO_VISUAL_LANGUAGE = {
  style: "Organic armour, bone plating, bioluminescent veins, adaptive tissue, spines, living tendrils",
  chitinColour: "#3a1f14",
  veinColour: "#8bff4d",
  acidColour: "#c8ff1a",
} as const;

/** Evolution tuning — the sixth doctrine: a monotonic Biomass pool fed by
 * every death (hive or otherwise), hard-capped for fairness, never
 * decreasing; Evolution Stage is a pure ratchet over it. */
export const HIVE_EVOLUTION_TUNING = {
  maxBiomass: 1,
  /** Trickle per second — the "Encounter Duration" evolution input. */
  biomassPerSecond: 0.01,
  /** Per death, hive member or otherwise — "the Hive never wastes biomass". */
  biomassPerDeath: 0.08,
  healPerSecondAtMaxEvolution: 5,
  damageBonusAtMaxEvolution: 0.3,
  /** Aggression — the Hive's own speed trait, unlike Ancient Custodians which had none. */
  speedBonusAtMaxEvolution: 0.2,
  /** Rapid Reinforcement — only once Evolution reaches "evolved" (stage 2) and the Node is still linked. */
  reinforceIntervalMs: 6000,
  maxReinforcements: 3,
} as const;

/** Ascending biomass thresholds (fraction of `maxBiomass`) at which each stage begins. */
export const EVOLUTION_STAGE_THRESHOLDS: Readonly<Record<EvolutionStage, number>> = {
  baseline: 0,
  adapting: 0.2,
  evolved: 0.45,
  apexEvolved: 0.7,
  transcendent: 0.9,
};

/** Acid Pool tuning — AF-035's exact hazard engine, a fourth reuse; the first to carry the dormant `poison` StatusKind. */
export const ACID_POOL_TUNING = {
  radius: 1.6,
  tickIntervalMs: 700,
  damagePerTick: 4,
  statusStrength: 2,
  statusDurationMs: 3000,
} as const;

export function createAcidPool(id: string, x: number, y: number): HazardZoneDef {
  return {
    id,
    x,
    y,
    radius: ACID_POOL_TUNING.radius,
    tickIntervalMs: ACID_POOL_TUNING.tickIntervalMs,
    damagePerTick: ACID_POOL_TUNING.damagePerTick,
    statusOnTick: { kind: "poison", strength: ACID_POOL_TUNING.statusStrength, durationMs: ACID_POOL_TUNING.statusDurationMs },
  };
}

export const LORE_XENOMORPH_HIVE_CODEX = "LORE_XENOMORPH_HIVE_CODEX";

/** Sandbox Xenomorph roster — six units proving drone/spitter/stalker/node/
 * crusher/titan doctrine over the unchanged AF-033 schema. Every def uses
 * the dormant `swarm` family — first use since AF-033 registered it. */
export const XENO_ENEMIES: readonly EnemyDef[] = [
  {
    id: "hive-drone",
    name: "Hive Drone",
    family: "swarm",
    roles: ["chaser"],
    lore: "Grown for one purpose and grown quickly — the Hive spends drones the way other species spend ammunition.",
    strengths: ["Surfaces without warning, close and fast"],
    weaknesses: ["Thin chitin — built for numbers, not survival"],
    counterplay: "It surfaces on approach, not on a timer. Widen your path and it has nothing to ambush.",
    hull: 17,
    shield: 0,
    movementBehaviour: "burrow", // first producer — AF-033's dormant burrow movement behaviour
    moveSpeed: 2.2,
    attack: {
      attackType: "melee",
      mechanism: { kind: "melee", baseDamage: 4, damageSchool: "physical", contactRangeUnits: 1.0, cooldownMs: 700 },
      telegraphMs: 200,
    },
    specialAbility: null,
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "small",
  },
  {
    id: "spitter",
    name: "Spitter",
    family: "swarm",
    roles: ["disruptor"],
    lore: "It does not chase. It does not need to — the Hive taught it patience is just another weapon.",
    strengths: ["Acid volleys poison at range and keep pressure on without closing"],
    weaknesses: ["Holds its distance — corner it and the advantage flips"],
    counterplay: "Close the gap; its acid glands need range to matter.",
    hull: 23,
    shield: 4,
    movementBehaviour: "kiting",
    moveSpeed: 1.8,
    attack: {
      attackType: "projectile",
      mechanism: {
        kind: "ranged",
        weapon: {
          id: "acid-spit",
          name: "Acid Spit",
          category: "prototype",
          manufacturer: "Xenomorph Hive",
          tier: 1,
          rarity: "common",
          lore: "Not manufactured. Secreted — every gland is a slightly different formula.",
          damageSchool: "physical",
          damageSourceKind: "direct",
          baseDamage: 5,
          critChance: 0,
          critMultiplier: 1,
          fireIntervalMs: 2100,
          firePattern: "spread",
          projectilesPerShot: 2,
          projectileBehaviour: "straight",
          range: 8,
          projectileSpeed: 9,
          pierceCount: 0,
          explosionRadius: 0,
          statusOnHit: { kind: "poison", chance: 0.65, strength: 2, durationMs: 3000 }, // first producer — AF-021's dormant poison status
          energyCost: 0,
          evolution: null,
        },
      },
      telegraphMs: 450,
    },
    specialAbility: null,
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "medium",
  },
  {
    id: "stalker",
    name: "Stalker",
    family: "swarm",
    roles: ["flanker"],
    lore: "Wrong to call it climbing. It simply does not recognise a wall as different from a floor.",
    strengths: ["Wall Traversal — it approaches from angles nothing else on the field can"],
    weaknesses: ["Light frame, committed once it launches its approach"],
    counterplay: "Watch the walls, not just the floor; it telegraphs the same as anything else once you know to look.",
    hull: 24,
    shield: 6,
    movementBehaviour: "wallCrawling", // first producer — AF-033's dormant wallCrawling movement behaviour
    moveSpeed: 2.0,
    attack: {
      attackType: "melee",
      mechanism: { kind: "melee", baseDamage: 7, damageSchool: "physical", contactRangeUnits: 1.0, cooldownMs: 800 },
      telegraphMs: 220,
    },
    specialAbility: null,
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "medium",
  },
  {
    id: "evolution-node",
    name: "Evolution Node",
    family: "swarm",
    roles: ["support"],
    lore: "Not a soldier. A gland the size of a soldier — every organism nearby draws on what it produces.",
    strengths: ["Every organism nearby shares Biomass, Healing, Target Information, and Aggression while it lives"],
    weaknesses: ["No offence, low hull — sever it and the Hive fights alone"],
    counterplay: "Destroying it doesn't undo the Hive's evolution, but it cuts everything nearby off from it — hunt it first.",
    hull: 26,
    shield: 8,
    movementBehaviour: "formation",
    moveSpeed: 1.0,
    attack: {
      attackType: "melee",
      mechanism: { kind: "melee", baseDamage: 2, damageSchool: "physical", contactRangeUnits: 0.7, cooldownMs: 1800 },
      telegraphMs: 300,
    },
    specialAbility: {
      kind: "boostAllies",
      trigger: "onLowHealth",
      threshold: 1, // always eligible — the network's real strength is computed at the composition root
      bonus: { kind: "damage", value: 0 },
      cooldownMs: 0,
    },
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "medium",
  },
  {
    id: "crusher",
    name: "Crusher",
    family: "swarm",
    roles: ["tank"],
    lore: "Bone plating grown thick enough to matter and muscle grown to swing it. Nothing subtle went into the design.",
    strengths: ["Heavy hull, and it hits harder the longer a fight runs"],
    weaknesses: ["Slow — the Hive built it to anchor a line, not to hunt"],
    counterplay: "Its escalation is real but linear; sustained damage beats it before it matters.",
    hull: 68,
    shield: 18,
    movementBehaviour: "formation",
    moveSpeed: 1.1,
    attack: {
      attackType: "melee",
      mechanism: { kind: "melee", baseDamage: 11, damageSchool: "physical", contactRangeUnits: 1.2, cooldownMs: 1150 },
      telegraphMs: 350,
    },
    specialAbility: {
      kind: "enrage",
      trigger: "onLowHealth",
      threshold: 0.5,
      bonus: { kind: "damage", value: 0.2 },
      cooldownMs: 8000,
    },
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "large",
  },
  {
    id: "living-titan",
    name: "Living Titan",
    family: "swarm",
    roles: ["elite", "tank"],
    lore: "Every generation before it fed this one, one way or another. It is the Hive's whole argument for evolution made flesh.",
    strengths: ["Acid Barrage floods an area, and it calls in reinforcements mid-fight"],
    weaknesses: ["Its true scale is Biomass-driven — meeting it early in a Hive's growth is a hard fight, not an unfair one"],
    counterplay: "The Hive's evolution never reverses, but the Node's link can be cut — do that first, every time.",
    hull: 110,
    shield: 30,
    movementBehaviour: "formation",
    moveSpeed: 1.0,
    attack: {
      attackType: "area",
      mechanism: {
        kind: "ranged",
        weapon: {
          id: "acid-barrage",
          name: "Acid Barrage",
          category: "prototype",
          manufacturer: "Xenomorph Hive",
          tier: 2,
          rarity: "rare",
          lore: "Grown, not aimed — it simply produces enough to cover every angle at once.",
          damageSchool: "physical",
          damageSourceKind: "area",
          baseDamage: 8,
          critChance: 0.05,
          critMultiplier: 1.5,
          fireIntervalMs: 2500,
          firePattern: "nova",
          projectilesPerShot: 6,
          projectileBehaviour: "straight",
          range: 8,
          projectileSpeed: 8,
          pierceCount: 0,
          explosionRadius: 1.2,
          statusOnHit: { kind: "poison", chance: 0.5, strength: 2, durationMs: 3000 },
          energyCost: 0,
          evolution: null,
        },
      },
      telegraphMs: 700,
    },
    specialAbility: {
      kind: "spawnReinforcements",
      trigger: "onLowHealth",
      threshold: 1,
      bonus: { kind: "damage", value: 0 },
      cooldownMs: HIVE_EVOLUTION_TUNING.reinforceIntervalMs,
    },
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "elite",
  },
];
