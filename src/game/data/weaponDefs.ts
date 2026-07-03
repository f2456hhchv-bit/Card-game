import type { ProjectileStyle } from "../entities/Projectile";

/**
 * Firing pattern handled by the WeaponSystem. Each maps to a branch in the
 * system's `fire()` dispatcher.
 *  - nearest : aim a volley at the nearest enemy
 *  - spread  : fan of projectiles around the facing direction
 *  - radial  : evenly distributed burst in all directions (nova)
 *  - orbit   : persistent orbs circling the Warden
 *  - aura    : continuous damage field around the Warden
 *  - chain   : instant arc of light that leaps between nearby enemies
 */
export type WeaponPattern =
  | "nearest"
  | "spread"
  | "radial"
  | "orbit"
  | "aura"
  | "chain";

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

/**
 * Evolution requirement. A weapon at max level paired with the named relic at
 * (or above) `relicLevel` becomes eligible to evolve into the `into` weapon —
 * the genre's signature build-defining payoff.
 */
export interface EvolutionReq {
  /** Id of the evolved weapon this turns into. */
  into: string;
  /** Relic that must be owned to unlock the evolution. */
  relic: string;
  /** Minimum level of that relic. */
  relicLevel: number;
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
  /** Evolution pairing, if this weapon can evolve. */
  evolution?: EvolutionReq;
  /** True for evolved forms — excluded from the normal "new weapon" pool. */
  evolved?: boolean;
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
    evolution: { into: "sunlance", relic: "keenEdge", relicLevel: 3 },
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
    evolution: { into: "prismaticStorm", relic: "resonator", relicLevel: 3 },
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
    evolution: { into: "aegisCorona", relic: "rapidCharm", relicLevel: 3 },
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
    evolution: { into: "cataclysm", relic: "focusLens", relicLevel: 3 },
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
    evolution: { into: "solaris", relic: "emberHeart", relicLevel: 3 },
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

  arcCoil: {
    id: "arcCoil",
    name: "Arc Coil",
    description: "Looses an arc of light that leaps between nearby Hollow.",
    pattern: "chain",
    style: "arc",
    hue: 190,
    maxLevel: 8,
    // For chain weapons: `count` = number of targets struck, `speed` = the
    // distance the arc can leap between targets.
    evolution: { into: "tempestCoil", relic: "tidalCharm", relicLevel: 3 },
    levels: [
      { damage: 8, cooldown: 1.0, count: 3, pierce: 0, speed: 180, area: 1, knockback: 40, note: "Arcs to 3 foes." },
      { damage: 10, cooldown: 0.95, count: 3, pierce: 0, speed: 190, area: 1, knockback: 42, note: "+Damage." },
      { damage: 11, cooldown: 0.9, count: 4, pierce: 0, speed: 200, area: 1.05, knockback: 44, note: "Arcs to 4 foes." },
      { damage: 13, cooldown: 0.85, count: 4, pierce: 0, speed: 210, area: 1.05, knockback: 46, note: "+Damage." },
      { damage: 15, cooldown: 0.8, count: 5, pierce: 0, speed: 220, area: 1.1, knockback: 48, note: "Arcs to 5 foes." },
      { damage: 18, cooldown: 0.74, count: 6, pierce: 0, speed: 235, area: 1.1, knockback: 50, note: "Arcs to 6 foes." },
      { damage: 21, cooldown: 0.68, count: 7, pierce: 0, speed: 250, area: 1.15, knockback: 54, note: "Arcs to 7 foes." },
      { damage: 26, cooldown: 0.6, count: 9, pierce: 0, speed: 270, area: 1.2, knockback: 60, note: "Mastery: a forking storm." },
    ],
  },

