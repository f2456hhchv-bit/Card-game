/**
 * Eclipsed faction content (AF-055). The tenth enemy faction — and the
 * first that is a mirror, not a force. Every prior doctrine reads only its
 * own faction's state (AF-050 alone reads the player's *position*). The
 * Eclipsed are the first whose strength reads what the player has BECOME:
 * Ability Mimicry scales their power with the player's own progression
 * level, capped for fairness — "they represent what the player could
 * eventually become" is a number, not just lore. Independently, every
 * member walks its OWN five-stage corruption timeline (Recently Lost →
 * Corrupted → Broken → Consumed → Irrecoverable), staggered at spawn and
 * jumped forward by grief every time an ally dies — killing the group
 * faster paradoxically pushes the survivors further from themselves, the
 * tragedy made mechanical. Memory Echoes surface as non-interruptive text
 * on a capped cadence, pure world-building. They are former humans, not a
 * civilisation and not a polity — no AF-039 `FactionDef`, the same framing
 * as AF-049/051/053/054, but for the opposite, sadder reason.
 */
import type { EnemyDef } from "./enemyData";

/** Core Units — thirteen registered; six carry full sandbox defs today. */
export const ECLIPSED_UNIT_KINDS = [
  "lostScout",
  "brokenPilot",
  "corruptedEngineer",
  "eclipsedHunter",
  "shadowCommander",
  "fallenGuardian",
  "distortedCarrier",
  "echoDrone",
  "memoryWarden",
  "voidSurvivor",
  "forgottenCaptain",
  "lostFleetVessel",
  "eclipsedChampion",
] as const;
export type EclipsedUnitKind = (typeof ECLIPSED_UNIT_KINDS)[number];

export const ECLIPSED_COMBAT_STYLES = [
  "unpredictableTactics",
  "hybridTechnology",
  "corruptedAbilities",
  "brokenFormations",
  "aggressiveFlanking",
  "desperationAttacks",
  "memoryEchoes",
  "mixedWeaponSystems",
] as const;
export type EclipsedCombatStyle = (typeof ECLIPSED_COMBAT_STYLES)[number];

export const ECLIPSED_SPECIAL_MECHANICS = [
  "memoryEchoes",
  "corruptionBursts",
  "brokenShieldCycles",
  "abilityMimicry",
  "ghostImages",
  "shipMalfunctions",
  "unstableWarpJumps",
  "corruptedEquipment",
  "memoryFragments",
  "identityCollapse",
] as const;
export type EclipsedSpecialMechanic = (typeof ECLIPSED_SPECIAL_MECHANICS)[number];

/** The five-stage personal fall (AF-055 §Corruption Levels) — walked per-member, never as a squad. */
export const ECLIPSED_CORRUPTION_STAGES = ["recentlyLost", "corrupted", "broken", "consumed", "irrecoverable"] as const;
export type EclipsedCorruptionStage = (typeof ECLIPSED_CORRUPTION_STAGES)[number];

/** What the Memory System replays — five registered kinds; live today as text echoes. */
export const MEMORY_ECHO_KINDS = ["radioMessages", "commanderOrders", "distressCalls", "scientificRecordings", "personalMemories"] as const;
export type MemoryEchoKind = (typeof MEMORY_ECHO_KINDS)[number];

/** Non-interruptive world-building lines (AF-055 §Memory System) — cycled deterministically, never randomised. */
export const ECLIPSED_ECHO_LINES = [
  "“...expedition log, day 400. We are not lost. We are not lost. We are—”",
  "“Hold formation. Hold formation. Captain? Captain, please respond.”",
  "“This is survey vessel Longreach — anyone. Anyone at all.”",
  "“...sample exceeds containment rating. Recommend immediate— recommend— recommend—”",
  "“Tell them we made it to the gate. Tell them that part first.”",
  "“I remember the launch. I remember the launch. I remember—”",
] as const;

export const ECLIPSED_MINI_BOSS_KINDS = ["lostAdmiral", "corruptedFleetLeader", "fallenCommander", "brokenTitan", "voidSurvivor", "echoSovereign"] as const;
export type EclipsedMiniBossKind = (typeof ECLIPSED_MINI_BOSS_KINDS)[number];

export const ECLIPSED_ELITE_GAINS = [
  "uniqueHistories",
  "namedIdentities",
  "prototypeEquipment",
  "commanderAbilities",
  "legendaryRecords",
  "rareRewards",
] as const;
export type EclipsedEliteGain = (typeof ECLIPSED_ELITE_GAINS)[number];

