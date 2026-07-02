import type { SpatialEntity } from "../../core/SpatialHashGrid";

export type PickupKind = "xp" | "heal" | "magnet" | "bomb" | "mote" | "pod";

/**
 * Collectible dropped by enemies. XP shards are by far the most common, so the
 * type is pooled and the kind discriminated by a field rather than subclasses.
 */
export class Pickup implements SpatialEntity {
  x = 0;
  y = 0;
  /** Position at the previous sim tick — the renderer interpolates. */
  prevX = 0;
  prevY = 0;
  radius = 8;
  active = false;

  kind: PickupKind = "xp";
  /** XP value (for xp kind) or heal amount (for heal kind). */
  value = 1;

  /** Once the player's pickup radius catches it, it homes in. */
  homing = false;
  vx = 0;
  vy = 0;

  /** Bob animation phase. */
  bob = 0;

  /** Seconds until despawn (-1 = never). Supply Pods are on the clock. */
  life = -1;

  reset(): void {
    this.active = false;
    this.homing = false;
    this.vx = 0;
    this.vy = 0;
    this.life = -1;
  }
}
