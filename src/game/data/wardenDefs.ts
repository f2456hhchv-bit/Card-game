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
};

export const WARDEN_LIST: WardenDef[] = Object.values(WARDEN_DEFS);

export function getWarden(id: string): WardenDef {
  return WARDEN_DEFS[id] ?? WARDEN_DEFS.lumen;
}
