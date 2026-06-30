import type { DerivedStats } from "../entities/Player";

/**
 * Wardens — the playable characters. Each begins a run with a different
 * starting weapon and a small permanent stat tilt (perk), giving runs distinct
 * flavour. The first is free; the rest are unlocked with Light Motes. Selection
 * and unlock state live in the save profile.
 */
export interface WardenDef {
  id: string;
  name: string;
  description: string;
  hue: number;
  /** Weapon id this Warden starts the run with. */
  starterWeapon: string;
  /** Mote cost to unlock (0 = unlocked by default). */
  unlockCost: number;
  /** Short perk summary for the select screen. */
  perk: string;
  /** Applies the Warden's stat tilt onto the base stats. */
  applyPerk?: (stats: DerivedStats) => void;
}

export const WARDEN_DEFS: Record<string, WardenDef> = {
  lumen: {
    id: "lumen",
    name: "Lumen",
    description: "The first Warden — steady, balanced, dependable.",
    hue: 210,
    starterWeapon: "lumenBolt",
    unlockCost: 0,
    perk: "Balanced — no weaknesses",
  },
  vesper: {
    id: "vesper",
    name: "Vesper",
    description: "Channels wide, scattering light. Brilliant but fragile.",
    hue: 280,
    starterWeapon: "prismShards",
    unlockCost: 250,
    perk: "+15% Area, −10 Max HP",
    applyPerk: (s) => {
      s.areaMult *= 1.15;
      s.maxHp -= 10;
    },
  },
  pyre: {
    id: "pyre",
    name: "Pyre",
    description: "Burns with overwhelming force, but moves heavily.",
    hue: 20,
    starterWeapon: "novaPulse",
    unlockCost: 350,
    perk: "+12% Damage, −8% Move Speed",
    applyPerk: (s) => {
      s.damageMult *= 1.12;
      s.moveSpeed *= 0.92;
    },
  },
  surge: {
    id: "surge",
    name: "Surge",
    description: "Crackles with speed, arcing light between foes. Frail.",
    hue: 190,
    starterWeapon: "arcCoil",
    unlockCost: 350,
    perk: "+12% Attack Speed, −15 Max HP",
    applyPerk: (s) => {
      s.attackSpeedMult *= 1.12;
      s.maxHp -= 15;
    },
  },
  onyx: {
    id: "onyx",
    name: "Onyx",
    description: "An immovable bulwark of dark glass. Slow, but unbreakable.",
    hue: 25,
    starterWeapon: "glaiveRing",
    unlockCost: 400,
    perk: "+45 Max HP, +6% Armour, −8% Attack Speed",
    applyPerk: (s) => {
      s.maxHp += 45;
      s.armor += 0.06;
      s.attackSpeedMult *= 0.92;
    },
  },
  mira: {
    id: "mira",
    name: "Mira",
    description: "Warden of renewal — her light mends as it burns, but gently.",
    hue: 150,
    starterWeapon: "radiance",
    unlockCost: 400,
    perk: "+0.8 Regen/s, +12% Area, −8% Damage",
    applyPerk: (s) => {
      s.regen += 0.8;
      s.areaMult *= 1.12;
      s.damageMult *= 0.92;
    },
  },
  wren: {
    id: "wren",
    name: "Wren",
    description: "A swift hunter who looses a hail of seeking light. Fragile.",
    hue: 95,
    starterWeapon: "seekerSwarm",
    unlockCost: 450,
    perk: "+15% Projectile Speed, +8% Move Speed, −10 Max HP",
    applyPerk: (s) => {
      s.projectileSpeedMult *= 1.15;
      s.moveSpeed *= 1.08;
      s.maxHp -= 10;
    },
  },
};

export const WARDEN_LIST: WardenDef[] = Object.values(WARDEN_DEFS);

export function getWarden(id: string): WardenDef {
  return WARDEN_DEFS[id] ?? WARDEN_DEFS.lumen;
}

/**
 * Warden mastery — each Warden gains levels by being played, granting a small
 * permanent stat tilt to *that* Warden (rewards maining one without power-creep
 * for the rest). Capped so it stays a flavour bonus, not a wall.
 */
export const WARDEN_LEVEL_CAP = 20;

/** XP needed to go from `level` to `level + 1`. */
export function wardenXpToNext(level: number): number {
  return 80 + level * 60;
}

/** Apply the selected Warden's mastery-level bonus onto the stat block. */
export function applyWardenLevel(s: DerivedStats, level: number): void {
  const n = Math.min(Math.max(0, level), WARDEN_LEVEL_CAP);
  if (n <= 0) return;
  s.damageMult *= 1 + 0.01 * n;
  s.maxHp += 3 * n;
  s.attackSpeedMult *= 1 + 0.004 * n;
}

/** Human-readable mastery bonus at a given level. */
export function wardenLevelBonus(level: number): string {
  const n = Math.min(Math.max(0, level), WARDEN_LEVEL_CAP);
  return `+${n}% damage · +${3 * n} Max HP · +${(0.4 * n).toFixed(1)}% attack speed`;
}
