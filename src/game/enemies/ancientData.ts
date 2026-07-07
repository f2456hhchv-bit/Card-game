/**
 * Ancient Custodian faction content (AF-050). The fifth enemy faction,
 * built like AF-046/047/048/049: every unit is a plain AF-033 `EnemyDef`.
 * Where Outlaw squads SCATTER (binary), Machine networks DEGRADE (discrete
 * per-service flags), the Crystal Ecosystem WEAKENS (continuous, from a
 * living count), and the Void Swarm CORRUPTS (a value that climbs and
 * decays with time), the Ancient Custodians ESCALATE: a five-stage security
 * ladder — Minor Trespass, Warning, Containment, Guardian Deployment,
 * Maximum Response — driven by sustained player presence near a defended
 * site, continuously de-escalating the moment the player leaves, and
 * permanently capped lower every time a network node (a Shield Architect)
 * is destroyed. Unlike every prior doctrine, this one gets STRONGER as the
 * player lingers, not weaker as units die — the mirror-opposite direction.
 * `ancientCustodians` was a registered-but-unprofiled AF-039 FactionId
 * (like AF-046's Mercenary Guild) — this module pays off that content debt.
 */
import type { EnemyDef } from "./enemyData";

/** Core Units — thirteen registered; six carry full sandbox defs today. */
export const ANCIENT_UNIT_KINDS = [
  "sentinel",
  "observer",
  "guardianSphere",
  "defenceDrone",
  "custodianWalker",
  "archiveKeeper",
  "beaconWarden",
  "shieldArchitect",
  "energyConduit",
  "judicator",
  "oracleUnit",
  "vaultDefender",
  "templeGuardian",
  "ancientExecutor",
] as const;
export type AncientUnitKind = (typeof ANCIENT_UNIT_KINDS)[number];

export const ANCIENT_COMBAT_STYLES = [
  "areaProtection",
  "predictiveDefence",
  "shieldNetworks",
  "precisionWeapons",
  "zoneControl",
  "counterattacks",
  "environmentalActivation",
  "measuredEscalation",
] as const;
export type AncientCombatStyle = (typeof ANCIENT_COMBAT_STYLES)[number];

export const ANCIENT_SPECIAL_MECHANICS = [
  "lightBridges",
  "energyWalls",
  "ancientGlyphs",
  "rotatingDefences",
  "adaptiveBarriers",
  "securityFields",
  "defenceArrays",
  "guardianDrones",
  "energyMirrors",
  "vaultLocks",
] as const;
export type AncientSpecialMechanic = (typeof ANCIENT_SPECIAL_MECHANICS)[number];

/** The five-stage security ladder (AF-050 §Security System) — escalates up, never scatters or degrades. */
export const SECURITY_STAGES = ["minorTrespass", "warning", "containment", "guardianDeployment", "maximumResponse"] as const;
export type SecurityStage = (typeof SECURITY_STAGES)[number];

/** What the Ancient Network shares — six registered; three mechanically live. */
export const ANCIENT_NETWORK_TRAITS = [
  "energy",
  "shieldCapacity",
  "targetInformation",
  "threatAssessment",
  "repairFunctions",
  "securityProtocols",
] as const;
export type AncientNetworkTrait = (typeof ANCIENT_NETWORK_TRAITS)[number];

export const ANCIENT_MINI_BOSS_KINDS = [
  "vaultOverseer",
  "archiveIntelligence",
  "templeProtector",
  "guardianPrime",
  "ancientConstructor",
  "quantumSentinel",
] as const;
export type AncientMiniBossKind = (typeof ANCIENT_MINI_BOSS_KINDS)[number];

export const ANCIENT_ELITE_GAINS = [
  "ancientUpgrades",
  "prototypeWeapons",
  "perfectAccuracy",
  "enhancedShields",
  "uniqueGlyphPatterns",
  "rareRewards",
  "historicalRecords",
] as const;
export type AncientEliteGain = (typeof ANCIENT_ELITE_GAINS)[number];

/** Visual Language (AF-050 §Visual Language) — binds to real art at the AF-002/006 asset pass. */
export const ANCIENT_VISUAL_LANGUAGE = {
  style: "White ceramic armour, gold structural frames, blue-white energy, floating architecture, ancient glyphs",
  ceramicColour: "#f2f0e8",
  frameColour: "#d4af4a",
  energyColour: "#8fd8ff",
} as const;

