/**
 * Celestial Conclave faction content (AF-054). The ninth enemy faction.
 * Every prior faction's bonus is ONE shared value or flag for the entire
 * squad (a timer, service flags, a recomputed count, a decaying level, an
 * escalating ladder, a monotonic ratchet, an earned economy, a threshold
 * event). The Celestial Conclave is the first where the bonus is LOCAL and
 * PER-ENTITY: a Constellation is a graph of specific pairwise links (not a
 * single hub-and-spoke network), and each living entity's bonus scales
 * with its OWN surviving link count — two members can have entirely
 * different bonus magnitudes at the same instant, something no prior
 * doctrine's single shared number could ever produce. "Destroying anchor
 * entities destabilises nearby formations" needs no special-cased anchor
 * flag at all: an anchor is simply whichever unit the constellation's
 * graph gives the highest degree, so killing it costs ALL its neighbours
 * a link simultaneously — a real cascade, emerging from the graph shape
 * itself rather than a bespoke rule. The Conclave are ancient cosmic
 * consciousness, not a civilisation — like AF-049/051/053, it gets no
 * AF-039 `FactionDef`.
 */
import type { EnemyDef } from "./enemyData";
import type { HazardZoneDef } from "../bosses/BossArena";

/** Core Units — thirteen registered; six carry full sandbox defs today. */
export const CELESTIAL_UNIT_KINDS = [
  "solarSpark",
  "photonWarden",
  "stellarSentinel",
  "nebulaWeaver",
  "gravityOracle",
  "pulsarHunter",
  "coronaGuardian",
  "quasarShepherd",
  "novaHerald",
  "eventHorizonKeeper",
  "constellationAvatar",
  "celestialArbiter",
  "livingSupernova",
] as const;
export type CelestialUnitKind = (typeof CELESTIAL_UNIT_KINDS)[number];

export const CELESTIAL_COMBAT_STYLES = [
  "orbitalMovement",
  "gravityControl",
  "solarRadiation",
  "energyWaves",
  "longRangePrecision",
  "celestialSummons",
  "constellationPatterns",
  "areaManipulation",
] as const;
export type CelestialCombatStyle = (typeof CELESTIAL_COMBAT_STYLES)[number];

export const CELESTIAL_SPECIAL_MECHANICS = [
  "solarFlares",
  "gravityWells",
  "photonBeams",
  "orbitalConstructs",
  "plasmaStorms",
  "constellationNetworks",
  "lightBridges",
  "solarWinds",
  "magneticFields",
  "energyCollapse",
] as const;
export type CelestialSpecialMechanic = (typeof CELESTIAL_SPECIAL_MECHANICS)[number];

/** What a Constellation shares — six registered; three mechanically live, and
 * all three are computed PER-ENTITY from its own link count, not once for the whole squad. */
export const CELESTIAL_NETWORK_TRAITS = [
  "solarEnergy",
  "shieldStrength",
  "orbitalAwareness",
  "healing",
  "constellationLinks",
  "abilitySynchronisation",
] as const;
export type CelestialNetworkTrait = (typeof CELESTIAL_NETWORK_TRAITS)[number];

export const COSMIC_MANIPULATION_ACTIONS = [
  "alterGravity",
  "redirectProjectiles",
  "createOrbitalHazards",
  "generateMiniatureStars",
  "manipulateSolarWinds",
  "distortLight",
  "createSafeZones",
  "collapseUnstableEnergy",
] as const;
export type CosmicManipulationAction = (typeof COSMIC_MANIPULATION_ACTIONS)[number];

export const CELESTIAL_MINI_BOSS_KINDS = ["novaGuardian", "pulsarMonarch", "quasarIntelligence", "solarLeviathan", "celestialPrime", "livingConstellation"] as const;
export type CelestialMiniBossKind = (typeof CELESTIAL_MINI_BOSS_KINDS)[number];

export const CELESTIAL_ELITE_GAINS = [
  "rareStellarForms",
  "uniqueConstellations",
  "enhancedSolarCores",
  "astronomicalAbilities",
  "ancientStarMemory",
  "exceptionalRewards",
] as const;
export type CelestialEliteGain = (typeof CELESTIAL_ELITE_GAINS)[number];

