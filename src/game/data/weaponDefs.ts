import type { ProjectileStyle } from "../entities/Projectile";

/**
 * Firing pattern handled by the WeaponSystem. Each maps to a branch in the
 * system's `fire()` dispatcher.
 *  - nearest : aim a volley at the nearest enemy
 *  - spread  : fan of projectiles around the facing direction
 *  - radial  : evenly distributed burst in all directions (nova)
 *  - orbit   : persistent orbs circling the Warden
 *  - aura    : continuous damage field around the Warden
 */
export type WeaponPattern = "nearest" | "spread" | "radial" | "orbit" | "aura";

export interface WeaponLevel {
  /** Damage per projectile/tick. */
  damage: number;
  /** Seconds between activations (before attack-speed modifiers). */
  cooldown: number;
  /** Projectiles per activation (orbs for orbit, ignored for aura). */
  count: number;
  /** Enemies each projectile can hit. */
  pierce: number;
  /** Projectile speed (world units/sec) or orbit radius for orbit weapons. */
  speed: number;
  /** Area/size multiplier for this level. */
  area: number;
  /** Knockback impulse. */
  knockback: number;
  /** Human-readable summary of what this level adds, for the upgrade UI. */
  note: string;
}

export interface WeaponDef {
  id: string;
  name: string;
  description: string;
  pattern: WeaponPattern;
  style: ProjectileStyle;
  hue: number;
  maxLevel: number;
  /** Whether this is the default starting weapon. */
  starter?: boolean;
  /** Per-level stats; index 0 is level 1. */
  levels: WeaponLevel[];
}

