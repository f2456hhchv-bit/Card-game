/**
 * A hostile projectile fired by the Hollow (ranged enemies and bosses). Kept
 * separate from the player's `Projectile` because it tests collision against the
 * Warden, not against enemies — different target, different pool, no shared hot
 * loop. Pooled like everything else.
 */
export type EnemyProjectileStyle = "orb" | "spike";

export class EnemyProjectile {
  x = 0;
  y = 0;
  vx = 0;
  vy = 0;
  radius = 8;
  damage = 10;
  /** Remaining lifetime in seconds. */
  life = 4;
  hue = 320;
  style: EnemyProjectileStyle = "orb";
  rotation = 0;
  active = false;

  reset(): void {
    this.active = false;
    this.rotation = 0;
  }
}
