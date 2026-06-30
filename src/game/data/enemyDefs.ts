import type { EnemyBehaviour } from "../entities/Enemy";

/**
 * Static definition for an enemy archetype (a member of the Hollow).
 * Runtime `Enemy` instances are stamped from these. Stats here are at the
 * reference difficulty; the spawn director scales them up over time.
 */
export interface EnemyDef {
  id: string;
  name: string;
  behaviour: EnemyBehaviour;
  hp: number;
  speed: number;
  damage: number;
  radius: number;
  xpValue: number;
  /** Base colour hue for the procedural body. */
  hue: number;
  /** Relative spawn weight in the standard pool. */
  weight: number;
  /** Minutes into the run before this type begins appearing. */
  unlockAtMinutes: number;
  /** If true, never spawned by the director directly — only summoned/split. */
  summonOnly?: boolean;
  /** On death, spawn this many of `splitInto` (a splitter enemy). */
  splitInto?: string;
  splitCount?: number;
}

/**
 * The Hollow bestiary. Kept intentionally small for milestone 1; expanded in
 * the Enemy Catalogue as content milestones land.
 */
export const ENEMY_DEFS: Record<string, EnemyDef> = {
  drifter: {
    id: "drifter",
    name: "Drifter",
    behaviour: "chase",
    hp: 10,
    speed: 58,
    damage: 6,
    radius: 13,
    xpValue: 1,
    hue: 280,
    weight: 100,
    unlockAtMinutes: 0,
  },
  mote: {
    id: "mote",
    name: "Mote",
    behaviour: "chase",
    hp: 5,
    speed: 84,
    damage: 4,
    radius: 9,
    xpValue: 1,
    hue: 200,
    weight: 60,
    unlockAtMinutes: 0.5,
  },
  husk: {
    id: "husk",
    name: "Husk",
    behaviour: "chase",
    hp: 34,
    speed: 44,
    damage: 12,
    radius: 18,
    xpValue: 3,
    hue: 24,
    weight: 45,
    unlockAtMinutes: 2,
  },
  lunger: {
    id: "lunger",
    name: "Lunger",
    behaviour: "charger",
    hp: 22,
    speed: 70,
    damage: 14,
    radius: 14,
    xpValue: 3,
    hue: 340,
    weight: 35,
    unlockAtMinutes: 3.5,
  },
  wisp: {
    id: "wisp",
    name: "Wisp",
    behaviour: "orbiter",
    hp: 16,
    speed: 96,
    damage: 8,
    radius: 11,
    xpValue: 2,
    hue: 160,
    weight: 30,
    unlockAtMinutes: 5,
  },
  caster: {
    id: "caster",
    name: "Caster",
    behaviour: "shooter",
    hp: 20,
    speed: 70,
    damage: 10,
    radius: 13,
    xpValue: 4,
    hue: 320,
    weight: 28,
    unlockAtMinutes: 4,
  },
  spore: {
    id: "spore",
    name: "Spore",
    behaviour: "chase",
    hp: 30,
    speed: 50,
    damage: 10,
    radius: 17,
    xpValue: 3,
    hue: 95,
    weight: 32,
    unlockAtMinutes: 2.5,
    // Bursts into a cluster of fast Sporelings when destroyed.
    splitInto: "sporeling",
    splitCount: 3,
  },
  sporeling: {
    id: "sporeling",
    name: "Sporeling",
    behaviour: "chase",
    hp: 5,
    speed: 118,
    damage: 6,
    radius: 8,
    xpValue: 1,
    hue: 85,
    weight: 0,
    unlockAtMinutes: 0,
    summonOnly: true, // only created by a Spore splitting
  },
  // ---- The Fade (stage 1) additions -------------------------------------
  seer: {
    id: "seer",
    name: "Seer",
    behaviour: "orbiter",
    hp: 24,
    speed: 88,
    damage: 9,
    radius: 12,
    xpValue: 3,
    hue: 265,
    weight: 26,
    unlockAtMinutes: 4,
  },
  lancer: {
    id: "lancer",
    name: "Lancer",
    behaviour: "charger",
    hp: 30,
    speed: 86,
    damage: 13,
    radius: 13,
    xpValue: 3,
    hue: 285,
    weight: 24,
    unlockAtMinutes: 4.5,
  },
  // ---- Ember Wastes (stage 2) natives -----------------------------------
  cinder: {
    id: "cinder",
    name: "Cinder",
    behaviour: "chase",
    hp: 16,
    speed: 104,
    damage: 8,
    radius: 11,
    xpValue: 2,
    hue: 18,
    weight: 70,
    unlockAtMinutes: 0,
  },
  revenant: {
    id: "revenant",
    name: "Revenant",
    behaviour: "shooter",
    hp: 42,
    speed: 60,
    damage: 15,
    radius: 16,
    xpValue: 5,
    hue: 6,
    weight: 24,
    unlockAtMinutes: 2,
  },
  // ---- Hollow Deep (stage 3) natives ------------------------------------
  shard: {
    id: "shard",
    name: "Shard",
    behaviour: "chase",
    hp: 18,
    speed: 110,
    damage: 9,
    radius: 11,
    xpValue: 2,
    hue: 195,
    weight: 70,
    unlockAtMinutes: 0,
  },
  colossus: {
    id: "colossus",
    name: "Colossus",
    behaviour: "charger",
    hp: 52,
    speed: 74,
    damage: 18,
    radius: 19,
    xpValue: 6,
    hue: 210,
    weight: 22,
    unlockAtMinutes: 2,
  },
};

/** Ordered list, convenient for the spawn director's availability filtering. */
export const ENEMY_LIST: EnemyDef[] = Object.values(ENEMY_DEFS);
