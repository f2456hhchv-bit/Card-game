/**
 * Stellar Nomad faction content (AF-052). The seventh enemy faction. Where
 * every prior faction shares some passive bonus computed from a state
 * (scatter timer, service flags, living count, corruption level, alert
 * stage, biomass ratchet), the Nomads spend an actively-earned resource —
 * Scrap — on discrete tactical actions: Deployable Turrets, Scrap Shields,
 * Emergency Repairs. "Nomads use whatever is available" is literal: Scrap
 * is earned passively (salvaging the battlefield) and then spent, gated by
 * both affordability AND cooldown, never a free passive multiplier.
 * Destroying the Command Ship doesn't scatter, degrade, weaken, corrupt, or
 * de-escalate anything that already exists — it throttles the fleet's
 * FUTURE income rate ("disrupts fleet cohesion"), a genuinely different
 * mechanical shape from every prior doctrine's kill-consequence. Escort
 * Protection is a second, independent input — a pure headcount of living
 * Escort Fighters, not derived from Scrap at all. `nomadFleet` was a
 * registered-but-unprofiled AF-039 FactionId — this module pays off that
 * content debt, exactly as AF-046 did for the Mercenary Guild and AF-050
 * for the Ancient Custodians.
 */
import type { EnemyDef } from "./enemyData";

/** Core Units — fourteen registered; six carry full sandbox defs today. */
export const NOMAD_UNIT_KINDS = [
  "scoutSkiff",
  "salvager",
  "hunter",
  "escortFighter",
  "junkerGunship",
  "droneWrangler",
  "engineer",
  "shieldTender",
  "cargoHauler",
  "missileBarge",
  "harpoonVessel",
  "repairFrigate",
  "veteranCaptain",
  "nomadFlagship",
] as const;
export type NomadUnitKind = (typeof NOMAD_UNIT_KINDS)[number];

export const NOMAD_COMBAT_STYLES = [
  "mobility",
  "ambush",
  "hitAndRun",
  "harpoonWeapons",
  "trapDeployment",
  "droneAssistance",
  "retreat",
  "repair",
] as const;
export type NomadCombatStyle = (typeof NOMAD_COMBAT_STYLES)[number];

export const NOMAD_SPECIAL_MECHANICS = [
  "salvageRecovery",
  "deployableTurrets",
  "repairFields",
  "magneticHarpoons",
  "scrapShields",
  "cargoDrops",
  "droneRepair",
  "emergencyEscape",
  "empNets",
  "improvisedMinefields",
] as const;
export type NomadSpecialMechanic = (typeof NOMAD_SPECIAL_MECHANICS)[number];

/** What the fleet coordinates — six registered; three mechanically live. */
export const FLEET_COORDINATION_ACTIONS = [
  "targetPriority",
  "resourceRecovery",
  "emergencyRepairs",
  "escortProtection",
  "retreatRoutes",
  "salvageCollection",
] as const;
export type FleetCoordinationAction = (typeof FLEET_COORDINATION_ACTIONS)[number];

export const NOMAD_MINI_BOSS_KINDS = ["fleetCommander", "scrapTitan", "prototypeCarrier", "mercenaryWarlord", "nomadDreadnought", "ancientSalvager"] as const;
export type NomadMiniBossKind = (typeof NOMAD_MINI_BOSS_KINDS)[number];

export const NOMAD_ELITE_GAINS = [
  "prototypeSalvage",
  "experimentalWeapons",
  "uniquePaint",
  "legendaryCallsigns",
  "rareEquipment",
  "personalCombatStyle",
  "exceptionalRewards",
] as const;
export type NomadEliteGain = (typeof NOMAD_ELITE_GAINS)[number];

/** Visual Language (AF-052 §Visual Language) — binds to real art at the AF-002/006 asset pass. */
export const NOMAD_VISUAL_LANGUAGE = {
  style: "Mixed hull plating, repaired armour, civilian modifications, industrial welding, colourful markings",
  hullColour: "#8a7a5c",
  markingColour: "#e8862a",
  scrapColour: "#c4c4c4",
} as const;

/** Fleet tuning — the seventh doctrine: an actively-spent Scrap economy, not
 * a passive multiplier. Escort Protection is a fully independent, purely
 * headcount-derived input, not drawn from Scrap at all. */
