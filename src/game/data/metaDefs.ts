import type { DerivedStats } from "../entities/Player";

/**
 * Permanent meta-upgrades bought with Light Motes (the soft currency earned
 * each run). Unlike in-run relics, these persist forever and apply to the
 * Warden's *base* stats at the start of every future run — the long-term
 * "one more run" hook. Levels and costs live here; purchase state lives in the
 * save profile (`save.meta`).
 */
export interface MetaDef {
  id: string;
  name: string;
  description: string;
  hue: number;
  maxLevel: number;
  /** Mote cost to go from the given level to level+1. */
  cost(level: number): number;
  /** Apply this upgrade's effect at `level` onto the base stat block. */
  apply?(stats: DerivedStats, level: number): void;
  /** Per-level effect summary for the shop UI. */
  note(level: number): string;
}

/** Standard escalating cost curve. */
function curve(base: number) {
  return (level: number) => Math.round(base + base * level * 0.8);
}

export const META_DEFS: Record<string, MetaDef> = {
  might: {
    id: "might",
    name: "Might",
    description: "Permanently increases all damage.",
    hue: 10,
    maxLevel: 5,
    cost: curve(40),
    apply: (s, lvl) => (s.damageMult *= 1 + 0.05 * lvl),
    note: (lvl) => `Damage +${5 * lvl}%`,
  },
  vigor: {
    id: "vigor",
    name: "Vigor",
    description: "Permanently increases maximum vitality.",
    hue: 140,
    maxLevel: 5,
    cost: curve(35),
    apply: (s, lvl) => (s.maxHp += 8 * lvl),
    note: (lvl) => `Max HP +${8 * lvl}`,
  },
  haste: {
    id: "haste",
    name: "Haste",
    description: "Permanently increases movement speed.",
    hue: 90,
    maxLevel: 5,
    cost: curve(35),
    apply: (s, lvl) => (s.moveSpeed *= 1 + 0.04 * lvl),
    note: (lvl) => `Move speed +${4 * lvl}%`,
  },
  alacrity: {
    id: "alacrity",
    name: "Alacrity",
    description: "Permanently speeds up your weapons.",
    hue: 50,
    maxLevel: 5,
    cost: curve(45),
    apply: (s, lvl) => (s.attackSpeedMult *= 1 + 0.04 * lvl),
    note: (lvl) => `Attack speed +${4 * lvl}%`,
  },
  greed: {
    id: "greed",
    name: "Greed",
    description: "Permanently increases experience gained.",
    hue: 170,
    maxLevel: 5,
    cost: curve(30),
    apply: (s, lvl) => (s.xpMult *= 1 + 0.06 * lvl),
    note: (lvl) => `XP gain +${6 * lvl}%`,
  },
  resilience: {
    id: "resilience",
    name: "Resilience",
    description: "Permanently reduces incoming damage.",
    hue: 210,
    maxLevel: 5,
    cost: curve(50),
    apply: (s, lvl) => (s.armor += 0.03 * lvl),
    note: (lvl) => `Armor +${3 * lvl}%`,
  },
  magnetism: {
    id: "magnetism",
    name: "Magnetism",
    description: "Permanently widens light-shard pickup range.",
    hue: 200,
    maxLevel: 5,
    cost: curve(28),
    apply: (s, lvl) => (s.pickupRadius += 12 * lvl),
    note: (lvl) => `Pickup radius +${12 * lvl}`,
  },
  recovery: {
    id: "recovery",
    name: "Recovery",
    description: "Permanently regenerates vitality over time.",
    hue: 20,
    maxLevel: 3,
    cost: curve(60),
    apply: (s, lvl) => (s.regen += 0.3 * lvl),
    note: (lvl) => `Regen +${(0.3 * lvl).toFixed(1)}/s`,
  },
  fortune: {
    id: "fortune",
    name: "Fortune",
    description: "Permanently increases Light Motes earned per run.",
    hue: 48,
    maxLevel: 5,
    cost: curve(55),
    // No stat effect; mote multiplier handled by metaMoteMultiplier().
    note: (lvl) => `Motes earned +${8 * lvl}%`,
  },
};

export const META_LIST: MetaDef[] = Object.values(META_DEFS);

/** Apply all owned meta upgrades onto a base stat block. */
export function applyMeta(stats: DerivedStats, meta: Record<string, number>): void {
  for (const def of META_LIST) {
    const lvl = meta[def.id] ?? 0;
    if (lvl > 0 && def.apply) def.apply(stats, lvl);
  }
}

/** Light Motes earn multiplier from the Fortune upgrade. */
export function metaMoteMultiplier(meta: Record<string, number>): number {
  return 1 + (meta.fortune ?? 0) * 0.08;
}
