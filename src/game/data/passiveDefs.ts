import type { DerivedStats } from "../entities/Player";

/**
 * Passive items (relics of the old light). Each level applies an additive or
 * multiplicative modifier to the Warden's derived stats. They share the
 * level-up draft pool with weapons.
 */
export interface PassiveDef {
  id: string;
  name: string;
  description: string;
  hue: number;
  maxLevel: number;
  /** Apply this passive at the given level (1-based) onto the stats block. */
  apply: (stats: DerivedStats, level: number) => void;
  /** Short per-level effect text for the draft UI. */
  levelNote: (level: number) => string;
}

export const PASSIVE_DEFS: Record<string, PassiveDef> = {
  vitalCore: {
    id: "vitalCore",
    name: "Vital Core",
    description: "Increases maximum vitality.",
    hue: 140,
    maxLevel: 5,
    apply: (s, lvl) => {
      s.maxHp += 20 * lvl;
    },
    levelNote: (lvl) => `Max HP +${20 * lvl}`,
  },
  swiftBoots: {
    id: "swiftBoots",
    name: "Swift Stride",
    description: "Increases movement speed.",
    hue: 90,
    maxLevel: 5,
    apply: (s, lvl) => {
      s.moveSpeed *= 1 + 0.08 * lvl;
    },
    levelNote: (lvl) => `Move speed +${8 * lvl}%`,
  },
  focusLens: {
    id: "focusLens",
    name: "Focusing Lens",
    description: "Amplifies all damage dealt.",
    hue: 10,
    maxLevel: 5,
    apply: (s, lvl) => {
      s.damageMult *= 1 + 0.1 * lvl;
    },
    levelNote: (lvl) => `Damage +${10 * lvl}%`,
  },
  rapidCharm: {
    id: "rapidCharm",
    name: "Quickening Charm",
    description: "Weapons activate faster.",
    hue: 50,
    maxLevel: 5,
    apply: (s, lvl) => {
      s.attackSpeedMult *= 1 + 0.08 * lvl;
    },
    levelNote: (lvl) => `Attack speed +${8 * lvl}%`,
  },
  resonator: {
    id: "resonator",
    name: "Resonator",
    description: "Enlarges weapon area and effects.",
    hue: 280,
    maxLevel: 5,
    apply: (s, lvl) => {
      s.areaMult *= 1 + 0.1 * lvl;
    },
    levelNote: (lvl) => `Area +${10 * lvl}%`,
  },
  lodestone: {
    id: "lodestone",
    name: "Lodestone",
    description: "Widens the pull of light shards.",
    hue: 200,
    maxLevel: 5,
    apply: (s, lvl) => {
      s.pickupRadius += 28 * lvl;
    },
    levelNote: (lvl) => `Pickup radius +${28 * lvl}`,
  },
  emberHeart: {
    id: "emberHeart",
    name: "Ember Heart",
    description: "Slowly regenerates vitality.",
    hue: 20,
    maxLevel: 5,
    apply: (s, lvl) => {
      s.regen += 0.6 * lvl;
    },
    levelNote: (lvl) => `Regen +${(0.6 * lvl).toFixed(1)}/s`,
  },
  wardPlate: {
    id: "wardPlate",
    name: "Ward Plate",
    description: "Reduces incoming damage.",
    hue: 210,
    maxLevel: 5,
    apply: (s, lvl) => {
      // Diminishing additive armor, capped by stat clamp later.
      s.armor += 0.05 * lvl;
    },
    levelNote: (lvl) => `Armor +${5 * lvl}%`,
  },
  keenEdge: {
    id: "keenEdge",
    name: "Keen Edge",
    description: "Improves critical strike chance and force.",
    hue: 340,
    maxLevel: 5,
    apply: (s, lvl) => {
      s.critChance += 0.04 * lvl;
      s.critMult += 0.1 * lvl;
    },
    levelNote: (lvl) => `Crit +${4 * lvl}% / Crit dmg +${10 * lvl}%`,
  },
  scholarsMark: {
    id: "scholarsMark",
    name: "Scholar's Mark",
    description: "Increases experience gained.",
    hue: 170,
    maxLevel: 5,
    apply: (s, lvl) => {
      s.xpMult *= 1 + 0.12 * lvl;
    },
    levelNote: (lvl) => `XP gain +${12 * lvl}%`,
  },
  tidalCharm: {
    id: "tidalCharm",
    name: "Tidal Charm",
    description: "Quickens the flight of projectiles.",
    hue: 195,
    maxLevel: 5,
    apply: (s, lvl) => {
      s.projectileSpeedMult *= 1 + 0.12 * lvl;
    },
    levelNote: (lvl) => `Projectile speed +${12 * lvl}%`,
  },
  echoStone: {
    id: "echoStone",
    name: "Echo Stone",
    description: "Echoes an extra projectile from every volley.",
    hue: 265,
    maxLevel: 2,
    apply: (s, lvl) => {
      // Build-defining: adds projectiles to every projectile weapon. Capped low.
      s.extraProjectiles += lvl;
    },
    levelNote: (lvl) => `+${lvl} projectile${lvl > 1 ? "s" : ""}`,
  },
  phaseCloak: {
    id: "phaseCloak",
    name: "Phase Cloak",
    description: "Lengthens the invulnerability after a hit — dodge through danger.",
    hue: 190,
    maxLevel: 5,
    apply: (s, lvl) => {
      s.iframes += 0.08 * lvl;
    },
    levelNote: (lvl) => `Invulnerability +${(0.08 * lvl).toFixed(2)}s`,
  },
  glassCannon: {
    id: "glassCannon",
    name: "Glass Cannon",
    description: "Overwhelming firepower — at the cost of your own vitality.",
    hue: 355,
    maxLevel: 5,
    apply: (s, lvl) => {
      s.damageMult *= 1 + 0.14 * lvl;
      s.maxHp -= 8 * lvl;
    },
    levelNote: (lvl) => `Damage +${14 * lvl}% · Max HP −${8 * lvl}`,
  },
  executioner: {
    id: "executioner",
    name: "Executioner",
    description: "Turns critical strikes into devastating blows.",
    hue: 350,
    maxLevel: 4,
    apply: (s, lvl) => {
      s.critMult += 0.25 * lvl;
    },
    levelNote: (lvl) => `Crit damage +${25 * lvl}%`,
  },
};

export const PASSIVE_LIST: PassiveDef[] = Object.values(PASSIVE_DEFS);