  seekerSwarm: {
    id: "seekerSwarm",
    name: "Seeker Swarm",
    description: "A swarm of small, fast bolts that hound the nearest Hollow.",
    pattern: "nearest",
    style: "dart",
    hue: 150,
    maxLevel: 8,
    evolution: { into: "hornetCloud", relic: "lodestone", relicLevel: 3 },
    levels: [
      { damage: 5, cooldown: 0.7, count: 2, pierce: 1, speed: 520, area: 0.9, knockback: 50, note: "Two darting bolts." },
      { damage: 6, cooldown: 0.66, count: 3, pierce: 1, speed: 530, area: 0.9, knockback: 52, note: "+1 bolt." },
      { damage: 7, cooldown: 0.62, count: 3, pierce: 1, speed: 540, area: 0.95, knockback: 54, note: "+Damage." },
      { damage: 8, cooldown: 0.56, count: 4, pierce: 1, speed: 550, area: 0.95, knockback: 56, note: "+1 bolt." },
      { damage: 9, cooldown: 0.52, count: 5, pierce: 2, speed: 560, area: 1, knockback: 58, note: "+1 bolt, +Pierce." },
      { damage: 11, cooldown: 0.48, count: 6, pierce: 2, speed: 575, area: 1, knockback: 60, note: "+1 bolt." },
      { damage: 13, cooldown: 0.44, count: 7, pierce: 2, speed: 590, area: 1.05, knockback: 64, note: "+1 bolt." },
      { damage: 16, cooldown: 0.38, count: 9, pierce: 3, speed: 610, area: 1.1, knockback: 70, note: "Mastery: a stinging cloud." },
    ],
  },

  glaiveRing: {
    id: "glaiveRing",
    name: "Glaive Ring",
    description: "Heavy spinning glaives orbit the Warden, hurling foes back.",
    pattern: "orbit",
    style: "glaive",
    hue: 15,
    maxLevel: 8,
    evolution: { into: "sawstorm", relic: "wardPlate", relicLevel: 3 },
    levels: [
      { damage: 14, cooldown: 0, count: 1, pierce: 999, speed: 64, area: 1.2, knockback: 140, note: "One heavy glaive." },
      { damage: 17, cooldown: 0, count: 1, pierce: 999, speed: 68, area: 1.25, knockback: 146, note: "+Damage." },
      { damage: 20, cooldown: 0, count: 2, pierce: 999, speed: 72, area: 1.3, knockback: 152, note: "+1 glaive." },
      { damage: 23, cooldown: 0, count: 2, pierce: 999, speed: 78, area: 1.35, knockback: 160, note: "+Radius." },
      { damage: 27, cooldown: 0, count: 3, pierce: 999, speed: 84, area: 1.4, knockback: 168, note: "+1 glaive." },
      { damage: 31, cooldown: 0, count: 3, pierce: 999, speed: 90, area: 1.45, knockback: 176, note: "+Damage." },
      { damage: 36, cooldown: 0, count: 4, pierce: 999, speed: 96, area: 1.55, knockback: 186, note: "+1 glaive." },
      { damage: 44, cooldown: 0, count: 4, pierce: 999, speed: 106, area: 1.7, knockback: 200, note: "Mastery: a whirling wall of steel." },
    ],
  },

  frostFan: {
    id: "frostFan",
    name: "Frost Fan",
    description: "A wide fan of piercing frost shards that punch through ranks.",
    pattern: "spread",
    style: "crystal",
    hue: 200,
    maxLevel: 8,
    evolution: { into: "permafrost", relic: "vitalCore", relicLevel: 3 },
    levels: [
      { damage: 9, cooldown: 1.2, count: 4, pierce: 2, speed: 380, area: 1.05, knockback: 70, note: "A piercing 4-shard fan." },
      { damage: 10, cooldown: 1.14, count: 4, pierce: 2, speed: 388, area: 1.05, knockback: 72, note: "+Damage." },
      { damage: 12, cooldown: 1.08, count: 5, pierce: 2, speed: 396, area: 1.1, knockback: 74, note: "+1 shard." },
      { damage: 13, cooldown: 1.02, count: 5, pierce: 3, speed: 404, area: 1.1, knockback: 76, note: "+Pierce." },
      { damage: 15, cooldown: 0.96, count: 6, pierce: 3, speed: 414, area: 1.15, knockback: 80, note: "+1 shard." },
      { damage: 18, cooldown: 0.9, count: 6, pierce: 3, speed: 424, area: 1.2, knockback: 84, note: "+Damage." },
      { damage: 21, cooldown: 0.84, count: 7, pierce: 4, speed: 436, area: 1.25, knockback: 88, note: "+1 shard, +Pierce." },
      { damage: 26, cooldown: 0.76, count: 8, pierce: 5, speed: 460, area: 1.35, knockback: 96, note: "Mastery: a glacial broadside." },
    ],
  },

