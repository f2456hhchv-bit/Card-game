/**
 * The Warden — the player character. Channels the last light against the
 * Hollow. Stats here are the *base* values; run-time modifiers from upgrades
 * and passives are applied through the derived `stats` block each frame.
 */
export interface DerivedStats {
  maxHp: number;
  moveSpeed: number;
  /** Multiplier applied to all weapon damage. 1 = base. */
  damageMult: number;
  /** Multiplier on weapon fire rate (higher = faster). */
  attackSpeedMult: number;
  /** Multiplier on projectile/effect area. */
  areaMult: number;
  /** Multiplier on projectile speed. */
  projectileSpeedMult: number;
  /** Additional projectiles for weapons that support it. */
  extraProjectiles: number;
  /** Pickup radius for XP shards, in world units. */
  pickupRadius: number;
  /** Flat HP regenerated per second. */
  regen: number;
  /** XP gain multiplier. */
  xpMult: number;
  /** Multiplier on the player's effective light radius (vision). */
  lightMult: number;
  /** Damage reduction 0..0.9 (armor). */
  armor: number;
  /** Crit chance 0..1 and crit damage multiplier. */
  critChance: number;
  critMult: number;
  /** Invulnerability window (seconds) after taking a hit. */
  iframes: number;
  /** One-time revive charges (Plating "Aegis" perk). */
  revive: number;
  /** Reactor "Overdrive" perk: damage of the periodic light pulse (0 = off). */
  pulseDamage: number;
}

export class Player {
  x = 0;
  y = 0;
  radius = 16;
  facing = 0; // radians, last movement / aim direction
  /** Position at the previous sim tick — the renderer interpolates. */
  prevX = 0;
  prevY = 0;

  hp = 100;
  level = 1;
  xp = 0;
  xpToNext = 5;

  /** Invulnerability timer after taking a hit (seconds). */
  invuln = 0;

  /** Visual hit-flash timer. */
  hitFlash = 0;

  // Base stats — the floor before upgrades. Tuned in BalancingNotes.md.
  base: DerivedStats = {
    maxHp: 100,
    moveSpeed: 175,
    damageMult: 1,
    attackSpeedMult: 1,
    areaMult: 1,
    projectileSpeedMult: 1,
    extraProjectiles: 0,
    pickupRadius: 80,
    regen: 0,
    xpMult: 1,
    lightMult: 1,
    armor: 0,
    critChance: 0.05,
    critMult: 1.5,
    iframes: 0.5,
    revive: 0,
    pulseDamage: 0,
  };

  /** Live derived stats, recomputed when upgrades change. */
  stats: DerivedStats = { ...this.base };

  reset(): void {
    this.x = 0;
    this.y = 0;
    this.facing = 0;
    this.level = 1;
    this.xp = 0;
    this.xpToNext = 5;
    this.invuln = 0;
    this.hitFlash = 0;
    this.stats = { ...this.base };
    this.hp = this.stats.maxHp;
  }
}
