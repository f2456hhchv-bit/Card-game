/**
 * Shared data-catalog types for Afterlight Lite. These describe *content*
 * (ships, enemies, upgrades) as plain data so gameplay systems stay generic
 * and new content can be added without touching engine code.
 */

export type BiomeId =
  | "asteroidBelt"
  | "nebulaDrift"
  | "iceField"
  | "volcanicMoon"
  | "derelictStation"
  | "voidRift";

/**
 * MVP visuals are drawn from primitives (no image assets yet). Once real art
 * (per the game's style guide) is supplied, ArtManifest.ts maps a def id to
 * an image and the renderer prefers that over this shape — no gameplay code
 * changes needed.
 */
export interface PlaceholderShape {
  kind: "polygon" | "circle" | "star" | "triangle" | "diamond";
  sides?: number; // for "polygon" / "star"
  radius: number; // base radius in world units
  colorPrimary: string;
  colorSecondary: string;
  glowColor?: string;
}

/** Additive stat modifiers. Every upgrade/attachment tier contributes a bag of
 * these; systems sum all active bags each time the loadout changes. Flags
 * like `chainLightningChance` are read directly by the systems that
 * implement that behavior (WeaponSystem, CombatSystem). */
export interface StatModifiers {
  maxHpAdd?: number;
  maxHpMult?: number;
  moveSpeedMult?: number;
  damageMult?: number;
  fireRateMult?: number;
  projectileSpeedMult?: number;
  projectileCountAdd?: number;
  pierceAdd?: number;
  critChanceAdd?: number;
  critDamageMult?: number;
  regenPerSec?: number;
  magnetRadiusAdd?: number;
  xpGainMult?: number;
  armorFlat?: number;
  lifestealPct?: number;
  explosiveOnHitChance?: number;
  explosiveOnHitRadius?: number;
  explosiveOnHitDamageMult?: number;
  chainLightningChance?: number;
  chainLightningJumps?: number;
  chainLightningDamageMult?: number;
  orbitDroneCountAdd?: number;
  orbitDroneDamageMult?: number;
  shieldChargeMaxAdd?: number;
  shieldRegenTimeMult?: number;
  spreadShotCountAdd?: number;
  homingStrength?: number;
  motesRetainedPctAdd?: number;
}

export interface ShipDef {
  id: string;
  name: string;
  tagline: string;
  baseHp: number;
  baseMoveSpeed: number;
  baseDamageMult: number;
  baseFireRateMult: number;
  /** id of the UpgradeDef this ship starts with already at stack 1. */
  weaponId: string;
  passiveDescription: string;
  passive: StatModifiers;
  shape: PlaceholderShape;
}

export type BehaviorId =
  | "chase"
  | "chaseRanged"
  | "kamikaze"
  | "erraticChase"
  | "orbitRanged"
  | "dashCharge"
  | "shieldBurst"
  | "teleportStrike"
  | "auraPulse"
  | "lavaTrail"
  | "summon"
  | "stationaryTurret";

export interface BehaviorParams {
  preferredRange?: number;
  fireInterval?: number;
  projectileSpeed?: number;
  projectileDamage?: number;
  dashInterval?: number;
  dashSpeedMult?: number;
  dashTelegraph?: number;
  shieldInterval?: number;
  shieldDuration?: number;
  auraRadius?: number;
  auraInterval?: number;
  auraDamage?: number;
  auraTickTime?: number;
  explodeRadius?: number;
  explodeDamage?: number;
  summonInterval?: number;
  summonDefId?: string;
  summonCount?: number;
  teleportInterval?: number;
  jitter?: number;
  trailInterval?: number;
  trailDamage?: number;
  trailRadius?: number;
  spreadCount?: number;
}

export interface EnemyDef {
  id: string;
  name: string;
  biome: BiomeId;
  tier: "grunt" | "elite";
  hp: number;
  contactDamage: number;
  moveSpeed: number;
  xpValue: number;
  behavior: BehaviorId;
  behaviorParams: BehaviorParams;
  shape: PlaceholderShape;
  radius: number;
}

export interface BossPhase {
  /** Phase activates once boss hp fraction drops to/below this (1 = opening phase). */
  hpThreshold: number;
  behavior: BehaviorId;
  behaviorParams: BehaviorParams;
}

export interface BossDef {
  id: string;
  name: string;
  biome: BiomeId;
  hp: number;
  contactDamage: number;
  moveSpeed: number;
  xpValue: number;
  radius: number;
  shape: PlaceholderShape;
  phases: BossPhase[];
}

export type UpgradeCategory = "weapon" | "passive";

export type WeaponPattern =
  | "nearestBolt" // fires at the nearest enemy, straight shot
  | "chainBolt" // arc lightning: hits nearest, arcs to extra targets
  | "spread" // fixed-count spread cone, auto-aimed at nearest cluster
  | "homing" // seeker missiles that curve toward targets
  | "orbit" // orbiting drone(s) that damage on touch
  | "pulseAoe" // periodic AoE burst centred on the ship
  | "pierceLine" // long-range piercing line shot
  | "rearTurret" // fires at several nearest targets simultaneously
  | "meleeArc" // short-range arc sweep in the facing direction
  | "mine"; // drops a stationary mine that detonates on proximity

export interface WeaponBaseStats {
  damage: number;
  interval: number; // seconds between shots at stack 1
  projectileSpeed: number;
  count: number; // projectiles/targets per shot
  pierce: number;
  radius: number; // hit/explosion/orbit radius as relevant to the pattern
  pattern: WeaponPattern;
}

export interface UpgradeDef {
  id: string;
  name: string;
  category: UpgradeCategory;
  description: string;
  icon: PlaceholderShape;
  /** Weapon-category only: this upgrade fires its own auto-weapon. */
  weaponBase?: WeaponBaseStats;
  /** Weapon-category only: per-stack deltas (stacks 2-4) added on top of weaponBase. */
  weaponPerStack?: Partial<WeaponBaseStats>;
  /** Weapon-category only: extra jump applied at the 5th ("super") stack. */
  superWeaponDelta?: Partial<WeaponBaseStats>;
  /** Passive-category: global stat bag granted per stack, stacks 1-4.
   *  Weapon-category: usually empty; can carry a small global side-effect. */
  perStack: StatModifiers;
  /** Name/description/effect the upgrade becomes at its 5th stack ("super"). */
  superName: string;
  superDescription: string;
  superEffect: StatModifiers;
}

export type AttachmentSlot =
  | "weapon"
  | "shield"
  | "wings"
  | "thrusters"
  | "hull"
  | "cockpit";

export interface AttachmentTier {
  level: number;
  cost: number;
  effect: StatModifiers;
  description: string;
}

export interface AttachmentDef {
  slot: AttachmentSlot;
  name: string;
  description: string;
  tiers: AttachmentTier[];
}