export const NOMAD_FLEET_TUNING = {
  maxScrap: 100,
  scrapPerSecond: 2,
  /** Command Ship death throttles future income — "disrupts fleet cohesion" doesn't erase what's already banked. */
  disruptedIncomeFactor: 0.4,
  turretCost: 20,
  turretCooldownMs: 8000,
  shieldCost: 15,
  shieldCooldownMs: 6000,
  shieldBurstAmount: 12,
  repairCost: 10,
  repairCooldownMs: 5000,
  repairHealAmount: 15,
  /** Target Priority — continuous, scales with how well-resourced the fleet currently is. */
  targetPriorityBonusAtFullScrap: 0.25,
  /** Escort Protection — continuous, scales with living Escort Fighter headcount alone. */
  escortDamageReductionPerEscort: 0.08,
  maxEscortDamageReduction: 0.32,
} as const;

export const LORE_NOMAD_FLEET_CODEX = "LORE_NOMAD_FLEET_CODEX";

/** Sandbox Nomad roster — six units proving skiff/hunter/escort/gunship/
 * frigate/flagship doctrine over the unchanged AF-033 schema. */
export const NOMAD_ENEMIES: readonly EnemyDef[] = [
  {
    id: "scout-skiff",
    name: "Scout Skiff",
    family: "scout",
    roles: ["chaser"],
    lore: "Fast, cheap, and disposable by design — the fleet would rather lose ten skiffs than one real ship.",
    strengths: ["Quick, erratic passes"],
    weaknesses: ["No armour worth the name"],
    counterplay: "It's a distraction. Don't let it be the one that costs you the real fight.",
    hull: 18,
    shield: 2,
    movementBehaviour: "strafing",
    moveSpeed: 2.3,
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
    id: "hunter",
    name: "Hunter",
    family: "interceptor",
    roles: ["flanker"],
    lore: "The harpoon was salvaged off a mining rig decades before the pilot was born. It still works better than anything manufactured since.",
    strengths: ["Magnetic Harpoon roots a target at range, then the fleet closes"],
    weaknesses: ["The harpoon is a fixed-interval shot — dodge the tell and it wastes the cooldown"],
    counterplay: "Break line of sight right after it fires; the line goes slack and it has to reset.",
    hull: 26,
    shield: 6,
    movementBehaviour: "kiting",
    moveSpeed: 2.0,
    attack: {
      attackType: "projectile",
      mechanism: {
        kind: "ranged",
        weapon: {
          id: "harpoon-cannon",
          name: "Harpoon Cannon",
          category: "ballistic",
          manufacturer: "Stellar Nomads",
          tier: 1,
          rarity: "common",
          lore: "Rebuilt so many times it has outlived every hull it was ever bolted to.",
          damageSchool: "physical",
          damageSourceKind: "direct",
          baseDamage: 6,
          critChance: 0,
          critMultiplier: 1,
          fireIntervalMs: 2600,
          firePattern: "singleShot",
          projectilesPerShot: 1,
          projectileBehaviour: "returning", // first producer — AF-032's dormant returning projectile behaviour
          range: 9,
          projectileSpeed: 11,
          pierceCount: 0,
          explosionRadius: 0,
          statusOnHit: { kind: "stasis", chance: 0.5, strength: 1, durationMs: 900 }, // first producer — AF-021's dormant stasis status
          energyCost: 0,
          evolution: null,
        },
      },
      telegraphMs: 500,
    },
    specialAbility: null,
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "medium",
  },
  {
    id: "escort-fighter",
    name: "Escort Fighter",
    family: "fighter",
    roles: ["support"],
    lore: "Its job was never to win the fight. Its job is to make sure something else survives it.",
    strengths: ["Every Escort Fighter alive measurably hardens the whole fleet"],
    weaknesses: ["Unremarkable alone — its value is entirely in the count"],
    counterplay: "Thin the escorts first; the fleet gets easier to hurt with every one gone.",
    hull: 28,
    shield: 8,
    movementBehaviour: "formation",
    moveSpeed: 1.8,
    attack: {
      attackType: "melee",
      mechanism: { kind: "melee", baseDamage: 6, damageSchool: "physical", contactRangeUnits: 1.0, cooldownMs: 850 },
      telegraphMs: 240,
    },
    specialAbility: null,
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "medium",
  },
  {
    id: "junker-gunship",
    name: "Junker Gunship",
    family: "heavyAssault",
    roles: ["tank"],
    lore: "Three different hull classes welded into one. None of the original owners would recognise it, or want to.",
    strengths: ["Scrap Shields — raises a salvaged barrier when the fleet can afford it"],
    weaknesses: ["Slow, and the shield is only as good as the fleet's Scrap reserve"],
    counterplay: "Drain the fleet's Scrap with sustained pressure and its Scrap Shields stop coming.",
    hull: 62,
    shield: 20,
    movementBehaviour: "formation",
    moveSpeed: 1.1,
    attack: {
      attackType: "melee",
      mechanism: { kind: "melee", baseDamage: 10, damageSchool: "physical", contactRangeUnits: 1.2, cooldownMs: 1100 },
      telegraphMs: 350,
    },
    specialAbility: {
      kind: "deployShields",
      trigger: "onLowHealth",
      threshold: 1, // always eligible — the fleet's real Scrap Shield gating is computed at the composition root
      bonus: { kind: "shieldCapacity", value: 0 },
      cooldownMs: NOMAD_FLEET_TUNING.shieldCooldownMs,
    },
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "large",
  },
  {
    id: "repair-frigate",
    name: "Repair Frigate",
    family: "supportUnit",
    roles: ["healer"],
    lore: "Every panel on it has been cut from something else that stopped flying. It has never once stopped flying itself.",
    strengths: ["Emergency Repairs keep the fleet in the fight longer than it should be"],
    weaknesses: ["No weapon to speak of — it survives by staying behind the line"],
    counterplay: "Kill it and every repair the fleet was counting on stops arriving.",
    hull: 24,
    shield: 6,
    movementBehaviour: "orbiting",
    moveSpeed: 1.3,
    attack: {
      attackType: "melee",
      mechanism: { kind: "melee", baseDamage: 2, damageSchool: "physical", contactRangeUnits: 0.7, cooldownMs: 2000 },
      telegraphMs: 300,
    },
    specialAbility: {
      kind: "healAllies",
      trigger: "onLowHealth",
      threshold: 1,
      bonus: { kind: "shieldRegeneration", value: NOMAD_FLEET_TUNING.repairHealAmount / 5 },
      cooldownMs: NOMAD_FLEET_TUNING.repairCooldownMs,
    },
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "medium",
  },
  {
    id: "nomad-flagship",
    name: "Nomad Flagship",
    family: "destroyer",
    roles: ["elite", "tank", "commander"], // GP-002: a flagship IS the fleet's command vessel — the commander role, already real
    lore: "It has been rebuilt so many times the fleet stopped calling it by its old name. It is simply the ship that doesn't sink.",
    strengths: ["Missile Barrage covers a wide arc; vanishes the instant the fight turns"],
    weaknesses: ["Its command authority is the fleet's real strength — alone, it's just a very tough ship"],
    counterplay: "It's the Command Ship: dropping it doesn't end the fight, but it starves everything else of what's coming next.",
    hull: 115,
    shield: 35,
    movementBehaviour: "formation",
    moveSpeed: 1.2,
    attack: {
      attackType: "missile",
      mechanism: {
        kind: "ranged",
        weapon: {
          id: "nomad-missile-barrage",
          name: "Missile Barrage",
          category: "missile",
          manufacturer: "Stellar Nomads",
          tier: 2,
          rarity: "rare",
          lore: "Every tube fires from a different manufacturer. All of them still work.",
          damageSchool: "physical",
          damageSourceKind: "direct",
          baseDamage: 9,
          critChance: 0.05,
          critMultiplier: 1.5,
          fireIntervalMs: 2400,
          firePattern: "spread",
          projectilesPerShot: 3,
          projectileBehaviour: "seeking",
          range: 10,
          projectileSpeed: 9,
          pierceCount: 0,
          explosionRadius: 0.8,
          statusOnHit: null,
          energyCost: 0,
          evolution: null,
        },
      },
      telegraphMs: 550,
    },
    specialAbility: {
      kind: "cloak", // Emergency Escape, given a producer
      trigger: "onLowHealth",
      threshold: 0.3,
      bonus: { kind: "movementSpeed", value: 0.3 },
      cooldownMs: 9000,
    },
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "elite",
  },
];