  // ---- Evolved forms ----------------------------------------------------
  // Reached by evolving a mastered base weapon paired with its relic. These
  // reuse existing firing patterns (no new WeaponSystem branches) but with
  // dramatically stronger stats and a distinct golden-tier identity. They are
  // excluded from the normal draft pool via `evolved: true`.

  sunlance: {
    id: "sunlance",
    name: "Sunlance",
    description: "Lumen Bolt reforged into a piercing lance of pure daylight.",
    pattern: "nearest",
    style: "lance",
    hue: 45,
    maxLevel: 5,
    evolved: true,
    levels: [
      { damage: 42, cooldown: 0.4, count: 5, pierce: 6, speed: 660, area: 1.3, knockback: 150, note: "Evolved: piercing daylight volley." },
      { damage: 50, cooldown: 0.36, count: 5, pierce: 7, speed: 680, area: 1.35, knockback: 156, note: "+Damage, +Pierce." },
      { damage: 58, cooldown: 0.33, count: 6, pierce: 8, speed: 700, area: 1.4, knockback: 162, note: "+1 lance." },
      { damage: 66, cooldown: 0.31, count: 6, pierce: 9, speed: 720, area: 1.45, knockback: 170, note: "+Damage, +Pierce." },
      { damage: 78, cooldown: 0.28, count: 7, pierce: 10, speed: 760, area: 1.5, knockback: 180, note: "Zenith: an unbroken spear of light." },
    ],
  },

  prismaticStorm: {
    id: "prismaticStorm",
    name: "Prismatic Storm",
    description: "Prism Shards unbound into a relentless storm of light.",
    pattern: "spread",
    style: "star",
    hue: 300,
    maxLevel: 5,
    evolved: true,
    levels: [
      { damage: 30, cooldown: 0.62, count: 11, pierce: 4, speed: 560, area: 1.3, knockback: 100, note: "Evolved: a storm front of shards." },
      { damage: 35, cooldown: 0.58, count: 12, pierce: 4, speed: 575, area: 1.35, knockback: 104, note: "+1 shard, +Damage." },
      { damage: 40, cooldown: 0.54, count: 13, pierce: 5, speed: 590, area: 1.4, knockback: 108, note: "+1 shard, +Pierce." },
      { damage: 45, cooldown: 0.5, count: 15, pierce: 5, speed: 610, area: 1.45, knockback: 114, note: "+2 shards." },
      { damage: 54, cooldown: 0.45, count: 17, pierce: 6, speed: 640, area: 1.55, knockback: 124, note: "Zenith: a tempest of cutting light." },
    ],
  },