/** Security escalation tuning — the fifth doctrine: a discrete stage ladder
 * driven by a continuous meter that climbs with sustained player presence,
 * de-escalates the moment the player leaves, and is permanently capped
 * lower by every network-node kill (the ceiling shrinks; it never resets). */
export const ANCIENT_SECURITY_TUNING = {
  maxAlert: 1,
  escalatePerSecondPresent: 0.05,
  deescalatePerSecondAbsent: 0.04,
  /** Distance from any living Custodian at which the player counts as "trespassing". */
  siteRadius: 10,
  healPerSecondAtMaxResponse: 5,
  damageBonusAtMaxResponse: 0.35,
  incomingDamageReductionAtMaxResponse: 0.25,
  /** Guardian Deployment (stage 3) gets real teeth — a capped, cadence-gated reinforcement, reusing AF-047's factory pattern. */
  guardianDeployIntervalMs: 5000,
  maxGuardianDeployments: 2,
} as const;

/** Ascending alert-level thresholds (fraction of `maxAlert`) at which each stage begins. */
export const SECURITY_STAGE_THRESHOLDS: Readonly<Record<SecurityStage, number>> = {
  minorTrespass: 0,
  warning: 0.2,
  containment: 0.45,
  guardianDeployment: 0.7,
  maximumResponse: 0.9,
};

export const LORE_ANCIENT_CUSTODIANS_CODEX = "LORE_ANCIENT_CUSTODIANS_CODEX";

/** Sandbox Ancient Custodian roster — six units proving sentinel/drone/
 * sphere/architect/walker/executor doctrine over the unchanged AF-033
 * schema. Every def uses the `ancientGuardian` family (previously carrying
 * only AF-048's single Crystal Titan def; every fingerprint below is
 * distinct from it and from every other faction's roster). */
