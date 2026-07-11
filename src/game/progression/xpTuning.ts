/**
 * XP & level progression tuning surface (AF-022). Curve, tiers, collection,
 * and offer parameters are data (AF-011 §7); missions override per config.
 */
import type { EquipmentBonus } from "../equipment/equipmentData";
export type XpTier =
  | "small"
  | "medium"
  | "large"
  | "elite"
  | "boss"
  | "ancient"
  | "research";

export interface XpTuning {
  /** XP value per pickup tier. */
  tierValues: Readonly<Record<XpTier, number>>;
  /** Level curve: threshold(level) = base + linear·level + soft·level^knee. */
  curve: { base: number; linear: number; soft: number; knee: number };
  /**
   * Anti-grind guarantee: threshold(n+1)/threshold(n) never exceeds this.
   * Tested — late levels are slower, never walls.
   */
  maxThresholdGrowthRatio: number;
  /** Mission-configurable; null = infinite/endless scaling mode. */
  defaultLevelCap: number | null;
  /** Collection radii (world units) — build-modifiable at runtime. */
  basePickupRadius: number;
  baseMagnetRadius: number;
  magnetAccelerationPerSecond: number;
  magnetMaxSpeed: number;
  /** Pickup density cap: beyond this, oldest gems coalesce (value kept). */
  maxLivePickups: number;
  /** Offer size (default three; four/five unlock via future modifiers). */
  choicesPerLevel: number;
}

export const DEFAULT_XP_TUNING: XpTuning = {
  tierValues: {
    small: 1,
    medium: 3,
    large: 8,
    elite: 15,
    boss: 60,
    ancient: 25,
    research: 10,
  },
  curve: { base: 10, linear: 6, soft: 1.2, knee: 1.6 },
  maxThresholdGrowthRatio: 1.35,
  defaultLevelCap: null,
  basePickupRadius: 1.1,
  baseMagnetRadius: 4,
  magnetAccelerationPerSecond: 60,
  magnetMaxSpeed: 26,
  maxLivePickups: 200,
  choicesPerLevel: 3,
};

/** The twelve upgrade categories (AF-022) — the registry future content fills. */
export const UPGRADE_CATEGORIES = [
  "weaponUpgrade",
  "weaponEvolution",
  "commanderAbility",
  "passive",
  "movement",
  "shield",
  "critical",
  "statusEffect",
  "drone",
  "orbital",
  "resource",
  "specialEvent",
] as const;

export type UpgradeCategory = (typeof UPGRADE_CATEGORIES)[number];

export interface UpgradeDefinition {
  id: string;
  category: UpgradeCategory;
  name: string;
  description: string;
  /** Relative offer weight. */
  weight: number;
  /** Times it may be taken; null = unlimited. */
  maxStacks: number | null;
  /**
   * GP-004 §Content Engine: the generic effect the interpreter (applyUpgrade
   * in main.ts) applies on pick. Optional — legacy entries without it keep
   * their own hardcoded-by-id behaviour rather than being forced to migrate.
   * Reuses AF-028's EquipmentBonus/BonusKind vocabulary so any future
   * upgrade — including the standalone Passive roster — plugs in with zero
   * main.ts changes as long as it uses an already-registered BonusKind.
   *
   * GP-FINAL §Level Ups: additively widened to accept a readonly array —
   * "never offer boring percentage upgrades unless attached to meaningful
   * mechanics." A single-bonus entry (the pre-existing shape) is unchanged;
   * an array lets a plain stat bonus carry a second, mechanic-attached
   * bonus (statusChance/statusDuration/criticalDamage/boostEfficiency —
   * previously-registered BonusKinds with no consumer until this) so the
   * upgrade does something beyond a number, without redesigning the shape.
   */
  effect?: EquipmentBonus | readonly EquipmentBonus[];
}