  aegisCorona: {
    id: "aegisCorona",
    name: "Aegis Corona",
    description: "The Warden's Halo blazes into an encircling corona of suns.",
    pattern: "orbit",
    style: "orb",
    hue: 55,
    maxLevel: 5,
    evolved: true,
    levels: [
      { damage: 38, cooldown: 0, count: 6, pierce: 999, speed: 120, area: 1.5, knockback: 120, note: "Evolved: six blazing suns." },
      { damage: 46, cooldown: 0, count: 6, pierce: 999, speed: 128, area: 1.55, knockback: 124, note: "+Damage." },
      { damage: 52, cooldown: 0, count: 7, pierce: 999, speed: 136, area: 1.6, knockback: 128, note: "+1 sun." },
      { damage: 58, cooldown: 0, count: 8, pierce: 999, speed: 144, area: 1.7, knockback: 134, note: "+1 sun, +Radius." },
      { damage: 70, cooldown: 0, count: 9, pierce: 999, speed: 156, area: 1.85, knockback: 144, note: "Zenith: a crown of nine suns." },
    ],
  },

  cataclysm: {
    id: "cataclysm",
    name: "Cataclysm",
    description: "Nova Pulse overloaded into world-shaking detonations.",
    pattern: "radial",
    style: "arc",
    hue: 8,
    maxLevel: 5,
    evolved: true,
    levels: [
      { damage: 48, cooldown: 1.2, count: 18, pierce: 3, speed: 460, area: 1.4, knockback: 200, note: "Evolved: a cataclysmic ring." },
      { damage: 56, cooldown: 1.12, count: 20, pierce: 3, speed: 470, area: 1.45, knockback: 208, note: "+2 rays, +Damage." },
      { damage: 64, cooldown: 1.04, count: 22, pierce: 4, speed: 480, area: 1.5, knockback: 216, note: "+2 rays, +Pierce." },
      { damage: 72, cooldown: 0.96, count: 24, pierce: 4, speed: 495, area: 1.6, knockback: 226, note: "+2 rays." },
      { damage: 86, cooldown: 0.88, count: 28, pierce: 5, speed: 515, area: 1.75, knockback: 244, note: "Zenith: the sky falls." },
    ],
  },

  solaris: {
    id: "solaris",
    name: "Solaris",
    description: "Radiance ascended into a miniature sun that scours the dark.",
    pattern: "aura",
    style: "orb",
    hue: 38,
    maxLevel: 5,
    evolved: true,
    levels: [
      { damage: 24, cooldown: 0.3, count: 1, pierce: 999, speed: 150, area: 1.7, knockback: 60, note: "Evolved: a scouring corona." },
      { damage: 28, cooldown: 0.3, count: 1, pierce: 999, speed: 160, area: 1.8, knockback: 62, note: "+Damage, +Radius." },
      { damage: 32, cooldown: 0.27, count: 1, pierce: 999, speed: 172, area: 1.9, knockback: 66, note: "+Damage, faster." },
      { damage: 36, cooldown: 0.27, count: 1, pierce: 999, speed: 184, area: 2.0, knockback: 70, note: "+Radius." },
      { damage: 44, cooldown: 0.24, count: 1, pierce: 999, speed: 200, area: 2.2, knockback: 78, note: "Zenith: a captive sun." },
    ],
  },

  tempestCoil: {
    id: "tempestCoil",
    name: "Tempest Coil",
    description: "Arc Coil unleashed — a forking tempest that chains far and wide.",
    pattern: "chain",
    style: "arc",
    hue: 175,
    maxLevel: 5,
    evolved: true,
    levels: [
      { damage: 30, cooldown: 0.5, count: 10, pierce: 0, speed: 300, area: 1.3, knockback: 70, note: "Evolved: a chaining tempest." },
      { damage: 36, cooldown: 0.47, count: 11, pierce: 0, speed: 315, area: 1.35, knockback: 74, note: "+Damage, +1 target." },
      { damage: 42, cooldown: 0.44, count: 12, pierce: 0, speed: 330, area: 1.4, knockback: 78, note: "+1 target." },
      { damage: 48, cooldown: 0.41, count: 14, pierce: 0, speed: 350, area: 1.45, knockback: 84, note: "+2 targets." },
      { damage: 58, cooldown: 0.37, count: 16, pierce: 0, speed: 380, area: 1.55, knockback: 92, note: "Zenith: a boundless storm." },
    ],
  },