/** Visual Language (AF-055 §Visual Language) — binds to real art at the AF-002/006 asset pass. */
export const ECLIPSED_VISUAL_LANGUAGE = {
  style: "Damaged armour, flickering lights, broken insignias, fragmented holograms, ghost-like motion",
  hullColour: "#5a5f6b",
  corruptionColour: "#a04dff",
  memoryColour: "#c9d4e8",
} as const;

/** Corruption tuning — the tenth doctrine: per-member personal timelines
 * plus player-mimicry, both hard-capped for fairness. */
export const ECLIPSED_CORRUPTION_TUNING = {
  /** Time a member spends in each stage before slipping to the next. */
  stageDurationMs: 8000,
  /** Members spawn staggered along their falls — no two begin at the same point. */
  memberStaggerMs: 4000,
  /** Grief — every ally death pushes each survivor's own clock forward. */
  griefJumpMs: 5000,
  /** While the Memory Warden lives, every survivor's fall runs at this fraction of full speed. */
  wardenSlowFactor: 0.5,
  /** Per-stage stepped bonuses, from the member's OWN stage index (0..4). */
  damageBonusPerStage: 0.05,
  speedBonusPerStage: 0.04,
  /** Ability Mimicry — strength drawn from the player's own progression level. */
  mimicryDamagePerPlayerLevel: 0.02,
  maxMimicryDamageBonus: 0.2,
  /** Memory Echoes — non-interruptive, cadence-gated, lifetime-capped per encounter. */
  echoIntervalMs: 7000,
  maxEchoesPerEncounter: 5,
} as const;

export const LORE_ECLIPSED_CODEX = "LORE_ECLIPSED_CODEX";

/** Sandbox Eclipsed roster — six units proving scout/pilot/warden/guardian/
 * drone/champion doctrine over the unchanged AF-033 schema. */