/** Visual Language (AF-054 §Visual Language) — binds to real art at the AF-002/006 asset pass. */
export const CELESTIAL_VISUAL_LANGUAGE = {
  style: "Solar plasma, golden-white energy, nebula clouds, orbiting particles, gravitational lensing, halo effects",
  plasmaColour: "#fff3c4",
  novaColour: "#ffd24d",
  voidTraceColour: "#7fa8ff",
} as const;

/** Constellation tuning — the ninth doctrine: bonuses computed per-entity
 * from its own surviving link count in a graph, not from one shared value. */
export const CONSTELLATION_TUNING = {
  /** Hard cap on how many surviving links can contribute to any one entity's bonus. */
  maxContributingLinks: 4,
  solarEnergyDamageBonusPerLink: 0.06,
  shieldStrengthReductionPerLink: 0.05,
  healPerSecondPerLink: 0.8,
} as const;

/** Gravity Well tuning — AF-035's exact hazard engine, a sixth reuse. */
export const GRAVITY_WELL_TUNING = {
  radius: 2.2,
  tickIntervalMs: 750,
  damagePerTick: 5,
  seedIntervalMs: 6000,
  maxLiveWells: 4,
} as const;

export function createGravityWell(id: string, x: number, y: number): HazardZoneDef {
  return {
    id,
    x,
    y,
    radius: GRAVITY_WELL_TUNING.radius,
    tickIntervalMs: GRAVITY_WELL_TUNING.tickIntervalMs,
    damagePerTick: GRAVITY_WELL_TUNING.damagePerTick,
    statusOnTick: null,
  };
}

export const LORE_CELESTIAL_CONCLAVE_CODEX = "LORE_CELESTIAL_CONCLAVE_CODEX";

/** Sandbox Celestial roster — six units proving spark/hunter/oracle/avatar/
 * guardian/supernova doctrine over the unchanged AF-033 schema. */
