import type { SpatialEntity } from "../../core/SpatialHashGrid";

/** Behaviour archetypes that drive enemy movement AI. */
export type EnemyBehaviour = "chase" | "charger" | "orbiter" | "shooter";

/**
 * A unit of the Hollow. Pooled — never construct in the hot loop; obtain from
 * the World's enemy pool and `spawn()` it. Definitions live in the Enemy
 * Catalogue; this is the runtime instance.
 */
export class Enemy implements SpatialEntity {
  x = 0;
  y = 0;
  vx = 0;
  vy = 0;
  /** Position at the previous sim tick — the renderer interpolates. */
  prevX = 0;
  prevY = 0;
  radius = 14;
  active = false;

  /** Catalogue id, used for rendering style + stats lookups. */
  typeId = "drifter";
  behaviour: EnemyBehaviour = "chase";

  hp = 10;
  maxHp = 10;
  speed = 60;
  damage = 8;
  /** XP awarded on death. */
  xpValue = 1;
  /** Contact damage cooldown so a touching enemy doesn't drain HP every frame. */
  contactCooldown = 0;

  isElite = false;
  isBoss = false;

  // Visuals
  hue = 280;
  hitFlash = 0;
  /** Squash-and-stretch pop on being hit; eases back to 1 (see World). */
  hitScale = 1;
  /** Seconds since this enemy spawned — drives the scale-in "birth" animation. */
  age = 0;
  /** Knockback velocity decays separately from steering velocity. */
  knockX = 0;
  knockY = 0;
  /** Phase offset so same-type enemies don't animate in lockstep. */
  animPhase = 0;

  /** Per-behaviour scratch state (e.g. charger wind-up timer). */
  stateTimer = 0;
  attackCooldown = 0;

  /** Elite affix id (see data/affixDefs), or null for a plain enemy. */
  affix: string | null = null;
  /** Cooldown clock for affix behaviours (Summoner reinforcements). */
  affixTimer = 0;

  reset(): void {
    this.active = false;
    this.hitFlash = 0;
    this.hitScale = 1;
    this.age = 0;
    this.knockX = 0;
    this.knockY = 0;
    this.contactCooldown = 0;
    this.isElite = false;
    this.isBoss = false;
    this.stateTimer = 0;
    this.attackCooldown = 0;
    this.affix = null;
    this.affixTimer = 0;
  }
}