export const ECLIPSED_ENEMIES: readonly EnemyDef[] = [
  {
    id: "lost-scout",
    name: "Lost Scout",
    family: "scout",
    roles: ["chaser", "ambusher"], // GP-002: its own ambush movementBehaviour IS the ambusher role, already real
    lore: "Still flying its original survey pattern, decades after the survey ended. It only breaks pattern when something comes close.",
    strengths: ["Ghost-quiet until approached — then it closes fast"],
    weaknesses: ["Paper-thin; whatever it was protecting itself for is long gone"],
    counterplay: "It only wakes when you near it — give its patrol line a wide berth, or meet it on your terms.",
    hull: 19,
    shield: 2,
    movementBehaviour: "ambush", // first base-def producer — AF-033's dormant ambush movement behaviour
    moveSpeed: 2.2,
    attack: {
      attackType: "melee",
      mechanism: { kind: "melee", baseDamage: 5, damageSchool: "physical", contactRangeUnits: 1.0, cooldownMs: 750 },
      telegraphMs: 220,
    },
    specialAbility: null,
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "small",
  },
  {
    id: "broken-pilot",
    name: "Broken Pilot",
    family: "fighter",
    roles: ["flanker"],
    lore: "The flying is still perfect. Whoever taught them would be proud, if the rest of them were still there to be proud of.",
    strengths: ["Unstable Warp Jumps — the drive misfires mid-strafe and drops it somewhere you weren't watching"],
    weaknesses: ["The jumps are malfunctions, not tactics — the cadence is fixed and readable"],
    counterplay: "The salvaged laser still telegraphs like a trained pilot's — because it is one. Read the tell, not the position.",
    hull: 27,
    shield: 8,
    movementBehaviour: "strafing",
    moveSpeed: 2.0,
    attack: {
      attackType: "projectile",
      mechanism: {
        kind: "ranged",
        weapon: {
          id: "flickering-lance",
          name: "Flickering Lance",
          category: "laser",
          manufacturer: "The Eclipsed",
          tier: 1,
          rarity: "common",
          lore: "Alliance-issue, three refits past its service life. The targeting reticle still shows a callsign nobody answers to.",
          damageSchool: "energy",
          damageSourceKind: "direct",
          baseDamage: 6,
          critChance: 0.05,
          critMultiplier: 1.5,
          fireIntervalMs: 2200,
          firePattern: "burst",
          projectilesPerShot: 2,
          projectileBehaviour: "straight",
          range: 9,
          projectileSpeed: 12,
          pierceCount: 0,
          explosionRadius: 0,
          statusOnHit: null,
          energyCost: 0,
          evolution: null,
        },
      },
      telegraphMs: 480,
    },
    specialAbility: {
      kind: "teleport", // first base-def producer — until now only AF-034's elite tiers carried this ability kind
      trigger: "onLowHealth",
      threshold: 0.4,
      bonus: { kind: "movementSpeed", value: 0.2 },
      cooldownMs: 7000,
    },
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "medium",
  },
  {
    id: "echo-drone",
    name: "Echo Drone",
    family: "drone",
    roles: ["disruptor"],
    lore: "It broadcasts fragments of its expedition's final week on loop. It does not know the transmission ended years ago.",
    strengths: ["Erratic orbits and constant noise make it hard to prioritise"],
    weaknesses: ["It is a recording with a hull — nothing more"],
    counterplay: "Its orbit is regular even when its signal isn't. Time the pass.",
    hull: 21,
    shield: 4,
    movementBehaviour: "orbiting",
    moveSpeed: 2.0,
    attack: {
      attackType: "melee",
      mechanism: { kind: "melee", baseDamage: 4, damageSchool: "energy", contactRangeUnits: 0.9, cooldownMs: 900 },
      telegraphMs: 240,
    },
    specialAbility: null,
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "small",
  },
  {
    id: "memory-warden",
    name: "Memory Warden",
    family: "supportUnit",
    roles: ["support"],
    lore: "It carries the crew manifest and reads it to the others. As long as it survives, they remember being people a little longer.",
    strengths: ["Its presence steadies the whole group — their falls slow while it holds the manifest"],
    weaknesses: ["No offence; it was an archivist, and still is"],
    counterplay: "Killing it is mercy or cruelty, depending on how you count — the survivors slip faster without it.",
    hull: 28,
    shield: 10,
    movementBehaviour: "formation",
    moveSpeed: 1.0,
    attack: {
      attackType: "melee",
      mechanism: { kind: "melee", baseDamage: 2, damageSchool: "energy", contactRangeUnits: 0.7, cooldownMs: 1900 },
      telegraphMs: 300,
    },
    specialAbility: {
      kind: "boostAllies",
      trigger: "onLowHealth",
      threshold: 1, // always eligible — the real per-member corruption maths run at the composition root
      bonus: { kind: "damage", value: 0 },
      cooldownMs: 0,
    },
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "medium",
  },
  {
    id: "fallen-guardian",
    name: "Fallen Guardian",
    family: "heavyAssault",
    roles: ["tank"],
    lore: "It was the one that stayed behind so the others could run. It is still holding that line. There is nothing behind it any more.",
    strengths: ["Desperation charges — it closes directly, the way defenders do when there is nothing left to defend"],
    weaknesses: ["Slow to turn; its charge commits completely"],
    counterplay: "Sidestep the charge and it overshoots — the discipline is gone, only the courage is left.",
    hull: 68,
    shield: 22,
    movementBehaviour: "directPursuit",
    moveSpeed: 1.3,
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
    id: "eclipsed-champion",
    name: "Eclipsed Champion",
    family: "heavyAssault",
    roles: ["elite", "tank", "commander"], // GP-002: its own lore ("A Commander, once") IS the commander role, already real
    lore: "A Commander, once. The service record is still legible on the hull. The name on it is the reward for winning.",
    strengths: ["Fights like the player fights — mixed weapons, commander instincts, everything you'd do, done back to you"],
    weaknesses: ["Its strength mirrors yours — meet it early in your run and it is only what you were"],
    counterplay: "It grows as you grow. There is no outleveling it — only outplaying what you would have done.",
    hull: 118,
    shield: 42,
    movementBehaviour: "formation",
    moveSpeed: 1.1,
    attack: {
      attackType: "projectile",
      mechanism: {
        kind: "ranged",
        weapon: {
          id: "commanders-sidearm",
          name: "Commander's Sidearm",
          category: "plasma",
          manufacturer: "The Eclipsed",
          tier: 2,
          rarity: "rare",
          lore: "Officer-issue, engraved. The engraving is the only part of the name anyone can still read.",
          damageSchool: "energy",
          damageSourceKind: "direct",
          baseDamage: 8,
          critChance: 0.08,
          critMultiplier: 1.5,
          fireIntervalMs: 2300,
          firePattern: "spread",
          projectilesPerShot: 3,
          projectileBehaviour: "straight",
          range: 9,
          projectileSpeed: 10,
          pierceCount: 0,
          explosionRadius: 0,
          statusOnHit: { kind: "corruption", chance: 0.4, strength: 2, durationMs: 3000 },
          energyCost: 0,
          evolution: null,
        },
      },
      telegraphMs: 550,
    },
    specialAbility: {
      kind: "enrage", // Identity Collapse — what's left when the name finally goes
      trigger: "onLowHealth",
      threshold: 0.3,
      bonus: { kind: "damage", value: 0.25 },
      cooldownMs: 9000,
    },
    eliteModifier: null,
    deathEvents: ["xp", "loot", "missionProgress", "achievements"],
    xpTier: "elite",
  },
];
