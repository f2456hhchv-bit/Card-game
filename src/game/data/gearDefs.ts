import type { DerivedStats } from "../entities/Player";

/**
 * Ship Modules — the Guardian's equippable gear. Each module is a permanent
 * meta item that levels up by **merging duplicates** (genre-standard gear
 * fusion). Every grade adds stats; reaching the **max grade unlocks a signature
 * perk** (a special ability). Acquisition is via end-of-run drops; merge state
 * lives in the save profile (`save.modules` → { grade, dupes }).
 *
 * The Guardian is a starship, so slots are ship systems rather than armour.
 */
export interface ModuleState {
  /** Current grade, 1..maxGrade. 0 = not owned. */
  grade: number;
  /** Duplicate cores banked toward the next merge. */
  dupes: number;
}

export interface GearDef {
  id: string;
  name: string;
  /** Ship-system slot label. */
  slot: string;
  description: string;
  hue: number;
  icon: string;
  maxGrade: number;
  /** Cumulative stat effect at the given grade (1..maxGrade). */
  apply: (s: DerivedStats, grade: number) => void;
  /** Signature perk unlocked at max grade. */
  perk: { name: string; description: string };
}

/** Duplicates needed to merge from `grade` to `grade + 1` (1,2,3,4 → 10 total). */
export function mergeCost(grade: number): number {
  return grade;
}

export const GEAR_DEFS: Record<string, GearDef> = {
  plating: {
    id: "plating",
    name: "Aegis Plating",
    slot: "Hull",
    description: "Reinforced hull plating. +Max HP and armour per grade.",
    hue: 210,
    icon: "🛡",
    maxGrade: 5,
    apply: (s, g) => {
      s.maxHp += 7 * g;
      s.armor += 0.02 * g;
      if (g >= 5) s.revive += 1; // Aegis perk
    },
    perk: {
      name: "Aegis",
      description: "Once per run, survive a lethal hit and recover to 35% HP.",
    },
  },
  reactor: {
    id: "reactor",
    name: "Solar Reactor",
    slot: "Core",
    description: "Overcharged power core. +Damage per grade.",
    hue: 20,
    icon: "⚛",
    maxGrade: 5,
    apply: (s, g) => {
      s.damageMult *= 1 + 0.04 * g;
      if (g >= 5) s.pulseDamage = 26; // Overdrive perk
    },
    perk: {
      name: "Overdrive",
      description: "Emit a damaging light pulse around the ship every few seconds.",
    },
  },
  thrusters: {
    id: "thrusters",
    name: "Ion Thrusters",
    slot: "Engines",
    description: "Tuned ion drives. +Move speed and pickup range per grade.",
    hue: 160,
    icon: "🚀",
    maxGrade: 5,
    apply: (s, g) => {
      s.moveSpeed *= 1 + 0.03 * g;
      s.pickupRadius += 9 * g;
      if (g >= 5) s.iframes += 0.25; // Slipstream perk
    },
    perk: {
      name: "Slipstream",
      description: "Longer invulnerability after each hit — slip through danger.",
    },
  },
  wings: {
    id: "wings",
    name: "Strike Wings",
    slot: "Wings",
    description: "Weaponised stabiliser wings. +Attack speed and area per grade.",
    hue: 280,
    icon: "🪽",
    maxGrade: 5,
    apply: (s, g) => {
      s.attackSpeedMult *= 1 + 0.03 * g;
      s.areaMult *= 1 + 0.025 * g;
      if (g >= 5) s.extraProjectiles += 1; // Salvo perk
    },
    perk: {
      name: "Salvo",
      description: "Every weapon fires one additional projectile.",
    },
  },
};

export const GEAR_LIST: GearDef[] = Object.values(GEAR_DEFS);

/** Apply all owned modules onto a base stat block. */
export function applyGear(
  stats: DerivedStats,
  modules: Record<string, ModuleState>,
): void {
  for (const def of GEAR_LIST) {
    const m = modules[def.id];
    if (m && m.grade > 0) def.apply(stats, Math.min(m.grade, def.maxGrade));
  }
}