  hornetCloud: {
    id: "hornetCloud",
    name: "Hornet Cloud",
    description: "Seeker Swarm multiplied into a relentless cloud of stingers.",
    pattern: "nearest",
    style: "spark",
    hue: 90,
    maxLevel: 5,
    evolved: true,
    levels: [
      { damage: 22, cooldown: 0.3, count: 10, pierce: 3, speed: 680, area: 1.1, knockback: 70, note: "Evolved: a swarm that never relents." },
      { damage: 26, cooldown: 0.28, count: 11, pierce: 3, speed: 700, area: 1.15, knockback: 74, note: "+1 stinger, +Damage." },
      { damage: 30, cooldown: 0.26, count: 12, pierce: 4, speed: 720, area: 1.2, knockback: 78, note: "+1 stinger, +Pierce." },
      { damage: 34, cooldown: 0.24, count: 14, pierce: 4, speed: 745, area: 1.25, knockback: 84, note: "+2 stingers." },
      { damage: 41, cooldown: 0.21, count: 16, pierce: 5, speed: 780, area: 1.35, knockback: 92, note: "Zenith: a devouring swarm." },
    ],
  },

  sawstorm: {
    id: "sawstorm",
    name: "Sawstorm",
    description: "Glaive Ring overdriven into a storm of orbiting sawblades.",
    pattern: "orbit",
    style: "saw",
    hue: 25,
    maxLevel: 5,
    evolved: true,
    levels: [
      { damage: 56, cooldown: 0, count: 5, pierce: 999, speed: 116, area: 1.7, knockback: 220, note: "Evolved: five whirling sawblades." },
      { damage: 64, cooldown: 0, count: 5, pierce: 999, speed: 124, area: 1.8, knockback: 230, note: "+Damage." },
      { damage: 72, cooldown: 0, count: 6, pierce: 999, speed: 132, area: 1.9, knockback: 240, note: "+1 blade." },
      { damage: 80, cooldown: 0, count: 7, pierce: 999, speed: 142, area: 2.0, knockback: 252, note: "+1 blade, +Radius." },
      { damage: 96, cooldown: 0, count: 8, pierce: 999, speed: 156, area: 2.2, knockback: 270, note: "Zenith: an unbroken wall of steel." },
    ],
  },

  permafrost: {
    id: "permafrost",
    name: "Permafrost",
    description: "Frost Fan deepened into a sweeping glacier of cutting ice.",
    pattern: "spread",
    style: "hex",
    hue: 205,
    maxLevel: 5,
    evolved: true,
    levels: [
      { damage: 34, cooldown: 0.6, count: 9, pierce: 6, speed: 540, area: 1.4, knockback: 110, note: "Evolved: a piercing glacier wall." },
      { damage: 40, cooldown: 0.56, count: 10, pierce: 6, speed: 555, area: 1.45, knockback: 116, note: "+1 shard, +Damage." },
      { damage: 46, cooldown: 0.52, count: 11, pierce: 7, speed: 570, area: 1.5, knockback: 122, note: "+1 shard, +Pierce." },
      { damage: 52, cooldown: 0.48, count: 13, pierce: 7, speed: 590, area: 1.6, knockback: 130, note: "+2 shards." },
      { damage: 62, cooldown: 0.43, count: 15, pierce: 8, speed: 620, area: 1.7, knockback: 140, note: "Zenith: an advancing ice age." },
    ],
  },
};

export const WEAPON_LIST: WeaponDef[] = Object.values(WEAPON_DEFS);

/** Base weapons offered as fresh draft picks (excludes evolved forms). */
export const DRAFTABLE_WEAPONS: WeaponDef[] = WEAPON_LIST.filter((w) => !w.evolved);

export function getStarterWeapon(): WeaponDef {
  return WEAPON_LIST.find((w) => w.starter) ?? WEAPON_DEFS.lumenBolt;
}
