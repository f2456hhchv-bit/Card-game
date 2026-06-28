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
};

/** Ordered list, convenient for the spawn director's availability filtering. */
export const ENEMY_LIST: EnemyDef[] = Object.values(ENEMY_DEFS);
