/**
 * A hostile projectile fired by the Hollow (ranged enemies and bosses). Kept
 * separate from the player's `Projectile` because it tests collision against the
 * Warden, not against enemies — different target, different pool, no shared hot
 * loop. Pooled like everything else.
 */
/**
 * Bullet silhouettes, in the game's shape language. Ranged fodder use the plain
 * "orb"; each boss fires a signature style so its volleys read as *its* attack.
 */
export type EnemyProjectileStyle =
  | "orb"
  | "shard"
  | "crystal"
  | "star"
  | "hex"
  | "bolt"
  | "ring"
  | "ember"
  | "spike";

export class EnemyProjectile {
  x = 0;
  y = 0;
  /** Position at the previous sim tick — the renderer interpolates. */
  prevX = 0;
  prevY = 0;
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