export const ANCIENT_ENEMIES: readonly EnemyDef[] = [
  {
    id: "sentinel",
    name: "Sentinel",
    family: "ancientGuardian",
    roles: ["chaser"],
    lore: "It has walked the same perimeter for ten thousand years and never once found a reason to stop.",
    strengths: ["Never tires, never wavers — a patrol that predates every empire the player has heard of"],
    weaknesses: ["Rarely pursues past its perimeter — disengaging genuinely ends the fight"],
    counterplay: "It defends a line, not a grudge. Step back and it stands down.",
    hull: 26,
    shield: 8,
    movementBehaviour: "orbiting",
    moveSpeed: 1.7,
    attack: {
      attackType: "melee",
      mechanism: { kind: "melee", baseDamage: 7, damageSchool: "physical", contactRangeUnits: 1.0, cooldownMs: 850 },
      telegraphMs: 250,
    },
    specialAbility: null,
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "small",
  },
  {
    id: "defence-drone",
    name: "Defence Drone",
    family: "ancientGuardian",
    roles: ["disruptor"],
    lore: "Precision built to a standard nothing since has matched — every shot lands exactly where the system decided it would.",
    strengths: ["Precision Lance fire strips shielding with surgical reliability"],
    weaknesses: ["Holds range rather than closing — predictable positioning once spotted"],
    counterplay: "Break line of sight; it will not chase you into it.",
    hull: 22,
    shield: 10,
    movementBehaviour: "kiting",
    moveSpeed: 1.8,
    attack: {
      attackType: "projectile",
      mechanism: {
        kind: "ranged",
        weapon: {
          id: "precision-lance",
          name: "Precision Lance",
          category: "ancient", // first use of the dormant `ancient` WeaponCategory
          manufacturer: "Ancient Custodians",
          tier: 1,
          rarity: "common",
          lore: "Millennia old and still perfectly calibrated — nothing built since has needed to improve on it.",
          damageSchool: "energy",
          damageSourceKind: "direct",
          baseDamage: 6,
          critChance: 0.05,
          critMultiplier: 1.5,
          fireIntervalMs: 2000,
          firePattern: "singleShot",
          projectilesPerShot: 1,
          projectileBehaviour: "piercing",
          range: 9,
          projectileSpeed: 12,
          pierceCount: 1,
          explosionRadius: 0,
          statusOnHit: { kind: "armourBreak", chance: 0.5, strength: 3, durationMs: 3000 }, // first producer — AF-021's dormant armourBreak status
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
    id: "guardian-sphere",
    name: "Guardian Sphere",
    family: "ancientGuardian",
    roles: ["flanker"],
    lore: "A perfect geometry with no visible drive system. It simply goes where it decided to be.",
    strengths: ["Fast, erratic strafing makes it a poor target"],
    weaknesses: ["Light frame — built for speed and coverage, not durability"],
    counterplay: "It commits to a strafing lane; punish the moment it does.",
    hull: 20,
    shield: 6,
    movementBehaviour: "strafing",
    moveSpeed: 2.2,
    attack: {
      attackType: "melee",
      mechanism: { kind: "melee", baseDamage: 6, damageSchool: "energy", contactRangeUnits: 0.9, cooldownMs: 700 },
      telegraphMs: 220,
    },
    specialAbility: null,
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "small",
  },
  {
    id: "shield-architect",
    name: "Shield Architect",
    family: "ancientGuardian",
    roles: ["support"],
    lore: "It does not fight for the vault. It fights for the network everything else fights through.",
    strengths: ["Every Custodian nearby shares its Shield Capacity while it stands"],
    weaknesses: ["No offence worth the name — its value is entirely structural"],
    counterplay: "Destroying it doesn't just remove a shield — it permanently caps how far the site's alert can ever climb again.",
    hull: 30,
    shield: 16,
    movementBehaviour: "formation",
    moveSpeed: 1.0,
    attack: {
      attackType: "melee",
      mechanism: { kind: "melee", baseDamage: 3, damageSchool: "energy", contactRangeUnits: 0.7, cooldownMs: 1800 },
      telegraphMs: 300,
    },
    specialAbility: {
      kind: "deployShields",
      trigger: "onLowHealth",
      threshold: 1, // always eligible — the network's real strength is computed at the composition root
      bonus: { kind: "shieldCapacity", value: 0 },
      cooldownMs: 0,
    },
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "medium",
  },
  {
    id: "custodian-walker",
    name: "Custodian Walker",
    family: "ancientGuardian",
    roles: ["tank"],
    lore: "It was built to answer force with more force. Ten thousand years of practice have not changed the answer.",
    strengths: ["Counterattacks scale up the longer a fight against it continues"],
    weaknesses: ["Slow — it never needed to close distance itself"],
    counterplay: "Ancient design or not, sustained damage still works. Just don't linger.",
    hull: 70,
    shield: 22,
    movementBehaviour: "formation",
    moveSpeed: 1.1,
    attack: {
      attackType: "melee",
      mechanism: { kind: "melee", baseDamage: 11, damageSchool: "physical", contactRangeUnits: 1.2, cooldownMs: 1200 },
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
    id: "ancient-executor",
    name: "Ancient Executor",
    family: "ancientGuardian",
    roles: ["elite", "tank"],
    lore: "The Custodians' final answer. It does not warn. By the time it fires, the warning already happened.",
    strengths: ["Judgment Beam ends a fight it decides has gone on too long"],
    weaknesses: ["Its true threat is the site's escalation — arriving before Warning has climbed leaves it merely dangerous"],
    counterplay: "Keep the site's alert low; an Executor fighting alone is a hard fight, not an unfair one.",
    hull: 105,
    shield: 40,
    movementBehaviour: "formation",
    moveSpeed: 1.0,
    attack: {
      attackType: "beam",
      mechanism: {
        kind: "ranged",
        weapon: {
          id: "judgment-beam",
          name: "Judgment Beam",
          category: "ancient",
          manufacturer: "Ancient Custodians",
          tier: 2,
          rarity: "rare",
          lore: "It was never a weapon of war. It was a weapon of certainty.",
          damageSchool: "energy",
          damageSourceKind: "direct",
          baseDamage: 12,
          critChance: 0.1,
          critMultiplier: 1.5,
          fireIntervalMs: 2600,
          firePattern: "singleShot",
          projectilesPerShot: 1,
          projectileBehaviour: "piercing",
          range: 10,
          projectileSpeed: 14,
          pierceCount: 2,
          explosionRadius: 0,
          statusOnHit: { kind: "armourBreak", chance: 0.7, strength: 4, durationMs: 3500 },
          energyCost: 0,
          evolution: null,
        },
      },
      telegraphMs: 700,
    },
    specialAbility: {
      kind: "spawnReinforcements", // Guardian Deployment, given a literal producer
      trigger: "onLowHealth",
      threshold: 1,
      bonus: { kind: "damage", value: 0 },
      cooldownMs: ANCIENT_SECURITY_TUNING.guardianDeployIntervalMs,
    },
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "elite",
  },
];
