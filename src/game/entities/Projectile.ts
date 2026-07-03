import type { SpatialEntity } from "../../core/SpatialHashGrid";

/**
 * Visual style of a projectile, drives rendering. Each reads as a distinct
 * shape so weapons in the same firing family don't look identical:
 *  bolt   — an energy capsule streak (oriented to travel)
 *  dart   — a small sharp arrowhead (swarm shots)
 *  lance  — a long thin piercing spear
 *  spark  — a tiny buzzing fizz-dot
 *  orb    — a round glowing sphere
 *  shard  — a spinning diamond
 *  crystal— an icy elongated crystal with a cold rim
 *  hex    — a frosted hexagon
 *  star   — a 4-point twinkle
 *  arc    — a jagged energy bolt
 *  beam   — (reserved) a bright lance
 */
export type ProjectileStyle =
  | "bolt"
  | "dart"
  | "lance"
  | "spark"
  | "orb"
  | "shard"
  | "crystal"
  | "hex"
  | "star"
  | "arc"
  | "glaive"
  | "saw"
  | "beam";

/**
 * A light projectile fired by a weapon. Pooled. Carries enough state to be
 * fully self-updating so the projectile system stays a simple loop.
 */
export class Projectile implements SpatialEntity {
  x = 0;
  y = 0;
  /** Position at the previous sim tick — the renderer interpolates. */
  prevX = 0;
  prevY = 0;
  vx = 0;
  vy = 0;
  radius = 6;
  active = false;

  damage = 5;
  /** Remaining lifetime in seconds. */
  life = 2;
  /** How many enemies it can still hit before expiring (pierce). */
  pierce = 1;
  /** Knockback impulse applied to hit enemies. */
  knockback = 80;
  style: ProjectileStyle = "bolt";
  hue = 210;
  /** Whether this was a critical hit (affects visuals + damage already baked). */
  crit = false;
  /** Source weapon id, so a projectile only hits each enemy once. */
  weaponSeq = 0;
  /** Spin for visual flair. */
  rotation = 0;
  rotationSpeed = 0;
  /** Fired by an evolved weapon — gets a brighter, larger signature look. */
  evolved = false;

  reset(): void {
    this.active = false;
    this.crit = false;
    this.rotation = 0;
    this.evolved = false;
  }
}
