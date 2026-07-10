/**
 * The Vanguard — VANGUARD's single playable vessel, a lone Warden-class
 * light-fighter holding the line in the AFTERLIGHT universe. Idle games in
 * this vein usually gate a full roster behind gacha pulls; we skip that
 * entirely (no microtransactions, no gacha) and instead give the one hero
 * real depth: levels, a full gear loadout, and a shop tree.
 */
export interface HeroBaseStats {
  hp: number;
  atk: number;
  def: number;
  critChance: number;
  critMulti: number;
  attacksPerSecond: number;
}

export const HERO_NAME = "the Vanguard";

export const HERO_BASE: HeroBaseStats = {
  hp: 60,
  atk: 6,
  def: 2,
  critChance: 0.05,
  critMulti: 1.5,
  attacksPerSecond: 1,
};

/** Multiplicative per-level growth (level 1 == base, compounding above it). */
const HP_GROWTH_PER_LEVEL = 1.085;
const ATK_GROWTH_PER_LEVEL = 1.07;
/** Defense grows flat rather than compounding — mitigation has diminishing
 * returns on its own (100/(100+def)), so a flat trickle keeps it meaningful. */
const DEF_PER_LEVEL = 0.6;

export const XP_BASE = 18;
export const XP_GROWTH = 1.115;

/** Base (pre-upgrade, pre-gear, pre-prestige) stats for a given hero level. */
export function statsAtLevel(level: number): HeroBaseStats {
  const l = Math.max(1, Math.floor(level));
  return {
    hp: HERO_BASE.hp * Math.pow(HP_GROWTH_PER_LEVEL, l - 1),
    atk: HERO_BASE.atk * Math.pow(ATK_GROWTH_PER_LEVEL, l - 1),
    def: HERO_BASE.def + DEF_PER_LEVEL * (l - 1),
    critChance: HERO_BASE.critChance,
    critMulti: HERO_BASE.critMulti,
    attacksPerSecond: HERO_BASE.attacksPerSecond,
  };
}

/** Essence (XP) required to advance from `level` to `level + 1`. */
export function xpToNextLevel(level: number): number {
  return Math.round(XP_BASE * Math.pow(XP_GROWTH, Math.max(1, level) - 1));
}