export const WEAPON_DEFS: Record<string, WeaponDef> = {
  lumenBolt: {
    id: "lumenBolt",
    name: "Lumen Bolt",
    description: "Looses a bolt of focused light at the nearest Hollow.",
    pattern: "nearest",
    style: "bolt",
    hue: 205,
    maxLevel: 8,
    starter: true,
    levels: [
      { damage: 9, cooldown: 0.85, count: 1, pierce: 1, speed: 460, area: 1, knockback: 90, note: "A single seeking bolt." },
      { damage: 11, cooldown: 0.8, count: 1, pierce: 1, speed: 470, area: 1, knockback: 95, note: "+Damage." },
      { damage: 12, cooldown: 0.72, count: 2, pierce: 1, speed: 480, area: 1, knockback: 95, note: "Fires 2 bolts." },
      { damage: 14, cooldown: 0.68, count: 2, pierce: 2, speed: 500, area: 1.05, knockback: 100, note: "+Pierce." },
      { damage: 16, cooldown: 0.6, count: 3, pierce: 2, speed: 510, area: 1.05, knockback: 105, note: "Fires 3 bolts." },
      { damage: 19, cooldown: 0.56, count: 3, pierce: 2, speed: 530, area: 1.1, knockback: 110, note: "+Damage." },
      { damage: 22, cooldown: 0.5, count: 4, pierce: 3, speed: 550, area: 1.1, knockback: 115, note: "Fires 4 bolts, +Pierce." },
      { damage: 27, cooldown: 0.44, count: 4, pierce: 4, speed: 580, area: 1.15, knockback: 125, note: "Mastery: rapid piercing volley." },
    ],
  },

  prismShards: {
    id: "prismShards",
    name: "Prism Shards",
    description: "Scatters a fan of crystalline light shards.",
    pattern: "spread",
    style: "shard",
    hue: 280,
    maxLevel: 8,
    levels: [
      { damage: 7, cooldown: 1.1, count: 3, pierce: 1, speed: 420, area: 1, knockback: 60, note: "A 3-shard fan." },
      { damage: 8, cooldown: 1.05, count: 3, pierce: 1, speed: 430, area: 1, knockback: 62, note: "+Damage." },
      { damage: 9, cooldown: 1.0, count: 4, pierce: 1, speed: 440, area: 1, knockback: 64, note: "+1 shard." },
      { damage: 10, cooldown: 0.95, count: 4, pierce: 2, speed: 450, area: 1.05, knockback: 66, note: "+Pierce." },
      { damage: 12, cooldown: 0.9, count: 5, pierce: 2, speed: 460, area: 1.05, knockback: 68, note: "+1 shard." },
      { damage: 14, cooldown: 0.85, count: 6, pierce: 2, speed: 470, area: 1.1, knockback: 70, note: "+1 shard." },
      { damage: 16, cooldown: 0.8, count: 7, pierce: 3, speed: 480, area: 1.1, knockback: 74, note: "+1 shard, +Pierce." },
      { damage: 20, cooldown: 0.72, count: 9, pierce: 3, speed: 500, area: 1.15, knockback: 80, note: "Mastery: a wall of shards." },
    ],
  },

  halo: {
    id: "halo",
    name: "Warden's Halo",
    description: "Orbs of light orbit the Warden, shredding nearby Hollow.",
    pattern: "orbit",
    style: "orb",
    hue: 50,
    maxLevel: 8,
    levels: [
      { damage: 8, cooldown: 0, count: 2, pierce: 999, speed: 70, area: 1, knockback: 70, note: "2 orbiting orbs." },
      { damage: 10, cooldown: 0, count: 2, pierce: 999, speed: 74, area: 1.05, knockback: 72, note: "+Damage." },
      { damage: 11, cooldown: 0, count: 3, pierce: 999, speed: 78, area: 1.05, knockback: 74, note: "+1 orb." },
      { damage: 13, cooldown: 0, count: 3, pierce: 999, speed: 82, area: 1.1, knockback: 76, note: "+Radius." },
      { damage: 15, cooldown: 0, count: 4, pierce: 999, speed: 86, area: 1.1, knockback: 78, note: "+1 orb." },
      { damage: 18, cooldown: 0, count: 4, pierce: 999, speed: 92, area: 1.15, knockback: 82, note: "+Damage." },
      { damage: 21, cooldown: 0, count: 5, pierce: 999, speed: 96, area: 1.2, knockback: 86, note: "+1 orb." },
      { damage: 26, cooldown: 0, count: 6, pierce: 999, speed: 104, area: 1.3, knockback: 92, note: "Mastery: a ring of six." },
    ],
  },

  novaPulse: {
    id: "novaPulse",
    name: "Nova Pulse",
    description: "Releases a radial burst of light in every direction.",
    pattern: "radial",
    style: "arc",
    hue: 330,
    maxLevel: 8,
    levels: [
      { damage: 10, cooldown: 2.4, count: 6, pierce: 1, speed: 360, area: 1, knockback: 130, note: "6-way burst." },
      { damage: 12, cooldown: 2.3, count: 7, pierce: 1, speed: 365, area: 1, knockback: 132, note: "+1 ray." },
      { damage: 14, cooldown: 2.2, count: 8, pierce: 1, speed: 370, area: 1.05, knockback: 134, note: "+1 ray." },
      { damage: 16, cooldown: 2.05, count: 9, pierce: 2, speed: 375, area: 1.05, knockback: 138, note: "+Pierce." },
      { damage: 19, cooldown: 1.9, count: 10, pierce: 2, speed: 385, area: 1.1, knockback: 142, note: "+1 ray." },
      { damage: 22, cooldown: 1.75, count: 12, pierce: 2, speed: 395, area: 1.15, knockback: 146, note: "+2 rays." },
      { damage: 26, cooldown: 1.6, count: 14, pierce: 3, speed: 405, area: 1.2, knockback: 152, note: "+2 rays, +Pierce." },
      { damage: 33, cooldown: 1.4, count: 18, pierce: 3, speed: 420, area: 1.3, knockback: 165, note: "Mastery: a supernova ring." },
    ],
  },

  radiance: {
    id: "radiance",
    name: "Radiance",
    description: "A searing aura of light burns all Hollow that draw near.",
    pattern: "aura",
    style: "orb",
    hue: 180,
    maxLevel: 8,
    levels: [
      { damage: 5, cooldown: 0.5, count: 1, pierce: 999, speed: 70, area: 1, knockback: 30, note: "A burning aura." },
      { damage: 6, cooldown: 0.5, count: 1, pierce: 999, speed: 76, area: 1.05, knockback: 30, note: "+Damage." },
      { damage: 7, cooldown: 0.46, count: 1, pierce: 999, speed: 82, area: 1.1, knockback: 32, note: "+Radius." },
      { damage: 8, cooldown: 0.46, count: 1, pierce: 999, speed: 88, area: 1.15, knockback: 34, note: "+Damage." },
      { damage: 10, cooldown: 0.42, count: 1, pierce: 999, speed: 96, area: 1.2, knockback: 36, note: "+Radius." },
      { damage: 12, cooldown: 0.42, count: 1, pierce: 999, speed: 104, area: 1.25, knockback: 38, note: "+Damage." },
      { damage: 14, cooldown: 0.38, count: 1, pierce: 999, speed: 112, area: 1.35, knockback: 42, note: "Faster, larger." },
      { damage: 18, cooldown: 0.34, count: 1, pierce: 999, speed: 124, area: 1.5, knockback: 48, note: "Mastery: a sun's corona." },
    ],
  },
};

export const WEAPON_LIST: WeaponDef[] = Object.values(WEAPON_DEFS);

export function getStarterWeapon(): WeaponDef {
  return WEAPON_LIST.find((w) => w.starter) ?? WEAPON_DEFS.lumenBolt;
}