export const CELESTIAL_ENEMIES: readonly EnemyDef[] = [
  {
    id: "solar-spark",
    name: "Solar Spark",
    family: "scout",
    roles: ["chaser"],
    lore: "A fragment thrown off something far larger, still burning exactly as bright.",
    strengths: ["Orbits before it commits, reading an opening"],
    weaknesses: ["Small, and entirely alone once it commits"],
    counterplay: "It telegraphs its approach angle during the orbit — punish the commitment, not the orbit.",
    hull: 20,
    shield: 4,
    movementBehaviour: "orbiting",
    moveSpeed: 1.9,
    attack: {
      attackType: "melee",
      mechanism: { kind: "melee", baseDamage: 5, damageSchool: "energy", contactRangeUnits: 1.0, cooldownMs: 750 },
      telegraphMs: 220,
    },
    specialAbility: null,
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "small",
  },
  {
    id: "pulsar-hunter",
    name: "Pulsar Hunter",
    family: "interceptor",
    roles: ["sniper"],
    lore: "It doesn't fire a weapon. It simply lets a fraction of what it already is pass through you.",
    strengths: ["Pulsar Beam strips shielding at long range"],
    weaknesses: ["A fixed-interval beam — the interval never changes once you've clocked it"],
    counterplay: "Break line of sight on the beat; the beam cannot bend to follow.",
    hull: 26,
    shield: 8,
    movementBehaviour: "kiting",
    moveSpeed: 1.7,
    attack: {
      attackType: "beam",
      mechanism: {
        kind: "ranged",
        weapon: {
          id: "pulsar-beam",
          name: "Pulsar Beam",
          category: "orbital",
          manufacturer: "Celestial Conclave",
          tier: 1,
          rarity: "common",
          lore: "Not aimed. Simply unblocked, for exactly as long as it chooses.",
          damageSchool: "energy",
          damageSourceKind: "beam",
          baseDamage: 7,
          critChance: 0.05,
          critMultiplier: 1.5,
          fireIntervalMs: 2400,
          firePattern: "singleShot",
          projectilesPerShot: 1,
          projectileBehaviour: "straight",
          range: 10,
          projectileSpeed: 13,
          pierceCount: 1,
          explosionRadius: 0,
          statusOnHit: { kind: "shieldBreak", chance: 0.5, strength: 3, durationMs: 2500 }, // first producer — AF-021's dormant shieldBreak status
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
    id: "gravity-oracle",
    name: "Gravity Oracle",
    family: "artillery",
    roles: ["areaDenial"],
    lore: "It does not attack the player. It simply makes the space around them a little heavier.",
    strengths: ["Seeds Gravity Wells that reshape the battlefield while it lives"],
    weaknesses: ["No offence, low hull"],
    counterplay: "Kill it fast — every second alive is more of the arena lost to gravity.",
    hull: 24,
    shield: 8,
    movementBehaviour: "retreat",
    moveSpeed: 1.4,
    attack: {
      attackType: "melee",
      mechanism: { kind: "melee", baseDamage: 2, damageSchool: "energy", contactRangeUnits: 0.7, cooldownMs: 2000 },
      telegraphMs: 300,
    },
    specialAbility: {
      kind: "createHazards",
      trigger: "onLowHealth",
      threshold: 1, // always eligible — the seeding cadence is governed at the composition root
      bonus: { kind: "damage", value: 0 },
      cooldownMs: GRAVITY_WELL_TUNING.seedIntervalMs,
    },
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "medium",
  },
  {
    id: "constellation-avatar",
    name: "Constellation Avatar",
    family: "livingStructure",
    roles: ["support"],
    lore: "It is not the brightest point in the formation. It is simply the one every other point is drawn to.",
    strengths: ["Every entity linked to it shares in what it provides — the formation's true anchor"],
    weaknesses: ["Its value is entirely structural; alone it offers little"],
    counterplay: "It's the highest-degree point in the formation — breaking it costs every neighbour a link at once.",
    hull: 30,
    shield: 12,
    movementBehaviour: "formation",
    moveSpeed: 1.0,
    attack: {
      attackType: "melee",
      mechanism: { kind: "melee", baseDamage: 3, damageSchool: "energy", contactRangeUnits: 0.8, cooldownMs: 1800 },
      telegraphMs: 300,
    },
    specialAbility: {
      kind: "boostAllies",
      trigger: "onLowHealth",
      threshold: 1,
      bonus: { kind: "damage", value: 0 },
      cooldownMs: 0,
    },
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "medium",
  },
  {
    id: "corona-guardian",
    name: "Corona Guardian",
    family: "supportUnit",
    roles: ["tank"],
    lore: "Its shell is the same plasma that would otherwise burn everything nearby. It simply decided not to let go of it.",
    strengths: ["Heavy shield capacity, replenished at need"],
    weaknesses: ["Slow — it never needed to close distance"],
    counterplay: "Its resilience is real, not a trick. Commit the damage or disengage.",
    hull: 64,
    shield: 26,
    movementBehaviour: "formation",
    moveSpeed: 1.1,
    attack: {
      attackType: "melee",
      mechanism: { kind: "melee", baseDamage: 9, damageSchool: "energy", contactRangeUnits: 1.2, cooldownMs: 1150 },
      telegraphMs: 350,
    },
    specialAbility: {
      kind: "deployShields",
      trigger: "onLowHealth",
      threshold: 0.5,
      bonus: { kind: "shieldCapacity", value: 18 },
      cooldownMs: 8000,
    },
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "large",
  },
  {
    id: "living-supernova",
    name: "Living Supernova",
    family: "machineUnit",
    roles: ["elite", "tank"],
    lore: "It has already died once, on a scale nothing nearby can measure. It kept most of what it was anyway.",
    strengths: ["A dying star's whole violence, still under control — barely"],
    weaknesses: ["Its true scale depends on the Constellation around it; alone, it is merely enormous"],
    counterplay: "Break its links before you break its hull; an isolated Supernova hits far softer.",
    hull: 125,
    shield: 45,
    movementBehaviour: "formation",
    moveSpeed: 1.0,
    attack: {
      attackType: "nova",
      mechanism: {
        kind: "ranged",
        weapon: {
          id: "supernova-burst",
          name: "Supernova Burst",
          category: "orbital",
          manufacturer: "Celestial Conclave",
          tier: 2,
          rarity: "rare",
          lore: "A controlled fraction of the same event that made it what it is.",
          damageSchool: "energy",
          damageSourceKind: "area",
          baseDamage: 9,
          critChance: 0.05,
          critMultiplier: 1.5,
          fireIntervalMs: 2600,
          firePattern: "nova",
          projectilesPerShot: 7,
          projectileBehaviour: "straight",
          range: 8,
          projectileSpeed: 8,
          pierceCount: 0,
          explosionRadius: 1.2,
          statusOnHit: null,
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
      cooldownMs: 7000,
    },
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "elite",
  },
];
